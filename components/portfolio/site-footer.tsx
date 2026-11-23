'use client'

import { PROFILE } from '@/config/portfolio-content'
import { RESUME, ResumeTrigger } from './resume'
import { useContact } from './contact-gate'

const PAGE = [
  { href: '#experience', label: 'Experience' },
  { href: '#project', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
]

/** The board's bottom edge: who, where to go on the page, and how to reach him. */
export function SiteFooter({ onReplay }: { onReplay?: () => void }) {
  const contact = useContact()

  return (
    <footer className="bg-mask-raised px-(--gutter) pt-14 pb-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="m-0 font-extrabold [font-variation-settings:'wdth'_84]">{PROFILE.name}</p>
          <p className="m-0 mt-2 text-silk-2">{PROFILE.role}, Computer Engineering at UCF</p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 lg:col-span-3">
          {PAGE.map((l) => (
            <li key={l.href}>
              <a className="link" href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 lg:col-span-4">
          {contact ? (
            <>
              <li>
                <a className="link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a className="link" href={contact.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a className="link" href={contact.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <ResumeTrigger className="link cursor-pointer border-0 bg-transparent p-0 text-silk">Resume</ResumeTrigger>
                <span className="text-silk-2"> · </span>
                <a className="link" href={RESUME.src} download={RESUME.downloadAs}>
                  PDF
                </a>
              </li>
            </>
          ) : (
            <li>
              <a className="link" href="#contact">
                Contact details and resume
              </a>
            </li>
          )}
          {onReplay && (
            <li>
              <button type="button" onClick={onReplay} className="link cursor-pointer border-0 bg-transparent p-0 text-silk">
                Run the mill again
              </button>
            </li>
          )}
        </ul>
      </div>
      <p className="t-small m-0 mt-12 text-silk-2">© 2026 {PROFILE.name}. Built with Next.js; the board is drawn in SVG.</p>
    </footer>
  )
}
