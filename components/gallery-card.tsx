"use client"

import { X, ExternalLink } from "lucide-react"
import { useEffect, useRef } from "react"

export interface GalleryItem {
  id: string
  title: string
  subtitle: string
  period: string
  tags: string[]
  description: string
  details: string[]
  link?: string
  linkDesc?: string
  logo?: boolean
}

interface GalleryCardProps {
  item: GalleryItem
  index: number
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
}

export function GalleryCard({
  item,
  index,
  isExpanded,
  onExpand,
  onCollapse,
}: GalleryCardProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isExpanded])

  useEffect(() => {
    if (!isExpanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCollapse()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isExpanded, onCollapse])

  return (
    <>
      {/* Card in gallery */}
      <button
        onClick={onExpand}
        className="group relative flex-shrink-0 w-[320px] md:w-[360px] cursor-pointer rounded-2xl glass glass-hover red-glow p-6 text-left transition-all duration-500 animate-float"
        style={{ animationDelay: `${(index % 4) * 1}s` }}
        aria-label={`View details for ${item.title}`}
      >
        {/* Red accent line */}
        <div className="mb-4 h-0.5 w-10 rounded-full bg-primary opacity-60" />

        <p className="font-mono text-xs text-primary">{item.period}</p>

        <h3 className="mt-2 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
          {item.title}
        </h3>

        {/* div wraps title & small company logo png */}
        <div className="flex items-center gap-2 mt-2">
          {item.logo && (
            <img src={`/images/${item.subtitle.trim().replace(/\s+/g, '')}.png`} alt={`${item.subtitle} logo`} className="h-6 rounded-xs" />
          )}
          <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {/* Bottom glow hint */}
        <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click to expand
        </div>
      </button>

      {/* Expanded modal overlay */}
      {isExpanded && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={(e) => {
            if (e.target === overlayRef.current) onCollapse()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md modal-backdrop-enter" />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl glass red-glow-strong p-8 modal-content-enter">
            <button
              onClick={onCollapse}
              className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-4 h-0.5 w-12 rounded-full bg-primary" />

            <p className="font-mono text-sm text-primary">{item.period}</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
              {item.title}
            </h2>
            <p className="mt-1 text-base text-muted-foreground">{item.subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {item.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  {detail}
                </li>
              ))}
            </ul>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 red-glow"
              >
                {item.linkDesc || "View Project"} <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
