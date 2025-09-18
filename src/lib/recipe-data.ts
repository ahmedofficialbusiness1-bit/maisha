
import type { WorkerSpecialty } from './worker-data';

export type Recipe = {
  id: string;
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
  cost: number;
  requiredWorkers: { specialty: WorkerSpecialty; count: number }[];
};

const machineRecipeInputs = [
    { name: 'Chuma', quantity: 10 },
    { name: 'Nondo', quantity: 5 },
    { name: 'Mabati', quantity: 5 },
    { name: 'Saruji', quantity: 10 },
    { name: 'Matofali', quantity: 20 },
    { name: 'Maji', quantity: 10 },
    { name: 'Umeme', quantity: 10 },
    { name: 'Mbao', quantity: 10 },
];

const machineRecipeWorkers = [
    { specialty: 'Uzalishaji' as WorkerSpecialty, count: 5 },
    { specialty: 'Usimamizi' as WorkerSpecialty, count: 2 },
];

const licenseRecipeInputs = [
    { name: 'Karatasi', quantity: 100 },
    { name: 'Cheti cha Madini', quantity: 1 },
];

const licenseRecipeWorkers = [
    { specialty: 'Usimamizi' as WorkerSpecialty, count: 1 },
];

export const recipes: Recipe[] = [
  // Shamba Recipes
  { id: 'mbegu', buildingId: 'shamba', output: { name: 'Mbegu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }], cost: 5, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'maharage', buildingId: 'shamba', output: { name: 'Maharage', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'mchele', buildingId: 'shamba', output: { name: 'Mchele', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'unga_wa_ngano', buildingId: 'shamba', output: { name: 'Unga wa ngano', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'unga_wa_sembe', buildingId: 'shamba', output: { name: 'Unga wa sembe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'ndizi', buildingId: 'shamba', output: { name: 'Ndizi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'viazi_mbatata', buildingId: 'shamba', output: { name: 'Viazi mbatata', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'mboga_mboga', buildingId: 'shamba', output: { name: 'Mboga mboga', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'embe', buildingId: 'shamba', output: { name: 'Embe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'nanasi', buildingId: 'shamba', output: { name: 'Nanasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'parachichi', buildingId: 'shamba', output: { name: 'Parachichi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 35, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'miwa', buildingId: 'shamba', output: { name: 'Miwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'nyasi', buildingId: 'shamba', output: { name: 'Nyasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'mbolea', buildingId: 'shamba', output: { name: 'Mbolea', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'zabibu', buildingId: 'shamba', output: { name: 'Zabibu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'apple', buildingId: 'shamba', output: { name: 'Apple', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'chungwa', buildingId: 'shamba', output: { name: 'Chungwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'korosho', buildingId: 'shamba', output: { name: 'Korosho', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'karafuu', buildingId: 'shamba', output: { name: 'Karafuu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 50, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'pamba', buildingId: 'shamba', output: { name: 'Pamba', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'katani', buildingId: 'shamba', output: { name: 'Katani', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'miti', buildingId: 'shamba', output: { name: 'Miti', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  
  // Zizi Recipes
  { id: 'yai', buildingId: 'zizi', output: { name: 'Yai', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 1 }], cost: 30, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },
  { id: 'kuku', buildingId: 'zizi', output: { name: 'Kuku', quantity: 1 }, inputs: [{ name: 'Yai', quantity: 1 }, { name: 'Nyasi', quantity: 1 }], cost: 50, requiredWorkers: [{ specialty: 'Kilimo', count: 2 }] },
  { id: 'ngombe', buildingId: 'zizi', output: { name: 'Ngombe', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 5 }, { name: 'Mbolea', quantity: 2 }], cost: 100, requiredWorkers: [{ specialty: 'Kilimo', count: 2 }] },
  { id: 'nyama', buildingId: 'zizi', output: { name: 'Nyama', quantity: 1 }, inputs: [{ name: 'Ngombe', quantity: 1 }], cost: 50, requiredWorkers: [{ specialty: 'Kilimo', count: 1 }] },

  // Kiwanda cha Sukari Recipes
  { id: 'sukari', buildingId: 'kiwanda_cha_sukari', output: { name: 'Sukari', quantity: 1 }, inputs: [{ name: 'Miwa', quantity: 1 }], cost: 80, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },

  // Mgahawa Recipes
  { id: 'juice', buildingId: 'mgahawa', output: { name: 'Juice', quantity: 1 }, inputs: [{ name: 'Embe', quantity: 1 }, { name: 'Nanasi', quantity: 1 }, { name: 'Parachichi', quantity: 1 }], cost: 150, requiredWorkers: [{ specialty: 'Usimamizi', count: 1 }] },
  
  // Kiwanda cha Samaki Recipes
  { id: 'bwawa', buildingId: 'kiwanda_cha_samaki', output: { name: 'Bwawa', quantity: 1 }, inputs: [], cost: 100, requiredWorkers: [{ specialty: 'Uvuvi', count: 1 }] },
  { id: 'boat', buildingId: 'kiwanda_cha_samaki', output: { name: 'Boat', quantity: 1 }, inputs: [], cost: 200, requiredWorkers: [{ specialty: 'Uvuvi', count: 2 }] },
  { id: 'samaki', buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki', quantity: 1 }, inputs: [{ name: 'Bwawa', quantity: 1 }, { name: 'Boat', quantity: 1 }], cost: 300, requiredWorkers: [{ specialty: 'Uvuvi', count: 1 }] },
  { id: 'chumvi', buildingId: 'kiwanda_cha_samaki', output: { name: 'Chumvi', quantity: 1 }, inputs: [], cost: 50, requiredWorkers: [{ specialty: 'Uvuvi', count: 1 }] },

  // Ujenzi & Uchimbaji Recipes
  { id: 'umeme', buildingId: 'kiwanda_cha_umeme', output: { name: 'Umeme', quantity: 1 }, inputs: [{ name: 'Mashine C1', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 10, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'maji', buildingId: 'kiwanda_cha_maji', output: { name: 'Maji', quantity: 1 }, inputs: [{ name: 'Mashine C2', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 5, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'mawe', buildingId: 'uchimbaji_mawe', output: { name: 'Mawe', quantity: 1 }, inputs: [], cost: 15, requiredWorkers: [{ specialty: 'Uchimbaji', count: 1 }] },
  { id: 'kokoto', buildingId: 'uchimbaji_mawe', output: { name: 'Kokoto', quantity: 1 }, inputs: [{ name: 'Mawe', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'mbao', buildingId: 'kiwanda_cha_mbao', output: { name: 'Mbao', quantity: 1 }, inputs: [{ name: 'Mashine A2', quantity: 1 }, { name: 'Miti', quantity: 2 }], cost: 60, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'mchanga', buildingId: 'uchimbaji_mchanga', output: { name: 'Mchanga', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Uchimbaji', count: 1 }] },
  { id: 'chuma', buildingId: 'uchimbaji_chuma', output: { name: 'Chuma', quantity: 1 }, inputs: [{ name: 'Mashine B7', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Leseni B7', quantity: 1 }], cost: 150, requiredWorkers: [{ specialty: 'Uchimbaji', count: 2 }] },
  { id: 'nondo', buildingId: 'kiwanda_cha_chuma', output: { name: 'Nondo', quantity: 1 }, inputs: [{ name: 'Mashine A4', quantity: 1 }, { name: 'Chuma', quantity: 2 }, { name: 'Umeme', quantity: 1 }], cost: 350, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'saruji', buildingId: 'kiwanda_cha_saruji', output: { name: 'Saruji', quantity: 1 }, inputs: [{ name: 'Mchanga', quantity: 2 }, { name: 'Maji', quantity: 1 }], cost: 80, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'matofali', buildingId: 'kiwanda_cha_matofali', output: { name: 'Matofali', quantity: 1 }, inputs: [{ name: 'Mashine A1', quantity: 1 }, { name: 'Saruji', quantity: 1 }, { name: 'Mchanga', quantity: 2 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 120, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'zege', buildingId: 'kiwanda_cha_matofali', output: { name: 'Zege', quantity: 1 }, inputs: [{ name: 'Mashine A3', quantity: 1 }, { name: 'Saruji', quantity: 2 }, { name: 'Maji', quantity: 2 }, { name: 'Kokoto', quantity: 3 }, { name: 'Umeme', quantity: 1 }], cost: 250, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'mabati', buildingId: 'kiwanda_cha_chuma', output: { name: 'Mabati', quantity: 1}, inputs: [{ name: 'Mashine A5', quantity: 1 }, { name: 'Shaba', quantity: 2 }], cost: 400, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2}]},

  // Madini Recipes
  { id: 'almasi', buildingId: 'uchimbaji_almasi', output: { name: 'Almasi', quantity: 1 }, inputs: [{ name: 'Mashine B1', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B1', quantity: 1}], cost: 5000, requiredWorkers: [{ specialty: 'Uchimbaji', count: 5}] },
  { id: 'dhahabu', buildingId: 'uchimbaji_dhahabu', output: { name: 'Dhahabu', quantity: 1 }, inputs: [{ name: 'Mashine B2', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B2', quantity: 1}], cost: 4000, requiredWorkers: [{ specialty: 'Uchimbaji', count: 4}] },
  { id: 'silver', buildingId: 'uchimbaji_silver', output: { name: 'Silver', quantity: 1 }, inputs: [{ name: 'Mashine B5', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B5', quantity: 1}], cost: 2000, requiredWorkers: [{ specialty: 'Uchimbaji', count: 3}] },
  { id: 'ruby', buildingId: 'uchimbaji_ruby', output: { name: 'Ruby', quantity: 1 }, inputs: [{ name: 'Mashine B3', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B3', quantity: 1}], cost: 3500, requiredWorkers: [{ specialty: 'Uchimbaji', count: 4}] },
  { id: 'tanzanite', buildingId: 'uchimbaji_tanzanite', output: { name: 'Tanzanite', quantity: 1 }, inputs: [{ name: 'Mashine B4', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B4', quantity: 1}], cost: 4500, requiredWorkers: [{ specialty: 'Uchimbaji', count: 5}] },
  { id: 'shaba', buildingId: 'uchimbaji_shaba', output: { name: 'Shaba', quantity: 1 }, inputs: [{ name: 'Mashine B6', quantity: 1}, { name: 'Maji', quantity: 1}, { name: 'Umeme', quantity: 1}, { name: 'Leseni B6', quantity: 1}], cost: 1000, requiredWorkers: [{ specialty: 'Uchimbaji', count: 2}] },

  // Mafuta Recipes
  { id: 'mafuta_ghafi', buildingId: 'uchimbaji_mafuta', output: { name: 'Mafuta Ghafi', quantity: 1 }, inputs: [{ name: 'Mashine A1', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 800, requiredWorkers: [{ specialty: 'Uchimbaji', count: 3 }] },
  { id: 'disel', buildingId: 'kiwanda_cha_disel', output: { name: 'Disel', quantity: 1 }, inputs: [{ name: 'Mashine A2', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Mafuta Ghafi', quantity: 1 }], cost: 1200, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'petrol', buildingId: 'kiwanda_cha_petrol', output: { name: 'Petrol', quantity: 1 }, inputs: [{ name: 'Mashine A3', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Mafuta Ghafi', quantity: 1 }], cost: 1500, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },

  // Kiwanda cha Karatasi
  { id: 'karatasi', buildingId: 'kiwanda_cha_karatasi', output: { name: 'Karatasi', quantity: 10 }, inputs: [{ name: 'Mbao', quantity: 2 }, { name: 'Maji', quantity: 5 }, { name: 'Umeme', quantity: 2 }], cost: 100, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },

  // Kiwanda cha Mashine
  ...['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'C1', 'C2'].map(m => ({
    id: `mashine_${m.toLowerCase()}`,
    buildingId: 'kiwanda_cha_mashine',
    output: { name: `Mashine ${m}`, quantity: 1 },
    inputs: machineRecipeInputs,
    cost: 5000,
    requiredWorkers: machineRecipeWorkers,
  })),

  // Ofisi ya Leseni
  ...['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].map(l => ({
    id: `leseni_${l.toLowerCase()}`,
    buildingId: 'ofisi_ya_leseni',
    output: { name: `Leseni ${l}`, quantity: 1 },
    inputs: licenseRecipeInputs,
    cost: 10000,
    requiredWorkers: licenseRecipeWorkers,
  })),

  // Wizara ya Madini
  {
    id: 'cheti_cha_madini',
    buildingId: 'wizara_ya_madini',
    output: { name: 'Cheti cha Madini', quantity: 1 },
    inputs: [{ name: 'Karatasi', quantity: 10 }],
    cost: 50000,
    requiredWorkers: [{ specialty: 'Usimamizi', count: 1 }],
  },

  // Mavazi & Nguo Chain
  { id: 'gundi', buildingId: 'kiwanda_cha_gundi', output: { name: 'Gundi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 50, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'chokaa', buildingId: 'kiwanda_cha_chokaa', output: { name: 'Chokaa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 60, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'kioo', buildingId: 'kiwanda_cha_vioo', output: { name: 'Kioo', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Chokaa', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Gundi', quantity: 1 }], cost: 200, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'kitamba', buildingId: 'kiwanda_cha_vitambaa', output: { name: 'Kitamba', quantity: 1 }, inputs: [{ name: 'Katani', quantity: 1 }, { name: 'Pamba', quantity: 1 }], cost: 150, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'ngozi', buildingId: 'kiwanda_cha_ngozi', output: { name: 'Ngozi', quantity: 1 }, inputs: [{ name: 'Ngombe', quantity: 1 }], cost: 120, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'soli', buildingId: 'kiwanda_cha_saa', output: { name: 'Soli', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 1 }, { name: 'Mbao', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 300, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'saa', buildingId: 'kiwanda_cha_saa', output: { name: 'Saa', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 1 }, { name: 'Kioo', quantity: 1 }], cost: 1000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'viatu', buildingId: 'kiwanda_cha_nguo', output: { name: 'Viatu', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 1 }, { name: 'Soli', quantity: 1 }], cost: 500, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'pochi', buildingId: 'kiwanda_cha_nguo', output: { name: 'Pochi', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 1 }, { name: 'Soli', quantity: 1 }], cost: 400, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 't-shirt', buildingId: 'kiwanda_cha_nguo', output: { name: 'T-Shirt', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 250, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'jeans', buildingId: 'kiwanda_cha_nguo', output: { name: 'Jeans', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 350, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'skirt', buildingId: 'kiwanda_cha_nguo', output: { name: 'Skirt', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 300, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'kijora', buildingId: 'kiwanda_cha_nguo', output: { name: 'Kijora', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 450, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },

  // Sonara (Vito) Recipes
  { id: 'mkufu_wa_dhahabu', buildingId: 'sonara', output: { name: 'Mkufu wa Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 5 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B2', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 25000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'saa_ya_dhahabu', buildingId: 'sonara', output: { name: 'Saa ya Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 3 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B2', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 20000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'pete_ya_dhahabu', buildingId: 'sonara', output: { name: 'Pete ya Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 2 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B2', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 15000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'mkufu_wa_almasi', buildingId: 'sonara', output: { name: 'Mkufu wa Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 5 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B1', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 30000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'saa_ya_almasi', buildingId: 'sonara', output: { name: 'Saa ya Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 3 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B1', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 28000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },
  { id: 'pete_ya_almasi', buildingId: 'sonara', output: { name: 'Pete ya Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 2 }, { name: 'Chuma', quantity: 1 }, { name: 'Mashine B1', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 22000, requiredWorkers: [{ specialty: 'Uzalishaji', count: 3 }] },

  // Electronics Chain
  // Tier 1: Sub-components (mostly from kiwanda_cha_usanidi)
  { id: 'housing', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Housing', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 100, requiredWorkers: [] },
  { id: 'nyaya', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Nyaya', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 50, requiredWorkers: [] },
  { id: 'lcd', buildingId: 'kiwanda_cha_usanidi', output: { name: 'LCD', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 200, requiredWorkers: [] },
  { id: 'cathode', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Cathode', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 80, requiredWorkers: [] },
  { id: 'anode', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Anode', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 80, requiredWorkers: [] },
  { id: 'ram', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Ram', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 150, requiredWorkers: [] },
  { id: 'rom', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Rom', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 120, requiredWorkers: [] },
  { id: 'pcb', buildingId: 'kiwanda_cha_usanidi', output: { name: 'PCB', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 180, requiredWorkers: [] },
  { id: 'vifaa_vya_ndani', buildingId: 'kiwanda_cha_vifaa_vya_ndani', output: { name: 'Vifaa vya ndani', quantity: 10 }, inputs: [], cost: 500, requiredWorkers: [] },

  // Tier 2: Components (from their respective factories)
  { id: 'processor', buildingId: 'kiwanda_cha_processor', output: { name: 'Processor', quantity: 1 }, inputs: [], cost: 1000, requiredWorkers: [] }, // Simplified for now
  { id: 'betri', buildingId: 'kiwanda_cha_betri', output: { name: 'Betri', quantity: 1 }, inputs: [{ name: 'Housing', quantity: 1 }, { name: 'Nyaya', quantity: 1 }, { name: 'Cathode', quantity: 1 }, { name: 'Anode', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 500, requiredWorkers: [] },
  { id: 'display', buildingId: 'kiwanda_cha_display', output: { name: 'Display', quantity: 1 }, inputs: [{ name: 'Nyaya', quantity: 1 }, { name: 'LCD', quantity: 1 }, { name: 'Processor', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 800, requiredWorkers: [] },
  { id: 'motherboard', buildingId: 'kiwanda_cha_motherboard', output: { name: 'Motherboard', quantity: 1 }, inputs: [{ name: 'Processor', quantity: 1 }, { name: 'Ram', quantity: 1 }, { name: 'Rom', quantity: 1 }, { name: 'Housing', quantity: 1 }, { name: 'PCB', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 1500, requiredWorkers: [] },

  // Tier 3: Final Products (Assembly factories)
  { id: 'tv', buildingId: 'kiwanda_cha_tv', output: { name: 'TV', quantity: 1 }, inputs: [{ name: 'Display', quantity: 1 }, { name: 'Processor', quantity: 1 }, { name: 'Betri', quantity: 1 }, { name: 'Motherboard', quantity: 1 }, { name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Chuma', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 5000, requiredWorkers: [] },
  { id: 'tablet', buildingId: 'kiwanda_cha_tablet', output: { name: 'Tablet', quantity: 1 }, inputs: [{ name: 'Display', quantity: 1 }, { name: 'Processor', quantity: 1 }, { name: 'Betri', quantity: 1 }, { name: 'Motherboard', quantity: 1 }, { name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Chuma', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 4000, requiredWorkers: [] },
  { id: 'smartphone', buildingId: 'kiwanda_cha_smartphone', output: { name: 'Smartphone', quantity: 1 }, inputs: [{ name: 'Display', quantity: 1 }, { name: 'Processor', quantity: 1 }, { name: 'Betri', quantity: 1 }, { name: 'Motherboard', quantity: 1 }, { name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Chuma', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 3000, requiredWorkers: [] },
  { id: 'laptop', buildingId: 'kiwanda_cha_laptop', output: { name: 'Laptop', quantity: 1 }, inputs: [{ name: 'Display', quantity: 1 }, { name: 'Processor', quantity: 1 }, { name: 'Betri', quantity: 1 }, { name: 'Motherboard', quantity: 1 }, { name: 'Vifaa vya ndani', quantity: 1 }, { name: 'Chuma', quantity: 1 }, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 6000, requiredWorkers: [] },

  // Vehicle Chain - Spares (kiwanda_cha_spare)
  { id: 'car_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Car Body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 10 }, { name: 'Maji', quantity: 5 }, { name: 'Umeme', quantity: 5 }, { name: 'Mbao', quantity: 2 }], cost: 2000, requiredWorkers: [] },
  { id: 'bike_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Bike Body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 5 }, { name: 'Maji', quantity: 2 }, { name: 'Umeme', quantity: 2 }, { name: 'Mbao', quantity: 1 }], cost: 1000, requiredWorkers: [] },
  { id: 'interior', buildingId: 'kiwanda_cha_spare', output: { name: 'Interior', quantity: 1 }, inputs: [{ name: 'Katani', quantity: 5 }, { name: 'Pamba', quantity: 5 }, { name: 'Mbao', quantity: 10 }, { name: 'Silver', quantity: 1 }, { name: 'Shaba', quantity: 2 }, { name: 'Umeme', quantity: 3 }], cost: 5000, requiredWorkers: [] },
  { id: 'luxury_interior', buildingId: 'kiwanda_cha_spare', output: { name: 'Luxury Interior', quantity: 1 }, inputs: [{ name: 'Katani', quantity: 10 }, { name: 'Pamba', quantity: 10 }, { name: 'Mbao', quantity: 15 }, { name: 'Silver', quantity: 3 }, { name: 'Shaba', quantity: 5 }, { name: 'Umeme', quantity: 5 }, { name: 'Tanzanite', quantity: 1 }], cost: 15000, requiredWorkers: [] },
  { id: 'motor', buildingId: 'kiwanda_cha_spare', output: { name: 'Motor', quantity: 1 }, inputs: [{ name: 'Betri', quantity: 2 }, { name: 'Nyaya', quantity: 10 }, { name: 'Kioo', quantity: 1 }, { name: 'Chuma', quantity: 5 }, { name: 'Umeme', quantity: 5 }, { name: 'Shaba', quantity: 3 }], cost: 8000, requiredWorkers: [] },
  { id: 'engine', buildingId: 'kiwanda_cha_spare', output: { name: 'Engine', quantity: 1 }, inputs: [{ name: 'Betri', quantity: 4 }, { name: 'Nyaya', quantity: 15 }, { name: 'Kioo', quantity: 2 }, { name: 'Chuma', quantity: 10 }, { name: 'Umeme', quantity: 10 }, { name: 'Shaba', quantity: 5 }, { name: 'Motherboard', quantity: 1 }], cost: 12000, requiredWorkers: [] },
  { id: 'dashboard', buildingId: 'kiwanda_cha_spare', output: { name: 'Dashboard', quantity: 1 }, inputs: [{ name: 'Betri', quantity: 1 }, { name: 'Nyaya', quantity: 20 }, { name: 'Kioo', quantity: 3 }, { name: 'Chuma', quantity: 2 }, { name: 'Umeme', quantity: 8 }, { name: 'Shaba', quantity: 2 }, { name: 'Display', quantity: 1 }, { name: 'Katani', quantity: 2 }, { name: 'Pamba', quantity: 2 }], cost: 10000, requiredWorkers: [] },
  { id: 'bull_dozer_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Bull dozer body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 50 }, { name: 'Maji', quantity: 10 }, { name: 'Umeme', quantity: 10 }, { name: 'Mbao', quantity: 5 }], cost: 10000, requiredWorkers: [] },
  { id: 'truck_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Truck body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 30 }, { name: 'Maji', quantity: 8 }, { name: 'Umeme', quantity: 8 }, { name: 'Mbao', quantity: 4 }], cost: 8000, requiredWorkers: [] },
  { id: 'bodi_ya_ndege', buildingId: 'kiwanda_cha_spare', output: { name: 'Bodi ya Ndege', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 100 }, { name: 'Maji', quantity: 20 }, { name: 'Umeme', quantity: 20 }, { name: 'Mbao', quantity: 10 }], cost: 25000, requiredWorkers: [] },
  { id: 'bodi_ya_meli', buildingId: 'kiwanda_cha_spare', output: { name: 'Bodi ya Meli', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 200 }, { name: 'Maji', quantity: 40 }, { name: 'Umeme', quantity: 40 }, { name: 'Mbao', quantity: 20 }], cost: 50000, requiredWorkers: [] },

  // Vehicle Chain - Assembly
  { id: 'bull_dozer', buildingId: 'kiwanda_cha_gari', output: { name: 'Bull Dozer', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Interior', quantity: 1 }, { name: 'Bull dozer body', quantity: 1 }, { name: 'Umeme', quantity: 10 }], cost: 50000, requiredWorkers: [] },
  { id: 'lori', buildingId: 'kiwanda_cha_gari', output: { name: 'Lori', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Interior', quantity: 1 }, { name: 'Truck body', quantity: 1 }, { name: 'Umeme', quantity: 10 }], cost: 40000, requiredWorkers: [] },
  { id: 'gari_ya_kifahari', buildingId: 'kiwanda_cha_gari', output: { name: 'Gari ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Luxury Interior', quantity: 1 }, { name: 'Car Body', quantity: 1 }, { name: 'Umeme', quantity: 10 }], cost: 60000, requiredWorkers: [] },
  { id: 'gari', buildingId: 'kiwanda_cha_gari', output: { name: 'Gari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Interior', quantity: 1 }, { name: 'Car Body', quantity: 1 }, { name: 'Umeme', quantity: 10 }], cost: 30000, requiredWorkers: [] },
  { id: 'pikipiki_ya_kifahari', buildingId: 'kiwanda_cha_pikipiki', output: { name: 'Pikipiki ya Kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Luxury Interior', quantity: 1 }, { name: 'Bike Body', quantity: 1 }, { name: 'Umeme', quantity: 5 }], cost: 25000, requiredWorkers: [] },
  { id: 'pikipiki', buildingId: 'kiwanda_cha_pikipiki', output: { name: 'Pikipiki', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 1 }, { name: 'Motor', quantity: 1 }, { name: 'Interior', quantity: 1 }, { name: 'Bike Body', quantity: 1 }, { name: 'Umeme', quantity: 5 }], cost: 15000, requiredWorkers: [] },
  { id: 'ndege', buildingId: 'kiwanda_cha_ndege', output: { name: 'Ndege', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 4 }, { name: 'Interior', quantity: 1 }, { name: 'Bodi ya Ndege', quantity: 1 }, { name: 'Umeme', quantity: 50 }], cost: 200000, requiredWorkers: [] },
  { id: 'ndege_ya_kifahari', buildingId: 'kiwanda_cha_ndege', output: { name: 'Ndege ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 4 }, { name: 'Motor', quantity: 8 }, { name: 'Luxury Interior', quantity: 1 }, { name: 'Bodi ya Ndege', quantity: 1 }, { name: 'Umeme', quantity: 100 }], cost: 500000, requiredWorkers: [] },
  { id: 'meli', buildingId: 'kiwanda_cha_meli', output: { name: 'Meli', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 4 }, { name: 'Motor', quantity: 8 }, { name: 'Interior', quantity: 1 }, { name: 'Bodi ya Meli', quantity: 1 }, { name: 'Umeme', quantity: 200 }], cost: 1000000, requiredWorkers: [] },
  { id: 'meli_ya_kifahari', buildingId: 'kiwanda_cha_meli', output: { name: 'Meli ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 1 }, { name: 'Engine', quantity: 8 }, { name: 'Motor', quantity: 16 }, { name: 'Luxury Interior', quantity: 1 }, { name: 'Bodi ya Meli', quantity: 1 }, { name: 'Umeme', quantity: 400 }], cost: 3000000, requiredWorkers: [] },
];
