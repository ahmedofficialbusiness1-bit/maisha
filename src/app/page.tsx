'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Factory, CandlestickChart, Wheat, Briefcase, Award } from 'lucide-react';
import { useUser } from '@/firebase';
import { useEffect } from 'react';


const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
    </div>
);


export default function LandingPage() {
    const router = useRouter();
    const { user, loading } = useUser();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);


    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-white">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    Karibu <span className="text-blue-400">Uchumi wa Afrika</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Jenga himaya yako ya kiuchumi, kutoka kilimo hadi teknolojia ya anga, na uwe mchumi mkuu barani Afrika.
                </p>
                <div className="mt-8">
                    <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full"
                        onClick={() => router.push('/login')}
                    >
                        Anza Kucheza
                    </Button>
                </div>
            </div>

            <Card className="w-full max-w-5xl mt-16 bg-gray-800/60 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Jinsi ya Kucheza</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <FeatureCard 
                            icon={<Factory className="h-8 w-8"/>} 
                            title="1. Jenga Majengo" 
                            description="Anza kwa kujenga viwanda, mashamba, na maduka kwenye viwanja vyako."
                        />
                        <FeatureCard 
                            icon={<Wheat className="h-8 w-8"/>}
                            title="2. Zalisha Bidhaa"
                            description="Kusanya rasilimali na tumia majengo yako kuzalisha bidhaa mbalimbali."
                        />
                        <FeatureCard 
                            icon={<CandlestickChart className="h-8 w-8"/>}
                            title="3. Fanya Biashara"
                            description="Uza bidhaa zako sokoni au nunua rasilimali kutoka kwa wachezaji wengine."
                        />
                         <FeatureCard 
                            icon={<Briefcase className="h-8 w-8"/>}
                            title="4. Wekeza kwa Busara"
                            description="Kuza utajiri wako kwa kununua hisa za makampuni na hatifungani za serikali."
                        />
                        <FeatureCard 
                            icon={<Award className="h-8 w-8"/>}
                            title="5. Kuwa Kiongozi"
                            description="Panda ngazi, shindana, na uwe mchumi namba moja barani Afrika."
                        />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
