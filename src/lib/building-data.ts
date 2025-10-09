
      
export type BuildingConfig = {
    productionRate: number; // units per hour at level 1
    saleRateMultiplier?: number; // How much faster this building sells items compared to production rate
    buildCost: { name: string; quantity: number }[];
    upgradeCost: (level: number) => { name: string; quantity: number }[];
};

export const sectors = [
    'Kilimo', // Agriculture
    'Ujenzi', // Construction
    'Madini', // Mining
    'Nishati', // Energy
    'Mavazi na Vito', // Apparel & Jewelry
    'Electroniki', // Electronics
    'Usafiri', // Transportation
    'Anga', // Aerospace
    'Utafiti', // Research
];

export const buildingToSectorMap: Record<string, string> = {
    'duka_kuu': 'Kilimo',
    'duka_la_ujenzi': 'Ujenzi',
    'duka_la_nguo_na_vito': 'Mavazi na Vito',
    'duka_la_electroniki': 'Electroniki',
    'duka_la_magari': 'Usafiri',
    'duka_la_anga': 'Anga',
    'shamba': 'Kilimo',
    'zizi': 'Kilimo',
    'kiwanda_cha_samaki': 'Kilimo',
    'uchimbaji_mawe': 'Ujenzi',
    'uchimbaji_mchanga': 'Ujenzi',
    'uchimbaji_chuma': 'Madini',
    'uchimbaji_almasi': 'Madini',
    'uchimbaji_dhahabu': 'Madini',
    'uchimbaji_silver': 'Madini',
    'uchimbaji_ruby': 'Madini',
    'uchimbaji_tanzanite': 'Madini',
    'uchimbaji_shaba': 'Madini',
    'kiwanda_cha_umeme': 'Nishati',
    'kiwanda_cha_maji': 'Nishati',
    'kiwanda_cha_mbao': 'Ujenzi',
    'kiwanda_cha_saruji': 'Ujenzi',
    'kiwanda_cha_matofali': 'Ujenzi',
    'kiwanda_cha_chuma': 'Ujenzi',
    'kiwanda_cha_sukari': 'Kilimo',
    'mgahawa': 'Kilimo',
    'kiwanda_cha_mashine': 'Ujenzi',
    'ofisi_ya_leseni': 'Utafiti',
    'kiwanda_cha_karatasi': 'Ujenzi',
    'wizara_ya_madini': 'Utafiti',
    'kiwanda_cha_vitambaa': 'Mavazi na Vito',
    'kiwanda_cha_ngozi': 'Mavazi na Vito',
    'kiwanda_cha_nguo': 'Mavazi na Vito',
    'kiwanda_cha_saa': 'Mavazi na Vito',
    'kiwanda_cha_vioo': 'Ujenzi',
    'kiwanda_cha_chokaa': 'Ujenzi',
    'kiwanda_cha_gundi': 'Ujenzi',
    'sonara': 'Mavazi na Vito',
    'uchimbaji_mafuta': 'Nishati',
    'kiwanda_cha_disel': 'Nishati',
    'kiwanda_cha_petrol': 'Nishati',
    'kiwanda_cha_tv': 'Electroniki',
    'kiwanda_cha_tablet': 'Electroniki',
    'kiwanda_cha_smartphone': 'Electroniki',
    'kiwanda_cha_laptop': 'Electroniki',
    'kiwanda_cha_processor': 'Electroniki',
    'kiwanda_cha_betri': 'Electroniki',
    'kiwanda_cha_display': 'Electroniki',
    'kiwanda_cha_motherboard': 'Electroniki',
    'kiwanda_cha_vifaa_vya_ndani': 'Electroniki',
    'kiwanda_cha_usanidi': 'Electroniki',
    'kiwanda_cha_spare': 'Usafiri',
    'kiwanda_cha_gari': 'Usafiri',
    'kiwanda_cha_pikipiki': 'Usafiri',
    'kiwanda_cha_ndege': 'Anga',
    'kiwanda_cha_meli': 'Usafiri',
    'kiwanda_cha_k_mashine': 'Anga',
    'kiwanda_cha_anga': 'Anga',
    'kiwanda_cha_roketi': 'Anga',
    'utafiti_kilimo': 'Utafiti',
    'utafiti_ujenzi': 'Utafiti',
    'utafiti_nguo': 'Utafiti',
    'utafiti_electroniki': 'Utafiti',
    'utafiti_usafiri': 'Utafiti',
    'utafiti_anga': 'Utafiti',
};


