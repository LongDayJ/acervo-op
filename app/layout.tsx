import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/header'
import { SubNav } from '@/components/sub-nav'
import { StyledProvider } from '@/providers/StyledProvider'
import { getSession } from '@/lib/session'
import './globals.css'

export const metadata: Metadata = {
  title: 'Compendio -- Ordem Paranormal',
  description: 'Compendio de Rituais, Poderes e Origens para Ordem Paranormal RPG',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
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
