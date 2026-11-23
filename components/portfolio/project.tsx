'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

/**
 * Each project's drawing, by entry id. The entry itself (title, status, text,
 * details) is laid out with the roles in passage.tsx, so experience and
 * projects share one format; these are the figures that sit inside it.
 */
export const PROJECT_FIGURES: Record<string, () => React.JSX.Element> = {
  'hil-ecu': HilFigure,
  'printing-profiles': PrintFigure,
  'volunteer-hub': HubFigure,
  'pep-25': PepFigure,
}

/**
 * The one frame every project drawing shares: a raised panel at the entry's
 * width, an optional readout line under it, and a caption. The panel is what
 * scroll playback measures; it plays while wholly in view.
 */
function Figure({
  panel,
  readout,
  caption,
  children,
}: {
  panel: React.Ref<HTMLDivElement>
  readout?: React.ReactNode
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className="m-0 mt-10" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
      <div ref={panel} aria-hidden className="bg-mask-raised">
        {children}
      </div>
      {readout && (
        <p aria-hidden className="t-small m-0 mt-3 flex flex-wrap gap-x-5 gap-y-1 text-silk tabular">
          {readout}
        </p>
      )}
      <figcaption className="t-small mt-2 text-silk-2">{caption}</figcaption>
    </figure>
  )
}

/* ======================================================== Volunteer Hub */

/**
 * The stack as one schematic split at the seam: the client on one half, the
 * API and its services on the other. It sits beside the details like every
 * other project and never pins: while the panel is wholly in view, scrolling
 * closes the halves, every net draws itself out of its chip, and the bus
 * halves meet at the seam. Once closed, it stays closed and signals flow.
 */
