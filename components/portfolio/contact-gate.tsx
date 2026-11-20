'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { Contact } from '@/lib/contact'

/** The Turnstile widget made for this site (Cloudflare dashboard). */
const SITE_KEY = '0x4AAAAAAGKiTuzQtGsRfYqY'
/** Must match ACTION in app/api/reveal/route.ts. */
const ACTION = 'reveal'

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

const Ctx = createContext<{ contact: Contact | null; reveal: (c: Contact) => void }>({
  contact: null,
  reveal: () => {},
})

/** Contact details, null until this visitor has passed Turnstile. */
export const useContact = () => useContext(Ctx).contact

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contact, setContact] = useState<Contact | null>(null)
  return <Ctx.Provider value={{ contact, reveal: setContact }}>{children}</Ctx.Provider>
}

/**
 * The Turnstile check that unlocks the details. Most visitors pass without a
 * click; the token goes to /api/reveal, which verifies it with Cloudflare and
 * answers with the details (and a pass for the resume). A failed or expired
 * token resets the widget for a fresh try.
 */
export function ContactGate() {
  const { reveal } = useContext(Ctx)
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const [failed, setFailed] = useState(false)

  const render = useCallback(() => {
    const ts = window.turnstile
    if (!ts || !box.current || widget.current) return
    const reset = () => {
      if (widget.current) ts.reset(widget.current)
    }
    widget.current = ts.render(box.current, {
      sitekey: SITE_KEY,
      action: ACTION,
      theme: 'dark',
      callback: async (token: string) => {
        try {
          const res = await fetch('/api/reveal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          if (!res.ok) throw new Error(String(res.status))
          reveal((await res.json()) as Contact)
        } catch {
          // stop here: an automatic reset would solve, fail and spin forever
          setFailed(true)
        }
      },
      'error-callback': () => setFailed(true),
      'expired-callback': reset,
    })
  }, [reveal])

  // take the widget off Turnstile's books when the gate unmounts (on reveal, or React's dev double mount)
  useEffect(
    () => () => {
      if (widget.current) window.turnstile?.remove(widget.current)
      widget.current = null
    },
    [],
  )

  return (
    <div className="mt-12" data-reveal>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={render} />
      <div ref={box} className="min-h-[65px]" />
      {failed && (
        <p role="alert" className="t-small m-0 mt-3">
          That check didn’t go through.{' '}
          <button
            type="button"
            className="link cursor-pointer border-0 bg-transparent p-0 text-silk"
            onClick={() => {
              setFailed(false)
              if (widget.current) window.turnstile?.reset(widget.current)
            }}
          >
            Try again
          </button>
        </p>
      )}
    </div>
  )
}
