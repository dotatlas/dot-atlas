'use client'

import { useCallback, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { ArrowUpRight, FileText } from 'lucide-react'
import { ResumeTrigger } from './resume'
import { CircuitBoard } from '@/components/board/circuit-board'
import { PROFILE, SECTIONS, type Entry } from '@/config/portfolio-content'
import { useActivePart } from './use-reveal'
import { useContact } from './contact-gate'
import { ProjectFlow } from './project'

const EXPERIENCE = SECTIONS.find((s) => s.id === 'experience')!
const PROJECTS = SECTIONS.find((s) => s.id === 'projects')!

const TITLES: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap((s) => s.nodes.map((n) => [n.id, n.title])),
)

/**
 * The first screen, the roles and the projects share one split stage: the
 * board stays put on the right while every entry it carries scrolls past on
 * the left, and the component for the entry being read lights up. Experience
 * and projects are two sections in one format, so the board never drops out
 * halfway through its own parts.
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
      className="relative flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]"
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
        <Section id="experience" title="Experience" blurb={EXPERIENCE.blurb} nodes={EXPERIENCE.nodes} active={active} placeFirst />
        <Section id="project" title="Projects" blurb={PROJECTS.blurb} nodes={PROJECTS.nodes} active={active} />
      </div>
    </div>
  )
}

function Hero() {
  const contact = useContact()
  return (
    <header className="relative flex flex-col justify-end px-(--gutter) pb-16 lg:min-h-svh lg:pb-[9svh]">
      {/* the name runs past its column and onto the board's clear corner */}
      <h1 className="t-display -mt-[11vw] text-[12.2vw] whitespace-nowrap lg:mt-0 lg:text-[7.4vw] xl:text-[min(8.4vw,9rem)]">
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
        <a href={contact ? `mailto:${contact.email}?subject=Hello%20Joshua` : '#contact'} className="btn btn-led">
          {contact ? `Email ${contact.email}` : 'Get in touch'}
        </a>
        <ResumeTrigger className="btn btn-silk">
          <FileText aria-hidden className="size-4" /> View resume
        </ResumeTrigger>
        {contact && (
          <>
            <a href={contact.github} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
              <FaGithub aria-hidden className="size-4" /> GitHub
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
              <FaLinkedin aria-hidden className="size-4" /> LinkedIn
            </a>
          </>
        )}
      </div>
    </header>
  )
}

/** A section of entries on the board's stage: its heading, one line on what it holds, then each entry. */
function Section({
  id,
  title,
  blurb,
  nodes,
  active,
  placeFirst = false,
}: {
  id: string
  title: string
  blurb: string
  nodes: Entry[]
  active: string | null
  /** Roles write "place · dates"; they read dates first. */
  placeFirst?: boolean
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-16 px-(--gutter) pt-(--section-gap)">
      <div className="max-w-[36rem] xl:max-w-[42rem]">
        <h2 id={`${id}-h`} className="t-title" data-reveal>
          {title}
        </h2>
        <p className="t-lead mt-6 text-silk-2" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          {blurb}
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-24 lg:mt-20 lg:gap-28">
        {nodes.map((node) => (
          <Leg key={node.id} node={node} live={active === node.id} placeFirst={placeFirst} />
        ))}
      </div>
    </section>
  )
}

/**
 * One entry, role or project, always in the same order: title, status if it
 * is still being built, who and when, the one-line summary, for a project its
 * flow figure, then the details, its stack and links.
 */
function Leg({ node, live, placeFirst }: { node: Entry; live: boolean; placeFirst: boolean }) {
  const [first, ...rest] = node.meta.split(' · ')
  const meta = placeFirst ? `${rest.join(' · ')} · ${first}` : node.meta
  return (
    <article id={`role-${node.id}`} data-part={node.id} className="max-w-[36rem] scroll-mt-24 xl:max-w-[42rem]">
      <div className="flex items-start gap-4">
        {/* below lg the board scrolls away, so each entry carries its own status LED */}
        <span
          aria-hidden
          className="mt-[0.35em] h-3 w-5 shrink-0 transition-colors duration-150 lg:hidden"
          style={{ background: live ? 'var(--led)' : 'var(--led-off)' }}
        />
        <h3 className="t-title" data-wipe>
          {node.title}
        </h3>
      </div>
      {node.status && <Status {...node.status} />}
      <p className="mt-5 font-semibold" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
        {node.subtitle}
        <span className="block font-normal text-silk-2">{meta}</span>
      </p>
      <p className="t-lead mt-7" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
        {node.glance}
      </p>

      <ProjectFlow entry={node} />

      <ul className="mt-10 flex list-none flex-col gap-4 p-0">
        {node.details.map((d, i) => (
          <li key={i} className="relative pl-7" data-reveal style={{ '--i': 3 + i } as React.CSSProperties}>
            <span aria-hidden className="absolute top-[0.62em] left-0 size-2 bg-copper" />
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-copper" data-reveal>
        {node.tags.join(' · ')}
      </p>
      {node.links && (
        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3" data-reveal>
          {node.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
              {l.href.includes('github.com') ? <FaGithub aria-hidden className="size-4" /> : <ArrowUpRight aria-hidden className="size-4" />}
              {l.label}
            </a>
          ))}
        </p>
      )}
    </article>
  )
}

/**
 * A build still in progress, said plainly right under its name: a status LED
 * (green ring when people can use it, amber breathing while it is built) and
 * the notice at lead size, in the LED's colour.
 */
function Status({ label, live }: { label: string; live: boolean }) {
  const color = live ? 'var(--led-green)' : 'var(--copper-hot)'
  return (
    <p className="t-lead m-0 mt-4 inline-flex items-center gap-3 font-bold" style={{ color }} data-reveal>
      <span
        aria-hidden
        className={`relative size-3 shrink-0 rounded-full ${live ? 'status-live' : 'status-build'}`}
        style={{ background: color }}
      />
      {label}
    </p>
  )
}
