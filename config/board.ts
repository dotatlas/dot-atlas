/**
 * The circuit board the intro mills and the page is set on.
 *
 * Everything lives on one fixed artboard (BOARD.w x BOARD.h units). The SVG
 * board and the 3D scene both read this file, so the machined object and the
 * page line up exactly at the hand-off. Each role in portfolio-content is a
 * component here, wired back to the central MCU.
 *
 * Copper rules, as on a real board: every signal trace is exactly pin width
 * (PIN.w) and starts at a pin's outer tip, collinear with the pin, so pin and
 * trace read as one continuous line. Traces into packages without exposed
 * pins (BGA, shield can, module, crystal) end under the body, out of sight.
 */

export type Pt = [number, number]
export type Rect = { x: number; y: number; w: number; h: number }

export type Package =
  | 'mcu' // the central QFP: Joshua
  | 'bga' // dense ball-grid package
  | 'shield' // RF can / metal-lid module
  | 'module' // ESP32-style module with antenna
  | 'soic' // gull-wing small outline IC
  | 'qfn' // leadless quad package, pads at the body edge
  | 'crystal' // oscillator can
  | 'sot223' // voltage regulator with a heat tab
  | 'button' // tactile reset switch

export type BoardPart = {
  id: string
  /** Node id in portfolio-content this part stands for (null if none). */
  node: string | null
  pkg: Package
  x: number
  y: number
  w: number
  h: number
  /** Laser-etched marking on the body, one entry per line. */
  marking: string[]
  /** Reference designator printed in silkscreen beside the footprint. */
  silk: string
  silkAt: Pt
  /** Status LED position (top-left of a 14x8 0603 LED). */
  led?: Pt
}

export type Trace = {
  /** Part this trace powers (its LED lights when the trace is live). */
  to: string
  pts: Pt[]
  width: number
  /**
   * Layout this trace belongs to. The bus leaves the board where the name
   * meets it: the left edge on the wide split stage, the bottom edge where
   * the name sits under the board (phones and tablets).
   */
  only?: 'wide' | 'narrow'
}

/** The split stage starts at Tailwind's lg breakpoint. */
export const WIDE_MIN = 1024

export const traceFor = (t: Trace, wide: boolean) =>
  !t.only || t.only === (wide ? 'wide' : 'narrow')

export const BOARD = { w: 600, h: 760 }

/** Pin (lead) size shared by every leaded package, and every signal trace's width. */
export const PIN = { w: 5, len: 12 }

/* ------------------------------------------------------------ geometry */

/** The central MCU and its pin pitch: everything else routes to these tips. */
const U1 = { x: 214, y: 262, w: 172, h: 172, n: 10 }
const U1_PITCH = U1.w / U1.n

/** Outer tip of U1's pin k (0..9) on a side, where a trace begins. */
function u1(side: 't' | 'b' | 'l' | 'r', k: number): Pt {
  const along = U1_PITCH * (k + 0.5)
  switch (side) {
    case 't':
      return [U1.x + along, U1.y - PIN.len]
    case 'b':
      return [U1.x + along, U1.y + U1.h + PIN.len]
    case 'l':
      return [U1.x - PIN.len, U1.y + along]
    case 'r':
      return [U1.x + U1.w + PIN.len, U1.y + along]
  }
}

const round = (p: Pt): Pt => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]

/** A route through the given points, rounded to a tenth of a unit. */
const route = (...p: Pt[]): Pt[] => p.map(round)

