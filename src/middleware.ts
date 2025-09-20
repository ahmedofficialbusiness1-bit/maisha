
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const idToken = request.cookies.get('idToken')?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    if (idToken) {
      // If the user is logged in and tries to access login/register, redirect to the game
      return NextResponse.redirect(new URL('/game', request.url));
    }
    // If not logged in, allow access to auth pages
    return NextResponse.next();
  }

  // For any other page, check if the user is logged in
  if (!idToken) {
    // If not logged in and not on an auth page, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in, allow access
  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files, API routes, and the root page.
  // The root page is public, login/register have their own logic, and /game is protected.
  matcher: ['/game', '/login', '/register'],
};
