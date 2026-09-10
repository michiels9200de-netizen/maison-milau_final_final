import React from 'react';

interface SectorIllustrationProps {
  className?: string;
}

/**
 * 1. Horeca Illustration (Bistro, Restaurant, Specialty Coffee Bar)
 * Refined line-art: Elegant espresso cup on saucer, rising aroma ribbons, portafilter & coffee bean flourish.
 */
export const HorecaIllustration: React.FC<SectorIllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Delicate aroma ribbons */}
    <path
      d="M26 12C24.5 15 27.5 18 26 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-75"
    />
    <path
      d="M32 9C30.5 13 33.5 17 32 21"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-400"
    />
    <path
      d="M38 13C36.5 16 39.5 19 38 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-75"
    />

    {/* Porcelain Espresso Cup */}
    <path
      d="M18 24H46V35C46 41.6274 40.6274 47 34 47H30C23.3726 47 18 41.6274 18 35V24Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 28H44"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="opacity-40"
    />

    {/* Cup Handle */}
    <path
      d="M46 28C50 28 53 30 53 34C53 38 49 40 46 40"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Saucer */}
    <path
      d="M11 50C17 53.5 47 53.5 53 50"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 52.5H42"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-amber-400"
    />

    {/* Coffee Bean accent */}
    <path
      d="M13 36C11 34 11 30 13 28C15 26 18 26 20 28C22 30 22 34 20 36C18 38 15 38 13 36Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500/80"
    />
    <path
      d="M14 34C15.5 33 17.5 31 19 30"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-500/80"
    />
  </svg>
);

/**
 * 2. Kantoor / Bedrijf Illustration (Office, Corporate, Co-Working)
 * Refined line-art: Sleek laptop, desk lamp silhouette, steaming artisanal mug & architectonic lines.
 */
export const KantoorIllustration: React.FC<SectorIllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Office window / architectural background grid */}
    <path
      d="M8 12H34V46H8V12Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-30"
    />
    <path
      d="M21 12V46M8 29H34"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="opacity-25"
    />

    {/* Laptop screen & keyboard */}
    <path
      d="M16 26H36V40H16V26Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 43H40L42 45H10L12 43Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 33H28"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />

    {/* Desktop Coffee Mug with Steam */}
    <path
      d="M45 28C44 31 46 33 45 35"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />
    <path
      d="M48 26C47 29 49 32 48 35"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />
    <path
      d="M42 37H51V46C51 47.6569 49.6569 49 48 49H45C43.3431 49 42 47.6569 42 46V37Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51 39H54C55.1046 39 56 39.8954 56 41C56 42.1046 55.1046 43 54 43H51"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Desk baseline */}
    <path
      d="M6 53H58"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500/70"
    />
  </svg>
);

/**
 * 3. Residentiële Zorg Illustration (Care Centers, Assisted Living, Co-Living)
 * Refined line-art: Heartwarming mug held in caring hands, warm radiant sunbeams of hospitality.
 */
export const ResidentieleZorgIllustration: React.FC<SectorIllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Warm sun rays / hospitable aura */}
    <path
      d="M32 8V12M20 12L23 15M44 12L41 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-amber-400 opacity-80"
    />

    {/* Heart symbol rising with steam */}
    <path
      d="M32 20C30 17 26 17 26 20C26 23 32 26 32 26C32 26 38 23 38 20C38 17 34 17 32 20Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-400"
    />

    {/* Ceramic Warm Mug */}
    <path
      d="M24 28H40V41C40 45.4183 36.4183 49 32 49C27.5817 49 24 45.4183 24 41V28Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 32H44C45.6569 32 47 33.3431 47 35C47 36.6569 45.6569 38 44 38H40"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Caring protective hands holding the mug */}
    <path
      d="M13 42C16 45 20 48 24 49"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51 42C48 45 44 48 40 49"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 54C24 57 40 57 48 54"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500/70"
    />
  </svg>
);

/**
 * 4. Handelszaken Illustration (Boutiques, Retail, Showrooms, Concept Stores)
 * Refined line-art: Elegant boutique canopy/awning, shopping bag with gift ribbon & luxury espresso service.
 */
export const HandelszakenIllustration: React.FC<SectorIllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Boutique Awning / Canopy */}
    <path
      d="M10 16H54L50 25C48 27 46 27 44 25C42 27 40 27 38 25C36 27 34 27 32 25C30 27 28 27 26 25C24 27 22 27 20 25L14 25L10 16Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 16L19 25M27 16L27 25M37 16L37 25M46 16L45 25"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400 opacity-60"
    />

    {/* Luxury Retail Shopping Bag */}
    <path
      d="M16 33H36L34 52H18L16 33Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bag ribbon handles */}
    <path
      d="M21 33V29C21 26.2386 23.2386 24 26 24C28.7614 24 31 26.2386 31 29V33"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-400"
    />

    {/* Welcome Espresso Cup for Clients */}
    <path
      d="M43 38C42 40 44 42 43 44"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />
    <path
      d="M40 43H49V48C49 50.2091 47.2091 52 45 52H44C41.7909 52 40 50.2091 40 48V43Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M49 44H51C51.5523 44 52 44.4477 52 45C52 45.5523 51.5523 46 51 46H49"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M38 52H53"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-500/70"
    />

    {/* Floor ground line */}
    <path
      d="M8 55H56"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="opacity-30"
    />
  </svg>
);

