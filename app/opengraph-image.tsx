import { ImageResponse } from 'next/og'
import { BoardArt, C } from '@/components/board/board-art'

/** The link preview for every platform (og:image and twitter:image): the name beside the site's own hero board, rendered at build time. */
export const alt = 'Joshua Evenden-Wallick, embedded software engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** The site's face, Archivo heavy and condensed, fetched once at build; falls back to the default face offline. */
async function archivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75,800')).text()
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    return url ? await (await fetch(url)).arrayBuffer() : null
  } catch {
    return null
  }
}

export default async function OpengraphImage() {
  const font = await archivo()
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: C.mask, padding: 56, fontFamily: 'Archivo' }}>
        {/* the name, set in silkscreen white */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 620 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 28, height: 18, background: C.led }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: C.copper }}>dotatlas.dev</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 86, fontWeight: 800, color: C.silk, lineHeight: 0.95, letterSpacing: -1, whiteSpace: 'nowrap' }}>Joshua</div>
            <div style={{ fontSize: 86, fontWeight: 800, color: C.silk, lineHeight: 0.95, letterSpacing: -1, whiteSpace: 'nowrap' }}>
              Evenden-Wallick
            </div>
            <div style={{ fontSize: 34, color: C.silk2, marginTop: 28 }}>Embedded software engineer</div>
          </div>
        </div>

        {/* the page's own board, as it sits beside the name on the first screen */}
        <div style={{ display: 'flex', marginLeft: 'auto' }}>
          <BoardArt width={409} height={518} />
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Archivo', data: font, weight: 800 }] : undefined },
  )
}
