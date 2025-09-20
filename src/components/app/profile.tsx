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
import { toast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  playerName: z
    .string()
    .min(2, {
      message: 'Jina lazima liwe na angalau herufi 2.',
    })
    .max(30, {
      message: 'Jina lisizidi herufi 30.',
    }),
  avatarUrl: z.string().url({ message: 'Tafadhali weka URL sahihi ya picha.' }).optional().or(z.literal('')),
});

export type ProfileData = z.infer<typeof profileFormSchema>;

interface PlayerProfileProps {
  onSave: (data: ProfileData) => void;
  currentProfile: ProfileData;
}

export function PlayerProfile({ onSave, currentProfile }: PlayerProfileProps) {
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: currentProfile,
  });

  const avatarUrl = form.watch('avatarUrl');

  function onSubmit(data: ProfileData) {
    onSave(data);
  }

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Wasifu wa Mchezaji</h1>
        <p className="text-muted-foreground">
          Badilisha taarifa zako za umma hapa.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle>Badilisha Wasifu</CardTitle>
              <CardDescription className="text-gray-400">
                Fanya mabadiliko kwenye wasifu wako. Bonyeza hifadhi ukimaliza.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-yellow-400">
                        <AvatarImage src={avatarUrl} alt={currentProfile.playerName} data-ai-hint="player avatar" />
                        <AvatarFallback>{currentProfile.playerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow space-y-2">
                        <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL ya Picha (Avatar)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://mfano.com/picha.png" {...field} className='bg-gray-700 border-gray-600' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jina la Uchezaji</FormLabel>
                    <FormControl>
                      <Input placeholder="Jina lako..." {...field} className='bg-gray-700 border-gray-600'/>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Hili ndilo jina lako la umma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Hifadhi Mabadiliko</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
