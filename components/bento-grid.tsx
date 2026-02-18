"use client"

import { useState, useRef, useEffect } from "react"
import { GalleryCard, type GalleryItem } from "./gallery-card"

interface BentoGridProps {
  title: string
  id: string
  items: GalleryItem[]
}

export function BentoGrid({ title, id, items }: BentoGridProps) {
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
    <section id={id} ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              } ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: visible ? `${i * 80}ms` : "0ms" }}
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