/**
 * 5. Kapsalon & Beauty Illustration (Hair salon, Barber, Spa, Aesthetics)
 * Refined line-art: Fine barber shears, vanity mirror arch & welcome gourmet coffee cup.
 */
export const KapsalonIllustration: React.FC<SectorIllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Salon Vanity Mirror Arch */}
    <path
      d="M14 52V24C14 14.0589 22.0589 6 32 6C41.9411 6 50 14.0589 50 24V52"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-35"
    />
    {/* Mirror reflective gleam */}
    <path
      d="M38 14L43 19"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400 opacity-60"
    />

    {/* Elegant Styling Hair Scissors / Shears */}
    <path
      d="M20 22L36 42"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M36 22L20 42"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Pivot screw */}
    <circle
      cx="28"
      cy="32"
      r="1.75"
      fill="currentColor"
      className="text-amber-400"
    />
    {/* Scissor finger rings */}
    <circle
      cx="18"
      cy="45"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle
      cx="38"
      cy="45"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />

    {/* Fine Comb accent */}
    <path
      d="M21 16H35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-amber-400"
    />
    <path
      d="M23 16V20M26 16V20M29 16V20M32 16V20"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />

    {/* Gourmet coffee cup on salon tray */}
    <path
      d="M45 42H53V48C53 50.2091 51.2091 52 49 52C46.7909 52 45 50.2091 45 48V42Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M48 38C47 39.5 49 40.5 48 42"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className="text-amber-400"
    />
    <path
      d="M53 44H55C55.5523 44 56 44.4477 56 45C56 45.5523 55.5523 46 55 46H53"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />

    {/* Salon table baseline */}
    <path
      d="M10 54H54"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="text-amber-500/70"
    />
  </svg>
);

export interface SectorItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  features: string[];
  illustration: React.FC<SectorIllustrationProps>;
}

export const B2B_SECTORS: SectorItem[] = [
  {
    id: 'horeca',
    title: 'Horeca & Gastronomie',
    subtitle: 'Restaurants, Brasseries & Koffiebars',
    description: 'Constante extractiekwaliteit, vers gebrande bonen met roast-date garantie en professionele barista-ondersteuning voor uw service.',
    badge: 'Volumevoordeel',
    features: ['Verse wekelijkse levering', 'Custom roast profiel', 'Snelle espresso-afstelling'],
    illustration: HorecaIllustration,
  },
  {
    id: 'kantoor',
    title: 'Kantoor & Bedrijven',
    subtitle: 'KMO, Corporate & Co-Working',
    description: 'Verhoog de energie en tevredenheid op de werkvloer met specialty coffee bonen die perfect renderen in volautomatische bean-to-cup machines.',
    badge: 'Fiscaal aftrekbaar',
    features: ['Automatische maandfactuur', 'Flexibel pauzeren', 'Bean-to-cup afstemming'],
    illustration: KantoorIllustration,
  },
  {
    id: 'residentieel',
    title: 'Residentiële Zorg',
    subtitle: 'Woonzorgcentra & Assistentiewoningen',
    description: 'Een warm en kwalitatief koffiemoment voor bewoners, medewerkers en bezoekers met milde, maagvriendelijke brandingen.',
    badge: 'Milde melanges',
    features: ['Evenwichtige roast', 'Grote volumes mogelijk', 'Persoonlijk contactpersoon'],
    illustration: ResidentieleZorgIllustration,
  },
  {
    id: 'handelszaken',
    title: 'Handelszaken & Retail',
    subtitle: 'Boetieks, Showrooms & Concept Stores',
    description: 'Trakteer uw cliënteel op een onvergetelijke hospitality-ervaring en verleng de verblijfsduur met een verfijnde espresso.',
    badge: 'Hospitality boost',
    features: ['Exclusieve beleving', 'Compacte opstelling', 'Merkversterkende service'],
    illustration: HandelszakenIllustration,
  },
  {
    id: 'kapsalon',
    title: 'Kapsalons & Beauty',
    subtitle: 'Hairstyling, Spa & Wellness Studio’s',
    description: 'Geef uw klanten de ultieme verwenervaring tijdens hun behandeling met een ambachtelijk gezet kopje koffie in plaats van standaard automaatkoffie.',
    badge: 'Premium beleving',
    features: ['Luxe traktatie voor klanten', 'Eenvoudige bereiding', 'Elegante presentatie'],
    illustration: KapsalonIllustration,
  },
];