const calculateUpgradeCost = (baseCost: { name: string; quantity: number }[], level: number) => {
    return baseCost.map(cost => ({
        ...cost,
        quantity: Math.floor(cost.quantity * Math.pow(1.8, level - 1)) // Increased multiplier for steeper upgrade costs
    }));
};

// Define build costs separately for reusability.
const DUKA_KUU_BUILD_COST = [
    { name: 'Mbao', quantity: 500 },
    { name: 'Matofali', quantity: 1000 },
    { name: 'Zege', quantity: 200 },
    { name: 'Mabati', quantity: 150 },
    { name: 'Nondo', quantity: 100 },
    { name: 'Chuma', quantity: 50 },
];
const DUKA_LA_UJENZI_BUILD_COST = [
    { name: 'Nondo', quantity: 500 },
    { name: 'Saruji', quantity: 500 },
    { name: 'Zege', quantity: 400 },
    { name: 'Mabati', quantity: 200 },
    { name: 'Matofali', quantity: 800 },
    { name: 'Chuma', quantity: 250 },
];
const DUKA_LA_NGUO_BUILD_COST = [
    { name: 'Mbao', quantity: 400 },
    { name: 'Kioo', quantity: 200 },
    { name: 'Zege', quantity: 150 },
    { name: 'Mabati', quantity: 100 },
    { name: 'Nondo', quantity: 50 },
    { name: 'Matofali', quantity: 300 },
    { name: 'Chuma', quantity: 50 },
];
const DUKA_LA_ELECTRONIKI_BUILD_COST = [
    { name: 'Chuma', quantity: 300 },
    { name: 'Kioo', quantity: 300 },
    { name: 'Nondo', quantity: 150 },
    { name: 'Mabati', quantity: 150 },
    { name: 'Zege', quantity: 200 },
    { name: 'Matofali', quantity: 400 },
];
const DUKA_LA_MAGARI_BUILD_COST = [
    { name: 'Nondo', quantity: 800 },
    { name: 'Chuma', quantity: 500 },
    { name: 'Zege', quantity: 600 },
    { name: 'Mabati', quantity: 400 },
    { name: 'Matofali', quantity: 1200 },
    { name: 'Kioo', quantity: 300 },
];
const DUKA_LA_ANGA_BUILD_COST = [
    { name: 'Nondo', quantity: 2000 },
    { name: 'Chuma', quantity: 1500 },
    { name: 'Zege', quantity: 1000 },
    { name: 'Mabati', quantity: 800 },
    { name: 'Matofali', quantity: 2500 },
    { name: 'Kioo', quantity: 1000 },
];
const SHAMBA_BUILD_COST = [
    { name: 'Mabati', quantity: 150 },
    { name: 'Mbao', quantity: 450 },
    { name: 'Zege', quantity: 75 },
    { name: 'Nondo', quantity: 60 },
    { name: 'Matofali', quantity: 750 },
    { name: 'Chuma', quantity: 30 },
];
// ... Add other build cost constants here following the pattern.

