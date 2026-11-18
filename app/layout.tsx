import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
})

const TITLE = 'Joshua Evenden-Wallick'
const DESCRIPTION = 'Embedded software engineer. Portfolio of firmware, backend and hardware projects.'

// the preview image comes from app/opengraph-image.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://dotatlas.dev'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: 'website', url: '/', title: TITLE, description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0e100f',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* arms the reveal styles only when script runs, so content never stays hidden */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
