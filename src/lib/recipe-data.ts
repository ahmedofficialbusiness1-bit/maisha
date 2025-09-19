export type Recipe = {
  id: string;
  buildingId: string;
  output: { name: string; quantity: number };
  inputs: { name: string; quantity: number }[];
};

const machineRecipeInputs = [
    { name: 'Chuma', quantity: 60 },
    { name: 'Nondo', quantity: 30 },
    { name: 'Saruji', quantity: 60 },
    { name: 'Matofali', quantity: 120 },
    { name: 'Maji', quantity: 60 },
    { name: 'Umeme', quantity: 60 },
    { name: 'Mbao', quantity: 60 },
];

const kMachineRecipeInputs = [
    { name: 'Chuma', quantity: 600 },
    { name: 'Nondo', quantity: 300 },
    { name: 'Mabati', quantity: 300 },
    { name: 'Saruji', quantity: 600 },
    { name: 'Matofali', quantity: 1200 },
    { name: 'Maji', quantity: 600 },
    { name: 'Umeme', quantity: 600 },
    { name: 'Mbao', quantity: 600 },
];


const licenseRecipeInputs = [
    { name: 'Karatasi', quantity: 600 },
];

export const recipes: Recipe[] = [
  // Shamba Recipes
  { id: 'mbegu', buildingId: 'shamba', output: { name: 'Mbegu', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 5 }] },
  { id: 'maharage', buildingId: 'shamba', output: { name: 'Maharage', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'mchele', buildingId: 'shamba', output: { name: 'Mchele', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'unga_wa_ngano', buildingId: 'shamba', output: { name: 'Unga wa ngano', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 5 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'unga_wa_sembe', buildingId: 'shamba', output: { name: 'Unga wa sembe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 5 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'ndizi', buildingId: 'shamba', output: { name: 'Ndizi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'viazi_mbatata', buildingId: 'shamba', output: { name: 'Viazi mbatata', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'mboga_mboga', buildingId: 'shamba', output: { name: 'Mboga mboga', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 5 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'embe', buildingId: 'shamba', output: { name: 'Embe', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 3 }] },
  { id: 'nanasi', buildingId: 'shamba', output: { name: 'Nanasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 4 }] },
  { id: 'parachichi', buildingId: 'shamba', output: { name: 'Parachichi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 4 }] },
  { id: 'miwa', buildingId: 'shamba', output: { name: 'Miwa', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 15 }, { name: 'Mbegu', quantity: 3 }] },
  { id: 'nyasi', buildingId: 'shamba', output: { name: 'Nyasi', quantity: 15 }, inputs: [{ name: 'Maji', quantity: 5 }, { name: 'Mbegu', quantity: 2 }] },
  { id: 'mbolea', buildingId: 'shamba', output: { name: 'Mbolea', quantity: 2 }, inputs: [{ name: 'Nyasi', quantity: 10 }] },
  { id: 'zabibu', buildingId: 'shamba', output: { name: 'Zabibu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 3 }] },
  { id: 'apple', buildingId: 'shamba', output: { name: 'Apple', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 3 }] },
  { id: 'chungwa', buildingId: 'shamba', output: { name: 'Chungwa', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 3 }] },
  { id: 'korosho', buildingId: 'shamba', output: { name: 'Korosho', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 15 }, { name: 'Mbegu', quantity: 5 }] },
  { id: 'karafuu', buildingId: 'shamba', output: { name: 'Karafuu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 15 }, { name: 'Mbegu', quantity: 6 }] },
  { id: 'pamba', buildingId: 'shamba', output: { name: 'Pamba', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 4 }] },
  { id: 'katani', buildingId: 'shamba', output: { name: 'Katani', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 10 }, { name: 'Mbegu', quantity: 4 }] },
  { id: 'miti', buildingId: 'shamba', output: { name: 'Miti', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 20 }, { name: 'Mbegu', quantity: 5 }] },
  
  // Zizi Recipes
  { id: 'yai', buildingId: 'zizi', output: { name: 'Yai', quantity: 2 }, inputs: [{ name: 'Nyasi', quantity: 4 }] },
  { id: 'kuku', buildingId: 'zizi', output: { name: 'Kuku', quantity: 1 }, inputs: [{ name: 'Yai', quantity: 2 }, { name: 'Nyasi', quantity: 10 }] },
  { id: 'ngombe', buildingId: 'zizi', output: { name: 'Ngombe', quantity: 1 }, inputs: [{ name: 'Nyasi', quantity: 20 }, { name: 'Mbolea', quantity: 4 }] },
  { id: 'nyama', buildingId: 'zizi', output: { name: 'Nyama', quantity: 10 }, inputs: [{ name: 'Ngombe', quantity: 1 }] },

  // Kiwanda cha Sukari Recipes
  { id: 'sukari', buildingId: 'kiwanda_cha_sukari', output: { name: 'Sukari', quantity: 2 }, inputs: [{ name: 'Miwa', quantity: 4 }] },

  // Mgahawa Recipes
  { id: 'juice', buildingId: 'mgahawa', output: { name: 'Juice', quantity: 2 }, inputs: [{ name: 'Embe', quantity: 2 }, { name: 'Nanasi', quantity: 2 }, { name: 'Parachichi', quantity: 2 }] },
  
  // Kiwanda cha Samaki Recipes
  { id: 'bwawa', buildingId: 'kiwanda_cha_samaki', output: { name: 'Bwawa', quantity: 1 }, inputs: [] },
  { id: 'boat', buildingId: 'kiwanda_cha_samaki', output: { name: 'Boat', quantity: 1 }, inputs: [] },
  { id: 'samaki', buildingId: 'kiwanda_cha_samaki', output: { name: 'Samaki', quantity: 15 }, inputs: [{ name: 'Bwawa', quantity: 1 }, { name: 'Boat', quantity: 1 }] },
  { id: 'chumvi', buildingId: 'kiwanda_cha_samaki', output: { name: 'Chumvi', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 20 }] },

  // Ujenzi & Uchimbaji Recipes
  { id: 'umeme', buildingId: 'kiwanda_cha_umeme', output: { name: 'Umeme', quantity: 150 }, inputs: [{ name: 'Maji', quantity: 20 }] },
  { id: 'maji', buildingId: 'kiwanda_cha_maji', output: { name: 'Maji', quantity: 150 }, inputs: [{ name: 'Umeme', quantity: 20 }] },
  { id: 'mawe', buildingId: 'uchimbaji_mawe', output: { name: 'Mawe', quantity: 3 }, inputs: [] },
  { id: 'kokoto', buildingId: 'uchimbaji_mawe', output: { name: 'Kokoto', quantity: 2 }, inputs: [{ name: 'Mawe', quantity: 2 }] },
  { id: 'mbao', buildingId: 'kiwanda_cha_mbao', output: { name: 'Mbao', quantity: 2 }, inputs: [{ name: 'Miti', quantity: 4 }] },
  { id: 'mchanga', buildingId: 'uchimbaji_mchanga', output: { name: 'Mchanga', quantity: 3 }, inputs: [{ name: 'Maji', quantity: 3 }, { name: 'Umeme', quantity: 3 }] },
  { id: 'chuma', buildingId: 'uchimbaji_chuma', output: { name: 'Chuma', quantity: 2 }, inputs: [{ name: 'Umeme', quantity: 20 }, { name: 'Maji', quantity: 20 }] },
  { id: 'nondo', buildingId: 'kiwanda_cha_chuma', output: { name: 'Nondo', quantity: 2 }, inputs: [{ name: 'Chuma', quantity: 4 }, { name: 'Umeme', quantity: 10 }] },
  { id: 'saruji', buildingId: 'kiwanda_cha_saruji', output: { name: 'Saruji', quantity: 2 }, inputs: [{ name: 'Mchanga', quantity: 4 }, { name: 'Maji', quantity: 2 }] },
  { id: 'matofali', buildingId: 'kiwanda_cha_matofali', output: { name: 'Matofali', quantity: 3 }, inputs: [{ name: 'Saruji', quantity: 2 }, { name: 'Mchanga', quantity: 4 }, { name: 'Maji', quantity: 2 }, { name: 'Umeme', quantity: 2 }] },
  { id: 'zege', buildingId: 'kiwanda_cha_matofali', output: { name: 'Zege', quantity: 2 }, inputs: [{ name: 'Saruji', quantity: 4 }, { name: 'Maji', quantity: 4 }, { name: 'Kokoto', quantity: 6 }, { name: 'Umeme', quantity: 2 }] },
  { id: 'mabati', buildingId: 'kiwanda_cha_chuma', output: { name: 'Mabati', quantity: 2}, inputs: [{ name: 'Chuma', quantity: 4 }] },

  // Madini Recipes
  { id: 'almasi', buildingId: 'uchimbaji_almasi', output: { name: 'Almasi', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 100}, { name: 'Umeme', quantity: 100}] },
  { id: 'dhahabu', buildingId: 'uchimbaji_dhahabu', output: { name: 'Dhahabu', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 80}, { name: 'Umeme', quantity: 80}] },
  { id: 'silver', buildingId: 'uchimbaji_silver', output: { name: 'Silver', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 40}, { name: 'Umeme', quantity: 40}] },
  { id: 'ruby', buildingId: 'uchimbaji_ruby', output: { name: 'Ruby', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 70}, { name: 'Umeme', quantity: 70}] },
  { id: 'tanzanite', buildingId: 'uchimbaji_tanzanite', output: { name: 'Tanzanite', quantity: 1 }, inputs: [{ name: 'Maji', quantity: 80}, { name: 'Umeme', quantity: 80}] },
  { id: 'shaba', buildingId: 'uchimbaji_shaba', output: { name: 'Shaba', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 30}, { name: 'Umeme', quantity: 30}] },

  // Mafuta Recipes
  { id: 'mafuta_ghafi', buildingId: 'uchimbaji_mafuta', output: { name: 'Mafuta Ghafi', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 20 }, { name: 'Umeme', quantity: 20 }] },
  { id: 'disel', buildingId: 'kiwanda_cha_disel', output: { name: 'Disel', quantity: 2 }, inputs: [{ name: 'Umeme', quantity: 40 }, { name: 'Mafuta Ghafi', quantity: 4 }] },
  { id: 'petrol', buildingId: 'kiwanda_cha_petrol', output: { name: 'Petrol', quantity: 2 }, inputs: [{ name: 'Umeme', quantity: 40 }, { name: 'Mafuta Ghafi', quantity: 4 }] },

  // Kiwanda cha Karatasi
  { id: 'karatasi', buildingId: 'kiwanda_cha_karatasi', output: { name: 'Karatasi', quantity: 15 }, inputs: [{ name: 'Mbao', quantity: 4 }, { name: 'Maji', quantity: 10 }, { name: 'Umeme', quantity: 4 }] },

  // Kiwanda cha Mashine
  { id: 'mashine_a1', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine A1', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_a2', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine A2', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_a3', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine A3', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_a4', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine A4', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_a5', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine A5', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b1', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B1', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b2', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B2', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b3', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B3', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b4', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B4', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b5', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B5', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b6', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B6', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_b7', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine B7', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_c1', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine C1', quantity: 1 }, inputs: machineRecipeInputs },
  { id: 'mashine_c2', buildingId: 'kiwanda_cha_mashine', output: { name: 'Mashine C2', quantity: 1 }, inputs: machineRecipeInputs },

  // Ofisi ya Leseni
  { id: 'leseni_b1', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B1', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b2', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B2', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b3', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B3', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b4', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B4', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b5', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B5', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b6', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B6', quantity: 1 }, inputs: licenseRecipeInputs },
  { id: 'leseni_b7', buildingId: 'ofisi_ya_leseni', output: { name: 'Leseni B7', quantity: 1 }, inputs: licenseRecipeInputs },


  // Wizara ya Madini
  {
    id: 'cheti_cha_madini',
    buildingId: 'wizara_ya_madini',
    output: { name: 'Cheti cha Madini', quantity: 1 },
    inputs: [{ name: 'Karatasi', quantity: 1200 }],
  },

  // Mavazi & Nguo Chain
  { id: 'gundi', buildingId: 'kiwanda_cha_gundi', output: { name: 'Gundi', quantity: 2 }, inputs: [{ name: 'Maji', quantity: 20 }, { name: 'Umeme', quantity: 10 }] },
  { id: 'chokaa', buildingId: 'kiwanda_cha_chokaa', output: { name: 'Chokaa', quantity: 2 }, inputs: [{ name: 'Mawe', quantity: 10}] },
  { id: 'kioo', buildingId: 'kiwanda_cha_vioo', output: { name: 'Kioo', quantity: 2 }, inputs: [{ name: 'Mchanga', quantity: 20 }, { name: 'Chokaa', quantity: 4 }, { name: 'Umeme', quantity: 20 }] },
  { id: 'kitamba', buildingId: 'kiwanda_cha_vitambaa', output: { name: 'Kitamba', quantity: 2 }, inputs: [{ name: 'Katani', quantity: 2 }, { name: 'Pamba', quantity: 2 }] },
  { id: 'ngozi', buildingId: 'kiwanda_cha_ngozi', output: { name: 'Ngozi', quantity: 2 }, inputs: [{ name: 'Ngombe', quantity: 1 }] },
  { id: 'soli', buildingId: 'kiwanda_cha_saa', output: { name: 'Soli', quantity: 2 }, inputs: [{ name: 'Ngozi', quantity: 2 }, { name: 'Gundi', quantity: 4}] },
  { id: 'saa', buildingId: 'kiwanda_cha_saa', output: { name: 'Saa', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 2 }, { name: 'Kioo', quantity: 2 }, { name: 'Betri', quantity: 2 }] },
  { id: 'viatu', buildingId: 'kiwanda_cha_nguo', output: { name: 'Viatu', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 2 }, { name: 'Soli', quantity: 4 }] },
  { id: 'pochi', buildingId: 'kiwanda_cha_nguo', output: { name: 'Pochi', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 4 }] },
  { id: 't-shirt', buildingId: 'kiwanda_cha_nguo', output: { name: 'T-Shirt', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 4 }] },
  { id: 'jeans', buildingId: 'kiwanda_cha_nguo', output: { name: 'Jeans', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 6 }] },
  { id: 'skirt', buildingId: 'kiwanda_cha_nguo', output: { name: 'Skirt', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 4 }] },
  { id: 'kijora', buildingId: 'kiwanda_cha_nguo', output: { name: 'Kijora', quantity: 1 }, inputs: [{ name: 'Kitamba', quantity: 8 }] },

  // Sonara (Vito) Recipes
  { id: 'mkufu_wa_dhahabu', buildingId: 'sonara', output: { name: 'Mkufu wa Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 10 }] },
  { id: 'saa_ya_dhahabu', buildingId: 'sonara', output: { name: 'Saa ya Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 6 }, { name: 'Saa', quantity: 1 }] },
  { id: 'pete_ya_dhahabu', buildingId: 'sonara', output: { name: 'Pete ya Dhahabu', quantity: 1 }, inputs: [{ name: 'Dhahabu', quantity: 4 }] },
  { id: 'mkufu_wa_almasi', buildingId: 'sonara', output: { name: 'Mkufu wa Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 10 }, {name: 'Silver', quantity: 4}] },
  { id: 'saa_ya_almasi', buildingId: 'sonara', output: { name: 'Saa ya Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 6 }, { name: 'Saa', quantity: 1 }] },
  { id: 'pete_ya_almasi', buildingId: 'sonara', output: { name: 'Pete ya Almasi', quantity: 1 }, inputs: [{ name: 'Almasi', quantity: 4 }, {name: 'Silver', quantity: 2}] },

  // Electronics Chain
  { id: 'vifaa_vya_ndani', buildingId: 'kiwanda_cha_vifaa_vya_ndani', output: { name: 'Vifaa vya ndani', quantity: 10 }, inputs: [{ name: 'Chuma', quantity: 2}, { name: 'Shaba', quantity: 4}] },
  { id: 'housing', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Housing', quantity: 2 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 4 }, { name: 'Mbao', quantity: 2 }] },
  { id: 'nyaya', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Nyaya', quantity: 15 }, inputs: [{ name: 'Shaba', quantity: 2 }, { name: 'Umeme', quantity: 2 }] },
  { id: 'lcd', buildingId: 'kiwanda_cha_usanidi', output: { name: 'LCD', quantity: 1 }, inputs: [{ name: 'Kioo', quantity: 2 }, { name: 'Nyaya', quantity: 2 }] },
  { id: 'cathode', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Cathode', quantity: 2 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 2 }, { name: 'Chuma', quantity: 2 }] },
  { id: 'anode', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Anode', quantity: 2 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 2 }, { name: 'Shaba', quantity: 2 }] },
  { id: 'ram', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Ram', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 2 }, { name: 'Dhahabu', quantity: 2 }] },
  { id: 'rom', buildingId: 'kiwanda_cha_usanidi', output: { name: 'Rom', quantity: 1 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 2 }] },
  { id: 'pcb', buildingId: 'kiwanda_cha_usanidi', output: { name: 'PCB', quantity: 2 }, inputs: [{ name: 'Vifaa vya ndani', quantity: 4 }, { name: 'Shaba', quantity: 2 }] },

  // Tier 2: Components (from their respective factories)
  { id: 'processor', buildingId: 'kiwanda_cha_processor', output: { name: 'Processor', quantity: 1 }, inputs: [{ name: 'Ram', quantity: 2}, {name: 'Rom', quantity: 2}, {name: 'Nyaya', quantity: 4}] },
  { id: 'betri', buildingId: 'kiwanda_cha_betri', output: { name: 'Betri', quantity: 2 }, inputs: [{ name: 'Housing', quantity: 2 }, { name: 'Nyaya', quantity: 2 }, { name: 'Cathode', quantity: 2 }, { name: 'Anode', quantity: 2 }] },
  { id: 'display', buildingId: 'kiwanda_cha_display', output: { name: 'Display', quantity: 1 }, inputs: [{ name: 'LCD', quantity: 2 }, { name: 'Kioo', quantity: 2 }] },
  { id: 'motherboard', buildingId: 'kiwanda_cha_motherboard', output: { name: 'Motherboard', quantity: 1 }, inputs: [{ name: 'Processor', quantity: 2 }, { name: 'PCB', quantity: 2 }] },

  // Tier 3: Final Products (Assembly factories)
  { id: 'tv', buildingId: 'kiwanda_cha_tv', output: { name: 'TV', quantity: 1 }, inputs: [{ name: 'Display', quantity: 2 }, { name: 'Motherboard', quantity: 2 }, { name: 'Betri', quantity: 2 }, { name: 'Housing', quantity: 2 }] },
  { id: 'tablet', buildingId: 'kiwanda_cha_tablet', output: { name: 'Tablet', quantity: 1 }, inputs: [{ name: 'Display', quantity: 2 }, { name: 'Motherboard', quantity: 2 }, { name: 'Betri', quantity: 2 }] },
  { id: 'smartphone', buildingId: 'kiwanda_cha_smartphone', output: { name: 'Smartphone', quantity: 2 }, inputs: [{ name: 'Display', quantity: 2 }, { name: 'Motherboard', quantity: 2 }, { name: 'Betri', quantity: 2 }] },
  { id: 'laptop', buildingId: 'kiwanda_cha_laptop', output: { name: 'Laptop', quantity: 1 }, inputs: [{ name: 'Display', quantity: 2 }, { name: 'Motherboard', quantity: 4 }, { name: 'Betri', quantity: 4 }, { name: 'Housing', quantity: 2 }] },

  // Vehicle Chain - Spares (kiwanda_cha_spare)
  { id: 'car_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Car Body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 150 }, { name: 'Nondo', quantity: 75 }] },
  { id: 'bike_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Bike Body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 30 }, { name: 'Nondo', quantity: 15 }] },
  { id: 'interior', buildingId: 'kiwanda_cha_spare', output: { name: 'Interior', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 15 }, { name: 'Kitamba', quantity: 30 }, { name: 'Mbao', quantity: 15 }] },
  { id: 'luxury_interior', buildingId: 'kiwanda_cha_spare', output: { name: 'Luxury Interior', quantity: 1 }, inputs: [{ name: 'Ngozi', quantity: 30 }, { name: 'Kitamba', quantity: 45 }, { name: 'Mbao', quantity: 30 }, { name: 'Dhahabu', quantity: 2}] },
  { id: 'motor', buildingId: 'kiwanda_cha_spare', output: { name: 'Motor', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 15 }, { name: 'Nyaya', quantity: 30 }] },
  { id: 'engine', buildingId: 'kiwanda_cha_spare', output: { name: 'Engine', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 30 }, { name: 'Nondo', quantity: 15 }, { name: 'Processor', quantity: 2 }] },
  { id: 'dashboard', buildingId: 'kiwanda_cha_spare', output: { name: 'Dashboard', quantity: 1 }, inputs: [{ name: 'Display', quantity: 2 }, { name: 'Nyaya', quantity: 15 }, { name: 'Housing', quantity: 2 }] },
  { id: 'bull_dozer_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Bull dozer body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 300 }, { name: 'Nondo', quantity: 150 }] },
  { id: 'truck_body', buildingId: 'kiwanda_cha_spare', output: { name: 'Truck body', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 225 }, { name: 'Nondo', quantity: 112 }] },
  { id: 'bodi_ya_ndege', buildingId: 'kiwanda_cha_spare', output: { name: 'Bodi ya Ndege', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 450 }, { name: 'Nondo', quantity: 225 }] },
  { id: 'bodi_ya_meli', buildingId: 'kiwanda_cha_spare', output: { name: 'Bodi ya Meli', quantity: 1 }, inputs: [{ name: 'Chuma', quantity: 750 }, { name: 'Nondo', quantity: 375 }] },

  // Vehicle Chain - Assembly
  { id: 'bull_dozer', buildingId: 'kiwanda_cha_gari', output: { name: 'Bull Dozer', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 2 }, { name: 'Engine', quantity: 4 }, { name: 'Motor', quantity: 8 }, { name: 'Interior', quantity: 2 }, { name: 'Bull dozer body', quantity: 1 }] },
  { id: 'lori', buildingId: 'kiwanda_cha_gari', output: { name: 'Lori', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 2 }, { name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 4 }, { name: 'Interior', quantity: 2 }, { name: 'Truck body', quantity: 1 }] },
  { id: 'gari_ya_kifahari', buildingId: 'kiwanda_cha_gari', output: { name: 'Gari ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 2 }, { name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 2 }, { name: 'Luxury Interior', quantity: 2 }, { name: 'Car Body', quantity: 1 }] },
  { id: 'gari', buildingId: 'kiwanda_cha_gari', output: { name: 'Gari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 2 }, { name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 2 }, { name: 'Interior', quantity: 2 }, { name: 'Car Body', quantity: 1 }] },
  { id: 'pikipiki_ya_kifahari', buildingId: 'kiwanda_cha_pikipiki', output: { name: 'Pikipiki ya Kifahari', quantity: 1 }, inputs: [{ name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 2 }, { name: 'Luxury Interior', quantity: 2 }, { name: 'Bike Body', quantity: 1 }] },
  { id: 'pikipiki', buildingId: 'kiwanda_cha_pikipiki', output: { name: 'Pikipiki', quantity: 2 }, inputs: [{ name: 'Engine', quantity: 2 }, { name: 'Motor', quantity: 2 }, { name: 'Interior', quantity: 2 }, { name: 'Bike Body', quantity: 1 }] },
  { id: 'ndege', buildingId: 'kiwanda_cha_ndege', output: { name: 'Ndege', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 4 }, { name: 'Engine', quantity: 8 }, { name: 'Motor', quantity: 16 }, { name: 'Interior', quantity: 20 }, { name: 'Bodi ya Ndege', quantity: 1 }] },
  { id: 'ndege_ya_kifahari', buildingId: 'kiwanda_cha_ndege', output: { name: 'Ndege ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 8 }, { name: 'Engine', quantity: 16 }, { name: 'Motor', quantity: 32 }, { name: 'Luxury Interior', quantity: 40 }, { name: 'Bodi ya Ndege', quantity: 1 }] },
  { id: 'meli', buildingId: 'kiwanda_cha_meli', output: { name: 'Meli', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 8 }, { name: 'Engine', quantity: 16 }, { name: 'Motor', quantity: 32 }, { name: 'Interior', quantity: 40 }, { name: 'Bodi ya Meli', quantity: 1 }] },
  { id: 'meli_ya_kifahari', buildingId: 'kiwanda_cha_meli', output: { name: 'Meli ya kifahari', quantity: 1 }, inputs: [{ name: 'Dashboard', quantity: 16 }, { name: 'Engine', quantity: 32 }, { name: 'Motor', quantity: 64 }, { name: 'Luxury Interior', quantity: 80 }, { name: 'Bodi ya Meli', quantity: 1 }] },

  // K-Series Machines
  { id: 'k1_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K1 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k2_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K2 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k3_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K3 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k4_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K4 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k5_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K5 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k6_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K6 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },
  { id: 'k7_mashine', buildingId: 'kiwanda_cha_k_mashine', output: { name: 'K7 Mashine', quantity: 1 }, inputs: kMachineRecipeInputs },

  // Space Chain
  { id: 'fuselage', buildingId: 'kiwanda_cha_anga', output: { name: 'Fuselage', quantity: 1 }, inputs: [{ name: 'K1 Mashine', quantity: 2 }, { name: 'Bodi ya Ndege', quantity: 20 }] },
  { id: 'wings', buildingId: 'kiwanda_cha_anga', output: { name: 'Wings', quantity: 1 }, inputs: [{ name: 'K2 Mashine', quantity: 2 }, { name: 'Bodi ya Ndege', quantity: 8 }] },
  { id: 'tarakilishi', buildingId: 'kiwanda_cha_anga', output: { name: 'Tarakilishi', quantity: 1 }, inputs: [{ name: 'K3 Mashine', quantity: 2 }, { name: 'Motherboard', quantity: 200 }] },
  { id: 'cockpit', buildingId: 'kiwanda_cha_anga', output: { name: 'Cockpit', quantity: 1 }, inputs: [{ name: 'K4 Mashine', quantity: 2 }, { name: 'Dashboard', quantity: 40 }, {name: 'Kioo', quantity: 100}] },
  { id: 'attitude_control', buildingId: 'kiwanda_cha_anga', output: { name: 'Attitude Control', quantity: 1 }, inputs: [{ name: 'K5 Mashine', quantity: 2 }, { name: 'Motor', quantity: 100 }] },
  { id: 'rocket_engine', buildingId: 'kiwanda_cha_anga', output: { name: 'Rocket Engine', quantity: 1 }, inputs: [{ name: 'K6 Mashine', quantity: 2 }, { name: 'Engine', quantity: 40 }] },
  { id: 'heat_shield', buildingId: 'kiwanda_cha_anga', output: { name: 'Heat Shield', quantity: 1 }, inputs: [{ name: 'K7 Mashine', quantity: 2 }, { name: 'Nondo', quantity: 2000 }] },
  { id: 'roketi', buildingId: 'kiwanda_cha_roketi', output: { name: 'Roketi', quantity: 1 }, inputs: [{ name: 'Fuselage', quantity: 2 }, { name: 'Wings', quantity: 8 }, { name: 'Tarakilishi', quantity: 2 }, { name: 'Cockpit', quantity: 2 }, { name: 'Attitude Control', quantity: 8 }, { name: 'Rocket Engine', quantity: 8 }, { name: 'Heat Shield', quantity: 2 }] },
];
