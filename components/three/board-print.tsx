'use client'

/**
 * BoardPrint: a desktop PCB mill makes the page's circuit board.
 *
 *   blank     the bare board rises onto the mill's bed, holes and pads on it
 *   traces    the spindle comes down and engraves every copper route, its
 *             V-bit on the surface the whole time, hopping between routes
 *   parts     the spindle lifts and the components settle into place
 *   hand-off  the machine fades away and the camera glides to straight down,
 *             landing the board exactly on the SVG board underneath
 *
 * Camera: a perspective hero shot of the whole machine, centred, with a slow
 * drift and push-in. The glide then dolly-zooms to a 1.2 degree field of
 * view, which is orthographic in all but name, so the board's top plane
 * maps one world unit to one CSS pixel. Every pose is a pure function of
 * one clock: nothing follows the tool, nothing can jitter. Per-frame work
 * mutates refs and materials; React state is never touched in the loop.
 */

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import {
  BOARD,
  MOUNTS,
  PARTS,
  PASSIVES,
  TEST_POINTS,
  TRACES,
  VIAS,
  WIDE_MIN,
  passiveRects,
  pinRects,
  traceFor,
  type BoardPart,
  type Pt,
} from '@/config/board'
import {
  MILL,
  PRINT_CAMERA,
  PRINT_MATERIALS,
  PRINT_SIZES,
  PRINT_TIMELINE,
  type PrintMaterialKey,
} from '@/config/print-config'

export type PrintLayout = {
  vw: number
  vh: number
  /** Where the artboard sits on screen (from fitBoard). */
  fit: { scale: number; x: number; y: number }
}

type V3 = [number, number, number]

/* --------------------------------------------------------------- easing */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const window01 = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a))
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpLog = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t))
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const DEG = Math.PI / 180

/* ----------------------------------------------------------- the plan */

type Seg = {
  a: [number, number]
  b: [number, number]
  len: number
  width: number
  live: boolean
  trace: number
  /** Progress 0..1 written by the timeline. */
  p: number
}

type Move = { t0: number; t1: number; from: V3; to: V3; ease?: boolean; seg?: number }