function HubFigure() {
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: panel, offset: ['end end', 'start start'] })
  const form = useTransform(scrollYProgress, (v) => (reduce ? 1 : easeOutCubic(playhead(v))))
  const apart = (d: number) => (f: number) => `translate3d(0, ${(1 - f) * d}%, 0)`
  const tPaneL = useTransform(form, apart(-14))
  const tPaneR = useTransform(form, apart(14))

  const [formed, setFormed] = useState(Boolean(reduce))
  useMotionValueEvent(form, 'change', (f) => setFormed(f > 0.995))

  return (
    <Figure panel={panel} caption="The stack as a schematic: the client and its API meet at the seam.">
      <div className="grid aspect-15/8 grid-cols-2 overflow-hidden">
        {(['client', 'server'] as const).map((half) => (
          <div key={half} className="relative overflow-hidden">
            <motion.div className="absolute inset-x-0 inset-y-[8%]" style={{ transform: half === 'client' ? tPaneL : tPaneR }}>
              <Schematic half={half} form={form} formed={formed} />
            </motion.div>
          </div>
        ))}
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------ schematic */

/*
 * One 1200 x 800 drawing. The left pane shows x 0..600 (the client), the right
 * pane x 600..1200 (the API and services). Both panes are the same size and fit
 * their half against the seam edge, so the bus lines up across the seam exactly.
 */

type Chip = {
  x: number
  y: number
  w: number
  h: number
  marking: string[]
  /** Pins per side: left, right, top, bottom. Pitch is the side length / count. */
  pins: [number, number, number, number]
}

const PIN_W = 6
const PIN_L = 16
const SEAM = 600
const BUS_Y = [480, 513.3, 546.7, 580]

const CHIPS: Chip[] = [
  // client side
  { x: 200, y: 430, w: 240, h: 200, marking: ['REACT', 'TYPESCRIPT'], pins: [6, 6, 8, 8] },
  { x: 60, y: 463.3, w: 90, h: 133.4, marking: ['VALIDATE'], pins: [0, 4, 0, 0] },
  // server side
  { x: 760, y: 430, w: 200, h: 200, marking: ['GRAPHQL', 'API'], pins: [6, 0, 8, 8] },
  { x: 1010, y: 250, w: 140, h: 100, marking: ['FIREBASE', 'AUTH'], pins: [2, 2, 0, 0] },
  { x: 1010, y: 670, w: 140, h: 100, marking: ['DATA'], pins: [2, 2, 0, 0] },
]

type P = [number, number]

/**
 * Copper, each net drawn from its source pin outward. The bus is split at the
 * seam: the client half grows from the client's pins toward the seam, the
 * server half from the API's pins toward it, so they meet in the middle.
 */
const NETS: P[][] = [
  ...BUS_Y.map((y): P[] => [
    [456, y],
    [SEAM, y],
  ]),
  ...BUS_Y.map((y): P[] => [
    [744, y],
    [SEAM, y],
  ]),
  // client <-> validation, tip to tip
  ...[480, 513.3].map((y): P[] => [
    [184, y],
    [166, y],
  ]),
  // API top pins 4, 6 -> Firebase auth's two left pins
  [
    [922.5, 414],
    [922.5, 354.1],
    [951.6, 325],
    [994, 325],
  ],
  [
    [872.5, 414],
    [872.5, 312.3],
    [909.8, 275],
    [994, 275],
  ],
  // API bottom pins 4, 5 -> the data store's two left pins
  [
    [897.5, 646],
    [897.5, 663.8],
    [928.7, 695],
    [994, 695],
  ],
  [
    [872.5, 646],
    [872.5, 713.8],
    [903.7, 745],
    [994, 745],
  ],
]

/** The closed bus, end to end, for the signal that runs once the circuit forms. */
const BUS_FULL: P[][] = BUS_Y.map((y): P[] => [
  [456, y],
  [744, y],
])

/** The drawing's vertical extent: every chip, pin and designator, with even margin. */
const VIEW_Y = 190
const VIEW_H = 640

/** Copper mount holes in the panel's outer corners; they belong to the board, not the drawing. */
const pointsOf = (net: P[]) => net.map((p) => p.join(',')).join(' ')

function chipPins(c: Chip) {
  const out: { x: number; y: number; w: number; h: number }[] = []
  const [l, r, t, b] = c.pins
  const sideY = (n: number, i: number) => c.y + (c.h / n) * (i + 0.5) - PIN_W / 2
  const sideX = (n: number, i: number) => c.x + (c.w / n) * (i + 0.5) - PIN_W / 2
  for (let i = 0; i < l; i++) out.push({ x: c.x - PIN_L, y: sideY(l, i), w: PIN_L, h: PIN_W })
  for (let i = 0; i < r; i++) out.push({ x: c.x + c.w, y: sideY(r, i), w: PIN_L, h: PIN_W })
  for (let i = 0; i < t; i++) out.push({ x: sideX(t, i), y: c.y - PIN_L, w: PIN_W, h: PIN_L })
  for (let i = 0; i < b; i++) out.push({ x: sideX(b, i), y: c.y + c.h, w: PIN_W, h: PIN_L })
  return out
}

function Schematic({
  half,
  form,
  formed,
}: {
  half: 'client' | 'server'
  form: MotionValue<number>
  formed: boolean
}) {
  const client = half === 'client'
  return (
    <svg
      viewBox={`${client ? 0 : SEAM} ${VIEW_Y} 600 ${VIEW_H}`}
      preserveAspectRatio={client ? 'xMaxYMid meet' : 'xMinYMid meet'}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <g fill="none" strokeWidth={PIN_W} strokeLinecap="butt" strokeLinejoin="round">
        {/* where the copper will run, before it does */}
        {NETS.map((net, i) => (
          <polyline key={`g${i}`} points={pointsOf(net)} stroke="var(--copper-dim)" strokeOpacity={0.35} />
        ))}
        {/* the copper, drawn out of each pin as the circuit forms */}
        {NETS.map((net, i) => (
          <motion.polyline key={i} points={pointsOf(net)} stroke="var(--copper)" style={{ pathLength: form }} />
        ))}
        {/* closed: a flash across the seam, then signals keep moving */}
        {formed &&
          BUS_FULL.map((net, i) => (
            <polyline key={`c${i}`} points={pointsOf(net)} stroke="var(--copper-hot)" className="schem-connect" />
          ))}
        {formed &&
          [...BUS_FULL, ...NETS.slice(10)].map((net, i) => (
            <polyline
              key={`p${i}`}
              points={pointsOf(net)}
              stroke="var(--copper-hot)"
              className="schem-pulse"
              style={{ animationDelay: `${0.5 + (i % 4) * 0.4}s` }}
            />
          ))}
      </g>

      {CHIPS.map((c) => (
        <ChipShape key={c.marking[0]} c={c} />
      ))}
    </svg>
  )
}

/** A chip as the schematics draw it: copper pins, a dark body with its pin-1 dot, marking and designator. */
/** Marking size from the chip's width, so the longest line still fits at column width. */
const markSize = (c: Chip) => Math.min(36, c.w / 4.6)

function ChipShape({ c }: { c: Chip }) {
  return (
    <g>
      {chipPins(c).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="var(--copper)" />
      ))}
      <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="var(--chip)" />
      <circle cx={c.x + 14} cy={c.y + 14} r={5} fill="#2a2d2b" />
      <text
        x={c.x + c.w / 2}
        textAnchor="middle"
        fill="var(--chip-mark)"
        fontSize={markSize(c)}
        fontWeight={800}
        style={{ fontVariationSettings: "'wdth' 80" }}
      >
        {c.marking.map((line, i) => (
          <tspan
            key={line}
            x={c.x + c.w / 2}
            y={c.y + c.h / 2 + (i - (c.marking.length - 1) / 2) * markSize(c) * 1.1}
            dominantBaseline="central"
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/* ============================================================== PEP 25 */

/** One test run, in the map's 1200 x 560 units (10 to the metre): start, then routed waypoint to waypoint. */
const PEP_ROUTE: P[] = [
  [110, 470],
  [300, 280],
  [400, 280],
  [560, 440],
  [850, 440],
  [900, 390],
  [900, 150],
  [1090, 340],
  [1090, 380],
]
/** Which route points are waypoints 1 to 4; the last is the finish. */
const PEP_WAYPOINTS = [1, 3, 6, 8]
/** The direct leg from waypoint 2 to 3 is blocked, so the route goes round. */
const KEEP_OUT = { x: 610, y: 200, w: 250, h: 205 }
const UNITS_PER_M = 10
const PEP_FRAMES = 150

type Sample = { x: number; y: number; s: number; angle: number; t: number }

/** Drives the route at an illustrative speed that eases off into each waypoint. */
function drive() {
  const cum = [0]
  for (let i = 1; i < PEP_ROUTE.length; i++) {
    const [ax, ay] = PEP_ROUTE[i - 1]
    const [bx, by] = PEP_ROUTE[i]
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay))
  }
  const total = cum[cum.length - 1]
  const wpAt = PEP_WAYPOINTS.map((i) => cum[i])
  const out: Sample[] = []
  let t = 0
  for (let k = 0; k <= PEP_FRAMES; k++) {
    const s = (total * k) / PEP_FRAMES
    let i = 1
    while (i < cum.length - 1 && cum[i] < s) i++
    const [ax, ay] = PEP_ROUTE[i - 1]
    const [bx, by] = PEP_ROUTE[i]
    const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1])
    const near = Math.min(s, ...wpAt.map((w) => Math.abs(w - s)))
    const v = 1.4 + 1.8 * Math.min(1, near / 80)
    if (k > 0) t += total / PEP_FRAMES / UNITS_PER_M / v
    out.push({ x: ax + (bx - ax) * f, y: ay + (by - ay) * f, s, angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI, t })
  }
  return { run: out, cum, wpAt }
}
const { run: PEP_RUN, cum: PEP_CUM, wpAt: PEP_WP_AT } = drive()
console.assert(
  PEP_RUN[PEP_FRAMES].x === PEP_ROUTE[PEP_ROUTE.length - 1][0] && PEP_RUN[PEP_FRAMES].y === PEP_ROUTE[PEP_ROUTE.length - 1][1],
  'PEP drawing: the run must end on the finish',
)

