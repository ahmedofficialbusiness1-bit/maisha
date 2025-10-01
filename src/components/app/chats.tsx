'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDatabase } from '@/firebase';
import { ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast, set, get } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';

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

type ConversationSummary = {
    otherUserId: string;
    lastMessage: string;
    timestamp: number;
    unreadCount: number;
};

function ChatWindow({ user, otherUser, onBack }: { user: AuthenticatedUser, otherUser: PlayerPublicData, onBack: () => void }) {
  const database = useDatabase();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  
  const chatRoomId = React.useMemo(() => 
      [user.uid, otherUser.uid].sort().join('-')
  , [user.uid, otherUser.uid]);

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

    // Mark messages as read
    const userChatSummaryRef = ref(database, `user-chats/${user.uid}/${otherUser.uid}/unreadCount`);
    set(userChatSummaryRef, 0);

    return () => unsubscribe();
  }, [messagesRef, database, user.uid, otherUser.uid]);

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
    const timestamp = serverTimestamp();
    const message = {
        uid: user.uid,
        username: user.username,
        avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
        text: newMessage,
        timestamp: timestamp,
    };
    
    push(chatRef, message);
    
    // Update conversation summary for both users
    const summary = {
        lastMessage: newMessage,
        timestamp: Date.now(), // Use client time for summary sort, server for message
    };
    const currentUserSummaryRef = ref(database, `user-chats/${user.uid}/${otherUser.uid}`);
    set(currentUserSummaryRef, summary);
    
    const otherUserSummaryRef = ref(database, `user-chats/${otherUser.uid}/${user.uid}`);
    // Increment unread count for the other user
    get(otherUserSummaryRef).then(snapshot => {
        const currentSummary = snapshot.val();
        const unreadCount = (currentSummary?.unreadCount || 0) + 1;
        set(otherUserSummaryRef, { ...summary, unreadCount });
    });

    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-[70vh]">
        <div className="flex items-center gap-4 border-b border-gray-700 p-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft />
            </Button>
            <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser.avatar} data-ai-hint="player avatar" />
                <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-white">{otherUser.username}</h3>
        </div>
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
                    <h3 className="text-lg font-semibold">This is the beginning of your conversation</h3>
                    <p className="text-sm">Send a message to start chatting with {otherUser.username}.</p>
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

function ConversationList({ user, onSelectConversation, conversations }: { user: AuthenticatedUser, onSelectConversation: (player: PlayerPublicData) => void, conversations: (ConversationSummary & { player: PlayerPublicData })[] }) {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
                <Bot className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">No Conversations Yet</h3>
                <p className="text-sm">Find a player from the Leaderboard or Market and start a chat!</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[70vh]">
            <div className='flex flex-col'>
                {conversations.map(convo => (
                    <button 
                        key={convo.otherUserId}
                        onClick={() => onSelectConversation(convo.player)}
                        className='flex items-center gap-4 p-3 text-left w-full hover:bg-gray-700/50 transition-colors border-b border-gray-700'
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={convo.player.avatar} data-ai-hint="player avatar" />
                            <AvatarFallback>{convo.player.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-grow overflow-hidden'>
                            <div className='flex justify-between items-center'>
                                <h3 className='font-semibold truncate text-white'>{convo.player.username}</h3>
                                <p className='text-xs text-gray-400 flex-shrink-0'>{formatDistanceToNow(new Date(convo.timestamp), { addSuffix: true })}</p>
                            </div>
                            <div className='flex justify-between items-start'>
                               <p className='text-sm text-gray-300 truncate'>{convo.lastMessage}</p>
                               {convo.unreadCount > 0 && (
                                   <div className='bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold flex-shrink-0'>
                                       {convo.unreadCount}
                                   </div>
                               )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

export function Chats({ user, onViewProfile, initialChatUserId }: { user: AuthenticatedUser, onViewProfile: (playerId: string) => void; initialChatUserId?: string | null }) {
    const database = useDatabase();
    const { players: allPlayers } = useAllPlayers();
    const [conversations, setConversations] = React.useState<(ConversationSummary & { player: PlayerPublicData })[]>([]);
    const [selectedChatUser, setSelectedChatUser] = React.useState<PlayerPublicData | null>(null);

    React.useEffect(() => {
        if (!database || !allPlayers) return;

        // If an initial chat user is provided, open that chat immediately
        if (initialChatUserId) {
            const initialUser = allPlayers.find(p => p.uid === initialChatUserId);
            if (initialUser) {
                setSelectedChatUser(initialUser);
            }
        }
        
        const userChatsRef = query(ref(database, `user-chats/${user.uid}`), orderByChild('timestamp'));

        const unsubscribe = onValue(userChatsRef, (snapshot) => {
            const summaries: (ConversationSummary & { player: PlayerPublicData })[] = [];
            snapshot.forEach(child => {
                const otherUserId = child.key;
                const playerData = allPlayers.find(p => p.uid === otherUserId);
                if (playerData) {
                    summaries.push({
                        otherUserId: otherUserId!,
                        player: playerData,
                        ...child.val()
                    });
                }
            });
            // Sort by timestamp descending
            setConversations(summaries.sort((a, b) => b.timestamp - a.timestamp));
        });

        return () => unsubscribe();
    }, [database, user.uid, allPlayers, initialChatUserId]);

    if (selectedChatUser) {
        return <ChatWindow user={user} otherUser={selectedChatUser} onBack={() => setSelectedChatUser(null)} />;
    }

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Mawasiliano</CardTitle>
        <CardDescription className="text-gray-400">
          Orodha ya soga zako za faragha na wachezaji wengine.
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <ConversationList 
            user={user} 
            conversations={conversations}
            onSelectConversation={(player) => setSelectedChatUser(player)}
        />
      </CardContent>
    </Card>
  );
}
