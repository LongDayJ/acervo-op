'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { loginAction } from '@/app/login/actions'
import { cn } from '@/lib/utils'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(loginAction, null)
  const emailRef = useRef<HTMLInputElement>(null)

  // Fecha e refresca a sessão após login com sucesso
  useEffect(() => {
    if (state && 'success' in state) {
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  // Foca o campo de e-mail ao abrir
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  // Fecha no ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const errorMsg = state && 'error' in state ? state.error : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label="Entrar"
        className="fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-sm px-4"
      >
        <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">

          {/* Header do modal */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground tracking-tight">
                Entrar
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Acesse sua conta para continuar
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-md
                text-muted-foreground hover:text-foreground hover:bg-white/[0.06]
                transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Formulário */}
          <form action={action} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="modal-email" className="text-xs font-medium text-foreground/80">
                E-mail
              </label>
              <input
                ref={emailRef}
                id="modal-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={cn(
                  'w-full h-9 px-3 rounded-md text-sm transition-colors',
                  'bg-background/60 border border-border text-foreground',
                  'placeholder:text-muted-foreground/50',
                  'focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60'
                )}
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-password" className="text-xs font-medium text-foreground/80">
                Senha
              </label>
              <input
                id="modal-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={cn(
                  'w-full h-9 px-3 rounded-md text-sm transition-colors',
                  'bg-background/60 border border-border text-foreground',
                  'placeholder:text-muted-foreground/50',
                  'focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60'
                )}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-9 rounded-md bg-primary text-sm font-medium text-white
                hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50
                transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {pending ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !open) return null

  return createPortal(<ModalContent onClose={onClose} />, document.body)
}
