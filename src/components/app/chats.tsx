'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type AuthenticatedUser = {
    uid: string;
    username: string;
};


function ChatGroup({ title, user, chatRoomId }: { title: string; user: AuthenticatedUser, chatRoomId: string }) {

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-grow p-4 flex items-center justify-center text-gray-500">
        <p>Soga za mtandaoni hazipatikani kwenye mchezo wa ndani.</p>
      </div>
      <form className="flex items-center gap-2 border-t border-gray-700 p-4">
        <Input
          placeholder="Andika ujumbe wako..."
          className="flex-grow bg-gray-700 border-gray-600"
          disabled={true}
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={true}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Tuma</span>
        </Button>
      </form>
    </div>
  );
}


export function Chats({ user }: { user: AuthenticatedUser }) {
  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Mawasiliano ya Wachezaji</CardTitle>
        <CardDescription className="text-gray-400">
          Ongea na wachezaji wengine kwa muda halisi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="general">Chat za Kawaida</TabsTrigger>
            <TabsTrigger value="biashara">Biashara</TabsTrigger>
            <TabsTrigger value="msaada">Msaada</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <ChatGroup title="General" user={user} chatRoomId="general" />
          </TabsContent>
          <TabsContent value="biashara">
             <ChatGroup title="Biashara" user={user} chatRoomId="trade" />
          </TabsContent>
          <TabsContent value="msaada">
             <ChatGroup title="Msaada" user={user} chatRoomId="help" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
