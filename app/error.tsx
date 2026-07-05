'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  const isApiDown = error.message.includes('API indisponivel') || error.message.includes('fetch failed')

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-destructive/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {isApiDown ? 'API indisponivel' : 'Algo deu errado'}
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          {isApiDown
            ? 'O servidor nao esta respondendo. Verifique se a API esta rodando em localhost:3001.'
            : error.message}
        </p>
      </div>
      <button
        onClick={reset}
        className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-md hover:text-foreground hover:border-border/60 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
