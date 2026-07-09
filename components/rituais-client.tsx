'use client'

import { useState, useMemo } from 'react'
import { FilterBar } from '@/components/filter-bar'
import { RitualTable } from '@/components/ritual-table'
import { RitualDetail } from '@/components/ritual-detail'
import type { Ritual } from '@/lib/types'

interface RituaisClientProps {
  rituais: Ritual[]
  circles: string[]
  elementos: string[]
  initialSearch?: string
}

export function RituaisClient({ rituais, circles, elementos, initialSearch = '' }: RituaisClientProps) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedCircles, setSelectedCircles] = useState<string[]>([])
  const [selectedElementos, setSelectedElementos] = useState<string[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    rituais[0]?.slug ?? null
  )

  const filtered = useMemo(() => {
    return rituais
      .filter((r) => {
        const matchSearch = r.nome.toLowerCase().includes(search.toLowerCase())
        const matchCircle =
          selectedCircles.length === 0 || selectedCircles.includes(String(r.circulo))
        const matchEl =
          selectedElementos.length === 0 ||
          r.elementos.some((e) => selectedElementos.includes(e))
        return matchSearch && matchCircle && matchEl
      })
      .sort((a, b) => {
        const fonteA = a.fonte?.id ?? 0
        const fonteB = b.fonte?.id ?? 0
        if (fonteA !== fonteB) return fonteA - fonteB
        return a.nome.localeCompare(b.nome, 'pt-BR')
      })
  }, [rituais, search, selectedCircles, selectedElementos])

  const selectedRitual = rituais.find((r) => r.slug === selectedSlug) ?? null

  const effectiveSelected =
    filtered.find((r) => r.slug === selectedSlug) ? selectedRitual : filtered[0] ?? null

  const toggleCircle = (c: string) =>
    setSelectedCircles((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    )

  const toggleElemento = (e: string) =>
    setSelectedElementos((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    )

  const handleReset = () => {
    setSelectedCircles([])
    setSelectedElementos([])
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 92px)' }}>
      <div className="shrink-0">
        <FilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          circles={circles}
          elementos={elementos}
          selectedCircles={selectedCircles}
          selectedElementos={selectedElementos}
          onCircleToggle={toggleCircle}
          onElementoToggle={toggleElemento}
          onReset={handleReset}
          resultCount={filtered.length}
        />
      </div>

      <div className="flex gap-3 px-3 py-3 overflow-hidden flex-1">
        <div className="w-[58%] min-w-0 overflow-hidden">
          <RitualTable
            rituais={filtered}
            selectedId={effectiveSelected?.slug ?? null}
            onSelect={setSelectedSlug}
          />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden border border-border rounded bg-card">
          {effectiveSelected ? (
            <RitualDetail ritual={effectiveSelected} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-muted-foreground">
                Selecione um ritual para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
