
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { login, type AuthFormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const initialState: AuthFormState = {
    success: false,
    message: '',
};

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard');
        }
        if (!state.success && state.message) {
            toast({
                variant: "destructive",
                title: "Kosa la Kuingia",
                description: state.message,
            });
        }
    }, [state, toast, router]);

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm">
                <form action={formAction}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Karibu Tena</CardTitle>
                        <CardDescription>Ingia kwenye akaunti yako ili kuendelea.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Barua Pepe</Label>
                            <Input id="email" name="email" type="email" placeholder="juma@mfano.com" className="bg-gray-800 border-gray-600" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Nenosiri</Label>
                            <Input id="password" name="password" type="password" className="bg-gray-800 border-gray-600" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Ingia</Button>
                        <p className="text-xs text-center text-gray-400">
                            Huna akaunti? <Link href="/signup" className="text-blue-400 hover:underline">Jisajili hapa</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
