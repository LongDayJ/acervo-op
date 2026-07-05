'use client'

import { cn, getTipoStyle } from '@/lib/utils'
import type { Poder } from '@/lib/types'

interface PoderDetailProps {
  poder: Poder
}

export function PoderDetail({ poder }: PoderDetailProps) {
  const tipoStyle = getTipoStyle(poder.tipo)

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-5 pt-4 pb-6 space-y-3">

        <div className="space-y-1.5">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground leading-tight">
            {poder.nome}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('inline-block px-[6px] py-[2px] rounded text-[11px] font-medium', tipoStyle.pill)}>
              {poder.tipo}
            </span>
            <span className="text-border">·</span>
            <span className="text-xs text-muted-foreground">{poder.fonte.nome}</span>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <p className="text-[13px] leading-relaxed text-foreground/90">
          {poder.descricao}
        </p>

        {poder.requisitos && poder.requisitos.length > 0 && (
          <div className="border-t border-border/40 pt-3">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Requisitos
            </span>
            <p className="text-xs text-foreground/80 mt-1">{poder.requisitos.join(', ')}</p>
          </div>
        )}

        <div className="pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground/50">Fonte: {poder.fonte.nome}</span>
        </div>
      </div>
    </div>
  )
}
