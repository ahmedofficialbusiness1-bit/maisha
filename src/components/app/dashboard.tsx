
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Factory, Leaf, PlusCircle, Settings, Clock, CheckCircle, Gem, Hammer, Mountain, Droplets, Zap, ToyBrick, Star, Trash2, ChevronsUp, Tractor, Drumstick, Beef, GlassWater, Utensils, Wheat, ArrowLeft, Users, Wrench, FileText, ScrollText, Shirt, Building2, Watch, Glasses, FlaskConical, CircleDollarSign, Monitor, Tablet, Smartphone, Laptop, Cpu, Battery, MemoryStick, Tv, Ship, Car, Bike, Plane, Rocket, ShieldCheck, Search, Store, ShoppingCart, Lock, Award } from 'lucide-react';
import type { Recipe } from '@/lib/recipe-data';
import { Separator } from '../ui/separator';
import { recipes } from '@/lib/recipe-data';
import type { InventoryItem } from './inventory';
import { cn } from '@/lib/utils';
import { buildingData } from '@/lib/building-data';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { encyclopediaData } from '@/lib/encyclopedia-data';
import type { LucideIcon } from 'lucide-react';

export type BuildingType = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageHint: string;
};

export type ActivityInfo = {
    type: 'sell' | 'produce';
    recipeId: string; // For shops, this will be the item name.
    quantity: number;
    saleValue: number; // Store the final sale value for sales
    startTime: number;
    endTime: number;
};

export type ConstructionInfo = {
    startTime: number;
    endTime: number;
    targetLevel: number;
};

export type BuildingSlot = {
    building: BuildingType | null;
    level: number;
    activity?: ActivityInfo;
    construction?: ConstructionInfo;
    locked?: boolean;
    quality?: number; // Q0 to Q5
};

