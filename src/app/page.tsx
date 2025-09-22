
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm bg-gray-900/80 border-gray-700/60 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Karibu Tena</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingia kwenye akaunti yako ili kuendeleza himaya yako.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Barua Pepe</Label>
            <Input id="email" type="email" placeholder="mchezaji@mfano.com" required className="bg-gray-800 border-gray-600"/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Nenosiri</Label>
            <Input id="password" type="password" required className="bg-gray-800 border-gray-600" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Ingia</Button>
           <div className="text-center text-sm text-gray-400">
            Huna akaunti?{' '}
            <Link href="#" className="underline text-blue-400 hover:text-blue-300">
              Jisajili
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
