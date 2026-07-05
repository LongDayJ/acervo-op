import { getOrigens } from '@/lib/data'
import { OrigensClient } from '@/components/origens-client'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function OrigensPage({ searchParams }: Props) {
  const { q } = await searchParams

  try {
    const origens = await getOrigens()
    return (
      <main>
        <OrigensClient origens={origens} initialSearch={q ?? ''} />
      </main>
    )
  } catch {
    return <ApiOfflinePage section="Origens" />
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
