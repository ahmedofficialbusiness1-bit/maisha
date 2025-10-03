'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, Users, User, ArrowLeft, Loader2, Hash, CandlestickChart, LifeBuoy } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { getDatabase, ref, onValue, push, serverTimestamp, query, orderByChild, limitToLast, set, get } from 'firebase/database';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useAllPlayers, type PlayerPublicData } from '@/firebase/database/use-all-players';
import { getRankTitle } from '@/lib/player-tiers';
import { Badge } from '../ui/badge';

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
    rankTitle?: string | null;
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

type PublicChatRoomId = 'general' | 'trade' | 'help';
const publicRooms: { id: PublicChatRoomId, name: string, icon: React.ReactNode }[] = [
    { id: 'general', name: 'Soga ya Kawaida', icon: <Users className="h-5 w-5 text-gray-400"/> },
    { id: 'trade', name: 'Biashara', icon: <CandlestickChart className="h-5 w-5 text-gray-400"/> },
    { id: 'help', name: 'Msaada', icon: <LifeBuoy className="h-5 w-5 text-gray-400"/> },
];

type UserChat = {
    chatId: string;
    otherPlayer: Omit<ChatParticipantInfo, 'lastReadTimestamp'>;
    lastMessage: string;
    timestamp: number;
    isUnread: boolean;
};

type SelectedChat = {
    type: 'public';
    id: PublicChatRoomId;
    name: string;
} | {
    type: 'private';
    id: string; // Chat ID
    otherPlayer: Omit<ChatParticipantInfo, 'lastReadTimestamp'> & { rankTitle?: string | null }
};

interface ChatsProps {
    user: AuthenticatedUser;
    initialPrivateChatUid?: string | null;
    onChatOpened: () => void;
    chatMetadata: Record<string, ChatMetadata>;
    unreadPublicChats: Record<string, boolean>;
    onPublicRoomRead: (roomId: string) => void;
    players: PlayerPublicData[] | null;
}

