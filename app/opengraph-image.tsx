import { ImageResponse } from 'next/og'

/** The link preview: the site's solder-mask board in miniature, rendered to a PNG at build time. */
export const alt = 'Joshua Evenden-Wallick, embedded software engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// the tokens from app/globals.css
const MASK = '#0e100f'
const RAISED = '#151816'
const CHIP = '#1c1e1d'
const COPPER = '#d4ab55'
const COPPER_DIM = '#5c4b29'
const SILK = '#ecebe7'
const SILK_2 = '#a9aba4'
const LED = '#ff4433'

/** A copper trace segment, absolutely placed on the board. */
function Trace({ x, y, w, h, color = COPPER }: { x: number; y: number; w: number; h: number; color?: string }) {
  return <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: color }} />
}

/** A mounting hole: copper ring, deep hole. */
function Hole({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 26,
        height: 26,
        borderRadius: 13,
        border: `7px solid ${COPPER}`,
        background: MASK,
      }}
    />
  )
}

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
      <div style={{ display: 'flex', width: '100%', height: '100%', background: MASK, padding: 56, fontFamily: 'Archivo' }}>
        {/* the name, set in silkscreen white */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 620 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 28, height: 18, background: LED }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: COPPER }}>dotatlas.dev</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 86, fontWeight: 800, color: SILK, lineHeight: 0.95, letterSpacing: -1, whiteSpace: 'nowrap' }}>Joshua</div>
            <div style={{ fontSize: 86, fontWeight: 800, color: SILK, lineHeight: 0.95, letterSpacing: -1, whiteSpace: 'nowrap' }}>
              Evenden-Wallick
            </div>
            <div style={{ fontSize: 34, color: SILK_2, marginTop: 28 }}>Embedded software engineer</div>
          </div>
        </div>

        {/* a small board: one chip, copper running out to the edges */}
        <div style={{ display: 'flex', position: 'relative', flex: 1, marginLeft: 40, background: RAISED }}>
          <Hole x={18} y={18} />
          <Hole x={384} y={18} />
          <Hole x={18} y={474} />
          <Hole x={384} y={474} />

          <Trace x={0} y={170} w={150} h={8} />
          <Trace x={0} y={210} w={150} h={8} color={COPPER_DIM} />
          <Trace x={300} y={150} w={128} h={8} color={COPPER_DIM} />
          <Trace x={300} y={300} w={128} h={8} />
          <Trace x={190} y={340} w={8} h={178} />
          <Trace x={250} y={340} w={8} h={178} color={COPPER_DIM} />
          <Trace x={210} y={0} w={8} h={110} />

          {/* pins round the chip */}
          {[0, 1, 2, 3, 4].map((i) => (
            <Trace key={`t${i}`} x={166 + i * 30} y={108} w={8} h={20} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <Trace key={`b${i}`} x={166 + i * 30} y={322} w={8} h={20} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <Trace key={`l${i}`} x={130} y={150 + i * 30} w={20} h={8} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <Trace key={`r${i}`} x={300} y={150 + i * 30} w={20} h={8} />
          ))}
          <div style={{ position: 'absolute', left: 150, top: 128, width: 150, height: 194, background: CHIP }} />

          {/* the status LED, lit */}
          <div style={{ position: 'absolute', left: 340, top: 400, width: 34, height: 22, background: LED }} />
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Archivo', data: font, weight: 800 }] : undefined },
  )
}
