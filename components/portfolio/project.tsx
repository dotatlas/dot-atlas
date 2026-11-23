import type { Entry } from '@/config/portfolio-content'

/**
 * A project's figure: how it fits together, as four chips joined by copper.
 * Every project uses this one component, so all of them share the same frame,
 * size and feel; the stages themselves come from the entry's `flow`. The only
 * motion is the copper filling each link once as the figure appears.
 */
export function ProjectFlow({ entry }: { entry: Entry }) {
  if (!entry.flow) return null
  return (
    <figure className="m-0 mt-10 bg-mask-raised p-4 sm:p-5" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
      <ol aria-label={`How ${entry.title} fits together`} className="m-0 flex list-none flex-col p-0 sm:flex-row sm:items-stretch">
        {entry.flow.map((stage, i) => (
          <li key={stage.name} className="flex flex-col sm:flex-1 sm:flex-row">
            {i > 0 && <Link index={i} />}
            {/* the package body colour the board's chips use, so each stage reads as a part */}
            <div className="relative flex min-h-16 flex-1 flex-col justify-center bg-[#2a2e2c] px-4 py-3 sm:min-h-24 sm:px-3">
              <Pins left={i > 0} right={i < entry.flow!.length - 1} />
              <span className="font-bold leading-tight">{stage.name}</span>
              <span className="t-small text-silk-2">{stage.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  )
}

/** The copper between two chips: two traces, dim until the figure appears, then filled in order. */
function Link({ index }: { index: number }) {
  return (
    <span aria-hidden className="flow-link flex h-6 shrink-0 justify-center gap-1.5 self-stretch sm:h-auto sm:w-5 sm:flex-col xl:w-7">
      {[0, 1].map((t) => (
        <span key={t} className="flow-trace" style={{ '--d': `${index * 120 + t * 40}ms` } as React.CSSProperties} />
      ))}
    </span>
  )
}

/** Two copper pins on each linked side of a chip, lined up with the traces so pin and trace read as one line. */
function Pins({ left, right }: { left: boolean; right: boolean }) {
  const sides = [left && '-left-1.5', right && '-right-1.5'].filter(Boolean) as string[]
  return (
    <>
      {sides.map((side) => (
        <span key={side} aria-hidden className={`absolute inset-y-0 ${side} hidden flex-col justify-center gap-1.5 sm:flex`}>
          <span className="h-[3px] w-1.5 bg-copper" />
          <span className="h-[3px] w-1.5 bg-copper" />
        </span>
      ))}
    </>
  )
}
