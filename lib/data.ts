import type { Ritual, Origem, Poder } from '@/lib/types'

const API = process.env.API_URL ?? 'http://localhost:3001'

async function apiFetch<T>(path: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API}${path}`, { cache: 'no-store' })
  } catch (err) {
    throw new Error(`API indisponivel em ${API}${path}: ${(err as Error).message}`)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`API ${res.status} ${path} - ${body?.detail ?? body?.message ?? 'sem detalhes'}`)
  }

  return res.json() as Promise<T>
}

export async function getRituais(): Promise<Ritual[]> {
  return apiFetch<Ritual[]>('/rituais')
}

export async function getOrigens(): Promise<Origem[]> {
  return apiFetch<Origem[]>('/origens')
}

export async function getPoderes(): Promise<Poder[]> {
  return apiFetch<Poder[]>('/poderes')
}

export function getCirculos(rituais: Ritual[]): string[] {
  const set = new Set(rituais.map((r) => String(r.circulo)))
  return Array.from(set).sort((a, b) => Number(a) - Number(b))
}

export function getElementos(rituais: Ritual[]): string[] {
  const set = new Set(rituais.flatMap((r) => r.elementos))
  return Array.from(set).sort()
}

export function getTipos(poderes: Poder[]): string[] {
  const set = new Set(poderes.map((p) => p.tipo))
  return Array.from(set).sort()
}