export function Chats({ user, initialPrivateChatUid, onChatOpened, chatMetadata, unreadPublicChats, onPublicRoomRead, players }: ChatsProps) {
    const [selectedChat, setSelectedChat] = React.useState<SelectedChat | null>(() => ({ type: 'public', id: 'general', name: 'Soga ya Kawaida' }));
    const [mobileView, setMobileView] = React.useState<'sidebar' | 'chat_window'>('sidebar');

    const userChats = React.useMemo(() => {
        if (!chatMetadata || !players) return [];
        const chats: UserChat[] = [];
        const playerMap = new Map(players.map(p => [p.uid, p]));
        const sortedPlayers = [...players].sort((a,b) => b.netWorth - a.netWorth);

        for (const chatId in chatMetadata) {
            const metadata = chatMetadata[chatId];
            if (metadata.participants && metadata.participants[user.uid]) {
                const otherPlayerId = Object.keys(metadata.participants).find(pId => pId !== user.uid);
                const otherPlayerInfo = otherPlayerId ? playerMap.get(otherPlayerId) : null;
                
                if (otherPlayerInfo) {
                    const selfParticipant = metadata.participants[user.uid];
                    const isUnread = metadata.lastMessageTimestamp > (selfParticipant?.lastReadTimestamp || 0);

                    const rank = sortedPlayers.findIndex(p => p.uid === otherPlayerId);
                    const rankTitle = getRankTitle(rank + 1);

                    chats.push({
                        chatId,
                        otherPlayer: { uid: otherPlayerInfo.uid, username: otherPlayerInfo.username, avatar: otherPlayerInfo.avatar, rankTitle },
                        lastMessage: metadata.lastMessageText || '',
                        timestamp: metadata.lastMessageTimestamp || 0,
                        isUnread,
                    });
                }
            }
        }
        return chats.sort((a, b) => b.timestamp - a.timestamp);
    }, [chatMetadata, user.uid, players]);

    React.useEffect(() => {
        if (initialPrivateChatUid && players) {
            const sortedPlayers = [...players].sort((a,b) => b.netWorth - a.netWorth);
            const otherPlayer = players.find(p => p.uid === initialPrivateChatUid);

            if (otherPlayer) {
                const rank = sortedPlayers.findIndex(p => p.uid === initialPrivateChatUid);
                const rankTitle = getRankTitle(rank + 1);
                const chatId = [user.uid, otherPlayer.uid].sort().join('-');
                
                setSelectedChat({
                    type: 'private',
                    id: chatId,
                    otherPlayer: { uid: otherPlayer.uid, username: otherPlayer.username, avatar: otherPlayer.avatar, rankTitle }
                });
                setMobileView('chat_window');
                onChatOpened();
            }
        }
    }, [initialPrivateChatUid, players, user.uid, onChatOpened]);

    const handleSelectChat = (chat: SelectedChat) => {
        setSelectedChat(chat);
        setMobileView('chat_window');
        if (chat.type === 'public' && unreadPublicChats[chat.id]) {
            onPublicRoomRead(chat.id);
        }
    };
    
    if (!players) {
        return (
            <Card className="bg-gray-800/60 border-gray-700 text-white w-full h-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-gray-500 animate-spin" />
            </Card>
        );
    }

    return (
        <Card className="bg-gray-800/60 border-gray-700 text-white w-full h-[calc(100vh-14rem)] flex overflow-hidden">
            <aside className={cn(
                "w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 flex-col",
                mobileView === 'sidebar' ? 'flex' : 'hidden md:flex'
            )}>
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Mawasiliano</h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-4">
                        <div>
                            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Public Channels</h3>
                            <div className="mt-1 space-y-1">
                                {publicRooms.map(room => (
                                    <ChatItem
                                        key={room.id}
                                        name={room.name}
                                        isActive={selectedChat?.type === 'public' && selectedChat.id === room.id}
                                        isUnread={unreadPublicChats[room.id]}
                                        onClick={() => handleSelectChat({ type: 'public', id: room.id, name: room.name })}
                                        avatar={room.icon}
                                    />
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Direct Messages</h3>
                            <div className="mt-1 space-y-1">
                                {userChats.map(chat => (
                                    <ChatItem
                                        key={chat.chatId}
                                        name={chat.otherPlayer.username}
                                        lastMessage={chat.lastMessage}
                                        isActive={selectedChat?.type === 'private' && selectedChat.id === chat.chatId}
                                        isUnread={chat.isUnread}
                                        onClick={() => handleSelectChat({ type: 'private', id: chat.chatId, otherPlayer: chat.otherPlayer })}
                                        avatar={
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={chat.otherPlayer.avatar} data-ai-hint="player avatar"/>
                                                <AvatarFallback>{chat.otherPlayer.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        }
                                        rankTitle={chat.otherPlayer.rankTitle}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </aside>
            <main className={cn(
                "w-full md:w-2/3 lg:w-3/4 flex-col",
                mobileView === 'chat_window' ? 'flex' : 'hidden md:flex'
            )}>
                {selectedChat ? (
                    <ChatWindow
                        key={selectedChat.id}
                        user={user}
                        chat={selectedChat}
                        onBack={() => setMobileView('sidebar')}
                        players={players}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <Bot className="h-16 w-16 mb-4" />
                        <h3 className="text-xl font-semibold">Select a conversation</h3>
                        <p>Choose a channel or a direct message to start chatting.</p>
                    </div>
                )}
            </main>
        </Card>
    );
}

function ChatItem({ name, lastMessage, isActive, isUnread, onClick, avatar, rankTitle }: { name: string, lastMessage?: string, isActive: boolean, isUnread: boolean, onClick: () => void, avatar: React.ReactNode, rankTitle?: string | null }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors',
                isActive ? 'bg-blue-500/20 text-white' : 'hover:bg-gray-700/50',
                isUnread && !isActive && 'bg-gray-700'
            )}
        >
            <div className="flex-shrink-0">{avatar}</div>
            <div className="flex-grow overflow-hidden">
                <div className="flex items-center gap-2">
                    <p className={cn('font-semibold truncate', isUnread && !isActive ? 'text-white' : 'text-gray-200')}>{name}</p>
                    {rankTitle && (
                        <Badge className="text-[9px] py-0 px-1.5 h-auto bg-indigo-800/80 border-indigo-600 text-indigo-200">{rankTitle}</Badge>
                    )}
                </div>
                {lastMessage && <p className="text-xs text-gray-400 truncate">{lastMessage}</p>}
            </div>
            {isUnread && <div className="bg-blue-500 rounded-full h-2.5 w-2.5 flex-shrink-0" />}
        </button>
    );
}

function ChatWindow({ user, chat, onBack, players }: { user: AuthenticatedUser, chat: SelectedChat, onBack: () => void, players: PlayerPublicData[] }) {
    const database = getDatabase();
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = React.useState('');
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const sortedPlayers = React.useMemo(() => [...players].sort((a,b) => b.netWorth - a.netWorth), [players]);

    const messagesRef = React.useMemo(() =>
        database ? query(ref(database, `chat/${chat.id}`), orderByChild('timestamp'), limitToLast(100)) : null
    , [database, chat.id]);

    React.useEffect(() => {
        if (!messagesRef || !database) return;
        
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const messageData: ChatMessage[] = [];
            snapshot.forEach((child) => {
                const msg = child.val();
                const senderRank = sortedPlayers.findIndex(p => p.uid === msg.uid);
                const rankTitle = getRankTitle(senderRank + 1);
                messageData.push({ id: child.key!, ...msg, rankTitle });
            });
            setMessages(messageData);

            if (chat.type === 'private') {
                const userLastReadRef = ref(database, `chat-metadata/${chat.id}/participants/${user.uid}/lastReadTimestamp`);
                set(userLastReadRef, serverTimestamp());
            }
        });

        return () => unsubscribe();
    }, [messagesRef, database, user.uid, chat, sortedPlayers]);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !database) return;

        const textToSend = newMessage;
        setNewMessage('');
        const timestamp = serverTimestamp();

        const message = {
            uid: user.uid,
            username: user.username,
            avatar: user.avatarUrl || `https://picsum.photos/seed/${user.uid}/40/40`,
            text: textToSend,
            timestamp,
        };

        const chatRoomRef = ref(database, `chat/${chat.id}`);
        await push(chatRoomRef, message);
        
        const metadataRef = ref(database, `chat-metadata/${chat.id}`);
        if (chat.type === 'public') {
            await set(metadataRef, { lastMessageText: textToSend, lastMessageTimestamp: timestamp });
        } else if (chat.type === 'private') {
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
                participants: { [user.uid]: selfParticipant, [chat.otherPlayer.uid]: otherParticipant }
            };
            await set(metadataRef, newMetadata);
        }
    };
    
    const chatName = chat.type === 'public' ? `# ${chat.name}` : chat.otherPlayer.username;
    const chatRankTitle = chat.type === 'private' ? chat.otherPlayer.rankTitle : null;

    return (
        <>
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{chatName}</h3>
                     {chatRankTitle && (
                        <Badge className="text-xs py-0.5 px-2 bg-indigo-800/80 border-indigo-600 text-indigo-200">{chatRankTitle}</Badge>
                    )}
                </div>
            </div>
            <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaRef}>
                <div className='space-y-4'>
                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-3", msg.uid === user.uid && "flex-row-reverse")}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} data-ai-hint="player avatar" />
                                <AvatarFallback>{msg.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 w-full max-w-[320px]">
                                <div className={cn("flex items-center gap-2", msg.uid === user.uid ? "justify-end flex-row-reverse" : "justify-start")}>
                                     <span className="text-sm font-semibold">{msg.username}</span>
                                      {msg.rankTitle && (
                                         <Badge className="text-[9px] py-0 px-1 h-auto bg-indigo-800/60 border-indigo-700 text-indigo-300">{msg.rankTitle}</Badge>
                                      )}
                                      <span className="text-xs text-gray-400">
                                          {msg.timestamp ? formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true }) : 'sending...'}
                                      </span>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-lg text-sm",
                                    msg.uid === user.uid ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"
                                )}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <Bot className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">Welcome to the chat!</h3>
                        <p className="text-sm">Be the first to send a message in {chatName}.</p>
                    </div>
                )}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-gray-700 p-4 bg-gray-800">
                <Input
                    placeholder={`Message ${chatName}`}
                    className="flex-grow bg-gray-700 border-gray-600"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Tuma</span>
                </Button>
            </form>
        </>
    );
}

    
