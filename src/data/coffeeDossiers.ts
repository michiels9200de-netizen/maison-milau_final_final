export interface CoffeeDossierData {
  id: string;
  discoveryTag: string;
  secondaryTag?: string;
  story: string;
  originStory: string;
  varietyInfo: string;
  whySelected: string;
  idealCustomer: string[];
  lessSuitableFor: string[];
  brewingAdvice: {
    recommendedMethod: string;
    grind: string;
    ratio: string;
    temperature: string;
    bloomTime: string;
    tips: string;
  };
  signatureCharacteristics: string[];
  specialStory?: {
    title: string;
    badge: string;
    paragraphs: string[];
    calloutQuote?: string;
    sections?: { heading: string; body: string }[];
  };
}

export const COFFEE_DOSSIERS: Record<string, CoffeeDossierData> = {
  // BARREL AGED
  'barrel-buffalo-trace': {
    id: 'barrel-buffalo-trace',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Collector\'s Pick',
    story:
      'Deze koffie is ontworpen voor liefhebbers van diepgang, ambacht en complexiteit. Groene specialty bonen rusten gedurende weken in originele Buffalo Trace® Kentucky bourbonvaten uit Frankfurt, Kentucky. Tijdens deze trage rijpingsperiode absorberen de bonen de vluchtige aromatische verbindingen die diep in de getoaste eiken duigen liggen opgeslagen: vanille, gekarameliseerde rietsuikers, warme specerijen en getoast eikenhout. U proeft geen alcohol of industriële bourbon. U proeft de verfijnde herinnering van bourbon.',
    originStory:
      'Als basis gebruiken we een 100% Colombiaanse Supremo van Finca La Esperanza in Huila. Geteeld op 1.750 meter hoogte op vulkanische bodems. De boon bezit een uitzonderlijke dichtheid en cellulaire structuur die noodzakelijk is om de houtaroma\'s harmonieus op te nemen zonder zijn eigen arabica-karakter te verliezen.',
    varietyInfo:
      '100% Arabica (Castillo & Caturra). Deze variëteiten staan bekend om hun heldere zuurgraad en volle body, wat de perfecte robuuste drager vormt voor het zware karakter van het eikenvat.',
    whySelected:
      'Maison Milau selecteerde originele vaten van de historische Buffalo Trace Distillery vanwege hun ongeëvenaarde rijkdom aan aromatische lactonen en vanilline. Het resultaat is een aromatische masterclass.',
    idealCustomer: [
      'Liefhebbers van single malt whisky, bourbon en vatgerijpte distillaten',
      'Espresso-drinkers die een ongekende aromatische diepte zoeken',
      'Genietkoffie voor na een gastronomisch diner',
      'Zoekers naar een zeldzame, exclusieve degustatie-ervaring',
    ],
    lessSuitableFor: [
      'Liefhebbers van ultralichte, florale Nordic filterkoffies',
      'Mensen die uitsluitend traditionele, neutrale supermarktkoffie verwachten',
    ],
    brewingAdvice: {
      recommendedMethod: 'Specialty Espresso of French Press',
      grind: 'Fijn voor espresso, grof voor cafetière',
      ratio: '1:2 (18.5g in, 37g uit) voor espresso; 1:15 voor French Press',
      temperature: '93°C',
      bloomTime: '30 seconden pre-infusie',
      tips: 'Laat het kopje na bereiding 2 minuten rusten. Naarmate de koffie zakt naar 60°C komen de diepe tonen van verkoolde eik, Bourbon-vanille en melasse spectaculair tot bloei.',
    },
    signatureCharacteristics: [
      'Gecureerd op authentieke Buffalo Trace® bourbonvaten',
      'Geen druppel alcohol of kunstmatige aroma\'s toegevoegd',
      'Warm mondgevoel met bourbon-vanille, melasse en getoast eikenhout',
      'Lange, stroperige afdronk die blijft nazinderen',
    ],
    specialStory: {
      title: 'Het Geheim van Buffalo Trace® Vatlagering',
      badge: 'Vatgerijpte Meesterklasse',
      calloutQuote: 'You do not taste bourbon itself. You taste the memory of bourbon.',
      paragraphs: [
        'Green coffee beans rusten in pure rust binnenin authentieke eikenhouten vaten van de legendarische Buffalo Trace Distillery. De poriën van de ongebrande boon ademen het microklimaat van het vat in.',
        'Er wordt geen druppel alcohol toegevoegd en geen smaaksiroop gebruikt. Het proces is 100% natuurlijk en fysisch: de etherische oliën en vanilline uit het hout migreren langzaam in de celmatrix van de koffieboon.',
        'Wanneer wij deze bonen vervolgens ambachtelijk roosteren in onze trommelbrander te Oudegem, karamelliseren de opgenomen eikensuikers tot een onnavolgbaar aroma dat u in geen enkele standaard koffie kunt vinden.',
      ],
      sections: [
        {
          heading: 'Hoe Vatlagering Werkt',
          body: 'Groene koffie bezit een hygroscopische structuur. Gedurende 6 tot 8 weken worden de vaten dagelijks manueel geroteerd zodat elke boon gelijkmatig in contact komt met het eikenhout.',
        },
        {
          heading: 'Aroma Zonder Alcohol',
          body: 'Omdat het vat vóór vulling volledig leeggelopen is en het brandproces plaatsvindt bij meer dan 200°C, is de koffie 100% alcoholvrij maar behoudt hij het nobele bouquet van het vat.',
        },
      ],
    },
  },

  'barrel-moscatel': {
    id: 'barrel-moscatel',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Most Unique',
    story:
      'Maanden van rijping in authentieke Spaanse Casknolia® Moscatel eikenvaten creëren een koffie die rijpe witte druiven, oranjebloesem, acaciahoning en gekonfijt gedroogd fruit oproept, terwijl hij onmiskenbaar koffie blijft. Het resultaat voelt dichter bij een verfijnde zoete dessertwijn dan bij traditionele koffie.',
    originStory:
      'Geproduceerd op de steile hellingen van Nariño, Colombia. De combinatie van hoge zonneschijn overdag en koele nachten in de Andes zorgt voor een boon met een uitzonderlijk hoge concentratie natuurlijke suikers, wat perfect harmonieert met de zoete muskaataroma\'s van het vat.',
    varietyInfo:
      '100% Colombia Caturra. Een variëteit die beroemd is om zijn gebalanceerde citroenachtige frisheid en zachte zoetheid, waardoor het florale wijnkarakter niet wordt overstemd.',
    whySelected:
      'Maison Milau zocht een vatlagering die niet zwaar of rokerig is, maar juist helder, aromatisch en floraal. De Casknolia Moscatel vaten uit Montilla-Moriles leveren precies die zeldzame gastronomische elegantie.',
    idealCustomer: [
      'Liefhebbers van dessertwijnen zoals Moscatel, Sauternes of Tokaji',
      'Filterkoffie- en pour-over puristen die ongekende complexiteit zoeken',
      'Nieuwsgierige fijnproevers die het spectrum van koffie willen herdefiniëren',
    ],
    lessSuitableFor: [
      'Wie uitsluitend bittere, donkere traditionele espresso verlangt',
      'Mensen die geen fruitige of wijnachtige nuances in koffie waarderen',
    ],
    brewingAdvice: {
      recommendedMethod: 'V60 Pour-Over, Chemex of AeroPress',
      grind: 'Medium (grof tafelzout)',
      ratio: '1:16 (15g koffie op 240g water)',
      temperature: '92°C',
      bloomTime: '45 seconden met 45g water',
      tips: 'Serveer in een wijnglas of open cupping-kopje. De aromatische florale dampen van oranjebloesem en muskaatdruif vullen onmiddellijk de ruimte.',
    },
    signatureCharacteristics: [
      'Gerijpt op Casknolia® Moscatel eikenvaten uit Spanje',
      'Tonen van gekonfijte witte druif, muskaatbloesem en vloeibare honing',
      'Zijdezachte, wijnachtige aciditeit met een lange zoete finale',
      'Perfect gastronomisch alternatief voor een dessertwijn',
    ],
    specialStory: {
      title: 'De Symfonie van Moscatel & Specialty Koffie',
      badge: 'Gastronomisch Meesterwerk',
      calloutQuote:
        'The result feels closer to a fine dessert wine than to traditional coffee.',
      paragraphs: [
        'Moscatel is een van de oudste en meest aromatische druivenrassen ter wereld. De vaten waarin deze zoete wijn jarenlang rijpte, zijn doordrongen van esters die doen denken aan gekonfijte citrus, witte bloemen en honing.',
        'Door onze Colombiaanse specialty bonen in deze vaten te laten rusten, ontstaat een symbiose die uniek is in Europa. Geen extracten, geen toevoegingen: pure interactie tussen hout, druif en koffieboon.',
      ],
    },
  },

  'barrel-pedro-ximenez': {
    id: 'barrel-pedro-ximenez',
    discoveryTag: 'Barrel Aged Exclusive',
    secondaryTag: 'Luxury Experience',
    story:
      'Voor wie houdt van gelaagde zoetheid, dichte stroperigheid en diepe complexiteit. Het authentieke Pedro Ximénez sherryvat introduceert weelderige tonen van zongedroogde vijgen, Medjool-dadels, rozijnen, donkere karamel en getoast eikenhout. Een koffie die doet denken aan een vloeibare chocoladetruffel met gerijpte sherry.',
    originStory:
      'Afkomstig uit Antioquia, Colombia. De koffie groeit op 1.800 meter hoogte en wordt na selectieve handpluk gewassen verwerkt. De bonen ondergaan een langere rustperiode om de dichte Pedro Ximénez houtmelasse optimaal te laten bezinken.',
    varietyInfo:
      '100% Colombia & Castillo Arabica. Zorgt voor een volle, romige body die overeind blijft naast de intense donkere fruittonen van het sherryvat.',
    whySelected:
      'Pedro Ximénez is de koning der zoete sherry\'s. Het vat geeft een bijna fluweelachtige, likeurachtige densiteit mee aan de koffie zonder enige alcoholische scherpte.',
    idealCustomer: [
      'Liefhebbers van PX Sherry, Portwijn en donkere chocolade truffels',
      'Mensen die houden van extreem zoete, rijke en mondvullende smaken',
      'Espresso drinkers die een fluweelzachte, zoete crema wensen',
    ],
    lessSuitableFor: [
      'Liefhebbers van lichte, zure, theekopperige filterkoffies',
    ],
    brewingAdvice: {
      recommendedMethod: 'Rijke Espresso, Moka Pot of French Press',
      grind: 'Fijn voor espresso, medium-grof voor cafetière',
      ratio: '1:2 voor espresso (19g in, 38g uit in 28 seconden)',
      temperature: '93°C',
      bloomTime: '25 seconden',
      tips: 'Fantastisch in combinatie met pure chocolade (70%+) of als basis voor een decadente affogato met vanille-ijs.',
    },
    signatureCharacteristics: [
      'Gerijpt op Casknolia® Pedro Ximénez sherryvaten',
      'Smaaksensatie van gedroogde vijgen, rozijnen, toffee en eikenhout',
      'Uitzonderlijk romig en stroperig mondgevoel',
      'Geen alcohol, maar een pure dessert-ervaring in het kopje',
    ],
    specialStory: {
      title: 'Het Wonder van Pedro Ximénez Eiken',
      badge: 'Sherry Cask Maturation',
      calloutQuote:
        'For those who enjoy layered sweetness and complexity: figs, dates, dark caramel and warm oak.',
      paragraphs: [
        'Pedro Ximénez druiven worden na de oogst in de Zuid-Spaanse zon op strooien matten gedroogd tot rozijnen voordat ze worden geperst. De vaten waarin deze geconcentreerde nectar rijpte, behouden decennia aan aroma\'s.',
        'Wanneer Maison Milau ongebrande bonen toevertrouwt aan deze vaten, absorberen de bonen de natuurlijke rozijnen- en karamelcomplexiteit die tijdens het branden explodeert in een zoete, diepe praline-ervaring.',
      ],
    },
  },

  // INFUSED COLLECTION
  'infused-vanilla': {
    id: 'infused-vanilla',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Beginner Friendly',
    story:
      'Een fluweelzachte Braziliaanse specialty koffie, verrijkt met elegante natuurlijke tonen van Bourbon vanille uit Madagaskar. Gecreëerd om een luxueus, troostend en zijdezacht kopje te bieden waarbij de nobele arabica-koffie de onbetwiste hoofdrol behoudt.',
    originStory:
      'De basis is een 100% Arabica Cerrado Mineiro uit Brazilië. Geteeld op 1.100 meter hoogte, bekend om zijn natuurlijke zoetheid, ronde melkchocolade en lage aciditeit.',
    varietyInfo:
      'Yellow Bourbon & Mondo Novo. Deze variëteiten staan wereldwijd bekend om hun van nature romige mondgevoel en hazelnoottonen, wat de vanille-infusie naadloos laat samensmelten.',
    whySelected:
      'Vele commerciële "gearomatiseerde koffies" gebruiken goedkope robusta en chemische siropen. Maison Milau wilde het tegendeel bewijzen: topkwaliteit specialty coffee veredeld met pure botanische vanille.',
    idealCustomer: [
      'Latte lovers en cappuccino genieters',
      'Dessertliefhebbers die een zoet verwenmoment zonder calorieën zoeken',
      'Beginners in de wereld van specialty coffee die zachte toegankelijkheid willen',
      'Iedereen die houdt van een zachte, geurige koffiepauze',
    ],
    lessSuitableFor: [
      'Puristen die uitsluitend onbehandelde single origins drinken',
      'Zoekers naar intense bitterheid of felle citruszuren',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat, Espresso of Cappuccino',
      grind: 'Fijn tot medium',
      ratio: 'Standaard dosering volautomaat of 1:2.2 espresso',
      temperature: '91°C - 93°C',
      bloomTime: '20 seconden',
      tips: 'Probeer deze boon als flat white of cappuccino met havermelk; de vanilletoets versterkt de natuurlijke haverzoetheid op magistrale wijze.',
    },
    signatureCharacteristics: [
      'Natuurlijke infusie met Bourbon vanillepeulen',
      'Geen synthetische geurstoffen of plakkerige nasmaak',
      'Basis van zoete Braziliaanse specialty arabica',
      'Fluweelzacht aroma dat de hele keuken vult',
    ],
    specialStory: {
      title: 'Wat Betekent Natuurlijke Koffie-Infusie?',
      badge: 'Botanische Harmonie',
      calloutQuote:
        'A smooth Brazilian specialty coffee enhanced by natural vanilla notes to create a comforting and luxurious cup.',
      paragraphs: [
        'Specialty coffee blijft te allen tijde het fundament. Wij gebruiken uitsluitend hoogwaardige bonen met een uitmuntende cupping score.',
        'De infusie gebeurt via een delicaat passief proces waarbij natuurlijke vanille-extracten worden geïntegreerd. Er is geen sprake van goedkope chemische na-oliën of artificiële zoetstoffen. De koffie blijft centraal staan: de vanille tilt het kopje op tot een harmonieuze eenheid.',
      ],
    },
  },

  'infused-cinnamon': {
    id: 'infused-cinnamon',
    discoveryTag: 'Seasonal Favourite',
    secondaryTag: 'Comfort Classic',
    story:
      'Geïnspireerd op versgebakken kaneelbroodjes, artisanale speculoos en knusse winteravonden. Deze blend combineert nobele specialty arabica met subtiele, elegante tonen van echte Ceylon kaneel. Warm, kruidig en ongekend geruststellend.',
    originStory:
      'Gebaseerd op een evenwichtige assemblage van Braziliaanse en Colombiaanse arabica\'s. De bonen hebben een milde aciditeit en een van nature nootachtig, karamelrijk fundament.',
    varietyInfo:
      'Caturra & Bourbon arabica. Bieden de noodzakelijke zoete suikerbasis om de warme etherische oliën van de kaneel zachtjes te omhullen.',
    whySelected:
      'Kaneel kan snel overheersen als het verkeerd wordt gedoseerd. Maison Milau koos voor een fluweelzachte infusie die de aroma\'s van geroosterde koffie accentueert in plaats van maskeert.',
    idealCustomer: [
      'Liefhebbers van kaneelbroodjes, chai lattes en speculoos',
      'Mensen die gezelligheid en warmte zoeken in hun herfst- en winterkoffie',
      'Espresso- en filterdrinkers die houden van een delicate kruidige twist',
    ],
    lessSuitableFor: [
      'Mensen die een uitgesproken hekel hebben aan kaneel of specerijen',
    ],
    brewingAdvice: {
      recommendedMethod: 'Filter, French Press of Cappuccino',
      grind: 'Medium',
      ratio: '1:16 filter of 1:14 cafetière',
      temperature: '92°C',
      bloomTime: '30 seconden',
      tips: 'Heerlijk met een wolkje opgeschuimde melk en een vleugje verse nootmuskaat erbovenop.',
    },
    signatureCharacteristics: [
      'Natuurlijk geïnfuseerd met echte Ceylon kaneelnoten',
      'Aroma van gekarameliseerde appel, boterbiscuit en kaneel',
      'Geen bittere scherpte, uitsluitend zachte kruidigheid',
      'Een verwarmend comfort-moment in elk kopje',
    ],
    specialStory: {
      title: 'Geïnspireerd op Ambachtelijk Banket',
      badge: 'Artisanale Kruideninfusie',
      calloutQuote:
        'Inspired by warm fresh pastries and winter spices, this coffee combines specialty arabica with elegant natural cinnamon tones.',
      paragraphs: [
        'Kaneel is een van de nobelste specerijen ter wereld. Door het selecteren van Ceylon kaneelnoten — zachter en verfijnder dan de scherpe Cassia-variant — ontstaat een balans die doet denken aan een verse kaneelplunder bij de bakker.',
        'De koffie behoudt zijn volle arabica-ziel: de kaneel vormt een zijdezachte achtergrond die de natuurlijke chocoladetoetsen van de koffie complementeert.',
      ],
    },
  },

  'infused-almond': {
    id: 'infused-almond',
    discoveryTag: 'Most Unique',
    secondaryTag: 'Dessert Lovers',
    story:
      'Voor liefhebbers van marsepein, amandelspijs, geroosterde noten en Italiaanse amaretto-koekjes. Een ongekend zacht en verfijnd kopje dat de zoetheid van amandelen naadloos verbindt met onze beste ambachtelijke branding.',
    originStory:
      'Een verfijnde blend van gewassen Colombia en natuurlijk gedroogde Brazilië arabica. De natuurlijke cacaotonen van deze regio\'s vormen de ideale gastronomische paring met zoete amandel.',
    varietyInfo:
      'Castillo en Mundo Novo. Deze variëteiten staan bekend om hun stevige nootachtige kern en dichte textuur.',
    whySelected:
      'Amandel en koffie vormen in de patisserie al eeuwenlang een gouden duo. Maison Milau vertaalde deze klassieke harmonie naar een gebalanceerde specialty koffie zonder toegevoegde suikers.',
    idealCustomer: [
      'Liefhebbers van amandelen, marsepein en amaretto',
      'Koffiedrinkers die van nature zoet en romig verkiezen boven bitter of zuur',
      'Iedereen die van een kopje koffie een dessertbeleving wil maken',
    ],
    lessSuitableFor: [
      'Personen met ernstige notenallergieën (voorzorgsmaatregel bij infusies)',
      'Liefhebbers van ultra-donkere, rokerige espresso\'s',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat, Lungo of Espresso',
      grind: 'Medium-fijn',
      ratio: '1:2.5 voor een elegante lungo',
      temperature: '92°C',
      bloomTime: '25 seconden',
      tips: 'Laat de koffie licht afkoelen; de amandelbloesem en marsepein-zoetheid worden nog prominenter bij drinktemperaturen rond 60°C.',
    },
    signatureCharacteristics: [
      'Geïnfuseerd met natuurlijke zoete amandel-extracten',
      'Tonen van marsepein, geroosterde amandelschaafsel en melkchocolade',
      'Rond en zacht mondgevoel zonder suiker of calorieën',
      'Elegante, aromatische geurbeleving',
    ],
    specialStory: {
      title: 'De Kunst van Marsepein & Koffie',
      badge: 'Patisserie Inspiratie',
      calloutQuote:
        'For lovers of marzipan, praline and roasted nuts. Elegant, smooth and remarkably comforting.',
      paragraphs: [
        'Het doel van deze infusie is subtiliteit. In plaats van een overheersende amandelsiroop proeft u de nobele gelaagdheid van amandelbloesem en amandelnoga verweven in specialty koffie.',
        'Het is alsof u geniet van een versgebakken Italiaanse cantuccini bij een perfect getrokken kopje koffie.',
      ],
    },
  },

  // SINGLE ORIGINS: GESHA & PINK BOURBON
  'so-gesha-bench-maji': {
    id: 'so-gesha-bench-maji',
    discoveryTag: 'Rarest Coffee',
    secondaryTag: 'Collector\'s Pick',
    story:
      'Gesha is het kroonjuweel van de internationale koffiewereld. Afkomstig uit de ongerepte nevelwouden van Bench Maji in Ethiopië, de geboorteplek van deze legendarische variëteit. Beroemd om zijn adembenemende florale elegantie, tonen van geurige jasmijn, bergamot en een theekopperige, kristalheldere zuiverheid die wereldwijd op veilingen records breekt.',
    originStory:
      'Gecultiveerd op 1.900 tot 2.100 meter hoogte in Bench Maji, Zuidwest-Ethiopië. Onder een dicht bladerdak van inheemse schaduwbomen rijpen de bessen tergend langzaam. De vulkanische bodem en overvloedige bergregens creëren een terroir dat nergens ter wereld kan worden gerepliceerd.',
    varietyInfo:
      '100% Gesha (Panama/Ethiopian Heirloom 1931). Gekenmerkt door langwerpige bonen en een uitzonderlijk hoog gehalte aan florale esters en aromatische aldehyden.',
    whySelected:
      'Maison Milau selecteerde dit micro-lot vanwege zijn zeldzame SCA cupping score van 88.5+. Een koffie die bewijst dat koffie net zo complex, verfijnd en gelaagd kan zijn als een Grand Cru Bourgogne.',
    idealCustomer: [
      'Specialty coffee puristen en cuppers',
      'Liefhebbers van jasmijn- en Earl Grey-thee die koffie op het allerhoogste niveau willen ervaren',
      'Verzamelaars van zeldzame micro-lots',
      'Iedereen die wil begrijpen waarom Gesha de meest bezongen variëteit ter wereld is',
    ],
    lessSuitableFor: [
      'Mensen die op zoek zijn naar een dikke, bittere, donkere espresso met melk',
      'Drinkers die traditionele "zware" koffiesmaak verwachten',
    ],
    brewingAdvice: {
      recommendedMethod: 'Pour-Over (V60, Chemex of Origami Dripper)',
      grind: 'Medium (consistent en clean)',
      ratio: '1:16.5 (15g koffie op 250g water)',
      temperature: '93°C met zacht water (bijv. gefilterd met max 70ppm)',
      bloomTime: '45 seconden bloom met 45g water, daarna zachte circulaire gietbeurten',
      tips: 'Gebruik geen kokend water om de delicate jasmijnoliën niet te verbranden. Drink puur, zonder melk of suiker, uit een tulpglas.',
    },
    signatureCharacteristics: [
      'Officiële SCA Cupping Score: 88.5+ Specialty Grade',
      'Explosie van jasmijnbloesem, bergamot, witte perzik en bloemenhoning',
      'Zijdezacht theekopperig mondgevoel met kristalheldere aciditeit',
      'Langste florale afdronk in ons hele assortiment',
    ],
    specialStory: {
      title: 'Waarom Koffie-Experts Gesha Aanbidden',
      badge: 'De Legendarische Variëteit',
      calloutQuote:
        'Gesha breaks every rule of traditional coffee. It drinks like floral silk and liquid jasmine.',
      paragraphs: [
        'Oorspronkelijk ontdekt in de jaren 1930 in het Gesha-bos van Ethiopië, bleef deze variëteit decennialang een goed bewaard geheim totdat het in 2004 op de Best of Panama-veiling de koffiewereld schokte. De juryleden dachten aanvankelijk dat iemand jasmijnthee in het kopje had gegoten.',
        'Wat Gesha zo uniek maakt, is de genetische aanleg om florale verbindingen te synthetiseren die normaal gesproken alleen in jasmijnbloemen, bergamotschillen en rijpe perziken voorkomen.',
      ],
      sections: [
        {
          heading: 'Wat Maakt Gesha Zo Anders?',
          body: 'De structuur is theekopperig in plaats van zwaar. Waar standaard koffie draait om geroosterde suikers, draait Gesha om pure botanische etherische oliën.',
        },
        {
          heading: 'Waarom Gesha Legendarisch Werd',
          body: 'Het domineert al twintig jaar de World Barista Championships en breekt jaar na jaar alle veilingrecords. Dit lot uit Bench Maji brengt die legende rechtstreeks naar uw kopje.',
        },
      ],
    },
  },

  'so-pink-bourbon': {
    id: 'so-pink-bourbon',
    discoveryTag: 'Coffee Enthusiast Choice',
    secondaryTag: 'Rarest Coffee',
    story:
      'De ontdekking die de specialty koffiewereld op zijn kop zette. Pink Bourbon is een uiterst zeldzame, natuurlijke variëteit die ontstaat door een spontane mutatie tussen Red en Yellow Bourbon. Oogsten is een huzarenstuk: omdat de bessen een delicate rozerood-oranje tint aannemen, kan alleen het meest ervaren plukkersoog zien wanneer de bes exact op het piek-suikerpunt is. Het resultaat is een aromatische sensatie van roze pompelmoes, cranberry, oranjebloesem en zoet suikerriet.',
    originStory:
      'Geteeld op Finca El Caney in Huila, Colombia, op 1.820 meter hoogte. Deze regio staat bekend om haar microklimaten waarin de passaatwinden uit de Amazone botsen tegen het Andesgebergte, wat resulteert in weelderige vegetatie en perfecte suikeropbouw.',
    varietyInfo:
      '100% Pink Bourbon (Washed). Deze variëteit bezit een buitengewoon hoog sucrose-gehalte, wat resulteert in een sprankelende levendigheid gecombineerd met diepe zoetheid.',
    whySelected:
      'Pink Bourbon is de favoriete boon van koffie-geeks en kampioenschapsbarista\'s. Maison Milau bemachtigde een exclusief micro-lot van Finca El Caney dat bekroond werd met een SCA score van 87.5.',
    idealCustomer: [
      'Gepassioneerde specialty coffee liefhebbers die iets unieks zoeken',
      'Pour-over brouwers die houden van levendige, sappige en fruitige aciditeit',
      'Avontuurlijke genieters die de nieuwste ontdekkingen willen proeven',
    ],
    lessSuitableFor: [
      'Wie uitsluitend van zware, bittere, donkergebrande koffie houdt',
      'Mensen die geen fruitige zuren in hun koffie willen',
    ],
    brewingAdvice: {
      recommendedMethod: 'V60 Pour-Over, AeroPress of Modern Light Espresso',
      grind: 'Medium tot medium-fijn',
      ratio: '1:15 (16g koffie op 240g water)',
      temperature: '94°C',
      bloomTime: '40 seconden',
      tips: 'Laat de koffie licht wervelen tijdens het zetten. U zult direct tonen van rijpe bessen, vanillebloesem en sappige citrus waarnemen.',
    },
    signatureCharacteristics: [
      'Zeldzame natuurlijke mutatie met roze bessen',
      'SCA Cupping Score: 87.5 Micro-Lot',
      'Tonen van cranberry, roze pompelmoes, suikerriet en oranjebloesem',
      'Uitzonderlijk sappige en levendige complexiteit',
    ],
    specialStory: {
      title: 'Het Mysterie van Pink Bourbon',
      badge: 'Micro-Lot Sensatie',
      calloutQuote:
        'The mystery variety that surprised the specialty coffee world.',
      paragraphs: [
        'Jarenlang dacht men dat Pink Bourbon een simpele hybride was van rode en gele bourbon. Recent genetisch onderzoek toont echter aan dat het mogelijk afstamt van een zeldzaam inheems Ethiopisch landras dat op wonderbaarlijke wijze in Colombia is aangeslagen.',
        'Omdat de kleur van de rijpe bes niet rood is maar een subtiel roze-oranje heeft, vergt het oogsten uiterste precisie. Slechts één pluk op het verkeerde moment en de unieke suikers gaan verloren. Dit maakt Pink Bourbon tot een van de meest gewilde en exclusieve koffies van dit decennium.',
      ],
    },
  },

  // PRESTIGE COLLECTION
  'prestige-daily': {
    id: 'prestige-daily',
    discoveryTag: 'Luxury Experience',
    secondaryTag: 'Customer Favourite',
    story:
      'Onze meest verfijnde all-day blend, gecreëerd voor wie het allerbeste verlangt van elke dag. Een harmonieuze compositie van zeldzame hoogland-arabica\'s die fluweelzachte melkchocolade, zoete toffee en amandelen verrijkt met een vleugje rijpe clementine.',
    originStory:
      'Geselecteerde micro-lots uit Colombia (Huila), Ethiopië (Yirgacheffe) en Panama (Boquete). Alle bonen groeien boven 1.700 meter op rijke vulkanische bodems.',
    varietyInfo:
      'Typica, Caturra en Bourbon. Gerespecteerde klassieke variëteiten die zorgen voor een ongeëvenaard gebalanceerde smaakbalans.',
    whySelected:
      'Om te bewijzen dat een dagelijkse koffie net zo verheven en gelaagd kan zijn als een zeldzame single origin.',
    idealCustomer: [
      'Genieters die weigeren concessies te doen aan hun dagelijkse koffie',
      'Liefhebbers van zijdezachte espresso, lungo en verfijnde melkdranken',
    ],
    lessSuitableFor: [
      'Wie uitsluitend goedkope bulk-koffie zoekt',
    ],
    brewingAdvice: {
      recommendedMethod: 'Espresso, Volautomaat of Verfijnde Filter',
      grind: 'Medium-fijn',
      ratio: '1:2.2 espresso (18g in, 40g uit)',
      temperature: '93°C',
      bloomTime: '25 seconden',
      tips: 'Presteert fenomenaal op hoogwaardige espressomachines en premium volautomaten.',
    },
    signatureCharacteristics: [
      'SCA Score: 86+ Specialty Blend',
      'Fluweelzacht mondgevoel met melkchocolade, toffee en clementine',
      'Lange, zoete en uiterst zuivere afdronk',
    ],
  },

  'prestige-espresso': {
    id: 'prestige-espresso',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Luxury Experience',
    story:
      'Een koninklijke espresso met een dichte hazelnootkleurige crema, tonen van donkere cacaonibs, zwarte kersen, toffee en een hint van Bourbon-vanille. Ontworpen voor de veeleisende barista die perfectie zoekt in het kopje.',
    originStory:
      'Geblend uit zeldzame gewassen koffies uit Colombia, Ethiopië en Guatemala. De bonen uit Antigua (Guatemala) voegen een minerale diepgang en rokerige chocoladetoets toe.',
    varietyInfo:
      'Caturra, Bourbon en Catuai. Zorgt voor een zware body met verfijnde aromatische complexiteit.',
    whySelected:
      'Ontwikkeld als onze absolute vlaggeschip-espresso voor fijnproevers.',
    idealCustomer: [
      'Espresso puristen die een dikke crema met intense gelaagdheid willen',
      'Flat White liefhebbers die willen dat de chocolade- en kersentoetsen moeiteloos door melk schijnen',
    ],
    lessSuitableFor: [
      'Liefhebbers van lichte pour-over filterkoffie',
    ],
    brewingAdvice: {
      recommendedMethod: 'Specialty Espressomachine of Moka Pot',
      grind: 'Fijn (op maat afgesteld voor 27-30s extractie)',
      ratio: '1:2 (18g in, 36g uit)',
      temperature: '93.5°C',
      bloomTime: 'Pre-infusie 4 seconden bij 3 bar',
      tips: 'Geniet van de eerste slok direct na het wervelen van het kopje om crema en extractie te laten versmelten.',
    },
    signatureCharacteristics: [
      'SCA Score: 86.5+ Specialty Grade',
      'Tonen van cacaonibs, zwarte kers, vanille en toffee',
      'Volle, romige body en uitzonderlijke crema-stabiliteit',
    ],
  },

  'prestige-filter': {
    id: 'prestige-filter',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Collector\'s Pick',
    story:
      'Geïnspireerd op de befaamde Nordic roasting stijl. Een uiterst lichte, zuivere branding van zeldzame hoogland-arabica\'s uit Ethiopië, Panama en Kenia. Tonen van geurige jasmijn, bergamot, witte perzik en Earl Grey.',
    originStory:
      'Micro-lots uit Boquete (Panama) en Yirgacheffe (Ethiopië). Geoogst boven 1.850 meter hoogte, met de hand gesorteerd op uiterste rijpheid.',
    varietyInfo:
      'Heirloom & Geisha-nakomelingen. Buitengewoon rijk aan florale aldehyden en fruitzuren.',
    whySelected:
      'Voor liefhebbers van kristalheldere, theekopperige filterkoffie met ongeëvenaarde verfijning.',
    idealCustomer: [
      'Filterkoffie puristen die met V60, Chemex of Kalita Wave brouwen',
      'Liefhebbers van florale en theekopperige delicatesse',
    ],
    lessSuitableFor: [
      'Mensen die donkere, bittere koffie of dikke crema verwachten',
    ],
    brewingAdvice: {
      recommendedMethod: 'V60 Pour-Over of Chemex',
      grind: 'Medium (consistent)',
      ratio: '1:16 (15g koffie op 240g water)',
      temperature: '92°C - 94°C',
      bloomTime: '45 seconden',
      tips: 'Gebruik zacht mineraalwater om het ragfijne bouquet van witte perzik en bergamot ten volle te laten stralen.',
    },
    signatureCharacteristics: [
      'SCA Score: 87.5+ Specialty Grade',
      'Ultra-lichte Nordic branding voor maximale smaaktransparantie',
      'Jasmijn, bergamot, perzik en Earl Grey',
    ],
  },

  // PREMIUM COLLECTION
  'premium-daily': {
    id: 'premium-daily',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Most Accessible',
    story:
      'Een veelzijdige omniroast die toffee, amandel en oranjebloesem samenbrengt. Fluweelzacht, elegant en geliefd door zowel ervaren barista\'s als beginnende koffieliefhebbers.',
    originStory:
      'Brazilië Cerrado, Colombia Huila en Ethiopië Sidama. Een uitgebalanceerd drieluik van Zuid-Amerikaanse zoetheid en Afrikaanse frisheid.',
    varietyInfo:
      'Bourbon, Caturra en Heirloom arabica.',
    whySelected:
      'Onze meest universeel gewaardeerde premium blend, presteert vlekkeloos op elk zetsysteem.',
    idealCustomer: [
      'Gezinnen of kantoren waar zowel lungo, espresso als cappuccino wordt gedronken',
      'Liefhebbers van karamel, toffee en milde florale accenten',
    ],
    lessSuitableFor: [
      'Wie extreme experimentele fermentaties of rokerige bitterheid zoekt',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat, Espresso of Filter',
      grind: 'Medium tot fijn',
      ratio: '1:2 espresso of 1:16 filter',
      temperature: '92°C',
      bloomTime: '30 seconden',
      tips: 'Een allemansvriend van het hoogste niveau.',
    },
    signatureCharacteristics: [
      'SCA Score: 85+ Specialty Grade',
      'Toffee, amandel, melkchocolade en oranjebloesem',
      'Perfecte zoet-zuur balans',
    ],
  },

  'premium-espresso': {
    id: 'premium-espresso',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Customer Favourite',
    story:
      'Specialty espresso met diepe cacao, rijpe braambessen, marsepein en een nobele toets cederhout. Een rijke, gelaagde smaakbeleving met een fluweelzachte afdronk.',
    originStory:
      'Colombia Huila en Brazilië Sul de Minas, aangevuld met een toets gewassen Ethiopië.',
    varietyInfo:
      '100% Arabica (Castillo, Caturra, Yellow Bourbon).',
    whySelected:
      'Biedt klassieke Italiaanse diepgang zonder enige scherpe bitterheid dankzij onze slow-drum branding.',
    idealCustomer: [
      'Espressoliefhebbers die van donkere chocolade en marsepein houden',
      'Cappuccinodrinkers die een stevige basis wensen',
    ],
    lessSuitableFor: [
      'Liefhebbers van ultralichte theekopperige koffie',
    ],
    brewingAdvice: {
      recommendedMethod: 'Espresso of Moka Pot',
      grind: 'Fijn',
      ratio: '1:2 (18g in, 36g uit)',
      temperature: '93°C',
      bloomTime: '25 seconden',
      tips: 'Laat een prachtige hazelnootkleurige crema achter met een intense chocoladegeur.',
    },
    signatureCharacteristics: [
      'SCA Score: 85+ Specialty Grade',
      'Donkere cacao, braambessen, marsepein en cederhout',
      'Rijke body met zijdezachte textuur',
    ],
  },

  'premium-filter': {
    id: 'premium-filter',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Coffee Enthusiast Choice',
    story:
      'Licht gebrande specialty filterkoffie: geurige jasmijn, rijpe perzik en rode bessen met een natuurlijke honingachtige zoetheid.',
    originStory:
      'Ethiopië Yirgacheffe gewassen, Colombia Nariño en een vleugje Kenia Nyeri voor een sprankelende bessenlift.',
    varietyInfo:
      'Heirloom, SL28 en Caturra.',
    whySelected:
      'Voor liefhebbers van fruitige filterkoffie met een schitterend zoete honingbasis.',
    idealCustomer: [
      'Filter- en pour-over drinkers die houden van perzik, rode bessen en bloemen',
    ],
    lessSuitableFor: [
      'Liefhebbers van bittere, donkere espresso',
    ],
    brewingAdvice: {
      recommendedMethod: 'V60, Chemex of Moccamaster',
      grind: 'Medium',
      ratio: '1:16 (60g per liter water)',
      temperature: '93°C',
      bloomTime: '30 seconden',
      tips: 'Laat de koffie iets afkoelen voor de meest complexe fruittonen.',
    },
    signatureCharacteristics: [
      'SCA Score: 85.5+ Specialty Grade',
      'Jasmijn, perzik, rode bessen en honing',
      'Frisse, elegante aciditeit',
    ],
  },

  // SELECTION COLLECTION
  'selection-daily': {
    id: 'selection-daily',
    discoveryTag: 'Customer Favourite',
    secondaryTag: 'Beginner Friendly',
    story:
      'Onze signatuurbend en meest gedronken koffie. Romige melkchocolade en karamel uit Brazilië verrijkt met aromatische bergamot en zwarte thee uit Ethiopië.',
    originStory:
      'Brazilië Cerrado en Ethiopië Limu, met een vleugje Costa Rica Tarrazú.',
    varietyInfo:
      '100% Arabica (Bourbon, Catuai, Heirloom).',
    whySelected:
      'Het ultieme evenwicht tussen chocoladeachtige body en verfrissende Afrikaanse florale nuances.',
    idealCustomer: [
      'Iedereen die op zoek is naar een betrouwbare, hoogwaardige signatuurkoffie',
      'Gezinnen, kantoren en barista\'s die breed gewaardeerde kwaliteit zoeken',
    ],
    lessSuitableFor: [
      'Zoekers naar extreme experimentele fermentaties',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat, Espresso of Filter',
      grind: 'Medium tot fijn',
      ratio: '1:2 espresso of 1:16 filter',
      temperature: '92°C',
      bloomTime: '25 seconden',
      tips: 'Presteert fantastisch op werkelijk elk zetsysteem.',
    },
    signatureCharacteristics: [
      'SCA Score: 84.5+ Specialty Grade',
      'Melkchocolade, karamel, bergamot en zwarte thee',
      'Onze absolute bestverkochte signatuurblend',
    ],
  },

  'selection-espresso': {
    id: 'selection-espresso',
    discoveryTag: 'Best for Espresso',
    secondaryTag: 'Customer Favourite',
    story:
      'Klassieke Napolitaanse espresso-intensiteit met donkere chocolade, geroosterde hazelnoten en een lang aanhoudende kruidige afdronk. Een klein percentage nobele gewassen Robusta Bariguna zorgt voor een monumentale crema.',
    originStory:
      'Brazilië Sul de Minas, India Mysore en Oeganda Rwenzori.',
    varietyInfo:
      '85% Arabica, 15% Specialty Robusta Canephora.',
    whySelected:
      'Voor liefhebbers van onvervalste Italiaanse bar-espresso met een dikke hazelnootkleurige crema.',
    idealCustomer: [
      'Mensen die houden van krachtig, donker en intens',
      'Drinkers van cappuccino en latte macchiato die een duidelijke koffiesmaak eisen',
    ],
    lessSuitableFor: [
      'Liefhebbers van florale, lichte pour-over filterkoffie',
    ],
    brewingAdvice: {
      recommendedMethod: 'Espresso, Moka Pot of Volautomaat',
      grind: 'Fijn',
      ratio: '1:2 (18g in, 36g uit in 25 seconden)',
      temperature: '92°C',
      bloomTime: '20 seconden',
      tips: 'Snijdt moeiteloos door melk heen voor de ultieme cappuccino.',
    },
    signatureCharacteristics: [
      'Donkere chocolade, cacao, geroosterde hazelnoot en kruiden',
      'Monumentale crema en diepe body',
      'Lage aciditeit, maximale kracht',
    ],
  },

  'selection-filter': {
    id: 'selection-filter',
    discoveryTag: 'Best for Filter',
    secondaryTag: 'Beginner Friendly',
    story:
      'Complexe en cleane filterblend met Ethiopische florale tonen, sappige groene druif en zachte amandelzoetheid.',
    originStory:
      'Ethiopië Limu gewassen, Peru Cajamarca en Brazilië.',
    varietyInfo:
      '100% Arabica (Typica, Caturra, Heirloom).',
    whySelected:
      'Biedt de zuiverheid van een specialty filterkoffie met een toegankelijk karakter.',
    idealCustomer: [
      'Dagelijkse filter- en batch-brew koffiedrinkers',
    ],
    lessSuitableFor: [
      'Liefhebbers van zware, bittere espresso',
    ],
    brewingAdvice: {
      recommendedMethod: 'Filter, Batch Brew of AeroPress',
      grind: 'Medium',
      ratio: '1:16 (60g / L)',
      temperature: '92°C',
      bloomTime: '30 seconden',
      tips: 'Ideaal voor de ochtendpot op kantoor of thuis.',
    },
    signatureCharacteristics: [
      'SCA Score: 84+ Specialty Grade',
      'Citrus, groene druif, pruim en amandel',
      'Levendig en uiterst doordrinkbaar',
    ],
  },

  // VALUE COLLECTION
  'value-espresso': {
    id: 'value-espresso',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Customer Favourite',
    story:
      'Evenwichtige espresso met een romige structuur, zoete karamel, hazelnoot en een subtiele toets gedroogd fruit.',
    originStory:
      'Colombia, Brazilië en Oeganda.',
    varietyInfo:
      '90% Arabica, 10% Robusta.',
    whySelected:
      'Biedt ambachtelijke brandkwaliteit tegen een toegankelijke prijs.',
    idealCustomer: [
      'Dagelijkse espressodrinkers die kwaliteit zoeken voor een scherpe prijs',
    ],
    lessSuitableFor: [
      'Specialty puristen die uitsluitend 88+ single origins drinken',
    ],
    brewingAdvice: {
      recommendedMethod: 'Espresso of Volautomaat',
      grind: 'Fijn',
      ratio: '1:2 espresso',
      temperature: '92°C',
      bloomTime: '20s',
      tips: 'Uitstekende betrouwbare keuze voor volautomaten.',
    },
    signatureCharacteristics: [
      'Chocolade, karamel, hazelnoot en gedroogd fruit',
      'Stabiele crema en zachte bitterheid',
    ],
  },

  'value-omni': {
    id: 'value-omni',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    story:
      'Veelzijdige blend met zoete toffee en amandel. Ideaal als instapper in de wereld van vers gebrande ambachtelijke koffie.',
    originStory:
      'Brazilië, Colombia en Oeganda.',
    varietyInfo:
      '90% Arabica, 10% Robusta.',
    whySelected:
      'Presteert constant en betrouwbaar voor sowohl lungo als espresso.',
    idealCustomer: [
      'Beginnende koffieliefhebbers die willen overstappen van supermarkt naar vers gebrand',
    ],
    lessSuitableFor: [
      'Liefhebbers van felle citrusaciditeit',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat of French Press',
      grind: 'Medium tot fijn',
      ratio: 'Standaard volautomaat instelling',
      temperature: '92°C',
      bloomTime: '20s',
      tips: 'Zacht en vergevingsgezind.',
    },
    signatureCharacteristics: [
      'Toffee, amandel en melkchocolade',
      'Ronde body en lage aciditeit',
    ],
  },

  'value-filter': {
    id: 'value-filter',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    story:
      'Frisse en harmonieuze filterkoffie met bloemenhoning, zachte bloesem en een subtiele citruslift.',
    originStory:
      'Colombia, Brazilië en Costa Rica.',
    varietyInfo:
      '100% Arabica.',
    whySelected:
      'Toegankelijke filterkoffie voor elke ochtend.',
    idealCustomer: [
      'Liefhebbers van klassieke zachte filterkoffie',
    ],
    lessSuitableFor: [
      'Liefhebbers van donkere espresso',
    ],
    brewingAdvice: {
      recommendedMethod: 'Filter of Snelfilter',
      grind: 'Medium',
      ratio: '1:16',
      temperature: '92°C',
      bloomTime: '30s',
      tips: 'Aangenaam helder en zacht.',
    },
    signatureCharacteristics: [
      'Bloemenhoning, citrus en amandel',
      'Heldere en evenwichtige zuren',
    ],
  },

  // BUDGET COLLECTION
  'budget-espresso': {
    id: 'budget-espresso',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Best for Espresso',
    story:
      'Robuuste en krachtige blend met diepe pure chocolade, geroosterde noten en een dikke hazelnootkleurige crema.',
    originStory:
      'Oeganda en Colombia.',
    varietyInfo:
      '70% Arabica, 30% Robusta.',
    whySelected:
      'Maximale kracht, diepe crema en uitstekende prijs-kwaliteit.',
    idealCustomer: [
      'Liefhebbers van stevige Italiaanse espresso en melkkoffies',
    ],
    lessSuitableFor: [
      'Liefhebbers van lichte florale filterkoffie',
    ],
    brewingAdvice: {
      recommendedMethod: 'Espresso of Moka Pot',
      grind: 'Fijn',
      ratio: '1:2',
      temperature: '92°C',
      bloomTime: '15s',
      tips: 'Dikke crema gegarandeerd.',
    },
    signatureCharacteristics: [
      'Pure chocolade, geroosterde noten en toast',
      'Dikke crema en krachtige body',
    ],
  },

  'budget-omni': {
    id: 'budget-omni',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    story:
      'Ronde en betrouwbare all-rounder voor volautomatische machines met zachte cacao en geroosterde pinda.',
    originStory:
      'Oeganda en Brazilië.',
    varietyInfo:
      '80% Arabica, 20% Robusta.',
    whySelected:
      'Voordelig en betrouwbaar voor dagelijks koffieverbruik op kantoor of thuis.',
    idealCustomer: [
      'Grote koffieverbruikers die betrouwbare smaak zoeken',
    ],
    lessSuitableFor: [
      'Fijnproevers die zeldzame single origins zoeken',
    ],
    brewingAdvice: {
      recommendedMethod: 'Volautomaat of Lungo',
      grind: 'Medium-fijn',
      ratio: 'Standaard volautomaat',
      temperature: '92°C',
      bloomTime: '15s',
      tips: 'Vergevingsgezind en betrouwbaar.',
    },
    signatureCharacteristics: [
      'Cacao, geroosterde pinda en bruine suiker',
      'Milde smaak, volle body',
    ],
  },

  'budget-filter': {
    id: 'budget-filter',
    discoveryTag: 'Most Accessible',
    secondaryTag: 'Beginner Friendly',
    story:
      'Toegankelijke filterkoffie met royale body, zachte melkchocolade en een rustieke nootachtige afdronk.',
    originStory:
      'Oeganda en Brazilië.',
    varietyInfo:
      '85% Arabica, 15% Robusta.',
    whySelected:
      'Toegankelijke filterkoffie voor kan-na-kan verbruik.',
    idealCustomer: [
      'Liefhebbers van no-nonsense filterkoffie',
    ],
    lessSuitableFor: [
      'Liefhebbers van delicate florale theetonen',
    ],
    brewingAdvice: {
      recommendedMethod: 'Filter of Snelfilterapparaat',
      grind: 'Medium',
      ratio: '1:16',
      temperature: '92°C',
      bloomTime: '20s',
      tips: 'Blijft aangenaam warm in de thermoskan.',
    },
    signatureCharacteristics: [
      'Melkchocolade, biscuit en walnoot',
      'Stevige body voor een filterkoffie',
    ],
  },
};
