'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn, getElementStyle, CIRCLE_COLOR, CIRCLE_ROMAN } from '@/lib/utils'
import type { Ritual, Modificacao } from '@/lib/types'

interface RitualDetailProps {
  ritual: Ritual
}

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  if (!value || value === '-') return null
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs text-foreground/90 leading-snug">{value}</span>
    </div>
  )
}

function ModAccordion({ mod }: { mod: Modificacao }) {
  const [open, setOpen] = useState(false)

  const labelMap: Record<string, string> = { Discente: 'Discente', discente: 'Discente', Verdadeiro: 'Verdadeiro', verdadeiro: 'Verdadeiro' }
  const colorMap: Record<string, string> = { Discente: 'text-indigo-400', discente: 'text-indigo-400', Verdadeiro: 'text-purple-300', verdadeiro: 'text-purple-300' }

  return (
    <div className="border border-border/60 rounded overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-semibold', colorMap[mod.tipo])}>
            {labelMap[mod.tipo]}
          </span>
          {mod.custo_pe > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {mod.custo_pe} PE
            </span>
          )}
          {mod.requisitos && mod.requisitos.length > 0 && (
            <span className="text-[10px] text-muted-foreground/60">
              · {mod.requisitos.join(', ')}
            </span>
          )}
        </div>
        <ChevronRight
          className={cn(
            'h-3 w-3 text-muted-foreground transition-transform shrink-0',
            open && 'rotate-90'
          )}
        />
      </button>
      {open && (
        <div className="px-3 pb-2.5 pt-0 text-xs text-foreground/85 leading-relaxed border-t border-border/40">
          {mod.descricao}
        </div>
      )}
    </div>
  )
}

export function RitualDetail({ ritual }: RitualDetailProps) {
  const metaFields = [
    { label: 'Execucao', value: ritual.execucao },
    { label: 'Alcance', value: ritual.alcance },
    { label: 'Area', value: ritual.area },
    { label: 'Alvo', value: ritual.alvo },
    { label: 'Efeito', value: ritual.efeito },
    { label: 'Duracao', value: ritual.duracao },
    { label: 'Resistencia', value: ritual.resistencia },
  ].filter((f) => f.value && f.value !== '-' && f.value !== null)

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-5 pt-4 pb-6 space-y-4">

        <div className="space-y-1.5">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground leading-tight">
            {ritual.nome}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-xs font-semibold',
                CIRCLE_COLOR[ritual.circulo] ?? 'text-muted-foreground'
              )}
            >
              {CIRCLE_ROMAN[ritual.circulo] ?? ritual.circulo}. Circulo
            </span>

            <span className="text-border">·</span>

            <div className="flex items-center gap-1 flex-wrap">
              {ritual.elementos.map((el) => (
                <span
                  key={el}
                  className={cn(
                    'inline-block px-[6px] py-[2px] rounded text-[11px] font-medium',
                    getElementStyle(el).pill
                  )}
                >
                  {el}
                </span>
              ))}
            </div>

            <span className="text-border">·</span>

            <span className="text-xs text-muted-foreground">{ritual.fonte.nome}</span>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <p className="text-[13px] leading-relaxed text-foreground/90">
          {ritual.descricao}
        </p>

        {metaFields.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
            {metaFields.map(({ label, value }) => (
              <MetaRow key={label} label={label} value={value} />
            ))}
          </div>
        )}

        {ritual.modificacoes && ritual.modificacoes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h3 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Modificacoes
            </h3>
            <div className="space-y-1">
              {[...ritual.modificacoes]
                .sort((a, b) => {
                  const order: Record<string, number> = { Discente: 0, discente: 0, Verdadeiro: 1, verdadeiro: 1 }
                  return (order[a.tipo] ?? 2) - (order[b.tipo] ?? 2)
                })
                .map((mod, i) => (
                  <ModAccordion key={i} mod={mod} />
                ))}
            </div>
          </div>
        )}

        <div className="pt-1 border-t border-border/40">
          <span className="text-[11px] text-muted-foreground/50">
            Fonte: {ritual.fonte.nome}
          </span>
        </div>
      </div>
    </div>
  )
}
