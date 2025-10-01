
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, Users, User, ArrowLeft, Loader2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export type ChatParticipantInfo = {
    uid: string;
    username: string;
    avatar: string;
    lastReadTimestamp: number;
};

export type ChatMetadata = {
    chatId: string;
    lastMessageText: string;
    lastMessageTimestamp: number;
    participants: Record<string, ChatParticipantInfo>; // For private chats
};


type PublicChatRoom = 'general' | 'trade' | 'help';
const publicRooms: { id: PublicChatRoom, name: string }[] = [
    { id: 'general', name: 'Soga ya Kawaida' },
    { id: 'trade', name: 'Biashara' },
    { id: 'help', name: 'Msaada' },
];

type UserChat = {
    chatId: string;
    otherPlayer: Omit<ChatParticipantInfo, 'lastReadTimestamp'>;
    lastMessage: string;
    timestamp: number;
    isUnread: boolean;
};

interface ChatsProps {
    user: AuthenticatedUser;
    initialPrivateChatUid?: string | null;
    onChatOpened: () => void;
    chatMetadata: Record<string, ChatMetadata>;
    unreadPublicChats: Record<string, boolean>;
    onPublicRoomRead: (roomId: string) => void;
}


// Main Chat Component
export function Chats({ user, initialPrivateChatUid, onChatOpened, chatMetadata, unreadPublicChats, onPublicRoomRead }: ChatsProps) {
  const [activeTab, setActiveTab] = React.useState(initialPrivateChatUid ? 'private' : 'public');
  const [selectedPublicRoom, setSelectedPublicRoom] = React.useState<PublicChatRoom>('general');
  const [selectedPrivateChat, setSelectedPrivateChat] = React.useState<UserChat | null>(null);
  const { players } = useAllPlayers();

  React.useEffect(() => {
    if (initialPrivateChatUid && players) {
      const otherPlayer = players.find(p => p.uid === initialPrivateChatUid);
      if (otherPlayer) {
          const chatId = [user.uid, otherPlayer.uid].sort().join('-');
          setSelectedPrivateChat({
              chatId,
              otherPlayer: {
                uid: otherPlayer.uid,
                username: otherPlayer.username,
                avatar: otherPlayer.avatar
              },
              lastMessage: '',
              timestamp: 0,
              isUnread: false
          });
          setActiveTab('private');
          onChatOpened();
      }
    }
  }, [initialPrivateChatUid, players, user.uid, onChatOpened]);


  const handleSelectPrivateChat = (chat: UserChat) => {
    setSelectedPrivateChat(chat);
  }
  
  const handleBackToList = () => {
    setSelectedPrivateChat(null);
  }

  return (
    <Card className="bg-gray-800/60 border-gray-700 text-white w-full h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>Mawasiliano</CardTitle>
            <CardDescription className="text-gray-400">
                Wasiliana na wachezaji wengine.
            </CardDescription>
        </div>
        {activeTab === 'private' && selectedPrivateChat && (
            <Button variant="ghost" onClick={handleBackToList}><ArrowLeft className="mr-2 h-4 w-4" />Rudi kwenye Soga</Button>
        )}
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 mx-auto px-6 max-w-lg">
          <TabsTrigger value="public"><Users className="mr-2 h-4 w-4"/> Magrupu ya Umma</TabsTrigger>
          <TabsTrigger value="private"><User className="mr-2 h-4 w-4"/> Meseji za Faragha</TabsTrigger>
        </TabsList>
        <TabsContent value="public" className="flex-grow mt-0">
           <PublicChatsView user={user} selectedRoom={selectedPublicRoom} onSelectRoom={setSelectedPublicRoom} unreadPublicChats={unreadPublicChats} onPublicRoomRead={onPublicRoomRead} />
        </TabsContent>
        <TabsContent value="private" className="flex-grow mt-0">
          {selectedPrivateChat ? (
             <PrivateChatWindow user={user} chat={selectedPrivateChat} />
          ) : (
             <PrivateChatListView user={user} onSelectChat={handleSelectPrivateChat} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}


// --- PRIVATE CHATS ---

function PrivateChatListView({ user, onSelectChat }: { user: AuthenticatedUser, onSelectChat: (chat: UserChat) => void}) {
    const database = useDatabase();
    const [userChats, setUserChats] = React.useState<UserChat[]>([]);
    const [loading, setLoading] = React.useState(true);
    const metadataRef = React.useMemo(() => database ? ref(database, 'chat-metadata') : null, [database]);

    React.useEffect(() => {
        if (!metadataRef) {
            setLoading(false);
            return;
        }

        const unsubscribe = onValue(metadataRef, (snapshot) => {
            const allMetadata: Record<string, ChatMetadata> = snapshot.val() || {};
            const chats: UserChat[] = [];

            for (const chatId in allMetadata) {
                const metadata = allMetadata[chatId];
                if (metadata.participants && metadata.participants[user.uid]) {
                    const otherPlayerId = Object.keys(metadata.participants).find(pId => pId !== user.uid);
                    
                    if (otherPlayerId && metadata.participants[otherPlayerId]) {
                        const selfParticipant = metadata.participants[user.uid];
                        const otherParticipant = metadata.participants[otherPlayerId];
                        
                        const isUnread = metadata.lastMessageTimestamp > (selfParticipant?.lastReadTimestamp || 0);

                        chats.push({
                            chatId,
                            otherPlayer: {
                                uid: otherParticipant.uid,
                                username: otherParticipant.username,
                                avatar: otherParticipant.avatar,
                            },
                            lastMessage: metadata.lastMessageText || '',
                            timestamp: metadata.lastMessageTimestamp || 0,
                            isUnread,
                        });
                    }
                }
            }
            setUserChats(chats.sort((a, b) => b.timestamp - a.timestamp));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [metadataRef, user.uid]);
    
    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 text-gray-500 animate-spin" /></div>;

    if (userChats.length === 0) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                <User className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Hakuna soga za faragha.</h3>
                <p className="text-sm">Bofya kwenye wasifu wa mchezaji na uchague "Chat" ili kuanzisha mazungumzo.</p>
            </div>
        );
    }

    const handleChatSelect = (chat: UserChat) => {
        const otherPlayerId = chat.chatId.split('-').find(id => id !== user.uid);
        onSelectChat({
            ...chat,
            otherPlayer: {
                ...chat.otherPlayer,
                uid: otherPlayerId || chat.otherPlayer.uid // Ensure UID is present
            }
        });
    }

    return (
        <ScrollArea className="h-full">
            <div className='p-2 space-y-1'>
                {userChats.map(chat => (
                    <button key={chat.chatId} onClick={() => handleChatSelect(chat)} className='w-full text-left p-2 rounded-lg hover:bg-gray-700/50 flex items-center gap-3'>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={chat.otherPlayer.avatar} data-ai-hint="player avatar" />
                            <AvatarFallback>{chat.otherPlayer.username?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div className='flex-grow overflow-hidden'>
                            <div className='flex justify-between items-center'>
                                <p className='font-semibold truncate'>{chat.otherPlayer.username || 'Mchezaji'}</p>
                                { chat.timestamp > 0 && <p className='text-xs text-gray-400'>{formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}</p> }
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className={cn('text-sm text-gray-300 truncate', chat.isUnread && 'font-bold text-white')}>{chat.lastMessage}</p>
                                {chat.isUnread && (
                                    <div className='bg-blue-500 rounded-full h-2.5 w-2.5 flex-shrink-0' />
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}

function PrivateChatWindow({ user, chat }: { user: AuthenticatedUser, chat: { chatId: string, otherPlayer: Omit<ChatParticipantInfo, 'lastReadTimestamp'> } }) {
    const database = useDatabase();
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = React.useState('');
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    const messagesRef = React.useMemo(() => 
        database ? query(ref(database, `chat/${chat.chatId}`), orderByChild('timestamp'), limitToLast(100)) : null
    , [database, chat.chatId]);

    // Effect to fetch messages and mark as read
    React.useEffect(() => {
      if (!messagesRef || !database) return;
      
      const unsubscribe = onValue(messagesRef, (snapshot) => {
          const messageData: ChatMessage[] = [];
          snapshot.forEach((child) => {
              messageData.push({ id: child.key!, ...child.val() });
          });
          setMessages(messageData);

          // Mark messages as read for the current user
          const userLastReadRef = ref(database, `chat-metadata/${chat.chatId}/participants/${user.uid}/lastReadTimestamp`);
          set(userLastReadRef, serverTimestamp());
      });

      return () => unsubscribe();
    }, [messagesRef, database, user.uid, chat.chatId]);

    // Auto-scroll
    React.useEffect(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !database || !chat.otherPlayer.uid) return;

        const timestamp = serverTimestamp();
        const textToSend = newMessage;
        setNewMessage('');

        // 1. Push the message to the shared chat room
        const chatRoomRef = ref(database, `chat/${chat.chatId}`);
        const message = {
            uid: user.uid,
            username: user.username,
            avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
            text: textToSend,
            timestamp: timestamp,
        };
        await push(chatRoomRef, message);
        
        // 2. Update the shared metadata for this chat
        const metadataRef = ref(database, `chat-metadata/${chat.chatId}`);
        const currentMetadataSnap = await get(metadataRef);
        const currentMetadata = currentMetadataSnap.val();
        
        const selfParticipant: ChatParticipantInfo = {
            uid: user.uid,
            username: user.username,
            avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
            lastReadTimestamp: currentMetadata?.participants?.[user.uid]?.lastReadTimestamp || 0
        };
        
        const otherParticipant: ChatParticipantInfo = {
             uid: chat.otherPlayer.uid,
             username: chat.otherPlayer.username,
             avatar: chat.otherPlayer.avatar,
             lastReadTimestamp: currentMetadata?.participants?.[chat.otherPlayer.uid]?.lastReadTimestamp || 0
        };

        const newMetadata: Omit<ChatMetadata, 'chatId'> = {
            lastMessageText: textToSend,
            lastMessageTimestamp: timestamp,
            participants: {
                [user.uid]: selfParticipant,
                [chat.otherPlayer.uid]: otherParticipant,
            }
        };
        await set(metadataRef, newMetadata);
    };

    return <ChatWindowLayout user={user} messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} scrollAreaRef={scrollAreaRef} />;
}


// --- PUBLIC CHATS ---

interface PublicChatsViewProps {
    user: AuthenticatedUser;
    selectedRoom: PublicChatRoom;
    onSelectRoom: (room: PublicChatRoom) => void;
    unreadPublicChats: Record<string, boolean>;
    onPublicRoomRead: (roomId: string) => void;
}


function PublicChatsView({ user, selectedRoom, onSelectRoom, unreadPublicChats, onPublicRoomRead }: PublicChatsViewProps) {
    const [mobileView, setMobileView] = React.useState<'list' | 'chat'>('list');

    const handleSelectRoom = (room: PublicChatRoom) => {
        onSelectRoom(room);
        setMobileView('chat');
        if (unreadPublicChats[room]) {
            onPublicRoomRead(room);
        }
    };

    const handleBackToList = () => {
        setMobileView('list');
    };

    return (
        <div className="flex h-full">
            {/* Room List */}
            <div className={cn("w-full md:w-1/3 border-r border-gray-700", mobileView === 'chat' && 'hidden md:block')}>
                 <h3 className="text-lg font-semibold p-4 border-b border-gray-700">Vyumba vya Soga</h3>
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-1">
                        {publicRooms.map(room => (
                             <Button
                                key={room.id}
                                variant={selectedRoom === room.id && mobileView === 'chat' ? 'secondary' : 'ghost'}
                                className="w-full justify-between"
                                onClick={() => handleSelectRoom(room.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span># {room.name}</span>
                                </div>
                                {unreadPublicChats[room.id] && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                )}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            {/* Chat Window */}
            <div className={cn("w-full md:w-2/3 flex flex-col", mobileView === 'list' && 'hidden md:flex')}>
                 <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBackToList}>
                        <ArrowLeft />
                    </Button>
                    <h3 className="text-lg font-semibold"># {publicRooms.find(r => r.id === selectedRoom)?.name}</h3>
                </div>
                <PublicChatWindow user={user} room={selectedRoom} />
            </div>
        </div>
    )
}

function PublicChatWindow({ user, room }: { user: AuthenticatedUser, room: PublicChatRoom }) {
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
      if(scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !database) return;
    
    const textToSend = newMessage;
    setNewMessage('');

    const chatRef = ref(database, `chat/${room}`);
    const message = {
        uid: user.uid,
        username: user.username,
        avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
        text: textToSend,
        timestamp: serverTimestamp(),
    };
    
    push(chatRef, message);
    
    // Update chat metadata
    const metadataRef = ref(database, `chat-metadata/${room}`);
    set(metadataRef, {
        lastMessageText: textToSend,
        lastMessageTimestamp: serverTimestamp(),
    });
  };
  
  return <ChatWindowLayout user={user} messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} scrollAreaRef={scrollAreaRef} roomName={room} />
}


// --- COMMON CHAT UI ---

function ChatWindowLayout({ user, messages, newMessage, setNewMessage, handleSendMessage, scrollAreaRef, roomName }: { user: AuthenticatedUser, messages: ChatMessage[], newMessage: string, setNewMessage: (val: string) => void, handleSendMessage: (e: React.FormEvent) => void, scrollAreaRef: React.RefObject<HTMLDivElement>, roomName?: string }) {
    return (
        <div className="flex flex-col h-full">
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
                        {roomName ? <p className="text-sm">Be the first to send a message in the #{roomName} channel.</p> : <p className="text-sm">Start the conversation.</p>}
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
