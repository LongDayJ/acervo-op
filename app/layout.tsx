import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');var h=document.documentElement;if(t==='light'){h.classList.remove('dark');h.classList.add('light');}else{h.classList.add('dark');h.classList.remove('light');}}catch(e){}` }} />
      </head>
      <body className="antialiased">
        <StyledProvider>
          <Header user={session} />
          <SubNav user={session} />
          {session?.mustChangePassword && (
            <div className="bg-amber-950/60 border-b border-amber-800/50 px-4 py-2.5 flex items-center justify-between gap-4">
              <p className="text-xs text-amber-300">
                <strong>Troque sua senha.</strong> Por segurança, defina uma senha pessoal antes de continuar.
              </p>
              <Link
                href="/change-password"
                className="shrink-0 text-xs font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200 transition-colors"
              >
                Trocar agora
              </Link>
            </div>
          )}
          {children}
        </StyledProvider>
      </body>
    </html>
  )
}
