'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BOARD,
  MOUNTS,
  PARTS,
  PASSIVES,
  TEST_POINTS,
  TRACES,
  VIAS,
  passiveRects,
  pinRects,
  polyLength,
  type BoardPart,
  type Pt,
  type Rect,
  type Trace,
} from '@/config/board'

type Props = {
  /** Part id whose LED is lit and whose traces carry current. */
  activeId: string | null
  /** Called with the portfolio node id when a component is pressed. */
  onSelect?: (nodeId: string) => void
  /** Silkscreen layer (designators, markings, LEDs) printed in. */
  silk: boolean
  /** Node titles, for accessible names on the pressable parts. */
  titles?: Record<string, string>
  className?: string
}

/** Bus variants show only in the layout they belong to (see Trace.only). */
const layoutClass = (t: Trace) =>
  t.only === 'wide' ? 'hidden lg:inline' : t.only === 'narrow' ? 'lg:hidden' : undefined

const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(' ')

const rectProps = (r: Rect) => ({ x: r.x, y: r.y, width: r.w, height: r.h })

export function CircuitBoard({ activeId, onSelect, silk, titles = {}, className }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const pulseRefs = useRef<Map<number, SVGPolylineElement>>(new Map())
  const lengths = useMemo(() => TRACES.map((t) => polyLength(t.pts)), [])

  // Route a pulse of current out along every trace feeding the newly active part.
  useEffect(() => {
    if (!activeId || !silk) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const anims: Animation[] = []
    TRACES.forEach((t, i) => {
      if (t.to !== activeId && t.to !== 'u1') return
      const el = pulseRefs.current.get(i)
      if (!el) return
      const len = lengths[i]
      const seg = 46
      el.style.strokeDasharray = `${seg} ${len + seg}`
      anims.push(
        el.animate(
          [{ strokeDashoffset: seg, opacity: 1 }, { strokeDashoffset: -len, opacity: 1 }],
          {
            duration: 520 + len * 1.1,
            delay: t.to === 'u1' ? 0 : 260,
            easing: 'cubic-bezier(0.45, 0, 0.2, 1)',
            fill: 'both',
          },
        ),
      )
    })
    return () => anims.forEach((a) => a.cancel())
  }, [activeId, silk, lengths])

  const live = (id: string) => id === activeId || id === hoverId

  return (
    <svg
      viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
      data-board
      className={className}
      role="group"
      aria-label="Circuit board: each component is one of Joshua's roles. Press one to read about it."
      data-silk={silk ? 'on' : 'off'}
    >
      <defs>
        <mask id="silk-scan" maskUnits="userSpaceOnUse">
          <rect
            width={BOARD.w}
            height={BOARD.h}
            fill="#fff"
            style={{
              transformOrigin: '0 0',
              transform: silk ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1300ms var(--ease-in-out)',
            }}
          />
        </mask>
      </defs>

      {/* substrate */}
      <rect width={BOARD.w} height={BOARD.h} fill="var(--mask-raised)" />

      {/* mounting holes */}
      {MOUNTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={10} fill="var(--copper)" />
          <circle cx={x} cy={y} r={5.5} fill="var(--mask-deep)" />
        </g>
      ))}

      {/* card-edge fingers where the bus leaves the board toward the name */}
      {TRACES.filter((t) => t.to === 'u1' && t.only).map((t, i) => {
        const [x, y] = t.pts[0]
        const bottom = y >= BOARD.h
        return (
          <rect
            key={i}
            className={layoutClass(t)}
            x={bottom ? x - 7 : 0}
            y={bottom ? BOARD.h - 26 : y - 7}
            width={bottom ? 14 : 26}
            height={bottom ? 26 : 14}
            fill="var(--copper)"
          />
        )
      })}

      {/* copper: pin-width traces with square ends, so they run flush out of each pin */}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="round">
        {TRACES.map((t, i) => (
          <polyline
            key={i}
            className={layoutClass(t)}
            points={pts(t.pts)}
            strokeWidth={t.width}
            stroke={live(t.to) || t.to === 'u1' ? 'var(--copper)' : 'var(--copper-dim)'}
            style={{ transition: 'stroke 400ms ease' }}
          />
        ))}
        {TRACES.map((t, i) => (
          <polyline
            key={`p${i}`}
            className={layoutClass(t)}
            ref={(el) => {
              if (el) pulseRefs.current.set(i, el)
            }}
            points={pts(t.pts)}
            strokeWidth={t.width}
            stroke="var(--copper-hot)"
            opacity={0}
          />
        ))}
      </g>

      {VIAS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={6.5} fill="var(--copper)" />
          <circle cx={x} cy={y} r={2.6} fill="var(--mask-deep)" />
        </g>
      ))}

      {TEST_POINTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill="var(--copper)" />
      ))}

      {/* passives */}
      {PASSIVES.map((p, i) => {
        const r = passiveRects(p)
        return (
          <g key={i}>
            <rect {...rectProps(r.padA)} fill="var(--copper)" />
            <rect {...rectProps(r.padB)} fill="var(--copper)" />
            <rect {...rectProps(r.body)} fill={p.kind === 'c' ? '#a88f68' : '#1b1c1b'} />
          </g>
        )
      })}

      {/* components */}
      {PARTS.map((p) => (
        <Part
          key={p.id}
          part={p}
          live={live(p.id)}
          label={p.node ? titles[p.node] : undefined}
          onSelect={p.node && onSelect ? () => onSelect(p.node!) : undefined}
          onHover={(on) => setHoverId(on ? p.id : null)}
        />
      ))}

      {/* silkscreen + LEDs, printed after the board itself */}
      <g mask="url(#silk-scan)" aria-hidden="true">
        {TEST_POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11} fill="none" stroke="var(--silk-2)" strokeWidth={1.6} />
        ))}
        {PARTS.map((p) => (
          <g key={p.id}>
            {/* reference designator: small and quiet, as on a real board */}
            <text
              x={p.silkAt[0]}
              y={p.silkAt[1]}
              fill="var(--silk-2)"
              fontSize={13}
              fontWeight={600}
              style={{ fontVariationSettings: "'wdth' 90" }}
            >
              {p.silk}
            </text>
            <Corners part={p} live={live(p.id)} />
            {p.marking.length > 0 && <Marking part={p} />}
            {p.led && <Led at={p.led} on={live(p.id)} />}
          </g>
        ))}
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- packages */

