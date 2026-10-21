'use client'

import { useEffect, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { PROFILE } from '@/config/portfolio-content'

type Kind = 'linkedin' | 'github' | 'email' | 'copy'
type Signal = { kind: Kind; at: number }

/** The OLED's pixel face (DESIGN.md typography.oled); a device screen, not prose. */
const OLED_FACE = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' // taste-skill-ignore

/** What the screen says first, for each way in. */
const OPENED: Record<Kind, string> = {
  linkedin: 'LINKEDIN OPENED',
  github: 'GITHUB OPENED',
  email: 'EMAIL OPENED',
  copy: 'ADDRESS COPIED',
}

/** The input net each way in arrives on. */
const NET: Record<Kind, number> = { linkedin: 0, github: 1, email: 2, copy: 2 }

/**
 * The close: a field of red solder mask with the address and three ways in,
 * wired to a small circuit. Any of them sends a signal down its input net:
 * the microcontroller lights the status LED green and writes a reply to the
 * OLED over I2C.
 */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const [signal, setSignal] = useState<Signal | null>(null)

  const send = (kind: Kind) => setSignal({ kind, at: Date.now() })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      send('copy')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      send('email')
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-h"
      className="relative mt-(--section-gap) grid items-center gap-12 overflow-hidden bg-mask-red px-(--gutter) py-24 sm:py-32 lg:grid-cols-12 lg:gap-8"
    >
      <MountingHoles />
      <div className="relative lg:col-span-6">
        <h2 id="contact-h" className="t-display w-max max-w-full" data-wipe>
          Let’s talk.
        </h2>
        <p className="t-lead mt-8 max-w-[34ch]" data-reveal>
          Email is the fastest way to reach me. Tap the address to copy it.
        </p>

        <button
          type="button"
          onClick={copy}
          className="t-title mt-12 block max-w-full cursor-copy truncate border-0 bg-transparent p-0 text-left font-extrabold text-silk transition-transform duration-150 ease-out [font-variation-settings:'wdth'_80] active:scale-[0.98]"
          aria-label={copied ? 'Email address copied' : `Copy email address ${PROFILE.email}`}
          data-reveal
        >
          {/* keyed so each state blurs in fresh: the swap reads as one change */}
          <span key={copied ? 'copied' : 'email'} className="swap-in inline-block">
            {copied ? 'Copied to clipboard' : PROFILE.email}
          </span>
        </button>
        <span role="status" className="sr-only">
          {copied ? 'Email address copied to clipboard. ' : ''}
          {signal ? "Thanks. I'll get back to you as soon as possible." : ''}
        </span>

        <div className="mt-12 grid gap-2 sm:grid-cols-3" data-reveal>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => send('linkedin')}
            className="cell flex min-h-20 items-center justify-center gap-3 bg-(--mask-red-raised) font-bold no-underline"
          >
            <FaLinkedin aria-hidden className="size-5" /> LinkedIn
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => send('github')}
            className="cell flex min-h-20 items-center justify-center gap-3 bg-(--mask-red-raised) font-bold no-underline"
          >
            <FaGithub aria-hidden className="size-5" /> GitHub
          </a>
          <a
            href={`mailto:${PROFILE.email}?subject=Hello%20Joshua`}
            onClick={() => send('email')}
            className="cell flex min-h-20 items-center justify-center bg-silk font-bold text-mask-deep no-underline"
          >
            Send an email
          </a>
        </div>
      </div>
      <ReplyBoard signal={signal} />
    </section>
  )
}

