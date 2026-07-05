import { cookies } from 'next/headers'

export interface Session {
  id: number
  name: string
  email: string
  isAdmin: boolean
  modules: string[]
  writeModules: string[]
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1]
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt')?.value
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const exp = payload.exp as number | undefined
  if (exp && Date.now() / 1000 > exp) return null

  return {
    id:           payload.sub as number,
    name:         (payload.name as string) ?? '',
    email:        payload.email as string,
    isAdmin:      (payload.isAdmin as boolean) ?? false,
    modules:      (payload.modules as string[]) ?? [],
    writeModules: (payload.writeModules as string[]) ?? [],
  }
}