/** Copper of every pin and pad on a package, shared by the SVG and the 3D scene. */
export function pinRects(p: BoardPart): Rect[] {
  const out: Rect[] = []
  const half = PIN.w / 2
  switch (p.pkg) {
    case 'mcu': {
      const n = U1.n
      const pitch = p.w / n
      for (let i = 0; i < n; i++) {
        const cx = p.x + pitch * (i + 0.5)
        const cy = p.y + pitch * (i + 0.5)
        out.push(
          { x: cx - half, y: p.y - PIN.len, w: PIN.w, h: PIN.len },
          { x: cx - half, y: p.y + p.h, w: PIN.w, h: PIN.len },
          { x: p.x - PIN.len, y: cy - half, w: PIN.len, h: PIN.w },
          { x: p.x + p.w, y: cy - half, w: PIN.len, h: PIN.w },
        )
      }
      break
    }
    case 'soic': {
      const n = 4
      const pitch = p.h / n
      for (let i = 0; i < n; i++) {
        const cy = p.y + pitch * (i + 0.5)
        out.push(
          { x: p.x - PIN.len, y: cy - half, w: PIN.len, h: PIN.w },
          { x: p.x + p.w, y: cy - half, w: PIN.len, h: PIN.w },
        )
      }
      break
    }
    case 'qfn': {
      // pads sit at the body edge: 6 showing, 3 tucked under the body
      const n = 4
      const pitch = p.w / n
      for (let i = 0; i < n; i++) {
        const cx = p.x + pitch * (i + 0.5)
        const cy = p.y + pitch * (i + 0.5)
        out.push(
          { x: cx - half, y: p.y - 6, w: PIN.w, h: 9 },
          { x: cx - half, y: p.y + p.h - 3, w: PIN.w, h: 9 },
          { x: p.x - 6, y: cy - half, w: 9, h: PIN.w },
          { x: p.x + p.w - 3, y: cy - half, w: 9, h: PIN.w },
        )
      }
      break
    }
    case 'sot223': {
      for (const f of [0.18, 0.5, 0.82]) {
        out.push({ x: p.x + p.w * f - half, y: p.y + p.h, w: PIN.w, h: PIN.len })
      }
      out.push({ x: p.x + 8, y: p.y - 10, w: p.w - 16, h: 10 })
      break
    }
    case 'button': {
      for (const y of [p.y + 6, p.y + p.h - 12]) {
        out.push({ x: p.x - 8, y, w: 8, h: 6 }, { x: p.x + p.w, y, w: 8, h: 6 })
      }
      break
    }
    case 'crystal':
      out.push({ x: p.x - 8, y: p.y + p.h / 2 - 8, w: p.w + 16, h: 16 })
      break
  }
  return out
}

/* --------------------------------------------------------------- parts */

export const PARTS: BoardPart[] = [
  {
    id: 'u1',
    node: null,
    pkg: 'mcu',
    ...U1,
    marking: ['EVENDEN-', 'WALLICK', 'CPE 2028'],
    silk: 'U1',
    silkAt: [409, 250],
  },
  {
    id: 'lockheed',
    node: 'lockheed',
    pkg: 'shield',
    x: 40,
    y: 56,
    w: 176,
    h: 124,
    marking: ['LOCKHEED', 'MARTIN'],
    silk: 'U2',
    silkAt: [33, 43],
    led: [228, 64],
  },
  {
    id: 'home-depot',
    node: 'home-depot',
    pkg: 'bga',
    x: 384,
    y: 48,
    w: 168,
    h: 132,
    marking: ['THE HOME', 'DEPOT'],
    silk: 'U3',
    silkAt: [377, 35],
    led: [358, 56],
  },
  {
    id: 'limbitless',
    node: 'limbitless',
    pkg: 'module',
    x: 430,
    y: 288,
    w: 132,
    h: 200,
    marking: ['LIMBITLESS', 'SOLUTIONS'],
    silk: 'U4',
    silkAt: [423, 275],
    led: [404, 296],
  },
  {
    id: 'finfrock',
    node: 'finfrock',
    pkg: 'soic',
    // pin pitch matches U1's, so its pins line up with U1's left pins
    x: 52,
    y: U1.y,
    w: 120,
    h: U1_PITCH * 4,
    marking: ['FINFROCK'],
    silk: 'U5',
    silkAt: [33, 249],
    led: [52, 346],
  },
  {
    id: 'volunteer-hub',
    node: 'volunteer-hub',
    pkg: 'qfn',
    x: 322,
    y: 552,
    w: 76,
    h: 76,
    marking: ['VOLUNTEER', 'HUB'],
    silk: 'U6',
    silkAt: [299, 533],
    led: [412, 560],
  },
  {
    id: 'pep-25',
    node: 'pep-25',
    pkg: 'qfn',
    x: 190,
    y: 610,
    w: 64,
    h: 64,
    marking: ['PEP', '25'],
    silk: 'U8',
    silkAt: [270, 606],
    led: [264, 640],
  },
  {
    id: 'ucf',
    node: 'ucf',
    pkg: 'crystal',
    x: 470,
    y: 576,
    w: 92,
    h: 40,
    marking: ['UCF'],
    silk: 'Y1',
    silkAt: [455, 563],
    led: [540, 556],
  },
  {
    // the regulator that feeds U1: 5 V in, 3.3 V out
    id: 'ldo',
    node: null,
    pkg: 'sot223',
    x: U1.x + U1_PITCH * 4.5 - 28,
    y: 70,
    w: 56,
    h: 30,
    marking: ['1117'],
    silk: 'U7',
    silkAt: [262, 134],
  },
  {
    id: 'reset',
    node: null,
    pkg: 'button',
    x: 470,
    y: 662,
    w: 34,
    h: 34,
    marking: [],
    silk: 'SW1',
    silkAt: [455, 647],
  },
]

