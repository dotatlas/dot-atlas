'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Download, FileText, Minus, Plus, X } from 'lucide-react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

/** The resume PDF. Replace the file to update the viewer and the download. */
export const RESUME = {
  src: '/resume/joshua-evenden-wallick-resume.pdf',
  downloadAs: 'Joshua-Evenden-Wallick-Resume.pdf',
}

/** One dialog, opened from any trigger on the page. */
const resumeDialog = Dialog.createHandle()

/** A button anywhere on the page that opens the resume viewer. */
export function ResumeTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Dialog.Trigger handle={resumeDialog} className={className}>
      {children}
    </Dialog.Trigger>
  )
}

/**
 * The resume, on the board: the real PDF rendered page by page onto canvas
 * (with a selectable text layer), framed as a raised panel with its mounting
 * holes. Viewing comes first; the download sits in the corner.
 */
export function ResumeDialog() {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root handle={resumeDialog} onOpenChange={(next) => setOpen(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="resume-backdrop" />
        <Dialog.Popup className="resume-popup" initialFocus={closeRef}>
          {[
            'left-3 top-3',
            'right-3 top-3',
            'left-3 bottom-3',
            'right-3 bottom-3',
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute ${pos} z-10 hidden size-4 rounded-full border-[4px] border-copper bg-mask-deep sm:block`}
            />
          ))}

          <header className="flex shrink-0 items-center justify-between gap-4 bg-mask px-5 py-4 sm:px-14">
            <div className="min-w-0">
              <Dialog.Title className="t-lead m-0 font-extrabold [font-variation-settings:'wdth'_84]">
                Resume
              </Dialog.Title>
              <Dialog.Description className="t-small m-0 truncate text-silk-2">
                Joshua Evenden-Wallick · PDF
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ZoomControls zoom={zoom} setZoom={setZoom} className="hidden sm:flex" />
              <a href={RESUME.src} download={RESUME.downloadAs} className="btn btn-silk btn-compact">
                <Download aria-hidden className="size-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </a>
              <Dialog.Close ref={closeRef} className="resume-close" aria-label="Close resume">
                <X aria-hidden className="size-5" />
              </Dialog.Close>
            </div>
          </header>

          <PdfPages src={RESUME.src} active={open} zoom={zoom} />
          {/* on phones the header is full, so zoom sits in the lower corner */}
          <ZoomControls zoom={zoom} setZoom={setZoom} className="resume-zoom-float sm:hidden" />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/* ------------------------------------------------------------ rendering */

type Status = 'loading' | 'ready' | 'error'

/** Zoom steps, as multiples of the fitted page width. */
const ZOOMS = [1, 1.25, 1.5, 2]

function ZoomControls({
  zoom,
  setZoom,
  className,
}: {
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  className?: string
}) {
  return (
    <div className={`resume-zoom ${className ?? ''}`} role="group" aria-label="Zoom">
      <button type="button" onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="Zoom out">
        <Minus aria-hidden className="size-4" />
      </button>
      <span className="tabular" aria-live="polite">
        {zoom === 0 ? 'Fit' : `${Math.round(ZOOMS[zoom] * 100)}%`}
      </span>
      <button
        type="button"
        onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
        disabled={zoom === ZOOMS.length - 1}
        aria-label="Zoom in"
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  )
}

function PdfPages({ src, active, zoom }: { src: string; active: boolean; zoom: number }) {
  const body = useRef<HTMLDivElement>(null)
  const doc = useRef<PDFDocumentProxy | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [pageCount, setPageCount] = useState(0)
  const [fit, setFit] = useState(0)
  const width = Math.round(fit * ZOOMS[zoom])
  const pages = useRef<(HTMLDivElement | null)[]>([])

  // each opening starts from the loading state (the popup remounts empty)
  useEffect(() => {
    if (active) setStatus('loading')
  }, [active])

  // load once, the first time the viewer opens
  useEffect(() => {
    if (!active || doc.current) return
    let cancelled = false
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString()
        const loaded = await pdfjs.getDocument(src).promise
        if (cancelled) return
        doc.current = loaded
        setPageCount(loaded.numPages)
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [active, src])

  // the page width follows the panel
  useEffect(() => {
    const el = body.current
    if (!el) return
    const measure = () => setFit(Math.min(880, el.clientWidth - (el.clientWidth < 640 ? 24 : 80)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [active])

  // draw every page at the current width, crisp at the device's pixel ratio
  useEffect(() => {
    const loaded = doc.current
    if (!active || !loaded || !pageCount || width <= 0) return
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
        for (let n = 1; n <= pageCount; n++) {
          const holder = pages.current[n - 1]
          if (!holder || cancelled) return
          const page = await loaded.getPage(n)
          const base = page.getViewport({ scale: 1 })
          const scale = width / base.width
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width * dpr)
          canvas.height = Math.floor(viewport.height * dpr)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          await page.render({ canvas, viewport, transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0] }).promise
          if (cancelled) return

          const text = document.createElement('div')
          text.className = 'textLayer'
          text.style.setProperty('--total-scale-factor', String(scale))
          holder.replaceChildren(canvas, text)
          holder.style.width = `${viewport.width}px`
          holder.style.height = `${viewport.height}px`
          await new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: text, viewport }).render()
        }
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }, 60)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, pageCount, width])

  return (
    <div ref={body} className="resume-body" aria-busy={status === 'loading'}>
      {status === 'loading' && (
        <div className="resume-loading" role="status">
          <span className="sr-only">Loading the resume</span>
          <span aria-hidden className="resume-loading-trace" />
        </div>
      )}
      {status === 'error' ? (
        <div className="mx-auto flex max-w-[34ch] flex-col items-start gap-5 py-16">
          <FileText aria-hidden className="size-8 text-copper" />
          <p className="t-lead m-0">The viewer could not open the PDF here.</p>
          <a href={RESUME.src} download={RESUME.downloadAs} className="btn btn-led">
            Download the PDF instead
          </a>
        </div>
      ) : (
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-6">
          {Array.from({ length: pageCount || 1 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                pages.current[i] = el
              }}
              className="resume-page"
              data-ready={status === 'ready' || undefined}
              style={pageCount ? undefined : { width: width || 600, aspectRatio: '8.5 / 11' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
