import { ImageResponse } from 'next/og'
import { C } from '@/components/board/board-art'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

/** The site's mark: a copper-pinned chip on solder mask, its LED lit. Also drawn larger by apple-icon. */
export function Mark({ s }: { s: number }) {
  const u = s / 64
  const pins = [0, 1, 2].map((i) => 18 + i * 11)
  return (
    <div style={{ display: 'flex', position: 'relative', width: s, height: s, background: C.mask }}>
      {pins.map((p) => (
        <div key={`t${p}`} style={{ position: 'absolute', left: p * u, top: 9 * u, width: 5 * u, height: 8 * u, background: C.copper }} />
      ))}
      {pins.map((p) => (
        <div key={`b${p}`} style={{ position: 'absolute', left: p * u, top: 47 * u, width: 5 * u, height: 8 * u, background: C.copper }} />
      ))}
      {pins.map((p) => (
        <div key={`l${p}`} style={{ position: 'absolute', left: 9 * u, top: p * u, width: 8 * u, height: 5 * u, background: C.copper }} />
      ))}
      <div style={{ position: 'absolute', left: 16 * u, top: 16 * u, width: 32 * u, height: 32 * u, background: '#2a2e2c' }} />
      <div style={{ position: 'absolute', left: 50 * u, top: 27 * u, width: 9 * u, height: 10 * u, background: C.led }} />
    </div>
  )
}

export default function Icon() {
  return new ImageResponse(<Mark s={64} />, size)
}
