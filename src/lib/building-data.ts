
export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
    buildCost: { name: string; quantity: number }[];
    upgradeCost: (level: number) => { name: string; quantity: number }[];
};

const calculateUpgradeCost = (baseCost: { name: string; quantity: number }[], level: number) => {
    return baseCost.map(cost => ({
        ...cost,
        quantity: Math.floor(cost.quantity * Math.pow(1.5, level - 1))
    }));
};


export const buildingData: Record<string, BuildingConfig> = {
    shamba: {
        productionRate: 100,
        buildCost: [
            { name: 'Mbao', quantity: 20 },
            { name: 'Matofali', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    zizi: {
        productionRate: 30,
        buildCost: [
            { name: 'Mbao', quantity: 80 },
            { name: 'Nyasi', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_samaki: {
        productionRate: 50, 
        buildCost: [
            { name: 'Mbao', quantity: 40 },
            { name: 'Matofali', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chuma: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 150 },
            { name: 'Zege', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_matofali: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Zege', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mbao: {
        productionRate: 90,
        buildCost: [
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_umeme: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 200 },
            { name: 'Zege', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
     kiwanda_cha_maji: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 80 },
            { name: 'Matofali', quantity: 200 },
            { name: 'Zege', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saruji: {
        productionRate: 70,
        buildCost: [
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Zege', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_chuma: {
        productionRate: 40,
        buildCost: [
            { name: 'Mbao', quantity: 150 },
            { name: 'Nondo', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mawe: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mchanga: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_sukari: {
        productionRate: 60,
        buildCost: [
            { name: 'Matofali', quantity: 200 },
            { name: 'Nondo', quantity: 80 },
            { name: 'Zege', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    mgahawa: {
        productionRate: 25,
        buildCost: [
            { name: 'Matofali', quantity: 150 },
            { name: 'Mbao', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_almasi: {
        productionRate: 5,
        buildCost: [{ name: 'Zege', quantity: 500 }, { name: 'Nondo', quantity: 200 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_dhahabu: {
        productionRate: 8,
        buildCost: [{ name: 'Zege', quantity: 450 }, { name: 'Nondo', quantity: 180 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_silver: {
        productionRate: 15,
        buildCost: [{ name: 'Zege', quantity: 300 }, { name: 'Nondo', quantity: 120 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_ruby: {
        productionRate: 10,
        buildCost: [{ name: 'Zege', quantity: 400 }, { name: 'Nondo', quantity: 150 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_tanzanite: {
        productionRate: 12,
        buildCost: [{ name: 'Zege', quantity: 350 }, { name: 'Nondo', quantity: 140 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_shaba: {
        productionRate: 25,
        buildCost: [{ name: 'Zege', quantity: 250 }, { name: 'Nondo', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mashine: {
        productionRate: 1, // Produces 1 machine per hour at level 1
        buildCost: [{ name: 'Zege', quantity: 200 }, { name: 'Nondo', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    ofisi_ya_leseni: {
        productionRate: 5, // Produces 5 licenses per hour at level 1
        buildCost: [{ name: 'Matofali', quantity: 150 }, { name: 'Mbao', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_karatasi: {
        productionRate: 100, // Produces 100 paper units per hour
        buildCost: [{ name: 'Mbao', quantity: 100 }, { name: 'Matofali', quantity: 50 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    wizara_ya_madini: {
        productionRate: 2, // Produces 2 certificates per hour at level 1
        buildCost: [{ name: 'Zege', quantity: 300 }, { name: 'Nondo', quantity: 150 }, { name: 'Mbao', quantity: 200 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vitambaa: {
        productionRate: 50,
        buildCost: [{ name: 'Mbao', quantity: 100 }, { name: 'Matofali', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ngozi: {
        productionRate: 30,
        buildCost: [{ name: 'Mbao', quantity: 120 }, { name: 'Matofali', quantity: 80 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_nguo: {
        productionRate: 20,
        buildCost: [{ name: 'Matofali', quantity: 200 }, { name: 'Nondo', quantity: 50 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saa: {
        productionRate: 10,
        buildCost: [{ name: 'Nondo', quantity: 100 }, { name: 'Zege', quantity: 50 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vioo: {
        productionRate: 40,
        buildCost: [{ name: 'Matofali', quantity: 150 }, { name: 'Zege', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chokaa: {
        productionRate: 60,
        buildCost: [{ name: 'Mawe', quantity: 200 }, { name: 'Mbao', quantity: 50 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gundi: {
        productionRate: 80,
        buildCost: [{ name: 'Mbao', quantity: 80 }, { name: 'Matofali', quantity: 80 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    sonara: {
        productionRate: 5,
        buildCost: [{ name: 'Zege', quantity: 300 }, { name: 'Nondo', quantity: 100 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mafuta: {
        productionRate: 20,
        buildCost: [{ name: 'Nondo', quantity: 300 }, { name: 'Zege', quantity: 200 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_disel: {
        productionRate: 15,
        buildCost: [{ name: 'Nondo', quantity: 250 }, { name: 'Zege', quantity: 150 }, { name: 'Matofali', quantity: 400 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_petrol: {
        productionRate: 15,
        buildCost: [{ name: 'Nondo', quantity: 250 }, { name: 'Zege', quantity: 150 }, { name: 'Matofali', quantity: 400 }],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    }
};

    

