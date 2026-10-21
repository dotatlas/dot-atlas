import { BOM } from '@/config/portfolio-content'

/** Reference designator prefix per group: ICs, connectors, modules. */
const PREFIX: Record<string, string> = {
  Languages: 'U',
  'Frameworks and libraries': 'J',
  'Tools and platforms': 'M',
}

/**
 * Skills set as a real bill of materials: designator, part, and the role it
 * was fitted in. Parts the CV lists without a role go on one closing line,
 * so no row is left blank.
 */
export function Bom() {
  const loose = BOM.flatMap((g) => g.items.filter((it) => !it.usedIn).map((it) => it.part))

  return (
    <section
      id="skills"
      aria-labelledby="skills-h"
      className="mt-(--section-gap) grid scroll-mt-16 gap-12 px-(--gutter) lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-16">
          <h2 id="skills-h" className="t-title" data-wipe>
            Bill of materials
          </h2>
          <p className="t-lead mt-6" data-reveal>
            The parts the work above was built from, and the role each one was fitted in.
          </p>
        </div>
      </div>

      <div className="lg:col-span-8">
        <table className="bom w-full border-collapse text-left">
          <caption className="sr-only">Skills and the roles where each was used</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[4.5rem]">Ref</th>
              <th scope="col">Part</th>
              <th scope="col" className="hidden sm:table-cell">Fitted in</th>
            </tr>
          </thead>
          {BOM.map((g) => {
            const fitted = g.items.filter((it) => it.usedIn)
            return (
              <tbody key={g.name}>
                <tr className="bom-group">
                  <th scope="rowgroup" colSpan={3}>
                    {g.name}
                  </th>
                </tr>
                {fitted.map((it, i) => (
                  <tr key={it.part} data-reveal style={{ '--i': i } as React.CSSProperties}>
                    <td className="tabular text-copper">
                      {PREFIX[g.name]}
                      {i + 1}
                    </td>
                    <td className="font-semibold">
                      {it.part}
                      <span className="block font-normal text-silk-2 sm:hidden">{it.usedIn}</span>
                    </td>
                    <td className="hidden text-silk-2 sm:table-cell">{it.usedIn}</td>
                  </tr>
                ))}
              </tbody>
            )
          })}
        </table>
        <p className="mt-10 max-w-[56ch]" data-reveal>
          <span className="font-semibold">Also fitted: </span>
          <span className="text-silk-2">{loose.join(', ')}.</span>
        </p>
      </div>
    </section>
  )
}
