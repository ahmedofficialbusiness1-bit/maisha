
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type Message = {
  id: string;
  uid: string;
  sender: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: number | null;
};

type AuthenticatedUser = {
    uid: string;
    username: string;
};

const LOCAL_STORAGE_CHAT_KEY = 'uchumi-wa-afrika-chat-';

function ChatGroup({ title, user, chatRoomId }: { title: string; user: AuthenticatedUser, chatRoomId: string }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);
  const storageKey = LOCAL_STORAGE_CHAT_KEY + chatRoomId;

  React.useEffect(() => {
    try {
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    } catch (e) {
        console.error("Failed to load chat messages from local storage", e);
    }
  }, [storageKey]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
        const message: Message = {
            id: `${Date.now()}`,
            uid: user.uid,
            sender: {
                name: user.username,
                avatar: `https://picsum.photos/seed/${user.uid}/40/40`,
            },
            text: newMessage.trim(),
            timestamp: Date.now(),
        };

        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, message];
            try {
                localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
            } catch (e) {
                console.error("Failed to save chat messages to local storage", e);
            }
            return updatedMessages;
        });

      setNewMessage('');
    }
  };

  React.useEffect(() => {
    // Scroll to the bottom whenever a new message is added
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages]);
  
    const formatTimestamp = (timestamp: number | null) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }


  return (
    <div className="flex flex-col h-[70vh]">
      <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isPlayer = message.uid === user.uid;
            return (
              <div key={message.id} className={cn('flex items-start gap-3', isPlayer && 'flex-row-reverse')}>
                <Avatar>
                  <AvatarImage src={message.sender.avatar} alt={message.sender.name} data-ai-hint="player avatar" />
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={cn('flex-grow rounded-lg p-3 max-w-xs sm:max-w-md', isPlayer ? 'bg-blue-800' : 'bg-gray-800')}>
                  <div className={cn('flex justify-between items-center', isPlayer && 'flex-row-reverse')}>
                    <p className="font-semibold text-sm text-blue-400">{message.sender.name}</p>
                    <p className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</p>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{message.text}</p>
                </div>
              </div>
            );
          })}
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


export function Chats({ user }: { user: AuthenticatedUser }) {
  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Mawasiliano ya Wachezaji</CardTitle>
        <CardDescription className="text-gray-400">
          Chat imehifadhiwa kwenye kivinjari chako. Wachezaji wengine hawataona jumbe hizi.
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
