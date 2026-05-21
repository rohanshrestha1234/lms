import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // const { supabaseResponse, user } = await updateSession(request)
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Support for subdomain multi-tenancy e.g., "schoolname.platform.com"
  // For local dev, might use "schoolname.localhost:3000"
  let subdomain = ''
  
  if (hostname.includes('.')) {
    const parts = hostname.split('.')
    if (parts.length >= 3 || (parts.length === 2 && hostname.includes('localhost'))) {
      subdomain = parts[0]
      if (subdomain === 'www') subdomain = ''
    }
  }

  // Handle protected routes
  const isDashboard = url.pathname.startsWith('/dashboard')
  // TEMPORARILY DISABLED FOR LOCAL VIEWING
  // if (!user && isDashboard) {
  //   const redirectUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // Rewrite for subdomains
  if (subdomain && subdomain !== 'app' && subdomain !== 'admin') {
    const path = url.pathname === '/' ? '' : url.pathname
    const search = url.search
    const rewriteUrl = new URL(`/tenant/${subdomain}${path}${search}`, request.url)
    console.log(`[MIDDLEWARE] Rewriting ${url.pathname} to ${rewriteUrl.pathname}`)
    return NextResponse.rewrite(rewriteUrl)
  }

  console.log(`[MIDDLEWARE] No rewrite for ${url.pathname}, subdomain: ${subdomain}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
