'use server'

import { cookies } from 'next/headers'

const API = process.env.API_URL ?? 'http://localhost:3001'

export type ChangePasswordState = { error: string } | { success: true } | null

export async function changePasswordAction(
  _: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const newPassword = formData.get('newPassword') as string
  const confirm    = formData.get('confirm') as string

  if (!newPassword || newPassword.length < 6) return { error: 'Senha minima: 6 caracteres' }
  if (newPassword !== confirm) return { error: 'As senhas nao coincidem' }

  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value
  if (!jwt) return { error: 'Sessao expirada. Faca login novamente.' }

  let res: Response
  try {
    res = await fetch(`${API}/auth/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ newPassword }),
    })
  } catch {
    return { error: 'Servidor indisponivel' }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { error: body || 'Erro ao trocar senha' }
  }

  // Limpar cookie — usuário precisa logar novamente com a nova senha
  cookieStore.delete('jwt')

  return { success: true }
}
