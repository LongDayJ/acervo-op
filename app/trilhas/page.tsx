import { getClasses, getTrilhas } from '@/lib/data'
import { TrilhasClient } from '@/components/trilhas-client'

export const dynamic = 'force-dynamic'

export default async function TrilhasPage() {
  try {
    const [classes, trilhas] = await Promise.all([getClasses(), getTrilhas()])
    return (
      <main>
        <TrilhasClient classes={classes} trilhas={trilhas} />
      </main>
    )
  } catch {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center px-4">
        <p className="text-sm font-medium text-foreground">Trilhas indisponivel</p>
        <p className="text-xs text-muted-foreground">API nao esta respondendo. Inicie o servidor em localhost:3001.</p>
      </div>
    )
  }
}
