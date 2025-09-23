'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';


export async function logout(): Promise<{ error: string } | { error?: undefined }> {
	cookies().delete('session');
    redirect('/signup');
}


export const validateRequest = cache(
	async (): Promise<{ user: { uid: string; username: string; } } | { user: null }> => {
		const sessionCookie = cookies().get('session')?.value;
		if (!sessionCookie) {
			return { user: null };
		}

		try {
			const decodedIdToken = await getAdminAuth(adminApp).verifySessionCookie(sessionCookie, true);
			const user = await getAdminAuth(adminApp).getUser(decodedIdToken.uid);
			return {
				user: {
                    uid: decodedIdToken.uid,
                    username: user.displayName || '',
                }
			};
		} catch (error) {
			// Session cookie is invalid, delete it.
			cookies().delete('session');
			return { user: null };
		}
	}
);