export const availableBuildings: BuildingType[] = [
    {
        id: 'duka_kuu',
        name: 'Duka Kuu',
        description: 'Huzaa bidhaa za chakula, kilimo na za msingi.',
        image: 'https://picsum.photos/seed/supermarket/200/200',
        imageHint: 'supermarket aisle'
    },
    {
        id: 'duka_la_ujenzi',
        name: 'Duka la Vifaa vya Ujenzi',
        description: 'Huzaa vifaa vya ujenzi na malighafi.',
        image: 'https://picsum.photos/seed/hardware-store/200/200',
        imageHint: 'hardware store'
    },
    {
        id: 'duka_la_nguo_na_vito',
        name: 'Duka la Nguo na Vito',
        description: 'Huzaa mavazi, vito na bidhaa za kifahari.',
        image: 'https://picsum.photos/seed/fashion-boutique/200/200',
        imageHint: 'fashion boutique'
    },
    {
        id: 'duka_la_electroniki',
        name: 'Duka la Electroniki',
        description: 'Huzaa vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/electronics-store/200/200',
        imageHint: 'electronics store'
    },
    {
        id: 'duka_la_magari',
        name: 'Duka la Magari',
        description: 'Huzaa magari, pikipiki na vyombo vya usafiri.',
        image: 'https://picsum.photos/seed/car-dealership/200/200',
        imageHint: 'car dealership'
    },
    {
        id: 'duka_la_anga',
        name: 'Duka la Anga',
        description: 'Huzaa bidhaa za teknolojia ya anga.',
        image: 'https://picsum.photos/seed/space-store/200/200',
        imageHint: 'space showroom'
    },
    {
        id: 'shamba',
        name: 'Shamba',
        description: 'Huzalisha mazao ya kilimo na mifugo.',
        image: 'https://picsum.photos/seed/farm-land/200/200',
        imageHint: 'fertile farm'
    },
    {
        id: 'zizi',
        name: 'Zizi',
        description: 'Hufuga wanyama na kuzalisha bidhaa za mifugo.',
        image: 'https://picsum.photos/seed/animal-pen/200/200',
        imageHint: 'animal pen'
    },
    {
        id: 'kiwanda_cha_samaki',
        name: 'Kiwanda cha Samaki',
        description: 'Husindika samaki na bidhaa za baharini.',
        image: 'https://picsum.photos/seed/fish-factory/200/200',
        imageHint: 'fish factory'
    },
    {
        id: 'uchimbaji_mawe',
        name: 'Uchimbaji Mawe (Quarry)',
        description: 'Huchimba mawe na kokoto.',
        image: 'https://picsum.photos/seed/quarry/200/200',
        imageHint: 'stone quarry'
    },
    {
        id: 'uchimbaji_mchanga',
        name: 'Uchimbaji Mchanga',
        description: 'Huchimba mchanga.',
        image: 'https://picsum.photos/seed/sand-pit/200/200',
        imageHint: 'sand pit'
    },
    {
        id: 'uchimbaji_chuma',
        name: 'Uchimbaji Chuma',
        description: 'Huchimba madini ya chuma.',
        image: 'https://picsum.photos/seed/iron-mine/200/200',
        imageHint: 'iron mine'
    },
     {
        id: 'uchimbaji_almasi',
        name: 'Uchimbaji Almasi',
        description: 'Huchimba Almasi.',
        image: 'https://picsum.photos/seed/diamond-mine/200/200',
        imageHint: 'diamond mine'
    },
    {
        id: 'uchimbaji_dhahabu',
        name: 'Uchimbaji Dhahabu',
        description: 'Huchimba Dhahabu.',
        image: 'https://picsum.photos/seed/gold-mine/200/200',
        imageHint: 'gold mine'
    },
    {
        id: 'uchimbaji_silver',
        name: 'Uchimbaji Silver',
        description: 'Huchimba Silver.',
        image: 'https://picsum.photos/seed/silver-mine/200/200',
        imageHint: 'silver mine'
    },
     {
        id: 'uchimbaji_ruby',
        name: 'Uchimbaji Ruby',
        description: 'Huchimba Ruby.',
        image: 'https://picsum.photos/seed/ruby-mine/200/200',
        imageHint: 'ruby mine'
    },
    {
        id: 'uchimbaji_tanzanite',
        name: 'Uchimbaji Tanzanite',
        description: 'Huchimba Tanzanite.',
        image: 'https://picsum.photos/seed/tanzanite-mine/200/200',
        imageHint: 'tanzanite mine'
    },
    {
        id: 'uchimbaji_shaba',
        name: 'Uchimbaji Shaba',
        description: 'Huchimba Shaba.',
        image: 'https://picsum.photos/seed/copper-mine/200/200',
        imageHint: 'copper mine'
    },
    {
        id: 'kiwanda_cha_umeme',
        name: 'Kiwanda cha Umeme',
        description: 'Huzalisha umeme.',
        image: 'https://picsum.photos/seed/power-plant/200/200',
        imageHint: 'power plant'
    },
    {
        id: 'kiwanda_cha_maji',
        name: 'Kiwanda cha Maji',
        description: 'Huzalisha maji safi.',
        image: 'https://picsum.photos/seed/water-plant/200/200',
        imageHint: 'water plant'
    },
    {
        id: 'kiwanda_cha_mbao',
        name: 'Kiwanda cha Mbao',
        description: 'Husindika miti kuwa mbao.',
        image: 'https://picsum.photos/seed/lumber-mill/200/200',
        imageHint: 'lumber mill'
    },
    {
        id: 'kiwanda_cha_saruji',
        name: 'Kiwanda cha Saruji',
        description: 'Huzalisha saruji.',
        image: 'https://picsum.photos/seed/cement-factory/200/200',
        imageHint: 'cement factory'
    },
    {
        id: 'kiwanda_cha_matofali',
        name: 'Kiwanda cha Matofali',
        description: 'Huzalisha matofali na zege.',
        image: 'https://picsum.photos/seed/brick-factory/200/200',
        imageHint: 'brick factory'
    },
     {
        id: 'kiwanda_cha_chuma',
        name: 'Kiwanda cha Chuma',
        description: 'Huyeyusha madini ya chuma na kuzalisha nondo.',
        image: 'https://picsum.photos/seed/steel-mill/200/200',
        imageHint: 'steel mill'
    },
    {
        id: 'kiwanda_cha_sukari',
        name: 'Kiwanda cha Sukari',
        description: 'Husindika miwa kuwa sukari.',
        image: 'https://picsum.photos/seed/sugar-factory/200/200',
        imageHint: 'sugar factory'
    },
    {
        id: 'mgahawa',
        name: 'Mgahawa',
        description: 'Huandaa vinywaji na vyakula.',
        image: 'https://picsum.photos/seed/restaurant/200/200',
        imageHint: 'restaurant interior'
    },
    {
        id: 'kiwanda_cha_mashine',
        name: 'Kiwanda cha Mashine',
        description: 'Huzalisha mashine mbalimbali za uzalishaji.',
        image: 'https://picsum.photos/seed/machine-factory/200/200',
        imageHint: 'machine factory'
    },
    {
        id: 'ofisi_ya_leseni',
        name: 'Ofisi ya Leseni',
        description: 'Hutoa leseni mbalimbali za uendeshaji.',
        image: 'https://picsum.photos/seed/license-office/200/200',
        imageHint: 'government office'
    },
    {
        id: 'kiwanda_cha_karatasi',
        name: 'Kiwanda cha Karatasi',
        description: 'Huzalisha karatasi kutoka kwenye mbao.',
        image: 'https://picsum.photos/seed/paper-mill/200/200',
        imageHint: 'paper mill'
    },
    {
        id: 'wizara_ya_madini',
        name: 'Wizara ya Madini',
        description: 'Inatoa vyeti vya uhalali wa uchimbaji madini.',
        image: 'https://picsum.photos/seed/ministry-minerals/200/200',
        imageHint: 'government building'
    },
    {
        id: 'kiwanda_cha_vitambaa',
        name: 'Kiwanda cha Vitambaa',
        description: 'Huzalisha vitambaa kutoka pamba na katani.',
        image: 'https://picsum.photos/seed/fabric-factory/200/200',
        imageHint: 'fabric factory'
    },
    {
        id: 'kiwanda_cha_ngozi',
        name: 'Kiwanda cha Ngozi',
        description: 'Husindika ngozi kutoka kwa wanyama.',
        image: 'https://picsum.photos/seed/leather-factory/200/200',
        imageHint: 'leather factory'
    },
    {
        id: 'kiwanda_cha_nguo',
        name: 'Kiwanda cha Nguo',
        description: 'Hushona mavazi mbalimbali.',
        image: 'https://picsum.photos/seed/garment-factory/200/200',
        imageHint: 'garment factory'
    },
    {
        id: 'kiwanda_cha_saa',
        name: 'Kiwanda cha Saa',
        description: 'Huzalisha saa na soli za viatu.',
        image: 'https://picsum.photos/seed/watch-factory/200/200',
        imageHint: 'watch factory'
    },
    {
        id: 'kiwanda_cha_vioo',
        name: 'Kiwanda cha Vioo',
        description: 'Huzalisha vioo kwa ajili ya saa na matumizi mengine.',
        image: 'https://picsum.photos/seed/glass-factory/200/200',
        imageHint: 'glass factory'
    },
    {
        id: 'kiwanda_cha_chokaa',
        name: 'Kiwanda cha Chokaa',
        description: 'Huzalisha chokaa.',
        image: 'https://picsum.photos/seed/lime-factory/200/200',
        imageHint: 'lime factory'
    },
    {
        id: 'kiwanda_cha_gundi',
        name: 'Kiwanda cha Gundi',
        description: 'Huzalisha gundi.',
        image: 'https://picsum.photos/seed/glue-factory/200/200',
        imageHint: 'glue factory'
    },
    {
        id: 'sonara',
        name: 'Sonara',
        description: 'Hutengeneza vito na mapambo ya thamani.',
        image: 'https://picsum.photos/seed/goldsmith/200/200',
        imageHint: 'goldsmith workshop'
    },
    {
        id: 'uchimbaji_mafuta',
        name: 'Uchimbaji Mafuta',
        description: 'Huchimba mafuta ghafi kutoka ardhini.',
        image: 'https://picsum.photos/seed/oil-rig/200/200',
        imageHint: 'oil rig'
    },
    {
        id: 'kiwanda_cha_disel',
        name: 'Kiwanda cha Disel',
        description: 'Husindika mafuta ghafi kuwa disel.',
        image: 'https://picsum.photos/seed/diesel-factory/200/200',
        imageHint: 'oil refinery'
    },
    {
        id: 'kiwanda_cha_petrol',
        name: 'Kiwanda cha Petrol',
        description: 'Husindika mafuta ghafi kuwa petroli.',
        image: 'https://picsum.photos/seed/petrol-factory/200/200',
        imageHint: 'oil refinery night'
    },
    // Electronics
    {
        id: 'kiwanda_cha_tv',
        name: 'Kiwanda cha TV',
        description: 'Huunganisha na kuzalisha televisheni.',
        image: 'https://picsum.photos/seed/tv-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_tablet',
        name: 'Kiwanda cha Tablet',
        description: 'Huunganisha na kuzalisha tablets.',
        image: 'https://picsum.photos/seed/tablet-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_smartphone',
        name: 'Kiwanda cha Smartphone',
        description: 'Huunganisha na kuzalisha simu janja.',
        image: 'https://picsum.photos/seed/smartphone-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_laptop',
        name: 'Kiwanda cha Laptop',
        description: 'Huunganisha na kuzalisha laptop.',
        image: 'https://picsum.photos/seed/laptop-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_processor',
        name: 'Kiwanda cha Processor',
        description: 'Huzalisha processor kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/cpu-factory/200/200',
        imageHint: 'clean room'
    },
    {
        id: 'kiwanda_cha_betri',
        name: 'Kiwanda cha Betri',
        description: 'Huzalisha betri kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/battery-factory/200/200',
        imageHint: 'battery production'
    },
    {
        id: 'kiwanda_cha_display',
        name: 'Kiwanda cha Display',
        description: 'Huzalisha display (screen) kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/display-factory/200/200',
        imageHint: 'screen manufacturing'
    },
    {
        id: 'kiwanda_cha_motherboard',
        name: 'Kiwanda cha Motherboard',
        description: 'Huzalisha motherboard kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/motherboard-factory/200/200',
        imageHint: 'circuit board'
    },
    {
        id: 'kiwanda_cha_vifaa_vya_ndani',
        name: 'Kiwanda cha Vifaa vya Ndani',
        description: 'Huzalisha komponenti ndogo ndogo za ndani.',
        image: 'https://picsum.photos/seed/components-factory/200/200',
        imageHint: 'small components'
    },
    {
        id: 'kiwanda_cha_usanidi',
        name: 'Kiwanda cha Usanidi',
        description: 'Huzalisha sehemu maalum za kielektroniki.',
        image: 'https://picsum.photos/seed/config-factory/200/200',
        imageHint: 'electronics assembly'
    },
    // Vehicle Chain
    {
        id: 'kiwanda_cha_spare',
        name: 'Kiwanda cha Spare',
        description: 'Huzalisha vipuri mbalimbali vya magari na vyombo vingine.',
        image: 'https://picsum.photos/seed/spare-parts-factory/200/200',
        imageHint: 'spare parts'
    },
    {
        id: 'kiwanda_cha_gari',
        name: 'Kiwanda cha Gari',
        description: 'Huunganisha magari na malori.',
        image: 'https://picsum.photos/seed/car-factory/200/200',
        imageHint: 'car factory'
    },
    {
        id: 'kiwanda_cha_pikipiki',
        name: 'Kiwanda cha Pikipiki',
        description: 'Huunganisha pikipiki.',
        image: 'https://picsum.photos/seed/motorcycle-factory/200/200',
        imageHint: 'motorcycle factory'
    },
    {
        id: 'kiwanda_cha_ndege',
        name: 'Kiwanda cha Ndege',
        description: 'Huunganisha ndege.',
        image: 'https://picsum.photos/seed/airplane-factory/200/200',
        imageHint: 'airplane factory'
    },
    {
        id: 'kiwanda_cha_meli',
        name: 'Kiwanda cha Meli',
        description: 'Huunganisha meli.',
        image: 'https://picsum.photos/seed/shipyard/200/200',
        imageHint: 'shipyard'
    },
    // Space Chain
    {
        id: 'kiwanda_cha_k_mashine',
        name: 'Kiwanda cha K Mashine',
        description: 'Huzalisha mashine maalum za "K-Series" kwa ajili ya teknolojia ya anga.',
        image: 'https://picsum.photos/seed/k-machine-factory/200/200',
        imageHint: 'advanced factory'
    },
    {
        id: 'kiwanda_cha_anga',
        name: 'Kiwanda cha Anga',
        description: 'Huunganisha sehemu muhimu za roketi na vyombo vya anga.',
        image: 'https://picsum.photos/seed/space-assembly/200/200',
        imageHint: 'space assembly'
    },
    {
        id: 'kiwanda_cha_roketi',
        name: 'Kiwanda cha Roketi',
        description: 'Huunganisha roketi kamili tayari kwa safari ya anga.',
        image: 'https://picsum.photos/seed/rocket-launch/200/200',
        imageHint: 'rocket launch'
    },
    // Research Buildings
    {
        id: 'utafiti_kilimo',
        name: 'Jengo la Utafiti wa Kilimo',
        description: 'Hufanya utafiti wa kuboresha ubora wa bidhaa za kilimo na chakula.',
        image: 'https://picsum.photos/seed/agri-research/200/200',
        imageHint: 'science laboratory'
    },
    {
        id: 'utafiti_ujenzi',
        name: 'Jengo la Utafiti wa Ujenzi',
        description: 'Hufanya utafiti wa kuboresha ubora wa vifaa vya ujenzi na madini.',
        image: 'https://picsum.photos/seed/build-research/200/200',
        imageHint: 'materials science'
    },
    {
        id: 'utafiti_nguo',
        name: 'Jengo la Utafiti wa Nguo',
        description: 'Hufanya utafiti wa kuboresha ubora wa nguo, vito, na bidhaa za mavazi.',
        image: 'https://picsum.photos/seed/fashion-research/200/200',
        imageHint: 'fashion design'
    },
    {
        id: 'utafiti_electroniki',
        name: 'Jengo la Utafiti wa Electroniki',
        description: 'Hufanya utafiti wa kuboresha ubora wa vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/elec-research/200/200',
        imageHint: 'electronics lab'
    },
    {
        id: 'utafiti_usafiri',
        name: 'Jengo la Utafiti wa Usafiri',
        description: 'Hufanya utafiti wa kuboresha ubora wa magari na vyombo vya usafiri.',
        image: 'https://picsum.photos/seed/vehicle-research/200/200',
        imageHint: 'automotive design'
    },
    {
        id: 'utafiti_anga',
        name: 'Jengo la Utafiti wa Anga',
        description: 'Hufanya utafiti wa kuboresha teknolojia za anga.',
        image: 'https://picsum.photos/seed/space-research/200/200',
        imageHint: 'aerospace engineering'
    },
];

