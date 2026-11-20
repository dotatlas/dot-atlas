import { NextResponse } from 'next/server'
import { CONTACT } from '@/lib/contact'
import { PASS_COOKIE, PASS_SECONDS, signPass } from '@/lib/resume-pass'

/** Must match the widget's data-action in components/portfolio/contact-gate.tsx. */
const ACTION = 'reveal'
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const deny = () => NextResponse.json({ error: 'verification failed' }, { status: 403 })

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
    return deny()
  }
  if (typeof token !== 'string' || !token || token.length > 2048) return deny()

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
    if (!res.ok) return deny()
    const out = (await res.json()) as { success?: boolean; action?: string; hostname?: string; 'error-codes'?: string[] }
    if (out.success !== true || out.action !== ACTION || !out.hostname || !hosts.includes(out.hostname)) {
      console.warn('turnstile: refused', { codes: out['error-codes'], action: out.action, hostname: out.hostname })
      return deny()
    }
  } catch {
    return deny()
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