/** Repeatable scatter in -1..1 from integer maths only, so server and browser draw the same GPS noise. */
const jitter = (n: number) => (((n * 2654435761) >>> 0) % 2001) / 1000 - 1
/** A raw GPS fix every third frame, up to 1.8 m off where the vehicle really is. */
const GPS_FIXES = PEP_RUN.filter((_, k) => k % 3 === 0).map((f, j) => ({
  k: j * 3,
  x: f.x + jitter(j * 2 + 1) * 18,
  y: f.y + jitter(j * 2 + 2) * 18,
}))

/**
 * PEP 25 as the team saw a run: noisy GPS fixes scatter round the vehicle
 * while the fused GPS and IMU estimate stays smooth, the route bends round
 * a keep-out between waypoints, and telemetry streams in beside the map.
 * Like the projects after it, it never pins: the run plays while the panel
 * is wholly in view.
 */
function PepFigure() {
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: panel, offset: ['end end', 'start start'] })
  const [frame, setFrame] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setFrame(Math.round(playhead(v) * PEP_FRAMES)))

  const k = reduce ? PEP_FRAMES : frame
  const f = PEP_RUN[k]
  // the estimate so far: every corner already passed, then where the vehicle is now
  const driven = [...PEP_ROUTE.filter((_, i) => PEP_CUM[i] < f.s), [f.x, f.y] as P]
  const reached = PEP_WP_AT.filter((w) => w <= f.s + 0.5).length
  const next = PEP_WP_AT[reached]

  return (
    <Figure
      panel={panel}
      caption="A run as the team watched it: raw GPS fixes scatter, the fused estimate holds steady, and the route bends round a blocked leg. Illustrative course."
      readout={
        <>
          <span>{next === undefined ? 'Finish reached' : `Waypoint ${reached + 1} of ${PEP_WAYPOINTS.length}`}</span>
          <span className="text-silk-2">
            {next === undefined ? `Course run in ${f.t.toFixed(1)} s` : `${((next - f.s) / UNITS_PER_M).toFixed(1)} m to go`}
          </span>
        </>
      }
    >
          <svg viewBox="0 0 1200 560" className="block h-auto w-full">
            <defs>
              <pattern id="pep-hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={3} height={14} fill="var(--silk-2)" fillOpacity={0.45} />
              </pattern>
            </defs>

            {/* north and scale, so it reads as a map */}
            <path d="M80 112 V64 M68 78 L80 64 L92 78" fill="none" stroke="var(--silk-2)" strokeWidth={3} />
            <text x={80} y={50} textAnchor="middle" fill="var(--silk-2)" fontSize={26} fontWeight={700}>
              N
            </text>
            <path d="M980 512 v-10 M980 507 h100 M1080 512 v-10" fill="none" stroke="var(--silk-2)" strokeWidth={3} />
            <text x={968} y={516} textAnchor="end" fill="var(--silk-2)" fontSize={26} fontWeight={600}>
              10 m
            </text>

            <rect x={KEEP_OUT.x} y={KEEP_OUT.y} width={KEEP_OUT.w} height={KEEP_OUT.h} fill="url(#pep-hatch)" />
            <text
              x={KEEP_OUT.x + KEEP_OUT.w / 2}
              y={KEEP_OUT.y + KEEP_OUT.h / 2 + 7}
              textAnchor="middle"
              fontSize={28}
              fontWeight={700}
              fill="var(--silk)"
              stroke="var(--mask-raised)"
              strokeWidth={8}
              paintOrder="stroke"
            >
              Keep out
            </text>

            {/* the planned route, the raw fixes, and the fused estimate drawn through them */}
            <polyline points={pointsOf(PEP_ROUTE)} fill="none" stroke="var(--copper-dim)" strokeWidth={4} strokeDasharray="12 10" />
            {GPS_FIXES.filter((g) => g.k <= k).map((g) => (
              <circle key={g.k} cx={g.x} cy={g.y} r={4} fill="var(--silk-2)" />
            ))}
            <polyline
              points={pointsOf(driven)}
              fill="none"
              stroke="var(--copper)"
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {[0, ...PEP_WAYPOINTS].map((r, i) => {
              const [x, y] = PEP_ROUTE[r]
              const hit = i <= reached
              return (
                <g key={r}>
                  <circle cx={x} cy={y} r={16} fill="var(--copper)" />
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill={hit ? 'var(--copper-hot)' : 'var(--mask-deep)'}
                    style={{ transition: 'fill 200ms ease' }}
                  />
                  <text x={x} y={y + (y > 330 ? 54 : -32)} textAnchor="middle" fill="var(--silk-2)" fontSize={28} fontWeight={700}>
                    {i === 0 ? 'Start' : i === PEP_WAYPOINTS.length ? `${i} · Finish` : i}
                  </text>
                </g>
              )
            })}

            {/* the vehicle at its estimate, pinging each packet home */}
            <g style={{ transform: `translate(${f.x}px, ${f.y}px) rotate(${f.angle}deg)`, transition: 'transform 120ms linear' }}>
              {[-14, 9].map((wy) =>
                [-15, 5].map((wx) => <rect key={`${wx}${wy}`} x={wx} y={wy} width={10} height={5} fill="var(--silk-2)" />),
              )}
              <rect x={-19} y={-10} width={38} height={20} rx={5} fill="var(--led)" />
              <rect x={5} y={-7} width={5} height={14} rx={1.5} fill="var(--mask-deep)" />
            </g>
          </svg>
    </Figure>
  )
}

