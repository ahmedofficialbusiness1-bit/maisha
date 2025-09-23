'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';
import { cache } from 'react';
import { redirect } from 'next/navigation';


const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(31, { message: 'Username must be at most 31 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(255, { message: 'Password must be at most 255 characters long' }),
});

export async function signup(
    prevState: { error: string } | undefined,
    formData: FormData
) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
        error: parsed.error.errors.map(e => e.message).join(', ')
    };
  }

  const { username, password } = parsed.data;

  try {
    const auth = getAuth(adminApp);
    const userRecord = await auth.createUser({
        displayName: username,
        password: password,
    });
    
    const token = await auth.createCustomToken(userRecord.uid);
    cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });

  } catch (e: any) {
    if (e.code === 'auth/email-already-exists') {
        return { error: 'Username already taken.' };
    }
    return {
      error: 'An unknown error occurred: ' + e.message,
    };
  }
}

export async function login(
    prevState: { error: string } | undefined,
    formData: FormData
): Promise<{ error: string } | { error?: undefined }> {
    // This action is now handled client-side with Firebase SDK to get ID token
    // And then server-side in the middleware to create a session cookie
    // This server action is kept for compatibility with the form structure but redirects
    return redirect('/login');
}

export async function logout(): Promise<{ error: string } | { error?: undefined }> {
	cookies().delete('session');
    return {};
}


export const validateRequest = cache(
	async (): Promise<{ user: { uid: string; username: string; } } | { user: null }> => {
		const sessionCookie = cookies().get('session')?.value;
		if (!sessionCookie) {
			return { user: null };
		}

		try {
			const decodedIdToken = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
			return {
				user: {
                    uid: decodedIdToken.uid,
                    username: decodedIdToken.name || '',
                }
			};
		} catch (error) {
			return { user: null };
		}
	}
);
