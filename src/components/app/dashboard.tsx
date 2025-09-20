

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
import { Factory, Leaf, PlusCircle, Settings, Clock, CheckCircle, Gem, Hammer, Mountain, Droplets, Zap, ToyBrick, Star, Trash2, ChevronsUp, Tractor, Drumstick, Beef, GlassWater, Utensils, Wheat, ArrowLeft, Users, Wrench, FileText, ScrollText, Shirt, Building2, Watch, Glasses, FlaskConical, CircleDollarSign, Monitor, Tablet, Smartphone, Laptop, Cpu, Battery, MemoryStick, Tv, Ship, Car, Bike, Plane, Rocket, ShieldCheck, Search, Store, ShoppingCart } from 'lucide-react';
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
import { productCategoryToShopMap } from './game';

export type BuildingType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  imageHint: string;
};

export type SellInfo = {
    recipeId: string; // For shops, this will be the item name. For producers, the recipe ID.
    quantity: number;
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
    sell?: SellInfo;
    construction?: ConstructionInfo;
};

export const availableBuildings: BuildingType[] = [
    {
        id: 'duka_kuu',
        name: 'Duka Kuu',
        icon: <Store className="text-green-400" />,
        description: 'Huzaa bidhaa za chakula, kilimo na za msingi.',
        image: 'https://picsum.photos/seed/supermarket/200/200',
        imageHint: 'supermarket aisle'
    },
    {
        id: 'duka_la_ujenzi',
        name: 'Duka la Vifaa vya Ujenzi',
        icon: <ShoppingCart className="text-orange-400" />,
        description: 'Huzaa vifaa vya ujenzi na malighafi.',
        image: 'https://picsum.photos/seed/hardware-store/200/200',
        imageHint: 'hardware store'
    },
    {
        id: 'duka_la_nguo_na_vito',
        name: 'Duka la Nguo na Vito',
        icon: <ShoppingCart className="text-pink-400" />,
        description: 'Huzaa mavazi, vito na bidhaa za kifahari.',
        image: 'https://picsum.photos/seed/fashion-boutique/200/200',
        imageHint: 'fashion boutique'
    },
    {
        id: 'duka_la_electroniki',
        name: 'Duka la Electroniki',
        icon: <ShoppingCart className="text-blue-400" />,
        description: 'Huzaa vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/electronics-store/200/200',
        imageHint: 'electronics store'
    },
    {
        id: 'duka_la_magari',
        name: 'Duka la Magari',
        icon: <ShoppingCart className="text-red-400" />,
        description: 'Huzaa magari, pikipiki na vyombo vya usafiri.',
        image: 'https://picsum.photos/seed/car-dealership/200/200',
        imageHint: 'car dealership'
    },
    {
        id: 'duka_la_anga',
        name: 'Duka la Anga',
        icon: <ShoppingCart className="text-purple-400" />,
        description: 'Huzaa bidhaa za teknolojia ya anga.',
        image: 'https://picsum.photos/seed/space-store/200/200',
        imageHint: 'space showroom'
    },
    {
        id: 'shamba',
        name: 'Shamba',
        icon: <Leaf className="text-green-500" />,
        description: 'Huzalisha mazao ya kilimo na mifugo.',
        image: 'https://picsum.photos/seed/farm-land/200/200',
        imageHint: 'fertile farm'
    },
    {
        id: 'zizi',
        name: 'Zizi',
        icon: <Drumstick className="text-orange-400" />,
        description: 'Hufuga wanyama na kuzalisha bidhaa za mifugo.',
        image: 'https://picsum.photos/seed/animal-pen/200/200',
        imageHint: 'animal pen'
    },
    {
        id: 'kiwanda_cha_samaki',
        name: 'Kiwanda cha Samaki',
        icon: <GlassWater className="text-blue-400" />,
        description: 'Husindika samaki na bidhaa za baharini.',
        image: 'https://picsum.photos/seed/fish-factory/200/200',
        imageHint: 'fish factory'
    },
    {
        id: 'uchimbaji_mawe',
        name: 'Uchimbaji Mawe (Quarry)',
        icon: <Mountain className="text-gray-500" />,
        description: 'Huchimba mawe na kokoto.',
        image: 'https://picsum.photos/seed/quarry/200/200',
        imageHint: 'stone quarry'
    },
    {
        id: 'uchimbaji_mchanga',
        name: 'Uchimbaji Mchanga',
        icon: <Mountain className="text-yellow-600" />,
        description: 'Huchimba mchanga.',
        image: 'https://picsum.photos/seed/sand-pit/200/200',
        imageHint: 'sand pit'
    },
    {
        id: 'uchimbaji_chuma',
        name: 'Uchimbaji Chuma',
        icon: <Gem className="text-slate-500" />,
        description: 'Huchimba madini ya chuma.',
        image: 'https://picsum.photos/seed/iron-mine/200/200',
        imageHint: 'iron mine'
    },
     {
        id: 'uchimbaji_almasi',
        name: 'Uchimbaji Almasi',
        icon: <Gem className="text-cyan-400" />,
        description: 'Huchimba Almasi.',
        image: 'https://picsum.photos/seed/diamond-mine/200/200',
        imageHint: 'diamond mine'
    },
    {
        id: 'uchimbaji_dhahabu',
        name: 'Uchimbaji Dhahabu',
        icon: <Gem className="text-yellow-400" />,
        description: 'Huchimba Dhahabu.',
        image: 'https://picsum.photos/seed/gold-mine/200/200',
        imageHint: 'gold mine'
    },
    {
        id: 'uchimbaji_silver',
        name: 'Uchimbaji Silver',
        icon: <Gem className="text-slate-400" />,
        description: 'Huchimba Silver.',
        image: 'https://picsum.photos/seed/silver-mine/200/200',
        imageHint: 'silver mine'
    },
     {
        id: 'uchimbaji_ruby',
        name: 'Uchimbaji Ruby',
        icon: <Gem className="text-red-500" />,
        description: 'Huchimba Ruby.',
        image: 'https://picsum.photos/seed/ruby-mine/200/200',
        imageHint: 'ruby mine'
    },
    {
        id: 'uchimbaji_tanzanite',
        name: 'Uchimbaji Tanzanite',
        icon: <Gem className="text-purple-400" />,
        description: 'Huchimba Tanzanite.',
        image: 'https://picsum.photos/seed/tanzanite-mine/200/200',
        imageHint: 'tanzanite mine'
    },
    {
        id: 'uchimbaji_shaba',
        name: 'Uchimbaji Shaba',
        icon: <Gem className="text-orange-400" />,
        description: 'Huchimba Shaba.',
        image: 'https://picsum.photos/seed/copper-mine/200/200',
        imageHint: 'copper mine'
    },
    {
        id: 'kiwanda_cha_umeme',
        name: 'Kiwanda cha Umeme',
        icon: <Zap className="text-yellow-300" />,
        description: 'Huzalisha umeme.',
        image: 'https://picsum.photos/seed/power-plant/200/200',
        imageHint: 'power plant'
    },
    {
        id: 'kiwanda_cha_maji',
        name: 'Kiwanda cha Maji',
        icon: <Droplets className="text-blue-500" />,
        description: 'Huzalisha maji safi.',
        image: 'https://picsum.photos/seed/water-plant/200/200',
        imageHint: 'water plant'
    },
    {
        id: 'kiwanda_cha_mbao',
        name: 'Kiwanda cha Mbao',
        icon: <Hammer className="text-amber-800" />,
        description: 'Husindika miti kuwa mbao.',
        image: 'https://picsum.photos/seed/lumber-mill/200/200',
        imageHint: 'lumber mill'
    },
    {
        id: 'kiwanda_cha_saruji',
        name: 'Kiwanda cha Saruji',
        icon: <Factory className="text-gray-400" />,
        description: 'Huzalisha saruji.',
        image: 'https://picsum.photos/seed/cement-factory/200/200',
        imageHint: 'cement factory'
    },
    {
        id: 'kiwanda_cha_matofali',
        name: 'Kiwanda cha Matofali',
        icon: <ToyBrick className="text-orange-600" />,
        description: 'Huzalisha matofali na zege.',
        image: 'https://picsum.photos/seed/brick-factory/200/200',
        imageHint: 'brick factory'
    },
     {
        id: 'kiwanda_cha_chuma',
        name: 'Kiwanda cha Chuma',
        icon: <Factory className="text-slate-500" />,
        description: 'Huyeyusha madini ya chuma na kuzalisha nondo.',
        image: 'https://picsum.photos/seed/steel-mill/200/200',
        imageHint: 'steel mill'
    },
    {
        id: 'kiwanda_cha_sukari',
        name: 'Kiwanda cha Sukari',
        icon: <Wheat className="text-amber-200" />,
        description: 'Husindika miwa kuwa sukari.',
        image: 'https://picsum.photos/seed/sugar-factory/200/200',
        imageHint: 'sugar factory'
    },
    {
        id: 'mgahawa',
        name: 'Mgahawa',
        icon: <Utensils className="text-white" />,
        description: 'Huandaa vinywaji na vyakula.',
        image: 'https://picsum.photos/seed/restaurant/200/200',
        imageHint: 'restaurant interior'
    },
    {
        id: 'kiwanda_cha_mashine',
        name: 'Kiwanda cha Mashine',
        icon: <Wrench className="text-gray-400" />,
        description: 'Huzalisha mashine mbalimbali za uzalishaji.',
        image: 'https://picsum.photos/seed/machine-factory/200/200',
        imageHint: 'machine factory'
    },
    {
        id: 'ofisi_ya_leseni',
        name: 'Ofisi ya Leseni',
        icon: <FileText className="text-blue-300" />,
        description: 'Hutoa leseni mbalimbali za uendeshaji.',
        image: 'https://picsum.photos/seed/license-office/200/200',
        imageHint: 'government office'
    },
    {
        id: 'kiwanda_cha_karatasi',
        name: 'Kiwanda cha Karatasi',
        icon: <ScrollText className="text-white" />,
        description: 'Huzalisha karatasi kutoka kwenye mbao.',
        image: 'https://picsum.photos/seed/paper-mill/200/200',
        imageHint: 'paper mill'
    },
    {
        id: 'wizara_ya_madini',
        name: 'Wizara ya Madini',
        icon: <FileText className="text-yellow-500" />,
        description: 'Inatoa vyeti vya uhalali wa uchimbaji madini.',
        image: 'https://picsum.photos/seed/ministry-minerals/200/200',
        imageHint: 'government building'
    },
    {
        id: 'kiwanda_cha_vitambaa',
        name: 'Kiwanda cha Vitambaa',
        icon: <Factory className="text-pink-400" />,
        description: 'Huzalisha vitambaa kutoka pamba na katani.',
        image: 'https://picsum.photos/seed/fabric-factory/200/200',
        imageHint: 'fabric factory'
    },
    {
        id: 'kiwanda_cha_ngozi',
        name: 'Kiwanda cha Ngozi',
        icon: <Factory className="text-amber-800" />,
        description: 'Husindika ngozi kutoka kwa wanyama.',
        image: 'https://picsum.photos/seed/leather-factory/200/200',
        imageHint: 'leather factory'
    },
    {
        id: 'kiwanda_cha_nguo',
        name: 'Kiwanda cha Nguo',
        icon: <Shirt className="text-blue-500" />,
        description: 'Hushona mavazi mbalimbali.',
        image: 'https://picsum.photos/seed/garment-factory/200/200',
        imageHint: 'garment factory'
    },
    {
        id: 'kiwanda_cha_saa',
        name: 'Kiwanda cha Saa',
        icon: <Watch className="text-slate-300" />,
        description: 'Huzalisha saa na soli za viatu.',
        image: 'https://picsum.photos/seed/watch-factory/200/200',
        imageHint: 'watch factory'
    },
    {
        id: 'kiwanda_cha_vioo',
        name: 'Kiwanda cha Vioo',
        icon: <Glasses className="text-cyan-300" />,
        description: 'Huzalisha vioo kwa ajili ya saa na matumizi mengine.',
        image: 'https://picsum.photos/seed/glass-factory/200/200',
        imageHint: 'glass factory'
    },
    {
        id: 'kiwanda_cha_chokaa',
        name: 'Kiwanda cha Chokaa',
        icon: <Building2 className="text-stone-400" />,
        description: 'Huzalisha chokaa.',
        image: 'https://picsum.photos/seed/lime-factory/200/200',
        imageHint: 'lime factory'
    },
    {
        id: 'kiwanda_cha_gundi',
        name: 'Kiwanda cha Gundi',
        icon: <FlaskConical className="text-yellow-200" />,
        description: 'Huzalisha gundi.',
        image: 'https://picsum.photos/seed/glue-factory/200/200',
        imageHint: 'glue factory'
    },
    {
        id: 'sonara',
        name: 'Sonara',
        icon: <CircleDollarSign className="text-yellow-400" />,
        description: 'Hutengeneza vito na mapambo ya thamani.',
        image: 'https://picsum.photos/seed/goldsmith/200/200',
        imageHint: 'goldsmith workshop'
    },
    {
        id: 'uchimbaji_mafuta',
        name: 'Uchimbaji Mafuta',
        icon: <Droplets className="text-black" />,
        description: 'Huchimba mafuta ghafi kutoka ardhini.',
        image: 'https://picsum.photos/seed/oil-rig/200/200',
        imageHint: 'oil rig'
    },
    {
        id: 'kiwanda_cha_disel',
        name: 'Kiwanda cha Disel',
        icon: <Factory className="text-gray-700" />,
        description: 'Husindika mafuta ghafi kuwa disel.',
        image: 'https://picsum.photos/seed/diesel-factory/200/200',
        imageHint: 'oil refinery'
    },
    {
        id: 'kiwanda_cha_petrol',
        name: 'Kiwanda cha Petrol',
        icon: <Factory className="text-orange-700" />,
        description: 'Husindika mafuta ghafi kuwa petroli.',
        image: 'https://picsum.photos/seed/petrol-factory/200/200',
        imageHint: 'oil refinery night'
    },
    // Electronics
    {
        id: 'kiwanda_cha_tv',
        name: 'Kiwanda cha TV',
        icon: <Tv className="text-blue-400" />,
        description: 'Huunganisha na kuzalisha televisheni.',
        image: 'https://picsum.photos/seed/tv-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_tablet',
        name: 'Kiwanda cha Tablet',
        icon: <Tablet className="text-blue-400" />,
        description: 'Huunganisha na kuzalisha tablets.',
        image: 'https://picsum.photos/seed/tablet-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_smartphone',
        name: 'Kiwanda cha Smartphone',
        icon: <Smartphone className="text-blue-400" />,
        description: 'Huunganisha na kuzalisha simu janja.',
        image: 'https://picsum.photos/seed/smartphone-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_laptop',
        name: 'Kiwanda cha Laptop',
        icon: <Laptop className="text-blue-400" />,
        description: 'Huunganisha na kuzalisha laptop.',
        image: 'https://picsum.photos/seed/laptop-factory/200/200',
        imageHint: 'electronics factory'
    },
    {
        id: 'kiwanda_cha_processor',
        name: 'Kiwanda cha Processor',
        icon: <Cpu className="text-purple-400" />,
        description: 'Huzalisha processor kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/cpu-factory/200/200',
        imageHint: 'clean room'
    },
    {
        id: 'kiwanda_cha_betri',
        name: 'Kiwanda cha Betri',
        icon: <Battery className="text-green-400" />,
        description: 'Huzalisha betri kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/battery-factory/200/200',
        imageHint: 'battery production'
    },
    {
        id: 'kiwanda_cha_display',
        name: 'Kiwanda cha Display',
        icon: <Monitor className="text-cyan-400" />,
        description: 'Huzalisha display (screen) kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/display-factory/200/200',
        imageHint: 'screen manufacturing'
    },
    {
        id: 'kiwanda_cha_motherboard',
        name: 'Kiwanda cha Motherboard',
        icon: <MemoryStick className="text-green-600" />,
        description: 'Huzalisha motherboard kwa ajili ya vifaa vya kielektroniki.',
        image: 'https://picsum.photos/seed/motherboard-factory/200/200',
        imageHint: 'circuit board'
    },
    {
        id: 'kiwanda_cha_vifaa_vya_ndani',
        name: 'Kiwanda cha Vifaa vya Ndani',
        icon: <Wrench className="text-slate-400" />,
        description: 'Huzalisha komponenti ndogo ndogo za ndani.',
        image: 'https://picsum.photos/seed/components-factory/200/200',
        imageHint: 'small components'
    },
    {
        id: 'kiwanda_cha_usanidi',
        name: 'Kiwanda cha Usanidi',
        icon: <Factory className="text-gray-500" />,
        description: 'Huzalisha sehemu maalum za kielektroniki.',
        image: 'https://picsum.photos/seed/config-factory/200/200',
        imageHint: 'electronics assembly'
    },
    // Vehicle Chain
    {
        id: 'kiwanda_cha_spare',
        name: 'Kiwanda cha Spare',
        icon: <Wrench className="text-yellow-500" />,
        description: 'Huzalisha vipuri mbalimbali vya magari na vyombo vingine.',
        image: 'https://picsum.photos/seed/spare-parts-factory/200/200',
        imageHint: 'spare parts'
    },
    {
        id: 'kiwanda_cha_gari',
        name: 'Kiwanda cha Gari',
        icon: <Car className="text-red-500" />,
        description: 'Huunganisha magari na malori.',
        image: 'https://picsum.photos/seed/car-factory/200/200',
        imageHint: 'car factory'
    },
    {
        id: 'kiwanda_cha_pikipiki',
        name: 'Kiwanda cha Pikipiki',
        icon: <Bike className="text-blue-500" />,
        description: 'Huunganisha pikipiki.',
        image: 'https://picsum.photos/seed/motorcycle-factory/200/200',
        imageHint: 'motorcycle factory'
    },
    {
        id: 'kiwanda_cha_ndege',
        name: 'Kiwanda cha Ndege',
        icon: <Plane className="text-cyan-400" />,
        description: 'Huunganisha ndege.',
        image: 'https://picsum.photos/seed/airplane-factory/200/200',
        imageHint: 'airplane factory'
    },
    {
        id: 'kiwanda_cha_meli',
        name: 'Kiwanda cha Meli',
        icon: <Ship className="text-indigo-500" />,
        description: 'Huunganisha meli.',
        image: 'https://picsum.photos/seed/shipyard/200/200',
        imageHint: 'shipyard'
    },
    // Space Chain
    {
        id: 'kiwanda_cha_k_mashine',
        name: 'Kiwanda cha K Mashine',
        icon: <Wrench className="text-purple-400" />,
        description: 'Huzalisha mashine maalum za "K-Series" kwa ajili ya teknolojia ya anga.',
        image: 'https://picsum.photos/seed/k-machine-factory/200/200',
        imageHint: 'advanced factory'
    },
    {
        id: 'kiwanda_cha_anga',
        name: 'Kiwanda cha Anga',
        icon: <Factory className="text-blue-300" />,
        description: 'Huunganisha sehemu muhimu za roketi na vyombo vya anga.',
        image: 'https://picsum.photos/seed/space-factory/200/200',
        imageHint: 'space assembly'
    },
    {
        id: 'kiwanda_cha_roketi',
        name: 'Kiwanda cha Roketi',
        icon: <Rocket className="text-red-500" />,
        description: 'Huunganisha roketi kamili tayari kwa safari ya anga.',
        image: 'https://picsum.photos/seed/rocket-factory/200/200',
        imageHint: 'rocket launch'
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

interface DashboardProps {
    buildingSlots: BuildingSlot[];
    inventory: InventoryItem[];
    stars: number;
    onBuild: (slotIndex: number, building: BuildingType) => void;
    onStartProduction: (slotIndex: number, recipe: Recipe, quantity: number, durationMs: number) => void;
    onStartSelling: (slotIndex: number, item: InventoryItem, quantity: number, durationMs: number) => void;
    onBoostConstruction: (slotIndex: number, starsToUse: number) => void;
    onUpgradeBuilding: (slotIndex: number) => void;
    onDemolishBuilding: (slotIndex: number) => void;
    onBuyMaterial: (materialName: string, quantity: number) => boolean;
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

export function Dashboard({ buildingSlots, inventory, stars, onBuild, onStartProduction, onStartSelling, onBoostConstruction, onUpgradeBuilding, onDemolishBuilding, onBuyMaterial }: DashboardProps) {
  
  const [isBuildDialogOpen, setIsBuildDialogOpen] = React.useState(false);
  const [buildDialogStep, setBuildDialogStep] = React.useState<'list' | 'details'>('list');
  const [selectedBuildingForBuild, setSelectedBuildingForBuild] = React.useState<BuildingType | null>(null);
  const [buildingSearch, setBuildingSearch] = React.useState('');

  const [isProductionDialogOpen, setIsProductionDialogOpen] = React.useState(false);
  const [isManagementDialogOpen, setIsManagementDialogOpen] = React.useState(false);
  const [isDemolishDialogOpen, setIsDemolishDialogOpen] = React.useState(false);
  const [isBoostDialogOpen, setIsBoostDialogOpen] = React.useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState<number | null>(null);
  const [now, setNow] = React.useState(Date.now());
  
  // State for production/selling dialog
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = React.useState<InventoryItem | null>(null);
  const [productionQuantity, setProductionQuantity] = React.useState(1);
  
  const [boostAmount, setBoostAmount] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBuildDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setBuildDialogStep('list');
    setSelectedBuildingForBuild(null);
    setBuildingSearch('');
    setIsBuildDialogOpen(true);
  };
  
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
          const inventoryItem = inventory.find(item => item.item === cost.name);
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
        setIsBuildDialogOpen(false);
    }
  };


  const handleOpenProductionDialog = () => {
    if (selectedSlotIndex === null) return;
    setIsManagementDialogOpen(false);
    setSelectedRecipe(null);
    setSelectedInventoryItem(null);
    setProductionQuantity(1);
    setIsProductionDialogOpen(true);
  };
  
  const handleOpenManagementDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setIsManagementDialogOpen(true);
  }

  const handleOpenBoostDialog = (index: number) => {
    setSelectedSlotIndex(index);
    setBoostAmount(0);
    setIsBoostDialogOpen(true);
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSelectedInventoryItem(null);
    setProductionQuantity(1);
  }
  
  const handleSelectInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item);
    setSelectedRecipe(null);
    setProductionQuantity(1);
  }

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
      onStartSelling(selectedSlotIndex, selectedInventoryItem, productionQuantity, totalDurationMs);
    }
    
    setIsProductionDialogOpen(false);
    setSelectedRecipe(null);
    setSelectedInventoryItem(null);
  }
  
  const handleConfirmBoost = () => {
      if (selectedSlotIndex !== null && boostAmount > 0) {
          onBoostConstruction(selectedSlotIndex, boostAmount);
      }
      setIsBoostDialogOpen(false);
  }

  const handleConfirmDemolish = () => {
      if(selectedSlotIndex !== null) {
          onDemolishBuilding(selectedSlotIndex);
      }
      setIsDemolishDialogOpen(false);
      setIsManagementDialogOpen(false);
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
        setIsManagementDialogOpen(false);
    }
  }

  const selectedSlot = selectedSlotIndex !== null ? buildingSlots[selectedSlotIndex] : null;
  const isSelectedBuildingShop = selectedSlot?.building ? SHOP_BUILDING_IDS.includes(selectedSlot.building.id) : false;
  
  const buildingRecipes = selectedSlot?.building
    ? recipes.filter((recipe) => recipe.buildingId === selectedSlot.building!.id)
    : [];

  const getShopInventory = (): InventoryItem[] => {
    if (!selectedSlot?.building || !isSelectedBuildingShop) return [];
  
    const shopId = selectedSlot.building.id;
  
    return inventory.filter(item => {
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
        const inventoryItem = inventory.find(item => item.item === input.name);
        const neededQuantity = input.quantity * quantity;
        return inventoryItem && inventoryItem.quantity >= neededQuantity;
    });
  }

  const calculateProductionTime = (quantity: number): number => {
      if (!selectedSlot || !selectedRecipe) return 0;
      const buildingInfo = buildingData[selectedRecipe.buildingId];
      // Time in seconds for one batch, adjusted by level
      const ratePerHr = buildingInfo.productionRate * (1 + (selectedSlot.level - 1) * 0.4);
      if (ratePerHr <= 0) return Infinity; // Avoid division by zero for non-producing buildings
      
      const baseTimePerBatch = (3600) / ratePerHr;
      const totalSeconds = baseTimePerBatch * quantity;
      return totalSeconds * 1000; // time in ms
  }

  const calculateSaleTime = (quantity: number): number => {
      if (!selectedSlot || !selectedInventoryItem) return 0;
      const productInfo = encyclopediaData.find(e => e.name === selectedInventoryItem.item);
      const productionTimeProp = productInfo?.properties.find(p => p.label === 'Base Production Time');
      if (!productionTimeProp) return 5000 * quantity; // Fallback: 5 seconds per item

      const timePerUnitSeconds = parseFloat(productionTimeProp.value);
      return timePerUnitSeconds * quantity * 1000; // Total time in ms
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
  
  const calculateSaleValue = (item: InventoryItem, quantity: number): number => {
    const productInfo = encyclopediaData.find(e => e.name === item.item);
    const pricePerUnit = productInfo ? parseFloat(productInfo.properties.find(p => p.label === 'Market Cost')?.value.replace('$', '').replace(/,/g, '') || '0') : 0;
    return pricePerUnit * quantity;
  };


  const handleCardClick = (slot: BuildingSlot, index: number) => {
    if (slot.construction) {
        handleOpenBoostDialog(index);
    } else if (slot.building && !slot.sell) {
        handleOpenManagementDialog(index);
    }
  }

  const timeReductionPerStar = 3 * 60 * 1000; // 3 minutes
  const timeReduction = boostAmount * timeReductionPerStar;
  const remainingTime = selectedSlot?.construction ? selectedSlot.construction.endTime - now : 0;
  const maxStarsToUse = Math.min(stars, Math.ceil(remainingTime / timeReductionPerStar));
  
  const upgradeCosts = selectedSlot?.building ? buildingData[selectedSlot.building.id]?.upgradeCost(selectedSlot.level + 1) : [];
  const canAffordUpgrade = hasEnoughMaterials(upgradeCosts);

  const buildCosts = selectedBuildingForBuild ? buildingData[selectedBuildingForBuild.id]?.buildCost : [];
  const canAffordBuild = hasEnoughMaterials(buildCosts);
  
  const filteredBuildings = availableBuildings.filter(b =>
      b.name.toLowerCase().includes(buildingSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 text-white">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">My City</h1>
        <p className="text-muted-foreground">
          Build your empire from the ground up. Click a plot to construct or a building to produce.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {buildingSlots.map((slot, index) => {
            const currentRecipeName = slot.sell ? slot.sell!.recipeId : null;
            const style = slot.building ? (buildingStyles[slot.building.id] || buildingStyles.default) : buildingStyles.default;
            return slot.building ? (
            <Card
              key={index}
              onClick={() => handleCardClick(slot, index)}
              className={cn(
                "flex flex-col items-center justify-between h-32 bg-gray-800/80 border-gray-700 overflow-hidden group relative cursor-pointer aspect-square p-2"
              )}
            >
                <div className="w-full h-4/6 relative flex items-center justify-center">
                    {/* Building Body */}
                    <div className={cn("w-4/5 h-full rounded-t-md flex items-center justify-center", style.body)}>
                        {React.cloneElement(slot.building.icon, {
                            className: 'w-10 h-10 text-white/90',
                        })}
                    </div>
                    {/* Building Roof */}
                    <div 
                        className={cn("absolute top-0 w-full h-0 border-b-[30px]", style.roof)}
                        style={{
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                        }}
                    />
                </div>


                {slot.sell && (
                   <div className="absolute top-2 left-2 p-1 bg-green-500/80 rounded-full animate-pulse">
                      <CircleDollarSign className="h-4 w-4 text-white" />
                   </div>
                )}
                {slot.construction && (
                   <div className="absolute top-2 left-2 p-1 bg-orange-500/80 rounded-full animate-pulse">
                      <Hammer className="h-4 w-4 text-white" />
                   </div>
                )}
                {!slot.sell && !slot.construction && (
                   <div className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full">
                       <Settings className="h-4 w-4 text-white" />
                   </div>
                )}
                <div className="absolute bottom-0 p-2 text-center w-full bg-black/60">
                    <p className="text-xs font-bold truncate">{slot.building.name} (Lvl {slot.level || 0})</p>
                    {slot.sell && currentRecipeName ? (
                        <div className='text-xs font-mono text-green-300 flex items-center justify-center gap-2'>
                           <span>{formatTime(slot.sell.endTime - now)}</span>
                           <span>| {currentRecipeName}</span>
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
            </Card>
          ) : (
            <Card
              key={index}
              onClick={() => handleOpenBuildDialog(index)}
              className="flex items-center justify-center h-32 bg-gray-800/60 border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/90 transition-all cursor-pointer"
            >
              <div className="text-center text-gray-500">
                <PlusCircle className="h-8 w-8 mx-auto" />
                <span className="text-xs font-semibold">Build</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Build Dialog */}
      <Dialog open={isBuildDialogOpen} onOpenChange={setIsBuildDialogOpen}>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {filteredBuildings.map((b) => (
                            <Card 
                                key={b.id} 
                                className="bg-gray-800 hover:bg-gray-700/80 border-gray-700 cursor-pointer flex flex-col items-center justify-center p-2 text-center"
                                onClick={() => handleSelectBuildingToShowDetails(b)}
                            >
                            {React.cloneElement(b.icon, { className: 'h-5 w-5' })}
                            <p className="font-semibold mt-1 text-sm">{b.name}</p>
                            </Card>
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
                            {buildCosts && buildCosts.map(cost => {
                                const invItem = inventory.find(i => i.item === cost.name);
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
        <Dialog open={isManagementDialogOpen} onOpenChange={setIsManagementDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>Simamia {selectedSlot?.building?.name}</DialogTitle>
                    <DialogDescription>
                        Chagua kitendo cha kufanya kwenye jengo hili.
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4 space-y-4'>
                    <Button className='w-full justify-start bg-green-600 hover:bg-green-700' onClick={handleOpenProductionDialog}>
                        {isSelectedBuildingShop ? <Store className='mr-2'/> : <Tractor className='mr-2'/>} 
                        {isSelectedBuildingShop ? "Anza Kuuza" : "Anza Uzalishaji"}
                    </Button>
                    <div className='p-4 rounded-lg bg-gray-800/50 border border-gray-700'>
                        <Button className='w-full justify-start' variant="secondary" onClick={handleTriggerUpgrade} disabled={!canAffordUpgrade}>
                            <ChevronsUp className='mr-2'/> Boresha hadi Level {(selectedSlot?.level || 0) + 1}
                        </Button>
                        <Separator className='my-3 bg-gray-600'/>
                        <div className='space-y-1'>
                            <p className='font-semibold mb-1 text-xs'>Gharama ya Kuboresha:</p>
                            <div className="space-y-1">
                                {upgradeCosts && upgradeCosts.map(cost => {
                                    const invItem = inventory.find(i => i.item === cost.name);
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
                    <Button className='w-full justify-start' variant="destructive" onClick={() => setIsDemolishDialogOpen(true)}>
                        <Trash2 className='mr-2'/> Futa Jengo
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Demolish Confirmation Dialog */}
        <AlertDialog open={isDemolishDialogOpen} onOpenChange={setIsDemolishDialogOpen}>
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

        {/* Production/Selling Dialog */}
        <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isSelectedBuildingShop ? 'Uza Bidhaa' : 'Uzalishaji'}: {selectedSlot?.building?.name} (Lvl {selectedSlot?.level})</DialogTitle>
                    <DialogDescription>
                        {isSelectedBuildingShop ? 'Chagua bidhaa kutoka kwenye ghala, weka kiasi, na anza kuuza.' : 'Chagua bidhaa, weka kiasi, na anza mchakato wa uzalishaji.'}
                    </DialogDescription>
                </DialogHeader>
                 <div className="flex-grow overflow-y-auto -mr-6 pr-6">
                    <div className="grid grid-cols-3 gap-4 pt-4">
                    {/* Recipe/Item List */}
                    <div className="col-span-1 flex flex-col gap-2">
                        {isSelectedBuildingShop ? (
                            shopInventory.length > 0 ? (
                                <ScrollArea className="h-full">
                                    <div className="flex flex-col gap-2 pr-4">
                                        {shopInventory.map((item) => (
                                            <Button
                                                key={item.item}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start h-auto py-2 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white",
                                                    selectedInventoryItem?.item === item.item && "bg-blue-600 border-blue-400"
                                                )}
                                                onClick={() => handleSelectInventoryItem(item)}
                                            >
                                                {item.item}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <p className="text-sm text-gray-500">Hakuna bidhaa zinazohusiana na duka hili kwenye ghala.</p>
                            )
                        ) : (
                            buildingRecipes.length > 0 ? (
                                <ScrollArea className="h-full">
                                    <div className="flex flex-col gap-2 pr-4">
                                        {buildingRecipes.map((recipe) => (
                                            <Button
                                                key={recipe.id}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start h-auto py-2 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:text-white",
                                                    selectedRecipe?.id === recipe.id && "bg-blue-600 border-blue-400"
                                                )}
                                                onClick={() => handleSelectRecipe(recipe)}
                                            >
                                                {recipe.output.name}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <p className="text-sm text-gray-500">Hakuna mapishi kwa jengo hili.</p>
                            )
                        )}
                    </div>
                    {/* Production/Sale Details */}
                    <div className="col-span-2">
                        {selectedRecipe ? ( // PRODUCER VIEW
                            <div className='space-y-4 p-4 bg-gray-800/50 rounded-lg'>
                                <h3 className='text-xl font-bold'>{selectedRecipe.output.name}</h3>
                                <div>
                                    <h4 className='font-semibold mb-2'>Vifaa Vinavyohitajika</h4>
                                    <div className='text-sm space-y-2 text-gray-300 list-disc list-inside'>
                                    {selectedRecipe.inputs.length > 0 ? selectedRecipe.inputs.map(input => {
                                        const invItem = inventory.find(i => i.item === input.name);
                                        const has = invItem?.quantity || 0;
                                        const needed = input.quantity * productionQuantity;
                                        const hasEnough = has >= needed;
                                        return (
                                        <div key={input.name} className='flex justify-between items-center'>
                                            <span className={cn(hasEnough ? 'text-gray-300' : 'text-red-400')}>
                                                {needed.toLocaleString()}x {input.name} (Una: {has.toLocaleString()})
                                            </span>
                                            {!hasEnough && (
                                                <Button size="sm" variant="secondary" className="h-6 px-2" onClick={() => onBuyMaterial(input.name, needed - has)}>
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
                              <div className='space-y-2'>
                                <Label htmlFor='quantity-sell'>Idadi ya Kuuza (Una: {selectedInventoryItem.quantity.toLocaleString()})</Label>
                                <Input 
                                    id="quantity-sell" type="number" min="1" max={selectedInventoryItem.quantity} value={productionQuantity}
                                    onChange={(e) => setProductionQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, selectedInventoryItem.quantity)))}
                                    className='bg-gray-700 border-gray-600'
                                />
                              </div>
                              <Separator className='my-4 bg-gray-600'/>
                              <div className='space-y-3'>
                                  <div className='flex justify-between items-center'>
                                    <span className='text-gray-400'>Thamani ya Mauzo:</span>
                                    <span className='font-bold text-green-400'>${calculateSaleValue(selectedInventoryItem, productionQuantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                    </div>
                 </div>
            </DialogContent>
        </Dialog>
        
        {/* Boost Dialog */}
        <Dialog open={isBoostDialogOpen} onOpenChange={setIsBoostDialogOpen}>
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
                    <Button variant="outline" onClick={() => setIsBoostDialogOpen(false)}>Ghairi</Button>
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
