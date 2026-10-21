'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { SECTIONS, type Entry } from '@/config/portfolio-content'

const PROJECTS = SECTIONS.find((s) => s.id === 'projects')!.nodes
const HUB = PROJECTS.find((p) => p.id === 'volunteer-hub')!
const PEP = PROJECTS.find((p) => p.id === 'pep-25')!

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

/** Both projects, one after the other: the solo build, then the team build. */
export function Project() {
  return (
    <section id="project" aria-label="Projects" className="mt-(--section-gap)">
      <VolunteerHub />
      <Pep25 />
    </section>
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

      <div className="mt-24 grid gap-12 px-(--gutter) lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
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
        <g key={c.ref}>
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
      ))}
    </svg>
  )
}

/* ============================================================== PEP 25 */

/** The course, in the map's 1200 x 520 units: launch, waypoints, finish. */
const COURSE: P[] = [
  [110, 400],
  [300, 330],
  [470, 395],
  [640, 235],
  [820, 300],
  [985, 150],
  [1110, 215],
]
const COURSE_D = 'M' + COURSE.map((p) => p.join(' ')).join(' L')
/** The map's rendered height: full bleed, capped so it always fits the viewport. */
const MAP_H = `min(${(520 / 1200) * 100}vw, 100svh - 8rem)`

/**
 * PEP 25: a waypoint course on a board-style map. The vehicle drives it with
 * the scroll, the travelled leg draws in behind it, each waypoint lights as it
 * is reached, and it pings its telemetry home as it goes.
 */
function Pep25() {
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // the map holds, fully in view, while the vehicle drives launch to finish
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : Math.min(1, Math.max(0, v))))
  const offsetDistance = useTransform(progress, (v) => `${v * 100}%`)

  // where along the course each waypoint sits, as a share of its length
  const marks = useMemo(() => {
    let total = 0
    const at = [0]
    for (let i = 1; i < COURSE.length; i++) {
      total += Math.hypot(COURSE[i][0] - COURSE[i - 1][0], COURSE[i][1] - COURSE[i - 1][1])
      at.push(total)
    }
    return at.map((d) => d / total)
  }, [])
  const [reached, setReached] = useState(reduce ? COURSE.length : 1)
  useMotionValueEvent(progress, 'change', (v) => {
    setReached(marks.filter((m) => v >= m - 0.001).length)
  })

  return (
    <article
      id="role-pep-25"
      data-part="pep-25"
      aria-labelledby="pep-h"
      className="mt-(--section-gap) scroll-mt-16 px-(--gutter)"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 id="pep-h" className="t-display m-0 [word-spacing:0.14em] lg:col-span-5" data-wipe>
          {PEP.title}
        </h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="m-0 font-semibold" data-reveal>
            {PEP.subtitle}
          </p>
          <p className="mt-1 text-silk-2" data-reveal>
            {PEP.meta}
          </p>
          <p className="t-lead mt-6" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
            {PEP.glance}
          </p>
        </div>
      </div>

      <div
        ref={track}
        className="relative -mx-(--gutter) mt-14"
        style={reduce ? undefined : { height: `calc(${MAP_H} + min(90svh, 120vw))` }}
      >
        <div
          className="relative mx-auto bg-mask-raised"
          style={{
            maxWidth: `calc((100svh - 8rem) * ${1200 / 520})`,
            ...(reduce ? {} : { position: 'sticky', top: `calc(50svh - ${MAP_H} / 2)` }),
          }}
        >
        <svg viewBox="0 0 1200 520" className="block h-auto w-full" aria-hidden>
          {[
            [28, 28],
            [1172, 28],
            [28, 492],
            [1172, 492],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r={11} fill="var(--copper)" />
              <circle cx={x} cy={y} r={5.5} fill="var(--mask-deep)" />
            </g>
          ))}

          {/* the planned course, then the leg actually driven */}
          <path d={COURSE_D} fill="none" stroke="var(--copper-dim)" strokeWidth={5} strokeDasharray="12 10" />
          <motion.path
            d={COURSE_D}
            fill="none"
            stroke="var(--copper)"
            strokeWidth={6}
            strokeLinejoin="round"
            style={{ pathLength: progress }}
          />

          {COURSE.map(([x, y], i) => {
            const hit = i < reached
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={15} fill="var(--copper)" />
                <circle
                  cx={x}
                  cy={y}
                  r={7}
                  fill={hit ? 'var(--copper-hot)' : 'var(--mask-deep)'}
                  style={{ transition: 'fill 200ms ease' }}
                />
              </g>
            )
          })}
          <text x={COURSE[0][0] - 18} y={COURSE[0][1] + 44} fill="var(--silk-2)" fontSize={20} fontWeight={600}>
            Launch
          </text>
          <text x={COURSE[COURSE.length - 1][0] - 30} y={COURSE[COURSE.length - 1][1] + 46} fill="var(--silk-2)" fontSize={20} fontWeight={600}>
            Finish
          </text>

          {/* the vehicle, heading along the course, pinging telemetry home */}
          <motion.g
            style={{
              offsetPath: `path('${COURSE_D}')`,
              offsetRotate: 'auto',
              offsetDistance,
            }}
          >
            {!reduce &&
              [0, 1, 2].map((k) => (
                <circle
                  key={k}
                  r={18}
                  fill="none"
                  stroke="var(--led)"
                  strokeWidth={2}
                  className="pep-ping"
                  style={{ animationDelay: `${k * 0.6}s` }}
                />
              ))}
            <path d="M18 0 L-12 -13 L-6 0 L-12 13 Z" fill="var(--led)" />
          </motion.g>
        </svg>
        </div>
      </div>
      <p className="t-small mt-4 text-silk-2">
        Waypoint following, drawn: the course the navigation stack plans and steers.
      </p>

      <Details entry={PEP} columns />
    </article>
  )
}
