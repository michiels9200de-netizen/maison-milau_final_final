import { CoffeeOrigin, CharacterProfile } from '../types';

export interface CoffeeMeta {
  origins: CoffeeOrigin[];
  characterProfile: CharacterProfile;
  scaScore?: string;
}

export const COFFEE_METADATA: Record<string, CoffeeMeta> = {
  // --- Budget ---
  'budget-espresso': {
    origins: [
      { country: 'Uganda', flag: '🇺🇬' },
      { country: 'Colombia', flag: '🇨🇴' },
    ],
    characterProfile: {
      description: 'Sterk, chocoladeachtig met een lage aciditeit.',
      body: 5,
      acidity: 1,
      sweetness: 2,
    },
    scaScore: '80-82',
  },
  'budget-omni': {
    origins: [
      { country: 'Uganda', flag: '🇺🇬' },
      { country: 'Brazilië', flag: '🇧🇷' },
    ],
    characterProfile: {
      description: 'Rond en nootachtig met veel body voor volautomatische machines.',
      body: 4,
      acidity: 1,
      sweetness: 2,
    },
    scaScore: '80-81',
  },
  'budget-filter': {
    origins: [
      { country: 'Uganda', flag: '🇺🇬' },
      { country: 'Brazilië', flag: '🇧🇷' },
    ],
    characterProfile: {
      description: 'Toegankelijk en zacht met melkchocolade en geroosterde walnoot.',
      body: 4,
      acidity: 2,
      sweetness: 2,
    },
    scaScore: '80-82',
  },

  // --- Value ---
  'value-espresso': {
    origins: [
      { country: 'Colombia', flag: '🇨🇴' },
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Uganda', flag: '🇺🇬' },
    ],
    characterProfile: {
      description: 'Karaktervol en romig met karamel, hazelnoot en pure cacao.',
      body: 4,
      acidity: 2,
      sweetness: 3,
    },
    scaScore: '83-84',
  },
  'value-omni': {
    origins: [
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Colombia', flag: '🇨🇴' },
      { country: 'Uganda', flag: '🇺🇬' },
    ],
    characterProfile: {
      description: 'De ideale brug naar specialty met zoete toffee en amandelaccenten.',
      body: 4,
      acidity: 2,
      sweetness: 3,
    },
    scaScore: '84+',
  },
  'value-filter': {
    origins: [
      { country: 'Colombia', flag: '🇨🇴' },
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Costa Rica', flag: '🇨🇷' },
    ],
    characterProfile: {
      description: 'Fris en harmonieus met zoete bloemenhoning en subtiele citrus.',
      body: 3,
      acidity: 3,
      sweetness: 4,
    },
    scaScore: '84+',
  },

  // --- Selection ---
  'selection-daily': {
    origins: [
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Costa Rica', flag: '🇨🇷' },
    ],
    characterProfile: {
      description: 'Harmonieus en veelzijdig. Melkchocolade met florale bergamottoetsen.',
      body: 3,
      acidity: 3,
      sweetness: 4,
    },
    scaScore: '85',
  },
  'selection-espresso': {
    origins: [
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'India', flag: '🇮🇳' },
      { country: 'Uganda', flag: '🇺🇬' },
    ],
    characterProfile: {
      description: 'Klassieke espresso met stabiele crema, pure chocolade en specerijen.',
      body: 5,
      acidity: 1,
      sweetness: 3,
    },
    scaScore: '84-85',
  },
  'selection-filter': {
    origins: [
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Peru', flag: '🇵🇪' },
      { country: 'Brazilië', flag: '🇧🇷' },
    ],
    characterProfile: {
      description: 'Verfijnd en clean met frisse citrus, pruim en zachte amandelzoetheid.',
      body: 2,
      acidity: 4,
      sweetness: 4,
    },
    scaScore: '85+',
  },

  // --- Premium ---
  'premium-daily': {
    origins: [
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Kenia', flag: '🇰🇪' },
    ],
    characterProfile: {
      description: 'Cacao nibs, melkchocolade, rijpe abrikoos en zwarte bes.',
      body: 3,
      acidity: 3,
      sweetness: 5,
    },
    scaScore: '86',
  },
  'premium-espresso': {
    origins: [
      { country: 'Honduras', flag: '🇭🇳' },
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Colombia', flag: '🇨🇴' },
    ],
    characterProfile: {
      description: 'Kers, pruim, kokos, hazelnoot, honing en vanille.',
      body: 4,
      acidity: 3,
      sweetness: 5,
    },
    scaScore: '87',
  },
  'premium-filter': {
    origins: [
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Kenia', flag: '🇰🇪' },
      { country: 'Indonesië', flag: '🇮🇩' },
    ],
    characterProfile: {
      description: 'Groene appel, grapefruit, groene thee, witte druif en sencha.',
      body: 2,
      acidity: 5,
      sweetness: 4,
    },
    scaScore: '87',
  },

  // --- Prestige ---
  'prestige-daily': {
    origins: [
      { country: 'Indonesië', flag: '🇮🇩' },
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Colombia', flag: '🇨🇴' },
    ],
    characterProfile: {
      description: 'Bloesem, lemongrass, delicate bloemen en warme specerijen.',
      body: 3,
      acidity: 4,
      sweetness: 5,
    },
    scaScore: '88',
  },
  'prestige-espresso': {
    origins: [
      { country: 'Indonesië', flag: '🇮🇩' },
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Costa Rica', flag: '🇨🇷' },
    ],
    characterProfile: {
      description: 'Exotisch met cacao, rode druif en diepe wijnachtige zoetheid.',
      body: 4,
      acidity: 4,
      sweetness: 5,
    },
    scaScore: '88',
  },
  'prestige-filter': {
    origins: [
      { country: 'Ethiopië', flag: '🇪🇹' },
      { country: 'Kenia', flag: '🇰🇪' },
    ],
    characterProfile: {
      description: 'Gesha-karakter met jasmijn, bergamot, witte perzik en watermeloen.',
      body: 2,
      acidity: 5,
      sweetness: 5,
    },
    scaScore: '89+',
  },

  // --- Barrel Aged ---
  'casknolia-moscatel-barrel': {
    origins: [{ country: 'Honduras', flag: '🇭🇳' }],
    characterProfile: {
      description: 'Gerijpt in Moscatel eik. Muskaatdruif, rozijnen en florale zoetheid.',
      body: 4,
      acidity: 2,
      sweetness: 5,
    },
    scaScore: '87+',
  },
  'casknolia-pedro-ximenez-cask': {
    origins: [{ country: 'Honduras', flag: '🇭🇳' }],
    characterProfile: {
      description: 'Gerijpt in PX sherryvaten. Vijgen, dadels en donkere chocolade.',
      body: 5,
      acidity: 1,
      sweetness: 5,
    },
    scaScore: '88',
  },
  'buffalo-trace-bourbon-barrel': {
    origins: [{ country: 'Brazilië', flag: '🇧🇷' }],
    characterProfile: {
      description: 'Gerijpt in Bourbon vaten. Rijke vanille, eikenhout, toffee en karamel.',
      body: 5,
      acidity: 1,
      sweetness: 4,
    },
    scaScore: '87+',
  },

  // --- Infused ---
  'milau-vanilla': {
    origins: [{ country: 'Brazilië', flag: '🇧🇷' }],
    characterProfile: {
      description: 'Natuurlijke Bourbon-vanille, fluweelzachte room en zoete karamel.',
      body: 4,
      acidity: 1,
      sweetness: 5,
    },
    scaScore: 'Infused',
  },
  'milau-cinnamon': {
    origins: [
      { country: 'Brazilië', flag: '🇧🇷' },
      { country: 'Colombia', flag: '🇨🇴' },
    ],
    characterProfile: {
      description: 'Warme kaneel, speculaaskruiden en bruine suiker met specialty arabica.',
      body: 4,
      acidity: 2,
      sweetness: 4,
    },
    scaScore: 'Infused',
  },
  'milau-almond': {
    origins: [{ country: 'Brazilië', flag: '🇧🇷' }],
    characterProfile: {
      description: 'Geroosterde amandel, marsepein en praliné met romige chocoladebody.',
      body: 4,
      acidity: 1,
      sweetness: 4,
    },
    scaScore: 'Infused',
  },

  // --- Single Origins ---
  'colombia-ambrosia-pink-bourbon': {
    origins: [{ country: 'Colombia', flag: '🇨🇴' }],
    characterProfile: {
      description: 'Zeldzame Pink Bourbon met rode bessen, honing en citroen.',
      body: 3,
      acidity: 4,
      sweetness: 5,
    },
    scaScore: '87',
  },
  'ethiopia-gesha-bench-maji': {
    origins: [{ country: 'Ethiopië', flag: '🇪🇹' }],
    characterProfile: {
      description: 'Exclusieve heirloom Gesha met uitzonderlijke florale klasse.',
      body: 2,
      acidity: 5,
      sweetness: 5,
    },
    scaScore: '88+',
  },
};
