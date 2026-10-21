'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { INTRO_SESSION_KEY } from '@/config/print-config'
import { SiteNav } from './site-nav'
import { Passage } from './passage'
import { Figures } from './figures'
import { Project } from './project'
import { Education } from './education'
import { Bom } from './bom'
import { Contact } from './contact'
import { SiteFooter } from './site-footer'
import { useReveal } from './use-reveal'
import { ResumeDialog } from './resume'

// WebGL only: never rendered on the server.
const PrintIntro = dynamic(() => import('@/components/three/print-intro').then((m) => m.PrintIntro), {
  ssr: false,
})

type Phase = 'checking' | 'printing' | 'ready'

function canPrint() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (new URLSearchParams(window.location.search).get('intro') === 'off') return false
    if (sessionStorage.getItem(INTRO_SESSION_KEY)) return false
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function PortfolioApp() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [run, setRun] = useState(0)

  useEffect(() => {
    setPhase(canPrint() ? 'printing' : 'ready')
  }, [])

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {}
    setPhase('ready')
  }, [])

  const replay = useCallback(() => {
    window.scrollTo(0, 0)
    // re-hide the type so the print hands off to a bare board again
    document.querySelectorAll('.is-in').forEach((el) => el.classList.remove('is-in'))
    setRun((n) => n + 1)
    setPhase('printing')
  }, [])

  return (
    <>
      {phase === 'printing' && <PrintIntro key={run} onDone={finish} />}
      <Page ready={phase === 'ready'} onReplay={replay} />
    </>
  )
}

function Page({ ready, onReplay }: { ready: boolean; onReplay: () => void }) {
  return (
    <>
      {ready && <RevealArm />}
      <SiteNav />
      <main>
        <Passage silk={ready} />
        <Figures />
        <Project />
        <Bom />
        <Education />
        <Contact />
      </main>
      <SiteFooter onReplay={onReplay} />
      <ResumeDialog />
    </>
  )
}

/** Starts the entrance choreography only once the page is in view. */
function RevealArm() {
  useReveal()
  return null
}
