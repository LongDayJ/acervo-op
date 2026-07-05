'use client'

import { useState, useMemo } from 'react'
import { Search, X, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react'
import { PoderDetail } from '@/components/poder-detail'
import { cn, getTipoStyle } from '@/lib/utils'
import type { Poder } from '@/lib/types'

interface PoderesClientProps {
  poderes: Poder[]
  tipos: string[]
  initialSearch?: string
}

const COLS = '1.2fr 2.5fr 110px 56px'

const ATTRS = ['For', 'Agi', 'Int', 'Pre', 'Vig', 'NEX']

const ATTR_COLOR: Record<string, string> = {
  Nenhum: 'bg-slate-500',
  For:    'bg-rose-400',
  Agi:    'bg-teal-400',
  Int:    'bg-indigo-400',
  Pre:    'bg-purple-400',
  Vig:    'bg-amber-400',
  NEX:    'bg-fuchsia-400',
}

const FONTE_COLOR: Record<string, string> = {
  OPRPG: 'bg-indigo-400',
  AS:    'bg-violet-400',
  SaoH:  'bg-purple-400',
}

const TIPO_DOT: Record<string, string> = {
  Combatente:  'bg-orange-400',
  Especialista:'bg-blue-400',
  Geral:       'bg-lime-400',
  Ocultista:   'bg-fuchsia-400',
}

function FilterRow({
  dot, label, active, onClick,
}: { dot: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-[5px] rounded text-left transition-colors',
        active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
      )}
    >
      <span className={cn('shrink-0 w-2 h-2 rounded-full', dot)} />
      <span className={cn('flex-1 text-[12px]', active ? 'text-foreground' : 'text-muted-foreground/70')}>
        {label}
      </span>
      <span className={cn(
        'shrink-0 w-4 h-4 rounded-full border transition-colors flex items-center justify-center',
        active ? 'border-primary bg-primary/30' : 'border-border/50'
      )}>
        {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
      </span>
    </button>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 mb-1.5 px-2">
        <div className="w-[3px] h-3.5 rounded-full bg-primary shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function PoderesClient({ poderes, tipos, initialSearch = '' }: PoderesClientProps) {
  const [search, setSearch] = useState(initialSearch)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [selectedReqs, setSelectedReqs] = useState<string[]>([])
  const [selectedFontes, setSelectedFontes] = useState<string[]>([])
  const [selectedNome, setSelectedNome] = useState<string | null>(poderes[0]?.nome ?? null)

  // Atributos presentes nos dados
  const atributos = useMemo(() => {
    const found = new Set<string>()
    for (const p of poderes) {
      if (!p.requisitos) { found.add('Nenhum'); continue }
      for (const a of ATTRS) {
        if (p.requisitos.includes(a)) found.add(a)
      }
    }
    return ['Nenhum', ...ATTRS.filter((a) => found.has(a))]
  }, [poderes])

  // Fontes unicas
  const fontes = useMemo(() => {
    return [...new Set(poderes.map((p) => p.fonte.abreviacao ?? p.fonte.nome))].sort()
  }, [poderes])

  const filtered = useMemo(() => {
    return poderes.filter((p) => {
      const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
      const matchTipo = selectedTipos.length === 0 || selectedTipos.includes(p.tipo)
      const matchReq =
        selectedReqs.length === 0 ||
        selectedReqs.some((req) => {
          if (req === 'Nenhum') return !p.requisitos
          return p.requisitos?.includes(req) ?? false
        })
      const matchFonte =
        selectedFontes.length === 0 ||
        selectedFontes.includes(p.fonte.abreviacao ?? p.fonte.nome)
      return matchSearch && matchTipo && matchReq && matchFonte
    })
  }, [poderes, search, selectedTipos, selectedReqs, selectedFontes])

  const selectedPoder =
    (filtered.find((p) => p.nome === selectedNome) ?? filtered[0]) || null

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) =>
    setter((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val])

  const activeCount = selectedTipos.length + selectedReqs.length + selectedFontes.length

  const clearAll = () => {
    setSelectedTipos([])
    setSelectedReqs([])
    setSelectedFontes([])
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 92px)' }}>

      {/* Barra principal */}
      <div className="border-b border-border bg-card/40 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar poder..."
              className={cn(
                'w-full h-8 pl-8 pr-3 rounded bg-background/60 border border-border',
                'text-xs text-foreground placeholder:text-muted-foreground/60',
                'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors'
              )}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {filtered.length}/{poderes.length}
          </span>

          <div className="h-4 w-px bg-border shrink-0" />

          {/* Botao filtros */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 h-8 px-3 rounded border text-xs font-medium transition-colors',
              showFilters || activeCount > 0
                ? 'border-primary/50 text-primary bg-primary/[0.08]'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {activeCount > 0 && (
              <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground leading-none">
                {activeCount}
              </span>
            )}
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 h-8 px-2 text-[11px] text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded transition-colors shrink-0"
            >
              <X className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>
      </div>

      {/* Painel de filtros extendidos */}
      {showFilters && (
        <div className="border-b border-border bg-card/20 px-4 py-3 shrink-0">
          <div className="grid grid-cols-3 gap-6">

            <FilterGroup title="Tipo">
              {tipos.map((t) => (
                <FilterRow
                  key={t}
                  dot={TIPO_DOT[t] ?? 'bg-zinc-400'}
                  label={t}
                  active={selectedTipos.includes(t)}
                  onClick={() => toggle(setSelectedTipos)(t)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Requisitos">
              {atributos.map((a) => (
                <FilterRow
                  key={a}
                  dot={ATTR_COLOR[a] ?? 'bg-zinc-400'}
                  label={a}
                  active={selectedReqs.includes(a)}
                  onClick={() => toggle(setSelectedReqs)(a)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Fonte">
              {fontes.map((f) => (
                <FilterRow
                  key={f}
                  dot={FONTE_COLOR[f] ?? 'bg-zinc-400'}
                  label={f}
                  active={selectedFontes.includes(f)}
                  onClick={() => toggle(setSelectedFontes)(f)}
                />
              ))}
            </FilterGroup>

          </div>
        </div>
      )}

      {/* Conteudo principal */}
      <div className="flex gap-3 px-3 py-3 overflow-hidden flex-1">

        {/* Tabela */}
        <div className="w-[58%] min-w-0 overflow-hidden">
          <div className="flex flex-col h-full border border-border rounded overflow-hidden bg-card">

            <div className="grid shrink-0 border-b border-border bg-secondary/30" style={{ gridTemplateColumns: COLS }}>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Nome</div>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Requisitos</div>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Tipo</div>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-center">Fonte</div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">Nenhum poder encontrado</div>
              ) : (
                filtered.map((poder) => {
                  const selected = selectedPoder?.nome === poder.nome
                  const tipoStyle = getTipoStyle(poder.tipo)
                  return (
                    <button
                      key={poder.nome}
                      onClick={() => setSelectedNome(poder.nome)}
                      className={cn(
                        'w-full grid border-b border-border/20 text-left transition-colors items-center',
                        selected
                          ? 'bg-primary/[0.08] border-l-2 border-l-primary'
                          : 'hover:bg-white/[0.025] border-l-2 border-l-transparent'
                      )}
                      style={{ gridTemplateColumns: COLS }}
                    >
                      <div className="px-3 py-[4px] text-xs text-foreground truncate">
                        {poder.nome}
                      </div>
                      <div className="px-3 py-[4px] text-[11px] text-muted-foreground/55 truncate text-center">
                        {poder.requisitos?.join(', ') ?? '—'}
                      </div>
                      <div className="px-2 py-[4px] flex justify-center">
                        <span className={cn('px-[6px] py-[2px] rounded text-[10px] font-medium leading-tight whitespace-nowrap', tipoStyle.pill)}>
                          {poder.tipo}
                        </span>
                      </div>
                      <div className="px-2 py-[4px] text-[11px] text-muted-foreground/50 text-center">
                        {poder.fonte.abreviacao ?? poder.fonte.nome}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Detalhe */}
        <div className="flex-1 min-w-0 overflow-hidden border border-border rounded bg-card">
          {selectedPoder ? (
            <PoderDetail poder={selectedPoder} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-muted-foreground">Selecione um poder</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
