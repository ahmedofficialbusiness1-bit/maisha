'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDatabase } from '@/firebase';
import { ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AuthenticatedUser = {
    uid: string;
    username: string;
    avatarUrl?: string;
};

type ChatMessage = {
    id: string;
    uid: string;
    username: string;
    avatar: string;
    text: string;
    timestamp: number;
};

type ChatRoom = 'general' | 'trade' | 'help';

function ChatRoomWindow({ user, room }: { user: AuthenticatedUser, room: ChatRoom }) {
  const database = useDatabase();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const messagesRef = React.useMemo(() => 
      database ? query(ref(database, `chat/${room}`), orderByChild('timestamp'), limitToLast(100)) : null
  , [database, room]);
  
  React.useEffect(() => {
    if (!messagesRef) return;
    const unsubscribe = onValue(messagesRef, (snapshot) => {
        const messageData: ChatMessage[] = [];
        snapshot.forEach((child) => {
            messageData.push({ id: child.key!, ...child.val() });
        });
        setMessages(messageData);
    });
    return () => unsubscribe();
  }, [messagesRef]);

  React.useEffect(() => {
      // Scroll to bottom when new messages arrive
      if(scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !database) return;

    const chatRef = ref(database, `chat/${room}`);
    const message = {
        uid: user.uid,
        username: user.username,
        avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
        text: newMessage,
        timestamp: serverTimestamp(),
    };
    
    push(chatRef, message);
    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-[70vh]">
        <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaRef}>
            <div className='space-y-4'>
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex items-end gap-3", msg.uid === user.uid && "justify-end")}>
                        {msg.uid !== user.uid && (
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} data-ai-hint="player avatar" />
                                <AvatarFallback>{msg.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                         <div className={cn(
                             "max-w-xs md:max-w-md p-3 rounded-lg", 
                             msg.uid === user.uid ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"
                         )}>
                             {msg.uid !== user.uid && <p className='text-xs font-bold text-blue-300 mb-1'>{msg.username}</p>}
                             <p className='text-sm'>{msg.text}</p>
                             <p className={cn(
                                 "text-[10px] mt-2 opacity-70",
                                  msg.uid === user.uid ? "text-right" : "text-left"
                             )}>
                                 {msg.timestamp ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true }) : 'sending...'}
                             </p>
                         </div>
                    </div>
                ))}
            </div>
             {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Bot className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">Welcome to the chat!</h3>
                    <p className="text-sm">Be the first to send a message in the #{room} channel.</p>
                </div>
            )}
        </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-gray-700 p-4">
        <Input
          placeholder="Andika ujumbe wako..."
          className="flex-grow bg-gray-700 border-gray-600"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Tuma</span>
        </Button>
      </form>
    </div>
  )
}

export function Chats({ user }: { user: AuthenticatedUser }) {
  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Mawasiliano</CardTitle>
        <CardDescription className="text-gray-400">
          Shiriki kwenye soga za umma na wachezaji wengine.
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 rounded-none">
                <TabsTrigger value="general">Soga ya Kawaida</TabsTrigger>
                <TabsTrigger value="trade">Biashara</TabsTrigger>
                <TabsTrigger value="help">Msaada</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <ChatRoomWindow user={user} room="general" />
            </TabsContent>
            <TabsContent value="trade">
                <ChatRoomWindow user={user} room="trade" />
            </TabsContent>
            <TabsContent value="help">
                 <ChatRoomWindow user={user} room="help" />
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
