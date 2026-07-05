import { NextRequest, NextResponse } from 'next/server'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1]
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

function isTokenValid(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const exp = payload.exp as number | undefined
  if (exp && Date.now() / 1000 > exp) return false
  return true
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('jwt')?.value

  // Rotas de admin -- requer isAdmin no payload
  if (pathname.startsWith('/mestre')) {
    if (!token || !isTokenValid(token)) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
    const payload = decodeJwtPayload(token!)
    if (!payload?.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // Rotas autenticadas (fichas, campanhas)
  if (!token || !isTokenValid(token)) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/mestre/:path*', '/fichas/:path*', '/campanhas/:path*'],
}
