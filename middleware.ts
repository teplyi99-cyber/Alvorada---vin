import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  })
  const { pathname } = req.nextUrl

  const publicPaths = [
    '/login',
    '/onboarding',
    '/practice',
    '/vocabulary',
    '/listening',
    '/writing',
    '/api/auth',
    '/api/health',
    '/api/chat',
    '/api/writing',
  ]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