/* -------------------------------------------------------------- copper */

const W = PIN.w

/** 45-degree routed traces from U1's pin tips out to each part. */
export const TRACES: Trace[] = [
  // U1 top pins 1, 2 -> Lockheed shield (end under the can)
  { to: 'lockheed', width: W, pts: route(u1('t', 1), [u1('t', 1)[0], 222], [196, 178.2], [196, 168]) },
  { to: 'lockheed', width: W, pts: route(u1('t', 2), [u1('t', 2)[0], 214], [216, 173], [206, 173]) },
  // U1 top pins 7, 8 -> Home Depot BGA (end under the body)
  { to: 'home-depot', width: W, pts: route(u1('t', 7), [u1('t', 7)[0], 222], [392, 173]) },
  { to: 'home-depot', width: W, pts: route(u1('t', 8), [u1('t', 8)[0], 230], [410.2, 180], [410.2, 170]) },
  // U1 right pins 3-5 -> Limbitless module (under its edge)
  ...[3, 4, 5].map((k) => ({
    to: 'limbitless',
    width: W,
    pts: route(u1('r', k), [440, u1('r', k)[1]]),
  })),
  // U1 left pins 1, 2 -> FINFROCK SOIC: tip to tip, dead straight
  ...[1, 2].map((k) => ({
    to: 'finfrock',
    width: W,
    pts: route(u1('l', k), [52 + 120 + PIN.len, u1('l', k)[1]]),
  })),
  // U1 bottom pins 7, 8 -> Volunteer Hub QFN top pads 1, 2
  { to: 'volunteer-hub', width: W, pts: route(u1('b', 7), [u1('b', 7)[0], 490], [350.5, 497.5], [350.5, 546]) },
  { to: 'volunteer-hub', width: W, pts: route(u1('b', 8), [u1('b', 8)[0], 490], [369.5, 499.3], [369.5, 546]) },
  // U1 bottom pin 5 -> PEP 25: down past the Volunteer Hub chip, then in from the right
  { to: 'pep-25', width: W, pts: route(u1('b', 5), [u1('b', 5)[0], 596], [286.6, 618], [260, 618]) },
  // U1 right pin 8 -> UCF crystal: down past the module, then under the can
  { to: 'ucf', width: W, pts: route(u1('r', 8), [412, 422.2], [412, 486], [426, 500], [500, 500], [500, 586]) },
  // power: the regulator's output pin straight down into U1 top pin 4
  { to: 'u1', width: W, pts: route([u1('t', 4)[0], 112], u1('t', 4)) },
  // the reset switch to a via
  { to: 'u1', width: W, pts: [[512, 671], [540, 671]] },
  // the bus: from the board edge under the end of the name into U1 bottom pins 2, 3
  { to: 'u1', only: 'wide', width: W, pts: route([0, 492], [225, 492], [u1('b', 2)[0], 460], u1('b', 2)) },
  { to: 'u1', only: 'wide', width: W, pts: route([0, 518], [232.2, 518], [u1('b', 3)[0], 476], u1('b', 3)) },
  // narrow layouts: the name sits under the board, so the bus drops out of its bottom edge
  { to: 'u1', only: 'narrow', width: W, pts: route([96, 760], [96, 630], [u1('b', 2)[0], 469], u1('b', 2)) },
  { to: 'u1', only: 'narrow', width: W, pts: route([124, 760], [124, 642], [u1('b', 3)[0], 491.8], u1('b', 3)) },
]

