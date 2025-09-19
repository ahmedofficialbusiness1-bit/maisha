'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  sender: {
    name: string;
    avatar: string;
    avatarHint: string;
  };
  text: string;
  timestamp: string;
};

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: { name: 'Mchezaji Hodari', avatar: 'https://picsum.photos/seed/player1/40/40', avatarHint: 'player avatar' },
    text: 'Habari zenu wote! Nani anajua jinsi ya kuzalisha "Nondo" kwa ufanisi?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: { name: 'Bi. Uchumi', avatar: 'https://picsum.photos/seed/player2/40/40', avatarHint: 'woman avatar' },
    text: 'Unahitaji "Kiwanda cha Chuma". Hakikisha una "Chuma" na "Umeme" wa kutosha.',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    sender: { name: 'Soko Master', avatar: 'https://picsum.photos/seed/player3/40/40', avatarHint: 'trader avatar' },
    text: 'Nauza "Almasi" kwa bei poa! Angalia soko la biashara.',
    timestamp: '10:35 AM',
  },
];

function ChatGroup({ title, messages }: { title: string; messages: Message[] }) {
  const [newMessage, setNewMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, this would send the message to a server
      console.log(`Sending to ${title}:`, newMessage);
      setNewMessage('');
    }
  };
  
    React.useEffect(() => {
        // scroll to bottom
    }, [messages])

  return (
    <div className="flex flex-col h-[70vh]">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} data-ai-hint={message.sender.avatarHint} />
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow rounded-lg bg-gray-800 p-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-blue-400">{message.sender.name}</p>
                  <p className="text-xs text-gray-500">{message.timestamp}</p>
                </div>
                <p className="text-sm text-gray-200 mt-1">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-gray-700 p-4">
        <Input
          placeholder="Andika ujumbe wako..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-gray-700 border-gray-600"
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
          <span className="sr-only">Tuma</span>
        </Button>
      </form>
    </div>
  );
}

export function Chats() {
  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Mawasiliano ya Wachezaji</CardTitle>
        <CardDescription className="text-gray-400">
          Wasiliana na wachezaji wengine, uliza maswali, na tangaza biashara zako.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="msaada" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="msaada">Msaada</TabsTrigger>
            <TabsTrigger value="biashara">Biashara</TabsTrigger>
            <TabsTrigger value="general">Chat za Kawaida</TabsTrigger>
          </TabsList>
          <TabsContent value="msaada">
            <ChatGroup title="Msaada" messages={sampleMessages.filter(m => m.id !== '3')} />
          </TabsContent>
          <TabsContent value="biashara">
             <ChatGroup title="Biashara" messages={sampleMessages.filter(m => m.id === '3')} />
          </TabsContent>
          <TabsContent value="general">
             <ChatGroup title="General" messages={sampleMessages} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
