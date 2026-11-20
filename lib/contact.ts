import 'server-only'

/**
 * Personal contact details. Server only: they reach a browser solely through
 * POST /api/reveal, after a Turnstile check, and never ship in the page bundle.
 */
export const CONTACT = {
  email: 'jewallick@pm.me',
  github: 'https://github.com/dotatlas',
  linkedin: 'https://linkedin.com/in/jevendenwallick',
}

export type Contact = typeof CONTACT
