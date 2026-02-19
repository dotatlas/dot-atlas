my portfolio website :)

just showing off some things I've done in a bit prettier of a format that a black and white pdf

## Cloudflare Turnstile Setup

Contact reveal actions are gated behind Cloudflare Turnstile verification.

1. Create a Turnstile widget in Cloudflare and copy the site key + secret key.
2. Copy `.env.example` to `.env.local`.
3. Set:
	- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
	- `TURNSTILE_SECRET_KEY`
4. Restart the dev server.

Verification is checked server-side at `/api/turnstile/verify` before email/phone reveal and open actions are allowed.