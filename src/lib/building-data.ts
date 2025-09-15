export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
    buildCost: { name: string; quantity: number }[];
};

export const buildingData: Record<string, BuildingConfig> = {
    shamba: {
        productionRate: 100,
        buildCost: [
            { name: 'Mbao', quantity: 20 },
            { name: 'Matofali', quantity: 50 },
        ]
    },
    kiwanda_cha_samaki: {
        productionRate: 50, 
        buildCost: [
            { name: 'Mbao', quantity: 40 },
            { name: 'Matofali', quantity: 100 },
        ]
    },
    kiwanda_cha_chuma: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 150 },
            { name: 'Zege', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
        ]
    },
    kiwanda_cha_matofali: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Zege', quantity: 50 },
        ]
    },
    kiwanda_cha_mbao: {
        productionRate: 90,
        buildCost: [
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 100 },
        ]
    },
    kiwanda_cha_umeme: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 200 },
            { name: 'Zege', quantity: 150 },
        ]
    },
     kiwanda_cha_maji: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 80 },
            { name: 'Matofali', quantity: 200 },
            { name: 'Zege', quantity: 50 },
        ]
    },
    kiwanda_cha_saruji: {
        productionRate: 70,
        buildCost: [
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Zege', quantity: 80 },
        ]
    },
    uchimbaji_chuma: {
        productionRate: 40,
        buildCost: [
            { name: 'Mbao', quantity: 150 },
            { name: 'Nondo', quantity: 50 },
        ]
    },
    uchimbaji_mawe: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
        ]
    },
    uchimbaji_mchanga: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
        ]
    },
};