/* the four mounting holes that make the red field a board, not a banner */
function MountingHoles() {
  const at = ['left-5 top-5', 'right-5 top-5', 'left-5 bottom-5', 'right-5 bottom-5']
  return (
    <>
      {at.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} size-6 rounded-full border-[5px] border-copper bg-mask-deep`}
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------ the circuit */

type P = [number, number]
const pts = (p: P[]) => p.map((q) => q.join(',')).join(' ')

/** U1, the microcontroller: four pins a side, 40 apart. */
const MCU = { x: 170, y: 96, w: 120, h: 160 }
const PIN = { w: 6, len: 14 }
const ROWS = [116, 156, 196, 236]

/** Inputs from the buttons, one net each, into U1's left pins. */
const INPUTS: { label: string; y: number }[] = [
  { label: 'LINKEDIN', y: ROWS[0] },
  { label: 'GITHUB', y: ROWS[1] },
  { label: 'EMAIL', y: ROWS[2] },
]

/** U1 -> R1 -> D1 -> ground: the status LED and its current-limiting resistor. */
const LED_NET: P[][] = [
  [
    [304, 116],
    [330, 116],
  ],
  [
    [378, 116],
    [420, 116],
  ],
  [
    [552, 116],
    [590, 116],
  ],
]

/** U1 -> the OLED's header over I2C, plus the module's power drops to vias. */
const SDA: P[] = [
  [304, 156],
  [396, 156],
  [492, 252],
  [492, 263],
]
const SCL: P[] = [
  [304, 196],
  [394, 196],
  [456, 258],
  [456, 263],
]
const POWER: P[][] = [
  [
    [384, 263],
    [384, 257],
  ],
  [
    [420, 263],
    [420, 257],
  ],
]

/** The module's four-pin header, 36 apart, with its pinout printed under it. */
const HEADER = [
  { x: 384, label: 'GND' },
  { x: 420, label: 'VCC' },
  { x: 456, label: 'SCL' },
  { x: 492, label: 'SDA' },
]

/** The screen's lines while it waits, and once a signal arrives. */
const IDLE = ['STATUS: READY', 'TAP A BUTTON', 'TO SAY HELLO']
const reply = (kind: Kind) => [OPENED[kind], 'THANKS!', "I'LL GET BACK", 'TO YOU ASAP.', '- JOSHUA']

/** Type the lines out, fast: one character every 22ms, line after line. */
function useTyping(lines: string[] | null, key: number, delay: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!lines) return
    const total = lines.reduce((n, l) => n + l.length, 0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(total)
      return
    }
    setCount(0)
    let n = 0
    let timer: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      timer = setInterval(() => {
        n += 1
        setCount(n)
        if (n >= total && timer) clearInterval(timer)
      }, 22)
    }, delay)
    return () => {
      clearTimeout(start)
      if (timer) clearInterval(timer)
    }
    // the key restarts the typing for every new signal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  if (!lines) return null
  let left = count
  return lines.map((l) => {
    const shown = l.slice(0, Math.max(0, left))
    left -= l.length
    return shown
  })
}

function ReplyBoard({ signal }: { signal: Signal | null }) {
  const lines = signal ? reply(signal.kind) : null
  const typed = useTyping(lines, signal?.at ?? 0, 620)
  const [lit, setLit] = useState(false)

  // the LED turns green once the signal has travelled through U1
  useEffect(() => {
    if (!signal) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setLit(true), reduce ? 0 : 560)
    return () => clearTimeout(t)
  }, [signal])

  const screen = typed ?? IDLE
  const typing = Boolean(typed && lines && typed.join('').length < lines.join('').length)
  const lastLine = screen.reduce((last, l, i) => (l.length ? i : last), 0)

  return (
    <svg
      viewBox="0 0 640 560"
      aria-hidden
      data-ui
      className="relative -mx-(--gutter) w-[calc(100%+2*var(--gutter))] lg:col-span-6 lg:mx-0 lg:w-full"
    >
      {/* input nets from the buttons, labelled at the board edge */}
      <g fill="none" strokeWidth={PIN.w} strokeLinecap="butt" strokeLinejoin="round">
        {INPUTS.map((inp) => (
          <polyline key={inp.label} points={pts([[0, inp.y], [MCU.x - PIN.len, inp.y]])} stroke="var(--copper)" />
        ))}
        {[...LED_NET, SDA, SCL, ...POWER].map((net, i) => (
          <polyline key={i} points={pts(net)} stroke="var(--copper)" />
        ))}

        {/* a signal's path, replayed for every press */}
        {signal && (
          <g key={signal.at}>
            <polyline
              points={pts([[0, INPUTS[NET[signal.kind]].y], [MCU.x - PIN.len, INPUTS[NET[signal.kind]].y]])}
              stroke="var(--copper-hot)"
              className="contact-pulse"
            />
            {[...LED_NET, SDA, SCL].map((net, i) => (
              <polyline
                key={i}
                points={pts(net)}
                stroke="var(--copper-hot)"
                className="contact-pulse"
                style={{ animationDelay: i < LED_NET.length ? `${300 + i * 90}ms` : '380ms' }}
              />
            ))}
          </g>
        )}
      </g>
      {INPUTS.map((inp) => (
        <text key={inp.label} x={16} y={inp.y - 12} fill="var(--silk)" fontSize={14} fontWeight={700}>
          {inp.label}
        </text>
      ))}

      {/* U1 */}
      {ROWS.map((y) => (
        <g key={y}>
          <rect x={MCU.x - PIN.len} y={y - PIN.w / 2} width={PIN.len} height={PIN.w} fill="var(--copper)" />
          <rect x={MCU.x + MCU.w} y={y - PIN.w / 2} width={PIN.len} height={PIN.w} fill="var(--copper)" />
        </g>
      ))}
      <rect x={MCU.x} y={MCU.y} width={MCU.w} height={MCU.h} fill="var(--chip)" />
      <circle cx={MCU.x + 14} cy={MCU.y + 14} r={5} fill="#2a2d2b" />
      <text
        x={MCU.x + MCU.w / 2}
        y={MCU.y + MCU.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--chip-mark)"
        fontSize={20}
        fontWeight={800}
        style={{ fontVariationSettings: "'wdth' 80" }}
      >
        ESP32
      </text>
      <text x={MCU.x} y={MCU.y - 12} fill="var(--silk)" fontSize={14} fontWeight={600}>
        U1
      </text>

      {/* R1, the LED's current-limiting resistor */}
      <rect x={330} y={107} width={12} height={18} fill="var(--copper)" />
      <rect x={366} y={107} width={12} height={18} fill="var(--copper)" />
      <rect x={340} y={108} width={28} height={16} fill="#1b1c1b" />
      <text x={330} y={95} fill="var(--silk)" fontSize={14} fontWeight={600}>
        R1
      </text>

      {/* D1, the status LED: red while it waits, green once it hears from you */}
      <rect x={420} y={84} width={26} height={64} fill="var(--copper)" />
      <rect x={526} y={84} width={26} height={64} fill="var(--copper)" />
      <rect
        x={446}
        y={88}
        width={80}
        height={56}
        fill={lit ? 'var(--led-green)' : 'var(--led)'}
        style={{ transition: 'fill 220ms var(--ease-out)' }}
      />
      <rect
        x={466}
        y={102}
        width={40}
        height={28}
        fill={lit ? 'var(--led-green-core)' : 'var(--led-hover)'}
        style={{ transition: 'fill 220ms var(--ease-out)' }}
      />
      <path d="M408 76 V68 H564 V76 M408 156 V164 H564 V156" fill="none" stroke="var(--silk)" strokeWidth={3} />
      <text x={408} y={56} fill="var(--silk)" fontSize={14} fontWeight={600}>
        D1
      </text>

      {/* vias: the LED's return and the OLED's power */}
      {[
        [590, 116],
        [384, 250],
        [420, 250],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={7} fill="var(--copper)" />
          <circle cx={x} cy={y} r={3} fill="var(--mask-deep)" />
        </g>
      ))}

      {/* U2: a 128x64 OLED module on its own little board */}
      <rect x={300} y={276} width={310} height={262} fill="var(--module)" />
      {[
        [316, 292],
        [594, 292],
        [316, 522],
        [594, 522],
      ].map(([x, y]) => (
        <g key={`m${x}-${y}`}>
          <circle cx={x} cy={y} r={7} fill="var(--copper)" />
          <circle cx={x} cy={y} r={3.5} fill="var(--mask-red)" />
        </g>
      ))}
      {HEADER.map((h, i) => (
        <g key={h.label}>
          {i === 0 ? (
            <rect x={h.x - 9} y={263} width={18} height={18} fill="var(--copper)" />
          ) : (
            <circle cx={h.x} cy={272} r={9} fill="var(--copper)" />
          )}
          <circle cx={h.x} cy={272} r={3.5} fill="var(--module)" />
          <text x={h.x} y={302} textAnchor="middle" fill="var(--silk)" fontSize={13} fontWeight={700}>
            {h.label}
          </text>
        </g>
      ))}
      <text x={300} y={270} fill="var(--silk)" fontSize={14} fontWeight={600}>
        U2
      </text>

      {/* the glass, and the reply on it */}
      <rect x={322} y={316} width={266} height={198} fill="var(--oled-glass)" />
      <g fontFamily={OLED_FACE} fontSize={19} fill="var(--oled)">
        {screen.map((line, i) => (
          <text key={i} x={340} y={350 + i * 30}>
            {line}
            {signal && i === lastLine && <tspan className={typing ? undefined : "oled-cursor"}>▌</tspan>}
          </text>
        ))}
        {!signal && (
          <text x={340} y={350 + IDLE.length * 30}>
            {'> '}
            <tspan className="oled-cursor">▌</tspan>
          </text>
        )}
      </g>
      <text x={455} y={531} textAnchor="middle" fill="var(--silk-2)" fontSize={13} fontWeight={600}>
        128×64 OLED
      </text>

      {/* fiducials */}
      {[
        [604, 36],
        [36, 524],
      ].map(([x, y]) => (
        <g key={`f${x}-${y}`}>
          <circle cx={x} cy={y} r={15} fill="var(--mask-red-raised)" />
          <circle cx={x} cy={y} r={7} fill="var(--copper)" />
        </g>
      ))}
    </svg>
  )
}
