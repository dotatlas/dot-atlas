import {
  BOARD,
  MOUNTS,
  PARTS,
  PASSIVES,
  TRACES,
  VIAS,
  passiveRects,
  pinRects,
  traceFor,
  type BoardPart,
  type Rect,
} from '@/config/board'

/** Site tokens (app/globals.css), as literals: link-preview renderers have no CSS variables. */
export const C = {
  mask: '#0e100f',
  raised: '#151816',
  deep: '#090a09',
  chip: '#1c1e1d',
  copper: '#d4ab55',
  copperDim: '#5c4b29',
  silk: '#ecebe7',
  silk2: '#a9aba4',
  shield: '#8e928c',
  led: '#ff4433',
}

const r = (q: Rect, fill: string, key: string) => <rect key={key} x={q.x} y={q.y} width={q.w} height={q.h} fill={fill} />

const BODY: Record<BoardPart['pkg'], string> = {
  mcu: C.chip,
  bga: '#2a2e2c',
  shield: C.shield,
  module: C.chip,
  soic: C.chip,
  qfn: '#2a2e2c',
  crystal: C.shield,
  rj45: C.shield,
  terminal: C.chip,
}

/**
 * The hero board from config/board.ts, drawn plain for link previews and icons:
 * the same parts, copper and vias as the page, no labels (the renderer has no fonts in SVG).
 */
export function BoardArt({ width, height }: { width: number; height: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}>
      <rect width={BOARD.w} height={BOARD.h} fill={C.raised} />
      {TRACES.filter((t) => traceFor(t, true)).map((t, i) => (
        <polyline
          key={`t${i}`}
          points={t.pts.map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke={t.to === 'u1' ? C.copper : C.copperDim}
          strokeWidth={t.width}
          strokeLinejoin="round"
        />
      ))}
      {PASSIVES.map((p, i) => {
        const q = passiveRects(p)
        return (
          <g key={`p${i}`}>
            {r(q.padA, C.copper, 'a')}
            {r(q.padB, C.copper, 'b')}
            {r(q.body, p.kind === 'c' ? '#a88f68' : '#1b1c1b', 'c')}
          </g>
        )
      })}
      {PARTS.map((p) => (
        <g key={p.id}>
          {pinRects(p).map((q, i) => r(q, C.copper, `${p.id}${i}`))}
          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.pkg === 'crystal' ? p.h / 2 : 0} fill={BODY[p.pkg]} />
          {p.led && <rect x={p.led[0]} y={p.led[1] - 1} width={14} height={10} fill={p.id === 'hil-ecu' ? C.led : '#3a1512'} />}
        </g>
      ))}
      {[...VIAS, ...MOUNTS].map(([x, y], i) => (
        <g key={`v${i}`}>
          <circle cx={x} cy={y} r={i < VIAS.length ? 6.5 : 10} fill={C.copper} />
          <circle cx={x} cy={y} r={i < VIAS.length ? 2.6 : 5.5} fill={C.deep} />
        </g>
      ))}
    </svg>
  )
}
