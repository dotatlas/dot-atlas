import type { Entry } from '@/config/portfolio-content'

/**
 * A project's figure: how data moves through it, top to bottom. Each step is a
 * chip saying in plain words what happens there; the copper between two steps
 * is labelled with what travels along it. Every project uses this component,
 * so they share one look, while the steps come from the entry's `flow`. The
 * only motion is the copper filling once, in order, as the figure appears.
 */
export function ProjectFlow({ entry }: { entry: Entry }) {
  if (!entry.flow) return null
  return (
    <figure className="m-0 mt-10 bg-mask-raised p-4 sm:p-6" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
      <figcaption className="t-small m-0 mb-4 font-semibold text-silk-2">How the data flows</figcaption>
      <ol className="m-0 list-none p-0">
        {entry.flow.map((step, i) => (
          <li key={step.name}>
            {/* the package body colour the board's chips use, so each step reads as a part */}
            <div className="bg-[#2a2e2c] px-4 py-3">
              <p className="m-0 font-bold">{step.name}</p>
              <p className="m-0 mt-0.5 text-base text-silk-2">{step.detail}</p>
            </div>
            {step.then && (
              <div className="flex min-h-12 items-stretch gap-4 pl-6">
                <span aria-hidden className="flex shrink-0 gap-1.5">
                  {[0, 1].map((t) => (
                    <span key={t} className="flow-trace" style={{ '--d': `${i * 160 + t * 40}ms` } as React.CSSProperties} />
                  ))}
                </span>
                <span className="t-small self-center py-2 text-copper">{step.then}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}
