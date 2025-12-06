import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminAuthToken = request.cookies.get('admin-auth-token')?.value
  console.log(`Middleware triggered for path: ${request.nextUrl.pathname}. Token: ${adminAuthToken ? 'present' : 'absent'}`);

  const { pathname } = request.nextUrl

  // if the user is trying to access any admin page and they are not logged in, redirect to login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!adminAuthToken) {
      console.log(`Redirecting to /admin/login. No token for protected route: ${pathname}`);
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // if the user is logged in and tries to access the login page, redirect to dashboard
  if (pathname.startsWith('/admin/login') && adminAuthToken) {
    console.log('User is logged in, redirecting from /admin/login to /admin/dashboard');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}