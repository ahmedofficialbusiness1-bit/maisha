import type { WorkerSpecialty } from './worker-data';

export type Recipe = {
  id: string;
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
  cost: number;
  requiredWorkers: { specialty: WorkerSpecialty; count: number }[];
};

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
  { id: 'mawe', buildingId: 'uchimbaji_mawe', output: { name: 'Mawe', quantity: 1 }, inputs: [], cost: 15, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'kokoto', buildingId: 'uchimbaji_mawe', output: { name: 'Kokoto', quantity: 1 }, inputs: [{ name: 'Mawe', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'mbao', buildingId: 'kiwanda_cha_mbao', output: { name: 'Mbao', quantity: 1 }, inputs: [{ name: 'Mashine A2', quantity: 1 }, { name: 'Miti', quantity: 2 }], cost: 60, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'mchanga', buildingId: 'uchimbaji_mchanga', output: { name: 'Mchanga', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Umeme', quantity: 1 }], cost: 20, requiredWorkers: [{ specialty: 'Uzalishaji', count: 1 }] },
  { id: 'madini_ya_chuma', buildingId: 'uchimbaji_chuma', output: { name: 'Madini ya chuma', quantity: 1 }, inputs: [], cost: 40, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
  { id: 'chuma', buildingId: 'uchimbaji_chuma', output: { name: 'Chuma', quantity: 1 }, inputs: [{ name: 'Mashine B7', quantity: 1 }, {name: 'Madini ya chuma', quantity: 2}, { name: 'Umeme', quantity: 1 }, { name: 'Maji', quantity: 1 }, { name: 'Leseni B7', quantity: 1 }], cost: 150, requiredWorkers: [{ specialty: 'Uzalishaji', count: 2 }] },
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

];

    
