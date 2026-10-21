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

export const metadata: Metadata = {
  title: 'Joshua Evenden-Wallick · Full-stack and embedded software engineer',
  description:
    'Full-stack and embedded software engineer: React, TypeScript and GraphQL products at The Home Depot, telemetry platforms and C firmware at Lockheed Martin, Golang services and C++ firmware at Limbitless Solutions. Computer Engineering at UCF.',
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
