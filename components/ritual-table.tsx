'use client'

import { cn, getElementStyle, CIRCLE_COLOR, CIRCLE_ROMAN } from '@/lib/utils'
import type { Ritual } from '@/lib/types'


interface RitualTableProps {
  rituais: Ritual[]
  selectedId: string | null
  onSelect: (slug: string) => void
}

export function RitualTable({ rituais, selectedId, onSelect }: RitualTableProps) {
  return (
    <div className="flex flex-col h-full border border-border rounded overflow-hidden bg-card">
      <div className="grid border-b border-border bg-secondary/20 shrink-0" style={{ gridTemplateColumns: '1fr 40px 1.2fr 90px 52px' }}>
        <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Nome</div>
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Cir.</div>
        <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Elementos</div>
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Execucao</div>
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Fonte</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rituais.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            Nenhum ritual encontrado
          </div>
        ) : (
          rituais.map((ritual) => {
            const selected = selectedId === ritual.slug
            return (
              <button
                key={ritual.slug}
                onClick={() => onSelect(ritual.slug)}
                className={cn(
                  'w-full grid border-b border-border/30 text-left items-center',
                  'transition-colors cursor-pointer',
                  selected
                    ? 'bg-primary/[0.08] border-l-2 border-l-primary'
                    : 'hover:bg-white/[0.025] border-l-2 border-l-transparent'
                )}
                style={{ gridTemplateColumns: '1fr 40px 1.2fr 90px 52px' }}
              >
                <div className="px-3 py-[5px] text-xs font-medium text-foreground truncate">
                  {ritual.nome}
                </div>

                <div className="px-2 py-[5px] text-center">
                  <span className={cn('text-[11px] font-bold tabular-nums', CIRCLE_COLOR[ritual.circulo] ?? 'text-muted-foreground')}>
                    {CIRCLE_ROMAN[ritual.circulo] ?? ritual.circulo}
                  </span>
                </div>

                <div className="px-3 py-[5px] flex items-center gap-1 flex-wrap">
                  {ritual.elementos.map((el) => (
                    <span key={el} className={cn('inline-block px-[6px] py-[2px] rounded text-[10px] font-medium leading-tight', getElementStyle(el).pill)}>
                      {el}
                    </span>
                  ))}
                </div>

                <div className="px-2 py-[5px] text-[11px] text-muted-foreground/55 text-center truncate">
                  {ritual.execucao ?? '—'}
                </div>

                <div className="px-2 py-[5px] text-[11px] text-muted-foreground/50 text-center truncate">
                  {ritual.fonte.abreviacao ?? ritual.fonte.nome}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