function buildPlan(layout: PrintLayout) {
  const { fit, vw, vh } = layout
  const s = fit.scale
  const ts = Math.min(1.1, Math.max(0.55, s)) // the machine scales with the board
  const W = (p: Pt): [number, number] => [fit.x + p[0] * s, fit.y + p[1] * s]
  const T = PRINT_SIZES.boardThickness
  const cut = T + PRINT_SIZES.traceHeight // the bit's tip rests on fresh copper
  const hop = cut + PRINT_SIZES.travelHop
  const wide = vw >= WIDE_MIN

  const board = { x: fit.x, z: fit.y, w: BOARD.w * s, d: BOARD.h * s }

  /* the machine around the board */
  const margin = 40 * s
  const bed = {
    x0: board.x - margin,
    x1: board.x + board.w + margin,
    z0: board.z - margin,
    z1: board.z + board.d + margin,
  }
  const railW = 30 * s
  const railX = [bed.x0 - railW / 2 - 8 * s, bed.x1 + railW / 2 + 8 * s] as const
  const railH = 40 * ts
  const beamY = T + 196 * ts
  const machine = { bed, railW, railX, railH, beamY, ground: -12 }

  /* copper */
  const clipToBoard = (p: Pt): Pt => [Math.max(0, p[0]), Math.min(BOARD.h, p[1])]
  const segs: Seg[] = []
  TRACES.forEach((tr, ti) => {
    if (!traceFor(tr, wide)) return
    const pts = tr.pts.map(clipToBoard)
    for (let i = 1; i < pts.length; i++) {
      const a = W(pts[i - 1])
      const b = W(pts[i])
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      if (len < 0.5) continue
      segs.push({ a, b, len, width: tr.width * s, live: tr.to === 'u1', trace: ti, p: 0 })
    }
  })

  /* the tool path: down onto the first route, engrave, hop, engrave … lift */
  const moves: Move[] = []
  const first: V3 = [segs[0].a[0], cut, segs[0].a[1]]
  const above: V3 = [first[0], cut + PRINT_SIZES.park, first[2]]
  moves.push({ t0: PRINT_TIMELINE.descend[0], t1: PRINT_TIMELINE.descend[1], from: above, to: first, ease: true })

  const [tA, tB] = PRINT_TIMELINE.traces
  const travelFactor = 2.4
  let depositLen = 0
  let travelLen = 0
  segs.forEach((sg, i) => {
    const prev = segs[i - 1]
    if (prev && prev.trace !== sg.trace) travelLen += Math.hypot(sg.a[0] - prev.b[0], sg.a[1] - prev.b[1])
    depositLen += sg.len
  })
  const speed = (depositLen + travelLen / travelFactor) / (tB - tA)
  let t = tA
  segs.forEach((sg, i) => {
    const prev = segs[i - 1]
    if (prev && prev.trace !== sg.trace) {
      // lift, travel, plunge: one eased hop between routes
      const d = Math.hypot(sg.a[0] - prev.b[0], sg.a[1] - prev.b[1])
      const dt = d / travelFactor / speed
      const third = dt / 3
      const up: V3 = [prev.b[0], hop, prev.b[1]]
      const over: V3 = [sg.a[0], hop, sg.a[1]]
      moves.push({ t0: t, t1: t + third, from: [prev.b[0], cut, prev.b[1]], to: up, ease: true })
      moves.push({ t0: t + third, t1: t + 2 * third, from: up, to: over, ease: true })
      moves.push({ t0: t + 2 * third, t1: t + dt, from: over, to: [sg.a[0], cut, sg.a[1]], ease: true })
      t += dt
    }
    const dt = sg.len / speed
    moves.push({ t0: t, t1: t + dt, from: [sg.a[0], cut, sg.a[1]], to: [sg.b[0], cut, sg.b[1]], seg: i })
    t += dt
  })
  const last = segs[segs.length - 1].b
  moves.push({
    t0: PRINT_TIMELINE.lift[0],
    t1: PRINT_TIMELINE.lift[1],
    from: [last[0], cut, last[1]],
    to: [last[0], cut + PRINT_SIZES.park, last[1]],
    ease: true,
  })

  /* parts settle into their footprints, staggered */
  const [pA, pB] = PRINT_TIMELINE.parts
  const step = (pB - pA) / (PARTS.length + 1.5)
  const parts = PARTS.map((p, i) => ({
    part: p,
    t0: pA + i * step,
    t1: pA + i * step + step * 2.5,
  }))

  /* camera: the hero frame fits the whole machine, centred on screen */
  const heroTarget: V3 = [board.x + board.w / 2, 60 * ts, board.z + board.d / 2]
  const box = {
    x: [railX[0] - railW, railX[1] + railW],
    y: [machine.ground, beamY + 34 * ts],
    z: [bed.z0 - 110 * ts, bed.z1 + 60 * s],
  }
  const corners: THREE.Vector3[] = []
  for (const x of box.x) for (const y of box.y) for (const z of box.z) corners.push(new THREE.Vector3(x, y, z))
  // the visible height that keeps every corner of the machine inside the frame,
  // measured through the real perspective camera at a given hero pose
  const fitHeight = (polar: number, az: number) => {
    const cam = new THREE.PerspectiveCamera(PRINT_CAMERA.heroFov, vw / vh, 1, 1e6)
    let H = vh
    for (let i = 0; i < 6; i++) {
      const dist = H / 2 / Math.tan((PRINT_CAMERA.heroFov * DEG) / 2)
      cam.position.set(
        heroTarget[0] + dist * Math.sin(polar) * Math.sin(az),
        heroTarget[1] + dist * Math.cos(polar),
        heroTarget[2] + dist * Math.sin(polar) * Math.cos(az),
      )
      cam.lookAt(heroTarget[0], heroTarget[1], heroTarget[2])
      cam.updateMatrixWorld()
      cam.updateProjectionMatrix()
      let reach = 0
      for (const c of corners) {
        const p = c.clone().project(cam)
        reach = Math.max(reach, Math.abs(p.x), Math.abs(p.y))
      }
      H *= reach / PRINT_CAMERA.fill
    }
    return H
  }
  // the opening frame shows the whole machine; the push-in then closes on the work
  const heroH = fitHeight(PRINT_CAMERA.heroPolar[0], PRINT_CAMERA.heroAzimuth[0])
  const endTarget: V3 = [vw / 2, T, vh / 2]

  return { board, machine, segs, moves, parts, above, heroH, heroTarget, endTarget, s, ts, wide }
}

