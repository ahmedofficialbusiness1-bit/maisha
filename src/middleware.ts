import { lucia } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname === '/signup') {
    if (sessionId) {
        // User is authenticated, redirect to dashboard if they try to access login/signup
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // For all other protected routes, just check for the cookie existence.
  // The actual validation will happen in the page/layout server component.
  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files, API routes, and image optimization.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
