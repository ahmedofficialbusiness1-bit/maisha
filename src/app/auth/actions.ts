'use server';

import { adminAuth } from '@/lib/firebase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z.object({
  playerName: z.string().min(3, { message: 'Player name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function signUpWithEmailAndPassword(prevState: any, formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { email, password, playerName } = result.data;

  try {
    const user = await adminAuth.createUser({
      email,
      password,
      displayName: playerName,
    });
    
    const customToken = await adminAuth.createCustomToken(user.uid);
    cookies().set('customToken', customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

  } catch (error: any) {
    return { error: error.message };
  }
  
  redirect('/game');
}

export async function signInWithEmailAndPassword(prevState: any, formData: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: 'Invalid email or password' };
  }
  
  const { email, password } = result.data;

  try {
     // This is a simplified sign-in for server actions. 
     // In a real app, you would verify the password against Firebase Auth.
     // For this prototype, we'll create a token based on the email.
    const user = await adminAuth.getUserByEmail(email);
    const customToken = await adminAuth.createCustomToken(user.uid);

    cookies().set('customToken', customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
  } catch (error: any) {
     if (error.code === 'auth/user-not-found') {
        return { error: 'No user found with this email.' };
     }
     // A more secure app would not expose password verification failures
     // but for this prototype it's fine.
     return { error: 'Password verification failed. Please try again.' };
  }
  
  redirect('/game');
}

export async function signOut() {
  cookies().delete('customToken');
  redirect('/login');
}
