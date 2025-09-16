
import { Factory, Leaf, Fish, User, LucideIcon } from 'lucide-react';
import type React from 'react';

export type WorkerSpecialty = 'Kilimo' | 'Uvuvi' | 'Uzalishaji' | 'Usimamizi';

export type Worker = {
    id: string;
    name: string;
    specialty: WorkerSpecialty;
    description: string;
    salary: number; // Salary per minute
    effect: {
        type: 'PRODUCTION_BOOST' | 'COST_REDUCTION';
        value: number; // Percentage
    };
    icon: React.ReactElement<LucideIcon>;
};

export const workerData: Worker[] = [
    {
        id: 'mkulima_basic',
        name: 'Mkulima Chipukizi',
        specialty: 'Kilimo',
        description: 'Anaongeza kasi ya uzalishaji shambani kwa kiasi kidogo.',
        salary: 50,
        effect: { type: 'PRODUCTION_BOOST', value: 5 }, // 5% boost
        icon: <Leaf />,
    },
    {
        id: 'mvuvi_basic',
        name: 'Mvuvi Mwanafunzi',
        specialty: 'Uvuvi',
        description: 'Anaongeza kasi ya uzalishaji kwenye shughuli za uvuvi.',
        salary: 60,
        effect: { type: 'PRODUCTION_BOOST', value: 5 }, // 5% boost
        icon: <Fish />,
    },
    {
        id: 'operator_basic',
        name: 'Opereta wa Mashine',
        specialty: 'Uzalishaji',
        description: 'Huongeza ufanisi katika viwanda vya uzalishaji.',
        salary: 75,
        effect: { type: 'PRODUCTION_BOOST', value: 5 }, // 5% boost
        icon: <Factory />,
    },
    {
        id: 'msimamizi_basic',
        name: 'Msimamizi',
        specialty: 'Usimamizi',
        description: 'Hupunguza gharama za uendeshaji katika jengo lolote.',
        salary: 100,
        effect: { type: 'COST_REDUCTION', value: 2 }, // 2% cost reduction
        icon: <User />,
    },
];

