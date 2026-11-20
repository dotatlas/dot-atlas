'use client'

import { ResumeTrigger } from './resume'
import { useContact } from './contact-gate'

const LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#project', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
]

export function SiteNav() {
  const contact = useContact()
  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-6 px-(--gutter) pt-5 sm:pt-6"
    >
      <a href="#top" className="font-extrabold no-underline [font-variation-settings:'wdth'_84]">
        J. Evenden-Wallick
      </a>
      <div className="flex items-center gap-7">
        <ul className="m-0 hidden list-none gap-7 p-0 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <ResumeTrigger className="link cursor-pointer border-0 bg-transparent p-0 text-silk">Resume</ResumeTrigger>
          </li>
        </ul>
        <a
          href={contact ? `mailto:${contact.email}?subject=Hello%20Joshua` : '#contact'}
          className="btn btn-led btn-compact"
        >
          {contact ? 'Email me' : 'Contact'}
        </a>
      </div>
    </nav>
  )
}
