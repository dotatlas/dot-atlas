'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { FaGithub } from 'react-icons/fa6'
import { ArrowUpRight } from 'lucide-react'
import { SECTIONS, type Entry, type Milestone } from '@/config/portfolio-content'

const PROJECTS = SECTIONS.find((s) => s.id === 'projects')!.nodes
const HUB = PROJECTS.find((p) => p.id === 'volunteer-hub')!
const PEP = PROJECTS.find((p) => p.id === 'pep-25')!
const PRINTING = PROJECTS.find((p) => p.id === 'printing-profiles')!
const HIL = PROJECTS.find((p) => p.id === 'hil-ecu')!

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

function useWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return wide
}

/** The finished projects (solo, then team), then the two still being built. */
export function Project() {
  return (
    <section id="project" aria-label="Projects" className="mt-(--section-gap)">
      <VolunteerHub />
      <Pep25 />
      <PrintingProfiles />
      <HilEcu />
    </section>
  )
}

/** A project's opening: a rule and its number, the name, and who, when and what beside it. */
function Head({ entry, n }: { entry: Entry; n: number }) {
  return (
    <>
      {/* a rule closes the previous project's details and opens this one */}
      <p className="t-small m-0 mb-10 border-t border-copper-dim pt-5 font-semibold text-copper lg:mb-14">{/* taste-skill-ignore: the copper rule between projects (DESIGN.md, The Copper Line Rule) */}
        Project {n}
      </p>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id={`${entry.id}-h`} className="t-display m-0 [word-spacing:0.14em] lg:col-span-5" data-wipe>
          {entry.title}
        </h2>
        <div className="lg:col-span-6 lg:col-start-7">
          {entry.status && <Status {...entry.status} />}
          <p className="m-0 font-semibold" data-reveal>
            {entry.subtitle}
          </p>
          <p className="mt-1 text-silk-2" data-reveal>
            {entry.meta}
          </p>
          <p className="t-lead mt-6" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            {entry.glance}
          </p>
          {entry.links && (
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
              {entry.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                  {l.href.includes('github.com') ? (
                    <FaGithub aria-hidden className="size-4" />
                  ) : (
                    <ArrowUpRight aria-hidden className="size-4" />
                  )}
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

/** Where an unfinished build stands: a live site breathes green, a board in bring-up blinks amber. */
function Status({ label, live }: { label: string; live: boolean }) {
  return (
    <p className="t-small m-0 mb-4 inline-flex items-center gap-3 font-semibold" data-reveal>
      <span
        aria-hidden
        className={`relative size-2.5 shrink-0 rounded-full ${live ? 'status-live bg-(--led-green)' : 'status-build bg-(--copper-hot)'}`}
      />
      {label}
    </p>
  )
}

const MILESTONE: Record<Milestone['state'], string> = { done: 'done', underway: 'underway', next: 'next' }

/** A milestone as a copper pad: filled when done, half plated while underway, bare when next. */
function Pad({ state }: { state: Milestone['state'] }) {
  const look = { done: 'bg-copper', underway: 'border-2 border-copper', next: 'border-2 border-copper-dim' }[state]
  return (
    <span aria-hidden className={`relative size-3.5 shrink-0 ${look}`}>
      {state === 'underway' && <span className="absolute inset-y-0 left-0 w-1/2 bg-copper" />}
    </span>
  )
}

/** The repo's own roadmap, in build order, so the state of the build is plain. */
function Roadmap({ entry }: { entry: Entry }) {
  const steps = entry.roadmap!
  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <h3 className="t-small m-0 font-semibold tracking-normal text-copper [font-variation-settings:normal]">
          Roadmap, from the repo
        </h3>
        <p className="t-small m-0 flex flex-wrap gap-x-5 gap-y-1 text-silk-2 tabular">
          {(['done', 'underway', 'next'] as const).map((s) => {
            const n = steps.filter((m) => m.state === s).length
            return (
              n > 0 && (
                <span key={s} className="inline-flex items-center gap-2">
                  <Pad state={s} />
                  {n} {MILESTONE[s]}
                </span>
              )
            )
          })}
        </p>
      </div>
      {/* down each column, so the build reads left to right: done, underway, next */}
      <ol className="mt-6 list-none gap-x-8 p-0 sm:columns-2 lg:columns-3">
        {steps.map((m, i) => (
          <li
            key={m.name}
            className={`mb-3 flex break-inside-avoid items-center gap-3 ${m.state === 'next' ? 'text-silk-2' : ''}`}
            data-reveal
            style={{ '--i': i % 6 } as React.CSSProperties}
          >
            <Pad state={m.state} />
            <span className="t-small w-5 shrink-0 text-silk-2 tabular">{i}</span>
            <span>
              {m.name}
              <span className="sr-only">, {MILESTONE[m.state]}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Copper mount holes in the four corners of a w x h drawing. */
function Holes({ w, h }: { w: number; h: number }) {
  return (
    <>
      {[
        [28, 28],
        [w - 28, 28],
        [28, h - 28],
        [w - 28, h - 28],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={11} fill="var(--copper)" />
          <circle cx={x} cy={y} r={5.5} fill="var(--mask-deep)" />
        </g>
      ))}
    </>
  )
}

/* ======================================================== Volunteer Hub */

/**
 * A held stage split at the seam: the client on one side, the API and its
 * services on the other, drawn as one schematic. Scrolling forms the
 * circuit: the halves converge and lock, every net draws itself out of its
 * chip, and the bus halves meet exactly at the seam as the halves align.
 * Once closed, the circuit stays closed and signals start to flow.
 */
function VolunteerHub() {
  const stage = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const wide = useWide()
  const still = useRef(true)
  still.current = Boolean(reduce) || !wide

  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end end'] })
  // 0 -> 1 over the first 60% of the hold, then held: the circuit stays closed
  const form = useTransform(scrollYProgress, (v) =>
    reduce ? 1 : easeOutCubic(Math.min(1, Math.max(0, v / 0.6))),
  )
  const apart = (d: number) => (f: number) => `translate3d(0, ${still.current ? 0 : (1 - f) * d}svh, 0)`
  const tPaneL = useTransform(form, apart(-10))
  const tPaneR = useTransform(form, apart(10))
  const tTitleL = useTransform(form, apart(-4))
  const tTitleR = useTransform(form, apart(4))

  const [formed, setFormed] = useState(Boolean(reduce))
  useMotionValueEvent(form, 'change', (f) => setFormed(f > 0.995))

  const [first, ...rest] = HUB.title.split(' ')

  return (
    <article aria-labelledby="hub-h">
      <div id="role-volunteer-hub" data-part="volunteer-hub" ref={stage} className="relative h-[150svh]">
        <div className="sticky top-0 grid h-svh grid-cols-2 overflow-hidden">
          {/* the board halves hold still as one panel; the drawing on each slides and closes */}
          {(['client', 'server'] as const).map((half) => (
            <div key={half} className="relative overflow-hidden bg-mask-raised">
              <MountHoles side={half === 'client' ? 'left' : 'right'} />
              <motion.div
                className="absolute inset-x-0 top-[25svh] bottom-[12svh]"
                style={{ transform: half === 'client' ? tPaneL : tPaneR }}
              >
                <Schematic half={half} form={form} formed={formed} />
              </motion.div>
            </div>
          ))}

          {/* the title tears at its word gap and closes with the circuit */}
          <div className="pointer-events-none absolute inset-x-0 top-[10svh] flex flex-col items-center text-center">
            <p className="t-small m-0 mb-4 font-semibold text-silk-2">Project 1</p>
            <h2 id="hub-h" className="t-display m-0 flex w-full justify-center gap-[0.32em] text-silk">
              <motion.span className="block" style={{ transform: tTitleL }}>
                {first}
              </motion.span>
              <motion.span className="block" style={{ transform: tTitleR }}>
                {rest.join(' ')}
              </motion.span>
            </h2>
          </div>
          <p className="pointer-events-none absolute bottom-8 left-1/2 m-0 w-max max-w-[calc(100%-2.5rem)] -translate-x-1/2 bg-mask px-4 py-2 text-center font-semibold">
            {HUB.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-12 px-(--gutter) lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          {/* the details sit below the panel, so they carry the project's name back down with them */}
          <p className="t-small m-0 mb-3 font-semibold text-copper" data-reveal>
            {HUB.title}
          </p>
          <h3 className="t-title" data-wipe>
            Built solo, end to end
          </h3>
          <p className="mt-5 text-silk-2" data-reveal>
            {HUB.meta}
          </p>
          <p className="t-small mt-10 text-silk-2" data-reveal>
            Above: the Volunteer Hub stack, drawn as a schematic. The client and its API connect at the seam.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="t-lead m-0" data-reveal>
            {HUB.glance}
          </p>
          <Details entry={HUB} />
        </div>
      </div>
    </article>
  )
}

function Details({ entry, columns = false }: { entry: Entry; columns?: boolean }) {
  return (
    <>
      <ul className={`mt-10 list-none p-0 ${columns ? 'grid gap-x-12 gap-y-5 lg:grid-cols-2' : 'flex flex-col gap-4'}`}>
        {entry.details.map((d, i) => (
          <li key={i} className="relative pl-7" data-reveal style={{ '--i': i } as React.CSSProperties}>
            <span aria-hidden className="absolute top-[0.62em] left-0 size-2 bg-copper" />
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-copper" data-reveal>
        {entry.tags.join(' · ')}
      </p>
    </>
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
  ref: string
  /** Pins per side: left, right, top, bottom. Pitch is the side length / count. */
  pins: [number, number, number, number]
}

const PIN_W = 6
const PIN_L = 16
const SEAM = 600
const BUS_Y = [480, 513.3, 546.7, 580]

const CHIPS: Chip[] = [
  // client side
  { x: 200, y: 430, w: 240, h: 200, marking: ['REACT', 'TYPESCRIPT'], ref: 'U1', pins: [6, 6, 8, 8] },
  { x: 60, y: 463.3, w: 90, h: 133.4, marking: ['VALIDATE'], ref: 'U5', pins: [0, 4, 0, 0] },
  // server side
  { x: 760, y: 430, w: 200, h: 200, marking: ['GRAPHQL', 'API'], ref: 'U2', pins: [6, 0, 8, 8] },
  { x: 1010, y: 250, w: 140, h: 100, marking: ['FIREBASE', 'AUTH'], ref: 'U3', pins: [2, 2, 0, 0] },
  { x: 1010, y: 670, w: 140, h: 100, marking: ['DATA'], ref: 'U4', pins: [2, 2, 0, 0] },
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
function MountHoles({ side }: { side: 'left' | 'right' }) {
  const x = side === 'left' ? 'left-5' : 'right-5'
  return (
    <>
      {['top-5', 'bottom-5'].map((y) => (
        <span
          key={y}
          aria-hidden
          className={`absolute ${y} ${x} size-6 rounded-full border-[6px] border-copper bg-mask-deep`}
        />
      ))}
    </>
  )
}

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
        <ChipShape key={c.ref} c={c} />
      ))}
    </svg>
  )
}

/** A chip as the schematics draw it: copper pins, a dark body with its pin-1 dot, marking and designator. */
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
        fontSize={c.w > 150 ? 26 : 19}
        fontWeight={800}
        style={{ fontVariationSettings: "'wdth' 80" }}
      >
        {c.marking.map((line, i) => (
          <tspan
            key={line}
            x={c.x + c.w / 2}
            y={c.y + c.h / 2 + (i - (c.marking.length - 1) / 2) * (c.w > 150 ? 28 : 21)}
            dominantBaseline="central"
          >
            {line}
          </tspan>
        ))}
      </text>
      <text x={c.x - 2} y={c.y - (c.pins[2] ? PIN_L + 10 : 12)} fill="var(--silk-2)" fontSize={17} fontWeight={600}>
        {c.ref}
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
/** A telemetry packet every fourth frame; the log shows the latest few. */
const PACKET_EVERY = 4
const LOG_ROWS = 5
const [START_X, START_Y] = PEP_ROUTE[0]
/** Compass heading from a drawing angle: 0 is north, clockwise. */
const compass = (angle: number) => Math.round((angle + 450) % 360)

/**
 * PEP 25 as the team saw a run: noisy GPS fixes scatter round the vehicle
 * while the fused GPS and IMU estimate stays smooth, the route bends round
 * a keep-out between waypoints, and telemetry streams in beside the map.
 * Like the projects after it, it never pins: the run plays while the panel
 * is wholly in view.
 */
function Pep25() {
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
  const packet = Math.floor(k / PACKET_EVERY)
  const log = Array.from({ length: Math.min(LOG_ROWS, packet + 1) }, (_, i) => PEP_RUN[(packet - i) * PACKET_EVERY])

  return (
    <article
      id="role-pep-25"
      data-part="pep-25"
      aria-labelledby="pep-25-h"
      className="mt-(--section-gap) scroll-mt-16 px-(--gutter)"
    >
      <Head entry={PEP} n={2} />

      <div ref={panel} aria-hidden className="mt-14 grid gap-2 lg:grid-cols-12">
        <div className="flex flex-col justify-center bg-mask-raised lg:order-last lg:col-span-8">
          <svg viewBox="0 0 1200 560" className="block h-auto w-full">
            <defs>
              <pattern id="pep-hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={3} height={14} fill="var(--silk-2)" fillOpacity={0.45} />
              </pattern>
            </defs>
            <Holes w={1200} h={560} />

            {/* north and scale, so it reads as a map */}
            <path d="M80 112 V64 M68 78 L80 64 L92 78" fill="none" stroke="var(--silk-2)" strokeWidth={3} />
            <text x={80} y={52} textAnchor="middle" fill="var(--silk-2)" fontSize={18} fontWeight={700}>
              N
            </text>
            <path d="M980 512 v-10 M980 507 h100 M1080 512 v-10" fill="none" stroke="var(--silk-2)" strokeWidth={3} />
            <text x={968} y={514} textAnchor="end" fill="var(--silk-2)" fontSize={18} fontWeight={600}>
              10 m
            </text>

            <rect x={KEEP_OUT.x} y={KEEP_OUT.y} width={KEEP_OUT.w} height={KEEP_OUT.h} fill="url(#pep-hatch)" />
            <text
              x={KEEP_OUT.x + KEEP_OUT.w / 2}
              y={KEEP_OUT.y + KEEP_OUT.h / 2 + 7}
              textAnchor="middle"
              fontSize={20}
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
                  <text x={x} y={y + (y > 330 ? 50 : -30)} textAnchor="middle" fill="var(--silk-2)" fontSize={20} fontWeight={700}>
                    {i === 0 ? 'Start' : i === PEP_WAYPOINTS.length ? `${i} · Finish` : i}
                  </text>
                </g>
              )
            })}

            {/* the vehicle at its estimate, pinging each packet home */}
            <g style={{ transform: `translate(${f.x}px, ${f.y}px) rotate(${f.angle}deg)`, transition: 'transform 120ms linear' }}>
              {!reduce &&
                [0, 1].map((p) => (
                  <circle
                    key={p}
                    r={18}
                    fill="none"
                    stroke="var(--led)"
                    strokeWidth={2}
                    className="pep-ping"
                    style={{ animationDelay: `${p * 0.9}s` }}
                  />
                ))}
              {[-14, 9].map((wy) =>
                [-15, 5].map((wx) => <rect key={`${wx}${wy}`} x={wx} y={wy} width={10} height={5} fill="var(--silk-2)" />),
              )}
              <rect x={-19} y={-10} width={38} height={20} rx={5} fill="var(--led)" />
              <rect x={5} y={-7} width={5} height={14} rx={1.5} fill="var(--mask-deep)" />
            </g>
          </svg>
          <ul className="t-small m-0 flex list-none flex-wrap gap-x-6 gap-y-2 px-5 pb-5 text-silk-2 lg:px-8 lg:pb-6">
            <li className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-silk-2" />
              GPS fix
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="h-1 w-6 bg-copper" />
              Fused estimate, GPS and IMU
            </li>
            <li className="inline-flex items-center gap-2">
              <span className="w-6 border-t-2 border-dashed border-copper-dim" />
              Planned route
            </li>
          </ul>
        </div>

        {/* what the team watched come in over the air */}
        <div className="flex flex-col gap-5 bg-mask-raised p-5 lg:col-span-4 lg:p-7">
          <p className="t-small m-0 flex items-center justify-between font-semibold text-copper">
            Telemetry
            <span className="inline-flex items-center gap-2 text-silk-2 tabular">
              <span key={packet} className="pep-rx size-2.5 rounded-full bg-(--led-green)" />
              Packet {packet + 1}
            </span>
          </p>
          <div>
            <p className="t-title m-0 font-bold">
              {next === undefined ? 'Finish' : `Waypoint ${reached + 1}`}
              <span className="t-small ml-2 font-semibold text-silk-2">
                {next === undefined ? 'reached' : `of ${PEP_WAYPOINTS.length}`}
              </span>
            </p>
            <p className="m-0 mt-1 text-silk-2 tabular">
              {next === undefined
                ? `Course run in ${f.t.toFixed(1)} s`
                : `${((next - f.s) / UNITS_PER_M).toFixed(1)} m to go`}
            </p>
          </div>
          <table className="t-small mt-auto w-full border-collapse text-right tabular">
            <thead>
              <tr className="text-silk-2">
                {['Time', 'East', 'North', 'Heading'].map((h) => (
                  <th key={h} className="pb-2 font-semibold first:text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map((r, i) => (
                <tr key={r.t} className={i === 0 ? 'font-semibold text-silk' : 'text-silk-2'} style={{ opacity: 1 - i * 0.16 }}>
                  <td className="py-0.5 text-left">{r.t.toFixed(1)} s</td>
                  <td>{((r.x - START_X) / UNITS_PER_M).toFixed(1)} m</td>
                  <td>{((START_Y - r.y) / UNITS_PER_M).toFixed(1)} m</td>
                  <td>{compass(r.angle)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="t-small mt-4 text-silk-2">
        A run as the team watched it: raw GPS fixes scatter, the fused estimate holds steady, the route finds its way
        round a blocked leg, and every packet streams in live. The course and its numbers are illustrative.
      </p>

      <Details entry={PEP} columns />
    </article>
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
function PrintingProfiles() {
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
    <article
      id="role-printing-profiles"
      data-part="printing-profiles"
      aria-labelledby="printing-profiles-h"
      className="mt-(--section-gap) scroll-mt-16 px-(--gutter)"
    >
      <Head entry={PRINTING} n={3} />

      <div
        ref={panel}
        aria-hidden
        className="mx-auto mt-14 bg-mask-raised"
        style={{ maxWidth: `calc((100svh - 12rem) * ${1200 / 340})` }}
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
          <Holes w={1200} h={340} />

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
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 pb-5 lg:px-8 lg:pb-6">
          <p className="t-small m-0 text-silk-2 tabular">
            Layer <span className="inline-block min-w-[2ch] text-right font-semibold text-silk">{shown}</span> of {LAYERS}
          </p>
          <p className={`pp-verified t-small m-0 inline-flex items-center gap-2.5 font-semibold ${done ? 'is-on' : ''}`}>
            <span className="size-2.5 rounded-full bg-(--led-green)" />
            Photo verified
          </p>
        </div>
      </div>
      <p className="t-small mt-4 text-silk-2">
        A preset is the settings for one filament on one printer, printed here layer by layer. One backed by a photo
        of a real print is marked Photo verified.
      </p>

      <Details entry={PRINTING} columns />
      <Roadmap entry={PRINTING} />
    </article>
  )
}

/* =================================================== Auto Safety HIL ECU */

/** The planned demo, in SI units: 40 mph toward a pedestrian 70 m ahead, stepped at 50 Hz. */
const DT = 0.02
const V0 = 17.9
const PED_M = 70
const MAX_DECEL = 8
/**
 * Staged braking; a stage never steps back down while the car still moves.
 * The thresholds are illustrative: the ECU's real table is tuned and tested
 * in the repo's safety-core milestone.
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
const SIM_CHIP: Chip = { x: 90, y: 346, w: 240, h: 120, marking: ['HILSIM', 'PYTHON · 3D'], ref: 'PC', pins: [0, 4, 0, 0] }
const ECU_CHIP: Chip = { x: 870, y: 346, w: 180, h: 120, marking: ['STM32G474', 'FREERTOS'], ref: 'ECU', pins: [4, 4, 4, 4] }
/** Pin centres down both chips' 4-pin sides: the CAN pair uses pins 2 and 3, the LEDs pins 1 to 3. */
const PIN_Y = [361, 391, 421, 451]
const BUS = { from: 346, to: 854 }

/**
 * The bench, drawn: the simulator drives a car at a pedestrian, sensor frames
 * cross the CAN bus to the STM32, and the ECU brakes in stages. While the
 * panel is wholly in view, scrolling runs the scenario; the ECU's status reads
 * out beside it the way its ECUStatus frame would.
 */
function HilEcu() {
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: panel, offset: ['end end', 'start start'] })
  const [frame, setFrame] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setFrame(Math.round(playhead(v) * (RUN.length - 1))))

  const f = RUN[reduce ? RUN.length - 1 : frame]
  const carX = ROAD_X0 + f.x * PX_PER_M
  const braking = f.brake > 0
  const readout = [
    ['Gap', `${(PED_M - f.x).toFixed(1)} m`],
    ['Time to collision', Number.isFinite(f.ttc) ? `${f.ttc.toFixed(1)} s` : 'Stopped'],
    ['Brake', `${Math.round(f.brake * 100)}%`],
  ]

  return (
    <article
      id="role-hil-ecu"
      data-part="hil-ecu"
      aria-labelledby="hil-ecu-h"
      className="mt-(--section-gap) scroll-mt-16 px-(--gutter)"
    >
      <Head entry={HIL} n={4} />

      <div ref={panel} aria-hidden className="mt-14 grid gap-2 lg:grid-cols-12">
        {/* the drawing's cell stretches with the status beside it, so both panels share one height */}
        <div className="flex items-center bg-mask-raised lg:col-span-8">
        <svg viewBox="0 0 1200 520" className="block h-auto w-full">
          <defs>
            <linearGradient id="hil-radar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--copper)" stopOpacity={0.4} />
              <stop offset="1" stopColor="var(--copper)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Holes w={1200} h={520} />

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
          <text x={(carX + PED_X) / 2} y={62} textAnchor="middle" fill="var(--silk-2)" fontSize={20} fontWeight={600} className="tabular">
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
          <text x={600} y={PIN_Y[1] - 22} textAnchor="middle" fill="var(--silk-2)" fontSize={17} fontWeight={600}>
            CAN · 500 kbit/s
          </text>
          {!reduce &&
            [0, 1, 2].map((k) => (
              <g key={k}>
                {/* sensor frames out to the ECU, its commands back; red once they carry a brake */}
                <rect
                  x={BUS.from}
                  y={PIN_Y[1] - 7}
                  width={30}
                  height={14}
                  fill="var(--copper-hot)"
                  className="can-frame"
                  style={{ '--run': `${BUS.to - BUS.from - 30}px`, animationDelay: `${k * -0.55}s` } as React.CSSProperties}
                />
                <rect
                  x={BUS.to - 30}
                  y={PIN_Y[2] - 7}
                  width={30}
                  height={14}
                  fill={braking ? 'var(--led)' : 'var(--copper-hot)'}
                  className="can-frame"
                  style={{ '--run': `${BUS.from - BUS.to + 30}px`, animationDelay: `${k * -0.55 - 0.27}s` } as React.CSSProperties}
                />
              </g>
            ))}

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
        </div>

        {/* the status the ECU reports, as its ECUStatus frame would carry it */}
        <div className="flex flex-col gap-5 bg-mask-raised p-5 lg:col-span-4 lg:p-7">
          <div>
            <p className="t-small m-0 font-semibold text-copper">ECUStatus</p>
            <p className="t-title m-0 mt-2 font-bold tabular">
              {Math.round(f.v * 3.6)}
              <span className="t-small ml-2 font-semibold text-silk-2">km/h</span>
            </p>
          </div>
          <ol className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1.5 p-0 lg:grid-cols-1">
            {ECU_STATES.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 font-semibold ${f.state === i ? 'text-silk' : 'text-silk-2'}`}>
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: STATE_LED[i], opacity: f.state === i ? 1 : 0.2 }}
                />
                {s}
              </li>
            ))}
          </ol>
          <dl className="m-0 mt-auto grid grid-cols-3 gap-x-4">
            {readout.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="t-small text-silk-2">{k}</dt>
                <dd className="m-0 font-semibold tabular">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="t-small mt-4 text-silk-2">
        The demo it is being built for: a car closing on a pedestrian at 40 mph, braked in stages by the ECU over
        CAN and stopped short. The thresholds drawn here are illustrative; the real table is tuned on the bench.
      </p>

      <Details entry={HIL} columns />
      <Roadmap entry={HIL} />
    </article>
  )
}
