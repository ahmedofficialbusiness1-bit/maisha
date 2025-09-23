
import {NextResponse} from 'next/server';
import {getAuth} from 'firebase-admin/auth';
import {adminApp} from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    
    try {
      const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);

      if (decodedToken) {
        //Generate session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await getAuth(adminApp).createSessionCookie(
          idToken,
          {expiresIn}
        );
        const options = {
          name: 'session',
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        };

        const response = NextResponse.json({isLogged: true}, { status: 200 });
        response.cookies.set(options);
        
        return response;
      }
    } catch (error) {
        console.error("Error verifying ID token or creating session cookie:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
