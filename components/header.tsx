'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { logoutAction } from '@/actions/auth'
import { LoginModal } from '@/components/login-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import type { Session } from '@/lib/session'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface HeaderProps {
  user: Session | null
}

export function Header({ user }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex justify-between items-center px-5 h-[52px] bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      {/* Brand */}
      <Link
        href="/"
        aria-label="Compendio de Ordem Paranormal - inicio"
        className="flex items-center gap-2.5 no-underline shrink-0"
      >
        <div className="w-7 h-7 rounded-[6px] bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <div className="flex flex-col gap-px">
          <span className="text-xs font-bold text-foreground leading-[1.1] tracking-[-0.01em]">
            Ordem Paranormal
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-[0.04em] uppercase">
            Compendio
          </span>
        </div>
      </Link>

      {/* Right area */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        {user ? (
          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu do usuario"
              className="w-[30px] h-[30px] rounded-full bg-primary/25 border border-border/30 text-primary text-[11px] font-bold tracking-[0.02em] cursor-pointer flex items-center justify-center transition-colors hover:bg-primary/15 hover:border-primary/60"
            >
              {getInitials(user.name)}
            </button>

            {open && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-card border border-border/30 rounded-lg shadow-2xl overflow-hidden z-[100]">
                {/* Header */}
                <div className="px-3.5 pt-3 pb-2.5 border-b border-border">
                  <div className="text-[13px] font-semibold text-foreground leading-[1.2]">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {user.email}
                  </div>
                  <div className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                    {user.isAdmin ? 'Mestre' : 'Jogador'}
                  </div>
                </div>

                {/* Items */}
                <div className="p-1">
                  {user.isAdmin && (
                    <>
                      <Link
                        href="/mestre"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 w-full px-2.5 py-[7px] rounded-md text-xs text-muted-foreground no-underline transition-colors hover:bg-primary/10 hover:text-foreground [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:opacity-60 [&_svg]:shrink-0"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                        Painel do Mestre
                      </Link>
                      <div className="h-px bg-border my-1" />
                    </>
                  )}

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 w-full px-2.5 py-[7px] rounded-md text-xs text-muted-foreground bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-rose-500/10 hover:text-rose-400 [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:opacity-60 [&_svg]:shrink-0"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sair
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center h-[30px] px-3 rounded-md text-xs font-medium text-muted-foreground bg-transparent border border-border cursor-pointer transition-colors hover:text-foreground hover:border-border/60"
          >
            Entrar
          </button>
        )}
      </div>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  )
}
