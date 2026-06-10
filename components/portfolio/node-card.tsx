'use client'

import type { CarouselNode } from '@/config/portfolio-content'
import { ArrowUpRight } from 'lucide-react'
import { forwardRef } from 'react'

export const NodeCard = forwardRef<
  HTMLButtonElement,
  { node: CarouselNode; onOpen: (rect: DOMRect) => void }
>(function NodeCard({ node, onOpen }, ref) {
  return (
    <button
      ref={ref}
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
      className="group flex h-full w-full flex-col rounded-xl border border-border bg-card p-6 text-left transition-all duration-300 hover:border-[var(--accent-red)]/60 hover:bg-card/80"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight">{node.title}</h3>
          <p className="mt-1 text-sm text-[var(--accent-red)]">{node.subtitle}</p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-red)]" />
      </div>

      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {node.meta}
      </p>

      <p className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
        {node.glance}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {node.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
})
