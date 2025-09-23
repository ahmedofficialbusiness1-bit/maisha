
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page is no longer in use. Redirect to the dashboard.
export default function SignupPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <main className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </main>
    );
}
