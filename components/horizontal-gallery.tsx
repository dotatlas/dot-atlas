"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { GalleryCard, type GalleryItem } from "./gallery-card"

interface HorizontalGalleryProps {
  title: string
  id: string
  items: GalleryItem[]
}

export function HorizontalGallery({ title, id, items }: HorizontalGalleryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 380
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section id={id} className="py-20 md:py-28">
      <div className="mx-auto w-[85%]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {id === "experience" ? "01" : "02"} /{" "}
            </span>
            <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h2>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              className="rounded-xl glass p-2 text-muted-foreground transition-all duration-300 glass-hover"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-xl glass p-2 text-muted-foreground transition-all duration-300 glass-hover"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally scrolling gallery with comfortable margins */}
      <div className="mx-auto w-[85%]">
        <div
          ref={scrollRef}
          className="gallery-scroll -mx-4 flex gap-6 overflow-x-auto px-4 pt-4 pb-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item, i) => (
            <div key={item.id} style={{ scrollSnapAlign: "start" }}>
              <GalleryCard
                item={item}
                index={i}
                isExpanded={expandedId === item.id}
                onExpand={() => setExpandedId(item.id)}
                onCollapse={() => setExpandedId(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
