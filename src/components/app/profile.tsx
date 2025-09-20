
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
import { Clipboard, Pencil, Upload } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

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
  privateNotes: z.string().max(500, { message: 'Maelezo yasizidi herufi 500.'}).optional(),
});

export type ProfileData = z.infer<typeof profileFormSchema>;

export type PlayerMetrics = {
    netWorth: number;
    ranking: string;
    rating: string;
    buildingValue: number;
    stockValue: number;
};

interface PlayerProfileProps {
  onSave: (data: ProfileData) => void;
  currentProfile: ProfileData;
  metrics: PlayerMetrics;
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


export function PlayerProfile({ onSave, currentProfile, metrics }: PlayerProfileProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localTime, setLocalTime] = React.useState('');

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: currentProfile,
  });
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const avatarUrl = form.watch('avatarUrl');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
   React.useEffect(() => {
    form.reset(currentProfile);
  }, [currentProfile, form]);

  function onSubmit(data: ProfileData) {
    onSave(data);
    setIsEditing(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentProfile.playerName);
  }

  const handleEditToggle = () => {
    if (isEditing) {
        form.reset(currentProfile); // Reset changes if canceling
    }
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


  return (
    <div className="flex flex-col gap-4 text-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="bg-gray-800/60 border-gray-700">
                <CardHeader className="flex-row gap-4 items-center">
                    <Avatar className="h-20 w-20 border-2 border-yellow-400 rounded-md">
                        <AvatarImage src={avatarUrl} alt={currentProfile.playerName} data-ai-hint="player logo" className="rounded-none" />
                        <AvatarFallback className="rounded-md">{currentProfile.playerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-grow space-y-1'>
                        <div className='flex items-center gap-2'>
                            <div className='h-3 w-3 rounded-full bg-green-500'></div>
                            <span className='text-sm font-semibold text-green-400'>Online</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{currentProfile.playerName}</h1>
                        <p className="text-muted-foreground">Sole trader</p>
                        <div className='flex items-center gap-4 pt-2'>
                            <Button type="button" variant='ghost' size='sm' className='p-0 h-auto text-blue-400' onClick={handleCopy}>
                                <Clipboard className='h-4 w-4 mr-1' /> Copy to Clipboard
                            </Button>
                            <Button type="button" variant='ghost' size='sm' className='p-0 h-auto text-blue-400' onClick={handleEditToggle}>
                                <Pencil className='h-4 w-4 mr-1' /> {isEditing ? 'Cancel Edit' : 'Edit Account'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {isEditing ? (
                        <>
                        <FormField
                            control={form.control}
                            name="playerName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jina la Kampuni</FormLabel>
                                <FormControl>
                                <Input placeholder="Jina la kampuni yako..." {...field} className='bg-gray-700 border-gray-600'/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Picha ya Wasifu (Nembo)</FormLabel>
                               <FormControl>
                                <div id={field.name}>
                                  <Input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-center bg-gray-700 border-gray-600 hover:bg-gray-600"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Pakia Picha
                                  </Button>
                                </div>
                              </FormControl>
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
                        <InfoItem label="Last seen" value="Today" />
                        <InfoItem label="Local time" value={localTime} />
                        <InfoItem label="Previous name(s)" value="-" />
                        <InfoItem label="Search tags" value={<Button variant="secondary" size="sm" className='h-auto px-2 py-1 text-xs'>EDIT</Button>} />
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
                        <ValuationItem label={<span className='text-xs'>(at {localTime})</span>} value="" />
                        <ValuationItem label="Company value" value={`$${metrics.netWorth.toLocaleString()}`} />
                        <ValuationItem label="Buildings value" value={`$${metrics.buildingValue.toLocaleString()}`} />
                        <ValuationItem label="Patents value" value="$0" />
                    </div>
                    
                    <Separator className="bg-gray-700 my-2" />

                     {/* Liabilities Section */}
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 items-center">
                        <h3 className="font-bold whitespace-nowrap">Liabilities</h3>
                        <Separator className="bg-gray-600" />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 pl-4">
                        <ValuationItem label={<span className='text-xs'>(at {localTime})</span>} value="" />
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