/** 0 -> 1 over the first 85% of a progress, then held at the end. */
const playhead = (v: number) => Math.min(1, Math.max(0, v / 0.85))

/* ===================================================== Printing Profiles */

/** The print, in the drawing's 1200 x 340 units: filament names laid down on a bed. */
const PRINT_TEXT = 'PLA PETG TPU'
const BED_Y = 290
const PRINT_FONT = 170
const PITCH = 6
/** The display face's caps stand about 0.72 em; each layer is one pitch tall. */
const LAYERS = Math.ceil((PRINT_FONT * 0.72) / PITCH)
const PRINT_TYPE = {
  x: 600,
  // round letters overshoot the baseline; lift them so they still sit on the bed
  y: BED_Y - 2,
  textAnchor: 'middle' as const,
  fontSize: PRINT_FONT,
  fontWeight: 820,
  style: { fontVariationSettings: "'wdth' 74" },
}

/**
 * Printing Profiles: what a preset is for, printed. While the panel is wholly
 * in view, scrolling lays the slicer's dashed toolpath preview down in solid
 * layers under a sweeping hotend; when the last layer lands, the print earns
 * the site's Photo verified badge.
 */
function PrintFigure() {
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // from the panel's bottom edge entering to its top edge leaving: it plays wholly in view
  const { scrollYProgress } = useScroll({ target: panel, offset: ['end end', 'start start'] })
  const [layer, setLayer] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setLayer(Math.round(playhead(v) * LAYERS)))

  const shown = reduce ? LAYERS : layer
  const done = shown >= LAYERS
  const printing = shown > 0 && !done
  const top = BED_Y - shown * PITCH
  // the hotend waits above the bed, rides each new layer, then lifts clear
  const nozzleY = done ? 128 : shown === 0 ? BED_Y - 40 : top

  return (
    <Figure
      panel={panel}
      caption="A preset is the settings for one filament on one printer, printed here layer by layer."
      readout={
        <>
          <span>
            Layer <span className="inline-block min-w-[2ch] text-right">{shown}</span> of {LAYERS}
          </span>
          <span className={`pp-verified inline-flex items-center gap-2 ${done ? 'is-on' : ''}`}>
            <span className="size-2 rounded-full bg-(--led-green)" />
            Photo verified
          </span>
        </>
      }
    >
        <svg viewBox="0 0 1200 340" className="block h-auto w-full">
          <defs>
            {/* one bead of filament per layer: lit on top, shaded underneath */}
            <linearGradient id="pp-bead" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--silk-bright)" />
              <stop offset="0.5" stopColor="var(--silk)" />
              <stop offset="1" stopColor="var(--silk-2)" />
            </linearGradient>
            <pattern id="pp-layers" width={8} height={PITCH} patternUnits="userSpaceOnUse">
              <rect y={1.2} width={8} height={PITCH - 1.2} fill="url(#pp-bead)" />
            </pattern>
            <clipPath id="pp-printed">
              <rect x={0} y={top} width={1200} height={BED_Y - top} />
            </clipPath>
          </defs>

          <rect x={70} y={BED_Y} width={1060} height={14} fill="var(--chip)" />
          <rect x={70} y={BED_Y} width={1060} height={2} fill="var(--copper-dim)" />

          {/* the slicer's preview of the toolpath, then what is printed so far */}
          <text {...PRINT_TYPE} fill="none" stroke="var(--copper-dim)" strokeWidth={2} strokeDasharray="8 7">
            {PRINT_TEXT}
          </text>
          <text {...PRINT_TYPE} fill="url(#pp-layers)" clipPath="url(#pp-printed)">
            {PRINT_TEXT}
          </text>

          <g style={{ transform: `translateY(${nozzleY}px)`, transition: 'transform 220ms var(--ease-out)' }}>
            <g className="pp-sweep" style={{ animationPlayState: printing ? 'running' : 'paused' }}>
              <rect x={-10} y={-108} width={20} height={34} fill="var(--chip)" />
              <rect x={-36} y={-74} width={72} height={40} fill="var(--chip)" stroke="var(--copper-dim)" strokeWidth={2} />
              <circle cx={22} cy={-54} r={4.5} fill={printing ? 'var(--led)' : 'var(--led-off)'} />
              <path d="M-15 -34 H15 L5 -6 H-5 Z" fill="var(--copper)" />
              <rect x={-4} y={-6} width={8} height={6} fill="var(--copper-hot)" />
            </g>
          </g>
        </svg>
    </Figure>
  )
}