/** Plated through-holes: on bends of shared routes, and a few stitching vias. */
export const VIAS: Pt[] = [
  round([u1('t', 1)[0], 222]),
  round([u1('t', 7)[0], 222]),
  [412, 486],
  [540, 671],
  [130, 236],
  [560, 230],
  [560, 700],
]

/** Test points: bare copper rings an engineer can probe. */
export const TEST_POINTS: Pt[] = [[318, 150]]

/** Small passives: 0603 resistors and capacitors. x, y is the top-left. */
export type Passive = { x: number; y: number; kind: 'r' | 'c'; vertical?: boolean }

export const PASSIVE_SIZE = { len: 18, wide: 9, pad: 5 }

export const PASSIVES: Passive[] = [
  // decoupling capacitors hugging U1
  { x: 402, y: 214, kind: 'c' },
  { x: 176, y: 224, kind: 'c' },
  { x: 288, y: 452, kind: 'r', vertical: true },
  { x: 440, y: 404, kind: 'c', vertical: true },
  // the regulator's input and output capacitors
  { x: 230, y: 80, kind: 'c' },
  { x: 336, y: 80, kind: 'c' },
  // Lockheed's pull-ups
  { x: 56, y: 204, kind: 'r' },
  { x: 82, y: 204, kind: 'r' },
  { x: 108, y: 204, kind: 'r' },
  // the rest
  { x: 540, y: 198, kind: 'c' },
  { x: 86, y: 560, kind: 'r' },
  { x: 60, y: 590, kind: 'c' },
  { x: 150, y: 700, kind: 'c' },
  { x: 506, y: 534, kind: 'r' },
]

/** Pads, body and size of a passive, in artboard units. */
export function passiveRects(p: Passive) {
  const { len, wide, pad } = PASSIVE_SIZE
  const r = (x: number, y: number, w: number, h: number) =>
    p.vertical ? { x: p.x + y, y: p.y + x, w: h, h: w } : { x: p.x + x, y: p.y + y, w, h }
  return {
    padA: r(0, 0, pad, wide),
    padB: r(len - pad, 0, pad, wide),
    body: r(pad - 1, 0.5, len - pad * 2 + 2, wide - 1),
  }
}

/** Mounting holes in the board corners. */
export const MOUNTS: Pt[] = [
  [20, 20],
  [580, 20],
  [580, 740],
]

/** Polyline arc length, used to draw traces along their length. */
export function polyLength(pts: Pt[]) {
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  }
  return len
}

/**
 * Where the artboard sits inside a stage rect when fitted with
 * `preserveAspectRatio="xMidYMid meet"`.
 */
export function fitBoard(stage: { x: number; y: number; width: number; height: number }) {
  const s = Math.min(stage.width / BOARD.w, stage.height / BOARD.h)
  return {
    scale: s,
    x: stage.x + (stage.width - BOARD.w * s) / 2,
    y: stage.y + (stage.height - BOARD.h * s) / 2,
  }
}
