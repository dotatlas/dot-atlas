import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'

import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Joshua Evenden-Wallick | CS Student & Developer',
  description: 'Portfolio of Joshua Evenden-Wallick - Computer Engineering student, software engineer, and builder of innovative solutions.',
}

export const viewport: Viewport = {
  themeColor: '#131313',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
