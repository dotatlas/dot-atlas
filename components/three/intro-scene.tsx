'use client'

/**
 * IntroScene — the full 3D print intro sequence.
 *
 * Phases:
 *   0 'dolly'    camera eases from the chair into the printer through the door
 *   1 'descend'  nozzle drops from startY to printY
 *   2 'print'    nozzle sweeps L<->R, steps up, depositing layers until covered
 *   3 'done'     fires onComplete -> page crossfades in
 *
 * All spatial values come from scene-config.ts.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CAMERA_CONFIG,
  LIGHTING_CONFIG,
  NOZZLE_MODEL,
  PRINT_LAYERS_CONFIG,
} from '@/config/scene-config'
import { Desk, Printer, Nozzle } from './models'
import { PrintedLayers, type Segment } from './printed-layers'

type Phase = 'dolly' | 'descend' | 'print' | 'done'

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function IntroScene({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree()
  const nozzleRef = useRef<[number, number, number]>([
    NOZZLE_MODEL.homeXZ[0],
    NOZZLE_MODEL.startY,
    NOZZLE_MODEL.homeXZ[1],
  ])
  const [, force] = useState(0)
  const [segments, setSegments] = useState<Segment[]>([])

  const phase = useRef<Phase>('dolly')
  const elapsed = useRef(0)
  const completed = useRef(false)

  // print bookkeeping
  const layerIndex = useRef(0)
  const passDir = useRef(1) // 1 = left->right, -1 = right->left
  const passProgress = useRef(0)
  const lastSegCount = useRef(0)

  const start = useRef(new THREE.Vector3(...CAMERA_CONFIG.startPosition))
  const startLook = useRef(new THREE.Vector3(...CAMERA_CONFIG.startLookAt))
  const endLook = useRef(new THREE.Vector3(...CAMERA_CONFIG.insideLookAt))

  useEffect(() => {
    camera.position.set(...CAMERA_CONFIG.startPosition)
    camera.lookAt(startLook.current)
  }, [camera])

  const finish = useCallback(() => {
    if (completed.current) return
    completed.current = true
    onComplete()
  }, [onComplete])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    elapsed.current += dt
    const cfg = PRINT_LAYERS_CONFIG

    /* -------------------- Phase 0: camera dolly-in -------------------- */
    if (phase.current === 'dolly') {
      const t = Math.min(elapsed.current / CAMERA_CONFIG.dollyDuration, 1)
      const e = easeInOut(t)
      camera.position.lerpVectors(
        start.current,
        new THREE.Vector3(...CAMERA_CONFIG.insidePosition),
        e,
      )
      const look = new THREE.Vector3().lerpVectors(startLook.current, endLook.current, e)
      camera.lookAt(look)
      if (t >= 1) {
        phase.current = 'descend'
        elapsed.current = 0
      }
      return
    }

    /* -------------------- Phase 1: nozzle descends -------------------- */
    if (phase.current === 'descend') {
      const t = Math.min(elapsed.current / NOZZLE_MODEL.descendDuration, 1)
      const e = easeInOut(t)
      const y = THREE.MathUtils.lerp(NOZZLE_MODEL.startY, NOZZLE_MODEL.printY, e)
      nozzleRef.current = [NOZZLE_MODEL.homeXZ[0], y, NOZZLE_MODEL.homeXZ[1]]
      force((n) => n + 1)
      if (t >= 1) {
        phase.current = 'print'
        elapsed.current = 0
        passProgress.current = 0
      }
      return
    }

    /* -------------------- Phase 2: printing sweep --------------------- */
    if (phase.current === 'print') {
      passProgress.current += dt / cfg.passDuration
      const tp = Math.min(passProgress.current, 1)

      // current nozzle X position along the sweep
      const fromX = passDir.current === 1 ? -cfg.sweepHalfWidth : cfg.sweepHalfWidth
      const toX = passDir.current === 1 ? cfg.sweepHalfWidth : -cfg.sweepHalfWidth
      const nx = THREE.MathUtils.lerp(fromX, toX, easeInOut(tp))
      const ny = NOZZLE_MODEL.printY + layerIndex.current * cfg.layerHeightStep
      nozzleRef.current = [nx, ny, NOZZLE_MODEL.homeXZ[1]]

      // deposit segments up to current progress
      const targetCount = Math.floor(tp * cfg.segmentsPerPass)
      if (targetCount > lastSegCount.current) {
        const newOnes: Segment[] = []
        const exX = NOZZLE_MODEL.extrusionOffset[0]
        const exY = NOZZLE_MODEL.extrusionOffset[1]
        const exZ = NOZZLE_MODEL.extrusionOffset[2]
        for (let s = lastSegCount.current; s < targetCount; s++) {
          const segT = cfg.segmentsPerPass <= 1 ? 0 : s / (cfg.segmentsPerPass - 1)
          const segX = THREE.MathUtils.lerp(fromX, toX, segT)
          // alternate depth row each layer so the slab fills front-to-back
          const depthT = (layerIndex.current % 2 === 0 ? segT : 1 - segT)
          const segZ = THREE.MathUtils.lerp(-cfg.sweepHalfDepth, cfg.sweepHalfDepth, depthT)
          newOnes.push({
            position: [segX + exX, ny + exY, segZ + exZ],
            settle: 0,
          })
        }
        setSegments((prev) => [...prev, ...newOnes])
        lastSegCount.current = targetCount
      }

      // settle animation for recent segments
      setSegments((prev) => {
        let changed = false
        const next = prev.map((seg) => {
          if (seg.settle < 1) {
            changed = true
            return { ...seg, settle: Math.min(1, seg.settle + dt / cfg.segmentSettle) }
          }
          return seg
        })
        return changed ? next : prev
      })

      // pass complete -> next layer or finish
      if (tp >= 1) {
        passDir.current *= -1
        passProgress.current = 0
        lastSegCount.current = 0
        layerIndex.current += 1
        if (layerIndex.current >= cfg.layerCount) {
          phase.current = 'done'
          finish()
        }
      }
      return
    }
  })

  return (
    <>
      <ambientLight intensity={LIGHTING_CONFIG.ambientIntensity} />
      <directionalLight
        position={LIGHTING_CONFIG.keyLight.position}
        intensity={LIGHTING_CONFIG.keyLight.intensity}
        castShadow
      />
      <directionalLight
        position={LIGHTING_CONFIG.fillLight.position}
        intensity={LIGHTING_CONFIG.fillLight.intensity}
      />
      <pointLight
        position={LIGHTING_CONFIG.chamberLight.position}
        intensity={LIGHTING_CONFIG.chamberLight.intensity}
        color={LIGHTING_CONFIG.chamberLight.color}
        distance={30}
      />
      <Desk />
      <Printer />
      <Nozzle position={nozzleRef.current} />
      <PrintedLayers segments={segments} />
    </>
  )
}
