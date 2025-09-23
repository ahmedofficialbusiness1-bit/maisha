
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

    // If there's no session cookie and the user is not on an auth page, redirect to login.
    if (!sessionCookie && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If there is a session cookie and the user is on an auth page, redirect to the dashboard.
    if (sessionCookie && isAuthPage) {
        // The actual validation of the cookie will happen on the dashboard page.
        // This is just a UX improvement.
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
