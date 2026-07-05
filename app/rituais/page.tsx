import { getRituais, getCirculos, getElementos } from '@/lib/data'
import { RituaisClient } from '@/components/rituais-client'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function RituaisPage({ searchParams }: Props) {
  const { q } = await searchParams

  try {
    const rituais = await getRituais()
    const circles = getCirculos(rituais)
    const elementos = getElementos(rituais)
    return (
      <main>
        <RituaisClient rituais={rituais} circles={circles} elementos={elementos} initialSearch={q ?? ''} />
      </main>
    )
  } catch {
    return <ApiOfflinePage section="Rituais" />
  }
}

function ApiOfflinePage({ section }: { section: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center px-4">
      <p className="text-sm font-medium text-foreground">{section} indisponivel</p>
      <p className="text-xs text-muted-foreground">API nao esta respondendo. Inicie o servidor em localhost:3001.</p>
    </div>
  )
}
