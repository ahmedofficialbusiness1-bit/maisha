
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
            { name: 'Mabati', quantity: 10 },
            { name: 'Mbao', quantity: 20 },
            { name: 'Zege', quantity: 5 },
            { name: 'Nondo', quantity: 5 },
            { name: 'Matofali', quantity: 50 },
            { name: 'Chuma', quantity: 2 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    zizi: {
        productionRate: 30,
        buildCost: [
            { name: 'Mabati', quantity: 20 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Zege', quantity: 10 },
            { name: 'Nondo', quantity: 10 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Chuma', quantity: 5 },
            { name: 'Nyasi', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_samaki: {
        productionRate: 50, 
        buildCost: [
            { name: 'Mabati', quantity: 25 },
            { name: 'Mbao', quantity: 40 },
            { name: 'Zege', quantity: 20 },
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Chuma', quantity: 15 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chuma: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 150 },
            { name: 'Zege', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Chuma', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_matofali: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Zege', quantity: 50 },
            { name: 'Mabati', quantity: 40 },
            { name: 'Matofali', quantity: 20 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mbao: {
        productionRate: 90,
        buildCost: [
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Mabati', quantity: 30 },
            { name: 'Mbao', quantity: 10 },
            { name: 'Zege', quantity: 30 },
            { name: 'Chuma', quantity: 20 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_umeme: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 200 },
            { name: 'Zege', quantity: 150 },
            { name: 'Mabati', quantity: 120 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
     kiwanda_cha_maji: {
        productionRate: 500,
        buildCost: [
            { name: 'Nondo', quantity: 80 },
            { name: 'Matofali', quantity: 200 },
            { name: 'Zege', quantity: 50 },
            { name: 'Mabati', quantity: 60 },
            { name: 'Mbao', quantity: 40 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saruji: {
        productionRate: 70,
        buildCost: [
            { name: 'Nondo', quantity: 100 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Zege', quantity: 80 },
            { name: 'Mabati', quantity: 70 },
            { name: 'Mbao', quantity: 50 },
            { name: 'Chuma', quantity: 40 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_chuma: {
        productionRate: 40,
        buildCost: [
            { name: 'Mbao', quantity: 150 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Mabati', quantity: 40 },
            { name: 'Zege', quantity: 40 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Chuma', quantity: 10 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mawe: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
            { name: 'Mabati', quantity: 20 },
            { name: 'Zege', quantity: 20 },
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 80 },
            { name: 'Chuma', quantity: 15 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mchanga: {
        productionRate: 150,
        buildCost: [
            { name: 'Mbao', quantity: 100 },
            { name: 'Mabati', quantity: 20 },
            { name: 'Zege', quantity: 20 },
            { name: 'Nondo', quantity: 20 },
            { name: 'Matofali', quantity: 80 },
            { name: 'Chuma', quantity: 15 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_sukari: {
        productionRate: 60,
        buildCost: [
            { name: 'Matofali', quantity: 200 },
            { name: 'Nondo', quantity: 80 },
            { name: 'Zege', quantity: 100 },
            { name: 'Mabati', quantity: 70 },
            { name: 'Mbao', quantity: 60 },
            { name: 'Chuma', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    mgahawa: {
        productionRate: 25,
        buildCost: [
            { name: 'Matofali', quantity: 150 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Mabati', quantity: 40 },
            { name: 'Zege', quantity: 30 },
            { name: 'Nondo', quantity: 30 },
            { name: 'Chuma', quantity: 20 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_almasi: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 500 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 150 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Matofali', quantity: 400 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_dhahabu: {
        productionRate: 8,
        buildCost: [
            { name: 'Zege', quantity: 450 }, 
            { name: 'Nondo', quantity: 180 },
            { name: 'Mabati', quantity: 140 },
            { name: 'Mbao', quantity: 90 },
            { name: 'Matofali', quantity: 350 },
            { name: 'Chuma', quantity: 90 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_silver: {
        productionRate: 15,
        buildCost: [
            { name: 'Zege', quantity: 300 }, 
            { name: 'Nondo', quantity: 120 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 60 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_ruby: {
        productionRate: 10,
        buildCost: [
            { name: 'Zege', quantity: 400 }, 
            { name: 'Nondo', quantity: 150 },
            { name: 'Mabati', quantity: 120 },
            { name: 'Mbao', quantity: 90 },
            { name: 'Matofali', quantity: 300 },
            { name: 'Chuma', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_tanzanite: {
        productionRate: 12,
        buildCost: [
            { name: 'Zege', quantity: 350 }, 
            { name: 'Nondo', quantity: 140 },
            { name: 'Mabati', quantity: 110 },
            { name: 'Mbao', quantity: 85 },
            { name: 'Matofali', quantity: 280 },
            { name: 'Chuma', quantity: 70 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_shaba: {
        productionRate: 25,
        buildCost: [
            { name: 'Zege', quantity: 250 }, 
            { name: 'Nondo', quantity: 100 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 70 },
            { name: 'Matofali', quantity: 200 },
            { name: 'Chuma', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_mashine: {
        productionRate: 1, // Produces 1 machine per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 200 }, 
            { name: 'Nondo', quantity: 100 },
            { name: 'Mabati', quantity: 90 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 150 },
            { name: 'Chuma', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    ofisi_ya_leseni: {
        productionRate: 5, // Produces 5 licenses per hour at level 1
        buildCost: [
            { name: 'Matofali', quantity: 150 }, 
            { name: 'Mbao', quantity: 100 },
            { name: 'Mabati', quantity: 50 },
            { name: 'Zege', quantity: 40 },
            { name: 'Nondo', quantity: 40 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_karatasi: {
        productionRate: 100, // Produces 100 paper units per hour
        buildCost: [
            { name: 'Mbao', quantity: 100 }, 
            { name: 'Matofali', quantity: 50 },
            { name: 'Mabati', quantity: 60 },
            { name: 'Zege', quantity: 40 },
            { name: 'Nondo', quantity: 40 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    wizara_ya_madini: {
        productionRate: 2, // Produces 2 certificates per hour at level 1
        buildCost: [
            { name: 'Zege', quantity: 300 }, 
            { name: 'Nondo', quantity: 150 }, 
            { name: 'Mbao', quantity: 200 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vitambaa: {
        productionRate: 50,
        buildCost: [
            { name: 'Mbao', quantity: 100 }, 
            { name: 'Matofali', quantity: 100 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Zege', quantity: 50 },
            { name: 'Nondo', quantity: 50 },
            { name: 'Chuma', quantity: 40 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ngozi: {
        productionRate: 30,
        buildCost: [
            { name: 'Mbao', quantity: 120 }, 
            { name: 'Matofali', quantity: 80 },
            { name: 'Mabati', quantity: 70 },
            { name: 'Zege', quantity: 60 },
            { name: 'Nondo', quantity: 60 },
            { name: 'Chuma', quantity: 50 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_nguo: {
        productionRate: 20,
        buildCost: [
            { name: 'Matofali', quantity: 200 }, 
            { name: 'Nondo', quantity: 50 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Zege', quantity: 60 },
            { name: 'Chuma', quantity: 40 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_saa: {
        productionRate: 10,
        buildCost: [
            { name: 'Nondo', quantity: 100 }, 
            { name: 'Zege', quantity: 50 },
            { name: 'Mabati', quantity: 60 },
            { name: 'Mbao', quantity: 40 },
            { name: 'Matofali', quantity: 120 },
            { name: 'Chuma', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vioo: {
        productionRate: 40,
        buildCost: [
            { name: 'Matofali', quantity: 150 }, 
            { name: 'Zege', quantity: 100 },
            { name: 'Mabati', quantity: 90 },
            { name: 'Mbao', quantity: 70 },
            { name: 'Nondo', quantity: 80 },
            { name: 'Chuma', quantity: 60 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_chokaa: {
        productionRate: 60,
        buildCost: [
            { name: 'Mawe', quantity: 200 }, 
            { name: 'Mbao', quantity: 50 },
            { name: 'Mabati', quantity: 40 },
            { name: 'Zege', quantity: 30 },
            { name: 'Nondo', quantity: 30 },
            { name: 'Matofali', quantity: 100 },
            { name: 'Chuma', quantity: 20 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gundi: {
        productionRate: 80,
        buildCost: [
            { name: 'Mbao', quantity: 80 }, 
            { name: 'Matofali', quantity: 80 },
            { name: 'Mabati', quantity: 50 },
            { name: 'Zege', quantity: 40 },
            { name: 'Nondo', quantity: 40 },
            { name: 'Chuma', quantity: 30 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    sonara: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 300 }, 
            { name: 'Nondo', quantity: 100 },
            { name: 'Mabati', quantity: 120 },
            { name: 'Mbao', quantity: 150 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    uchimbaji_mafuta: {
        productionRate: 20,
        buildCost: [
            { name: 'Nondo', quantity: 300 }, 
            { name: 'Zege', quantity: 200 },
            { name: 'Mabati', quantity: 150 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_disel: {
        productionRate: 15,
        buildCost: [
            { name: 'Nondo', quantity: 250 }, 
            { name: 'Zege', quantity: 150 }, 
            { name: 'Matofali', quantity: 400 },
            { name: 'Mabati', quantity: 130 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Chuma', quantity: 120 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_petrol: {
        productionRate: 15,
        buildCost: [
            { name: 'Nondo', quantity: 250 }, 
            { name: 'Zege', quantity: 150 }, 
            { name: 'Matofali', quantity: 400 },
            { name: 'Mabati', quantity: 130 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Chuma', quantity: 120 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Electronics
    kiwanda_cha_tv: {
        productionRate: 5,
        buildCost: [
            { name: 'Zege', quantity: 100 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_tablet: {
        productionRate: 10,
        buildCost: [
            { name: 'Zege', quantity: 100 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_smartphone: {
        productionRate: 15,
        buildCost: [
            { name: 'Zege', quantity: 100 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_laptop: {
        productionRate: 8,
        buildCost: [
            { name: 'Zege', quantity: 100 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 150 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_processor: {
        productionRate: 20,
        buildCost: [
            { name: 'Zege', quantity: 300 }, 
            { name: 'Nondo', quantity: 300 },
            { name: 'Mabati', quantity: 150 },
            { name: 'Mbao', quantity: 150 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_betri: {
        productionRate: 30,
        buildCost: [
            { name: 'Zege', quantity: 150 }, 
            { name: 'Nondo', quantity: 150 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Matofali', quantity: 200 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_display: {
        productionRate: 25,
        buildCost: [
            { name: 'Zege', quantity: 200 }, 
            { name: 'Nondo', quantity: 150 },
            { name: 'Mabati', quantity: 110 },
            { name: 'Mbao', quantity: 110 },
            { name: 'Matofali', quantity: 180 },
            { name: 'Chuma', quantity: 120 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_motherboard: {
        productionRate: 20,
        buildCost: [
            { name: 'Zege', quantity: 250 }, 
            { name: 'Nondo', quantity: 200 },
            { name: 'Mabati', quantity: 130 },
            { name: 'Mbao', quantity: 130 },
            { name: 'Matofali', quantity: 220 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_vifaa_vya_ndani: {
        productionRate: 50,
        buildCost: [
            { name: 'Zege', quantity: 100 }, 
            { name: 'Nondo', quantity: 100 },
            { name: 'Mabati', quantity: 80 },
            { name: 'Mbao', quantity: 80 },
            { name: 'Matofali', quantity: 120 },
            { name: 'Chuma', quantity: 80 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_usanidi: {
        productionRate: 40,
        buildCost: [
            { name: 'Zege', quantity: 150 }, 
            { name: 'Nondo', quantity: 150 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Matofali', quantity: 180 },
            { name: 'Chuma', quantity: 100 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Vehicle Chain
    kiwanda_cha_spare: {
        productionRate: 10,
        buildCost: [
            { name: 'Nondo', quantity: 200 }, 
            { name: 'Zege', quantity: 100 },
            { name: 'Mabati', quantity: 120 },
            { name: 'Mbao', quantity: 120 },
            { name: 'Matofali', quantity: 180 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_gari: {
        productionRate: 2,
        buildCost: [
            { name: 'Nondo', quantity: 500 }, 
            { name: 'Zege', quantity: 300 },
            { name: 'Mabati', quantity: 200 },
            { name: 'Mbao', quantity: 200 },
            { name: 'Matofali', quantity: 400 },
            { name: 'Chuma', quantity: 300 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_pikipiki: {
        productionRate: 5,
        buildCost: [
            { name: 'Nondo', quantity: 300 }, 
            { name: 'Zege', quantity: 150 },
            { name: 'Mabati', quantity: 100 },
            { name: 'Mbao', quantity: 100 },
            { name: 'Matofali', quantity: 250 },
            { name: 'Chuma', quantity: 150 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_ndege: {
        productionRate: 1,
        buildCost: [
            { name: 'Nondo', quantity: 1000 }, 
            { name: 'Zege', quantity: 500 },
            { name: 'Mabati', quantity: 400 },
            { name: 'Mbao', quantity: 300 },
            { name: 'Matofali', quantity: 800 },
            { name: 'Chuma', quantity: 600 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_meli: {
        productionRate: 1,
        buildCost: [
            { name: 'Nondo', quantity: 1500 }, 
            { name: 'Zege', quantity: 800 },
            { name: 'Mabati', quantity: 600 },
            { name: 'Mbao', quantity: 500 },
            { name: 'Matofali', quantity: 1200 },
            { name: 'Chuma', quantity: 900 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    // Space Chain
    kiwanda_cha_k_mashine: {
        productionRate: 0.5,
        buildCost: [
            { name: 'Nondo', quantity: 2000 }, 
            { name: 'Zege', quantity: 1000 },
            { name: 'Mabati', quantity: 800 },
            { name: 'Mbao', quantity: 600 },
            { name: 'Matofali', quantity: 1500 },
            { name: 'Chuma', quantity: 1200 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_anga: {
        productionRate: 0.2,
        buildCost: [
            { name: 'Nondo', quantity: 5000 }, 
            { name: 'Zege', quantity: 2500 },
            { name: 'Mabati', quantity: 2000 },
            { name: 'Mbao', quantity: 1500 },
            { name: 'Matofali', quantity: 4000 },
            { name: 'Chuma', quantity: 3000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    kiwanda_cha_roketi: {
        productionRate: 0.1,
        buildCost: [
            { name: 'Nondo', quantity: 10000 }, 
            { name: 'Zege', quantity: 5000 },
            { name: 'Mabati', quantity: 4000 },
            { name: 'Mbao', quantity: 3000 },
            { name: 'Matofali', quantity: 8000 },
            { name: 'Chuma', quantity: 6000 },
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
};

    
