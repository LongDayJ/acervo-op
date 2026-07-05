'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { OrigemDetail } from '@/components/origem-detail'
import { cn } from '@/lib/utils'
import type { Origem } from '@/lib/types'

interface OrigensClientProps {
  origens: Origem[]
  initialSearch?: string
}

export function OrigensClient({ origens, initialSearch = '' }: OrigensClientProps) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedNome, setSelectedNome] = useState<string | null>(origens[0]?.nome ?? null)

  const filtered = useMemo(
    () => origens.filter((o) => o.nome.toLowerCase().includes(search.toLowerCase())),
    [origens, search]
  )

  const selectedOrigem =
    (filtered.find((o) => o.nome === selectedNome) ?? filtered[0]) || null

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 92px)' }}>
      <div className="border-b border-border bg-card/40 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar origem..."
              className={cn(
                'w-full h-8 pl-8 pr-3 rounded bg-background/60 border border-border',
                'text-xs text-foreground placeholder:text-muted-foreground/60',
                'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors'
              )}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums shrink-0">
            {filtered.length} {filtered.length === 1 ? 'origem' : 'origens'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 px-3 py-3 overflow-hidden flex-1">
        <div className="w-[58%] min-w-0 overflow-hidden">
          <div className="flex flex-col h-full border border-border rounded overflow-hidden bg-card">
            <div
              className="grid shrink-0 border-b border-border bg-secondary/30"
              style={{ gridTemplateColumns: '1.4fr 1.6fr 60px' }}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Nome</div>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Pericias Treinadas</div>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Fonte</div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                  Nenhuma origem encontrada
                </div>
              ) : (
                filtered.map((origem) => {
                  const selected = selectedOrigem?.nome === origem.nome
                  return (
                    <button
                      key={origem.nome}
                      onClick={() => setSelectedNome(origem.nome)}
                      className={cn(
                        'w-full grid border-b border-border/20 text-left transition-colors items-center',
                        selected
                          ? 'bg-primary/[0.08] border-l-2 border-l-primary'
                          : 'hover:bg-white/[0.025] border-l-2 border-l-transparent'
                      )}
                      style={{ gridTemplateColumns: '1.4fr 1.6fr 60px' }}
                    >
                      <div className="px-3 py-[5px] text-xs font-medium text-foreground truncate">
                        {origem.nome}
                      </div>
                      <div className="px-3 py-[5px] text-[11px] text-muted-foreground/55 truncate">
                        {origem.periciasTreinadas?.join(', ') ?? '—'}
                      </div>
                      <div className="px-2 py-[5px] text-[11px] text-muted-foreground/50 text-center truncate">
                        {origem.fonte.abreviacao ?? origem.fonte.nome}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden border border-border rounded bg-card">
          {selectedOrigem ? (
            <OrigemDetail origem={selectedOrigem} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-muted-foreground">Selecione uma origem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
