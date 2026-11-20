import { createHmac, timingSafeEqual } from 'node:crypto'

/** The cookie that lets one browser fetch the resume after passing Turnstile. */
export const PASS_COOKIE = 'resume_pass'
export const PASS_SECONDS = 60 * 60 * 24

const mac = (key: string, exp: number) => createHmac('sha256', key).update(`resume:${exp}`).digest('base64url')

/** `<expiry>.<hmac>`: an expiring pass signed with a server-side key. */
export function signPass(key: string, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + PASS_SECONDS
  return `${exp}.${mac(key, exp)}`
}

export function checkPass(key: string, pass: string | undefined, now = Date.now()): boolean {
  if (!pass) return false
  const [expRaw, sig] = pass.split('.')
  const exp = Number(expRaw)
  if (!Number.isInteger(exp) || !sig || exp < now / 1000) return false
  const want = Buffer.from(mac(key, exp))
  const got = Buffer.from(sig)
  return want.length === got.length && timingSafeEqual(want, got)
}
