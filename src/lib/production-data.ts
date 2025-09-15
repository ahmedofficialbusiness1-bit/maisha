export type ProductionLine = {
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
  cost: number;
  duration: string; // e.g., "5m", "1h"
};

export const productionLines: ProductionLine[] = [
  // Base resources that might be needed but are not explicitly produced
  { buildingId: 'shamba', output: { name: 'Maji', quantity: 1 }, inputs: [], cost: 5, duration: '1m' },
  { buildingId: 'shamba', output: { name: 'Mbegu', quantity: 1 }, inputs: [], cost: 5, duration: '1m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Bwawa', quantity: 1 }, inputs: [], cost: 100, duration: '30m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Boat', quantity: 1 }, inputs: [], cost: 200, duration: '1h' },


  // VYAKULA - Tier 1 (from base)
  { buildingId: 'shamba', output: { name: 'Maharage', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, duration: '10m' },
  { buildingId: 'shamba', output: { name: 'Mchele', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, duration: '10m' },
  { buildingId: 'shamba', output: { name: 'Unga wa ngano', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, duration: '15m' },
  { buildingId: 'shamba', output: { name: 'Unga wa sembe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, duration: '15m' },
  { buildingId: 'shamba', output: { name: 'Ndizi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15, duration: '8m' },
  { buildingId: 'shamba', output: { name: 'Viazi mbatata', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 15, duration: '12m' },
  { buildingId: 'shamba', output: { name: 'Mboga mboga', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10, duration: '5m' },
  { buildingId: 'shamba', output: { name: 'Embe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Nanasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30, duration: '25m' },
  { buildingId: 'shamba', output: { name: 'Parachichi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 35, duration: '30m' },
  { buildingId: 'shamba', output: { name: 'Miwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40, duration: '40m' },
  { buildingId: 'shamba', output: { name: 'Nyasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 10, duration: '5m' },
  { buildingId: 'shamba', output: { name: 'Mbolea', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }], cost: 20, duration: '10m' },
  { buildingId: 'shamba', output: { name: 'Zabibu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Apple', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Chungwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Korosho', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 40, duration: '35m' },
  { buildingId: 'shamba', output: { name: 'Karafuu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 50, duration: '45m' },
  { buildingId: 'shamba', output: { name: 'Pamba', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', 'quantity': 1 }], cost: 30, duration: '25m' },
  { buildingId: 'shamba', output: { name: 'Katani', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 30, duration: '25m' },

  // Tier 2
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki', quantity: 1 }, inputs: [{ name: 'Bwawa', quantity: 1 }, { name: 'Boat', quantity: 1 }], cost: 300, duration: '2h' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Chumvi', quantity: 1 }, inputs: [{ name: 'Bwawa', quantity: 1 }], cost: 50, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Sukari', quantity: 1 }, inputs: [{ name: 'Miwa', quantity: 5 }], cost: 80, duration: '30m' },
  { buildingId: 'shamba', output: { name: 'Ngombe', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 5 }, { name: 'Mbolea', quantity: 2 }], cost: 100, duration: '1h' },
  { buildingId: 'shamba', output: { name: 'Kuku', quantity: 1 }, inputs: [{ name: 'Yai', quantity: 1 }, { name: 'Mbolea', quantity: 1 }], cost: 50, duration: '30m' },
  { buildingId: 'shamba', output: { name: 'Yai', quantity: 1 }, inputs: [{ name: 'Mbolea', quantity: 1 }, { name: 'Maji', quantity: 1 }], cost: 30, duration: '15m' },

  // Tier 3
  { buildingId: 'shamba', output: { name: 'Juice', quantity: 1 }, inputs: [{ name: 'Embe', quantity: 1 }, { name: 'Nanasi', quantity: 1 }, { name: 'Parachichi', quantity: 1 }, { name: 'Sukari', quantity: 1 }], cost: 150, duration: '45m' },
  { buildingId: 'shamba', output: { name: 'Nyama', quantity: 1 }, inputs: [{ name: 'Ngombe', quantity: 1 }], cost: 50, duration: '20m' },
];