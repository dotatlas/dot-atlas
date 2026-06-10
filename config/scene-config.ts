/**
 * ============================================================================
 *  SCENE CONFIG  —  single source of truth for the 3D print intro
 * ============================================================================
 *
 *  Everything visual/spatial about the Three.js intro lives here so you can
 *  tweak the experience WITHOUT touching component logic.
 *
 *  Coordinate system (right-handed, three.js default):
 *     +X = right,  +Y = up,  +Z = toward the camera (out of the screen)
 *
 *  Each model section below has:
 *    - file:      path to the STL inside /public (swap in your real STL here)
 *    - position:  [x, y, z] world-space offset
 *    - rotation:  [x, y, z] in RADIANS
 *    - scale:     [x, y, z] (or a single number applied uniformly)
 *    - color / material props
 *
 *  NOTE: Until you drop real STLs into /public, set `useStl: false` on a
 *  model and a procedural placeholder mesh (defined in the scene component)
 *  will be drawn instead. Flip `useStl: true` once the file exists.
 * ============================================================================
 */

export type Vec3 = [number, number, number]

/* -------------------------------------------------------------------------- */
/*  PRINT LAYER COLOR                                                          */
/* -------------------------------------------------------------------------- */
/**
 * The color of the filament the printer extrudes. This MUST match the CSS
 * `--background` token so the fade from 3D -> webpage is seamless.
 * Provided as both a hex (for three.js) and the matching CSS background.
 */
export const PRINT_LAYER_COLOR = {
  hex: '#242020',
  emissive: '#000000',
  metalness: 0.0,
  roughness: 0.85,
} as const

/* -------------------------------------------------------------------------- */
/*  CAMERA                                                                     */
/* -------------------------------------------------------------------------- */
export const CAMERA_CONFIG = {
  fov: 50,
  near: 0.1,
  far: 1000,
  /** Where the camera starts — as if you're sitting in a chair at the desk. */
  startPosition: [0, 6, 20] as Vec3,
  startLookAt: [0, 3, 0] as Vec3,
  /** Where the camera ends up after easing INSIDE the printer through the door. */
  insidePosition: [0, 4.2, 4.2] as Vec3,
  insideLookAt: [0, 4.2, -4] as Vec3,
  /** Easing duration (seconds) for the dolly-in. */
  dollyDuration: 2.0,
}

/* -------------------------------------------------------------------------- */
/*  LIGHTING                                                                   */
/* -------------------------------------------------------------------------- */
export const LIGHTING_CONFIG = {
  ambientIntensity: 0.65,
  keyLight: { position: [6, 12, 8] as Vec3, intensity: 1.1 },
  fillLight: { position: [-8, 6, 4] as Vec3, intensity: 0.5 },
  /** Subtle red rim that lives inside the printer chamber. */
  chamberLight: { position: [0, 7, -3] as Vec3, intensity: 0.8, color: '#ff3b30' },
}

/* -------------------------------------------------------------------------- */
/*  MODELS                                                                     */
/* -------------------------------------------------------------------------- */

/** The desk you're "sitting at" when the page opens. */
export const DESK_MODEL = {
  file: '/models/desk.stl',
  useStl: false,
  position: [0, -2, 0] as Vec3,
  rotation: [0, 0, 0] as Vec3,
  scale: [1, 1, 1] as Vec3,
  color: '#784208',
  metalness: 0.1,
  roughness: 0.8,
  /** Placeholder dimensions used when useStl=false (desktop top + legs). */
  placeholder: {
    topSize: [22, 0.6, 12] as Vec3,
    topY: 0,
    legHeight: 8,
    legInset: 1.2,
    legThickness: 0.6,
  },
}

/** The hollow cube "3D printer" sitting on the desk, with its door open. */
export const PRINTER_MODEL = {
  file: '/models/printer.stl',
  useStl: false,
  position: [0, 4.2, 0] as Vec3,
  rotation: [0, 0, 0] as Vec3,
  scale: [1, 1, 1] as Vec3,
  color: '#545454',
  metalness: 0.2,
  roughness: 0.7,
  /** Placeholder dimensions used when useStl=false. */
  placeholder: {
    /** Inner chamber size (the hollow space the camera flies into). */
    chamber: [12, 9, 12] as Vec3,
    /** Wall thickness of the cube shell. */
    wall: 0.4,
    /** Door is the front (+Z) face, rotated open on its left hinge. */
    doorOpenAngle: -1.9, // radians
    frameColor: '#545454',
  },
}

