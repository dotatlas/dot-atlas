'use client'

/**
 * The printed layers: instanced slabs deposited at the nozzle's extrusion
 * point as the toolhead sweeps left<->right and steps up. Driven entirely by
 * PRINT_LAYERS_CONFIG + NOZZLE_MODEL in scene-config.
 */

import { useMemo } from 'react'
import { PRINT_LAYERS_CONFIG } from '@/config/scene-config'

export type Segment = {
  position: [number, number, number]
  /** 0..1 settle progress for the scale-in pop. */
  settle: number
}

export function PrintedLayers({ segments }: { segments: Segment[] }) {
  const cfg = PRINT_LAYERS_CONFIG

  const geometryArgs = useMemo<[number, number, number]>(() => {
    return cfg.segmentScale
  }, [cfg.segmentScale])

  return (
    <group>
      {segments.map((seg, i) => {
        const s = Math.max(0.001, seg.settle)
        return (
          <mesh
            key={i}
            position={seg.position}
            scale={[s, s, s]}
            castShadow
            receiveShadow
          >
            {cfg.shape === 'cylinder' ? (
              <cylinderGeometry
                args={[geometryArgs[0] / 2, geometryArgs[0] / 2, geometryArgs[1], 16]}
              />
            ) : (
              <boxGeometry args={geometryArgs} />
            )}
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              metalness={cfg.metalness}
              roughness={cfg.roughness}
            />
          </mesh>
        )
      })}
    </group>
  )
}
