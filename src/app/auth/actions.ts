'use server';

import { UserRecord } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type FormState = {
  success: boolean;
  message: string;
} | null;

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!FIREBASE_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is not set');
}

export async function signUpWithEmailAndPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = formData.get('displayName') as string;

  const signUpEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;

  try {
    const response = await fetch(signUpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Usajili umeshindwa.');
    }
    
    // The user is created, now update their display name.
    const updateProfileEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`;
    await fetch(updateProfileEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idToken: result.idToken,
            displayName: displayName,
            returnSecureToken: false
        })
    });


    cookies().set('idToken', result.idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
    });

  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'Kosa lisilojulikana limetokea.',
    };
  }

  redirect('/game');
}

export async function signInWithEmailAndPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const signInEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

  try {
    const response = await fetch(signInEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Uthibitishaji umeshindwa.');
    }
    
    cookies().set('idToken', result.idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
    });

  } catch (e: any) {
    return {
      success: false,
      message: e.message || 'Kosa lisilojulikana limetokea.',
    };
  }

  redirect('/game');
}


export async function signOut() {
  cookies().delete('idToken');
  redirect('/login');
}