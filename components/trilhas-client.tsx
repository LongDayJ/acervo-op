'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Classe, Trilha } from '@/lib/types'

interface Props {
  classes: Classe[]
  trilhas: Trilha[]
}

function progressaoLabel(tipo: string, valor: number): string {
  if (tipo === 'nivel') return `Nível ${valor}`
  return `NEX ${valor}%`
}

export function TrilhasClient({ classes, trilhas }: Props) {
  const [classeAtiva, setClasseAtiva] = useState<number>(classes[0]?.id ?? 0)

  const classeObj = classes.find((c) => c.id === classeAtiva)
  const trilhasDaClasse = trilhas.filter((t) => t.classe.id === classeAtiva)

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Trilhas</h1>
        <p className="text-xs text-muted-foreground mt-1">Especializações por classe</p>
      </div>

      {/* Tabs de classe */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {classes.map((c) => (
          <button
            key={c.id}
            onClick={() => setClasseAtiva(c.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
              c.id === classeAtiva
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            )}
          >
            {c.nome}
          </button>
        ))}
      </div>

      {/* Grid de trilhas */}
      {trilhasDaClasse.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma trilha cadastrada para {classeObj?.nome}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trilhasDaClasse.map((trilha) => (
            <TrilhaCard key={trilha.id} trilha={trilha} progressaoTipo={classeObj?.progressaoTipo ?? 'nex'} />
          ))}
        </div>
      )}
    </div>
  )
}

function TrilhaCard({ trilha, progressaoTipo }: { trilha: Trilha; progressaoTipo: string }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Cabeçalho da trilha */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-bold text-foreground">{trilha.nome}</h2>
          <span className="shrink-0 text-[10px] text-muted-foreground/60 font-medium mt-0.5">
            {trilha.fonte.abreviacao ?? trilha.fonte.nome}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{trilha.descricao}</p>
      </div>

      {/* Habilidades */}
      <div className="divide-y divide-border/40">
        {trilha.habilidades.map((hab) => (
          <div key={hab.id} className="px-4 py-2.5">
            <button
              className="w-full text-left"
              onClick={() => setExpanded(expanded === hab.id ? null : hab.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-[10px] font-semibold text-primary/70 uppercase tracking-wide">
                    {progressaoLabel(progressaoTipo, hab.progressao)}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate">{hab.nome}</span>
                </div>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={cn('shrink-0 w-3 h-3 text-muted-foreground/40 transition-transform', expanded === hab.id && 'rotate-180')}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>
            {expanded === hab.id && (
              <div className="mt-2 space-y-1.5">
                {hab.descricao.split('\n\n').map((para, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground/80">$1</strong>')
                  }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
