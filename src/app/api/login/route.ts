
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    const authorization = request.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        
        try {
            const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);

            if (decodedToken) {
                // Set session cookie
                const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
                const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, {
                    expiresIn,
                });

                cookies().set('session', sessionCookie, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: expiresIn,
                });

                return NextResponse.json({ status: 'success' }, { status: 200 });
            }
        } catch (error: any) {
            console.error('Session cookie creation error:', error);
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
