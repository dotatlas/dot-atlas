/**
 * Photographs of the world around the work, from open collections. None of
 * them shows Joshua's own hardware; captions say what each one really is.
 * Source files, licences and download dates live in public/images/credits.json.
 * All are shown cropped and in greyscale.
 */

export type Photo = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
  credit: string
  href: string
}

export const PHOTOS = {
  pcb: {
    src: '/images/pcb-op-amps.jpg',
    width: 1800,
    height: 1192,
    alt: 'Macro of two JRC 4580 op-amp chips and surface-mount resistors on a black circuit board with white silkscreen labels',
    caption: 'Black solder mask, white silkscreen: two op-amps on a sound card.',
    credit: 'Samtoucan, CC BY-SA 3.0',
    href: 'https://commons.wikimedia.org/w/index.php?curid=73809537',
  },
  sensor: {
    src: '/images/image-sensor.jpg',
    width: 1600,
    height: 1066,
    alt: 'Macro of a camera image sensor die in its package, gold bond wires running from the die to the package pads',
    caption: 'A camera image sensor, bond wires and all: the kind of device the firmware drives.',
    credit: 'Zephyris, CC BY-SA 3.0',
    href: 'https://commons.wikimedia.org/w/index.php?curid=17281168',
  },
  guidance: {
    src: '/images/apollo-guidance-computer.jpg',
    width: 1600,
    height: 1282,
    alt: 'An Apollo Lunar Module inertial navigation system on a test frame: primary guidance computer, IMU sphere and wiring harnesses',
    caption: 'Flight hardware lineage: an Apollo Lunar Module guidance computer and IMU.',
    credit: 'Steve Jurvetson, CC BY 2.0',
    href: 'https://commons.wikimedia.org/w/index.php?curid=83033991',
  },
  esp32: {
    src: '/images/esp32-dev-board.jpg',
    width: 1600,
    height: 916,
    alt: 'An ESP32 development board mounted on a perfboard with red header pins',
    caption: 'An ESP32 development board, the microcontroller family behind the bionic firmware.',
    credit: 'Edwiyanto, CC BY-SA 4.0',
    href: 'https://commons.wikimedia.org/w/index.php?curid=157191667',
  },
} satisfies Record<string, Photo>

/** The one moving picture: a desktop mill cutting a circuit board, as a muted loop. */
export const PRINT_CLIP = {
  src: '/images/pcb-milling.webm',
  poster: '/images/pcb-milling-poster.jpg',
  width: 640,
  height: 360,
  credit: 'Rpez, CC BY-SA 4.0',
  href: 'https://commons.wikimedia.org/wiki/File:Fresadora_PCI_Jo%C3%A3o-de-Barro.ogv',
}
