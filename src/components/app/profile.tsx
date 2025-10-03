'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Clipboard, Pencil, Upload, ArrowLeft, MessageSquare } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { View } from '@/app/game';
import { getPlayerTier } from '@/lib/player-tiers';
import { Badge } from '../ui/badge';

const profileFormSchema = z.object({
  playerName: z
    .string()
    .min(2, {
      message: 'Jina lazima liwe na angalau herufi 2.',
    })
    .max(30, {
      message: 'Jina lisizidi herufi 30.',
    }),
  avatarUrl: z.string().optional().or(z.literal('')),
  privateNotes: z.string().optional(),
});

// We omit the server-controlled fields from the ProfileData for the form
export type ProfileDataForForm = z.infer<typeof profileFormSchema>;

export type ProfileData = ProfileDataForForm & {
  uid: string;
  status?: 'online' | 'offline';
  lastSeen?: Date;
  role?: 'player' | 'admin';
};


export type PlayerMetrics = {
    netWorth: number;
    inventoryValue: number;
    ranking: string;
    rating: string;
    buildingValue: number;
    stockValue: number;
};

interface PlayerProfileProps {
  onSave: (data: ProfileDataForForm) => void;
  currentProfile: ProfileData;
  metrics: PlayerMetrics;
  isViewOnly?: boolean;
  onBack?: () => void;
  viewerRole?: 'player' | 'admin';
  setView: (view: View) => void;
  onStartPrivateChat: (uid: string) => void;
}

function InfoItem({ label, value, smallText = false }: { label: string; value: React.ReactNode, smallText?: boolean }) {
    return (
        <>
            <div className={cn("text-sm", smallText && "text-xs")}>{label}</div>
            <div className={cn("text-sm font-semibold text-white", smallText && "text-xs text-right")}>{value}</div>
        </>
    );
}

function ValuationItem({ label, value }: { label: React.ReactNode; value: string }) {
    return (
        <>
            <div className="text-sm text-gray-400 flex items-center">{label}</div>
            <div className="text-sm font-semibold text-white text-right font-mono">{value}</div>
        </>
    );
}


