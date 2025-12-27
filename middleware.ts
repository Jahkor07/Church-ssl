import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value

  const { pathname } = request.nextUrl

  // Allow requests to the login page to proceed
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // If trying to access a protected admin route without a token, redirect to login
  if (pathname.startsWith('/admin') && !authToken) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}