/** The 3D printer nozzle / toolhead that descends and "prints" the layers. */
export const NOZZLE_MODEL = {
  file: '/models/nozzle.stl',
  useStl: true,
  rotation: [0, 0, 0] as Vec3,
  scale: [0.03, 0.03, 0.03] as Vec3,
  color: '#edb35a',
  metalness: 0.9,
  roughness: 0.3,
  /** Starting Y (up high, off the top) and the Y it descends to before printing. */
  startY: 18,
  printY: 3,
  /** XZ home position of the nozzle (center of the build plate). */
  homeXZ: [0, 0] as [number, number],
  /** Seconds for the nozzle to descend before printing begins. */
  descendDuration: 1.4,
  placeholder: {
    /** Toolhead block size. */
    headSize: [2.4, 1.6, 2.4] as Vec3,
    /** Cone (the actual nozzle tip) height + radius. */
    nozzleHeight: 1.1,
    nozzleRadius: 0.45,
    headColor: '#3a3d42',
  },
  /**
   * EXTRUSION POINT OFFSET — where filament leaves the nozzle, RELATIVE to
   * the nozzle model's origin. Layers are spawned at (nozzlePos + this).
   */
  extrusionOffset: [0, -1.1, 0] as Vec3,
}

/** Per-axis scale for the cube attached to the top of the STL nozzle. */
export const NOZZLE_TOP_CUBE_SCALE = [1.2, 1.5, 1.2] as Vec3

/* -------------------------------------------------------------------------- */
/*  PRINTED LAYERS                                                             */
/* -------------------------------------------------------------------------- */
/**
 * The layers the nozzle extrudes. Each "layer" is a flat slab spawned at the
 * extrusion point as the nozzle sweeps left<->right and steps up. Tune the
 * sweep, layer geometry, color, and growth here.
 */
export const PRINT_LAYERS_CONFIG = {
  /** Shape of each printed segment: 'box' | 'cylinder'. */
  shape: 'box' as 'box' | 'cylinder',
  /** Color of every printed layer — kept equal to PRINT_LAYER_COLOR.hex. */
  color: PRINT_LAYER_COLOR.hex,
  emissive: '#070505',
  metalness: 0.0,
  roughness: 0.9,

  /** Scale (x, y, z) of a single extruded segment. */
  segmentScale: [1, 0.33, 1.2] as Vec3,

  /** How far the toolhead sweeps left and right from center (world units). */
  sweepHalfWidth: 3.2,
  /** Z depth range the layers cover (front-to-back of the chamber). */
  sweepHalfDepth: 0,
  /** Vertical step the nozzle rises after completing each layer pass. */
  layerHeightStep: 0.34,
  /** How many full back-and-forth layers to print before the screen is covered. */
  layerCount: 15,
  /** Segments deposited per single left->right (or right->left) pass. */
  segmentsPerPass: 14,
  /** Seconds the nozzle takes to traverse one pass. Lower = faster print. */
  passDuration: 0.3,
  /** Seconds each freshly printed segment takes to "settle" (scale-in). */
  segmentSettle: 0.13,
}

/* -------------------------------------------------------------------------- */
/*  TRANSITION / FADE                                                          */
/* -------------------------------------------------------------------------- */
export const TRANSITION_CONFIG = {
  /** Seconds for the final crossfade from the 3D canvas into the webpage. */
  fadeDuration: 1.1,
  /** Session storage key so the intro only plays once per session. */
  sessionKey: 'jew-intro-played',
}

/* -------------------------------------------------------------------------- */
/*  REUSABLE "PRINT-OVER-SCREEN" OVERLAY (for node expansions, etc.)          */
/* -------------------------------------------------------------------------- */
/**
 * Defaults for the reusable print-over transition that covers a PORTION of
 * the viewport (used when expanding carousel nodes). All values can be
 * overridden per-call.
 */
export const OVERLAY_PRINT_CONFIG = {
  layerColor: PRINT_LAYER_COLOR.hex,
  /** Rows of printed strips that fill the target region. */
  rows: 12,
  /** Seconds to print the whole region. */
  printDuration: 0.8,
  /** Heat-up + dissolve (reverse) timing when closing. */
  heatDuration: 0.55,
  dissolveDuration: 0.6,
  /** The glowing-hot color the block turns before dissolving. */
  hotColor: '#ff2d20',
}
