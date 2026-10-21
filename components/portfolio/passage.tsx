'use client'

import { useCallback, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { FileText } from 'lucide-react'
import { ResumeTrigger } from './resume'
import { CircuitBoard } from '@/components/board/circuit-board'
import { FIGURES, PROFILE, SECTIONS, type Entry } from '@/config/portfolio-content'
import { PHOTOS, type Photo } from '@/config/photos'
import { useActivePart } from './use-reveal'

const EXPERIENCE = SECTIONS.find((s) => s.id === 'experience')!

const TITLES: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.nodes.map((n) => [n.id, n.title])),
)

/** Inline photographs that sit inside a role, from the world around it. */
const ROLE_PHOTOS: Record<string, Photo[]> = {
  // the two halves of the Lockheed work: sensor firmware and flight hardware
  lockheed: [PHOTOS.sensor, PHOTOS.guidance],
  limbitless: [PHOTOS.esp32],
}

/**
 * The first screen and the experience legs share one split stage: the board
 * stays put on the right while the roles scroll past on the left, and the
 * component for the role being read lights up.
 */
export function Passage({ silk }: { silk: boolean }) {
  const [active, setActive] = useState<string | null>(null)
  useActivePart(useCallback((id: string | null) => setActive(id), []))

  const select = (nodeId: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`role-${nodeId}`)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActive(nodeId)
  }

  return (
    <div
      id="top"
      className="relative flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]"
    >
      {/* the board: sticky stage on desktop, the top of the first screen on phones */}
      <div className="order-first lg:order-last lg:col-start-2 lg:row-start-1">
        <div className="flex h-[52svh] items-start justify-center px-(--gutter) pt-20 lg:sticky lg:top-0 lg:h-svh lg:items-center lg:pt-24 lg:pr-5 lg:pb-5 lg:pl-0">
          <CircuitBoard
            className="block h-full w-full"
            activeId={active}
            onSelect={select}
            silk={silk}
            titles={TITLES}
          />
        </div>
      </div>

      <div className="relative z-10 lg:col-start-1 lg:row-start-1">
        <Hero />
        <Experience active={active} />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <header className="relative flex flex-col justify-end px-(--gutter) pb-16 lg:min-h-svh lg:pb-[9svh]">
      {/* the name runs past its column and onto the board's clear corner */}
      <h1 className="t-display -mt-[11vw] text-[12.2vw] whitespace-nowrap lg:mt-0 lg:text-[length:var(--step-display)]">
        <span className="block w-max" data-wipe style={{ '--i': 0 } as React.CSSProperties}>
          Joshua
        </span>
        <span className="block w-max" data-wipe style={{ '--i': 1 } as React.CSSProperties}>
          Evenden-Wallick
        </span>
      </h1>
      <p className="t-lead mt-8 max-w-[31ch] lg:mt-10" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
        {PROFILE.lede}
      </p>
      <div
        className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
        data-reveal
        style={{ '--i': 4 } as React.CSSProperties}
      >
        <a href={`mailto:${PROFILE.email}?subject=Hello%20Joshua`} className="btn btn-led">
          Email {PROFILE.email}
        </a>
        <ResumeTrigger className="btn btn-silk">
          <FileText aria-hidden className="size-4" /> View resume
        </ResumeTrigger>
        <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
          <FaGithub aria-hidden className="size-4" /> GitHub
        </a>
        <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
          <FaLinkedin aria-hidden className="size-4" /> LinkedIn
        </a>
      </div>
    </header>
  )
}

function Experience({ active }: { active: string | null }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-h"
      className="px-(--gutter) pt-(--section-gap)"
    >
      <div className="max-w-[36rem] xl:max-w-[40rem]">
        <h2 id="experience-h" className="t-title" data-reveal>
          Experience
        </h2>
        <p className="t-lead mt-6 text-silk-2" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          {EXPERIENCE.blurb}
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-24 lg:mt-20 lg:gap-28">
        {EXPERIENCE.nodes.map((node) => (
          <Leg key={node.id} node={node} photos={ROLE_PHOTOS[node.id]} live={active === node.id} />
        ))}
      </div>
    </section>
  )
}

function Leg({ node, photos, live }: { node: Entry; photos?: Photo[]; live: boolean }) {
  const [place, ...when] = node.meta.split(' · ')
  const figure = FIGURES[node.id]
  return (
    <article id={`role-${node.id}`} data-part={node.id} className="max-w-[36rem] scroll-mt-24 xl:max-w-[40rem]">
      <div className="flex items-start gap-4">
        {/* below lg the board scrolls away, so each role carries its own status LED */}
        <span
          aria-hidden
          className="mt-[0.35em] h-3 w-5 shrink-0 transition-colors duration-150 lg:hidden"
          style={{ background: live ? 'var(--led)' : 'var(--led-off)' }}
        />
        <h3 className="t-title" data-wipe>
          {node.title}
        </h3>
      </div>
      <p className="mt-5 font-semibold" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
        {node.subtitle}
        <span className="block font-normal text-silk-2">
          {when.join(' · ')} · {place}
        </span>
      </p>
      <p className="t-lead mt-7" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
        {node.glance}
      </p>

      {figure && (
        <p className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-2" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
          <span className="t-display tabular text-copper">{figure.value}</span>
          <span className="max-w-[22ch] pb-2 font-semibold">{figure.label}</span>
        </p>
      )}

      {photos && (
        <div className={photos.length > 1 ? 'mt-10 grid grid-cols-2 gap-3' : 'mt-10'}>
          {photos.map((photo, i) => (
            <figure key={photo.src} className="m-0" data-reveal style={{ '--i': 3 + i } as React.CSSProperties}>
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                className={`photo w-full object-cover ${photos.length > 1 ? 'aspect-[4/5]' : 'aspect-[3/2]'}`}
              />
              <figcaption className="t-small mt-3 text-silk-2">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <ul className="mt-10 flex list-none flex-col gap-4 p-0">
        {node.details.map((d, i) => (
          <li
            key={i}
            className="relative pl-7"
            data-reveal
            style={{ '--i': 3 + i } as React.CSSProperties}
          >
            <span aria-hidden className="absolute top-[0.62em] left-0 size-2 bg-copper" />
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-copper" data-reveal>
        {node.tags.join(' · ')}
      </p>
    </article>
  )
}