/* ======================================= ADAS Safety ECU & HIL Simulator */

/** The planned demo, in SI units: 40 mph toward a pedestrian 70 m ahead, stepped at 50 Hz. */
const DT = 0.02
const V0 = 17.9
const PED_M = 70
const MAX_DECEL = 8
/**
 * Staged braking; a stage never steps back down while the car still moves.
 * The thresholds are illustrative.
 */
const STAGES = [
  { ttc: 3.0, brake: 0, state: 1 },
  { ttc: 2.2, brake: 0.4, state: 1 },
  { ttc: 1.5, brake: 1, state: 3 },
]
const ECU_STATES = ['Normal', 'Warning', 'Degraded', 'Emergency brake']
const STATE_LED = ['var(--led-green)', 'var(--copper-hot)', 'var(--silk-2)', 'var(--led)']

type Frame = { x: number; v: number; ttc: number; brake: number; state: number }

/** Steps the scenario until the car stands still, one frame per 20 ms. */
function simulate() {
  const out: Frame[] = []
  let x = 0
  let v = V0
  let stage = -1
  while (v > 0 && out.length < 1000) {
    const ttc = (PED_M - x) / v
    while (stage + 1 < STAGES.length && ttc < STAGES[stage + 1].ttc) stage++
    const brake = stage < 0 ? 0 : STAGES[stage].brake
    out.push({ x, v, ttc, brake, state: stage < 0 ? 0 : STAGES[stage].state })
    v = Math.max(0, v - brake * MAX_DECEL * DT)
    x += v * DT
  }
  out.push({ x, v: 0, ttc: Infinity, brake: 1, state: 3 })
  return out
}
const RUN = simulate()
console.assert(PED_M - RUN[RUN.length - 1].x > 5, 'HIL drawing: the car must stop short of the pedestrian')

