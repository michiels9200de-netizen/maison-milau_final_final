import fs from 'node:fs';
import path from 'node:path';
import { CoffeeDossier } from '../src/types';

const isVercelRuntime = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production')
);

const DOSSIERS_FILE_PATH = path.join(process.cwd(), 'data', 'coffee_dossiers.json');

// Master seed list containing all Maison Milau products with complete dossier specifications
export const INITIAL_DOSSIERS: CoffeeDossier[] = [
  // --- BUDGET COLLECTION ---
  {
    id: 'budget-espresso',
    slug: 'budget-espresso',
    productName: 'Milau Budget Espresso',
    shortIntro: 'Sterke, donkere espresso met veel body, dichte crema en een lage aciditeit.',
    coffeeStory: 'Geïnspireerd op de klassieke Zuid-Italiaanse espressobar-cultuur. Deze blend levert een compromisloze intensiteit met diepe tonen van pure chocolade, geroosterde walnoten en een volle, romige crema die lang overeind blijft. De ideale krachtpatser voor een stevige ochtendespresso of een volle cappuccino.',
    origin: 'Oeganda & Colombia',
    region: 'Rwenzori Mountains (Kasese) & Huila',
    farmProducer: 'Rwenzori Smallholders Coöperatie & Finca Jardin de Linares',
    varietal: '85% Robusta Bariguna (Oeganda), 15% Castillo Arabica (Colombia)',
    processingMethod: 'Natural (Robusta) & Gewassen (Arabica)',
    roastProfile: 'Medium-Dark Slow Drum Roast (Ontwikkeling 19%)',
    flavourNotes: ['Donkere chocolade', 'Geroosterde walnoot', 'Toast', 'Dichte hazelnootcrema'],
    body: 5,
    bodyDescription: 'Vol, zwaar en stroperig mondgevoel',
    acidity: 1,
    acidityDescription: 'Zeer laag, zacht en niet-storend',
    sweetness: 2,
    sweetnessDescription: 'Gekarameliseerde cacao-suikers',
    brewingMethods: ['Espresso', 'Volautomaat', 'Moka Pot'],
    foodPairings: 'Pure chocolade (75%+), cantuccini, Italiaanse amandelbiscotti, tiramisu.',
    traceabilityInfo: 'Geteeld op 1.200m - 1.650m hoogte. Directe samenwerking met lokale droogstations in Kasese en de coöperatie in Huila. Oogstjaar 2025/2026.',
    sustainabilityInfo: '100% traceerbare bonen. Eerlijke premies boven de beursprijs voor kleinschalige boerengemeenschappen. Verpakt in 100% recycleerbare folie.',
    additionalNotes: 'Presteert ongekend stabiel op zowel consumenten- als professionele espressomachines. Snijdt krachtig door melk.',
    internalNotes: 'Vaste blendformule. Basiscomponent Rwenzori Robusta Screen 18 aangevoerd via Origin Bridge. Veelgebruikt in horeca met hoog melkvolume.',
    collection: 'Budget',
    type: 'Espresso',
    scaScore: '80-82',
    webshopProductId: 'prod-budget-espresso',
    aliases: ['prod-budget-espresso'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'budget-daily',
    slug: 'budget-omni',
    productName: 'Milau Budget Daily',
    shortIntro: 'Alledaagse koffie voor bean-to-cup volautomaten met zachte cacao, pinda en een betrouwbare ronde body.',
    coffeeStory: 'Ontwikkeld als de betrouwbare werkpaard-koffie voor dagelijks kantoor- en thuisverbruik. Dankzij de medium omniroast branden wij deze blend zodanig dat er geen overmatige bitters ontstaan, terwijl het volle mondgevoel behouden blijft. Perfect voor wie de hele dag door zorgeloos lungo of melkkoffie wil drinken.',
    origin: 'Oeganda & Brazilië',
    region: 'Rwenzori & Cerrado Mineiro',
    farmProducer: 'Bariguna Smallholders & Fazenda Sitio dos Cedros',
    varietal: '80% Specialty Robusta Bariguna, 20% Mundo Novo Arabica',
    processingMethod: 'Natural (Zongedroogd op verhoogde bedden)',
    roastProfile: 'Medium Omniroast voor volautomatische machines',
    flavourNotes: ['Cacao', 'Geroosterde pinda', 'Bruine suiker', 'Melkchocolade'],
    body: 4,
    bodyDescription: 'Rond, zacht en toegankelijk',
    acidity: 1,
    acidityDescription: 'Zeer laag en vriendelijk voor de maag',
    sweetness: 2,
    sweetnessDescription: 'Milde tonen van rietsuiker',
    brewingMethods: ['Volautomatische machines', 'Lungo', 'Melkbereidingen'],
    foodPairings: 'Boterkoekjes, ontbijtkoek, croissant en bananenbrood.',
    traceabilityInfo: 'Geselecteerd op uniforme korrelgrootte voor storingsvrije doorloop in bonenmalers van Jura, DeLonghi, Siemens en WMF.',
    sustainabilityInfo: 'Geen chemische ontgassingsmiddelen. Direct trade relaties in Oeganda en Minas Gerais.',
    additionalNotes: 'Onze absolute bestseller voor kantoren en zakelijke bean-to-cup machines.',
    internalNotes: 'Alias: budget-omni. Lage storingsgraad in volautomaten dankzij minimale olievorming op de boon.',
    collection: 'Budget',
    type: 'Daily',
    scaScore: '80-81',
    webshopProductId: 'prod-budget-omni',
    aliases: ['budget-omni', 'prod-budget-omni'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'budget-filter',
    slug: 'budget-filter',
    productName: 'Milau Budget Filter',
    shortIntro: 'Toegankelijke filterkoffie met veel body, melkchocolade en zachte notentoetsen.',
    coffeeStory: 'Klassieke filterkoffie zoals hij bedoeld is: verwarmend, rond en doordrinkbaar. De blend brengt de troostende zoetheid van Braziliaanse Arabica samen met de stevige body van Oegandese hooglandbonen.',
    origin: 'Oeganda & Brazilië',
    region: 'Rwenzori & Canastra Valley',
    farmProducer: 'Bariguna & Canastra Sweet Catuai Producers',
    varietal: '70% Bariguna Robusta, 30% Sweet Catuai Arabica',
    processingMethod: 'Natural',
    roastProfile: 'Medium Filter Roast',
    flavourNotes: ['Melkchocolade', 'Biscuit', 'Walnoot'],
    body: 4,
    bodyDescription: 'Rond en evenwichtig',
    acidity: 2,
    acidityDescription: 'Zacht en levendig',
    sweetness: 2,
    sweetnessDescription: 'Moutige zoetheid',
    brewingMethods: ['Koffiezetapparaat', 'Snelfilter', 'French Press'],
    foodPairings: 'Zanddeeggebak, traditionele appeltaart en speculaas.',
    traceabilityInfo: 'Rechtstreekse import via de haven van Antwerpen. Handmatig gesorteerd.',
    sustainabilityInfo: 'Schaduwteelt en minimale bodembelasting.',
    additionalNotes: 'Blijft heerlijk zacht van smaak, ook wanneer de koffie langer in de thermoskan staat.',
    internalNotes: 'Stabiele batchrotatie met focus op hoge versheid.',
    collection: 'Budget',
    type: 'Filter',
    scaScore: '80-82',
    webshopProductId: 'prod-budget-filter',
    aliases: ['prod-budget-filter'],
    updatedAt: new Date().toISOString(),
  },

  // --- VALUE COLLECTION ---
  {
    id: 'value-espresso',
    slug: 'value-espresso',
    productName: 'Milau Value Espresso',
    shortIntro: 'Evenwichtige, romige espresso met zachte zoetheid, karamel, hazelnoot en gedroogd fruit.',
    coffeeStory: 'Een geraffineerde blend met een hoge dosering specialty Arabica uit Colombia en Brazilië. De toevoeging van een vleugje hoogland-robusta creëert een prachtige hazelnootkleurige crema, terwijl de gewassen Castillo-arabica een subtiele toets van gedroogde vijgen toevoegt.',
    origin: 'Colombia, Brazilië & Oeganda',
    region: 'Huila, Cerrado Mineiro & Rwenzori',
    farmProducer: 'Finca Jardin de Linares, Canastra Sweet Catuai & Sitio dos Cedros',
    varietal: '35% Castillo, 30% Sweet Catuai, 20% Mundo Novo, 15% Bariguna',
    processingMethod: 'Washed & Natural',
    roastProfile: 'Medium Espresso Roast',
    flavourNotes: ['Chocolade', 'Karamel', 'Hazelnoot', 'Gedroogd fruit'],
    body: 4,
    bodyDescription: 'Fluweelzacht en romig',
    acidity: 2,
    acidityDescription: 'Licht rins met fijne fruitzuren',
    sweetness: 3,
    sweetnessDescription: 'Rijke karamelzoetheid',
    brewingMethods: ['Espresso', 'Cappuccino', 'Volautomaat'],
    foodPairings: 'Amandelcroissants, chocolade brownies en vanillecake.',
    traceabilityInfo: 'Hoogte 1.100m - 1.700m. Screen size 17/18.',
    sustainabilityInfo: 'Milieubewuste teelt volgens Rainforest Alliance standaarden.',
    additionalNotes: 'Vormt een sublieme basis voor latte art dankzij de dichte microfoam-compatibiliteit.',
    internalNotes: 'Marginaal premium receptuur met zeer hoge klanttevredenheid en herhaalaankopen.',
    collection: 'Value',
    type: 'Espresso',
    scaScore: '83-84',
    webshopProductId: 'prod-value-espresso',
    aliases: ['prod-value-espresso'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'value-daily',
    slug: 'value-omni',
    productName: 'Milau Value Daily',
    shortIntro: 'De ideale brug tussen traditionele koffie en specialty coffee met zoetheid en amandelaccenten.',
    coffeeStory: 'Ontworpen voor de veeleisende koffiedrinker die de verfijning van specialty coffee zoekt, maar een herkenbaar en rond profiel verlangt. Tonen van geroosterde amandelen, toffee en melkcacao maken dit de perfecte all-day blend.',
    origin: 'Brazilië, Colombia & Oeganda',
    region: 'Canastra, Huila & Kasese',
    farmProducer: 'Canastra Sweet Catuai, Sitio dos Cedros & Castillo Colombia',
    varietal: 'Canastra Sweet Catuai, Sitio dos Cedros, Castillo Colombia, Bariguna',
    processingMethod: 'Pulped Natural & Washed',
    roastProfile: 'Medium Omniroast',
    flavourNotes: ['Cacao', 'Toffee', 'Amandel'],
    body: 4,
    bodyDescription: 'Rond en harmonieus',
    acidity: 2,
    acidityDescription: 'Mild en subtiel fris',
    sweetness: 3,
    sweetnessDescription: 'Toffee en bruine suiker',
    brewingMethods: ['Volautomaat', 'Lungo', 'Filter'],
    foodPairings: 'Kaneelkoekjes, havermoutkoekjes en zachte kazen.',
    traceabilityInfo: 'Rechtstreeks contact met telers in Minas Gerais en Huila.',
    sustainabilityInfo: 'Waterbesparende pulper-methoden in Colombia.',
    additionalNotes: 'Bijzonder geliefd bij zowel espresso- als lungo-drinkers.',
    internalNotes: 'Alias: value-omni. Kernproduct voor zakelijke en particuliere abonnementen.',
    collection: 'Value',
    type: 'Daily',
    scaScore: '84+',
    webshopProductId: 'prod-value-omni',
    aliases: ['value-omni', 'prod-value-omni'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'value-filter',
    slug: 'value-filter',
    productName: 'Milau Value Filter',
    shortIntro: 'Fris en harmonieus met een elegante zoetheid van bloemenhoning, citrus en melkchocolade.',
    coffeeStory: 'Een 100% zuivere Arabica filterkoffie samengesteld uit hooglandbonen van Colombia, Brazilië en Costa Rica. De kop kenmerkt zich door een heldere rinsheid en een delicate honingzoetheid.',
    origin: 'Colombia, Brazilië & Costa Rica',
    region: 'Huila, Cerrado & Tarrazú',
    farmProducer: 'Geselecteerde Arabica coöperaties Colombia, Brazilië en Costa Rica',
    varietal: '100% Arabica (Caturra, Bourbon, Typica)',
    processingMethod: 'Washed',
    roastProfile: 'Light-Medium Filter Roast',
    flavourNotes: ['Bloemenhoning', 'Citrus', 'Melkchocolade'],
    body: 3,
    bodyDescription: 'Zijdezacht en elegant',
    acidity: 3,
    acidityDescription: 'Levendig en sprankelend',
    sweetness: 4,
    sweetnessDescription: 'Bloemenhoning en rietsuiker',
    brewingMethods: ['V60', 'Chemex', 'Batch Brew', 'Moccamaster'],
    foodPairings: 'Citroenmeringue, vanillecake en frambozengebak.',
    traceabilityInfo: 'Hoogte 1.450m - 1.750m. Zongedroogd op patio’s.',
    sustainabilityInfo: 'Directe ondersteuning van kleinschalige micro-molens in Tarrazú.',
    additionalNotes: 'Een uitstekende introductie tot de wereld van gewassen hoogland Arabica.',
    internalNotes: 'SCA 84+ profiel. Zorgvuldig geventileerde branding.',
    collection: 'Value',
    type: 'Filter',
    scaScore: '84+',
    webshopProductId: 'prod-value-filter',
    aliases: ['prod-value-filter'],
    updatedAt: new Date().toISOString(),
  },

  // --- SELECTION COLLECTION ---
  {
    id: 'selection-daily',
    slug: 'selection-daily',
    productName: 'Milau Selection Daily',
    shortIntro: 'Onze iconische signatuurblend: melkchocolade, karamel, bergamot, zwarte thee en zachte bloemen.',
    coffeeStory: 'Het absolute hart van Maison Milau. Deze blend is het resultaat van jarenlang finetunen: Brazilië levert een volle romige body met chocoladetonen, Ethiopië geeft een aromatische lift van jasmijn en bergamot, en Costa Rica zorgt voor de verfijnde structuur en honingzoetheid. Een meesterwerk in balans.',
    origin: 'Brazilië, Ethiopië & Costa Rica',
    region: 'Santos (Sul de Minas), Djimmah & Tarrazú',
    farmProducer: 'Santos Fine Cup 17/18, Djimmah Grade 5 & El Bueyerito Washed',
    varietal: '50% Brazil Santos FC, 30% Ethiopia Heirloom, 20% Costa Rica Caturra',
    processingMethod: 'Natural & Washed',
    roastProfile: 'Veelzijdige Omniroast voor espresso, lungo, cappuccino en filter',
    flavourNotes: ['Melkchocolade', 'Karamel', 'Bergamot', 'Zwarte thee', 'Zachte bloemen', 'Lichte citrus'],
    body: 4,
    bodyDescription: 'Perfect gebalanceerd en rond',
    acidity: 3,
    acidityDescription: 'Elegante, aromatische bergamot-lift',
    sweetness: 4,
    sweetnessDescription: 'Romige karamel en rietsuiker',
    brewingMethods: ['Espresso', 'Lungo', 'Cappuccino', 'Filter'],
    foodPairings: 'Puur genot; past uitstekend bij chocoladekoekjes, appeltaart en Belgische wafels.',
    traceabilityInfo: 'Oogstjaar 2025/2026. Volledig traceerbaar tot op coöperatieniveau. Geteeld op 1.300m - 1.800m.',
    sustainabilityInfo: 'Direct Trade met gegarandeerde minimumprijzen die ruim boven fair-trade niveau liggen.',
    additionalNotes: 'Onze meest gedronken en aanbevolen koffie. De signatuurblend van Maison Milau.',
    internalNotes: 'Vlaggenschip van het merk. Strikte sensorische kwaliteitscontrole bij elke batch in Roastery Oudegem.',
    collection: 'Selection',
    type: 'Daily',
    scaScore: '82 - 83,5',
    webshopProductId: 'prod-selection-daily',
    aliases: ['prod-selection-daily'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'selection-espresso',
    slug: 'selection-espresso',
    productName: 'Milau Selection Espresso',
    shortIntro: 'Klassieke Napolitaanse espresso met donkere chocolade, cacao, geroosterde hazelnoot en bruine specerijen.',
    coffeeStory: 'Voor de pure espressoliefhebber. Braziliaanse Arabica vormt de zoete chocoladebasis, India voegt exotische kruidigheid en diepte toe, terwijl Oegandese hoogland-robusta zorgt voor een ondoordringbare crema en monumentale intensiteit. Vloeibaar goud in het kopje.',
    origin: 'Brazilië, India & Oeganda',
    region: 'Santos, Karnataka (Mysore) & Rwenzori',
    farmProducer: 'Santos Fine Cup 17/18, India Cherry A & Uganda Screen 18',
    varietal: '55% Brazil Santos FC, 25% India Cherry A, 20% Uganda Robusta Screen 18',
    processingMethod: 'Natural (Zongedroogd)',
    roastProfile: 'Klassieke Espresso Roast met monumentale crema-ontwikkeling',
    flavourNotes: ['Donkere chocolade', 'Cacao', 'Geroosterde hazelnoot', 'Bruine specerijen', 'Lange krachtige afdronk'],
    body: 5,
    bodyDescription: 'Zeer zwaar, dichte crema en fluwelig',
    acidity: 1,
    acidityDescription: 'Nagenoeg geen storende zuren',
    sweetness: 3,
    sweetnessDescription: 'Geroosterde suikers en donkere toffee',
    brewingMethods: ['Espresso', 'Flat White', 'Ristretto'],
    foodPairings: 'Klassieke tiramisu, pure truffels, cantuccini en donkere chocoladetaart.',
    traceabilityInfo: 'Screen 17/18 uniform geselecteerd. Hoogte 1.000m - 1.400m.',
    sustainabilityInfo: 'Schaduwrijke polycultuur in Mysore en gecertificeerde droogstations in Rwenzori.',
    additionalNotes: 'Snijdt met het grootste gemak door melk. De ultieme keuze voor een intense cappuccino.',
    internalNotes: 'Horeca favoriet voor drukke espressobars die een krachtige crema wensen.',
    collection: 'Selection',
    type: 'Espresso',
    scaScore: '80 - 82',
    webshopProductId: 'prod-selection-espresso',
    aliases: ['prod-selection-espresso'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'selection-filter',
    slug: 'selection-filter',
    productName: 'Milau Selection Filter',
    shortIntro: 'Zachte, cleane filterblend met citrus, groene druif, pruim, amandel en hazelnoot.',
    coffeeStory: 'Een zachte filterblend die frisse Ethiopische aroma’s combineert met een cleane Peruaanse structuur en een ronde Braziliaanse notenbasis. Fris, zoet en verkwikkend.',
    origin: 'Ethiopië, Peru & Brazilië',
    region: 'Limu, Valley Coffee Cajamarca & Itaguaçu',
    farmProducer: 'Limu G2 Washed, Peru Grade 1 & Brazil Itaguaçu Blend',
    varietal: '45% Ethiopia Limu G2, 35% Peru Valley Washed, 20% Brazil Itaguaçu',
    processingMethod: 'Washed & Natural',
    roastProfile: 'Zachte Filter Roast met cleane structuur',
    flavourNotes: ['Citrus', 'Groene druif', 'Pruim', 'Amandel', 'Hazelnoot', 'Walnoot'],
    body: 3,
    bodyDescription: 'Crisp, clean en fris',
    acidity: 3,
    acidityDescription: 'Heldere fruitzuren van groene druif en citrus',
    sweetness: 4,
    sweetnessDescription: 'Zoete amandelen en rietsuiker',
    brewingMethods: ['Pour-over V60', 'Chemex', 'Moccamaster'],
    foodPairings: 'Citroentaart, amandelspek en verse scones met confituur.',
    traceabilityInfo: 'Gewassen bonen uit Limu (1.800m) en biologische coöperatie Cajamarca (1.700m).',
    sustainabilityInfo: 'Biologisch gecertificeerde teelt in Peru; waterzuivering bij wasstations.',
    additionalNotes: 'Smaakt heerlijk fris en fruitig; laat het kopje iets afkoelen voor maximale smaakbeleving.',
    internalNotes: 'Populaire pour-over keuze voor het weekend.',
    collection: 'Selection',
    type: 'Filter',
    scaScore: '83 - 85',
    webshopProductId: 'prod-selection-filter',
    aliases: ['prod-selection-filter'],
    updatedAt: new Date().toISOString(),
  },

  // --- PREMIUM COLLECTION ---
  {
    id: 'premium-daily',
    slug: 'premium-daily',
    productName: 'Milau Premium Daily',
    shortIntro: 'Verfijnde omniroast met cacao nibs, melkchocolade, bessen, abrikoos, braam en sappige peer.',
    coffeeStory: 'Een omniroast van zeldzame klasse. Brazilië Pico Mirante (86 pnt) levert zoete chocolade en body, Ethiopië Hambella (85,5 pnt) brengt wilde bosbessen en cacao, terwijl de Keniaanse peaberry (86 pnt) zorgt voor een sappige, levendige helderheid en een memorabele afdronk.',
    origin: 'Brazilië, Ethiopië & Kenia',
    region: 'Pico Mirante, Guji (Hambella Buku Saisa) & Nyeri (Ngorona)',
    farmProducer: 'Fazenda Pico Mirante, Buku Saisa Washing Station & Ngorona Factory',
    varietal: '40% Brazil Pico Mirante Natural, 35% Ethiopia Guji Hambella, 25% Kenya Ngorona PB Top',
    processingMethod: 'Natural & Washed',
    roastProfile: 'Verfijnde omniroast voor zowel zwarte koffie als verfijnde melkbereidingen',
    flavourNotes: ['Cacao nibs', 'Melkchocolade', 'Bessen', 'Abrikoos', 'Braam', 'Peer'],
    body: 4,
    bodyDescription: 'Zijdezacht, complex en sappig',
    acidity: 3,
    acidityDescription: 'Heldere bessen- en steenvruchtenzuurtjes',
    sweetness: 4,
    sweetnessDescription: 'Gekonfijt fruit en toffee',
    brewingMethods: ['Espresso', 'Lungo', 'Aeropress', 'Melkbereidingen'],
    foodPairings: 'Chocolademousse met frambozencoulis, macarons en amandelgebak.',
    traceabilityInfo: 'Exclusieve micro-lots met SCA cupping scores tussen 85,5 en 86 punten. Hoogte 1.600m - 2.050m.',
    sustainabilityInfo: 'Rechtstreekse steun aan school- en drinkwaterprojecten in Nyeri (Kenia).',
    additionalNotes: 'Universeel geliefd bij barista’s en fijnproevers. Een van onze meest geprezen koffies.',
    internalNotes: 'Hoogwaardige componenten. Peaberry bonen uit Kenia worden apart ingekocht via Nordic Approach.',
    collection: 'Premium',
    type: 'Daily',
    scaScore: '85,5 - 86',
    webshopProductId: 'prod-premium-daily',
    aliases: ['prod-premium-daily'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'premium-espresso',
    slug: 'premium-espresso',
    productName: 'Milau Premium Espresso',
    shortIntro: 'Complexe specialty espresso met kers, pruim, kokos, hazelnoot, cashew, honing, cranberry en vanille.',
    coffeeStory: 'Een grensverleggende premium espresso. Honduras La Joya (120-uur anaëroob gefermenteerd) levert een weelde aan rijp fruit en kokos, Brazilië Fazenda Pinhal zorgt voor een stevige romige body, en de gewassen Colombia Pink Bourbon voegt ongeëvenaarde aromatische finesse toe.',
    origin: 'Honduras, Brazilië & Colombia',
    region: 'La Joya, Sul de Minas & Huila',
    farmProducer: 'Finca La Joya (Anaerobic), Fazenda Pinhal & Finca Ambrosia Pink Bourbon',
    varietal: '40% Honduras La Joya Fermented (86,75 pnt), 35% Brazil Pinhal (86 pnt), 25% Colombia Pink Bourbon (87 pnt)',
    processingMethod: '120-hour Anaerobic Fermented Natural, Natural & Washed',
    roastProfile: 'Medium-Light Specialty Espresso',
    flavourNotes: ['Kers', 'Pruim', 'Kokos', 'Hazelnoot', 'Cashew', 'Honing', 'Cranberry', 'Sinaasappel', 'Vanille'],
    body: 4,
    bodyDescription: 'Stroperig en fluweelzacht mondgevoel',
    acidity: 3,
    acidityDescription: 'Sappige cranberry- en kersenzuren',
    sweetness: 5,
    sweetnessDescription: 'Intense honing- en vanillezoetheid',
    brewingMethods: ['Espresso', 'Cortado', 'Cappuccino'],
    foodPairings: 'Donkere chocolade met cranberries, vijgentaart en gastronomische desserts.',
    traceabilityInfo: '120 uur gecontroleerde anaërobe vergisting. Geteeld op 1.500m - 1.850m. SCA score 86 - 87 punten.',
    sustainabilityInfo: 'Innovatieve ecologische micro-lot landbouw met volledige oogsttransparantie.',
    additionalNotes: 'Een feest van aroma’s. Extracteer bij 93°C voor een perfecte zoet-zuur balans.',
    internalNotes: 'Pink Bourbon aandeel van Finca Ambrosia. Beperkte seizoensvoorraad.',
    collection: 'Premium',
    type: 'Espresso',
    scaScore: '86 - 87',
    webshopProductId: 'prod-premium-espresso',
    aliases: ['prod-premium-espresso'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'premium-filter',
    slug: 'premium-filter',
    productName: 'Milau Premium Filter',
    shortIntro: 'Heldere, florale filterblend met groene appel, grapefruit, groene thee, abrikoos, braam en sencha-thee.',
    coffeeStory: 'Een ode aan de meest verfijnde filterterroirs ter wereld. Ethiopië Arbegona Washed (87 pnt) levert florale frisheid, Kenia Ngorona Washed PB (86 pnt) brengt sappige bessen en grapefruit, terwijl Indonesië Catur Pantan (87 pnt) zorgt voor een theeachtige structuur en een ongekende lange afdronk.',
    origin: 'Ethiopië, Kenia & Indonesië',
    region: 'Sidamo (Arbegona), Nyeri & Atjeh (Pantan Cuaca)',
    farmProducer: 'Arbegona Washed, Ngorona Factory & Catur Pantan Cuaca Farm',
    varietal: '40% Ethiopia Arbegona, 30% Kenya Ngorona PB, 30% Indonesia Catur Pantan',
    processingMethod: 'Fully Washed',
    roastProfile: 'Heldere, aromatische Nordic-Style Filterblend',
    flavourNotes: ['Groene appel', 'Grapefruit', 'Groene thee', 'Abrikoos', 'Braam', 'Witte druif', 'Sencha-thee'],
    body: 3,
    bodyDescription: 'Zijdezacht, theekopperig en kristalhelder',
    acidity: 4,
    acidityDescription: 'Sprankelend, levendig en sappig',
    sweetness: 4,
    sweetnessDescription: 'Witte perzik en bloemenhoning',
    brewingMethods: ['Kalita Wave', 'V60', 'Aeropress', 'Origami Dripper'],
    foodPairings: 'Matcha gebak, limoentaart, verse perziken en lichte citroenkoekjes.',
    traceabilityInfo: 'Geteeld boven 1.900m hoogte. Volledig gewassen met zuiver bergwater. SCA score 86 - 87 punten.',
    sustainabilityInfo: 'Geen synthetische gewasbeschermers; kleinschalige agrobosbouw.',
    additionalNotes: 'Drink bij 60°C voor de meest spectaculaire ontwikkeling van de theetoetsen.',
    internalNotes: 'Exclusieve boonallocatie via Nordic Approach en Kopi Fabriek.',
    collection: 'Premium',
    type: 'Filter',
    scaScore: '86 - 87',
    webshopProductId: 'prod-premium-filter',
    aliases: ['prod-premium-filter'],
    updatedAt: new Date().toISOString(),
  },

  // --- PRESTIGE COLLECTION ---
  {
    id: 'prestige-daily',
    slug: 'prestige-daily',
    productName: 'Milau Prestige Daily',
    shortIntro: 'Exclusieve omniroast met groene appel, citrus, koffiebloesem, lemongrass, delicate bloemen en warme specerijen.',
    coffeeStory: 'Een buitengewoon zeldzame omniroast voor de absolute fijnproever. Indonesië Frinsa Collective (87 pnt) geeft een elegante structuur zonder zware tonen, Ethiopië Wete Konga zorgt voor bedwelmende bloemen en citrus, terwijl Colombia Orange Bourbon (87 pnt) een ragfijne zoetheid en finesse brengt.',
    origin: 'Indonesië, Ethiopië & Colombia',
    region: 'West-Java (Frinsa Estate), Yirgacheffe & Huila',
    farmProducer: 'Frinsa Collective Washed, Wete Konga & Finca Orange Bourbon',
    varietal: '40% Indonesia Frinsa (87 pnt), 35% Ethiopia Wete Konga, 25% Colombia Orange Bourbon (87 pnt)',
    processingMethod: 'Washed & Extended Fermentation',
    roastProfile: 'Exclusieve precisie-omniroast met hoge aromatische intensiteit',
    flavourNotes: ['Groene appel', 'Citrus', 'Koffiebloesem', 'Lemongrass', 'Delicate bloemen', 'Thee', 'Warme specerijen'],
    body: 4,
    bodyDescription: 'Zijdeachtig en fluweelzacht',
    acidity: 4,
    acidityDescription: 'Ragfijn, citrusachtig en floraal',
    sweetness: 5,
    sweetnessDescription: 'Gekarameliseerde rietsuikers en bloemennectar',
    brewingMethods: ['Espresso', 'Lungo', 'Syphon', 'Filter'],
    foodPairings: 'Fijne Franse patisserie, witte chocolade en amandel macarons.',
    traceabilityInfo: 'Micro-lots van wereldvermaarde telers (o.a. Wildan Mustofa van Frinsa Estate). Hoogte 1.700m - 2.100m. SCA 87 - 88.',
    sustainabilityInfo: 'Duurzame schaduwteelt en herbebossingsprojecten op West-Java.',
    additionalNotes: 'Een Grand Cru ervaring in het kopje. Drink bij voorkeur puur.',
    internalNotes: 'Zeer kostbare micro-lots. Beperkt volume per brandronde.',
    collection: 'Prestige',
    type: 'Daily',
    scaScore: '87 - 88',
    webshopProductId: 'prod-prestige-daily',
    aliases: ['prod-prestige-daily'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prestige-espresso',
    slug: 'prestige-espresso',
    productName: 'Milau Prestige Espresso',
    shortIntro: 'Intens aromatische prestige-espresso met cacao nibs, honing, pruim, rode druif, tropisch fruit en wijnachtige zoetheid.',
    coffeeStory: 'Een zintuiglijk spektakel. De Frinsa Natural (88 pnt) geeft body en exotische fruitigheid, Ethiopië Halo Natural (88 pnt) voegt rijpe mango en bloemenessences toe, terwijl Costa Rica Thermic Aerobic Catuai (88 pnt) zorgt voor een sappig, gestructureerd en wijnachtig zoet profiel.',
    origin: 'Indonesië, Ethiopië & Costa Rica',
    region: 'West-Java, Yirgacheffe (Halo) & Tarrazú',
    farmProducer: 'Frinsa Collective Natural, Halo Natural & Finca San Diego (Thermic)',
    varietal: '45% Indonesia Frinsa Natural (88 pnt), 30% Ethiopia Halo Natural (88 pnt), 25% Costa Rica Thermic Catuai (88 pnt)',
    processingMethod: 'Anaerobic Natural & Thermic Aerobic Fermentation',
    roastProfile: 'Specialty Artisanal Espresso Roast',
    flavourNotes: ['Cacao nibs', 'Honing', 'Pruim', 'Rode druif', 'Tropisch fruit', 'Wijnachtige zoetheid', 'Suikerriet'],
    body: 5,
    bodyDescription: 'Stroperig, likeurachtig en monumentaal',
    acidity: 3,
    acidityDescription: 'Sappige, complexe tropische fruitzuren',
    sweetness: 5,
    sweetnessDescription: 'Intense natuurlijke fruitsuikers en honing',
    brewingMethods: ['Specialty Espresso', 'Single Origin style shots', 'Moka Pot'],
    foodPairings: 'Pure chocolade 85%, vijgenbrood, blauwschimmelkazen en rijpe kersen.',
    traceabilityInfo: 'SCA 88 punten geverifieerd. Thermisch gecontroleerde vergisting en anaerobe tanks.',
    sustainabilityInfo: '100% Direct Trade partnerships met gerespecteerde pioniers.',
    additionalNotes: 'Een monumentale espresso voor connaisseurs. Laat de crema 1 minuut rusten voor optimale complexiteit.',
    internalNotes: 'Micro-lots met strenge allocatie per kwartaal. Geen compromissen.',
    collection: 'Prestige',
    type: 'Espresso',
    scaScore: '88',
    webshopProductId: 'prod-prestige-espresso',
    aliases: ['prod-prestige-espresso'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prestige-filter',
    slug: 'prestige-filter',
    productName: 'Milau Prestige Filter',
    shortIntro: 'Light Nordic filter roast met jasmijn, zwarte thee, sinaasappel, mandarijn, watermeloen en Gesha-karakter.',
    coffeeStory: 'Het ultieme filterkoffie-meesterwerk van Maison Milau. Een buitengewone assemblage van Ethiopië Chelbesa Washed (88,5 pnt), Kenia AA Inoi Kerugoya (89 pnt) en zeldzame Ethiopië Gesha Bench Maji (88 pnt). De kop explodeert van florale jasmijn en bergamot.',
    origin: 'Ethiopië & Kenia',
    region: 'Yirgacheffe (Chelbesa), Kirinyaga & Bench Maji',
    farmProducer: 'Chelbesa Washing Station, Inoi Farmers Coop & Bench Maji Gesha Forest',
    varietal: '40% Ethiopia Chelbesa Washed (88,5 pnt), 35% Kenya AA Inoi (89 pnt), 25% Ethiopia Gesha Bench Maji (88 pnt)',
    processingMethod: 'Fully Washed Grade 1',
    roastProfile: 'Light Nordic Filter Roast met maximale Gesha-expressie',
    flavourNotes: ['Jasmijn', 'Zwarte thee', 'Sinaasappel', 'Mandarijn', 'Watermeloen', 'Bloemen', 'Zwarte bes'],
    body: 3,
    bodyDescription: 'Theekopperig, ragfijn en vederlicht',
    acidity: 4,
    acidityDescription: 'Nobel, helder en sprankelend',
    sweetness: 5,
    sweetnessDescription: 'Witte bloesemhoning en suikerspin',
    brewingMethods: ['V60 Hand Drip', 'Chemex', 'Origami Dripper', 'Cold Drip'],
    foodPairings: 'Puur drinken; combineert magisch met verse frambozen en delicate amandel-tuiles.',
    traceabilityInfo: 'SCA 88,5 - 89 punten. Geteeld op 1.950m - 2.200m hoogte in ongerepte nevelwouden.',
    sustainabilityInfo: 'Biologische bostuinbouw; bescherming van inheemse Gesha-moederbomen.',
    additionalNotes: 'Laat de koffie afkoelen tot circa 55°C voor de meest adembenemende jasmijnbloesem-aroma’s.',
    internalNotes: 'Onze hoogst scorende filterblend. Gereserveerd voor koffiewedstrijden en masterclasses.',
    collection: 'Prestige',
    type: 'Filter',
    scaScore: '88 - 89',
    webshopProductId: 'prod-prestige-filter',
    aliases: ['prod-prestige-filter'],
    updatedAt: new Date().toISOString(),
  },

  // --- SINGLE ORIGINS ---
  {
    id: 'so-pink-bourbon',
    slug: 'colombia-ambrosia-pink-bourbon',
    productName: 'Milau Single Origin: Colombia Ambrosia Pink Bourbon',
    shortIntro: 'Zeldzame Pink Bourbon micro-lot van Finca El Caney met amandel, cranberry, citroen, sinaasappel en vanille.',
    coffeeStory: 'Een sensationele ontdekking in de specialty koffiewereld. Pink Bourbon is een natuurlijke kruising met zeldzame roze bessen die uitzonderlijk veel natuurlijke suikers produceren. Deze gewassen micro-lot uit Huila biedt een hypnotiserende balans tussen heldere citrus, cranberry en zoet suikerriet.',
    origin: 'Colombia',
    region: 'Huila (San Adolfo / Pitalito)',
    farmProducer: 'Finca El Caney (Familie Gomez) - Micro-lot',
    varietal: '100% Pink Bourbon (Zeldzame botanische variëteit)',
    processingMethod: 'Washed (Slow Sun-Dried on Raised African Beds)',
    roastProfile: 'Light-Medium Micro-Lot Roast',
    flavourNotes: ['Amandel', 'Bruine suiker', 'Cranberry', 'Citroen', 'Sinaasappel', 'Suikerriet', 'Vanille'],
    body: 3,
    bodyDescription: 'Zacht, sappig en verfijnd',
    acidity: 4,
    acidityDescription: 'Levendige citrus- en bessenrinsheid',
    sweetness: 5,
    sweetnessDescription: 'Intens zoet suikerriet en vanille',
    brewingMethods: ['Filter', 'Aeropress', 'Specialty Espresso', 'V60'],
    foodPairings: 'Rood fruit taart, panna cotta met bessencompote en fijne amandelgebakjes.',
    traceabilityInfo: 'Geteeld op 1.820m hoogte in het Huila microklimaat. Directe import via Origin Bridge. SCA score: 87 punten.',
    sustainabilityInfo: '100% Direct Trade micro-lot partnership. Eerlijke boerencompensatie 100% boven de beurs.',
    additionalNotes: 'Een absolute favoriet van barista’s en koffiekenners wereldwijd.',
    internalNotes: 'Gecontracteerd exclusief perceel op Finca El Caney. Alias: pink-bourbon.',
    collection: 'Single Origins',
    type: 'Specialty',
    scaScore: '87',
    webshopProductId: 'prod-so-pink-bourbon',
    aliases: ['pink-bourbon', 'prod-so-pink-bourbon'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'so-gesha-bench-maji',
    slug: 'ethiopia-gesha-bench-maji',
    productName: 'Milau Single Origin: Ethiopia Gesha Bench Maji',
    shortIntro: 'Exclusieve Gesha met opmerkelijke helderheid, zwarte thee, sinaasappel, mandarijn en watermeloen.',
    coffeeStory: 'Gesha is zonder twijfel de meest gevierde variëteit op aarde. Afkomstig uit de ongerepte bergbossen van Bench Maji in Ethiopië, de bakermat van arabica. Deze koffie biedt een vloeibaar bouquet van jasmijnbloesem, bergamot en sappige watermeloen. Een unieke smaakervaring.',
    origin: 'Ethiopië',
    region: 'Bench Maji (Gesha Forest)',
    farmProducer: 'Bench Maji Farmers Cooperative Union - Grade 1',
    varietal: '100% Gesha Heirloom (Wild Forest Selection)',
    processingMethod: 'Washed Grade 1 (Washed Heirloom)',
    roastProfile: 'Light Roast voor maximale florale expressie',
    flavourNotes: ['Zwarte thee', 'Sinaasappel', 'Mandarijn', 'Watermeloen', 'Jasmijn'],
    body: 2,
    bodyDescription: 'Theekopperig, kristalhelder en delicaat',
    acidity: 4,
    acidityDescription: 'Ragfijn, nobel en sprankelend',
    sweetness: 5,
    sweetnessDescription: 'Pure bloemenhoning en suikerspin',
    brewingMethods: ['V60', 'Chemex', 'Cold Drip', 'Origami'],
    foodPairings: 'Puur genieten in een breed wijnglas of cuppingtas. Geen melk of suiker toevoegen.',
    traceabilityInfo: 'Geteeld op 1.900m - 2.100m hoogte onder wild bladerdak in Bench Maji. SCA score: 88 punten.',
    sustainabilityInfo: 'Behoud van het oerbos; biologische inheemse boslandbouw zonder enige ontbossing.',
    additionalNotes: 'Laat de koffie ademen; de florale bergamot-tonen worden steeds intenser naarmate hij rust.',
    internalNotes: 'Exclusief geleverd door ETOP. Kostbaarste boon in de branderij. Alias: gesha.',
    collection: 'Single Origins',
    type: 'Specialty',
    scaScore: '88',
    webshopProductId: 'prod-so-gesha',
    aliases: ['gesha', 'prod-so-gesha'],
    updatedAt: new Date().toISOString(),
  },

  // --- BARREL AGED COFFEES ---
  {
    id: 'barrel-moscatel',
    slug: 'casknolia-moscatel-barrel',
    productName: 'CASKNOLIA® Moscatel Barrels',
    shortIntro: 'Specialty arabica gerijpt in Amerikaanse eikenvaten gekruid met Spaanse Moscatel dessertwijn.',
    coffeeStory: 'Een sensationele combinatie van specialty coffee en eeuwenoude Spaanse kuiperijtraditie. Groene bonen rusten in originele vaten van Tonelería del Sur, waar ze de nobele aroma’s van Moscatel dessertwijn absorberen. Volledig alcoholvrij, maar met een weelderige wijnachtige complexiteit.',
    origin: 'Honduras & Spanje (Montilla-Moriles)',
    region: 'La Joya & Andalusië',
    farmProducer: 'Finca La Joya & Tonelería del Sur (Casknolia)',
    varietal: 'Honduras La Joya 120-hour Natural, Catuai/Bourbon (86,75 pnt)',
    processingMethod: '120h Anaerobic Natural & 12 maanden vatrijping in American Oak seasoned met Moscatel',
    roastProfile: 'Custom specialty roast na eikenvaten-rijping',
    flavourNotes: ['Rijpe druif', 'Oranjebloesem', 'Honing', 'Gedroogd fruit', 'Vanille', 'Karamel', 'Toast', 'Zachte eikenkruiden'],
    body: 4,
    bodyDescription: 'Zijdezacht, likeurachtig en rond',
    acidity: 3,
    acidityDescription: 'Elegante wijnachtige fruitzuren',
    sweetness: 5,
    sweetnessDescription: 'Weelderige dessertwijnzoetheid',
    brewingMethods: ['Filter', 'Aeropress', 'Slow Drip', 'Degustatie Espresso'],
    foodPairings: 'Citroentaart, abrikozentaart, amandelgebak en fijne kazen.',
    traceabilityInfo: 'Casknolia gecertificeerde vaten met batchregistratie. SCA score 86,75 vóór aging.',
    sustainabilityInfo: 'Duurzame vatencirculatie gecombineerd met Direct Trade koffie.',
    additionalNotes: 'Serveer in een tulpglas om het complexe aroma optimaal te vangen.',
    internalNotes: 'Beperkte seizoensoplage van 4 vaten per jaar.',
    collection: 'Barrel Aged',
    type: 'Specialty',
    scaScore: '86,75 (vóór aging)',
    webshopProductId: 'prod-barrel-moscatel',
    aliases: ['prod-barrel-moscatel'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'barrel-pedro-ximenez',
    slug: 'casknolia-pedro-ximenez-cask',
    productName: 'CASKNOLIA® Pedro Ximénez Sherry Cask',
    shortIntro: 'Intens rijk en gelaagd met diepe zoete tonen van PX sherry, rozijnen, vijgen, dadels en zachte melasse.',
    coffeeStory: 'Voor liefhebbers van ultieme diepte en zoetheid. Groene bonen uit Honduras rijpen in vaten die voorheen de befaamde Pedro Ximénez sherry bevatten. Het resultaat is een kopje dat doet denken aan een vloeibare chocoladetruffel verrijkt met vijgen en rozijnen.',
    origin: 'Honduras & Spanje (Jerez/Montilla)',
    region: 'Montecillos & Andalusië',
    farmProducer: 'Honduras Montecillos & Casknolia Cooperage',
    varietal: 'Honduras Montecillos Natural Arabica',
    processingMethod: 'Natural & PX Sherry Cask Conditioning (American Oak)',
    roastProfile: 'Specialty barrel roast',
    flavourNotes: ['Rozijn', 'Vijg', 'Dadel', 'Donkere chocolade', 'Donkere karamel', 'Melasse', 'Geroosterde eik', 'Warme zoetheid'],
    body: 5,
    bodyDescription: 'Zwaar, stroperig en dicht',
    acidity: 2,
    acidityDescription: 'Zachte, fluwelige zuurgraad',
    sweetness: 5,
    sweetnessDescription: 'Intense rozijnen- en vijgenzoetheid',
    brewingMethods: ['Espresso', 'French Press', 'Filter', 'Affogato'],
    foodPairings: 'Affogato met vanille-ijs, pure chocoladetruffels en gekonfijte vruchten.',
    traceabilityInfo: 'Originele vaten met authenticiteitscertificaat van Tonelería del Sur. SCA 84 vóór aging.',
    sustainabilityInfo: '100% natuurlijk procedé zonder toevoeging van vloeistoffen of aroma’s.',
    additionalNotes: 'Hemels als afsluiter van een gastronomisch diner.',
    internalNotes: 'Seizoensgebonden micro-batch.',
    collection: 'Barrel Aged',
    type: 'Specialty',
    scaScore: '84 (vóór aging)',
    webshopProductId: 'prod-barrel-px',
    aliases: ['prod-barrel-px'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'barrel-buffalo-trace',
    slug: 'buffalo-trace-bourbon-barrel',
    productName: 'Buffalo Trace® Bourbon Barrel',
    shortIntro: 'Subtiele bourbonwarmte met royale toffee, vanille, melasse en eikenhoutaccenten.',
    coffeeStory: 'Groene Braziliaanse specialty bonen rusten in originele Kentucky bourbonvaten van de legendarische Buffalo Trace distilleerderij. De langzame absorptie van het getoaste hout geeft tonen van vanille, karamel en toffee. 100% alcoholvrij.',
    origin: 'Brazilië & Verenigde Staten',
    region: 'Canastra Valley & Frankfort, Kentucky',
    farmProducer: 'Canastra Sweet Catuai & Buffalo Trace Distillery Barrels',
    varietal: '100% Brazil Canastra Sweet Catuai',
    processingMethod: 'Pulped Natural & Bourbon Barrel Aging (6 weken gerijpt)',
    roastProfile: 'Specialty bourbon barrel roast',
    flavourNotes: ['Vanille', 'Melasse', 'Bruine suiker', 'Toffee', 'Donkere vruchten', 'Anijs', 'Specerijen', 'Eik'],
    body: 5,
    bodyDescription: 'Rijk, stroperig en mondvullend',
    acidity: 2,
    acidityDescription: 'Zeer laag en zacht',
    sweetness: 4,
    sweetnessDescription: 'Rijke toffee en bourbon-vanille',
    brewingMethods: ['Espresso', 'Moka', 'Filter'],
    foodPairings: 'Pure chocolade 80%+, appeltaart en pecannotentaart.',
    traceabilityInfo: 'Herkomst bonen Canastra (1.200m). Vaten gecontroleerd op houtkwaliteit.',
    sustainabilityInfo: 'Volledig herbruikbare eikenhouten vatenketen.',
    additionalNotes: 'Een favoriet geschenk voor fijnproevers en whiskyliefhebbers.',
    internalNotes: 'Exclusieve samenwerking met geselecteerde importeurs.',
    collection: 'Barrel Aged',
    type: 'Specialty',
    scaScore: '84,25 (vóór aging)',
    webshopProductId: 'prod-barrel-bourbon',
    aliases: ['prod-barrel-bourbon'],
    updatedAt: new Date().toISOString(),
  },

  // --- NATURALLY INFUSED COFFEES ---
  {
    id: 'infused-vanilla',
    slug: 'milau-vanilla',
    productName: 'Milau Naturally Infused Vanilla',
    shortIntro: 'Zachte tonen van Bourbon-vanillestokjes, room, melkchocolade en karamel zonder enige artificiële bijsmaak.',
    coffeeStory: 'Puur natuurlijke verrijking. Wij selecteren hoogwaardige zoete Braziliaanse Arabica en combineren deze met natuurlijke Bourbon vanillepeulen uit Madagaskar. Geen chemische aroma-oliën of suikers, maar zuivere botanische harmonie.',
    origin: 'Brazilië & Madagaskar',
    region: 'Canastra & Sava Region',
    farmProducer: 'Canastra Sweet Catuai Producers & Madagaskar Vanilla Farmers',
    varietal: '100% Brazil Canastra Sweet Catuai verrijkt met natuurlijke vanille-infusie',
    processingMethod: 'Pulped Natural & Gecontroleerde natuurlijke passieve infusie',
    roastProfile: 'Medium roast met gecontroleerde natuurlijke passieve infusie',
    flavourNotes: ['Natuurlijke Madagascar-vanille', 'Melkchocolade', 'Karamel', 'Bruine suiker', 'Geroosterde amandel'],
    body: 4,
    bodyDescription: 'Fluweelzacht en romig',
    acidity: 1,
    acidityDescription: 'Zeer mild en rond',
    sweetness: 4,
    sweetnessDescription: 'Zachte, romige vanillezoetheid',
    brewingMethods: ['Volautomaat', 'Cappuccino', 'Filter'],
    foodPairings: 'Flat white met havermelk, vanille-ijs en zandkoekjes.',
    traceabilityInfo: 'SCA 84,25 vóór infusie. Zuivere biologische vanillepeulen.',
    sustainabilityInfo: 'Eerlijke beloning voor kleinschalige vanilleboeren in Madagaskar.',
    additionalNotes: 'Vult de kamer met een verrukkelijk natuurlijk aroma tijdens het malen en zetten.',
    internalNotes: 'Enorm populair onder particuliere cappuccino-drinkers.',
    collection: 'Infused',
    type: 'Specialty',
    scaScore: '84,25 (vóór infusie)',
    webshopProductId: 'prod-infused-vanilla',
    aliases: ['prod-infused-vanilla'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'infused-cinnamon',
    slug: 'milau-cinnamon',
    productName: 'Milau Naturally Infused Cinnamon',
    shortIntro: 'Warme toetsen van Ceylon kaneel, bruine suiker, bakkerschocolade en koekjeskruiden in perfecte balans.',
    coffeeStory: 'Geïnspireerd op versgebakken kaneelbroodjes en koude herfstdagen. Verrijkt met edele Ceylon kaneel (de koningin van de specerijen) die zachter en zoeter is dan gewone cassia-kaneel, gecombineerd met Colombiaanse en Braziliaanse specialty arabica.',
    origin: 'Brazilië & Colombia',
    region: 'Canastra & La Union',
    farmProducer: 'Canastra Sweet Catuai & Colombia La Union Washed Castillo',
    varietal: '70% Brazil Canastra Sweet Catuai en 30% Colombia La Union Washed Castillo',
    processingMethod: 'Medium roast met natuurlijke Ceylon kaneel-conditionering',
    roastProfile: 'Medium roast',
    flavourNotes: ['Kaneel', 'Bruine suiker', 'Bakkerschocolade', 'Amandel', 'Karamel', 'Vanille'],
    body: 4,
    bodyDescription: 'Verwarmend en vol',
    acidity: 2,
    acidityDescription: 'Zacht en uitgebalanceerd',
    sweetness: 4,
    sweetnessDescription: 'Specerij- en rietsuikerzoetheid',
    brewingMethods: ['Filter', 'Lungo', 'Latte Macchiato'],
    foodPairings: 'Kaneelbroodjes, speculoos en warme appeltaart.',
    traceabilityInfo: '100% natuurlijke botanische bestanddelen. SCA circa 84,3.',
    sustainabilityInfo: 'Verantwoorde inkoop van specerijen via fair-trade netwerken.',
    additionalNotes: 'Uitstekend met warme havermelk voor een luxueuze winterse latte.',
    internalNotes: 'Seizoensgebonden topper in het najaar en de wintermaanden.',
    collection: 'Infused',
    type: 'Specialty',
    scaScore: 'circa 84,3 (indicatie)',
    webshopProductId: 'prod-infused-cinnamon',
    aliases: ['prod-infused-cinnamon'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'infused-almond',
    slug: 'milau-almond',
    productName: 'Milau Naturally Infused Almond',
    shortIntro: 'Verfijnde aroma’s van amandel, marsepein en chocoladepraliné met een fluweelzachte body.',
    coffeeStory: 'Een klassieke combinatie die doet denken aan Italiaanse banketbakkerijen. De natuurlijke nootachtige eigenschappen van Braziliaanse Arabica worden zacht verrijkt met tonen van geroosterde amandelen en marsepein.',
    origin: 'Brazilië',
    region: 'Itaguaçu & Canastra',
    farmProducer: 'Fazenda Itaguaçu & Canastra Sweet Catuai',
    varietal: '70% Brazil Itaguaçu Blend en 30% Brazil Canastra Sweet Catuai',
    processingMethod: 'Medium roast met natuurlijke botanische amandelinfusie',
    roastProfile: 'Medium roast',
    flavourNotes: ['Amandel', 'Hazelnoot', 'Walnoot', 'Geroosterde amandel', 'Melkchocolade', 'Bruine suiker'],
    body: 4,
    bodyDescription: 'Rond, fluweelzacht en romig',
    acidity: 2,
    acidityDescription: 'Laag en zacht',
    sweetness: 4,
    sweetnessDescription: 'Natuurlijke amandel- en pralinézoetheid',
    brewingMethods: ['Espresso', 'Filter', 'Volautomaat'],
    foodPairings: 'Cantuccini, marsepein, donkere chocolade en amandelcake.',
    traceabilityInfo: 'Natuurlijke botanische infusie zonder kunstmatige smaakstoffen. SCA circa 82,7.',
    sustainabilityInfo: '100% recycleerbare verpakking en milieuvriendelijke productie.',
    additionalNotes: 'Biedt een subtiele dessertbeleving zonder toegevoegde suikers of calorieën.',
    internalNotes: 'Vaste favoriet bij horecaklanten voor de namiddagkoffie.',
    collection: 'Infused',
    type: 'Specialty',
    scaScore: 'circa 82,7 (indicatie)',
    webshopProductId: 'prod-infused-almond',
    aliases: ['prod-infused-almond'],
    updatedAt: new Date().toISOString(),
  },
];

class DossierStore {
  private inMemoryDossiers: Map<string, CoffeeDossier> = new Map();
  private aliasMap: Map<string, string> = new Map();
  private isInitialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.isInitialized) return;

    if (isVercelRuntime) {
      this.loadIntoMemory(INITIAL_DOSSIERS);
      this.isInitialized = true;
      return;
    }

    try {
      if (!fs.existsSync(path.dirname(DOSSIERS_FILE_PATH))) {
        fs.mkdirSync(path.dirname(DOSSIERS_FILE_PATH), { recursive: true });
      }

      if (fs.existsSync(DOSSIERS_FILE_PATH)) {
        const raw = fs.readFileSync(DOSSIERS_FILE_PATH, 'utf-8');
        const parsed: CoffeeDossier[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.loadIntoMemory(parsed);
          this.isInitialized = true;
          return;
        }
      }
    } catch (err) {
      console.warn('[DossierStore] Error reading file, initializing with seeds:', err);
    }

    // Seed defaults
    this.loadIntoMemory(INITIAL_DOSSIERS);
    this.persistToFile();
    this.isInitialized = true;
  }

  private loadIntoMemory(items: CoffeeDossier[]) {
    this.inMemoryDossiers.clear();
    this.aliasMap.clear();

    for (const item of items) {
      this.inMemoryDossiers.set(item.id, item);

      // Index aliases and slugs
      if (item.slug) {
        this.aliasMap.set(item.slug.toLowerCase(), item.id);
      }
      if (item.webshopProductId) {
        this.aliasMap.set(item.webshopProductId.toLowerCase(), item.id);
      }
      if (Array.isArray(item.aliases)) {
        for (const alias of item.aliases) {
          this.aliasMap.set(alias.toLowerCase(), item.id);
        }
      }
    }
  }

  private persistToFile() {
    if (isVercelRuntime) return;
    try {
      const items = Array.from(this.inMemoryDossiers.values());
      const tempPath = `${DOSSIERS_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(items, null, 2), 'utf-8');
      fs.renameSync(tempPath, DOSSIERS_FILE_PATH);
    } catch (err) {
      console.warn('[DossierStore] Failed to persist coffee dossiers (suppressed):', err);
    }
  }

  public getAll(): CoffeeDossier[] {
    this.ensureInitialized();
    return Array.from(this.inMemoryDossiers.values());
  }

  public getById(idOrSlug: string): CoffeeDossier | undefined {
    this.ensureInitialized();
    if (!idOrSlug) return undefined;

    const normalized = idOrSlug.trim().toLowerCase();

    // Direct match
    if (this.inMemoryDossiers.has(normalized)) {
      return this.inMemoryDossiers.get(normalized);
    }

    // Direct id match case-sensitive
    for (const [key, dossier] of this.inMemoryDossiers.entries()) {
      if (key.toLowerCase() === normalized || dossier.id.toLowerCase() === normalized) {
        return dossier;
      }
    }

    // Alias / slug match
    if (this.aliasMap.has(normalized)) {
      const targetId = this.aliasMap.get(normalized)!;
      return this.inMemoryDossiers.get(targetId);
    }

    // Fuzzy clean match (e.g. stripping 'prod-' or '-espresso')
    const stripped = normalized.replace(/^prod-/, '');
    if (this.inMemoryDossiers.has(stripped)) {
      return this.inMemoryDossiers.get(stripped);
    }
    if (this.aliasMap.has(stripped)) {
      const targetId = this.aliasMap.get(stripped)!;
      return this.inMemoryDossiers.get(targetId);
    }

    return undefined;
  }

  public save(dossier: CoffeeDossier): CoffeeDossier {
    this.ensureInitialized();
    if (!dossier.id) {
      dossier.id = dossier.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `coffee-${Date.now()}`;
    }

    const updated: CoffeeDossier = {
      ...dossier,
      updatedAt: new Date().toISOString(),
    };

    this.inMemoryDossiers.set(updated.id, updated);

    // Update alias map
    if (updated.slug) this.aliasMap.set(updated.slug.toLowerCase(), updated.id);
    if (updated.webshopProductId) this.aliasMap.set(updated.webshopProductId.toLowerCase(), updated.id);
    if (Array.isArray(updated.aliases)) {
      for (const a of updated.aliases) {
        this.aliasMap.set(a.toLowerCase(), updated.id);
      }
    }

    this.persistToFile();
    return updated;
  }

  public delete(id: string): boolean {
    this.ensureInitialized();
    const existing = this.getById(id);
    if (!existing) return false;

    const result = this.inMemoryDossiers.delete(existing.id);
    this.persistToFile();
    return result;
  }
}

export const dossierStore = new DossierStore();
