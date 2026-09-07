import { CoffeeCatalogItem } from '../types';
import { COFFEE_DOSSIERS, CoffeeDossierData } from './coffeeDossiers';

export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';

export type BrewingMethod = 'Espresso' | 'Filter' | 'French Press' | 'AeroPress' | 'Moka Pot';

export type TasteProfileCategory =
  | 'krachtig_intens'
  | 'zacht_gebalanceerd'
  | 'fruitig_levendig'
  | 'zoet_chocolade';

export interface EnrichedCoffeeSpecs {
  roastLevel: RoastLevel;
  intensity: number; // 1 to 5
  acidity: number; // 1 to 5
  body: number; // 1 to 5
  sweetness: number; // 1 to 5
  brewingMethods: BrewingMethod[];
  primaryFlavourNotes: string[];
  tasteCategory: TasteProfileCategory;
  discoveryTag: string;
  secondaryTag?: string;
  shortIntro: string;
  whyMatchMap: Record<TasteProfileCategory, string>;
}

export const COFFEE_SPECS_LOOKUP: Record<string, EnrichedCoffeeSpecs> = {
  // BUDGET
  'budget-espresso': {
    roastLevel: 'Medium-Dark',
    intensity: 5,
    acidity: 1,
    body: 5,
    sweetness: 2,
    brewingMethods: ['Espresso', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Nutty'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Best for Espresso',
    shortIntro: 'Robuuste en krachtige blend met diepe pure chocolade, geroosterde noten en een dikke hazelnootkleurige crema.',
    whyMatchMap: {
      krachtig_intens: 'Maximale body en stevige intensiteit met een intense cacao-afdronk en lage aciditeit.',
      zacht_gebalanceerd: 'Klassieke donkere toets voor wie van een stevige melkbasis houdt.',
      fruitig_levendig: 'Niet aanbevolen voor liefhebbers van lichte fruitige aciditeit.',
      zoet_chocolade: 'Diepe pure chocoladetonen en geroosterde walnoot.',
    },
  },
  'budget-omni': {
    roastLevel: 'Medium',
    intensity: 4,
    acidity: 1,
    body: 4,
    sweetness: 2,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Chocolate', 'Nutty', 'Caramel'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Ronde en betrouwbare all-rounder voor volautomatische machines met zachte cacao en geroosterde pinda.',
    whyMatchMap: {
      krachtig_intens: 'Goede body en milde bitterheid zonder scherpe randen.',
      zacht_gebalanceerd: 'Optimale balans en een gemoedelijk mondgevoel voor dagelijks koffiegenot.',
      fruitig_levendig: 'Beperkte aciditeit, primair gericht op ronde noten.',
      zoet_chocolade: 'Aangename tonen van melkchocolade en bruine suiker.',
    },
  },
  'budget-filter': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 2,
    brewingMethods: ['Filter', 'French Press'],
    primaryFlavourNotes: ['Chocolate', 'Nutty'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Toegankelijke filterkoffie met royale body, zachte melkchocolade en een rustieke nootachtige afdronk.',
    whyMatchMap: {
      krachtig_intens: 'Volle structuur voor een filterkoffie.',
      zacht_gebalanceerd: 'Mild en zacht zonder overweldigende zuren.',
      fruitig_levendig: 'Lage aciditeit met focus op biscuit en walnoot.',
      zoet_chocolade: 'Zachte toets van melkchocolade en hazelnoot.',
    },
  },

  // VALUE
  'value-espresso': {
    roastLevel: 'Medium',
    intensity: 4,
    acidity: 2,
    body: 4,
    sweetness: 3,
    brewingMethods: ['Espresso', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Caramel', 'Nutty'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Customer Favourite',
    shortIntro: 'Evenwichtige espresso met een romige structuur, zoete karamel, hazelnoot en een subtiele toets gedroogd fruit.',
    whyMatchMap: {
      krachtig_intens: 'Romige crema en stevige smaakbasis voor espresso en cappuccino.',
      zacht_gebalanceerd: 'Harmonieus evenwicht tussen chocolade, karamel en zachte zoetheid.',
      fruitig_levendig: 'Zeer zachte fruittoets van gedroogde pruim op de achtergrond.',
      zoet_chocolade: 'Romige toffee en cacaotonen domineren het palet.',
    },
  },
  'value-omni': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 3,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Almond', 'Chocolate'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Veelzijdige blend met zoete toffee en amandel, ideaal als overgang naar specialty coffee.',
    whyMatchMap: {
      krachtig_intens: 'Stevig genoeg voor lungo en melkbereidingen.',
      zacht_gebalanceerd: 'Fluweelzacht en rond met aangename amandel- en toffeenotities.',
      fruitig_levendig: 'Gebalanceerde zuren die zachtjes versmelten in zoetheid.',
      zoet_chocolade: 'Heerlijke combinatie van toffee, melkchocolade en amandel.',
    },
  },
  'value-filter': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 3,
    body: 3,
    sweetness: 4,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Caramel'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Frisse en harmonieuze filterkoffie met zoete bloemenhoning, bloesem en een sprankelende citruslift.',
    whyMatchMap: {
      krachtig_intens: 'Te delicaat voor donkere espressoliefhebbers.',
      zacht_gebalanceerd: 'Verfijnde zoetheid die een helder, clean kopje oplevert.',
      fruitig_levendig: 'Natuurlijke levendigheid van Colombia en Costa Rica met frisse citrusnoten.',
      zoet_chocolade: 'Bloemenhoning en lichte karamelzoetheid.',
    },
  },

  // SELECTION
  'selection-daily': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 3,
    body: 3,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Filter', 'AeroPress'],
    primaryFlavourNotes: ['Chocolate', 'Caramel', 'Floral', 'Citrus'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Onze veelgeprezen signatuurbend: melkchocolade en karamel uit Brazilië verrijkt met aromatische bergamot uit Ethiopië.',
    whyMatchMap: {
      krachtig_intens: 'Aangenaam vol in espresso zonder harde bitterheid.',
      zacht_gebalanceerd: 'De ultieme balans tussen zoete chocolade en een elegante florale dimensie.',
      fruitig_levendig: 'Subtiele bergamot en zwarte thee geven frisheid.',
      zoet_chocolade: 'Rijke melkchocolade en zachte toffeesuikers.',
    },
  },
  'selection-espresso': {
    roastLevel: 'Medium-Dark',
    intensity: 5,
    acidity: 1,
    body: 5,
    sweetness: 3,
    brewingMethods: ['Espresso', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Nutty'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Customer Favourite',
    shortIntro: 'Klassieke Napolitaanse espresso-intensiteit met donkere chocolade, geroosterde hazelnoot en een lang aanhoudende kruidige afdronk.',
    whyMatchMap: {
      krachtig_intens: 'Gemaakt voor wie houdt van pure kracht, dikke crema en intense pure cacao.',
      zacht_gebalanceerd: 'Klassiek bitterzoet profiel.',
      fruitig_levendig: 'Vrijwel geen aciditeit dankzij zorgvuldige branding.',
      zoet_chocolade: 'Dominante pure chocolade en geroosterde hazelnoot.',
    },
  },
  'selection-filter': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 4,
    body: 2,
    sweetness: 4,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Citrus', 'Berry', 'Almond'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Complexe en cleane filterblend met Ethiopische Limu florale tonen, sappige groene druif en zachte amandelzoetheid.',
    whyMatchMap: {
      krachtig_intens: 'Te helder en fruitig voor wie intense donkere koffie zoekt.',
      zacht_gebalanceerd: 'Subtiele en zuivere structuur.',
      fruitig_levendig: 'Sprankelende aciditeit van citrus, druif en pruim met een elegante afdronk.',
      zoet_chocolade: 'Amandelzoet met fruitige suikers.',
    },
  },

  // PREMIUM
  'premium-daily': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 3,
    body: 4,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Filter', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Almond', 'Chocolate'],
    tasteCategory: 'zacht_gebalanceerd',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Most Accessible',
    shortIntro: 'Ambachtelijke omniroast met verfijnde toffee, amandel en oranjebloesem. Uiterst veelzijdig en zijdezacht.',
    whyMatchMap: {
      krachtig_intens: 'Ronde body met diepe zoetheid.',
      zacht_gebalanceerd: 'Perfecte symbiose tussen romige toffee en subtiele florale elegantie.',
      fruitig_levendig: 'Zachte florale oranjebloesem brengt levendigheid.',
      zoet_chocolade: 'Fluweelzachte toffee en nootachtige chocolade.',
    },
  },
  'premium-espresso': {
    roastLevel: 'Medium-Dark',
    intensity: 4,
    acidity: 2,
    body: 4,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Berry', 'Almond'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Customer Favourite',
    shortIntro: 'Specialty espresso met diepe cacao, rijpe braambessen, marsepein en een nobele toets cederhout.',
    whyMatchMap: {
      krachtig_intens: 'Complexe diepgang met donkere chocolade en rijp donker fruit.',
      zacht_gebalanceerd: 'Gelaagd profiel met warme zoetheid.',
      fruitig_levendig: 'Subtiele noot van rijpe braambes verweven in cacao.',
      zoet_chocolade: 'Luxe marsepein en pure cacao.',
    },
  },
  'premium-filter': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 4,
    body: 2,
    sweetness: 4,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Berry', 'Citrus'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Coffee Enthusiast Choice',
    shortIntro: 'Licht gebrande specialty filterblend: geurige jasmijn, rijpe perzik en rode bessen met honingachtige zoetheid.',
    whyMatchMap: {
      krachtig_intens: 'Licht en delicaat, bedoeld voor filterextractie.',
      zacht_gebalanceerd: 'Verfijnd theekarakter met zuivere zoetheid.',
      fruitig_levendig: 'Prachtige tonen van jasmijn, perzik en rode bes met levendige citruszuren.',
      zoet_chocolade: 'Wilde honingzoetheid.',
    },
  },

  // PRESTIGE
  'prestige-daily': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 3,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Espresso', 'Filter', 'AeroPress'],
    primaryFlavourNotes: ['Chocolate', 'Caramel', 'Almond', 'Citrus'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Luxury Experience',
    secondaryTag: 'Customer Favourite',
    shortIntro: 'Zijdezachte luxe-blend met zoete melkchocolade, amandel, toffee en een vleugje rijpe clementine.',
    whyMatchMap: {
      krachtig_intens: 'Rijke mondvullende textuur.',
      zacht_gebalanceerd: 'Extreem zacht met een ongekend lange zoete afdronk.',
      fruitig_levendig: 'Subtiele toets van rijpe clementine.',
      zoet_chocolade: 'Onze rijkste zoete blend: melkchocolade, toffee en amandel in perfecte harmonie.',
    },
  },
  'prestige-espresso': {
    roastLevel: 'Medium',
    intensity: 4,
    acidity: 3,
    body: 4,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Berry', 'Caramel'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Luxury Experience',
    shortIntro: 'Exclusieve espresso met cacaonibs, zwarte kers, toffee en een hint van aromatische bourbon vanille.',
    whyMatchMap: {
      krachtig_intens: 'Intense aromatische diepgang met pure cacaonibs en zwarte kersen.',
      zacht_gebalanceerd: 'Luxe textuur met romige body.',
      fruitig_levendig: 'Aromatische kersentoets geeft spanning.',
      zoet_chocolade: 'Warme toffee en vanille-tonen.',
    },
  },
  'prestige-filter': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 5,
    body: 2,
    sweetness: 5,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Berry'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Collector\'s Pick',
    shortIntro: 'Nordic light roast geïnspireerd op het legendarische Gesha-karakter: jasmijn, bergamot, witte perzik en Earl Grey.',
    whyMatchMap: {
      krachtig_intens: 'Zeer licht en aromatisch, niet voor bittere espressoliefhebbers.',
      zacht_gebalanceerd: 'Buitengewoon puur en zijdezacht als bloesemthee.',
      fruitig_levendig: 'Onze meest verfijnde florale expressie met sprankelende bergamot en perzik.',
      zoet_chocolade: 'Florale nectarsuikers.',
    },
  },

  // BARREL AGED (Matching both exact IDs and slug aliases)
  'barrel-moscatel': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 3,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Filter', 'French Press', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Caramel'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Most Unique',
    shortIntro: 'Gelagerd op authentieke Casknolia® Moscatel eikenvaten: rijpe witte druif, muskaatbloesem, honing en gekonfijte sinaasappel.',
    whyMatchMap: {
      krachtig_intens: 'Complex en gelaagd met houtrijping.',
      zacht_gebalanceerd: 'Romig mondgevoel met zoete wijnaccenten.',
      fruitig_levendig: 'Uitgesproken aroma van witte druif, muskaat en citrusbloesem.',
      zoet_chocolade: 'Wijn- en honingzoetheid met eikenhoutkaramel.',
    },
  },
  'casknolia-moscatel': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 3,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Filter', 'French Press', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Caramel'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Most Unique',
    shortIntro: 'Gelagerd op authentieke Casknolia® Moscatel eikenvaten: rijpe witte druif, muskaatbloesem, honing en gekonfijte sinaasappel.',
    whyMatchMap: {
      krachtig_intens: 'Complex en gelaagd met houtrijping.',
      zacht_gebalanceerd: 'Romig mondgevoel met zoete wijnaccenten.',
      fruitig_levendig: 'Uitgesproken aroma van witte druif, muskaat en citrusbloesem.',
      zoet_chocolade: 'Wijn- en honingzoetheid met eikenhoutkaramel.',
    },
  },
  'barrel-pedro-ximenez': {
    roastLevel: 'Medium',
    intensity: 4,
    acidity: 2,
    body: 5,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Caramel', 'Berry'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Luxury Experience',
    shortIntro: 'Gerijpt op Pedro Ximénez sherryvaten: donkere chocolade, gedroogde vijg, rozijnen, dichte karamel en getoast eikenhout.',
    whyMatchMap: {
      krachtig_intens: 'Diepe en zware body met een lange, warme afdronk.',
      zacht_gebalanceerd: 'Rijke, stroperige zoetheid zonder scherpe zuren.',
      fruitig_levendig: 'Toetsen van zongedroogde vijgen en rozijnen.',
      zoet_chocolade: 'Sensatie van chocoladetruffel, PX-sherry en dikke karamel.',
    },
  },
  'casknolia-px': {
    roastLevel: 'Medium',
    intensity: 4,
    acidity: 2,
    body: 5,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press', 'Moka Pot'],
    primaryFlavourNotes: ['Chocolate', 'Caramel', 'Berry'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Luxury Experience',
    shortIntro: 'Gerijpt op Pedro Ximénez sherryvaten: donkere chocolade, gedroogde vijg, rozijnen, dichte karamel en getoast eikenhout.',
    whyMatchMap: {
      krachtig_intens: 'Diepe en zware body met een lange, warme afdronk.',
      zacht_gebalanceerd: 'Rijke, stroperige zoetheid zonder scherpe zuren.',
      fruitig_levendig: 'Toetsen van zongedroogde vijgen en rozijnen.',
      zoet_chocolade: 'Sensatie van chocoladetruffel, PX-sherry en dikke karamel.',
    },
  },
  'barrel-buffalo-trace': {
    roastLevel: 'Medium',
    intensity: 5,
    acidity: 2,
    body: 5,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Moka Pot', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Chocolate', 'Nutty'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Collector\'s Pick',
    shortIntro: 'Gerijpt op originele Buffalo Trace® Kentucky Bourbon vaten: Bourbon vanille, verkoolde eik, melasse en kruidige karamel.',
    whyMatchMap: {
      krachtig_intens: 'Krachtige houttonen, bourbonvanille en diepe melasse voor de avontuurlijke drinker.',
      zacht_gebalanceerd: 'Mondvullend en warm.',
      fruitig_levendig: 'Gefocust op houtrijping en warme specerijen.',
      zoet_chocolade: 'Karamel, toffee en Bourbon vanille.',
    },
  },
  'buffalo-trace-bourbon': {
    roastLevel: 'Medium',
    intensity: 5,
    acidity: 2,
    body: 5,
    sweetness: 4,
    brewingMethods: ['Espresso', 'Moka Pot', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Chocolate', 'Nutty'],
    tasteCategory: 'krachtig_intens',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Collector\'s Pick',
    shortIntro: 'Gerijpt op originele Buffalo Trace® Kentucky Bourbon vaten: Bourbon vanille, verkoolde eik, melasse en kruidige karamel.',
    whyMatchMap: {
      krachtig_intens: 'Krachtige houttonen, bourbonvanille en diepe melasse voor de avontuurlijke drinker.',
      zacht_gebalanceerd: 'Mondvullend en warm.',
      fruitig_levendig: 'Gefocust op houtrijping en warme specerijen.',
      zoet_chocolade: 'Karamel, toffee en Bourbon vanille.',
    },
  },

  // INFUSED
  'infused-vanilla': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Chocolate'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Subtiel geïnfuseerd met natuurlijke Bourbon vanille: zoete room, zachte melkchocolade en rietsuiker.',
    whyMatchMap: {
      krachtig_intens: 'Ronde body met een herkenbare zachte smaak.',
      zacht_gebalanceerd: 'Milde infusie die de koffie niet overheerst maar omarmt.',
      fruitig_levendig: 'Zachte zuren op de achtergrond.',
      zoet_chocolade: 'Pure verwennerij met vanillecrème en melkchocolade.',
    },
  },
  'milau-vanilla': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Caramel', 'Chocolate'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Beginner Friendly',
    shortIntro: 'Subtiel geïnfuseerd met natuurlijke Bourbon vanille: zoete room, zachte melkchocolade en rietsuiker.',
    whyMatchMap: {
      krachtig_intens: 'Ronde body met een herkenbare zachte smaak.',
      zacht_gebalanceerd: 'Milde infusie die de koffie niet overheerst maar omarmt.',
      fruitig_levendig: 'Zachte zuren op de achtergrond.',
      zoet_chocolade: 'Pure verwennerij met vanillecrème en melkchocolade.',
    },
  },
  'infused-cinnamon': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 4,
    brewingMethods: ['Espresso', 'French Press', 'Filter'],
    primaryFlavourNotes: ['Caramel', 'Nutty'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Seasonal Favourite',
    secondaryTag: 'Comfort Classic',
    shortIntro: 'Natuurlijk geïnfuseerd met Ceylon kaneel: warme speculaasaccenten, bruine boter en gekarameliseerde appel.',
    whyMatchMap: {
      krachtig_intens: 'Kruidige warmte die prachtig tot uiting komt met melk.',
      zacht_gebalanceerd: 'Subtiele specerijentoets in harmonie met zachte koffie.',
      fruitig_levendig: 'Warme fruittonen van appel en specerijen.',
      zoet_chocolade: 'Gekarameliseerde speculaas en toffeesuikers.',
    },
  },
  'milau-cinnamon': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 4,
    brewingMethods: ['Espresso', 'French Press', 'Filter'],
    primaryFlavourNotes: ['Caramel', 'Nutty'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Seasonal Favourite',
    secondaryTag: 'Comfort Classic',
    shortIntro: 'Natuurlijk geïnfuseerd met Ceylon kaneel: warme speculaasaccenten, bruine boter en gekarameliseerde appel.',
    whyMatchMap: {
      krachtig_intens: 'Kruidige warmte die prachtig tot uiting komt met melk.',
      zacht_gebalanceerd: 'Subtiele specerijentoets in harmonie met zachte koffie.',
      fruitig_levendig: 'Warme fruittonen van appel en specerijen.',
      zoet_chocolade: 'Gekarameliseerde speculaas en toffeesuikers.',
    },
  },
  'infused-almond': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Almond', 'Chocolate'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Most Unique',
    secondaryTag: 'Dessert Lovers',
    shortIntro: 'Natuurlijk geïnfuseerd met zoete amandel: zachte marsepein, Italiaanse amaretto-biscuit en melkchocolade.',
    whyMatchMap: {
      krachtig_intens: 'Vol en rond mondgevoel.',
      zacht_gebalanceerd: 'Fluweelzacht zoet karakter.',
      fruitig_levendig: 'Zachte amandelbloesem.',
      zoet_chocolade: 'Duidelijke zoete amandel- en chocoladetonen.',
    },
  },
  'milau-almond': {
    roastLevel: 'Medium',
    intensity: 3,
    acidity: 2,
    body: 4,
    sweetness: 5,
    brewingMethods: ['Espresso', 'French Press'],
    primaryFlavourNotes: ['Almond', 'Chocolate'],
    tasteCategory: 'zoet_chocolade',
    discoveryTag: 'Most Unique',
    secondaryTag: 'Dessert Lovers',
    shortIntro: 'Natuurlijk geïnfuseerd met zoete amandel: zachte marsepein, Italiaanse amaretto-biscuit en melkchocolade.',
    whyMatchMap: {
      krachtig_intens: 'Vol en rond mondgevoel.',
      zacht_gebalanceerd: 'Fluweelzacht zoet karakter.',
      fruitig_levendig: 'Zachte amandelbloesem.',
      zoet_chocolade: 'Duidelijke zoete amandel- en chocoladetonen.',
    },
  },

  // SINGLE ORIGINS
  'so-gesha-bench-maji': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 5,
    body: 2,
    sweetness: 5,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Berry'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Rarest Coffee',
    secondaryTag: 'Collector\'s Pick',
    shortIntro: 'Kroonjuweel uit Bench Maji (Ethiopië): ongerepte florale weelde van jasmijn, bergamot, perzikbloesem en witte honing.',
    whyMatchMap: {
      krachtig_intens: 'Licht, complex en theekopperig — niet voor liefhebbers van donkere crema.',
      zacht_gebalanceerd: 'Ultieme zuiverheid van een wereldklasse micro-lot.',
      fruitig_levendig: 'Adembenemende florale jasmijn en sprankelende bergamot met ongekende zoetheid.',
      zoet_chocolade: 'Delicate nectarsuikers en perzikzoetheid.',
    },
  },
  'so-gesha': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 5,
    body: 2,
    sweetness: 5,
    brewingMethods: ['Filter', 'AeroPress'],
    primaryFlavourNotes: ['Floral', 'Citrus', 'Berry'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Rarest Coffee',
    secondaryTag: 'Collector\'s Pick',
    shortIntro: 'Kroonjuweel uit Bench Maji (Ethiopië): ongerepte florale weelde van jasmijn, bergamot, perzikbloesem en witte honing.',
    whyMatchMap: {
      krachtig_intens: 'Licht, complex en theekopperig — niet voor liefhebbers van donkere crema.',
      zacht_gebalanceerd: 'Ultieme zuiverheid van een wereldklasse micro-lot.',
      fruitig_levendig: 'Adembenemende florale jasmijn en sprankelende bergamot met ongekende zoetheid.',
      zoet_chocolade: 'Delicate nectarsuikers en perzikzoetheid.',
    },
  },
  'so-pink-bourbon': {
    roastLevel: 'Light',
    intensity: 2,
    acidity: 4,
    body: 3,
    sweetness: 5,
    brewingMethods: ['Filter', 'AeroPress', 'Espresso'],
    primaryFlavourNotes: ['Berry', 'Citrus', 'Almond', 'Caramel'],
    tasteCategory: 'fruitig_levendig',
    discoveryTag: 'Coffee Enthusiast Choice',
    secondaryTag: 'Rarest Coffee',
    shortIntro: 'Zeldzame Washed Pink Bourbon van Finca El Caney (Colombia): sappige cranberry, citroenbloesem, suikerriet en vanille.',
    whyMatchMap: {
      krachtig_intens: 'Helder en levendig micro-lot profiel.',
      zacht_gebalanceerd: 'Harmonieuze balans tussen rijp rood fruit en rietsuikerzoetheid.',
      fruitig_levendig: 'Sappige bessen, citroen en sinaasappel met levendige gelaagdheid.',
      zoet_chocolade: 'Suikerriet, amandel en zachte vanille.',
    },
  },
};

