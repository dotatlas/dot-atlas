import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cookies } from 'next/headers'
import { PASS_COOKIE, checkPass } from '@/lib/resume-pass'

/** The resume PDF lives outside public/, so the only way to it is this pass-checked route. */
const FILE = path.join(process.cwd(), 'private', 'resume.pdf')

export async function GET() {
  const secret = process.env.TURNSTILE_SECRET
  const pass = (await cookies()).get(PASS_COOKIE)?.value
  if (!secret || !checkPass(secret, pass)) return new Response('Forbidden', { status: 403 })

  return new Response(new Uint8Array(await readFile(FILE)), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Joshua-Evenden-Wallick-Resume.pdf"',
      'Cache-Control': 'private, no-store',
    },
  })
}
