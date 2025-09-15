export type Recipe = {
  id: string;
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
  cost: number;
};

export const recipes: Recipe[] = [
  // Shamba Recipes
  { id: 'maji', buildingId: 'shamba', output: { name: 'Maji', quantity: 1 }, inputs: [], cost: 5 },
  { id: 'mbegu', buildingId: 'shamba', output: { name: 'Mbegu', quantity: 1 }, inputs: [], cost: 5 },
  { id: 'maharage', buildingId: 'shamba', output: { name: 'Maharage', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20 },
  { id: 'mchele', buildingId: 'shamba', output: { name: 'Mchele', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20 },
  { id: 'unga_wa_ngano', buildingId: 'shamba', output: { name: 'Unga wa ngano', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20 },
  { id: 'unga_wa_sembe', buildingId: 'shamba', output: { name: 'Unga wa sembe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20 },
  { id: 'ndizi', buildingId: 'shamba', output: { name: 'Ndizi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15 },
  { id: 'viazi_mbatata', buildingId: 'shamba', output: { name: 'Viazi mbatata', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15 },
  { id: 'mboga_mboga', buildingId: 'shamba', output: { name: 'Mboga mboga', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10 },
  { id: 'embe', buildingId: 'shamba', output: { name: 'Embe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25 },
  { id: 'nanasi', buildingId: 'shamba', output: { name: 'Nanasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30 },
  { id: 'parachichi', buildingId: 'shamba', output: { name: 'Parachichi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 35 },
  { id: 'miwa', buildingId: 'shamba', output: { name: 'Miwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40 },
  { id: 'nyasi', buildingId: 'shamba', output: { name: 'Nyasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10 },
  { id: 'mbolea', buildingId: 'shamba', output: { name: 'Mbolea', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }], cost: 20 },
  { id: 'zabibu', buildingId: 'shamba', output: { name: 'Zabibu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25 },
  { id: 'apple', buildingId: 'shamba', output: { name: 'Apple', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25 },
  { id: 'chungwa', buildingId: 'shamba', output: { name: 'Chungwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25 },
  { id: 'korosho', buildingId: 'shamba', output: { name: 'Korosho', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40 },
  { id: 'karafuu', buildingId: 'shamba', output: { name: 'Karafuu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 50 },
  { id: 'pamba', buildingId: 'shamba', output: { name: 'Pamba', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', 'quantity': 1 }], cost: 30 },
  { id: 'katani', buildingId: 'shamba', output: { name: 'Katani', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30 },
  { id: 'sukari', buildingId: 'shamba', output: { name: 'Sukari', quantity: 1 }, inputs: [{ name: 'Miwa', quantity: 5 }], cost: 80 },
  { id: 'ngombe', buildingId: 'shamba', output: { name: 'Ngombe', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 5 }, { name: 'Mbolea', quantity: 2 }], cost: 100 },
  { id: 'kuku', buildingId: 'shamba', output: { name: 'Kuku', quantity: 1 }, inputs: [{ name: 'Yai', quantity: 1 }, { name: 'Mbolea', quantity: 1 }], cost: 50 },
  { id: 'yai', buildingId: 'shamba', output: { name: 'Yai', quantity: 1 }, inputs: [{ name: 'Mbolea', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 30 },
  { id: 'juice', buildingId: 'shamba', output: { name: 'Juice', quantity: 1 }, inputs: [{ name: 'Embe', quantity: 1 }, { name: 'Nanasi', quantity: 1 }, { name: 'Parachichi', quantity: 1 }, { name: 'Sukari', quantity: 1 }], cost: 150 },
  { id: 'nyama', buildingId: 'shamba', output: { name: 'Nyama', quantity: 1 }, inputs: [{ name: 'Ngombe', quantity: 1 }], cost: 50 },
  
  // Kiwanda cha Samaki Recipes
  { id: 'bwawa', buildingId: 'kiwanda_cha_samaki', output: { name: 'Bwawa', quantity: 1 }, inputs: [], cost: 100 },
  { id: 'boat', buildingId: 'kiwanda_cha_samaki', output: { name: 'Boat', quantity: 1 }, inputs: [], cost: 200 },
  { id: 'samaki', buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki', quantity: 1 }, inputs: [{ name: 'Bwawa', quantity: 1 }, { name: 'Boat', quantity: 1 }], cost: 300 },
  { id: 'chumvi', buildingId: 'kiwanda_cha_samaki', output: { name: 'Chumvi', quantity: 1 }, inputs: [{ name: 'Bwawa', quantity: 1 }], cost: 50 },
];
