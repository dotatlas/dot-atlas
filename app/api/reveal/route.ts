import { NextResponse } from 'next/server'
import { CONTACT } from '@/lib/contact'
import { PASS_COOKIE, PASS_SECONDS, signPass } from '@/lib/resume-pass'

/** Must match the widget's data-action in components/portfolio/contact-gate.tsx. */
const ACTION = 'reveal'
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** A 403 with a short, secret-free reason, so a failure can be read from the browser's network tab. */
const deny = (reason: string) => NextResponse.json({ error: 'verification failed', reason }, { status: 403 })

/**
 * Turnstile-gated contact details. The browser sends its single-use token; this
 * checks it with Cloudflare (success, action and hostname) and only then returns
 * the details plus a signed pass for /api/resume. Any failure is a 403.
 */
export async function POST(req: Request) {
  const secret = process.env.TURNSTILE_SECRET
  const hosts = (process.env.TURNSTILE_HOSTNAMES ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
  const body: unknown = await req.json().catch(() => null)
  const token = body && typeof body === 'object' ? (body as { token?: unknown }).token : undefined
  if (!secret || hosts.length === 0) {
    console.warn('turnstile: TURNSTILE_SECRET or TURNSTILE_HOSTNAMES is not set')
    return deny(!secret ? 'secret-not-set' : 'hostnames-not-set')
  }
  if (typeof token !== 'string' || !token || token.length > 2048) return deny('bad-token')

  const form = new URLSearchParams({ secret, response: token })
  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (ip) form.set('remoteip', ip)

  try {
    const res = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return deny(`siteverify-${res.status}`)
    const out = (await res.json()) as { success?: boolean; action?: string; hostname?: string; 'error-codes'?: string[] }
    const reason =
      out.success !== true
        ? (out['error-codes'] ?? ['refused']).join(',')
        : out.action !== ACTION
          ? `action:${out.action}`
          : !out.hostname || !hosts.includes(out.hostname)
            ? `hostname:${out.hostname}`
            : null
    if (reason) {
      console.warn('turnstile: refused', reason)
      return deny(reason)
    }
  } catch {
    return deny('siteverify-unreachable')
  }

  const ok = NextResponse.json(CONTACT, { headers: { 'Cache-Control': 'no-store' } })
  // the HMAC key is the Turnstile secret: one server-only value to manage
  ok.cookies.set(PASS_COOKIE, signPass(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/resume',
    maxAge: PASS_SECONDS,
  })
  return ok
}
