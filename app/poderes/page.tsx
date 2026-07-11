import { getPoderes, getTipos, getElementos } from '@/lib/data'
import { PoderesClient } from '@/components/poderes-client'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function PoderesPage({ searchParams }: Props) {
  const { q } = await searchParams

  try {
    const [poderes, elementos] = await Promise.all([getPoderes(), getElementos()])
    const tipos = getTipos(poderes)
    return (
      <main>
        <PoderesClient poderes={poderes} tipos={tipos} elementos={elementos} initialSearch={q ?? ''} />
      </main>
    )
  } catch {
    return <ApiOfflinePage section="Poderes" />
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
