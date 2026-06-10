'use client'

import { PROFILE } from '@/config/portfolio-content'
import { Mail, Globe, ArrowDown, Copy, Check, RotateCcw } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(PROFILE.email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
      className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-accent-red hover:text-foreground"
      aria-label="Copy email address"
    >
      {copied ? (
        <Check className="size-3.5 text-accent-red" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? 'Copied' : PROFILE.email}
    </button>
  )
}

const socials = [
  { href: PROFILE.github, label: 'GitHub', Icon: FaGithub },
  { href: PROFILE.linkedin, label: 'LinkedIn', Icon: FaLinkedin },
  { href: PROFILE.portfolio, label: 'Portfolio', Icon: Globe },
  { href: `mailto:${PROFILE.email}`, label: 'Email', Icon: Mail },
]

export function Hero({
  onReplayIntro,
  canReplayIntro,
}: {
  onReplayIntro: () => void
  canReplayIntro: boolean
}) {
  return (
    <header className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col justify-center px-6 py-24">
      <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className="size-1.5 rounded-full bg-accent-red" />
        {PROFILE.location}
      </div>

      <h1 className="text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl">
        {PROFILE.name}
      </h1>

      <p className="mt-4 font-mono text-sm uppercase tracking-widest text-accent-red">
        {PROFILE.role}
      </p>

      <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
        {PROFILE.heroLine}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {socials.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-accent-red"
          >
            <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-accent-red" />
            {label}
          </a>
        ))}
        <CopyEmail />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReplayIntro}
          disabled={!canReplayIntro}
          className="border-border bg-card text-foreground hover:border-accent-red hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay intro
        </Button>
      </div>

      <div className="mt-16 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <ArrowDown className="size-3.5 animate-bounce" />
        Scroll to explore
      </div>
    </header>
  )
}
