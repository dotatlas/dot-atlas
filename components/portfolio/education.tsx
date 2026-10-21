'use client'

import { useEffect, useState } from 'react'
import { SECTIONS } from '@/config/portfolio-content'

const UCF = SECTIONS.find((s) => s.id === 'education')!.nodes[0]
const START = new Date(2024, 7, 1) // Aug 2024
const END = new Date(2028, 4, 1) // May 2028

/**
 * The degree as a trace from enrolment to graduation, copper up to today.
 */
export function Education() {
  // computed after mount so the server render and the visitor's clock agree
  const [progress, setProgress] = useState<number | null>(null)
  useEffect(() => {
    const p = (Date.now() - START.getTime()) / (END.getTime() - START.getTime())
    setProgress(Math.min(1, Math.max(0, p)))
  }, [])

  const [place, dates] = UCF.meta.split(' · ')
  const facts = UCF.details // GPA and honours

  return (
    <section
      id="education"
      aria-labelledby="education-h"
      className="mt-(--section-gap) scroll-mt-16 px-(--gutter)"
    >
      <div id="role-ucf" data-part="ucf" className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 id="education-h" className="t-title" data-wipe>
            {UCF.title}
          </h2>
          <p className="t-lead mt-6" data-reveal>
            {UCF.subtitle}, {dates.replace(' - ', ' to ')}. {place}.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0 lg:col-span-4 lg:col-start-9 lg:pt-3">
          {facts.map((f, i) => (
            <li
              key={f}
              className="t-lead font-bold"
              data-reveal
              style={{ '--i': i + 1 } as React.CSSProperties}
            >
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* enrolment to graduation */}
      <div className="mt-20" data-reveal>
        <div className="relative h-3 bg-copper-dim">
          <div
            className="absolute inset-y-0 left-0 origin-left bg-copper"
            style={{
              width: '100%',
              transform: `scaleX(${progress ?? 0})`,
              transition: 'transform 1600ms var(--ease-out) 300ms',
            }}
          />
          {progress !== null && (
            <span
              aria-hidden
              className="absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-copper bg-mask"
              style={{ left: `${progress * 100}%` }}
            />
          )}
        </div>
        <div className="mt-5 flex justify-between font-semibold">
          <span>Aug 2024</span>
          <span className="text-silk-2">
            {progress !== null && progress < 1
              ? `${Math.round(progress * 100)}% of the way to the degree`
              : ''}
          </span>
          <span>May 2028</span>
        </div>
      </div>
    </section>
  )
}