const buildingStyles: Record<string, { body: string; roof: string }> = {
    // Shops
    duka_kuu: { body: 'bg-green-700/80', roof: 'border-b-green-800/90' },
    duka_la_ujenzi: { body: 'bg-orange-700/80', roof: 'border-b-orange-800/90' },
    duka_la_nguo_na_vito: { body: 'bg-pink-700/80', roof: 'border-b-pink-800/90' },
    duka_la_electroniki: { body: 'bg-blue-700/80', roof: 'border-b-blue-800/90' },
    duka_la_magari: { body: 'bg-red-700/80', roof: 'border-b-red-800/90' },
    duka_la_anga: { body: 'bg-purple-700/80', roof: 'border-b-purple-800/90' },
    
    // Production
    shamba: { body: 'bg-green-800/80', roof: 'border-b-green-950/90' },
    zizi: { body: 'bg-orange-800/80', roof: 'border-b-orange-950/90' },
    kiwanda_cha_samaki: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    uchimbaji_mawe: { body: 'bg-gray-700/80', roof: 'border-b-gray-800/90' },
    uchimbaji_mchanga: { body: 'bg-yellow-800/80', roof: 'border-b-yellow-950/90' },
    uchimbaji_chuma: { body: 'bg-slate-700/80', roof: 'border-b-slate-800/90' },
    uchimbaji_almasi: { body: 'bg-cyan-800/80', roof: 'border-b-cyan-950/90' },
    uchimbaji_dhahabu: { body: 'bg-yellow-700/80', roof: 'border-b-yellow-800/90' },
    uchimbaji_silver: { body: 'bg-slate-600/80', roof: 'border-b-slate-700/90' },
    uchimbaji_ruby: { body: 'bg-red-800/80', roof: 'border-b-red-950/90' },
    uchimbaji_tanzanite: { body: 'bg-purple-800/80', roof: 'border-b-purple-950/90' },
    uchimbaji_shaba: { body: 'bg-orange-700/80', roof: 'border-b-orange-800/90' },
    kiwanda_cha_umeme: { body: 'bg-yellow-600/80', roof: 'border-b-yellow-700/90' },
    kiwanda_cha_maji: { body: 'bg-blue-700/80', roof: 'border-b-blue-800/90' },
    kiwanda_cha_mbao: { body: 'bg-amber-800/80', roof: 'border-b-amber-950/90' },
    kiwanda_cha_saruji: { body: 'bg-gray-600/80', roof: 'border-b-gray-700/90' },
    kiwanda_cha_matofali: { body: 'bg-orange-900/80', roof: 'border-b-orange-950/90' },
    kiwanda_cha_chuma: { body: 'bg-slate-800/80', roof: 'border-b-slate-900/90' },
    kiwanda_cha_sukari: { body: 'bg-amber-600/80', roof: 'border-b-amber-700/90' },
    mgahawa: { body: 'bg-indigo-700/80', roof: 'border-b-indigo-800/90' },
    kiwanda_cha_mashine: { body: 'bg-gray-700/80', roof: 'border-b-gray-900/90' },
    ofisi_ya_leseni: { body: 'bg-blue-900/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_karatasi: { body: 'bg-stone-400/80', roof: 'border-b-stone-500/90' },
    wizara_ya_madini: { body: 'bg-yellow-900/80', roof: 'border-b-yellow-950/90' },
    kiwanda_cha_vitambaa: { body: 'bg-pink-800/80', roof: 'border-b-pink-950/90' },
    kiwanda_cha_ngozi: { body: 'bg-amber-900/80', roof: 'border-b-amber-950/90' },
    kiwanda_cha_nguo: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_saa: { body: 'bg-slate-700/80', roof: 'border-b-slate-800/90' },
    kiwanda_cha_vioo: { body: 'bg-cyan-700/80', roof: 'border-b-cyan-800/90' },
    kiwanda_cha_chokaa: { body: 'bg-stone-700/80', roof: 'border-b-stone-800/90' },
    kiwanda_cha_gundi: { body: 'bg-yellow-700/80', roof: 'border-b-yellow-800/90' },
    sonara: { body: 'bg-yellow-800/80', roof: 'border-b-yellow-950/90' },
    uchimbaji_mafuta: { body: 'bg-gray-900/80', roof: 'border-b-black/90' },
    kiwanda_cha_disel: { body: 'bg-gray-700/80', roof: 'border-b-gray-800/90' },
    kiwanda_cha_petrol: { body: 'bg-orange-800/80', roof: 'border-b-orange-900/90' },
    // Electronics
    kiwanda_cha_tv: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_tablet: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_smartphone: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_laptop: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_processor: { body: 'bg-purple-800/80', roof: 'border-b-purple-950/90' },
    kiwanda_cha_betri: { body: 'bg-green-800/80', roof: 'border-b-green-950/90' },
    kiwanda_cha_display: { body: 'bg-cyan-800/80', roof: 'border-b-cyan-950/90' },
    kiwanda_cha_motherboard: { body: 'bg-green-900/80', roof: 'border-b-green-950/90' },
    kiwanda_cha_vifaa_vya_ndani: { body: 'bg-slate-700/80', roof: 'border-b-slate-800/90' },
    kiwanda_cha_usanidi: { body: 'bg-gray-700/80', roof: 'border-b-gray-800/90' },
    // Vehicle Chain
    kiwanda_cha_spare: { body: 'bg-yellow-800/80', roof: 'border-b-yellow-950/90' },
    kiwanda_cha_gari: { body: 'bg-red-800/80', roof: 'border-b-red-950/90' },
    kiwanda_cha_pikipiki: { body: 'bg-blue-800/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_ndege: { body: 'bg-cyan-800/80', roof: 'border-b-cyan-950/90' },
    kiwanda_cha_meli: { body: 'bg-indigo-800/80', roof: 'border-b-indigo-950/90' },
    // Space Chain
    kiwanda_cha_k_mashine: { body: 'bg-purple-800/80', roof: 'border-b-purple-950/90' },
    kiwanda_cha_anga: { body: 'bg-blue-900/80', roof: 'border-b-blue-950/90' },
    kiwanda_cha_roketi: { body: 'bg-red-900/80', roof: 'border-b-red-950/90' },
    // Research Buildings
    utafiti_kilimo: { body: 'bg-lime-800/80', roof: 'border-b-lime-950/90' },
    utafiti_ujenzi: { body: 'bg-stone-800/80', roof: 'border-b-stone-950/90' },
    utafiti_nguo: { body: 'bg-fuchsia-800/80', roof: 'border-b-fuchsia-950/90' },
    utafiti_electroniki: { body: 'bg-sky-800/80', roof: 'border-b-sky-950/90' },
    utafiti_usafiri: { body: 'bg-rose-800/80', roof: 'border-b-rose-950/90' },
    utafiti_anga: { body: 'bg-violet-800/80', roof: 'border-b-violet-950/90' },
    default: { body: 'bg-gray-700/80', roof: 'border-b-gray-600/90' }
};

export const SHOP_BUILDING_IDS = [
    'duka_kuu',
    'duka_la_ujenzi',
    'duka_la_nguo_na_vito',
    'duka_la_electroniki',
    'duka_la_magari',
    'duka_la_anga',
];

export const RESEARCH_BUILDING_IDS = [
    'utafiti_kilimo',
    'utafiti_ujenzi',
    'utafiti_nguo',
    'utafiti_electroniki',
    'utafiti_usafiri',
    'utafiti_anga',
];

const productCategoryToShopMap: Record<string, string> = {
    'Construction': 'duka_la_ujenzi',
    'Raw Material': 'duka_la_ujenzi',
    'Madini': 'duka_la_ujenzi',
    'Mafuta': 'duka_la_ujenzi',
    'Agriculture': 'duka_kuu',
    'Food': 'duka_kuu',
    'Product': 'duka_kuu',
    'Mavazi': 'duka_la_nguo_na_vito',
    'Electronics': 'duka_la_electroniki',
    'Spares': 'duka_la_magari',
    'Vehicles': 'duka_la_magari',
    'Space': 'duka_la_anga',
    'Documents': 'duka_kuu', // Or a specific admin shop if created
    'Vifaa': 'duka_la_ujenzi',
    'Utafiti': 'duka_kuu' // Research items aren't typically sold, but as a fallback
};

export function Dashboard({ 
    buildingSlots, 
    inventory, 
    stars, 
    onBuild, 
    onStartProduction, 
    onStartSelling, 
    onBoostConstruction, 
    onUpgradeBuilding,
    onUpgradeQuality,
    onDemolishBuilding, 
    onBuyMaterial, 
    onUnlockSlot,
    onCardClick,
    dialogState,
    setDialogState,
    selectedSlotIndex
}: any) {
  
  const [buildDialogStep, setBuildDialogStep] = React.useState<'list' | 'details'>('list');
  const [selectedBuildingForBuild, setSelectedBuildingForBuild] = React.useState<BuildingType | null>(null);
  const [buildingSearch, setBuildingSearch] = React.useState('');
  const [now, setNow] = React.useState(Date.now());
  
  // State for production/selling dialog
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = React.useState<InventoryItem | null>(null);
  const [productionQuantity, setProductionQuantity] = React.useState(1);
  const [sellingPrice, setSellingPrice] = React.useState(0);
  const [priceFloor, setPriceFloor] = React.useState(0);
  const [priceCeiling, setPriceCeiling] = React.useState(0);
  
  const [boostAmount, setBoostAmount] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectBuildingToShowDetails = (building: BuildingType) => {
    setSelectedBuildingForBuild(building);
    setBuildDialogStep('details');
  };

  const handleBuildDialogBack = () => {
    setBuildDialogStep('list');
    setSelectedBuildingForBuild(null);
  };

  const hasEnoughMaterials = (costs: {name: string, quantity: number}[]): boolean => {
      if (!costs) return false;
      return costs.every(cost => {
          const inventoryItem = inventory.find((item: InventoryItem) => item.item === cost.name);
          return inventoryItem && inventoryItem.quantity >= cost.quantity;
      });
  };

  const handleConfirmBuild = () => {
    if (selectedSlotIndex !== null && selectedBuildingForBuild) {
        const costs = buildingData[selectedBuildingForBuild.id]?.buildCost;
        if (!hasEnoughMaterials(costs)) {
            return;
        }
        onBuild(selectedSlotIndex, selectedBuildingForBuild);
        setDialogState({ ...dialogState, build: false });
    }
  };


  const handleOpenProductionDialog = () => {
    setDialogState({ ...dialogState, manage: false, production: true });
    setSelectedRecipe(null);
    setSelectedInventoryItem(null);
    setProductionQuantity(1);
  };

  const handleConfirmProductionOrSale = () => {
    if (selectedSlotIndex === null) return;
    const slot = buildingSlots[selectedSlotIndex];
    if (!slot || !slot.building) return;

    const buildingInfo = buildingData[slot.building.id];
    
    // Logic for producers (factories, farms)
    if (selectedRecipe && productionQuantity > 0) {
        const inputs = selectedRecipe.inputs || [];
        const neededInputs = inputs.map(input => ({
          name: input.name,
          quantity: input.quantity * productionQuantity
        }));
        if (!hasEnoughMaterials(neededInputs)) {
           return;
        }
        const totalDurationMs = calculateProductionTime(productionQuantity);
        onStartProduction(selectedSlotIndex, selectedRecipe, productionQuantity, totalDurationMs);
    }
    // Logic for sellers (shops)
    else if (selectedInventoryItem && productionQuantity > 0) {
      if (selectedInventoryItem.quantity < productionQuantity) {
        return; // Not enough in inventory
      }
      
      const totalDurationMs = calculateSaleTime(productionQuantity);
      onStartSelling(selectedSlotIndex, selectedInventoryItem, productionQuantity, sellingPrice, totalDurationMs);
    }
    
    setDialogState({ ...dialogState, production: false });
    setSelectedRecipe(null);
    setSelectedInventoryItem(null);
  }
  
  const handleConfirmBoost = () => {
      if (selectedSlotIndex !== null && boostAmount > 0) {
          onBoostConstruction(selectedSlotIndex, boostAmount);
      }
      setDialogState({ ...dialogState, boost: false });
  }

  const handleConfirmUnlock = () => {
    if (selectedSlotIndex !== null) {
      onUnlockSlot(selectedSlotIndex);
    }
    setDialogState({ ...dialogState, unlock: false });
  };

  const handleConfirmDemolish = () => {
      if(selectedSlotIndex !== null) {
          onDemolishBuilding(selectedSlotIndex);
      }
      setDialogState({ ...dialogState, demolish: false, manage: false });
  }
  
  const handleTriggerUpgrade = () => {
    if(selectedSlotIndex !== null) {
        const slot = buildingSlots[selectedSlotIndex];
        if (!slot?.building) return;
        const upgradeCosts = buildingData[slot.building.id].upgradeCost(slot.level + 1);

        if (!hasEnoughMaterials(upgradeCosts)) {
            return;
        }
        onUpgradeBuilding(selectedSlotIndex);
        setDialogState({ ...dialogState, manage: false });
    }
  }

    const handleTriggerQualityUpgrade = () => {
        if(selectedSlotIndex !== null) {
            onUpgradeQuality(selectedSlotIndex);
            setDialogState({ ...dialogState, manage: false });
        }
    }


  const selectedSlot = selectedSlotIndex !== null ? buildingSlots[selectedSlotIndex] : null;
  const isSelectedBuildingShop = selectedSlot?.building ? SHOP_BUILDING_IDS.includes(selectedSlot.building.id) : false;
  const isSelectedBuildingResearch = selectedSlot?.building ? RESEARCH_BUILDING_IDS.includes(selectedSlot.building.id) : false;
  const isProductionBuilding = selectedSlot?.building ? !isSelectedBuildingShop && !isSelectedBuildingResearch : false;

  const buildingRecipes = selectedSlot?.building
    ? recipes.filter((recipe) => recipe.buildingId === selectedSlot.building!.id)
    : [];

  const getShopInventory = (): InventoryItem[] => {
    if (!selectedSlot?.building || !isSelectedBuildingShop) return [];
  
    const shopId = selectedSlot.building.id;
  
    return inventory.filter((item: InventoryItem) => {
      const productInfo = encyclopediaData.find(e => e.name === item.item);
      if (!productInfo) return false;
      const targetShopId = productCategoryToShopMap[productInfo.category] || 'duka_kuu';
      return targetShopId === shopId;
    });
  };

  const shopInventory = getShopInventory();


  const hasEnoughInputsForProduction = (recipe: Recipe, quantity: number) => {
    if (!recipe.inputs) return true;
    return recipe.inputs.every(input => {
        const inventoryItem = inventory.find((item: InventoryItem) => item.item === input.name);
        const neededQuantity = input.quantity * quantity;
        return inventoryItem && inventoryItem.quantity >= neededQuantity;
    });
  }

    const calculateProductionTime = (quantity: number): number => {
        if (!selectedSlot || !selectedRecipe) return 0;
        const buildingInfo = buildingData[selectedRecipe.buildingId];
        // Base rate is units per hour
        const levelBonus = (1 + (selectedSlot.level - 1) * 0.4);
        const qualityBonus = (1 + (selectedSlot.quality || 0) * 0.20);
        const effectiveRatePerHr = buildingInfo.productionRate * levelBonus * qualityBonus;

        if (effectiveRatePerHr <= 0) return Infinity;

        const totalBatches = quantity;
        const totalSeconds = (totalBatches / effectiveRatePerHr) * 3600;
        return totalSeconds * 1000; // time in ms
    };


    const calculateSaleTime = (quantity: number): number => {
        if (!selectedSlot || !selectedInventoryItem || !selectedSlot.building) return 0;

        const shopInfo = buildingData[selectedSlot.building.id];
        const saleMultiplier = shopInfo.saleRateMultiplier || 1;
        
        // We need the base production rate of the item being sold to calculate sale time
        const itemRecipe = recipes.find(r => r.output.name === selectedInventoryItem.item);
        const itemBuildingInfo = itemRecipe ? buildingData[itemRecipe.buildingId] : null;
        const baseProductionRate = itemBuildingInfo ? itemBuildingInfo.productionRate : 100; // Fallback rate

        // Time in seconds for one item, adjusted by shop level and sale multiplier
        const saleRatePerHr = (baseProductionRate * saleMultiplier) * (1 + (selectedSlot.level - 1) * 0.4);
        if (saleRatePerHr <= 0) return 5000 * quantity; // Avoid division by zero, provide a fallback time

        const totalSeconds = (quantity / saleRatePerHr) * 3600;
        return totalSeconds * 1000; // time in ms
    }
  
  const calculateProductionCost = (recipe: Recipe, quantity: number): number => {
    let totalCost = 0;
    if (!recipe.inputs) return 0;
    for (const input of recipe.inputs) {
      const encyclopediaEntry = encyclopediaData.find(e => e.name === input.name);
      const pricePerUnit = parseFloat(encyclopediaEntry?.properties.find(p => p.label === "Market Cost")?.value.replace('$', '').replace(/,/g, '') || '0');
      totalCost += pricePerUnit * input.quantity * quantity;
    }
    return totalCost;
  };

  const timeReductionPerStar = 3 * 60 * 1000; // 3 minutes
  const timeReduction = boostAmount * timeReductionPerStar;
  const remainingTime = selectedSlot?.construction ? selectedSlot.construction.endTime - now : 0;
  const maxStarsToUse = Math.min(stars, Math.ceil(remainingTime / timeReductionPerStar));
  
  const upgradeCosts = selectedSlot?.building ? buildingData[selectedSlot.building.id]?.upgradeCost(selectedSlot.level + 1) : [];
  const canAffordUpgrade = hasEnoughMaterials(upgradeCosts);

  const buildCosts = selectedBuildingForBuild ? buildingData[selectedBuildingForBuild.id]?.buildCost : [];
  const canAffordBuild = hasEnoughMaterials(buildCosts);

  const buildingCategories = React.useMemo(() => {
    return availableBuildings.reduce((acc, building) => {
        const firstRecipe = recipes.find(r => r.buildingId === building.id);
        let category = 'Other';
        if (SHOP_BUILDING_IDS.includes(building.id)) {
            category = 'Shops';
        } else if (RESEARCH_BUILDING_IDS.includes(building.id)) {
            category = 'Research';
        } else if (firstRecipe) {
            const product = encyclopediaData.find(p => p.name === firstRecipe.output.name);
            category = product?.category || 'Production';
        } else {
             if (building.id.includes('uchimbaji')) category = 'Mining';
             else if (building.id.includes('kiwanda')) category = 'Factories';
        }
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(building);
        return acc;
    }, {} as Record<string, BuildingType[]>);
  }, []);
  
    const filteredBuildingCategories = React.useMemo(() => {
        if (!buildingSearch) return buildingCategories;

        const lowercasedFilter = buildingSearch.toLowerCase();
        const filtered: Record<string, BuildingType[]> = {};

        for (const category in buildingCategories) {
            const matchingBuildings = buildingCategories[category].filter(building =>
                building.name.toLowerCase().includes(lowercasedFilter)
            );

            if (matchingBuildings.length > 0) {
                filtered[category] = matchingBuildings;
            }
        }
        return filtered;
    }, [buildingSearch, buildingCategories]);

    const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        const clampedValue = Math.max(priceFloor, Math.min(value, priceCeiling));
        setSellingPrice(clampedValue);
    };

    const calculateUnlockCost = (slotIndex: number) => {
        if (slotIndex < 10) return 0;
        const baseCost = 650;
        const exponent = slotIndex - 10;
        return Math.floor(baseCost * Math.pow(1.6, exponent));
    };

    const unlockCost = selectedSlotIndex !== null ? calculateUnlockCost(selectedSlotIndex) : 0;

    const getQualityUpgradeInfo = () => {
        if (!selectedSlot || !selectedSlot.building || !isProductionBuilding) return null;
        
        const currentQuality = selectedSlot.quality || 0;
        if (currentQuality >= 5) return { canUpgrade: false, requiredItem: '', requiredAmount: 0 };

        const buildingCategory = encyclopediaData.find(e => e.recipe?.buildingId === selectedSlot.building?.id)?.category;
        
        let researchCategory = '';
        if (buildingCategory === 'Agriculture' || buildingCategory === 'Food') researchCategory = 'Kilimo';
        else if (buildingCategory === 'Construction' || buildingCategory === 'Raw Material' || buildingCategory === 'Madini' || buildingCategory === 'Mafuta') researchCategory = 'Ujenzi';
        else if (buildingCategory === 'Mavazi') researchCategory = 'Nguo';
        else if (buildingCategory === 'Electronics' || buildingCategory === 'Vifaa') researchCategory = 'Electroniki';
        else if (buildingCategory === 'Vehicles' || buildingCategory === 'Spares') researchCategory = 'Usafiri';
        else if (buildingCategory === 'Space') researchCategory = 'Anga';
        else return null;

        const requiredItem = `Q${currentQuality + 1} - Utafiti ${researchCategory}`;
        const requiredAmount = 1000 * Math.pow(3, currentQuality);
        const invItem = inventory.find((i:InventoryItem) => i.item === requiredItem);
        const hasEnough = invItem ? invItem.quantity >= requiredAmount : false;

        return { canUpgrade: hasEnough, requiredItem, requiredAmount, currentAmount: invItem?.quantity || 0 };
    }

    const qualityUpgradeInfo = getQualityUpgradeInfo();


  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct or a building to produce.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildingSlots.map((slot: BuildingSlot, index: number) => {
          const slotName = `Slot ${String.fromCharCode(65 + index)}`;
          return (
            <Card
              key={index}
              onClick={() => onCardClick(slot, index)}
              className={cn(
                "flex flex-col items-center justify-between h-32 bg-gray-800/80 border-gray-700 overflow-hidden group relative cursor-pointer aspect-square p-2",
                slot.building ? "" : "hover:bg-gray-700/80 transition-colors"
              )}
            >
              <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                {slotName}
              </div>
              
              {/* === BUILT BUILDING VIEW === */}
              {slot.building && (
                <>
                    <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 flex items-center gap-1">
                      <Award className="h-2.5 w-2.5 text-yellow-400"/> 
                      <span>Q{slot.quality ?? 0}</span>
                    </div>
                    <div className="w-full h-4/6 relative flex items-center justify-center">
                        <div className={cn("w-4/5 h-full rounded-t-md flex items-center justify-center", (buildingStyles[slot.building.id] || buildingStyles.default).body)}>
                            <p className="text-3xl font-bold">🏢</p>
                        </div>
                        <div 
                            className={cn("absolute top-0 w-full h-0 border-b-[30px]", (buildingStyles[slot.building.id] || buildingStyles.default).roof)}
                            style={{
                                borderLeft: '20px solid transparent',
                                borderRight: '20px solid transparent',
                            }}
                        />
                    </div>

                    {slot.activity?.type === 'sell' && ( <div className="absolute top-8 right-2 p-1 bg-green-500/80 rounded-full animate-pulse"><CircleDollarSign className="h-4 w-4 text-white" /></div>)}
                    {slot.activity?.type === 'produce' && (<div className="absolute top-8 right-2 p-1 bg-blue-500/80 rounded-full animate-pulse"><Tractor className="h-4 w-4 text-white" /></div>)}
                    {slot.construction && (<div className="absolute top-8 right-2 p-1 bg-orange-500/80 rounded-full animate-pulse"><Hammer className="h-4 w-4 text-white" /></div>)}
                    {!slot.activity && !slot.construction && (<div className="absolute top-8 right-2 p-1 bg-gray-900/80 rounded-full"><Settings className="h-4 w-4 text-white" /></div>)}
                    
                    <div className="absolute bottom-0 p-2 text-center w-full bg-black/60">
                        <p className="text-xs font-bold truncate">{slot.building.name} (Lvl {slot.level || 0})</p>
                        {slot.activity ? (
                            <div className='text-xs font-mono text-green-300 flex items-center justify-center gap-2'>
                                <span>{formatTime(slot.activity.endTime - now)}</span>
                                <span>| {slot.activity!.recipeId}</span>
                            </div>
                        ) : slot.construction ? (
                            <div className='text-xs font-mono text-orange-300 flex items-center justify-center gap-2'>
                                <span>{formatTime(slot.construction.endTime - now)}</span>
                                <span>| Inaboreshwa</span>
                            </div>
                        ) : (
                            <p className='text-xs text-green-400 font-semibold'>Available</p>
                        )}
                    </div>
                </>
              )}

              {/* === EMPTY SLOT VIEW (LOCKED OR UNLOCKED) === */}
              {!slot.building && (
                <>
                  <div className="w-full h-full relative flex flex-col items-center justify-center">
                    <div className="w-4/5 h-4/5 rounded-md flex flex-col items-center justify-center bg-gray-700/50 border-2 border-dashed border-gray-500 group-hover:border-yellow-400 transition-colors">
                      {!slot.locked && (
                        <>
                          <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-yellow-300 transition-colors" />
                          <p className="text-xs font-bold truncate text-gray-400 group-hover:text-yellow-200 transition-colors mt-2">Build</p>
                        </>
                      )}
                    </div>
                  </div>

                  {slot.locked && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer">
                          <Lock className="h-8 w-8 text-yellow-400/80 mb-2" />
                           <p className="text-sm font-bold text-yellow-300 flex items-center justify-center gap-1">
                              {calculateUnlockCost(index).toLocaleString()} <Star className="h-4 w-4" />
                          </p>
                      </div>
                  )}
                </>
              )}
            </Card>
          )
        })}
      </div>

      {/* Build Dialog */}
      <Dialog open={dialogState.build} onOpenChange={(open) => setDialogState({ ...dialogState, build: open })}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white flex flex-col max-h-[90vh]">
            <DialogHeader>
              {buildDialogStep === 'details' && selectedBuildingForBuild && (
                <Button variant="ghost" size="icon" onClick={handleBuildDialogBack} className='absolute left-4 top-4'>
                  <ArrowLeft />
                </Button>
              )}
              <DialogTitle>
                {buildDialogStep === 'list' ? 'Chagua Jengo' : `Jenga ${selectedBuildingForBuild?.name}`}
              </DialogTitle>
              <DialogDescription>
                {buildDialogStep === 'list' 
                  ? 'Tafuta na chagua jengo unalotaka kujenga kwenye kiwanja hiki.'
                  : 'Hakiki mahitaji na anza ujenzi.'}
              </DialogDescription>
            </DialogHeader>
            <div className='flex-grow overflow-y-auto -mr-6 pr-6'>
                {buildDialogStep === 'list' && (
                <div className='pt-4 flex flex-col gap-4'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input 
                            placeholder='Tafuta jengo...'
                            value={buildingSearch}
                            onChange={(e) => setBuildingSearch(e.target.value)}
                            className='pl-10 bg-gray-800 border-gray-600 h-9'
                        />
                    </div>
                    <div className='space-y-4'>
                        {Object.entries(filteredBuildingCategories).map(([category, buildings]) => (
                            <div key={category}>
                                <h3 className="font-bold text-sm text-gray-400 px-2 mb-2">{category}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {buildings.map((b) => (
                                        <Card 
                                            key={b.id} 
                                            className="bg-gray-800 hover:bg-gray-700/80 border-gray-700 cursor-pointer flex flex-col items-center justify-center p-2 text-center h-24"
                                            onClick={() => handleSelectBuildingToShowDetails(b)}
                                        >
                                        <p className="text-2xl">🏢</p>
                                        <p className="font-semibold mt-1 text-xs">{b.name}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {buildDialogStep === 'details' && selectedBuildingForBuild && (
                <div className='py-4 space-y-4'>
                    <p className='text-sm text-gray-400'>{selectedBuildingForBuild.description}</p>
                    <Separator className='bg-gray-600'/>
                    <div>
                        <h3 className='font-semibold mb-2'>Vifaa Vinavyohitajika</h3>
                        <div className="space-y-1">
                            {buildCosts && buildCosts.map((cost: any) => {
                                const invItem = inventory.find((i: any) => i.item === cost.name);
                                const has = invItem?.quantity || 0;
                                const needed = cost.quantity;
                                const hasEnough = has >= needed;
                                return (
                                    <div key={cost.name} className={cn('flex justify-between items-center p-1 rounded-md text-xs', hasEnough ? 'bg-gray-800/50' : 'bg-red-900/30')}>
                                        <span>{cost.name}</span>
                                        <div className='flex items-center gap-1'>
                                            <span className={cn('font-mono', hasEnough ? 'text-gray-300' : 'text-red-400')}>
                                                {has.toLocaleString()} / {needed.toLocaleString()}
                                            </span>
                                            {!hasEnough && (
                                                <Button size="sm" variant="secondary" className="h-5 text-[10px] px-1.5" onClick={() => onBuyMaterial(cost.name, needed - has)}>
                                                    Nunua
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                )}
            </div>
             {buildDialogStep === 'details' && (
                <DialogFooter className="mt-auto pt-4">
                    <Button
                        className='w-full bg-green-600 hover:bg-green-700'
                        onClick={handleConfirmBuild}
                        disabled={!canAffordBuild}
                    >
                        Jenga kwa Dakika 15
                    </Button>
                </DialogFooter>
             )}
          </DialogContent>
      </Dialog>
        
      {/* Management Dialog */}
      <Dialog open={dialogState.manage} onOpenChange={(open) => setDialogState({ ...dialogState, manage: open })}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white flex flex-col max-h-[90vh] max-w-4xl">
            <DialogHeader>
                <DialogTitle>Simamia {selectedSlot?.building?.name}</DialogTitle>
                <DialogDescription>
                    Chagua kitendo cha kufanya kwenye jengo hili.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className='-mr-6 pr-6 flex-grow'>
                 <div className='py-4 space-y-4'>
                    <Button className='w-full justify-start bg-green-600 hover:bg-green-700' onClick={handleOpenProductionDialog}>
                        {isSelectedBuildingShop ? <Store className='mr-2'/> : <Tractor className='mr-2'/>} 
                        {isSelectedBuildingShop ? "Anza Kuuza" : "Anza Uzalishaji"}
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Upgrade Building Column */}
                        <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex flex-col'>
                            <h3 className="text-lg font-semibold mb-2">Boresha Jengo</h3>
                             <Button className='w-full justify-start' variant="secondary" onClick={handleTriggerUpgrade} disabled={!canAffordUpgrade}>
                                <ChevronsUp className='mr-2'/> Boresha hadi Level {(selectedSlot?.level || 0) + 1}
                            </Button>
                            <Separator className='my-3 bg-gray-600'/>
                            <div className='space-y-1 flex-grow'>
                                <p className='font-semibold mb-1 text-xs'>Gharama ya Kuboresha:</p>
                                <div className="space-y-1">
                                    {upgradeCosts && upgradeCosts.map((cost: any) => {
                                        const invItem = inventory.find((i: any) => i.item === cost.name);
                                        const has = invItem?.quantity || 0;
                                        const needed = cost.quantity;
                                        const hasEnough = has >= needed;
                                        return (
                                            <div key={cost.name} className='flex justify-between items-center p-1 rounded-md text-xs'>
                                                <span className={cn(hasEnough ? 'text-gray-300' : 'text-red-400')}>
                                                    {cost.name}
                                                </span>
                                                <div className='flex items-center gap-1'>
                                                    <span className={cn('font-mono', hasEnough ? 'text-gray-300' : 'text-red-400')}>
                                                        {has.toLocaleString()}/{needed.toLocaleString()}
                                                    </span>
                                                    {!hasEnough && (
                                                        <Button size="sm" variant="secondary" className="h-5 px-1.5 text-[10px]" onClick={() => onBuyMaterial(cost.name, needed - has)}>
                                                            Nunua
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Quality Column */}
                        <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex flex-col'>
                            <h3 className="text-lg font-semibold mb-2">Fanya Utafiti (Boresha Ubora)</h3>
                            <div className="flex-grow space-y-3">
                                <div className="text-center bg-gray-900/50 p-2 rounded-md">
                                    <p className="text-xs text-gray-400">Ubora wa Sasa</p>
                                    <p className="text-xl font-bold flex items-center justify-center gap-2">
                                        <Award className="text-yellow-400 h-5 w-5"/>
                                        Q{selectedSlot?.quality || 0}
                                    </p>
                                </div>
                                {isProductionBuilding && qualityUpgradeInfo ? (
                                    <>
                                        {qualityUpgradeInfo.requiredItem ? (
                                            <>
                                                <Button 
                                                    className='w-full justify-start' 
                                                    variant="secondary" 
                                                    onClick={handleTriggerQualityUpgrade}
                                                    disabled={!qualityUpgradeInfo.canUpgrade}
                                                >
                                                    <ChevronsUp className='mr-2'/> Boresha hadi Q{(selectedSlot?.quality || 0) + 1}
                                                </Button>
                                                <div className='space-y-1 text-xs'>
                                                    <p className='font-semibold mb-1'>Gharama ya Utafiti:</p>
                                                    <div className='flex justify-between items-center p-1 rounded-md'>
                                                        <span className={cn(qualityUpgradeInfo.canUpgrade ? 'text-gray-300' : 'text-red-400')}>
                                                            {qualityUpgradeInfo.requiredItem}
                                                        </span>
                                                        <span className={cn('font-mono', qualityUpgradeInfo.canUpgrade ? 'text-gray-300' : 'text-red-400')}>
                                                            {qualityUpgradeInfo.currentAmount.toLocaleString()}/{qualityUpgradeInfo.requiredAmount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                             <p className="text-center text-sm text-green-400 p-4 bg-green-900/30 rounded-md">Umefikia kiwango cha juu cha ubora!</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 p-4 bg-gray-900/30 rounded-md">Majengo ya maduka na utafiti hayafanyiwi utafiti wa ubora.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button className='w-full justify-start' variant="destructive" onClick={() => setDialogState({ ...dialogState, demolish: true })}>
                        <Trash2 className='mr-2'/> Futa Jengo
                    </Button>
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>

        {/* Demolish Confirmation Dialog */}
        <AlertDialog open={dialogState.demolish} onOpenChange={(open) => setDialogState({ ...dialogState, demolish: open })}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Una uhakika?</AlertDialogTitle>
                <AlertDialogDescription>
                    Kitendo hiki hakiwezi kutenduliwa. Ukifuta jengo hili, utapoteza maendeleo yote na rasilimali zilizotumika.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Ghairi</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDemolish} className={cn(buttonVariants({ variant: "destructive" }))}>
                    Futa
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

         {/* Unlock Slot Confirmation Dialog */}
        <AlertDialog open={dialogState.unlock} onOpenChange={(open) => setDialogState({ ...dialogState, unlock: open })}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Fungua Nafasi ya Ujenzi</AlertDialogTitle>
                <AlertDialogDescription>
                    Sehemu hii imefungwa. Tumia star boost <strong className='text-yellow-300 inline-flex items-center gap-1'>{unlockCost.toLocaleString()} <Star className='h-4 w-4'/></strong> kufungua eneo hili.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Ghairi</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmUnlock} className={cn(buttonVariants({ variant: "default" }), 'bg-yellow-500 hover:bg-yellow-600')} disabled={stars < unlockCost}>
                    {stars < unlockCost ? "Nyota Hazitoshi" : "Fungua"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


        {/* Production/Selling Dialog */}
        <Dialog open={dialogState.production} onOpenChange={(open) => setDialogState({ ...dialogState, production: open })}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{isSelectedBuildingShop ? 'Uza Bidhaa' : 'Uzalishaji'}: {selectedSlot?.building?.name} (Lvl {selectedSlot?.level})</DialogTitle>
                    <DialogDescription>
                        {isSelectedBuildingShop ? 'Chagua bidhaa, weka kiasi na bei, na anza kuuza.' : 'Chagua bidhaa, weka kiasi, na anza mchakato wa uzalishaji.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 pt-4 flex-grow overflow-hidden">
                    {/* Recipe/Item List */}
                    <div className="col-span-1 flex flex-col gap-2">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col gap-2 pr-4">
                                {isSelectedBuildingShop ? (
                                    shopInventory.length > 0 ? (
                                        shopInventory.map((item: InventoryItem) => (
                                            <Button
                                            key={item.item}
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start h-auto py-2 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white",
                                                selectedInventoryItem?.item === item.item && "bg-blue-600 border-blue-400"
                                            )}
                                            onClick={() => setSelectedInventoryItem(item)}
                                            >
                                            {item.item}
                                            </Button>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Hakuna bidhaa zinazohusiana na duka hili kwenye ghala.</p>
                                    )
                                ) : (
                                    buildingRecipes.length > 0 ? (
                                        buildingRecipes.map((recipe: Recipe) => (
                                            <Button
                                            key={recipe.id}
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start h-auto py-2 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white",
                                                selectedRecipe?.id === recipe.id && "bg-blue-600 border-blue-400"
                                            )}
                                            onClick={() => setSelectedRecipe(recipe)}
                                            >
                                            {recipe.output.name}
                                            </Button>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Hakuna mapishi kwa jengo hili.</p>
                                    )
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    {/* Production/Sale Details */}
                    <div className="col-span-2 flex-grow">
                        <ScrollArea className="h-full">
                            <div className='pr-4'>
                                {selectedRecipe ? ( // PRODUCER VIEW
                                    <div className='space-y-4 p-4 bg-gray-800/50 rounded-lg'>
                                        <h3 className='text-xl font-bold'>{selectedRecipe.output.name}</h3>
                                        <div>
                                            <h4 className='font-semibold mb-2'>Vifaa Vinavyohitajika</h4>
                                            <div className='text-sm space-y-2 text-gray-300 list-disc list-inside'>
                                            {selectedRecipe.inputs.length > 0 ? selectedRecipe.inputs.map(input => {
                                                const invItem = inventory.find((i: InventoryItem) => i.item === input.name);
                                                const has = invItem?.quantity || 0;
                                                const needed = input.quantity * productionQuantity;
                                                const hasEnough = has >= needed;
                                                return (
                                                <div key={input.name} className='flex justify-between items-center'>
                                                    <span className={cn(hasEnough ? 'text-gray-300' : 'text-red-400')}>
                                                        {needed.toLocaleString()}x {input.name} (Una: {has.toLocaleString()})
                                                    </span>
                                                    {!hasEnough && (
                                                        <Button size="sm" variant="secondary" className="h-6 px-2" onClick={async () => await onBuyMaterial(input.name, needed - has)}>
                                                            Nunua
                                                        </Button>
                                                    )}
                                                </div>
                                                )
                                            }) : <p className='text-sm text-gray-400 italic'>Hakuna vifaa vinavyohitajika.</p>}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                        <Label htmlFor='quantity'>Idadi ya Kuzalisha</Label>
                                        <Input 
                                            id="quantity" type="number" min="1" value={productionQuantity}
                                            onChange={(e) => setProductionQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className='bg-gray-700 border-gray-600'
                                        />
                                        </div>
                                        <Separator className='my-4 bg-gray-600'/>
                                        <div className='space-y-3'>
                                            <div className='flex justify-between items-center'>
                                            <span className='text-gray-400'>Gharama ya Uzalishaji:</span>
                                            <span className='font-bold'>${calculateProductionCost(selectedRecipe, productionQuantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                            <span className='text-gray-400'>Muda wa Uzalishaji:</span>
                                            <span className='font-bold'>{formatTime(calculateProductionTime(productionQuantity))}</span>
                                            </div>
                                            <Button
                                            className='w-full bg-green-600 hover:bg-green-700'
                                            onClick={handleConfirmProductionOrSale}
                                            disabled={!hasEnoughInputsForProduction(selectedRecipe, productionQuantity)}
                                            >
                                            <CheckCircle className='mr-2'/> Anza Uzalishaji
                                            </Button>
                                        </div>
                                    </div>
                                ) : selectedInventoryItem ? ( // SHOP VIEW
                                <div className='space-y-4 p-4 bg-gray-800/50 rounded-lg'>
                                    <h3 className='text-xl font-bold'>{selectedInventoryItem.item}</h3>
                                    
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='quantity-sell'>Idadi (Una: {selectedInventoryItem.quantity.toLocaleString()})</Label>
                                            <Input 
                                                id="quantity-sell" type="number" min="1" max={selectedInventoryItem.quantity} value={productionQuantity}
                                                onChange={(e) => setProductionQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedInventoryItem.quantity)))}
                                                className='bg-gray-700 border-gray-600'
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='price-sell'>Bei kwa Kipande</Label>
                                            <Input 
                                                id="price-sell" type="number"
                                                value={sellingPrice}
                                                onChange={handleSellingPriceChange}
                                                step="0.01"
                                                className='bg-gray-700 border-gray-600'
                                            />
                                        </div>
                                    </div>
                                        <div className='text-xs text-center text-gray-400'>
                                            <p>Bei Elekezi: ${selectedInventoryItem.marketPrice.toFixed(2)}</p>
                                            <p>Kikomo: ${priceFloor.toFixed(2)} - ${priceCeiling.toFixed(2)}</p>
                                        </div>

                                    <Separator className='my-2 bg-gray-600'/>

                                    <div className='space-y-3'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-400'>Thamani ya Mauzo:</span>
                                            <span className='font-bold text-green-400'>${(productionQuantity * sellingPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-400'>Muda wa Kuuza:</span>
                                            <span className='font-bold'>{formatTime(calculateSaleTime(productionQuantity))}</span>
                                        </div>
                                        <Button
                                            className='w-full bg-green-600 hover:bg-green-700'
                                            onClick={handleConfirmProductionOrSale}
                                            disabled={productionQuantity > selectedInventoryItem.quantity}
                                        >
                                            <CheckCircle className='mr-2'/> Anza Kuuza
                                        </Button>
                                    </div>
                                </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-center text-gray-500 p-4 rounded-lg bg-gray-800/50">
                                    <p>Chagua bidhaa kutoka kushoto ili kuanza.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        
        {/* Boost Dialog */}
        <Dialog open={dialogState.boost} onOpenChange={(open) => setDialogState({ ...dialogState, boost: open })}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Harakisha Ujenzi</DialogTitle>
                     <DialogDescription>
                        Tumia Star Boosts kupunguza muda wa ujenzi. Unapata dakika 3 kwa kila nyota.
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4 space-y-6 text-center'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-3 bg-gray-800 rounded-lg'>
                        <p className='text-sm text-gray-400'>Muda Uliosalia</p>
                        <p className='font-bold font-mono text-lg'>{selectedSlot?.construction ? formatTime(selectedSlot.construction.endTime - now) : '00:00'}</p>
                        </div>
                        <div className='p-3 bg-gray-800 rounded-lg'>
                        <p className='text-sm text-gray-400'>Muda Utakaopungua</p>
                        <p className='font-bold font-mono text-lg text-green-400'>{formatTime(timeReduction)}</p>
                        </div>
                    </div>
                    
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <Label htmlFor="boost-amount" className="text-left">Idadi ya Stars (Una: {stars})</Label>
                            <span className='flex items-center gap-2 font-bold'>{boostAmount} <Star className='h-4 w-4 text-yellow-400' /></span>
                        </div>
                        <Slider
                            id="boost-amount"
                            min={0}
                            max={maxStarsToUse}
                            step={1}
                            value={[boostAmount]}
                            onValueChange={(value) => setBoostAmount(value[0])}
                            disabled={maxStarsToUse === 0}
                        />
                    </div>
                </div>
                <DialogFooter className="mt-auto pt-4">
                    <Button variant="outline" onClick={() => setDialogState({ ...dialogState, boost: false })}>Ghairi</Button>
                    <Button 
                        className='bg-blue-600 hover:bg-blue-700' 
                        onClick={handleConfirmBoost}
                        disabled={boostAmount === 0 || boostAmount > stars}
                    >
                        <Star className='mr-2' /> Tumia {boostAmount} Star Boosts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    if (parseInt(hours) > 0) {
        return `${hours}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
};

    

    