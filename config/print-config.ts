/**
 * Timing and materials for the intro: a desktop PCB mill makes the board.
 *
 * World units are CSS pixels: X runs right, Z runs down the screen, Y is up
 * out of the board. The final camera frame is a straight-down orthographic
 * view at zoom 1, so one world unit lands on exactly one CSS pixel and the
 * milled board sits precisely on the SVG board underneath.
 *
 * `flat` colours must equal the CSS tokens in app/globals.css: at the end
 * every material blends to its flat colour, unlit, so the crossfade into the
 * page is invisible.
 */

export const PRINT_TIMELINE = {
  /** The blank board rises onto the bed. */
  blank: [0, 0.55] as const,
  /** Drilled holes and pads appear on the blank. */
  fixtures: [0.35, 0.8] as const,
  /** The spindle comes down onto the first trace. */
  descend: [0.45, 1.1] as const,
  /** Copper traces, engraved in order with the bit on the surface. */
  traces: [1.1, 4.3] as const,
  /** The spindle lifts clear. */
  lift: [4.3, 4.7] as const,
  /** Components settle into their footprints. */
  parts: [4.35, 5.35] as const,
  /** The machine (bed, rails, gantry, spindle) fades away, leaving the board. */
  machineFade: [4.75, 5.65] as const,
  /** Hero shot: the machine framed and centred, a slow drift and push-in. */
  hero: [0, 4.5] as const,
  /** The glide: to straight down over the page, landing pixel-exact. */
  glide: [4.5, 6.3] as const,
  /** Materials blend to their flat page colours. */
  flatten: [5.7, 6.3] as const,
  /** Overlay fade into the page, seconds. */
  fade: 0.5,
  total: 6.45,
}

export const PRINT_CAMERA = {
  /** Hero angle from straight down, start and end of the drift, radians. */
  heroPolar: [1.06, 0.9] as const,
  /** Hero azimuth, start and end of the drift, radians. */
  heroAzimuth: [-0.52, -0.3] as const,
  heroFov: 28,
  /** The hero frame closes in by this factor over the shot. */
  push: 0.78,
  /** Share of the frame the machine may fill in the hero shot. */
  fill: 0.86,
  /**
   * Field of view at the hand-off. Narrow enough that the perspective
   * camera is effectively orthographic, so one world unit lands on one CSS
   * pixel on the board's top plane.
   */
  endFov: 1.2,
}

export const PRINT_SIZES = {
  boardThickness: 14,
  traceHeight: 3,
  padHeight: 3.5,
  /** Body heights per package, world units. */
  body: {
    mcu: 15,
    bga: 12,
    shield: 20,
    module: 13,
    soic: 10,
    qfn: 8,
    crystal: 13,
    sot223: 10,
    button: 12,
  },
  /** Clearance the bit lifts to when travelling between traces. */
  travelHop: 14,
  /** How far the spindle lifts once the copper is done. */
  park: 60,
}

/** Lit colour for each material, and the flat colour it ends on (CSS token). */
export const PRINT_MATERIALS = {
  ground: { lit: '#0a0b0a', flat: '#0e100f', metal: 0, rough: 0.95 },
  board: { lit: '#262b28', flat: '#151816', metal: 0, rough: 0.8 },
  copper: { lit: '#e2b85e', flat: '#d4ab55', metal: 0.65, rough: 0.35 },
  copperDim: { lit: '#e2b85e', flat: '#5c4b29', metal: 0.65, rough: 0.35 },
  chip: { lit: '#2a2e2c', flat: '#1c1e1d', metal: 0, rough: 0.55 },
  chipTop: { lit: '#333835', flat: '#202321', metal: 0, rough: 0.6 },
  shield: { lit: '#a9ada7', flat: '#8e928c', metal: 1, rough: 0.38 },
  shieldTop: { lit: '#b5b9b3', flat: '#9a9e98', metal: 1, rough: 0.34 },
  bga: { lit: '#3a3f3c', flat: '#2a2e2c', metal: 0, rough: 0.55 },
  bgaTop: { lit: '#454b47', flat: '#353a37', metal: 0, rough: 0.6 },
  header: { lit: '#171918', flat: '#131514', metal: 0, rough: 0.7 },
  hole: { lit: '#070807', flat: '#090a09', metal: 0, rough: 1 },
  /** The board's cut edge: glass-fibre FR4, only ever seen from the side. */
  fr4: { lit: '#59613f', flat: '#151816', metal: 0, rough: 0.7 },
  resistor: { lit: '#1e1f1e', flat: '#1b1c1b', metal: 0, rough: 0.6 },
  cap: { lit: '#c4a779', flat: '#a88f68', metal: 0, rough: 0.55 },
} as const

export type PrintMaterialKey = keyof typeof PRINT_MATERIALS

/** The desktop PCB mill: bed, rails, gantry, spindle. */
export const MILL = {
  carbide: '#8f959a',
  steel: '#c3c7c9',
  spindle: '#26292b',
  plate: '#9aa1a4',
  frame: '#2c3033',
  bed: '#4a5054',
  slot: '#1c1f21',
  led: '#ff4433',
  /** Spindle speed while cutting, radians per second (visual only). */
  spin: 38,
}

export const INTRO_SESSION_KEY = 'jew-board-printed'
