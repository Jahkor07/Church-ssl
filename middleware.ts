import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    // Protect the route with Clerk
    auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}