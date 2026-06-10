'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { SECTIONS, type CarouselNode } from '@/config/portfolio-content'
import { TRANSITION_CONFIG } from '@/config/scene-config'
import { Hero } from './hero'
import { SectionCarousel } from './section-carousel'
import { NodeDetail } from './node-detail'
import { PrintOverlay } from '@/components/three/print-overlay'

// The Three.js intro is client + WebGL only; load it without SSR.
const PrintIntro = dynamic(
  () => import('@/components/three/print-intro').then((m) => m.PrintIntro),
  { ssr: false },
)

export function PortfolioApp() {
  const [introDone, setIntroDone] = useState(true) // assume done until we check session
  const [introReplayKey, setIntroReplayKey] = useState(0)
  const [activeNode, setActiveNode] = useState<CarouselNode | null>(null)
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Decide whether to play the intro (once per session).
  useEffect(() => {
    const played = sessionStorage.getItem(TRANSITION_CONFIG.sessionKey)
    if (!played) setIntroDone(false)
  }, [])

  const finishIntro = () => {
    sessionStorage.setItem(TRANSITION_CONFIG.sessionKey, '1')
    setIntroDone(true)
  }

  const replayIntro = () => {
    setIntroReplayKey((value) => value + 1)
    setIntroDone(false)
  }

  const openNode = (node: CarouselNode) => {
    setActiveNode(node)
    setOverlayOpen(true)
  }

  const requestClose = () => setOverlayOpen(false) // triggers heat-dissolve
  const afterClosed = () => {
    setActiveNode(null)
  }

  return (
    <>
      {!introDone && <PrintIntro key={introReplayKey} onDone={finishIntro} />}

      <main className="relative min-h-screen">
        <Hero onReplayIntro={replayIntro} canReplayIntro={introDone} />
        {SECTIONS.map((section) => (
          <SectionCarousel key={section.id} section={section} onOpenNode={openNode} />
        ))}

        <footer className="mx-auto max-w-6xl px-6 py-16 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Built with Three.js · Printed by Joshua Evenden-Wallick
        </footer>
      </main>

      {activeNode && (
        <PrintOverlay
          open={overlayOpen}
          onClosed={afterClosed}
          region={{ mode: 'centered', widthPct: 92, heightPct: 86 }}
        >
          <NodeDetail node={activeNode} onClose={requestClose} />
        </PrintOverlay>
      )}
    </>
  )
}
