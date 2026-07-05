'use client'

import type { Origem } from '@/lib/types'

interface OrigemDetailProps {
  origem: Origem
}

export function OrigemDetail({ origem }: OrigemDetailProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-5 pt-4 pb-6 space-y-4">

        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground leading-tight">
            {origem.nome}
          </h2>
          <span className="text-xs text-muted-foreground">{origem.fonte.nome}</span>
        </div>

        <div className="h-px bg-border/50" />

        <p className="text-[13px] leading-relaxed text-foreground/90">
          {origem.descricao}
        </p>

        <div>
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Pericias Treinadas
          </span>
          <p className="text-xs text-foreground/80 mt-0.5">{origem.periciasTreinadas?.join(', ') ?? '—'}</p>
        </div>

        <div className="border border-border/60 rounded p-3 space-y-1.5 bg-violet-950/10">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Poder de Origem
            </span>
          </div>
          <p className="text-xs font-semibold text-violet-400">{origem.nomeDoPoder}</p>
          <p className="text-[13px] leading-relaxed text-foreground/85">{origem.poderDeOrigem}</p>
        </div>

        <div className="pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground/50">Fonte: {origem.fonte.nome}</span>
        </div>
      </div>
    </div>
  )
}