export function getEnrichedSpecs(coffee: CoffeeCatalogItem): EnrichedCoffeeSpecs {
  if (COFFEE_SPECS_LOOKUP[coffee.id]) {
    return COFFEE_SPECS_LOOKUP[coffee.id];
  }
  // Fallback defaults
  const isLight = coffee.roastProfile.toLowerCase().includes('light');
  const isDark = coffee.roastProfile.toLowerCase().includes('dark');
  const roastLevel: RoastLevel = isLight ? 'Light' : isDark ? 'Medium-Dark' : 'Medium';

  return {
    roastLevel,
    intensity: coffee.characterProfile?.body ?? 3,
    acidity: coffee.characterProfile?.acidity ?? 2,
    body: coffee.characterProfile?.body ?? 3,
    sweetness: coffee.characterProfile?.sweetness ?? 3,
    brewingMethods: ['Espresso', 'Filter'],
    primaryFlavourNotes: ['Chocolate', 'Caramel'],
    tasteCategory: isDark ? 'krachtig_intens' : isLight ? 'fruitig_levendig' : 'zacht_gebalanceerd',
    discoveryTag: 'Customer Favourite',
    shortIntro: coffee.character || 'Ambachtelijke specialty koffie met een harmonieus karakter.',
    whyMatchMap: {
      krachtig_intens: 'Stevig en karaktervol.',
      zacht_gebalanceerd: 'Harmonieuze all-rounder.',
      fruitig_levendig: 'Frisse en levendige toetsen.',
      zoet_chocolade: 'Zoete accenten van chocolade en karamel.',
    },
  };
}

export function getCoffeeDossier(coffeeId: string): CoffeeDossierData | undefined {
  if (COFFEE_DOSSIERS[coffeeId]) {
    return COFFEE_DOSSIERS[coffeeId];
  }
  // Map aliases
  const aliasMap: Record<string, string> = {
    'casknolia-moscatel': 'barrel-moscatel',
    'casknolia-px': 'barrel-pedro-ximenez',
    'buffalo-trace-bourbon': 'barrel-buffalo-trace',
    'milau-vanilla': 'infused-vanilla',
    'milau-cinnamon': 'infused-cinnamon',
    'milau-almond': 'infused-almond',
    'so-gesha': 'so-gesha-bench-maji',
  };
  if (aliasMap[coffeeId] && COFFEE_DOSSIERS[aliasMap[coffeeId]]) {
    return COFFEE_DOSSIERS[aliasMap[coffeeId]];
  }
  return undefined;
}
