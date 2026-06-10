'use client'

/**
 * Procedural placeholder models + STL loader wrapper.
 * When a model's `useStl` flag is true in scene-config, the STL at its `file`
 * path is loaded; otherwise the procedural placeholder mesh is rendered.
 */

import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three-stdlib'
import type { BufferGeometry } from 'three'
import * as THREE from 'three'
import {
  DESK_MODEL,
  PRINTER_MODEL,
  NOZZLE_MODEL,
  NOZZLE_TOP_CUBE_SCALE,
} from '@/config/scene-config'

/* ----------------------------- STL mesh ---------------------------------- */
function StlMesh({
  file,
  color,
  metalness,
  roughness,
}: {
  file: string
  color: string
  metalness: number
  roughness: number
}) {
  const geometry = useLoader(STLLoader, file) as BufferGeometry
  geometry.computeVertexNormals()
  const materialColor = useMemo(() => new THREE.Color(color), [color])
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={materialColor}
        metalness={metalness}
        roughness={roughness}
        flatShading={false}
      />
    </mesh>
  )
}

/* ------------------------------- Desk ------------------------------------ */
export function Desk() {
  const m = DESK_MODEL
  const p = m.placeholder
  const legY = p.topY - p.legHeight / 2
  const halfX = p.topSize[0] / 2 - p.legInset
  const halfZ = p.topSize[2] / 2 - p.legInset
  const legPositions: [number, number, number][] = [
    [halfX, legY, halfZ],
    [-halfX, legY, halfZ],
    [halfX, legY, -halfZ],
    [-halfX, legY, -halfZ],
  ]

  return (
    <group position={m.position} rotation={m.rotation} scale={m.scale}>
      {m.useStl ? (
        <StlMesh file={m.file} color={m.color} metalness={m.metalness} roughness={m.roughness} />
      ) : (
        <>
          <mesh position={[0, p.topY, 0]} receiveShadow castShadow>
            <boxGeometry args={p.topSize} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
          {legPositions.map((pos, i) => (
            <mesh key={i} position={pos} castShadow>
              <boxGeometry args={[p.legThickness, p.legHeight, p.legThickness]} />
              <meshStandardMaterial color="#1c1714" metalness={0.2} roughness={0.7} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

/* ----------------------------- Printer ----------------------------------- */
/** Hollow cube with an open front door. Camera flies in through the door. */
export function Printer() {
  const m = PRINTER_MODEL
  const p = m.placeholder
  const [cx, cy, cz] = p.chamber
  const w = p.wall
  const hx = cx / 2
  const hy = cy / 2
  const hz = cz / 2

  return (
    <group position={m.position} rotation={m.rotation} scale={m.scale}>
      {m.useStl ? (
        <StlMesh file={m.file} color={m.color} metalness={m.metalness} roughness={m.roughness} />
      ) : (
        <>
          {/* back wall (-Z) */}
          <mesh position={[0, 0, -hz]} receiveShadow>
            <boxGeometry args={[cx + w, cy + w, w]} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
          {/* left wall (-X) */}
          <mesh position={[-hx, 0, 0]} receiveShadow>
            <boxGeometry args={[w, cy + w, cz + w]} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
          {/* right wall (+X) */}
          <mesh position={[hx, 0, 0]} receiveShadow>
            <boxGeometry args={[w, cy + w, cz + w]} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
          {/* top */}
          <mesh position={[0, hy, 0]} receiveShadow>
            <boxGeometry args={[cx + w, w, cz + w]} />
            <meshStandardMaterial color={p.frameColor} metalness={0.3} roughness={0.6} />
          </mesh>
          {/* bottom / build plate */}
          <mesh position={[0, -hy, 0]} receiveShadow>
            <boxGeometry args={[cx + w, w, cz + w]} />
            <meshStandardMaterial color={p.frameColor} metalness={0.4} roughness={0.5} />
          </mesh>
          {/* open door — hinged on the left edge of the front (+Z) face */}
          <group position={[-hx, 0, hz]} rotation={[0, p.doorOpenAngle, 0]}>
            <mesh position={[hx, 0, 0]}>
              <boxGeometry args={[cx, cy, w * 0.6]} />
              <meshStandardMaterial
                color={m.color}
                metalness={0.1}
                roughness={0.5}
                transparent
                opacity={0.35}
              />
            </mesh>
          </group>
        </>
      )}
    </group>
  )
}

/* ----------------------------- Nozzle ------------------------------------ */
export function Nozzle({ position }: { position: [number, number, number] }) {
  const m = NOZZLE_MODEL
  const p = m.placeholder
  const geometry = useLoader(STLLoader, m.file) as BufferGeometry
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()

  const bounds = useMemo(() => {
    const box = geometry.boundingBox?.clone()
    if (!box) return null

    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)

    return {
      center,
      size,
      topY: box.max.y,
    }
  }, [geometry])

  const cubeSize = bounds
    ? new THREE.Vector3(
        bounds.size.x * NOZZLE_TOP_CUBE_SCALE[0],
        bounds.size.y * NOZZLE_TOP_CUBE_SCALE[1],
        bounds.size.z * NOZZLE_TOP_CUBE_SCALE[2],
      )
    : new THREE.Vector3(1, 1, 1)

  const cubePosition = bounds
    ? [bounds.center.x, bounds.topY + cubeSize.y / 2, bounds.center.z]
    : [0, p.headSize[1] / 2 + cubeSize.y / 2, 0]

  return (
    <group position={position} rotation={m.rotation} scale={m.scale}>
      {m.useStl ? (
        <>
          <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={new THREE.Color(m.color)}
              metalness={m.metalness}
              roughness={m.roughness}
              flatShading={false}
            />
          </mesh>
          <mesh position={cubePosition as [number, number, number]} castShadow receiveShadow>
            <boxGeometry args={[cubeSize.x, cubeSize.y, cubeSize.z]} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
        </>
      ) : (
        <>
          {/* toolhead block */}
          <mesh castShadow>
            <boxGeometry args={p.headSize} />
            <meshStandardMaterial color={p.headColor} metalness={0.7} roughness={0.35} />
          </mesh>
          {/* nozzle cone (tip points down) */}
          <mesh position={[0, -p.headSize[1] / 2 - p.nozzleHeight / 2, 0]} castShadow>
            <coneGeometry args={[p.nozzleRadius, p.nozzleHeight, 24]} />
            <meshStandardMaterial color={m.color} metalness={m.metalness} roughness={m.roughness} />
          </mesh>
        </>
      )}
    </group>
  )
}

/** Preload guard so STL files (when enabled) don't hard-crash if missing. */
export function useModelGeometryGuard() {
  return useMemo(() => true, [])
}
