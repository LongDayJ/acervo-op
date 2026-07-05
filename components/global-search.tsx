'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, BookOpen, Zap, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type ItemType = 'ritual' | 'poder' | 'origem'

interface SearchItem {
  type: ItemType
  nome: string
  slug: string
  fonte: string
  elementos?: string[]
  tipo?: string
  pericias?: string[]
}

interface SearchData {
  rituais: { nome: string; slug: string; elementos: string[]; fonte: string }[]
  poderes: { nome: string; slug: string; tipo: string; fonte: string }[]
  origens: { nome: string; slug: string; pericias: string[]; fonte: string }[]
}

const TYPE_CONFIG: Record<ItemType, { label: string; href: string; Icon: React.ElementType; color: string }> = {
  ritual: { label: 'Rituais', href: '/rituais', Icon: BookOpen, color: 'text-blue-400'   },
  poder:  { label: 'Poderes', href: '/poderes', Icon: Zap,      color: 'text-amber-400'  },
  origem: { label: 'Origens', href: '/origens', Icon: Users,    color: 'text-purple-400' },
}

const ORDER: ItemType[] = ['ritual', 'poder', 'origem']

function ItemMeta({ item }: { item: SearchItem }) {
  let extra: string | null = null
  if (item.type === 'ritual' && item.elementos?.length) {
    extra = item.elementos.join(', ')
  } else if (item.type === 'poder' && item.tipo) {
    extra = item.tipo
  } else if (item.type === 'origem' && item.pericias?.length) {
    extra = item.pericias.join(', ')
  }
  return (
    <div className="flex items-center gap-1.5 mt-[1px]">
      {extra && (
        <>
          <span className="text-[11px] text-muted-foreground/40 truncate">{extra}</span>
          <span className="text-[11px] text-muted-foreground/25">·</span>
        </>
      )}
      <span className="text-[11px] text-muted-foreground/40 font-medium shrink-0">{item.fonte}</span>
    </div>
  )
}

export function GlobalSearch() {
  const [query, setQuery]         = useState('')
  const [open, setOpen]           = useState(false)
  const [allItems, setAllItems]   = useState<SearchItem[]>([])
  const [loaded, setLoaded]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [focused, setFocused]     = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const router       = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (loaded || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/search')
      if (!res.ok) throw new Error(`/api/search retornou ${res.status}`)
      const data: SearchData = await res.json()
      setAllItems([
        ...data.rituais.map((r) => ({ type: 'ritual' as const, ...r })),
        ...data.poderes.map((p) => ({ type: 'poder'  as const, ...p })),
        ...data.origens.map((o) => ({ type: 'origem' as const, ...o })),
      ])
      setLoaded(true)
    } catch (err) {
      console.error('[GlobalSearch] falha ao carregar dados de busca:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  const trimmed  = query.trim()
  const filtered = trimmed.length > 1
    ? allItems.filter((i) => i.nome.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 20)
    : []

  const grouped = ORDER.reduce<Record<ItemType, SearchItem[]>>(
    (acc, type) => ({ ...acc, [type]: filtered.filter((i) => i.type === type) }),
    { ritual: [], poder: [], origem: [] }
  )

  const handleSelect = (item: SearchItem) => {
    setQuery('')
    setOpen(false)
    router.push(`${TYPE_CONFIG[item.type].href}?q=${encodeURIComponent(item.nome)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(filtered[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  useEffect(() => { setActiveIdx(-1) }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showDropdown = open && trimmed.length > 1

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        className={cn(
          'flex items-center gap-1.5 h-[26px] px-2 rounded border transition-all duration-200',
          focused
            ? 'border-primary/50 bg-background/80 ring-1 ring-primary/20'
            : 'border-border/40 bg-background/20 hover:border-border/70',
        )}
        style={{ width: focused ? 220 : 160 }}
      >
        <Search
          className={cn(
            'h-3 w-3 shrink-0 transition-colors',
            focused ? 'text-primary/70' : 'text-muted-foreground/40',
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setFocused(true); setOpen(true); load() }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar acervo..."
          className="flex-1 min-w-0 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/35 outline-none"
        />
        {query && (
          <button
            onMouseDown={(e) => { e.preventDefault(); setQuery(''); setOpen(false) }}
            className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] w-[420px] rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
          style={{ zIndex: 100 }}
        >
          {loading && !loaded ? (
            <div className="px-4 py-3 text-[11px] text-muted-foreground text-center">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-3 text-[11px] text-muted-foreground text-center">Nenhum resultado</div>
          ) : (
            <div className="max-h-[480px] overflow-y-auto py-1">
              {ORDER.filter((type) => grouped[type].length > 0).map((type) => {
                const { label, Icon, color } = TYPE_CONFIG[type]
                return (
                  <div key={type}>
                    <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                      <Icon className={cn('h-3 w-3', color)} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/55">
                        {label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/30 ml-auto tabular-nums">
                        {grouped[type].length}
                      </span>
                    </div>

                    {grouped[type].map((item) => {
                      const globalIdx = filtered.indexOf(item)
                      const isActive  = globalIdx === activeIdx
                      return (
                        <button
                          key={item.slug}
                          onMouseDown={(e) => { e.preventDefault(); handleSelect(item) }}
                          className={cn(
                            'w-full text-left px-4 py-[5px] transition-colors',
                            isActive ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
                          )}
                        >
                          <div className={cn(
                            'text-[13px] leading-tight truncate',
                            isActive ? 'text-foreground' : 'text-foreground/80',
                          )}>
                            {item.nome}
                          </div>
                          <ItemMeta item={item} />
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
