export type ProductionLine = {
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
  cost: number;
  duration: string; // e.g., "5m", "1h"
};

export const productionLines: ProductionLine[] = [
  // Shamba Productions
  { buildingId: 'shamba', output: { name: 'Maji', quantity: 1 }, inputs: [], cost: 10, duration: '1m' },
  { buildingId: 'shamba', output: { name: 'Mbegu', quantity: 1 }, inputs: [], cost: 15, duration: '2m' },
  { buildingId: 'shamba', output: { name: 'Nyasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 5, duration: '5m' },
  { buildingId: 'shamba', output: { name: 'Mbolea', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }], cost: 20, duration: '10m' },
  { buildingId: 'shamba', output: { name: 'Ng\'ombe', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 5 }, { name: 'Mbolea', quantity: 2 }], cost: 100, duration: '1h' },
  { buildingId: 'shamba', output: { name: 'Nyama', quantity: 1 }, inputs: [{ name: 'Ng\'ombe', quantity: 1 }], cost: 50, duration: '15m' },
  { buildingId: 'shamba', output: { name: 'Ngozi', quantity: 1 }, inputs: [{ name: 'Ng\'ombe', quantity: 1 }], cost: 40, duration: '12m' },
  { buildingId: 'shamba', output: { name: 'Kuku', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 2 }, { name: 'Mbolea', quantity: 1 }], cost: 50, duration: '30m' },
  { buildingId: 'shamba', output: { name: 'Mayai', quantity: 10 }, inputs: [{ name: 'Kuku', quantity: 1 }], cost: 10, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Alizeti', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 2 }, { name: 'Mbegu', quantity: 2 }], cost: 30, duration: '45m' },
  { buildingId: 'shamba', output: { name: 'Mafuta ya Alizeti', quantity: 1 }, inputs: [{ name: 'Alizeti', quantity: 5 }], cost: 60, duration: '25m' },
  { buildingId: 'shamba', output: { name: 'Pamba', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 3 }, { name: 'Mbegu', quantity: 3 }], cost: 40, duration: '50m' },
  { buildingId: 'shamba', output: { name: 'Nguo', quantity: 1 }, inputs: [{ name: 'Pamba', quantity: 5 }], cost: 80, duration: '35m' },
  { buildingId: 'shamba', output: { name: 'Maharage', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 25, duration: '40m' },
  { buildingId: 'shamba', output: { name: 'Ngano', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 2 }, { name: 'Mbegu', quantity: 2 }], cost: 35, duration: '55m' },
  { buildingId: 'shamba', output: { name: 'Unga wa Ngano', quantity: 1 }, inputs: [{ name: 'Ngano', quantity: 5 }], cost: 70, duration: '30m' },
  { buildingId: 'shamba', output: { name: 'Matunda', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 1 }, { name: 'Mbegu', quantity: 1 }], cost: 20, duration: '20m' },
  { buildingId: 'shamba', output: { name: 'Juisi ya Matunda', quantity: 1 }, inputs: [{ name: 'Matunda', quantity: 10 }], cost: 50, duration: '15m' },

  // Kiwanda cha Samaki Productions
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki', quantity: 1 }, inputs: [], cost: 100, duration: '30m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Chumvi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 5 }], cost: 20, duration: '10m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki wa Kukaushwa', quantity: 1 }, inputs: [{ name: 'Samaki', quantity: 1 }, { name: 'Chumvi', quantity: 1 }], cost: 40, duration: '45m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Mwani', quantity: 1 }, inputs: [], cost: 30, duration: '20m' },
  { buildingId: 'kiwanda_cha_samaki', output: { name: 'Dagaa', quantity: 1 }, inputs: [], cost: 50, duration: '25m' },
];
