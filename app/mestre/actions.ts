'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API = process.env.API_URL ?? 'http://localhost:3001'

async function authFetch(path: string, method: string, body?: object) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  console.info(`[authFetch] ${method} ${path}: jwt=${jwt ? jwt.slice(0, 20) + '...' : '<nenhum>'}`)
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res
}

// ─── FONTES ──────────────────────────────────────────────────────────────────
export async function createFonte(data: { nome: string; abreviacao?: string }) {
  const res = await authFetch('/fontes', 'POST', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function updateFonte(id: number, data: { nome?: string; abreviacao?: string }) {
  const res = await authFetch(`/fontes/${id}`, 'PATCH', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function deleteFonte(id: number) {
  const res = await authFetch(`/fontes/${id}`, 'DELETE')
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
}

// ─── RITUAIS ─────────────────────────────────────────────────────────────────
export async function createRitual(data: object) {
  const res = await authFetch('/rituais', 'POST', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function updateRitual(id: number, data: object) {
  const res = await authFetch(`/rituais/${id}`, 'PATCH', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function deleteRitual(id: number) {
  const res = await authFetch(`/rituais/${id}`, 'DELETE')
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
}

// ─── PODERES ─────────────────────────────────────────────────────────────────
export async function createPoder(data: object) {
  const res = await authFetch('/poderes', 'POST', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function updatePoder(id: number, data: object) {
  const res = await authFetch(`/poderes/${id}`, 'PATCH', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function deletePoder(id: number) {
  const res = await authFetch(`/poderes/${id}`, 'DELETE')
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
}

// ─── ORIGENS ─────────────────────────────────────────────────────────────────
export async function createOrigem(data: object) {
  const res = await authFetch('/origens', 'POST', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function updateOrigem(id: number, data: object) {
  const res = await authFetch(`/origens/${id}`, 'PATCH', data)
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
  return res.json()
}

export async function deleteOrigem(id: number) {
  const res = await authFetch(`/origens/${id}`, 'DELETE')
  if (!res.ok) throw new Error(await res.text())
  revalidatePath('/mestre')
}

// ─── USUARIOS ────────────────────────────────────────────────────────────────
export async function createUsuario(data: { name: string; surname?: string; email: string; password: string; roleId?: number }) {
  console.info(`[mestre] Criando usuário: ${data.email}`)
  const res = await authFetch('/auth/register', 'POST', data)
  const body = await res.text().catch(() => '')
  console.info(`[mestre] Resposta create usuário ${data.email}: status=${res.status} body=${body.slice(0, 200)}`)
  if (!res.ok) throw new Error(body || 'Erro ao criar usuário')
  // sem revalidatePath — estado gerenciado localmente no componente
  return JSON.parse(body)
}

export async function updateUsuario(id: number, data: { name?: string; surname?: string | null; email?: string; password?: string; roleId?: number | null }) {
  console.info(`[mestre] Atualizando usuário ${id}`)
  const res = await authFetch(`/auth/users/${id}`, 'PATCH', data)
  const body = await res.text().catch(() => '')
  console.info(`[mestre] Resposta update usuário ${id}: status=${res.status} body=${body.slice(0, 200)}`)
  if (!res.ok) throw new Error(body || 'Erro ao atualizar usuário')
  // sem revalidatePath — estado gerenciado localmente no componente
  return JSON.parse(body)
}

export async function deleteUsuario(id: number) {
  console.info(`[mestre] Tentando deletar usuário ${id}`)
  const res = await authFetch(`/auth/users/${id}`, 'DELETE')
  const body = await res.text().catch(() => '')
  console.info(`[mestre] Resposta delete usuário ${id}: status=${res.status} body=${body}`)
  if (!res.ok) throw new Error(body || 'Erro ao deletar usuário')
  // sem revalidatePath — estado gerenciado localmente no componente
}
