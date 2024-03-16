import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import Providers from '@/src/providers'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import Script from 'next/script'

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai', 'latin']
})

export const metadata: Metadata = {
  title: 'OPN Demo',
  description: 'OPN Demo'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexSansThai.className}>
        <Providers>{children}</Providers>
        <Script type="text/javascript" src="https://cdn.omise.co/omise.js" />
      </body>
    </html>
  )
}
