
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={pending}>
      {pending ? 'Inaingia...' : 'Ingia'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Umefanikiwa Kuingia!",
        description: "Karibu tena kwenye himaya yako.",
      });
      router.push('/dashboard');
    }
  }, [state, router, toast]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Karibu Tena</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingia kwenye akaunti yako ili kuendeleza himaya yako.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
            <CardContent className="grid gap-4">
            {state && !state.success && state.message && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Hitilafu imetokea</AlertTitle>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
                <Label htmlFor="email">Barua Pepe</Label>
                <Input id="email" name="email" type="email" placeholder="mchezaji@mfano.com" required className="bg-gray-800 border-gray-600"/>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Nenosiri</Label>
                <Input id="password" name="password" type="password" required className="bg-gray-800 border-gray-600" />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <SubmitButton />
            <div className="text-center text-sm text-gray-400">
                Huna akaunti?{' '}
                <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
                Jisajili
                </Link>
            </div>
            </CardFooter>
        </form>
      </Card>
    </main>
  );
}
