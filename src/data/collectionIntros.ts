import { CollectionIntro } from '../types';

export const COLLECTION_INTROS: Record<string, CollectionIntro> = {
  Budget: {
    id: 'Budget',
    title: 'Milau Budget',
    priceFrom: 'Vanaf €5,25 per 250g',
    description: [
      'De Milau Budget Collection bewijst dat goede koffie niet duur hoeft te zijn. Dit assortiment biedt toegankelijke espresso-, filter- en dagelijkse koffies met een vol karakter, veel body en een uitstekende prijs-kwaliteitverhouding.',
      'Deze koffies zijn speciaal ontwikkeld voor wie de stap wil zetten van standaard supermarktmerken naar vers gebrande koffie, zonder daarvoor meer te betalen. Verwacht vertrouwde smaken van chocolade, noten en zachte karameltinten, perfect voor dagelijks gebruik.',
    ],
    targetAudienceTitle: 'Voor wie?',
    targetAudience: [
      'Dagelijkse koffiedrinker',
      'Volautomatische machines',
      'Kantoren en gezinnen',
      'Beste prijs-kwaliteitverhouding',
    ],
  },
  Value: {
    id: 'Value',
    title: 'Milau Value',
    priceFrom: 'Vanaf €5,95 per 250g',
    description: [
      "De Milau Value Collection vormt de ideale brug tussen traditionele koffie en specialty coffee. Deze zorgvuldig samengestelde blends bevatten geselecteerde Arabica's aangevuld met karaktervolle koffies uit Brazilië, Colombia en Costa Rica.",
      'Het resultaat is een evenwichtige kop koffie met meer zoetheid, complexiteit en oorsprongskarakter dan klassieke commerciële koffies, terwijl de prijs bijzonder toegankelijk blijft.',
      'Verwacht tonen van melkchocolade, karamel, honing en subtiele fruitige accenten.',
    ],
    targetAudienceTitle: 'Voor wie?',
    targetAudience: [
      'Koffieliefhebbers die willen upgraden',
      'Espresso én filter',
      'Dagelijks gebruik met specialty karakter',
    ],
  },
  Selection: {
    id: 'Selection',
    title: 'Milau Selection',
    priceFrom: 'Vanaf €8,50 per 250g',
    description: [
      'De Milau Selection Collection vormt het hart van ons assortiment. Hier begint de echte wereld van specialty coffee.',
      'Voor deze blends selecteren wij uitsluitend hoogwaardige koffies afkomstig van gerenommeerde producenten en coöperaties uit onder meer Ethiopië, Rwanda, Costa Rica, Colombia en Brazilië. De focus ligt op balans, zoetheid en terroir.',
      'Verwacht complexe smaken van karamel, citrus, rijp steenfruit, chocolade en bloemige toetsen.',
    ],
  },
  Premium: {
    id: 'Premium',
    title: 'Milau Premium',
    priceFrom: 'Vanaf €10,95 per 250g',
    description: [
      'Voor de Milau Premium Collection selecteren wij uitsluitend koffiebonen met een Specialty Coffee Association-score van minimaal 87 punten.',
      'Deze uitzonderlijke koffies onderscheiden zich door hun verfijnde aroma’s, uitgesproken zoetheid en complexe smaakstructuur. Denk aan variëteiten zoals Pink Bourbon, Orange Bourbon en zorgvuldig geselecteerde anaerobe lots.',
      'Verwacht elegante smaken van rood fruit, bloemenhoning, tropisch fruit, citrus en verfijnde chocoladetonen.',
    ],
  },
  Prestige: {
    id: 'Prestige',
    title: 'Milau Prestige',
    priceFrom: 'Vanaf €11,95 per 250g',
    description: [
      'De Milau Prestige Collection vertegenwoordigt het absolute topsegment van ons assortiment.',
      'Voor deze blends selecteren wij uitsluitend coffees met een SCA-score van 88 punten en hoger, waaronder exclusieve variëteiten zoals Gesha, Maragesha, SL-28 en andere zeldzame microlots.',
      'Veel van deze koffies zouden op zichzelf reeds uitzonderlijke single origins vormen. In onze Prestige-blends worden ze samengebracht tot complexe, gelaagde smaakervaringen die zich blijven ontwikkelen terwijl de koffie afkoelt.',
      'Verwacht aroma’s van jasmijn, witte perzik, bergamot, tropisch fruit, honing en florale tonen die enkel voorkomen in de absolute top van specialty coffee.',
    ],
  },
  'Single Origins': {
    id: 'Single Origins',
    title: 'Single Origin Coffee',
    priceFrom: 'Vanaf €11,50 per 250g',
    description: [
      'Onze Single Origin Collection bestaat uit koffies afkomstig van één specifieke regio, washing station, boerderij of producent.',
      'Elke coffee vertelt het verhaal van zijn herkomst. Van de florale elegantie van een Ethiopische Gesha tot de intense fruitigheid van een Colombiaanse Pink Bourbon.',
      'Deze koffies worden gebrand om hun unieke oorsprong maximaal tot hun recht te laten komen.',
    ],
  },
  'Barrel Aged': {
    id: 'Barrel Aged',
    title: 'Barrel Aged Coffee',
    priceFrom: 'Vanaf €16,95 per 250g',
    description: [
      'Onze Barrel Aged Collection behoort tot de meest exclusieve koffies in ons assortiment.',
      'Groene koffiebonen rijpen gedurende meerdere weken in zorgvuldig geselecteerde eikenhouten vaten. Tijdens dit proces absorbeert de koffie subtiele aroma’s uit het hout en de eerdere inhoud van het vat.',
      'Afhankelijk van het gebruikte vat ontstaan unieke smaakprofielen:',
    ],
    barrelProfiles: [
      {
        caskName: 'CASKNOLIA® Moscatel Barrels',
        notes: ['Muskaatdruif', 'Rozijnen', 'Honing', 'Florale zoetheid'],
      },
      {
        caskName: 'CASKNOLIA® Pedro Ximénez Sherry Cask',
        notes: ['Vijgen', 'Dadels', 'Donkere chocolade', 'Gedroogd fruit'],
      },
      {
        caskName: 'Buffalo Trace® Bourbon Barrel',
        notes: ['Vanille', 'Eikenhout', 'Karamel', 'Toffee'],
      },
    ],
    extraNote: 'Elke batch wordt in beperkte oplage geproduceerd en is slechts tijdelijk beschikbaar.',
  },
  Infused: {
    id: 'Infused',
    title: 'Infused Coffee',
    priceFrom: 'Vanaf €10,95 per 250g',
    description: [
      'Onze Infused Coffee Collection combineert hoogwaardige specialty coffee met natuurlijke aroma-infusies.',
      'Na het brandproces worden de koffiebonen op een gecontroleerde en passieve manier verrijkt met zorgvuldig geselecteerde natuurlijke aroma’s. Hierdoor behouden de bonen hun oorspronkelijke kwaliteit, terwijl extra smaaklagen worden toegevoegd.',
    ],
  },
};
