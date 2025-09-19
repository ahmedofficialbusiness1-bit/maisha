
export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
    buildCost: { name: string; quantity: number }[];
    upgradeCost: (level: number) => { name: string; quantity: number }[];
};

const calculateUpgradeCost = (baseCost: { name: string; quantity: number }[], level: number) => {
    return baseCost.map(cost => ({
        ...cost,
        quantity: Math.floor(cost.quantity * Math.pow(1.8, level - 1)) // Increased multiplier for steeper upgrade costs
    }));
};


export const buildingData: Record<string, BuildingConfig> = {
    shamba: {
        productionRate: 100,
        buildCost: [
            { name: 'Mabati', quantity: 50 },
            { name: 'Mbao', quantity: 150 },
            { name: 'Zege', quantity: 25 },
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 10 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    zizi: {
        productionRate: 30,
        buildCost: [
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Zege', quantity: 50 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Matofali', quantity: 500 },
            { name: 'Chuma', quantity: 25 },
            { name: 'Nyasi', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_samaki: {
        productionRate: 50, 
        buildCost: [
            { name: 'Mabati', quantity: 250 },
            { name: 'Mbao', quantity: 200 },
            { name: 'Zege', quantity: 100 },
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 800 },
            { name: 'Chuma', quantity: 75 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chuma: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 750 },
            { name: 'Zege', quantity: 500 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Chuma', quantity: 250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_matofali: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 500 },
            { name: 'Nondo', quantity: 250 },
            { name: 'Zege', quantity: 250 },
            { name: 'Mabati', quantity: 200 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mbao: {
        productionRate: 90,
        buildCost: [
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 500 },
            { name: 'Mabati', quantity: 150 },
            { name: 'Mbao', quantity: 50 },
            { name: 'Zege', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_umeme: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 1000 },
            { name: 'Zege', quantity: 750 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
     kiwanda_cha_maji: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 400 },
            { name: 'Matofali', quantity: 1000 },
            { name: 'Zege', quantity: 250 },
            { name: 'Mabati', quantity: 300 },
            { name: 'Mbao', quantity: 200 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saruji: {
        productionRate: 70,
        buildCost: [
            { name: 'Nondo', quantity: 500 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Zege', quantity: 400 },
            { name: 'Mabati', quantity: 350 },
            { name: 'Mbao', quantity: 250 },
            { name: 'Chuma', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_chuma: {
        productionRate: 40,
        buildCost: [
            { name: 'Mbao', quantity: 750 },
            { name: 'Nondo', quantity: 250 },
            { name: 'Mabati', quantity: 200 },
            { name: 'Zege', quantity: 200 },
            { name: 'Matofali', quantity: 500 },
            { name: 'Chuma', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mawe: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 500 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Zege', quantity: 100 },
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 400 },
            { name: 'Chuma', quantity: 75 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mchanga: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 500 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Zege', quantity: 100 },
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 400 },
            { name: 'Chuma', quantity: 75 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_sukari: {
        productionRate: 60,
        buildCost: [
            { name: 'Matofali', quantity: 1000 },
            { name: 'Nondo', quantity: 400 },
            { name: 'Zege', quantity: 500 },
            { name: 'Mabati', quantity: 350 },
            { name: 'Mbao', quantity: 300 },
            { name: 'Chuma', quantity: 250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    mgahawa: {
        productionRate: 25,
        buildCost: [
            { name: 'Matofali', quantity: 750 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Mabati', quantity: 200 },
            { name: 'Zege', quantity: 150 },
            { name: 'Nondo', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_almasi: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 2500 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 750 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 2000 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_dhahabu: {
        productionRate: 8,
        buildCost: [
            { name: 'Zege', quantity: 2250 }, 
            { name: 'Nondo', quantity: 900 },
            { name: 'Mabati', quantity: 700 },
            { name: 'Mbao', quantity: 450 },
            { name: 'Matofali', quantity: 1750 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_silver: {
        productionRate: 15,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 600 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_ruby: {
        productionRate: 10,
        buildCost: [
            { name: 'Zege', quantity: 2000 }, 
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Mbao', quantity: 450 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Chuma', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_tanzanite: {
        productionRate: 12,
        buildCost: [
            { name: 'Zege', quantity: 1750 }, 
            { name: 'Nondo', quantity: 700 },
            { name: 'Mabati', quantity: 550 },
            { name: 'Mbao', quantity: 425 },
            { name: 'Matofali', quantity: 1400 },
            { name: 'Chuma', quantity: 350 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_shaba: {
        productionRate: 25,
        buildCost: [
            { name: 'Zege', quantity: 1250 }, 
            { name: 'Nondo', quantity: 500 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 350 },
            { name: 'Matofali', quantity: 1000 },
            { name: 'Chuma', quantity: 250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mashine: {
        productionRate: 1, // Produces 1 machine per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 1000 }, 
            { name: 'Nondo', quantity: 500 },
            { name: 'Mabati', quantity: 450 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    ofisi_ya_leseni: {
        productionRate: 5, // Produces 5 licenses per hour at level 1
        buildCost: [
            { name: 'Matofali', quantity: 750 }, 
            { name: 'Mbao', quantity: 500 },
            { name: 'Mabati', quantity: 250 },
            { name: 'Zege', quantity: 200 },
            { name: 'Nondo', quantity: 200 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_karatasi: {
        productionRate: 100, // Produces 100 paper units per hour
        buildCost: [
            { name: 'Mbao', quantity: 500 }, 
            { name: 'Matofali', quantity: 250 },
            { name: 'Mabati', quantity: 300 },
            { name: 'Zege', quantity: 200 },
            { name: 'Nondo', quantity: 200 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    wizara_ya_madini: {
        productionRate: 2, // Produces 2 certificates per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 750 }, 
            { name: 'Mbao', quantity: 1000 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vitambaa: {
        productionRate: 50,
        buildCost: [
            { name: 'Mbao', quantity: 500 }, 
            { name: 'Matofali', quantity: 500 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Zege', quantity: 250 },
            { name: 'Nondo', quantity: 250 },
            { name: 'Chuma', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ngozi: {
        productionRate: 30,
        buildCost: [
            { name: 'Mbao', quantity: 600 }, 
            { name: 'Matofali', quantity: 400 },
            { name: 'Mabati', quantity: 350 },
            { name: 'Zege', quantity: 300 },
            { name: 'Nondo', quantity: 300 },
            { name: 'Chuma', quantity: 250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_nguo: {
        productionRate: 20,
        buildCost: [
            { name: 'Matofali', quantity: 1000 }, 
            { name: 'Nondo', quantity: 250 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Zege', quantity: 300 },
            { name: 'Chuma', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saa: {
        productionRate: 10,
        buildCost: [
            { name: 'Nondo', quantity: 500 }, 
            { name: 'Zege', quantity: 250 },
            { name: 'Mabati', quantity: 300 },
            { name: 'Mbao', quantity: 200 },
            { name: 'Matofali', quantity: 600 },
            { name: 'Chuma', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vioo: {
        productionRate: 40,
        buildCost: [
            { name: 'Matofali', quantity: 750 }, 
            { name: 'Zege', quantity: 500 },
            { name: 'Mabati', quantity: 450 },
            { name: 'Mbao', quantity: 350 },
            { name: 'Nondo', quantity: 400 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chokaa: {
        productionRate: 60,
        buildCost: [
            { name: 'Mawe', quantity: 2000 }, 
            { name: 'Mbao', quantity: 250 },
            { name: 'Mabati', quantity: 200 },
            { name: 'Zege', quantity: 150 },
            { name: 'Nondo', quantity: 150 },
            { name: 'Matofali', quantity: 500 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gundi: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 400 }, 
            { name: 'Matofali', quantity: 400 },
            { name: 'Mabati', quantity: 250 },
            { name: 'Zege', quantity: 200 },
            { name: 'Nondo', quantity: 200 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    sonara: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 500 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Mbao', quantity: 750 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mafuta: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 1500 }, 
            { name: 'Zege', quantity: 1000 },
            { name: 'Mabati', quantity: 750 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_disel: {
        productionRate: 15,
        buildCost: [
            { name: 'Nondo', quantity: 1250 }, 
            { name: 'Zege', quantity: 750 }, 
            { name: 'Matofali', quantity: 2000 },
            { name: 'Mabati', quantity: 650 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_petrol: {
        productionRate: 15,
        buildCost: [
            { name: 'Nondo', quantity: 1250 }, 
            { name: 'Zege', quantity: 750 }, 
            { name: 'Matofali', quantity: 2000 },
            { name: 'Mabati', quantity: 650 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Electronics
    kiwanda_cha_tv: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_tablet: {
        productionRate: 10,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_smartphone: {
        productionRate: 15,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_laptop: {
        productionRate: 8,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_processor: {
        productionRate: 20,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 1500 },
            { name: 'Mabati', quantity: 750 },
            { name: 'Mbao', quantity: 750 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 1000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_betri: {
        productionRate: 30,
        buildCost: [
            { name: 'Zege', quantity: 750 }, 
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 1000 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_display: {
        productionRate: 25,
        buildCost: [
            { name: 'Zege', quantity: 1000 }, 
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 550 },
            { name: 'Mbao', quantity: 550 },
            { name: 'Matofali', quantity: 900 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_motherboard: {
        productionRate: 20,
        buildCost: [
            { name: 'Zege', quantity: 1250 }, 
            { name: 'Nondo', quantity: 1000 },
            { name: 'Mabati', quantity: 650 },
            { name: 'Mbao', quantity: 650 },
            { name: 'Matofali', quantity: 1100 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vifaa_vya_ndani: {
        productionRate: 50,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 500 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 400 },
            { name: 'Matofali', quantity: 600 },
            { name: 'Chuma', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_usanidi: {
        productionRate: 40,
        buildCost: [
            { name: 'Zege', quantity: 750 }, 
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 900 },
            { name: 'Chuma', quantity: 500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Vehicle Chain
    kiwanda_cha_spare: {
        productionRate: 10,
        buildCost: [
            { name: 'Nondo', quantity: 1000 }, 
            { name: 'Zege', quantity: 500 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Mbao', quantity: 600 },
            { name: 'Matofali', quantity: 900 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gari: {
        productionRate: 2,
        buildCost: [
            { name: 'Nondo', quantity: 2500 }, 
            { name: 'Zege', quantity: 1500 },
            { name: 'Mabati', quantity: 1000 },
            { name: 'Mbao', quantity: 1000 },
            { name: 'Matofali', quantity: 2000 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_pikipiki: {
        productionRate: 5,
        buildCost: [
            { name: 'Nondo', quantity: 1500 }, 
            { name: 'Zege', quantity: 750 },
            { name: 'Mabati', quantity: 500 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 1250 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ndege: {
        productionRate: 1,
        buildCost: [
            { name: 'Nondo', quantity: 50000 }, 
            { name: 'Zege', quantity: 25000 },
            { name: 'Mabati', quantity: 20000 },
            { name: 'Mbao', quantity: 15000 },
            { name: 'Matofali', quantity: 40000 },
            { name: 'Chuma', quantity: 30000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_meli: {
        productionRate: 1,
        buildCost: [
            { name: 'Nondo', quantity: 75000 }, 
            { name: 'Zege', quantity: 40000 },
            { name: 'Mabati', quantity: 30000 },
            { name: 'Mbao', quantity: 25000 },
            { name: 'Matofali', quantity: 60000 },
            { name: 'Chuma', quantity: 45000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Space Chain
    kiwanda_cha_k_mashine: {
        productionRate: 0.5,
        buildCost: [
            { name: 'Nondo', quantity: 10000 }, 
            { name: 'Zege', quantity: 5000 },
            { name: 'Mabati', quantity: 4000 },
            { name: 'Mbao', quantity: 3000 },
            { name: 'Matofali', quantity: 7500 },
            { name: 'Chuma', quantity: 6000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_anga: {
        productionRate: 0.2,
        buildCost: [
            { name: 'Nondo', quantity: 250000 }, 
            { name: 'Zege', quantity: 125000 },
            { name: 'Mabati', quantity: 100000 },
            { name: 'Mbao', quantity: 75000 },
            { name: 'Matofali', quantity: 200000 },
            { name: 'Chuma', quantity: 150000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_roketi: {
        productionRate: 0.1,
        buildCost: [
            { name: 'Nondo', quantity: 500000 }, 
            { name: 'Zege', quantity: 250000 },
            { name: 'Mabati', quantity: 200000 },
            { name: 'Mbao', quantity: 150000 },
            { name: 'Matofali', quantity: 400000 },
            { name: 'Chuma', quantity: 300000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
};

    
