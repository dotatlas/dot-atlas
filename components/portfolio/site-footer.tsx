'use client'

import { useEffect, useRef } from 'react'
import { PROFILE } from '@/config/portfolio-content'
import { PHOTOS, PRINT_CLIP } from '@/config/photos'
import { RESUME, ResumeTrigger } from './resume'

const CREDITED = [PHOTOS.pcb, PHOTOS.sensor, PHOTOS.guidance, PHOTOS.esp32, PRINT_CLIP]

/** The name across the last moving picture: a desktop mill, still cutting a board. */
export function SiteFooter({ onReplay }: { onReplay: () => void }) {
  const video = useRef<HTMLVideoElement>(null)

  // a silent loop is decoration: it holds on its poster under reduced motion
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // only fetch and run the clip while the footer is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <footer className="relative isolate flex min-h-[88svh] flex-col justify-between overflow-hidden px-(--gutter) pt-8 pb-8">
      <video
        ref={video}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.42) contrast(1.15)' }}
        src={PRINT_CLIP.src}
        poster={PRINT_CLIP.poster}
        width={PRINT_CLIP.width}
        height={PRINT_CLIP.height}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
      />

      <div className="flex flex-wrap justify-between gap-8">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          <li><a className="link" href="#experience">Experience</a></li>
          <li><a className="link" href="#project">Projects</a></li>
          <li><a className="link" href="#education">Education</a></li>
          <li><a className="link" href="#skills">Skills</a></li>
        </ul>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 sm:items-end">
          <li><a className="link" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></li>
          <li><a className="link" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li>
            <ResumeTrigger className="link cursor-pointer border-0 bg-transparent p-0 text-silk">Resume</ResumeTrigger>
            <span className="text-silk-2"> · </span>
            <a className="link" href={RESUME.src} download={RESUME.downloadAs}>PDF</a>
          </li>
          <li>
            <button type="button" onClick={onReplay} className="link cursor-pointer border-0 bg-transparent p-0 text-silk">
              Run the mill again
            </button>
          </li>
        </ul>
      </div>

      <div>
        <p
          aria-hidden
          className="t-display wordmark-settle m-0 text-[15.2vw] leading-[0.8] whitespace-nowrap text-silk"
          data-wipe
        >
          Evenden-Wallick
        </p>
        <p className="t-small mt-6 max-w-[90ch] text-silk-2">
          Pictures from Wikimedia Commons, shown cropped in greyscale:{' '}
          {CREDITED.map((p, i) => (
            <span key={p.href}>
              <a href={p.href} target="_blank" rel="noreferrer" className="underline">
                {p.credit}
              </a>
              {i < CREDITED.length - 1 ? '; ' : '.'}
            </span>
          ))}{' '}
          © 2026 {PROFILE.name}.
        </p>
      </div>
    </footer>
  )
}
