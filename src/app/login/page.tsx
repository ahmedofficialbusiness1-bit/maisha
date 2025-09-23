
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page is no longer in use. Redirect to the signup page.
export default function LoginPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/signup');
    }, [router]);

    return (
        <main className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </main>
    );
}
