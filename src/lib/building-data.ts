export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
};

export const buildingData: Record<string, BuildingConfig> = {
    shamba: {
        productionRate: 100,
    },
    kiwanda_cha_samaki: {
        productionRate: 50, 
    },
    kiwanda_cha_chuma: {
        productionRate: 20,
    },
    kiwanda_cha_matofali: {
        productionRate: 80,
    },
    kiwanda_cha_mbao: {
        productionRate: 90,
    },
    kiwanda_cha_umeme: {
        productionRate: 500,
    },
     kiwanda_cha_maji: {
        productionRate: 500,
    },
    kiwanda_cha_saruji: {
        productionRate: 70,
    },
    uchimbaji_chuma: {
        productionRate: 40,
    },
    uchimbaji_mawe: {
        productionRate: 150,
    },
    uchimbaji_mchanga: {
        productionRate: 150,
    },
};
