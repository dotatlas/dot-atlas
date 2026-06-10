'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { PortfolioSection, CarouselNode } from '@/config/portfolio-content'
import { NodeCard } from './node-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function SectionCarousel({
  section,
  onOpenNode,
}: {
  section: PortfolioSection
  onOpenNode: (node: CarouselNode, rect: DOMRect) => void
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
            <span className="font-mono text-sm text-[var(--accent-red)]">
              {String(SECTION_INDEX[section.id] ?? '').padStart(2, '0')}
            </span>
            {section.label}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{section.blurb}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-[var(--accent-red)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-[var(--accent-red)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {section.nodes.map((node) => (
            <div
              key={node.id}
              className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_60%] md:flex-[0_0_44%] lg:flex-[0_0_33%]"
            >
              <NodeCard node={node} onOpen={(rect) => onOpenNode(node, rect)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SECTION_INDEX: Record<string, number> = {
  experience: 1,
  projects: 2,
  education: 3,
  skills: 4,
}
