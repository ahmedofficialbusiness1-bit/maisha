
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { useUser } from '@/firebase';
import { signInWithEmail, signUpWithEmail, sendPasswordReset } from '@/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getInitialUserData, saveUserData, type UserData } from '@/services/game-service';
import { getDatabase, ref, set, get, runTransaction } from 'firebase/database';


const formSchema = z.object({
  email: z.string().email({ message: 'Tafadhali ingiza barua pepe sahihi.' }),
  password: z.string().min(6, { message: 'Nenosiri lazima liwe na angalau herufi 6.' }),
});

const passwordResetSchema = z.object({
    email: z.string().email({ message: 'Tafadhali ingiza barua pepe sahihi ili kutuma maelekezo.' }),
});


function LoginComponent() {
    const router = useRouter();
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const [isLoginView, setIsLoginView] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isResettingPassword, setIsResettingPassword] = React.useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
    const database = getDatabase();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });

    const resetForm = useForm<z.infer<typeof passwordResetSchema>>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: { email: '' },
    });

    React.useEffect(() => {
        if (!userLoading && user) {
            // Check if user data exists, if so, check for companyProfile
            const userRef = ref(database, `users/${user.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val() as UserData;
                    if (!data.companyProfile) {
                        runTransaction(userRef, (currentData) => {
                            if (currentData && !currentData.companyProfile) {
                                const initial = getInitialUserData(user.uid, currentData.username, null);
                                currentData.companyProfile = initial.companyProfile;
                            }
                            return currentData;
                        }).then(() => {
                            router.push('/dashboard');
                        });
                    } else {
                        router.push('/dashboard');
                    }
                } else {
                    // This case should be handled by the signup logic, but as a fallback:
                     router.push('/dashboard');
                }
            });
        }
    }, [user, userLoading, router, database]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            if (isLoginView) {
                await signInWithEmail(values.email, values.password);
            } else {
                const newUser = await signUpWithEmail(values.email, values.password);
                if (newUser) {
                    const initialData = getInitialUserData(newUser.uid, newUser.displayName || 'Mchezaji', newUser.email);
                    const userRef = ref(database, `users/${newUser.uid}`);
                    await set(userRef, initialData);

                    const playerPublicRef = ref(database, `players/${newUser.uid}`);
                    await set(playerPublicRef, {
                        uid: initialData.uid,
                        username: initialData.username,
                        netWorth: initialData.netWorth,
                        avatar: `https://picsum.photos/seed/${initialData.uid}/40/40`,
                        level: initialData.playerLevel,
                        role: initialData.role
                    });
                }
            }
            // The useEffect will handle redirect on successful login/signup
        } catch (error) {
            let title = 'Kosa Limetokea';
            let description = 'Imeshindikana kuingia/kujisajili. Tafadhali jaribu tena.';
            
            if (error instanceof FirebaseError) {
                switch(error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        title = 'Barua pepe au Nenosiri si Sahihi';
                        description = 'Tafadhali angalia taarifa zako na ujaribu tena.';
                        break;
                    case 'auth/email-already-in-use':
                        title = 'Barua pepe Tayari Inatumika';
                        description = 'Anwani hii ya barua pepe tayari imesajiliwa. Tafadhali ingia.';
                        break;
                    case 'auth/weak-password':
                        title = 'Nenosiri Dhaifu';
                        description = 'Nenosiri linapaswa kuwa na angalau herufi 6.';
                        break;
                     default:
                        console.error("Firebase auth error:", error);
                }
            } else {
                 console.error("Unknown error:", error);
            }

            toast({
                title,
                description,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const onPasswordReset = async (values: z.infer<typeof passwordResetSchema>) => {
        setIsResettingPassword(true);
        try {
            await sendPasswordReset(values.email);
            toast({
                title: 'Barua Pepe Imetumwa',
                description: 'Tumekutumia maelekezo ya kuweka upya nenosiri. Angalia barua pepe yako.',
            });
            setIsResetDialogOpen(false);
            resetForm.reset();
        } catch (error) {
            toast({
                title: 'Kosa Limetokea',
                description: 'Imeshindikana kutuma barua pepe. Hakikisha anwani ni sahihi.',
                variant: 'destructive',
            });
        } finally {
            setIsResettingPassword(false);
        }
    }


    if (userLoading || user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-white">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://picsum.photos/seed/african-savanna/1920/1080')"}} />
            <div className="absolute inset-0 -z-10 bg-black/60"></div>
            
            <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{isLoginView ? 'Karibu Tena!' : 'Tengeneza Akaunti'}</CardTitle>
                    <CardDescription>{isLoginView ? 'Ingiza taarifa zako ili uendelee.' : 'Jaza fomu ili kuanza safari yako.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barua Pepe</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jina@mfano.com" {...field} className="bg-gray-700 border-gray-600"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nenosiri</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} className="bg-gray-700 border-gray-600"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             {isLoginView && (
                                <div className="text-right">
                                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="text-blue-400 px-0">
                                                Umesahau nenosiri?
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-900 border-gray-700 text-white">
                                            <DialogHeader>
                                                <DialogTitle>Weka Upya Nenosiri</DialogTitle>
                                                <DialogDescription>
                                                    Ingiza barua pepe yako. Utatumiwa link ya kuweka upya nenosiri.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...resetForm}>
                                                <form onSubmit={resetForm.handleSubmit(onPasswordReset)} className="space-y-4">
                                                    <FormField
                                                        control={resetForm.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Barua Pepe</FormLabel>
                                                                <FormControl>
                                                                    <Input type="email" placeholder="jina@mfano.com" {...field} className="bg-gray-800 border-gray-600"/>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <DialogFooter>
                                                        <Button type="submit" className="w-full" disabled={isResettingPassword}>
                                                             {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Tuma Barua Pepe
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoginView ? 'Ingia' : 'Jisajili'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                 <div className="p-6 pt-0 text-center">
                    <p className="text-sm text-gray-400">
                        {isLoginView ? "Huna akaunti?" : "Tayari una akaunti?"}
                        <Button variant="link" className="text-blue-400 pl-2" onClick={() => setIsLoginView(!isLoginView)}>
                             {isLoginView ? "Jisajili hapa" : "Ingia hapa"}
                        </Button>
                    </p>
                </div>
            </Card>

            <div className="text-center max-w-4xl mx-auto mt-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    <span className="text-blue-400">Uchumi wa Afrika</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Jenga himaya yako ya kiuchumi, kutoka kilimo hadi teknolojia ya anga, na uwe mchumi mkuu barani Afrika.
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <FirebaseClientProvider>
            <LoginComponent />
        </FirebaseClientProvider>
    );
}
