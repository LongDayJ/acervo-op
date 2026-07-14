import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { MestrePanel } from '@/components/mestre/mestre-panel'

const API = process.env.API_URL ?? 'http://localhost:3001'

async function fetchAll() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  const authHeaders = {
    'Content-Type': 'application/json',
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  }

  const safe = (r: Response) => r.ok ? r.json() : []
  const safeLog = async (r: Response, label: string) => {
    if (r.ok) return r.json()
    const body = await r.text().catch(() => '')
    console.error(`[fetchAll] ${label} ${r.status}`, body.slice(0, 200))
    return []
  }

  const [fontes, rituais, poderes, origens, elementos, usuarios, roles, classes, trilhas] = await Promise.all([
    fetch(`${API}/fontes`,    { cache: 'no-store' }).then(safe).catch(() => []),
    fetch(`${API}/rituais`,   { cache: 'no-store' }).then(safe).catch(() => []),
    fetch(`${API}/poderes`,   { cache: 'no-store' }).then(safe).catch(() => []),
    fetch(`${API}/origens`,   { cache: 'no-store' }).then(safe).catch(() => []),
    fetch(`${API}/elementos`, { cache: 'no-store' }).then(safe).catch(() => []),
    fetch(`${API}/auth/users`, { cache: 'no-store', headers: authHeaders }).then((r) => safeLog(r, '/auth/users')).catch((e) => { console.error('[fetchAll] /auth/users', e); return [] }),
    fetch(`${API}/roles`,      { cache: 'no-store', headers: authHeaders }).then((r) => safeLog(r, '/roles')).catch((e) => { console.error('[fetchAll] /roles', e); return [] }),
    fetch(`${API}/classes`,   { cache: 'no-store' }).then(safe).catch(() => []).then((list: any[]) => list.sort((a, b) => ['combatente','especialista','ocultista','sobrevivente'].indexOf(a.slug) - ['combatente','especialista','ocultista','sobrevivente'].indexOf(b.slug))),
    fetch(`${API}/trilhas`,   { cache: 'no-store' }).then(safe).catch(() => []),
  ])
  return { fontes, rituais, poderes, origens, elementos, usuarios, roles, classes, trilhas }
}

export default async function MestrePage() {
  const session = await getSession()
  if (!session?.isAdmin) redirect('/')

  const data = await fetchAll()

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground tracking-tight">Painel do Mestre</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie o conteudo do compendio</p>
      </div>
      <MestrePanel {...data} currentUserId={session.id} canManageUsers={session.email === 'mestre@op.com'} />
    </main>
  )
}
