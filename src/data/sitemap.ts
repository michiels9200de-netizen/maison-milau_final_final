// Step 1: Complete Sitemap
// Step 2: All Page Routes
// Step 4: Navigation Menus & Validation Engine

export interface RouteDefinition {
  path: string;
  title: string;
  description: string;
  inNavigation: boolean;
  navLabel?: string;
  parentPath?: string;
  requireAuth?: boolean;
  role?: string;
}

export const SITEMAP: RouteDefinition[] = [
  {
    path: '/',
    title: 'Maison Milau · Ambachtelijke Koffiebranderij Oudegem',
    description: 'Ambachtelijk gebrande specialty koffies voor elke gelegenheid.',
    inNavigation: true,
    navLabel: 'Home',
  },
  {
    path: '/koffies',
    title: 'Onze Koffies · Product Informatie Systeem & Catalogus',
    description: 'Educatief koffie-overzicht met SCA scores, blendverhoudingen, origines en terroir.',
    inNavigation: true,
    navLabel: 'Onze Koffies (Catalogus)',
  },
  {
    path: '/webshop',
    title: 'Webshop · Artisanale Specialty Koffies & Toebehoren',
    description: 'Snel en eenvoudig vers gebrande koffies, giftboxen en toebehoren bestellen.',
    inNavigation: true,
    navLabel: 'Webshop',
  },
  {
    path: '/kantoor-en-horeca',
    title: 'Kantoor en Horeca · B2B Koffieformules & Machines',
    description: 'B2B volumekortingen, proefpakketten, machineformules en custom roasting.',
    inNavigation: true,
    navLabel: 'Kantoor en Horeca',
  },
  {
    path: '/events',
    title: 'Events & Verhuur · Koffiecatering & Barista Bars',
    description: 'Koffiecatering, mobiele barista-bars en apparatuurverhuur voor feesten en recepties.',
    inNavigation: true,
    navLabel: 'Events & Verhuur',
  },
  {
    path: '/over-ons',
    title: 'Over Ons · Branderij, Ambacht & Familieverhaal',
    description: 'Ons atelier in Oudegem, wekelijkse markten en passie voor eerlijke specialty koffie.',
    inNavigation: true,
    navLabel: 'Over ons',
  },
  {
    path: '/faq',
    title: 'Klantenservice & Veelgestelde Vragen',
    description: 'Vind antwoord op vragen over levering, zettechnieken, B2B, verhuur en track & trace.',
    inNavigation: true,
    navLabel: 'FAQ & Klantenservice',
  },
  {
    path: '/afspraakplanner',
    title: 'Afspraakplanner · Atelier Bezoek & Cupping',
    description: 'Plan een bezoek aan ons atelier in Oudegem voor proeverijen of white label overleg.',
    inNavigation: false,
    navLabel: 'Afspraakplanner',
  },
  {
    path: '/account',
    title: 'Mijn Account · Klantenportaal & Mijn Bedrijf',
    description: 'Beheer bestellingen, facturen, abonnementen, offertes en leveringsadressen.',
    inNavigation: true,
    navLabel: 'Mijn Account',
  },
  {
    path: '/checkout',
    title: 'Afrekenen · Veilige Mollie Betaling',
    description: 'Voltooi uw bestelling veilig via Bancontact, iDEAL, Creditcard of Apple Pay.',
    inNavigation: false,
    navLabel: 'Afrekenen',
  },
  {
    path: '/checkout/success',
    title: 'Bestelling Bevestigd · Maison Milau',
    description: 'Uw betaling is ontvangen en uw order wordt vers gebrand en verwerkt.',
    inNavigation: false,
  },
  {
    path: '/checkout/cancel',
    title: 'Betaling Geannuleerd · Maison Milau',
    description: 'De betaling is geannuleerd. U kunt de betaling opnieuw proberen of de winkelmand wijzigen.',
    inNavigation: false,
  },
  {
    path: '/admin',
    title: 'Beheerder Dashboard · Maison Milau Roastery',
    description: 'Verkoopoverzicht, Mollie transacties, offertes en atelierafspraken.',
    inNavigation: false,
    requireAuth: true,
    role: 'store_admin',
  },
];

// Webshop Subcategories (for expandable Hamburger Menu)
export interface SubCategory {
  id: string;
  name: string;
  categoryFilter: string;
}

export const WEBSHOP_SUBCATEGORIES: SubCategory[] = [
  { id: 'all', name: 'Alle Collecties & Producten', categoryFilter: 'all' },
  { id: 'blends', name: 'Maison Milau Speciality Blends', categoryFilter: 'blends' },
  { id: 'barrel-aged', name: 'Barrel Aged Coffees', categoryFilter: 'barrel_aged' },
  { id: 'infused', name: 'Infused Coffees', categoryFilter: 'infused' },
  { id: 'giftboxes', name: 'Giftboxen & Proefpakketten', categoryFilter: 'giftboxes' },
  { id: 'toebehoren', name: 'Koffie Toebehoren & merchandise', categoryFilter: 'merchandise' },
  { id: 'abonnementen', name: 'Abonnementen (-10%)', categoryFilter: 'subscriptions' },
  { id: 'promoties', name: 'Promoties', categoryFilter: 'promotions' },
];

// Link Validation Rule: Validate every link before rendering!
const VALID_ROUTE_PATHS = new Set(SITEMAP.map((r) => r.path));

export function isValidRoute(path: string): boolean {
  if (!path) return false;
  // Handle paths with query params or hash
  const cleanPath = path.split('?')[0].split('#')[0];
  return VALID_ROUTE_PATHS.has(cleanPath);
}

export function getRouteDefinition(path: string): RouteDefinition | undefined {
  const cleanPath = path.split('?')[0].split('#')[0];
  return SITEMAP.find((r) => r.path === cleanPath);
}
