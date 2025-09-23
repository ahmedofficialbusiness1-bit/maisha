
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


export default function LoginPage() {
    // This page will be handled by Firebase UI or a custom form
    // For now, it's a placeholder.
    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Karibu Tena</CardTitle>
                    <CardDescription>Ingia kwenye akaunti yako ili kuendelea.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Barua Pepe</Label>
                        <Input id="email" type="email" placeholder="juma@mfano.com" className="bg-gray-800 border-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Nenosiri</Label>
                        <Input id="password" type="password" className="bg-gray-800 border-gray-600" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Ingia</Button>
                    <p className="text-xs text-center text-gray-400">
                        Huna akaunti? <Link href="/signup" className="text-blue-400 hover:underline">Jisajili hapa</Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
