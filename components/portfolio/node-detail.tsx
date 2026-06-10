'use client'

import type { CarouselNode } from '@/config/portfolio-content'
import { X } from 'lucide-react'

export function NodeDetail({
  node,
  onClose,
}: {
  node: CarouselNode
  onClose: () => void
}) {
  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {node.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--accent-red)]">{node.subtitle}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {node.meta}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-[var(--accent-red)] hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <div className="mb-6 flex flex-wrap gap-1.5">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <ul className="space-y-4">
          {node.details.map((d, i) => (
            <li key={i} className="flex gap-3 text-pretty text-sm leading-relaxed text-foreground/90">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent-red)]" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
