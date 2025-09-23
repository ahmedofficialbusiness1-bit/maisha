import { lucia } from '@/lib/auth';
import { verifyRequestOrigin } from 'oslo/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const originHeader = request.headers.get('Origin');
  const hostHeader = request.headers.get('Host');
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  if (pathname === '/login' || pathname === '/signup') {
    if (sessionId) {
      const { session } = await lucia.validateSession(sessionId);
      if (session) {
        // Redirect authenticated users away from login/signup
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!sessionId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const { session } = await lucia.validateSession(sessionId);
    if (!session) {
      // Invalid session, redirect to login
      const sessionCookie = lucia.createBlankSessionCookie();
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return response;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
