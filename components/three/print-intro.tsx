'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { CAMERA_CONFIG, PRINT_LAYER_COLOR, TRANSITION_CONFIG } from '@/config/scene-config'
import { IntroScene } from './intro-scene'

export function PrintIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'playing' | 'fading' | 'gone'>('playing')

  const handleComplete = useCallback(() => {
    setPhase('fading')
  }, [])

  const handleSkip = useCallback(() => {
    setPhase('fading')
  }, [])

  useEffect(() => {
    if (phase !== 'fading') return
    const t = setTimeout(() => {
      setPhase('gone')
      onDone()
    }, TRANSITION_CONFIG.fadeDuration * 1000)
    return () => clearTimeout(t)
  }, [phase, onDone])

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ background: PRINT_LAYER_COLOR.hex }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fading' ? 0 : 1 }}
          transition={{ duration: TRANSITION_CONFIG.fadeDuration, ease: 'easeInOut' }}
        >
          <Canvas
            shadows
            camera={{
              fov: CAMERA_CONFIG.fov,
              near: CAMERA_CONFIG.near,
              far: CAMERA_CONFIG.far,
              position: CAMERA_CONFIG.startPosition,
            }}
            gl={{ antialias: true }}
          >
            <color attach="background" args={[PRINT_LAYER_COLOR.hex]} />
            <Suspense fallback={null}>
              <IntroScene onComplete={handleComplete} />
            </Suspense>
          </Canvas>

          <button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 rounded-md border border-white/15 bg-black/30 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/70 backdrop-blur transition-colors hover:border-[var(--accent-red)] hover:text-white"
          >
            Skip intro
          </button>

          <div className="pointer-events-none absolute bottom-6 left-6 font-mono text-xs uppercase tracking-widest text-white/40">
            Printing portfolio…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