export const buildingData: Record<string, BuildingConfig> = {
    duka_kuu: {
        productionRate: 0, // Shops don't produce
        saleRateMultiplier: 3,
        buildCost: DUKA_KUU_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_KUU_BUILD_COST, level)
    },
    duka_la_ujenzi: {
        productionRate: 0,
        saleRateMultiplier: 3,
        buildCost: DUKA_LA_UJENZI_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_LA_UJENZI_BUILD_COST, level)
    },
    duka_la_nguo_na_vito: {
        productionRate: 0,
        saleRateMultiplier: 3,
        buildCost: DUKA_LA_NGUO_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_LA_NGUO_BUILD_COST, level)
    },
    duka_la_electroniki: {
        productionRate: 0,
        saleRateMultiplier: 3,
        buildCost: DUKA_LA_ELECTRONIKI_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_LA_ELECTRONIKI_BUILD_COST, level)
    },
    duka_la_magari: {
        productionRate: 0,
        saleRateMultiplier: 3,
        buildCost: DUKA_LA_MAGARI_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_LA_MAGARI_BUILD_COST, level)
    },
    duka_la_anga: {
        productionRate: 0,
        saleRateMultiplier: 3,
        buildCost: DUKA_LA_ANGA_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(DUKA_LA_ANGA_BUILD_COST, level)
    },
    shamba: {
        productionRate: 300,
        buildCost: SHAMBA_BUILD_COST,
        upgradeCost: (level) => calculateUpgradeCost(SHAMBA_BUILD_COST, level)
    },
    zizi: {
        productionRate: 90,
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
        productionRate: 150, 
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
        productionRate: 60,
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
        productionRate: 240,
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
        productionRate: 270,
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
        productionRate: 1500,
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
        productionRate: 1500,
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
        productionRate: 210,
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
        productionRate: 120,
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
        productionRate: 450,
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
        productionRate: 450,
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
        productionRate: 180,
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
        productionRate: 75,
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
        productionRate: 15,
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
        productionRate: 24,
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
        productionRate: 45,
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
        productionRate: 30,
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
        productionRate: 36,
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
        productionRate: 75,
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
        productionRate: 3, // Produces 3 machine per hour at level 1
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
        productionRate: 15, // Produces 15 licenses per hour at level 1
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
        productionRate: 300, // Produces 300 paper units per hour
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
        productionRate: 6, // Produces 6 certificates per hour at level 1
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
        productionRate: 150,
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
        productionRate: 90,
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
        productionRate: 60,
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
        productionRate: 30,
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
        productionRate: 120,
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
        productionRate: 180,
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
        productionRate: 240,
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
        productionRate: 15,
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
        productionRate: 60,
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
        productionRate: 45,
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
        productionRate: 45,
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
        productionRate: 15,
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
        productionRate: 30,
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
        productionRate: 45,
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
        productionRate: 24,
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
        productionRate: 60,
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
        productionRate: 90,
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
        productionRate: 75,
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
        productionRate: 60,
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
        productionRate: 150,
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
        productionRate: 120,
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
        productionRate: 30,
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
        productionRate: 6,
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
        productionRate: 15,
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
        productionRate: 3,
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
        productionRate: 3,
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
        productionRate: 1.5,
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
        productionRate: 0.6,
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
        productionRate: 0.3,
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
    // Research Buildings
    utafiti_kilimo: {
        productionRate: 3, // 3 research point per hour
        buildCost: [
            { name: 'Mbao', quantity: 1000 }, 
            { name: 'Matofali', quantity: 1000 },
            { name: 'Nondo', quantity: 1000 },
            { name: 'Zege', quantity: 1000 },
            { name: 'Mabati', quantity: 1000 },
            { name: 'Chuma', quantity: 1000 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    utafiti_ujenzi: {
        productionRate: 3,
        buildCost: [
            { name: 'Mbao', quantity: 1500 }, 
            { name: 'Matofali', quantity: 1500 },
            { name: 'Nondo', quantity: 1500 },
            { name: 'Zege', quantity: 1500 },
            { name: 'Mabati', quantity: 1500 },
            { name: 'Chuma', quantity: 1500 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    utafiti_nguo: {
        productionRate: 3,
        buildCost: [
            { name: 'Mbao', quantity: 2000 }, 
            { name: 'Matofali', quantity: 2000 },
            { name: 'Nondo', quantity: 2000 },
            { name: 'Zege', quantity: 2000 },
            { name: 'Mabati', quantity: 2000 },
            { name: 'Chuma', quantity: 2000 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    utafiti_electroniki: {
        productionRate: 3,
        buildCost: [
            { name: 'Mbao', quantity: 5000 }, 
            { name: 'Matofali', quantity: 5000 },
            { name: 'Nondo', quantity: 5000 },
            { name: 'Zege', quantity: 5000 },
            { name: 'Mabati', quantity: 5000 },
            { name: 'Chuma', quantity: 5000 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    utafiti_usafiri: {
        productionRate: 3,
        buildCost: [
            { name: 'Mbao', quantity: 10000 }, 
            { name: 'Matofali', quantity: 10000 },
            { name: 'Nondo', quantity: 10000 },
            { name: 'Zege', quantity: 10000 },
            { name: 'Mabati', quantity: 10000 },
            { name: 'Chuma', quantity: 10000 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
    utafiti_anga: {
        productionRate: 3,
        buildCost: [
            { name: 'Mbao', quantity: 50000 }, 
            { name: 'Matofali', quantity: 50000 },
            { name: 'Nondo', quantity: 50000 },
            { name: 'Zege', quantity: 50000 },
            { name: 'Mabati', quantity: 50000 },
            { name: 'Chuma', quantity: 50000 }
        ],
        upgradeCost: function(level) { return calculateUpgradeCost(this.buildCost, level)}
    },
};

    