/** Road metres to drawing units; the car's front bumper starts at ROAD_X0. */
const ROAD_X0 = 150
const PX_PER_M = 12.8
const PED_X = ROAD_X0 + PED_M * PX_PER_M
const ROAD = { top: 104, bottom: 264, lane: 224 }
const SIM_CHIP: Chip = { x: 90, y: 346, w: 240, h: 120, marking: ['SIMULATOR', 'PYTHON'], pins: [0, 4, 0, 0] }
const ECU_CHIP: Chip = { x: 870, y: 346, w: 180, h: 120, marking: ['SAFETY', 'ECU'], pins: [4, 4, 4, 4] }
/** Pin centres down both chips' 4-pin sides: the CAN pair uses pins 2 and 3, the LEDs pins 1 to 3. */
const PIN_Y = [361, 391, 421, 451]
const BUS = { from: 346, to: 854 }

/**
 * The bench, drawn: the simulator drives a car at a pedestrian, sensor frames
 * cross the CAN bus to the STM32, and the ECU brakes in stages. While the
 * panel is wholly in view, scrolling runs the scenario; the ECU's status reads
 * out beside it the way its ECUStatus frame would.
 */
function HilFigure() {
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: panel, offset: ['end end', 'start start'] })
  const [frame, setFrame] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setFrame(Math.round(playhead(v) * (RUN.length - 1))))

  const f = RUN[reduce ? RUN.length - 1 : frame]
  const carX = ROAD_X0 + f.x * PX_PER_M
  const braking = f.brake > 0

  return (
    <Figure
      panel={panel}
      caption="One scenario: a car closing on a pedestrian at 40 mph, braked in stages by the safety ECU over CAN. Illustrative run."
      readout={
        <>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: STATE_LED[f.state] }} />
            {ECU_STATES[f.state]}
          </span>
          <span className="text-silk-2">{Math.round(f.v * 3.6)} km/h</span>
          <span className="text-silk-2">Brake {Math.round(f.brake * 100)}%</span>
        </>
      }
    >
        <svg viewBox="0 0 1200 520" className="block h-auto w-full">
          <defs>
            <linearGradient id="hil-radar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--copper)" stopOpacity={0.4} />
              <stop offset="1" stopColor="var(--copper)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* the road, and a crossing with someone on it */}
          <rect x={0} y={ROAD.top} width={1200} height={ROAD.bottom - ROAD.top} fill="var(--mask-deep)" />
          <g stroke="var(--silk-2)" strokeOpacity={0.5} strokeWidth={3}>
            <line x1={0} x2={1200} y1={ROAD.top} y2={ROAD.top} />
            <line x1={0} x2={1200} y1={ROAD.bottom} y2={ROAD.bottom} />
            <line x1={0} x2={1200} y1={184} y2={184} strokeDasharray="28 22" />
          </g>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={PED_X - 26} y={ROAD.top + 9 + i * 21.5} width={52} height={12} fill="var(--silk)" fillOpacity={0.12} />
          ))}
          <ellipse cx={PED_X} cy={ROAD.lane} rx={19} ry={9} fill="var(--copper)" />
          <circle cx={PED_X} cy={ROAD.lane} r={10} fill="var(--copper-hot)" />

          {/* the radar's view ahead, brighter once the ECU has reason to watch */}
          <path
            d={`M${carX} ${ROAD.lane} L1150 ${ROAD.lane - 46} L1150 ${ROAD.lane + 46} Z`}
            fill="url(#hil-radar)"
            opacity={f.state ? 1 : 0.5}
          />

          {/* the gap, dimensioned like a drawing */}
          <g stroke="var(--silk-2)" strokeWidth={2}>
            <line x1={carX} x2={PED_X} y1={78} y2={78} />
            <line x1={carX} x2={carX} y1={70} y2={86} />
            <line x1={PED_X} x2={PED_X} y1={70} y2={86} />
          </g>
          <text x={(carX + PED_X) / 2} y={60} textAnchor="middle" fill="var(--silk-2)" fontSize={30} fontWeight={600} className="tabular">
            {(PED_M - f.x).toFixed(1)} m
          </text>

          {/* the car, front bumper at carX; brake lights follow the ECU's command */}
          <g style={{ transform: `translateX(${carX}px)` }}>
            <rect x={-87} y={ROAD.lane - 17} width={5} height={9} fill={braking ? 'var(--led)' : 'var(--led-off)'} />
            <rect x={-87} y={ROAD.lane + 8} width={5} height={9} fill={braking ? 'var(--led)' : 'var(--led-off)'} />
            <rect x={-84} y={ROAD.lane - 20} width={84} height={40} rx={9} fill="var(--silk)" />
            <rect x={-32} y={ROAD.lane - 15} width={12} height={30} rx={3} fill="var(--mask-deep)" />
            <rect x={-76} y={ROAD.lane - 14} width={9} height={28} rx={3} fill="var(--mask-deep)" />
          </g>

          {/* the bench: simulator and ECU on one CAN bus */}
          <ChipShape c={SIM_CHIP} />
          <ChipShape c={ECU_CHIP} />
          <g fill="var(--copper)">
            {[PIN_Y[1], PIN_Y[2]].map((y) => (
              <rect key={y} x={BUS.from} y={y - 3} width={BUS.to - BUS.from} height={6} />
            ))}
          </g>
          <text x={600} y={PIN_Y[1] - 20} textAnchor="middle" fill="var(--silk-2)" fontSize={26} fontWeight={600}>
            CAN bus
          </text>
          {/* the ECU's LEDs on its own pins: green, yellow, red */}
          {[0, 1, 3].map((s, i) => {
            const on = f.state === s
            return (
              <g key={s}>
                <rect x={ECU_CHIP.x + ECU_CHIP.w + PIN_L} y={PIN_Y[i] - 3} width={36} height={6} fill="var(--copper)" />
                {on && <circle cx={1114} cy={PIN_Y[i]} r={19} fill={STATE_LED[s]} opacity={0.25} />}
                <circle cx={1114} cy={PIN_Y[i]} r={10} fill={STATE_LED[s]} fillOpacity={on ? 1 : 0.18} />
              </g>
            )
          })}
        </svg>
    </Figure>
  )
}
