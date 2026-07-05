import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/header'
import { SubNav } from '@/components/sub-nav'
import { StyledProvider } from '@/providers/StyledProvider'
import { getSession } from '@/lib/session'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Acervo Paranormal',
    template: '%s - Acervo Paranormal',
  },
  description: 'Compendio de Rituais, Poderes e Origens para Ordem Paranormal RPG',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#080611' }],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased">
        <StyledProvider>
          <Header user={session} />
          <SubNav user={session} />
          {children}
        </StyledProvider>
      </body>
    </html>
  )
}
