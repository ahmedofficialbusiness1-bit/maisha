
      
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
    duka_kuu: {
        productionRate: 0, // Shops don't produce
        buildCost: [
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 1000 },
            { name: 'Zege', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    duka_la_ujenzi: {
        productionRate: 0,
        buildCost: [
            { name: 'Nondo', quantity: 300 },
            { name: 'Saruji', quantity: 500 },
            { name: 'Zege', quantity: 400 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    duka_la_nguo_na_vito: {
        productionRate: 0,
        buildCost: [
            { name: 'Mbao', quantity: 400 },
            { name: 'Kioo', quantity: 200 },
            { name: 'Zege', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    duka_la_electroniki: {
        productionRate: 0,
        buildCost: [
            { name: 'Chuma', quantity: 300 },
            { name: 'Kioo', quantity: 300 },
            { name: 'Nondo', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    duka_la_magari: {
        productionRate: 0,
        buildCost: [
            { name: 'Nondo', quantity: 800 },
            { name: 'Chuma', quantity: 500 },
            { name: 'Zege', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    duka_la_anga: {
        productionRate: 0,
        buildCost: [
            { name: 'Nondo', quantity: 2000 },
            { name: 'Chuma', quantity: 1500 },
            { name: 'Zege', quantity: 1000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    shamba: {
        productionRate: 2000,
        buildCost: [
            { name: 'Mabati', quantity: 150 },
            { name: 'Mbao', quantity: 450 },
            { name: 'Zege', quantity: 75 },
            { name: 'Nondo', quantity: 60 },
            { name: 'Matofali', quantity: 750 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    zizi: {
        productionRate: 600,
        buildCost: [
            { name: 'Mabati', quantity: 300 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Zege', quantity: 150 },
            { name: 'Nondo', quantity: 150 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Chuma', quantity: 75 },
            { name: 'Nyasi', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_samaki: {
        productionRate: 1000, 
        buildCost: [
            { name: 'Mabati', quantity: 750 },
            { name: 'Mbao', quantity: 600 },
            { name: 'Zege', quantity: 300 },
            { name: 'Nondo', quantity: 300 },
            { name: 'Matofali', quantity: 2400 },
            { name: 'Chuma', quantity: 225 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chuma: {
        productionRate: 400,
        buildCost: [
            { name: 'Nondo', quantity: 2250 },
            { name: 'Zege', quantity: 1500 },
            { name: 'Matofali', quantity: 4500 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_matofali: {
        productionRate: 1600,
        buildCost: [
            { name: 'Mbao', quantity: 1500 },
            { name: 'Nondo', quantity: 750 },
            { name: 'Zege', quantity: 750 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mbao: {
        productionRate: 1800,
        buildCost: [
            { name: 'Nondo', quantity: 300 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Mabati', quantity: 450 },
            { name: 'Mbao', quantity: 150 },
            { name: 'Zege', quantity: 450 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_umeme: {
        productionRate: 10000,
        buildCost: [
            { name: 'Nondo', quantity: 3000 },
            { name: 'Zege', quantity: 2250 },
            { name: 'Mabati', quantity: 1800 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
     kiwanda_cha_maji: {
        productionRate: 10000,
        buildCost: [
            { name: 'Nondo', quantity: 1200 },
            { name: 'Matofali', quantity: 3000 },
            { name: 'Zege', quantity: 750 },
            { name: 'Mabati', quantity: 900 },
            { name: 'Mbao', quantity: 600 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saruji: {
        productionRate: 1400,
        buildCost: [
            { name: 'Nondo', quantity: 1500 },
            { name: 'Matofali', quantity: 4500 },
            { name: 'Zege', quantity: 1200 },
            { name: 'Mabati', quantity: 1050 },
            { name: 'Mbao', quantity: 750 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_chuma: {
        productionRate: 800,
        buildCost: [
            { name: 'Mbao', quantity: 2250 },
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Zege', quantity: 600 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mawe: {
        productionRate: 3000,
        buildCost: [
            { name: 'Mbao', quantity: 1500 },
            { name: 'Mabati', quantity: 300 },
            { name: 'Zege', quantity: 300 },
            { name: 'Nondo', quantity: 300 },
            { name: 'Matofali', quantity: 1200 },
            { name: 'Chuma', quantity: 225 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mchanga: {
        productionRate: 3000,
        buildCost: [
            { name: 'Mbao', quantity: 1500 },
            { name: 'Mabati', quantity: 300 },
            { name: 'Zege', quantity: 300 },
            { name: 'Nondo', quantity: 300 },
            { name: 'Matofali', quantity: 1200 },
            { name: 'Chuma', quantity: 225 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_sukari: {
        productionRate: 1200,
        buildCost: [
            { name: 'Matofali', quantity: 3000 },
            { name: 'Nondo', quantity: 1200 },
            { name: 'Zege', quantity: 1500 },
            { name: 'Mabati', quantity: 1050 },
            { name: 'Mbao', quantity: 900 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    mgahawa: {
        productionRate: 500,
        buildCost: [
            { name: 'Matofali', quantity: 2250 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Zege', quantity: 450 },
            { name: 'Nondo', quantity: 450 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_almasi: {
        productionRate: 100,
        buildCost: [
            { name: 'Zege', quantity: 7500 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 2250 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 6000 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_dhahabu: {
        productionRate: 160,
        buildCost: [
            { name: 'Zege', quantity: 6750 }, 
            { name: 'Nondo', quantity: 2700 },
            { name: 'Mabati', quantity: 2100 },
            { name: 'Mbao', quantity: 1350 },
            { name: 'Matofali', quantity: 5250 },
            { name: 'Chuma', quantity: 1350 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_silver: {
        productionRate: 300,
        buildCost: [
            { name: 'Zege', quantity: 4500 }, 
            { name: 'Nondo', quantity: 1800 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 900 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_ruby: {
        productionRate: 200,
        buildCost: [
            { name: 'Zege', quantity: 6000 }, 
            { name: 'Nondo', quantity: 2250 },
            { name: 'Mabati', quantity: 1800 },
            { name: 'Mbao', quantity: 1350 },
            { name: 'Matofali', quantity: 4500 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_tanzanite: {
        productionRate: 240,
        buildCost: [
            { name: 'Zege', quantity: 5250 }, 
            { name: 'Nondo', quantity: 2100 },
            { name: 'Mabati', quantity: 1650 },
            { name: 'Mbao', quantity: 1275 },
            { name: 'Matofali', quantity: 4200 },
            { name: 'Chuma', quantity: 1050 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_shaba: {
        productionRate: 500,
        buildCost: [
            { name: 'Zege', quantity: 3750 }, 
            { name: 'Nondo', quantity: 1500 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1050 },
            { name: 'Matofali', quantity: 3000 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mashine: {
        productionRate: 20, // Produces 1 machine per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 3000 }, 
            { name: 'Nondo', quantity: 1500 },
            { name: 'Mabati', quantity: 1350 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 2250 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    ofisi_ya_leseni: {
        productionRate: 100, // Produces 5 licenses per hour at level 1
        buildCost: [
            { name: 'Matofali', quantity: 2250 }, 
            { name: 'Mbao', quantity: 1500 },
            { name: 'Mabati', quantity: 750 },
            { name: 'Zege', quantity: 600 },
            { name: 'Nondo', quantity: 600 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_karatasi: {
        productionRate: 2000, // Produces 100 paper units per hour
        buildCost: [
            { name: 'Mbao', quantity: 1500 }, 
            { name: 'Matofali', quantity: 750 },
            { name: 'Mabati', quantity: 900 },
            { name: 'Zege', quantity: 600 },
            { name: 'Nondo', quantity: 600 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    wizara_ya_madini: {
        productionRate: 40, // Produces 2 certificates per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 4500 }, 
            { name: 'Nondo', quantity: 2250 }, 
            { name: 'Mbao', quantity: 3000 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vitambaa: {
        productionRate: 1000,
        buildCost: [
            { name: 'Mbao', quantity: 1500 }, 
            { name: 'Matofali', quantity: 1500 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Zege', quantity: 750 },
            { name: 'Nondo', quantity: 750 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ngozi: {
        productionRate: 600,
        buildCost: [
            { name: 'Mbao', quantity: 1800 }, 
            { name: 'Matofali', quantity: 1200 },
            { name: 'Mabati', quantity: 1050 },
            { name: 'Zege', quantity: 900 },
            { name: 'Nondo', quantity: 900 },
            { name: 'Chuma', quantity: 750 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_nguo: {
        productionRate: 400,
        buildCost: [
            { name: 'Matofali', quantity: 3000 }, 
            { name: 'Nondo', quantity: 750 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Zege', quantity: 900 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saa: {
        productionRate: 200,
        buildCost: [
            { name: 'Nondo', quantity: 1500 }, 
            { name: 'Zege', quantity: 750 },
            { name: 'Mabati', quantity: 900 },
            { name: 'Mbao', quantity: 600 },
            { name: 'Matofali', quantity: 1800 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vioo: {
        productionRate: 800,
        buildCost: [
            { name: 'Matofali', quantity: 2250 }, 
            { name: 'Zege', quantity: 1500 },
            { name: 'Mabati', quantity: 1350 },
            { name: 'Mbao', quantity: 1050 },
            { name: 'Nondo', quantity: 1200 },
            { name: 'Chuma', quantity: 900 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chokaa: {
        productionRate: 1200,
        buildCost: [
            { name: 'Mawe', quantity: 6000 }, 
            { name: 'Mbao', quantity: 750 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Zege', quantity: 450 },
            { name: 'Nondo', quantity: 450 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gundi: {
        productionRate: 1600,
        buildCost: [
            { name: 'Mbao', quantity: 1200 }, 
            { name: 'Matofali', quantity: 1200 },
            { name: 'Mabati', quantity: 750 },
            { name: 'Zege', quantity: 600 },
            { name: 'Nondo', quantity: 600 },
            { name: 'Chuma', quantity: 450 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    sonara: {
        productionRate: 100,
        buildCost: [
            { name: 'Zege', quantity: 4500 }, 
            { name: 'Nondo', quantity: 1500 },
            { name: 'Mabati', quantity: 1800 },
            { name: 'Mbao', quantity: 2250 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mafuta: {
        productionRate: 400,
        buildCost: [
            { name: 'Nondo', quantity: 4500 }, 
            { name: 'Zege', quantity: 3000 },
            { name: 'Mabati', quantity: 2250 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 2250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_disel: {
        productionRate: 300,
        buildCost: [
            { name: 'Nondo', quantity: 3750 }, 
            { name: 'Zege', quantity: 2250 }, 
            { name: 'Matofali', quantity: 6000 },
            { name: 'Mabati', quantity: 1950 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Chuma', quantity: 1800 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_petrol: {
        productionRate: 300,
        buildCost: [
            { name: 'Nondo', quantity: 3750 }, 
            { name: 'Zege', quantity: 2250 }, 
            { name: 'Matofali', quantity: 6000 },
            { name: 'Mabati', quantity: 1950 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Chuma', quantity: 1800 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Electronics
    kiwanda_cha_tv: {
        productionRate: 100,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 2250 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_tablet: {
        productionRate: 200,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 2250 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_smartphone: {
        productionRate: 300,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 2250 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_laptop: {
        productionRate: 160,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 2250 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_processor: {
        productionRate: 400,
        buildCost: [
            { name: 'Zege', quantity: 4500 }, 
            { name: 'Nondo', quantity: 4500 },
            { name: 'Mabati', quantity: 2250 },
            { name: 'Mbao', quantity: 2250 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 3000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_betri: {
        productionRate: 600,
        buildCost: [
            { name: 'Zege', quantity: 2250 }, 
            { name: 'Nondo', quantity: 2250 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 3000 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_display: {
        productionRate: 500,
        buildCost: [
            { name: 'Zege', quantity: 3000 }, 
            { name: 'Nondo', quantity: 2250 },
            { name: 'Mabati', quantity: 1650 },
            { name: 'Mbao', quantity: 1650 },
            { name: 'Matofali', quantity: 2700 },
            { name: 'Chuma', quantity: 1800 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_motherboard: {
        productionRate: 400,
        buildCost: [
            { name: 'Zege', quantity: 3750 }, 
            { name: 'Nondo', quantity: 3000 },
            { name: 'Mabati', quantity: 1950 },
            { name: 'Mbao', quantity: 1950 },
            { name: 'Matofali', quantity: 3300 },
            { name: 'Chuma', quantity: 2250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vifaa_vya_ndani: {
        productionRate: 1000,
        buildCost: [
            { name: 'Zege', quantity: 1500 }, 
            { name: 'Nondo', quantity: 1500 },
            { name: 'Mabati', quantity: 1200 },
            { name: 'Mbao', quantity: 1200 },
            { name: 'Matofali', quantity: 1800 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_usanidi: {
        productionRate: 800,
        buildCost: [
            { name: 'Zege', quantity: 2250 }, 
            { name: 'Nondo', quantity: 2250 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 2700 },
            { name: 'Chuma', quantity: 1500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Vehicle Chain
    kiwanda_cha_spare: {
        productionRate: 200,
        buildCost: [
            { name: 'Nondo', quantity: 3000 }, 
            { name: 'Zege', quantity: 1500 },
            { name: 'Mabati', quantity: 1800 },
            { name: 'Mbao', quantity: 1800 },
            { name: 'Matofali', quantity: 2700 },
            { name: 'Chuma', quantity: 2250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gari: {
        productionRate: 40,
        buildCost: [
            { name: 'Nondo', quantity: 7500 }, 
            { name: 'Zege', quantity: 4500 },
            { name: 'Mabati', quantity: 3000 },
            { name: 'Mbao', quantity: 3000 },
            { name: 'Matofali', quantity: 6000 },
            { name: 'Chuma', quantity: 4500 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_pikipiki: {
        productionRate: 100,
        buildCost: [
            { name: 'Nondo', quantity: 4500 }, 
            { name: 'Zege', quantity: 2250 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 3750 },
            { name: 'Chuma', quantity: 2250 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ndege: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 150000 }, 
            { name: 'Zege', quantity: 75000 },
            { name: 'Mabati', quantity: 60000 },
            { name: 'Mbao', quantity: 45000 },
            { name: 'Matofali', quantity: 120000 },
            { name: 'Chuma', quantity: 90000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_meli: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 225000 },
            { name: 'Zege', quantity: 120000 },
            { name: 'Mabati', quantity: 90000 },
            { name: 'Mbao', quantity: 75000 },
            { name: 'Matofali', quantity: 180000 },
            { name: 'Chuma', quantity: 135000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Space Chain
    kiwanda_cha_k_mashine: {
        productionRate: 10,
        buildCost: [
            { name: 'Nondo', quantity: 30000 }, 
            { name: 'Zege', quantity: 15000 },
            { name: 'Mabati', quantity: 12000 },
            { name: 'Mbao', quantity: 9000 },
            { name: 'Matofali', quantity: 22500 },
            { name: 'Chuma', quantity: 18000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_anga: {
        productionRate: 4,
        buildCost: [
            { name: 'Nondo', quantity: 750000 }, 
            { name: 'Zege', quantity: 375000 },
            { name: 'Mabati', quantity: 300000 },
            { name: 'Mbao', quantity: 225000 },
            { name: 'Matofali', quantity: 600000 },
            { name: 'Chuma', quantity: 450000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_roketi: {
        productionRate: 2,
        buildCost: [
            { name: 'Nondo', quantity: 1500000 }, 
            { name: 'Zege', quantity: 750000 },
            { name: 'Mabati', quantity: 600000 },
            { name: 'Mbao', quantity: 450000 },
            { name: 'Matofali', quantity: 1200000 },
            { name: 'Chuma', quantity: 900000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
};

    

    

    

    

    