/* ---------------------------------------------------------- materials */

function useMaterials() {
  return useMemo(() => {
    const make = (key: PrintMaterialKey) => {
      const m = PRINT_MATERIALS[key]
      const mat = new THREE.MeshStandardMaterial({
        color: m.lit,
        metalness: m.metal,
        roughness: m.rough,
      })
      return { mat, lit: new THREE.Color(m.lit), flat: new THREE.Color(m.flat) }
    }
    return {
      ground: make('ground'),
      board: make('board'),
      fr4: make('fr4'),
      copper: make('copper'),
      copperDim: make('copperDim'),
      chip: make('chip'),
      chipTop: make('chipTop'),
      shield: make('shield'),
      shieldTop: make('shieldTop'),
      header: make('header'),
      bga: make('bga'),
      bgaTop: make('bgaTop'),
      hole: make('hole'),
      resistor: make('resistor'),
      cap: make('cap'),
    }
  }, [])
}

type Mats = ReturnType<typeof useMaterials>

/* -------------------------------------------------------------- scene */

export function BoardPrint({
  layout,
  onProgress,
  onComplete,
}: {
  layout: PrintLayout
  onProgress: (p: number) => void
  onComplete: () => void
}) {
  const { camera } = useThree()
  const plan = useMemo(() => buildPlan(layout), [layout])
  const mats = useMaterials()

  const clock = useRef(0)
  const done = useRef(false)
  const lastReport = useRef(-1)

  const head = useRef<THREE.Group>(null)
  const bit = useRef<THREE.Group>(null)
  const gantry = useRef<THREE.Group>(null)
  const frame = useRef<THREE.Group>(null)
  const workLight = useRef<THREE.PointLight>(null)
  const lights = useRef<THREE.Group>(null)
  const lightBase = useRef<number[]>([])
  const machineMats = useRef<THREE.Material[]>([])
  const blank = useRef<THREE.Mesh>(null)
  const fixtures = useRef<THREE.Group>(null)
  const segRefs = useRef<(THREE.Mesh | null)[]>([])
  const jointRefs = useRef<(THREE.Mesh | null)[]>([])
  const partRefs = useRef<(THREE.Group | null)[]>([])

  useLayoutEffect(() => {
    // every material on the machine, so it can fade away before the hand-off
    const found = new Set<THREE.Material>()
    for (const g of [frame.current, gantry.current, head.current]) {
      g?.traverse((o) => {
        const m = (o as THREE.Mesh).material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => found.add(x))
      })
    }
    machineMats.current = [...found]
  }, [camera])

  const { board, machine, segs, parts, s, ts, wide } = plan
  const blankMats = useMemo(
    () => [mats.fr4.mat, mats.fr4.mat, mats.board.mat, mats.board.mat, mats.fr4.mat, mats.fr4.mat],
    [mats],
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)
    // dev only: pin the clock to inspect a frame (window.__printTime = 3.2)
    const pinned =
      process.env.NODE_ENV !== 'production'
        ? (window as unknown as { __printTime?: number }).__printTime
        : undefined
    if (typeof pinned === 'number') clock.current = pinned
    else clock.current += dt
    const t = clock.current
    const { moves, above, heroH, heroTarget, endTarget } = plan
    const T = PRINT_SIZES.boardThickness

    /* -- the blank rises onto the bed -- */
    if (blank.current) {
      const k = easeOutCubic(window01(t, PRINT_TIMELINE.blank))
      blank.current.scale.y = Math.max(0.001, k)
      blank.current.position.y = (T * k) / 2
    }
    if (fixtures.current) {
      const k = easeOutExpo(window01(t, PRINT_TIMELINE.fixtures))
      fixtures.current.visible = k > 0
      fixtures.current.scale.y = Math.max(0.001, k)
    }

    /* -- tool pose: the move whose window holds t, else hold the last pose -- */
    let pose: V3 = above
    for (const mv of moves) {
      if (t < mv.t0) break
      const raw = clamp01((t - mv.t0) / (mv.t1 - mv.t0))
      pose = lerp3(mv.from, mv.to, mv.ease ? easeInOutCubic(raw) : raw)
    }

    /* -- engraving: each segment grows behind the bit -- */
    let cutting = false
    for (const mv of moves) {
      if (mv.seg === undefined) continue
      const p = clamp01((t - mv.t0) / (mv.t1 - mv.t0))
      if (p > 0 && p < 1) cutting = true
      const sg = segs[mv.seg]
      if (p === sg.p) continue
      sg.p = p
      const mesh = segRefs.current[mv.seg]
      if (mesh) {
        mesh.visible = p > 0
        mesh.scale.x = Math.max(0.001, sg.len * p)
      }
      const joint = jointRefs.current[mv.seg]
      if (joint) joint.visible = p >= 1
    }

    /* -- parts settle into their footprints -- */
    parts.forEach((p, i) => {
      const grp = partRefs.current[i]
      if (!grp) return
      const k = easeOutCubic(window01(t, [p.t0, p.t1]))
      grp.visible = t >= p.t0
      grp.position.y = (1 - k) * 70
    })

    /* -- the machine: spindle on the gantry, gantry on the rails -- */
    if (head.current) head.current.position.set(pose[0], pose[1], pose[2])
    if (gantry.current) gantry.current.position.set(0, 0, pose[2])
    const running = t >= PRINT_TIMELINE.descend[0] && t <= PRINT_TIMELINE.lift[1]
    if (bit.current && running) bit.current.rotation.y += dt * MILL.spin * (cutting ? 1 : 0.6)

    // fade the whole machine away, leaving the board alone on the page
    const fade = easeInOutSine(window01(t, PRINT_TIMELINE.machineFade))
    for (const m of machineMats.current) {
      const needs = fade > 0
      if (m.transparent !== needs) {
        m.transparent = needs
        m.needsUpdate = true
      }
      m.opacity = 1 - fade
      m.depthWrite = fade < 0.5
    }
    const vis = fade < 0.999
    if (frame.current) frame.current.visible = vis
    if (gantry.current) gantry.current.visible = vis
    if (head.current) head.current.visible = vis

    /* -- camera: hero drift and push-in, then the glide to top-down -- */
    const cam = camera as THREE.PerspectiveCamera
    const h = easeInOutSine(window01(t, PRINT_TIMELINE.hero))
    const g = easeInOutSine(window01(t, PRINT_TIMELINE.glide))
    const [pol0, pol1] = PRINT_CAMERA.heroPolar
    const [az0, az1] = PRINT_CAMERA.heroAzimuth
    const polar = lerp(lerp(pol0, pol1, h), 0, g)
    const az = lerp(lerp(az0, az1, h), 0, g)
    const target = lerp3(heroTarget, endTarget, g)
    const heroFrame = heroH * lerp(1, PRINT_CAMERA.push, h)
    const visible = lerpLog(heroFrame, layout.vh, g) // world height in view at the target
    const fov = lerpLog(PRINT_CAMERA.heroFov, PRINT_CAMERA.endFov, g)
    const dist = visible / 2 / Math.tan((fov * DEG) / 2)
    cam.fov = fov
    // world-up for the hero shot (no roll), page-up for the landing
    cam.up.set(0, 1 - g, -g).normalize()
    cam.position.set(
      target[0] + dist * Math.sin(polar) * Math.sin(az),
      target[1] + dist * Math.cos(polar),
      target[2] + dist * Math.sin(polar) * Math.cos(az),
    )
    cam.lookAt(target[0], target[1], target[2])
    const span = Math.max(layout.vw, layout.vh)
    cam.near = Math.max(1, dist - span * 3)
    cam.far = dist + span * 4
    cam.updateProjectionMatrix()

    /* -- flatten to the page's exact colours -- */
    const f = easeInOutSine(window01(t, PRINT_TIMELINE.flatten))
    for (const { mat, lit, flat } of Object.values(mats)) {
      mat.color.copy(lit).multiplyScalar(1 - f)
      mat.emissive.copy(flat).multiplyScalar(f)
      mat.envMapIntensity = 1 - f
    }
    // lights go out with the flatten, so nothing but the flat colour remains
    if (lights.current) {
      const ls = lights.current.children.filter((c): c is THREE.Light => (c as THREE.Light).isLight)
      if (!lightBase.current.length) lightBase.current = ls.map((l) => l.intensity)
      ls.forEach((l, i) => (l.intensity = lightBase.current[i] * (1 - f)))
    }
    if (workLight.current) workLight.current.intensity = 2 * (1 - fade)

    /* -- report -- */
    const progress = clamp01(t / PRINT_TIMELINE.total)
    const pct = Math.floor(progress * 100)
    if (pct !== lastReport.current) {
      lastReport.current = pct
      onProgress(progress)
    }
    if (!done.current && t >= PRINT_TIMELINE.total) {
      done.current = true
      onComplete()
    }
  })

  const T = PRINT_SIZES.boardThickness
  const W = (p: Pt): [number, number] => [layout.fit.x + p[0] * s, layout.fit.y + p[1] * s]
  const span = Math.max(layout.vw, layout.vh)
  const centre: V3 = [board.x + board.w / 2, 0, board.z + board.d / 2]
  const { bed, railW, railX, railH, beamY, ground } = machine
  const bedW = bed.x1 - bed.x0
  const bedD = bed.z1 - bed.z0
  const railLen = bedD + 120 * s
  const uprightTop = beamY + 18 * ts

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 5, -9]} scale={[14, 4, 1]} />
        <Lightformer intensity={1.2} position={[-6, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={0.7} color="#ffd9a0" position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>

      {/* key spot pooling light on the bed, a cool rim behind, a warm fill low left */}
      <group ref={lights}>
        <ambientLight intensity={0.1} />
        <hemisphereLight args={['#e8efe9', '#0b0c0b', 0.16]} />
        <spotLight
          position={[centre[0] - span * 0.55, span * 1.5, centre[2] + span * 0.85]}
          angle={0.42}
          penumbra={0.85}
          decay={0}
          intensity={3.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-near={span * 0.6}
          shadow-camera-far={span * 4}
        >
          <object3D attach="target" position={centre} />
        </spotLight>
        <directionalLight position={[centre[0] + span, span * 0.6, centre[2] - span]} intensity={1.3} color="#cfdcff">
          <object3D attach="target" position={centre} />
        </directionalLight>
        <directionalLight position={[centre[0] - span, span * 0.25, centre[2] + span * 0.2]} intensity={0.35} color="#ffd6a3">
          <object3D attach="target" position={centre} />
        </directionalLight>
      </group>

      {/* the floor: the page ground */}
      <mesh rotation-x={-Math.PI / 2} position={[centre[0], ground, centre[2]]} receiveShadow material={mats.ground.mat}>
        <planeGeometry args={[span * 10, span * 10]} />
      </mesh>

      {/* the machine's fixed frame: bed with T-slots, and two side rails */}
      <group ref={frame}>
        <mesh position={[bed.x0 + bedW / 2, ground / 2, bed.z0 + bedD / 2]} receiveShadow castShadow>
          <boxGeometry args={[bedW, -ground, bedD]} />
          <meshStandardMaterial color={MILL.bed} metalness={0.75} roughness={0.42} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[bed.x0 + (bedW / 8) * (i + 1), 0.15, bed.z0 + bedD / 2]}>
            <boxGeometry args={[7 * s, 0.4, bedD]} />
            <meshStandardMaterial color={MILL.slot} metalness={0.3} roughness={0.8} />
          </mesh>
        ))}
        {railX.map((x) => (
          <group key={x} position={[x, 0, bed.z0 + bedD / 2]}>
            <mesh position={[0, ground + (railH - ground) / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[railW, railH - ground, railLen]} />
              <meshStandardMaterial color={MILL.frame} metalness={0.55} roughness={0.5} />
            </mesh>
            <mesh position={[0, railH + 2.5 * ts, 0]}>
              <boxGeometry args={[railW * 0.36, 5 * ts, railLen]} />
              <meshStandardMaterial color={MILL.steel} metalness={1} roughness={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      {/* the gantry: two uprights riding the rails, and the beam between them */}
      <group ref={gantry}>
        {railX.map((x, i) => (
          <group key={x}>
            <mesh position={[x, (railH + uprightTop) / 2, -71 * ts]} castShadow>
              <boxGeometry args={[railW, uprightTop - railH, 56 * ts]} />
              <meshStandardMaterial color={MILL.frame} metalness={0.55} roughness={0.5} />
            </mesh>
            {i === 1 && (
              // the emergency stop: the one red thing on the machine
              <mesh position={[x, uprightTop + 5 * ts, -71 * ts]}>
                <cylinderGeometry args={[9 * ts, 10 * ts, 10 * ts, 28]} />
                <meshStandardMaterial color={MILL.led} roughness={0.4} metalness={0.1} />
              </mesh>
            )}
          </group>
        ))}
        <mesh position={[(railX[0] + railX[1]) / 2, beamY, -71 * ts]} castShadow>
          <boxGeometry args={[railX[1] - railX[0] + railW, 34 * ts, 30 * ts]} />
          <meshStandardMaterial color={MILL.frame} metalness={0.6} roughness={0.45} />
        </mesh>
        {[-9, 9].map((y) => (
          <mesh key={y} position={[(railX[0] + railX[1]) / 2, beamY + y * ts, -55 * ts]}>
            <boxGeometry args={[railX[1] - railX[0] - railW, 5 * ts, 4 * ts]} />
            <meshStandardMaterial color={MILL.steel} metalness={1} roughness={0.22} />
          </mesh>
        ))}
      </group>

      {/* the spindle head, scaled with the board, pivoting on the tip of the bit */}
      <group ref={head}>
        <group scale={ts}>
          <SpindleHead bitRef={bit} />
        </group>
        <pointLight
          ref={workLight}
          color="#fff2dc"
          intensity={2}
          distance={240 * ts}
          decay={1.2}
          position={[0, 34 * ts, 36 * ts]}
        />
      </group>

      {/* the blank: solder mask on top, the FR4 edge on the sides */}
      <mesh
        ref={blank}
        position={[board.x + board.w / 2, 0, board.z + board.d / 2]}
        material={blankMats}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[board.w, T, board.d]} />
      </mesh>

      {/* drilled and plated: vias, mounting holes, test points, pads, edge fingers */}
      <group ref={fixtures} visible={false} position={[0, T, 0]}>
        {VIAS.map((v, i) => {
          const [x, z] = W(v)
          return <Hole key={`v${i}`} x={x} z={z} r={6.5 * s} hole={2.6 * s} mats={mats} />
        })}
        {MOUNTS.map((m, i) => {
          const [x, z] = W(m)
          return <Hole key={`m${i}`} x={x} z={z} r={10 * s} hole={5.5 * s} mats={mats} />
        })}
        {TEST_POINTS.map((p, i) => {
          const [x, z] = W(p)
          return (
            <mesh key={`t${i}`} position={[x, 1.2, z]} material={mats.copper.mat}>
              <cylinderGeometry args={[7 * s, 7 * s, 2.4, 24]} />
            </mesh>
          )
        })}
        {PASSIVES.map((p, i) => {
          const r = passiveRects(p)
          const box = (q: typeof r.body, h: number, mat: THREE.Material, key: string) => {
            const [x, z] = W([q.x, q.y])
            return <Box key={key} x={x} z={z} w={q.w * s} d={q.h * s} h={h} mat={mat} />
          }
          return (
            <group key={`p${i}`}>
              {box(r.padA, PRINT_SIZES.padHeight, mats.copper.mat, 'a')}
              {box(r.padB, PRINT_SIZES.padHeight, mats.copper.mat, 'b')}
              {box(r.body, 6, p.kind === 'c' ? mats.cap.mat : mats.resistor.mat, 'c')}
            </group>
          )
        })}
        {TRACES.filter((t) => t.to === 'u1' && t.only && traceFor(t, wide)).map((t, i) => {
          const [ax, ay] = t.pts[0]
          const bottom = ay >= BOARD.h
          // finger rect in artboard units, matching the SVG
          const fx = bottom ? ax - 7 : 0
          const fy = bottom ? BOARD.h - 26 : ay - 7
          const fw = bottom ? 14 : 26
          const fh = bottom ? 26 : 14
          const [x, z] = W([fx, fy])
          return (
            <mesh
              key={`f${i}`}
              position={[x + (fw * s) / 2, PRINT_SIZES.padHeight / 2, z + (fh * s) / 2]}
              material={mats.copper.mat}
            >
              <boxGeometry args={[fw * s, PRINT_SIZES.padHeight, fh * s]} />
            </mesh>
          )
        })}
      </group>

      {/* copper, engraved along each segment */}
      <group position={[0, T, 0]}>
        {segs.map((sg, i) => {
          const angle = -Math.atan2(sg.b[1] - sg.a[1], sg.b[0] - sg.a[0])
          const mat = sg.live ? mats.copper.mat : mats.copperDim.mat
          return (
            <group key={i}>
              <group position={[sg.a[0], PRINT_SIZES.traceHeight / 2, sg.a[1]]} rotation-y={angle}>
                <mesh
                  ref={(m) => {
                    segRefs.current[i] = m
                  }}
                  visible={false}
                  material={mat}
                  castShadow
                  receiveShadow
                >
                  <UnitTrace width={sg.width} />
                </mesh>
              </group>
              {/* round joint at each bend, so corners stay smooth */}
              <mesh
                ref={(m) => {
                  jointRefs.current[i] = m
                }}
                visible={false}
                position={[sg.b[0], PRINT_SIZES.traceHeight / 2, sg.b[1]]}
                material={mat}
              >
                <cylinderGeometry args={[sg.width / 2, sg.width / 2, PRINT_SIZES.traceHeight, 16]} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* components */}
      <group position={[0, T, 0]}>
        {parts.map((p, i) => (
          <group
            key={p.part.id}
            ref={(g) => {
              partRefs.current[i] = g
            }}
            visible={false}
          >
            <PartBody part={p.part} s={s} W={W} mats={mats} />
          </group>
        ))}
      </group>
    </>
  )
}

/* ------------------------------------------------------------- pieces */

/** A trace segment that spans x in [0, 1], scaled to its engraved length. */
function UnitTrace({ width }: { width: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(1, PRINT_SIZES.traceHeight, width)
    g.translate(0.5, 0, 0)
    return g
  }, [width])
  return <primitive object={geo} attach="geometry" />
}

function Hole({ x, z, r, hole, mats }: { x: number; z: number; r: number; hole: number; mats: Mats }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.2, 0]} material={mats.copper.mat}>
        <cylinderGeometry args={[r, r, 2.4, 28]} />
      </mesh>
      <mesh position={[0, 2.5, 0]} material={mats.hole.mat}>
        <cylinderGeometry args={[hole, hole, 0.4, 20]} />
      </mesh>
    </group>
  )
}

function Box({ x, z, w, d, h, y = 0, mat }: { x: number; z: number; w: number; d: number; h: number; y?: number; mat: THREE.Material }) {
  return (
    <mesh position={[x + w / 2, y + h / 2, z + d / 2]} material={mat} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  )
}

/**
 * The spindle head, built up the Y axis from the tip of the bit at the
 * origin: V-bit, shank, collet nut, nose, motor, clamp and Z plate. Nothing
 * in it is rotated off-axis, so the bit always points straight down.
 */
function SpindleHead({ bitRef }: { bitRef: React.RefObject<THREE.Group | null> }) {
  const metal = (color: string, rough = 0.32, metalness = 1) => (
    <meshStandardMaterial color={color} metalness={metalness} roughness={rough} />
  )
  return (
    <group>
      {/* the rotating part: V-bit, shank and collet nut */}
      <group ref={bitRef}>
        {/* cone points down: apex at the origin, touching the copper */}
        <mesh position={[0, 6, 0]} rotation-x={Math.PI} castShadow>
          <coneGeometry args={[3.2, 12, 20]} />
          {metal(MILL.carbide, 0.28)}
        </mesh>
        <mesh position={[1.4, 8, 0]} rotation-x={Math.PI}>
          <boxGeometry args={[0.6, 7, 3]} />
          {metal('#5f6468', 0.5)}
        </mesh>
        <mesh position={[0, 23, 0]} castShadow>
          <cylinderGeometry args={[3.2, 3.2, 22, 20]} />
          {metal(MILL.carbide, 0.3)}
        </mesh>
        <mesh position={[0, 40, 0]} castShadow>
          <cylinderGeometry args={[11, 11, 12, 6]} />
          {metal(MILL.steel, 0.25)}
        </mesh>
      </group>

      {/* spindle nose and motor */}
      <mesh position={[0, 51, 0]} castShadow>
        <cylinderGeometry args={[14, 15, 10, 32]} />
        {metal(MILL.steel, 0.3)}
      </mesh>
      <mesh position={[0, 95, 0]} castShadow>
        <cylinderGeometry args={[24, 24, 78, 40]} />
        {metal(MILL.spindle, 0.45, 0.6)}
      </mesh>
      {[70, 82, 120].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[24.8, 24.8, 2, 40]} />
          {metal('#15171a', 0.6, 0.4)}
        </mesh>
      ))}
      <mesh position={[0, 139, 0]} castShadow>
        <cylinderGeometry args={[19, 22, 10, 32]} />
        {metal('#1b1d1f', 0.5, 0.5)}
      </mesh>
      {/* power LED on the cap, facing the viewer */}
      <mesh position={[0, 139, 21]}>
        <sphereGeometry args={[2.4, 12, 10]} />
        <meshStandardMaterial color={MILL.led} emissive={MILL.led} emissiveIntensity={1.4} />
      </mesh>

      {/* clamp ring and bracket back to the Z plate */}
      <mesh position={[0, 100, 0]} castShadow>
        <cylinderGeometry args={[27, 27, 30, 40]} />
        {metal('#2f3336', 0.4, 0.7)}
      </mesh>
      <mesh position={[0, 100, -34]} castShadow>
        <boxGeometry args={[40, 30, 22]} />
        {metal('#2f3336', 0.4, 0.7)}
      </mesh>
      <mesh position={[0, 140, -49]} castShadow>
        <boxGeometry args={[84, 150, 8]} />
        {metal(MILL.plate, 0.35, 0.9)}
      </mesh>
    </group>
  )
}

