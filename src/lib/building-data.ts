export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
};

export const buildingData: Record<string, BuildingConfig> = {
    shamba: {
        productionRate: 100,
    },
    kiwanda_cha_samaki: {
        productionRate: 50, // Example: Fish factories might be slower
    }
};
