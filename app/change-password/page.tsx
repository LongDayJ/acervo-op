'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { changePasswordAction } from './actions'
import { Loader2, KeyRound } from 'lucide-react'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(changePasswordAction, null)

  useEffect(() => {
    if (state && 'success' in state) {
      router.push('/?changed=1')
    }
  }, [state, router])

  const error = state && 'error' in state ? state.error : null

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">

          <div className="px-6 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="h-4 w-4 text-primary" />
              <h1 className="text-[15px] font-semibold text-foreground">Trocar senha</h1>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Defina uma nova senha para continuar acessando o sistema.
            </p>
          </div>

          <form action={action} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="text-xs font-medium text-foreground/80">
                Nova senha
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full h-9 px-3 rounded-md text-sm bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60"
                placeholder="Minimo 6 caracteres"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-xs font-medium text-foreground/80">
                Confirmar senha
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                className="w-full h-9 px-3 rounded-md text-sm bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60"
                placeholder="Repita a senha"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-9 rounded-md bg-primary text-sm font-medium text-white hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {pending ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>

          <div className="px-6 pb-4 text-[11px] text-muted-foreground/50 text-center">
            Apos salvar voce sera desconectado e precisara fazer login novamente.
          </div>
        </div>
      </div>
    </main>
  )
}
