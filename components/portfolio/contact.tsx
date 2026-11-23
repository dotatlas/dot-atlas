'use client'

import { useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { Check, Copy, Mail } from 'lucide-react'
import { ContactGate, useContact } from './contact-gate'

/**
 * The close: a field of red solder mask. The heading and one line on the left;
 * on the right the Turnstile check, then, once it passes, the address in large
 * type with every way in as a labelled button: copy, send, LinkedIn, GitHub.
 */
export function Contact() {
  const contact = useContact()

  return (
    <section
      id="contact"
      aria-labelledby="contact-h"
      className="relative mt-(--section-gap) grid items-start gap-12 overflow-hidden bg-mask-red px-(--gutter) py-24 sm:py-28 lg:grid-cols-12 lg:gap-8"
    >
      <MountingHoles />
      <div className="relative lg:col-span-5">
        <h2 id="contact-h" className="t-display w-max max-w-full" data-wipe>
          Let’s talk.
        </h2>
        <p className="t-lead mt-8 max-w-[30ch]" data-reveal>
          Email is the fastest way to reach me.
        </p>
      </div>
      <div className="relative lg:col-span-6 lg:col-start-7 lg:pt-4">{contact ? <Actions {...contact} /> : <ContactGate />}</div>
    </section>
  )
}

function Actions({ email, linkedin, github }: { email: string; linkedin: string; github: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <div data-reveal>
      {/* the address itself stays plain, selectable text; the buttons below act on it */}
      <p className="t-title m-0 break-all font-extrabold select-all [font-variation-settings:'wdth'_80]">{email}</p>

      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={copy}
          className="cell flex min-h-16 cursor-pointer items-center justify-center gap-3 border-0 bg-silk font-bold text-mask-deep"
        >
          {copied ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
          <span key={copied ? 'copied' : 'copy'} className="swap-in">
            {copied ? 'Copied' : 'Copy email'}
          </span>
        </button>
        <a
          href={`mailto:${email}?subject=Hello%20Joshua`}
          className="cell flex min-h-16 items-center justify-center gap-3 bg-(--mask-red-raised) font-bold no-underline"
        >
          <Mail aria-hidden className="size-5" /> Send an email
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="cell flex min-h-16 items-center justify-center gap-3 bg-(--mask-red-raised) font-bold no-underline"
        >
          <FaLinkedin aria-hidden className="size-5" /> LinkedIn
        </a>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="cell flex min-h-16 items-center justify-center gap-3 bg-(--mask-red-raised) font-bold no-underline"
        >
          <FaGithub aria-hidden className="size-5" /> GitHub
        </a>
      </div>
      <span role="status" className="sr-only">
        {copied ? 'Email address copied to clipboard.' : ''}
      </span>
    </div>
  )
}

/* the four mounting holes that make the red field a board, not a banner */
function MountingHoles() {
  const at = ['left-5 top-5', 'right-5 top-5', 'left-5 bottom-5', 'right-5 bottom-5']
  return (
    <>
      {at.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} size-6 rounded-full border-[5px] border-copper bg-mask-deep`}
        />
      ))}
    </>
  )
}
