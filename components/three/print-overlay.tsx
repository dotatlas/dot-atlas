'use client'

/**
 * PrintOverlay — reusable "3D print over a portion of the screen" effect.
 *
 * Renders horizontal filament strips (in the print-layer color) that deposit
 * one-by-one to "print" a rectangular region anywhere in the viewport, then
 * reveals `children` inside it. On close, the block heats up (turns glowing
 * red), then dissolves to reveal whatever was underneath.
 *
 * It is intentionally DOM/Framer-based (not a per-instance WebGL canvas) so it
 * is cheap to mount repeatedly and pixel-aligns to real layout. The visual
 * language (stacked layers in the filament color) matches the intro.
 *
 * Reusable params let you print over any region:
 *   - region: 'full' | 'centered' | custom {top,left,width,height} in % or px
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OVERLAY_PRINT_CONFIG } from '@/config/scene-config'

export type PrintRegion =
  | { mode: 'centered'; widthPct: number; heightPct: number }
  | { mode: 'rect'; top: number; left: number; width: number; height: number }

export type PrintOverlayProps = {
  open: boolean
  /** Called once the heat-dissolve close animation fully finishes. */
  onClosed: () => void
  /** Request a close (parent flips `open` to false to trigger heat-dissolve). */
  region?: PrintRegion
  rows?: number
  printDuration?: number
  heatDuration?: number
  dissolveDuration?: number
  layerColor?: string
  hotColor?: string
  children: React.ReactNode
}

function regionStyle(region: PrintRegion): React.CSSProperties {
  if (region.mode === 'centered') {
    return {
      top: '50%',
      left: '50%',
      width: `min(${region.widthPct}vw, 880px)`,
      height: `min(${region.heightPct}vh, 80vh)`,
      transform: 'translate(-50%, -50%)',
    }
  }
  return {
    top: region.top,
    left: region.left,
    width: region.width,
    height: region.height,
  }
}

export function PrintOverlay({
  open,
  onClosed,
  region = { mode: 'centered', widthPct: 92, heightPct: 86 },
  rows = OVERLAY_PRINT_CONFIG.rows,
  printDuration = OVERLAY_PRINT_CONFIG.printDuration,
  heatDuration = OVERLAY_PRINT_CONFIG.heatDuration,
  dissolveDuration = OVERLAY_PRINT_CONFIG.dissolveDuration,
  layerColor = OVERLAY_PRINT_CONFIG.layerColor,
  hotColor = OVERLAY_PRINT_CONFIG.hotColor,
  children,
}: PrintOverlayProps) {
  // 'printing' -> strips deposit; 'open' -> content visible;
  // 'heating' -> block glows; 'dissolving' -> strips peel away
  const [stage, setStage] = useState<'printing' | 'open' | 'heating' | 'dissolving'>('printing')

  // entering
  useEffect(() => {
    if (open) {
      setStage('printing')
      const t = setTimeout(() => setStage('open'), printDuration * 1000)
      return () => clearTimeout(t)
    }
  }, [open, printDuration])

  // leaving: parent set open=false -> heat then dissolve then onClosed
  useEffect(() => {
    if (!open) {
      setStage('heating')
      const t1 = setTimeout(() => setStage('dissolving'), heatDuration * 1000)
      const t2 = setTimeout(
        () => onClosed(),
        (heatDuration + dissolveDuration) * 1000,
      )
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [open, heatDuration, dissolveDuration, onClosed])

  const strips = Array.from({ length: rows })
  const stripPrintStep = printDuration / rows

  const heating = stage === 'heating'
  const dissolving = stage === 'dissolving'
  const contentVisible = stage === 'open'

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60]">
      {/* backdrop dim */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: dissolving ? 0 : 1 }}
        transition={{ duration: dissolving ? dissolveDuration : 0.3 }}
      />

      <div className="absolute overflow-hidden rounded-xl border border-white/10 shadow-2xl" style={regionStyle(region)}>
        {/* printed filament strips */}
        <div className="absolute inset-0 flex flex-col">
          {strips.map((_, i) => {
            const printDelay = i * stripPrintStep
            return (
              <motion.div
                key={i}
                className="w-full flex-1"
                style={{
                  background: heating || dissolving ? hotColor : layerColor,
                  boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.35)',
                }}
                initial={{ scaleX: 0, transformOrigin: i % 2 === 0 ? 'left' : 'right' }}
                animate={{
                  scaleX: dissolving ? 0 : 1,
                  opacity: dissolving ? 0 : 1,
                  filter: heating
                    ? 'brightness(1.6) saturate(1.4)'
                    : 'brightness(1) saturate(1)',
                }}
                transition={{
                  scaleX: dissolving
                    ? { duration: dissolveDuration * 0.7, delay: (rows - i) * (dissolveDuration / rows) * 0.3 }
                    : { duration: stripPrintStep * 1.6, delay: printDelay, ease: 'easeOut' },
                  opacity: { duration: dissolving ? dissolveDuration * 0.6 : 0.1, delay: dissolving ? (rows - i) * (dissolveDuration / rows) * 0.3 : printDelay },
                  filter: { duration: heatDuration },
                }}
              />
            )
          })}
        </div>

        {/* heat glow overlay */}
        <AnimatePresence>
          {(heating || dissolving) && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${hotColor}55, transparent 70%)`,
                mixBlendMode: 'screen',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: heating ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: heatDuration }}
            />
          )}
        </AnimatePresence>

        {/* revealed content */}
        <motion.div
          className="relative h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ pointerEvents: contentVisible ? 'auto' : 'none' }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
