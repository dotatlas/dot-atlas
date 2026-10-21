'use client'

import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { fitBoard } from '@/config/board'
import { PRINT_MATERIALS, PRINT_TIMELINE } from '@/config/print-config'
import { BoardPrint, type PrintLayout } from './board-print'

/**
 * Full-screen overlay that prints the board, then fades away to reveal the
 * identical SVG board underneath. Skippable by button or Escape; any WebGL
 * failure skips straight to the page.
 */
export function PrintIntro({ onDone }: { onDone: () => void }) {
  const [layout, setLayout] = useState<PrintLayout | null>(null)
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  const leave = useCallback(() => setLeaving(true), [])

  // measure where the page's board really is, so the print lands on it
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const svg = document.querySelector<SVGSVGElement>('[data-board]')
    if (!svg) {
      onDone()
      return
    }
    const r = svg.getBoundingClientRect()
    setLayout({
      vw: window.innerWidth,
      vh: window.innerHeight,
      fit: fitBoard({ x: r.left, y: r.top, width: r.width, height: r.height }),
    })
  }, [onDone])

  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') leave()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [leave])

  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(onDone, PRINT_TIMELINE.fade * 1000)
    return () => clearTimeout(t)
  }, [leaving, onDone])

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        background: PRINT_MATERIALS.ground.flat,
        opacity: leaving ? 0 : 1,
        transition: `opacity ${PRINT_TIMELINE.fade * 1000}ms ease`,
        pointerEvents: leaving ? 'none' : 'auto',
      }}
      role="dialog"
      aria-label="Milling the board for this page"
    >
      {layout && (
        <IntroBoundary onError={onDone}>
          <Canvas
            // no tone mapping: flat colours must land on the exact CSS values
            flat
            shadows="percentage"
            dpr={[1, 1.75]}
            // perspective: the scene drives fov, distance and clip planes every frame
            camera={{ fov: 28, position: [layout.vw / 2, 2400, layout.vh / 2], near: 1, far: 100000 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            className="intro-canvas"
          >
            <color attach="background" args={[PRINT_MATERIALS.ground.flat]} />
            <Suspense fallback={null}>
              <BoardPrint layout={layout} onProgress={setProgress} onComplete={leave} />
            </Suspense>
          </Canvas>
        </IntroBoundary>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-(--gutter) pb-6">
        <p className="m-0 font-semibold text-silk" aria-live="off">
          Milling the board
          <span className="tabular ml-3 inline-block w-[4ch] text-silk-2">{Math.round(progress * 100)}%</span>
        </p>
        <button type="button" onClick={leave} className="btn btn-silk btn-compact pointer-events-auto">
          Skip intro
        </button>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 origin-left bg-copper"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

class IntroBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
