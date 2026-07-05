'use server'

import { cookies } from 'next/headers'

const API = process.env.API_URL ?? 'http://localhost:3001'

export type LoginState = { error: string } | { success: true } | null

export async function loginAction(
  _: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let res: Response
  try {
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { error: 'Servidor indisponivel' }
  }

  if (!res.ok) {
    return { error: 'E-mail ou senha incorretos' }
  }

  // API retorna Set-Cookie: jwt=... -- extrair e repassar ao browser
  // (servidor -> servidor nao propaga cookie automaticamente)
  const setCookieHeader = res.headers.get('set-cookie')
  if (setCookieHeader) {
    const match = setCookieHeader.match(/jwt=([^;]+)/)
    if (match) {
      const cookieStore = await cookies()
      cookieStore.set('jwt', match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8,
      })
    }
  }

  return { success: true }
}