/** One component: its pins from the shared geometry, then its body. */
function PartBody({
  part: p,
  s,
  W,
  mats,
}: {
  part: BoardPart
  s: number
  W: (p: Pt) => [number, number]
  mats: Mats
}) {
  const pad = PRINT_SIZES.padHeight
  const h = PRINT_SIZES.body[p.pkg]
  const [x, z] = W([p.x, p.y])
  const w = p.w * s
  const d = p.h * s
  const pins = pinRects(p).map((r, i) => {
    const [px, pz] = W([r.x, r.y])
    return <Box key={`pin${i}`} x={px} z={pz} w={r.w * s} d={r.h * s} h={pad} mat={mats.copper.mat} />
  })

  let body: React.ReactNode
  switch (p.pkg) {
    case 'mcu':
    case 'soic':
    case 'sot223':
      body = <Box x={x} z={z} w={w} d={d} h={h} mat={mats.chip.mat} />
      break
    case 'qfn':
      body = <Box x={x} z={z} w={w} d={d} h={h} mat={mats.bga.mat} />
      break
    case 'bga':
      body = (
        <>
          <Box x={x} z={z} w={w} d={d} h={h} mat={mats.bga.mat} />
          <Box x={x + 10 * s} z={z + 10 * s} w={w - 20 * s} d={d - 20 * s} h={0.6} y={h} mat={mats.bgaTop.mat} />
        </>
      )
      break
    case 'shield':
      body = (
        <>
          <Box x={x} z={z} w={w} d={d} h={h} mat={mats.shield.mat} />
          <Box x={x + 8 * s} z={z + 8 * s} w={w - 16 * s} d={d - 16 * s} h={0.6} y={h} mat={mats.shieldTop.mat} />
        </>
      )
      break
    case 'module': {
      const can = d * 0.66
      body = (
        <>
          <Box x={x} z={z} w={w} d={d} h={h * 0.4} mat={mats.chip.mat} />
          <Box x={x + 6 * s} z={z + 6 * s} w={w - 12 * s} d={can - 6 * s} h={h} mat={mats.shield.mat} />
        </>
      )
      break
    }
    case 'crystal':
      body = <Box x={x} z={z} w={w} d={d} h={h} mat={mats.shield.mat} />
      break
    case 'button':
      body = (
        <>
          <Box x={x} z={z} w={w} d={d} h={h} mat={mats.bga.mat} />
          <mesh position={[x + w / 2, h + 3, z + d / 2]} material={mats.header.mat} castShadow>
            <cylinderGeometry args={[w * 0.3, w * 0.3, 6, 24]} />
          </mesh>
        </>
      )
      break
  }
  return (
    <>
      {pins}
      {body}
    </>
  )
}
