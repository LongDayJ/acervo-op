import { NextResponse } from 'next/server'
import { getRituais, getPoderes, getOrigens } from '@/lib/data'

// ISR: revalida a cada 5 minutos -- dados raramente mudam
export const revalidate = 300

export async function GET() {
  try {
    const [rituais, poderes, origens] = await Promise.all([
      getRituais(),
      getPoderes(),
      getOrigens(),
    ])

    return NextResponse.json({
      rituais: rituais.map((r) => ({
        nome: r.nome,
        slug: r.slug,
        elementos: r.elementos,
        fonte: r.fonte.abreviacao ?? r.fonte.nome,
      })),
      poderes: poderes.map((p) => ({
        nome: p.nome,
        slug: p.slug,
        tipo: p.tipo,
        fonte: p.fonte.abreviacao ?? p.fonte.nome,
      })),
      origens: origens.map((o) => ({
        nome: o.nome,
        slug: o.slug,
        pericias: o.periciasTreinadas ?? [],
        fonte: o.fonte.abreviacao ?? o.fonte.nome,
      })),
    })
  } catch (err) {
    console.error('[/api/search] falha ao buscar dados:', err)
    return NextResponse.json(
      { rituais: [], poderes: [], origens: [] },
      { status: 503 },
    )
  }
}
