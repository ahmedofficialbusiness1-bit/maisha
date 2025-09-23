'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Uchumi wa Afrika</CardTitle>
          <CardDescription className="text-lg text-gray-300 pt-2">
            Inapakia Mchezo...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base text-gray-400 space-y-4">
            <p>
                Tafadhali subiri, tunakupeleka kwenye dashibodi yako.
            </p>
        </CardContent>
      </Card>
    </main>
  );
}
