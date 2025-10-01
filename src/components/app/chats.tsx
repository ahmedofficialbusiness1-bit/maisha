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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatabase } from '@/firebase';
import { ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type AuthenticatedUser = {
    uid: string;
    username: string;
};

type ChatMessage = {
    id: string;
    uid: string;
    username: string;
    avatar: string;
    text: string;
    timestamp: number;
};


function ChatGroup({ title, user, chatRoomId }: { title: string; user: AuthenticatedUser, chatRoomId: string }) {
  const database = useDatabase();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const messagesRef = React.useMemo(() => 
      database ? query(ref(database, `chat/${chatRoomId}`), orderByChild('timestamp'), limitToLast(100)) : null
  , [database, chatRoomId]);

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

    const chatRef = ref(database, `chat/${chatRoomId}`);
    const message = {
        uid: user.uid,
        username: user.username,
        avatar: `https://picsum.photos/seed/${user.uid}/40/40`,
        text: newMessage,
        timestamp: serverTimestamp(),
    };

    push(chatRef, message);
    setNewMessage('');
  };
  
  const handleViewProfile = (playerId: string) => {
      console.log("Viewing profile for:", playerId);
      // Logic to show player profile will go here
  }


  return (
    <div className="flex flex-col h-[70vh]">
        <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaRef}>
            <div className='space-y-4'>
                {messages.map(msg => (
                    <div key={msg.id} className={cn("flex items-start gap-3", msg.uid === user.uid && "justify-end")}>
                        {msg.uid !== user.uid && (
                           <Button variant="ghost" className="p-0 h-auto rounded-full" onClick={() => handleViewProfile(msg.uid)}>
                             <Avatar className="h-8 w-8">
                                  <AvatarImage src={msg.avatar} data-ai-hint="player avatar" />
                                  <AvatarFallback>{msg.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                           </Button>
                        )}
                         <div className={cn(
                             "max-w-xs md:max-w-md p-3 rounded-lg", 
                             msg.uid === user.uid ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"
                         )}>
                             <p className='text-sm'>{msg.text}</p>
                             <p className={cn(
                                 "text-xs mt-2 opacity-70",
                                  msg.uid === user.uid ? "text-right" : "text-left"
                             )}>
                                 {msg.uid !== user.uid && (
                                     <Button variant="link" className="p-0 h-auto text-xs font-semibold text-gray-300 hover:text-white" onClick={() => handleViewProfile(msg.uid)}>
                                         {msg.username}
                                     </Button>
                                 )}
                                 <span className='ml-1'>&middot;</span> 
                                 <span className='ml-1'>{msg.timestamp ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true }) : 'sending...'}</span>
                             </p>
                         </div>
                    </div>
                ))}
            </div>
             {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Bot className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">Welcome to the {title} chat!</h3>
                    <p className="text-sm">No messages yet. Be the first to say something!</p>
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