export function PlayerProfile({ onSave, currentProfile, metrics, isViewOnly = false, onBack, viewerRole, setView, onStartPrivateChat }: PlayerProfileProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileDataForForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        playerName: currentProfile.playerName || '',
        avatarUrl: currentProfile.avatarUrl || '',
        privateNotes: currentProfile.privateNotes || '',
    },
  });
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const avatarUrl = form.watch('avatarUrl');

   React.useEffect(() => {
    // Reset form values when currentProfile changes or when editing is toggled off
    form.reset({
        playerName: currentProfile.playerName,
        avatarUrl: currentProfile.avatarUrl,
        privateNotes: currentProfile.privateNotes,
    });
  }, [currentProfile, form, isEditing]);

  function onSubmit(data: ProfileDataForForm) {
    onSave(data);
    setIsEditing(false);
  }

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentProfile.uid);
    toast({ title: 'UID Copied!', description: 'Player UID has been copied to the clipboard.'});
  }

  const handleEditToggle = () => {
    if (isViewOnly) return;
    setIsEditing(!isEditing);
  }
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValue('avatarUrl', e.target?.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChatClick = () => {
    onStartPrivateChat(currentProfile.uid);
  }
  
  const isOnline = currentProfile.lastSeen && (Date.now() - new Date(currentProfile.lastSeen).getTime() < 5 * 60 * 1000);
  const lastSeenText = currentProfile.lastSeen 
    ? `was ${formatDistanceToNow(new Date(currentProfile.lastSeen), { addSuffix: true })}`
    : 'recently';

  const playerTier = getPlayerTier(metrics.netWorth);

  return (
    <div className="flex flex-col gap-4 text-white">
      {isViewOnly && onBack && (
         <div className='flex justify-between items-center'>
            <Button variant="outline" onClick={onBack} className="mr-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Rudi Nyuma
            </Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader className="flex-row gap-4 items-center">
                    <div className="relative">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={!isEditing}
                        />
                        <Avatar 
                          className={cn("h-20 w-20 border-2 border-yellow-400 rounded-md", isEditing && "cursor-pointer hover:opacity-80 transition-opacity")}
                          onClick={() => isEditing && fileInputRef.current?.click()}
                        >
                            <AvatarImage src={avatarUrl} alt={currentProfile.playerName} data-ai-hint="player logo" className="rounded-none" />
                            <AvatarFallback className="rounded-md">{currentProfile.playerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md pointer-events-none">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        )}
                        <div className={cn(
                            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-gray-800",
                            isOnline ? 'bg-green-500' : 'bg-gray-500'
                        )} />
                    </div>

                    <div className='flex-grow space-y-1'>
                         <span className={cn(
                                'text-sm font-semibold',
                                isOnline ? 'text-green-400' : 'text-gray-400'
                            )}>
                                {isOnline ? 'Online' : `Offline (${lastSeenText})`}
                            </span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold tracking-tight">{isEditing ? form.watch('playerName') : currentProfile.playerName}</h1>
                            {playerTier && (
                                <Badge className={cn("text-xs py-0.5 px-2.5", playerTier.color)}>
                                    <playerTier.icon className="h-3 w-3 mr-1" />
                                    {playerTier.name}
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">{currentProfile.role === 'admin' ? 'Administrator' : 'Sole trader'}</p>
                         <div className='text-xs text-gray-500 font-mono flex items-center gap-2'>
                            <span>UID: {currentProfile.uid}</span>
                            <button type="button" onClick={handleCopyUid} className="p-1 hover:bg-gray-700 rounded-full"><Clipboard className='h-3 w-3'/></button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                    <div className='flex items-center gap-4'>
                        {!isViewOnly && (
                            <Button type="button" variant='ghost' size='sm' className='p-0 h-auto text-blue-400' onClick={handleEditToggle}>
                                <Pencil className='h-4 w-4 mr-1' /> {isEditing ? 'Cancel Edit' : 'Edit Account'}
                            </Button>
                        )}
                        {isViewOnly && (
                            <Button type="button" size='sm' onClick={handleChatClick}>
                                <MessageSquare className='h-4 w-4 mr-2'/>
                                Anzisha Soga
                            </Button>
                        )}
                    </div>
                    <Separator className="bg-gray-600"/>
                    
                    {isEditing ? (
                        <>
                        <FormField
                            control={form.control}
                            name="playerName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jina la Kampuni</FormLabel>
                                <FormControl>
                                <Input placeholder="Jina la kampuni yako..." {...field} className='bg-gray-700 border-gray-600' />
                                </FormControl>
                                <FormDescription>Unaweza kubadilisha jina la kampuni yako.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </>
                    ) : null}
                
                <div>
                    <div className='bg-gray-900/70 p-2 mb-2 rounded-t-md'>
                        <h3 className='font-semibold text-sm'>Maelezo ya kibinafsi kuhusu {currentProfile.playerName}</h3>
                    </div>
                    {isEditing ? (
                        <FormField
                            control={form.control}
                            name="privateNotes"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Andika kuhusu kampuni yako, bidhaa unazozalisha, na karibisha wateja..." {...field} className='bg-gray-700/80 border-gray-600 rounded-t-none min-h-[150px]'/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    ) : (
                        <div className='p-4 bg-gray-700/50 rounded-b-md min-h-[150px] whitespace-pre-wrap text-sm'>
                            {currentProfile.privateNotes || <p className='text-gray-400 italic'>No private notes set.</p>}
                        </div>
                    )}
                </div>
                </CardContent>
                {isEditing && (
                    <CardFooter>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Hifadhi Mabadiliko</Button>
                    </CardFooter>
                )}
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                        <InfoItem label="Ranking" value={metrics.ranking} />
                        <InfoItem label="Rating" value={metrics.rating} />
                        <InfoItem label="Net Worth" value={`$${metrics.netWorth.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`} />
                        <InfoItem label="Credit Rating" value={metrics.rating} />
                        <InfoItem label="Government orders Tier" value="T1" />
                        <InfoItem label="Established" value={new Date().toLocaleDateString()} />
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-gray-800/60 border-gray-700">
                <CardContent className="p-4 space-y-4">
                    {/* Bonus Section */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-center">
                        <h3 className="font-bold whitespace-nowrap">Bonus</h3>
                        <Separator className="bg-gray-600" />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pl-4">
                        <div className="text-sm text-gray-300">Production speed</div>
                        <div className="text-sm font-mono text-right">1% +0%</div>
                        <div className="text-sm text-gray-300">Sales speed</div>
                        <div className="text-sm font-mono text-right">3% +0%</div>
                    </div>

                    <Separator className="bg-gray-700 my-2" />

                    {/* Valuation Section */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-center">
                        <h3 className="font-bold whitespace-nowrap">Valuation</h3>
                        <Separator className="bg-gray-600" />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pl-4">
                        <ValuationItem label="Company value" value={`$${metrics.netWorth.toLocaleString()}`} />
                        <ValuationItem label="Buildings value" value={`$${metrics.buildingValue.toLocaleString()}`} />
                        <ValuationItem label="Stock value" value={`$${metrics.stockValue.toLocaleString()}`} />
                        <ValuationItem label="Inventory value" value={`$${metrics.inventoryValue.toLocaleString()}`} />
                        <ValuationItem label="Patents value" value="$0" />
                    </div>
                    
                    <Separator className="bg-gray-700 my-2" />

                     {/* Liabilities Section */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-center">
                        <h3 className="font-bold whitespace-nowrap">Liabilities</h3>
                        <Separator className="bg-gray-600" />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pl-4">
                        <ValuationItem label="No liabilities" value="" />
                    </div>

                </CardContent>
             </Card>
          </div>

        </form>
      </Form>
    </div>
  );
}
