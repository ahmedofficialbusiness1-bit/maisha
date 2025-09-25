
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is no longer needed in local mode.
// We redirect to the main dashboard.
export default function SignupPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return null;
}
