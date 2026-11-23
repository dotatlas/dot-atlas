import { SKILLS } from '@/config/portfolio-content'

/**
 * Skills, said plainly: three groups side by side, each skill on a copper pad
 * like the entries' details, with where it was used underneath when the
 * resume ties it to a role or project.
 */
export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h" className="mt-(--section-gap) scroll-mt-16 px-(--gutter)">
      <div className="max-w-[36rem] xl:max-w-[42rem]">
        <h2 id="skills-h" className="t-title" data-wipe>
          Skills
        </h2>
        <p className="t-lead mt-6 text-silk-2" data-reveal>
          The languages, embedded hardware and tools I work with, and where I used each one.
        </p>
      </div>

      <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {SKILLS.map((g, gi) => (
          <div key={g.name} data-reveal style={{ '--i': gi } as React.CSSProperties}>
            <h3 className="t-lead m-0 border-b-2 border-copper-dim pb-3 font-extrabold [font-variation-settings:'wdth'_90]">
              {g.name}
            </h3>
            <ul className="m-0 mt-5 flex list-none flex-col gap-4 p-0">
              {g.items.map((it) => (
                <li key={it.name} className="relative pl-7">
                  <span aria-hidden className="absolute top-[0.62em] left-0 size-2 bg-copper" />
                  <span className="font-semibold">{it.name}</span>
                  {it.usedIn && <span className="t-small block text-silk-2">{it.usedIn}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
