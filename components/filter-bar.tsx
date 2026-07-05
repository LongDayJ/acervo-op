'use client'

import { Search, X } from 'lucide-react'
import { cn, getElementStyle, CIRCLE_COLOR, CIRCLE_ROMAN } from '@/lib/utils'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  circles: string[]
  elementos: string[]
  selectedCircles: string[]
  selectedElementos: string[]
  onCircleToggle: (c: string) => void
  onElementoToggle: (e: string) => void
  onReset: () => void
  resultCount: number
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  circles,
  elementos,
  selectedCircles,
  selectedElementos,
  onCircleToggle,
  onElementoToggle,
  onReset,
  resultCount,
}: FilterBarProps) {
  const hasFilters = selectedCircles.length > 0 || selectedElementos.length > 0

  return (
    <div className="border-b border-border bg-card/40 px-3 py-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Busca */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar ritual..."
            className={cn(
              'w-full h-8 pl-8 pr-3 rounded bg-background/60 border border-border',
              'text-xs text-foreground placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50',
              'transition-colors'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Contagem */}
        <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
          {resultCount} {resultCount === 1 ? 'ritual' : 'rituais'}
        </span>

        {/* Separador */}
        <div className="h-4 w-px bg-border shrink-0" />

        {/* Filtros Círculo */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mr-0.5">
            Círculo
          </span>
          {circles.map((c) => {
            const active = selectedCircles.includes(c)
            return (
              <button
                key={c}
                onClick={() => onCircleToggle(c)}
                className={cn(
                  'h-6 px-2 rounded text-[11px] font-semibold border transition-all',
                  active
                    ? cn(CIRCLE_COLOR[Number(c)], 'bg-white/[0.06] border-white/20')
                    : 'text-muted-foreground/50 border-border/50 hover:text-muted-foreground hover:border-border'
                )}
                title={`Círculo ${c}`}
              >
                {CIRCLE_ROMAN[Number(c)] ?? c}
              </button>
            )
          })}
        </div>

        {/* Separador */}
        <div className="h-4 w-px bg-border shrink-0" />

        {/* Filtros Elemento */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mr-0.5 shrink-0">
            Elemento
          </span>
          {elementos.map((el) => {
            const active = selectedElementos.includes(el)
            const style = getElementStyle(el)
            return (
              <button
                key={el}
                onClick={() => onElementoToggle(el)}
                className={cn(
                  'h-6 px-2 rounded text-[11px] font-medium border transition-all',
                  active ? style.active : style.filter
                )}
              >
                {el}
              </button>
            )
          })}
        </div>

        {/* Limpar filtros */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="ml-auto flex items-center gap-1 h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded transition-colors shrink-0"
          >
            <X className="h-3 w-3" />
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}
