import { lucia } from '@/lib/auth';
import { verifyRequestOrigin } from 'oslo/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const originHeader = request.headers.get('Origin');
  // In production, the host header is available. In development, it might be undefined.
  const host = request.headers.get('host') || new URL(request.url).host;

  // CSRF protection
  if (request.method !== 'GET') {
      if (!originHeader || !verifyRequestOrigin(originHeader, [host])) {
        return new NextResponse(null, {
          status: 403,
        });
      }
  }

  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  const { pathname } = request.nextUrl;

  // Redirect authenticated users from login/signup to dashboard
  if (pathname === '/login' || pathname === '/signup') {
    if (sessionId) {
      const { session } = await lucia.validateSession(sessionId);
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect dashboard route
  if (pathname.startsWith('/dashboard')) {
    if (!sessionId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const { session } = await lucia.validateSession(sessionId);
    if (!session) {
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
