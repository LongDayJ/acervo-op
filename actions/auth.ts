'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API = process.env.API_URL ?? 'http://localhost:3001'

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  // Revogar JTI no backend (fail-safe: segue com logout mesmo se falhar)
  if (jwt) {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
    }).catch(() => null)
  }

  cookieStore.delete('jwt')
  redirect('/')
}
