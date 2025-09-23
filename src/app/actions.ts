'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';
import { cache } from 'react';
import { redirect } from 'next/navigation';


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
			const user = await getAuth(adminApp).getUser(decodedIdToken.uid);
			return {
				user: {
                    uid: decodedIdToken.uid,
                    username: user.displayName || '',
                }
			};
		} catch (error) {
			return { user: null };
		}
	}
);
