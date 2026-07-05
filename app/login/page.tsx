'use client'

import { useActionState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from './actions'
import { cn } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(loginAction, null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'

  // Após login com sucesso, redireciona pra rota original
  useEffect(() => {
    if (state && 'success' in state) {
      router.push(redirectTo)
    }
  }, [state, router, redirectTo])

  const errorMsg = state && 'error' in state ? state.error : null

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-8 space-y-6">

          <div className="space-y-1 text-center">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Entrar
            </h1>
            <p className="text-xs text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground/80">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
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
              <label htmlFor="password" className="text-xs font-medium text-foreground/80">
                Senha
              </label>
              <input
                id="password"
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

          <p className="text-center text-[11px] text-muted-foreground/50">
            <Link href="/" className="text-accent hover:text-accent/80 transition-colors">
              Voltar ao início
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