function Part({
  part: p,
  live,
  label,
  onSelect,
  onHover,
}: {
  part: BoardPart
  live: boolean
  label?: string
  onSelect?: () => void
  onHover: (on: boolean) => void
}) {
  const interactive = Boolean(onSelect)
  return (
    <g
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Read about ${label ?? p.id}` : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect()
        }
      }}
      onPointerEnter={interactive ? () => onHover(true) : undefined}
      onPointerLeave={interactive ? () => onHover(false) : undefined}
      onFocus={interactive ? () => onHover(true) : undefined}
      onBlur={interactive ? () => onHover(false) : undefined}
      className={interactive ? 'board-part' : undefined}
      data-live={live || undefined}
    >
      {/* generous invisible hit area */}
      {interactive && (
        <rect x={p.x - 10} y={p.y - 10} width={p.w + 20} height={p.h + 20} fill="transparent" />
      )}
      {/* pins first, so the body sits over their inner ends */}
      {pinRects(p).map((r, i) => (
        <rect key={i} {...rectProps(r)} fill="var(--copper)" />
      ))}
      <Body part={p} />
    </g>
  )
}

function Body({ part: p }: { part: BoardPart }) {
  switch (p.pkg) {
    case 'mcu':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--chip)" />
          <circle cx={p.x + 18} cy={p.y + 18} r={6} fill="#2a2d2b" />
        </>
      )
    case 'bga':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#2a2e2c" />
          <rect x={p.x + 10} y={p.y + 10} width={p.w - 20} height={p.h - 20} fill="#353a37" />
        </>
      )
    case 'shield':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--shield)" />
          <rect x={p.x + 8} y={p.y + 8} width={p.w - 16} height={p.h - 16} fill="#9a9e98" />
        </>
      )
    case 'module': {
      const can = p.h * 0.66
      const ax = p.x + 14
      const ay = p.y + can + 16
      const meander: Pt[] = []
      for (let i = 0; i < 6; i++) {
        const x = ax + i * 18
        meander.push([x, ay], [x, ay + 30], [x + 9, ay + 30], [x + 9, ay])
      }
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--chip)" />
          <rect x={p.x + 6} y={p.y + 6} width={p.w - 12} height={can - 6} fill="var(--shield)" />
          <polyline points={pts(meander)} fill="none" stroke="var(--copper)" strokeWidth={3.5} strokeLinejoin="miter" />
        </>
      )
    }
    case 'soic':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--chip)" />
          <circle cx={p.x + 12} cy={p.y + 12} r={4} fill="#2a2d2b" />
        </>
      )
    case 'qfn':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#2a2e2c" />
          <circle cx={p.x + 10} cy={p.y + 10} r={3.5} fill="#2a2d2b" />
        </>
      )
    case 'crystal':
      return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.h / 2} fill="var(--shield)" />
    case 'sot223':
      return <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--chip)" />
    case 'button':
      return (
        <>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#2b2e2c" />
          <circle cx={p.x + p.w / 2} cy={p.y + p.h / 2} r={p.w * 0.3} fill="#141615" />
        </>
      )
  }
}

/** The part's full copper and body extent, for its courtyard brackets. */
function extent(p: BoardPart): Rect {
  let x0 = p.x
  let y0 = p.y
  let x1 = p.x + p.w
  let y1 = p.y + p.h
  for (const r of pinRects(p)) {
    x0 = Math.min(x0, r.x)
    y0 = Math.min(y0, r.y)
    x1 = Math.max(x1, r.x + r.w)
    y1 = Math.max(y1, r.y + r.h)
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

/** Silkscreen corner marks framing a footprint; red while its role is being read. */
function Corners({ part: p, live }: { part: BoardPart; live: boolean }) {
  const e = extent(p)
  const o = 7
  const x0 = e.x - o
  const y0 = e.y - o
  const x1 = e.x + e.w + o
  const y1 = e.y + e.h + o
  const k = Math.min(12, (x1 - x0) / 3, (y1 - y0) / 3)
  const d = [
    `M${x0} ${y0 + k}V${y0}H${x0 + k}`,
    `M${x1 - k} ${y0}H${x1}V${y0 + k}`,
    `M${x1} ${y1 - k}V${y1}H${x1 - k}`,
    `M${x0 + k} ${y1}H${x0}V${y1 - k}`,
  ].join('')
  return (
    <path
      d={d}
      fill="none"
      stroke={live ? 'var(--led)' : 'var(--silk)'}
      strokeWidth={live ? 3.5 : 2}
      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
    />
  )
}

function Marking({ part: p }: { part: BoardPart }) {
  const light = p.pkg === 'shield' || p.pkg === 'crystal' || p.pkg === 'module'
  const size =
    p.pkg === 'mcu' ? 22 : p.pkg === 'crystal' ? 15 : p.pkg === 'sot223' ? 12 : p.pkg === 'qfn' ? 13 : 16
  const lineH = size * 1.05
  const cx = p.x + p.w / 2
  const top = p.pkg === 'module' ? p.y + p.h * 0.33 : p.y + p.h / 2
  const start = top - ((p.marking.length - 1) * lineH) / 2
  return (
    <text
      x={cx}
      textAnchor="middle"
      fill={light ? '#2b2e2c' : 'var(--chip-mark)'}
      fontSize={size}
      fontWeight={800}
      style={{ fontVariationSettings: "'wdth' 80" }}
    >
      {p.marking.map((line, i) => (
        <tspan key={i} x={cx} y={start + i * lineH} dominantBaseline="central">
          {line}
        </tspan>
      ))}
    </text>
  )
}

function Led({ at: [x, y], on }: { at: Pt; on: boolean }) {
  return (
    <g>
      <rect x={x - 4} y={y} width={4} height={8} fill="var(--copper)" />
      <rect x={x + 14} y={y} width={4} height={8} fill="var(--copper)" />
      <rect
        x={x}
        y={y - 1}
        width={14}
        height={10}
        fill={on ? 'var(--led)' : 'var(--led-off)'}
        style={{ transition: 'fill 160ms ease' }}
      />
    </g>
  )
}
