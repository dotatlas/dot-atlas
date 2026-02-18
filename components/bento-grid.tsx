"use client"

import { useState, useRef, useEffect } from "react"
import { GalleryCard, type GalleryItem } from "./gallery-card"

interface BentoGridProps {
  title: string
  id: string
  sectionNumber: string
  items: GalleryItem[]
}

export function BentoGrid({ title, id, sectionNumber, items }: BentoGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id={id} ref={sectionRef} className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header with number and gradient line */}
        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-primary">{sectionNumber} /</span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {title}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              } ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: visible ? `${i * 100}ms` : "0ms" }}
            >
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
