import React from 'react';

interface CountryFlagProps {
  country?: string;
  flagEmoji?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * High-definition, cross-platform CountryFlag component.
 * Windows desktop browsers (Chrome, Edge, Firefox) do NOT render emoji flags in Segoe UI Emoji,
 * displaying ugly 2-letter ISO text codes (e.g. "UG", "CO", "BR") instead.
 * This component renders crisp, authentic vector SVG flags on all devices and operating systems.
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  country = '',
  flagEmoji,
  className = '',
  size = 'sm',
}) => {
  const norm = country.trim().toLowerCase();

  const dimensions =
    size === 'lg'
      ? 'w-6 h-4'
      : size === 'md'
      ? 'w-5 h-3.5'
      : 'w-4 h-3';

  const baseContainerClass = `inline-block shrink-0 rounded-[2px] overflow-hidden shadow-2xs ring-1 ring-black/15 align-middle ${dimensions} ${className}`;

  // Uganda
  if (norm.includes('uganda') || flagEmoji === '🇺🇬') {
    return (
      <span className={baseContainerClass} title={country || 'Uganda'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="100" fill="#000000" />
          <rect y="100" width="900" height="100" fill="#FCDC04" />
          <rect y="200" width="900" height="100" fill="#D90000" />
          <rect y="300" width="900" height="100" fill="#000000" />
          <rect y="400" width="900" height="100" fill="#FCDC04" />
          <rect y="500" width="900" height="100" fill="#D90000" />
          <circle cx="450" cy="300" r="100" fill="#ffffff" />
          {/* Stylized crested crane */}
          <path d="M430 330 C430 300, 440 280, 455 250 C460 240, 470 245, 465 255 C455 275, 450 290, 450 325 Z" fill="#000000" />
          <circle cx="463" cy="245" r="4" fill="#D90000" />
          <path d="M440 330 Q465 315 480 340" stroke="#000000" strokeWidth="6" fill="none" />
        </svg>
      </span>
    );
  }

  // Colombia
  if (norm.includes('colombia') || flagEmoji === '🇨🇴') {
    return (
      <span className={baseContainerClass} title={country || 'Colombia'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="300" fill="#FCD116" />
          <rect y="300" width="900" height="150" fill="#003893" />
          <rect y="450" width="900" height="150" fill="#CE1126" />
        </svg>
      </span>
    );
  }

  // Brazil / Brazilië
  if (norm.includes('brazil') || norm.includes('brazilië') || flagEmoji === '🇧🇷') {
    return (
      <span className={baseContainerClass} title={country || 'Brazilië'}>
        <svg viewBox="0 0 1000 700" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="1000" height="700" fill="#009c3b" />
          <polygon points="500,85 915,350 500,615 85,350" fill="#ffdf00" />
          <circle cx="500" cy="350" r="175" fill="#002776" />
          <path d="M330 365 Q500 310 670 380" stroke="#ffffff" strokeWidth="18" fill="none" />
        </svg>
      </span>
    );
  }

  // Costa Rica
  if (norm.includes('costa rica') || flagEmoji === '🇨🇷') {
    return (
      <span className={baseContainerClass} title={country || 'Costa Rica'}>
        <svg viewBox="0 0 1000 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="1000" height="100" fill="#002B7F" />
          <rect y="100" width="1000" height="100" fill="#FFFFFF" />
          <rect y="200" width="1000" height="200" fill="#CE1126" />
          <rect y="400" width="1000" height="100" fill="#FFFFFF" />
          <rect y="500" width="1000" height="100" fill="#002B7F" />
        </svg>
      </span>
    );
  }

  // Ethiopia / Ethiopië
  if (norm.includes('ethiop') || flagEmoji === '🇪🇹') {
    return (
      <span className={baseContainerClass} title={country || 'Ethiopië'}>
        <svg viewBox="0 0 1200 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="200" fill="#078930" />
          <rect y="200" width="1200" height="200" fill="#FCDD09" />
          <rect y="400" width="1200" height="200" fill="#DA121A" />
          <circle cx="600" cy="300" r="140" fill="#0F47AF" />
          {/* Radiant yellow star */}
          <polygon
            points="600,190 626,260 700,260 640,305 663,375 600,335 537,375 560,305 500,260 574,260"
            fill="#FCDD09"
          />
        </svg>
      </span>
    );
  }

  // India
  if (norm.includes('india') || flagEmoji === '🇮🇳') {
    return (
      <span className={baseContainerClass} title={country || 'India'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="200" fill="#FF9933" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#138808" />
          <circle cx="450" cy="300" r="70" stroke="#000080" strokeWidth="8" fill="none" />
          <circle cx="450" cy="300" r="14" fill="#000080" />
        </svg>
      </span>
    );
  }

  // Peru
  if (norm.includes('peru') || flagEmoji === '🇵🇪') {
    return (
      <span className={baseContainerClass} title={country || 'Peru'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="600" fill="#D91023" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#D91023" />
        </svg>
      </span>
    );
  }

  // Kenya / Kenia
  if (norm.includes('ken') || flagEmoji === '🇰🇪') {
    return (
      <span className={baseContainerClass} title={country || 'Kenia'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="180" fill="#000000" />
          <rect y="180" width="900" height="30" fill="#FFFFFF" />
          <rect y="210" width="900" height="180" fill="#BB0000" />
          <rect y="390" width="900" height="30" fill="#FFFFFF" />
          <rect y="420" width="900" height="180" fill="#006600" />
          {/* Traditional Maasai shield */}
          <ellipse cx="450" cy="300" rx="60" ry="110" fill="#BB0000" stroke="#000000" strokeWidth="8" />
          <ellipse cx="450" cy="300" rx="14" ry="110" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  // Honduras
  if (norm.includes('honduras') || flagEmoji === '🇭🇳') {
    return (
      <span className={baseContainerClass} title={country || 'Honduras'}>
        <svg viewBox="0 0 1000 500" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="1000" height="167" fill="#0073CF" />
          <rect y="167" width="1000" height="166" fill="#FFFFFF" />
          <rect y="333" width="1000" height="167" fill="#0073CF" />
          {/* 5 five-pointed stars */}
          <g fill="#0073CF">
            <circle cx="440" cy="225" r="14" />
            <circle cx="560" cy="225" r="14" />
            <circle cx="500" cy="250" r="14" />
            <circle cx="440" cy="275" r="14" />
            <circle cx="560" cy="275" r="14" />
          </g>
        </svg>
      </span>
    );
  }

  // Indonesia / Indonesië
  if (norm.includes('indones') || flagEmoji === '🇮🇩') {
    return (
      <span className={baseContainerClass} title={country || 'Indonesië'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="300" fill="#CE1126" />
          <rect y="300" width="900" height="300" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  // Belgium / België
  if (norm.includes('belgi') || flagEmoji === '🇧🇪') {
    return (
      <span className={baseContainerClass} title={country || 'België'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="600" fill="#000000" />
          <rect x="300" width="300" height="600" fill="#FDDA24" />
          <rect x="600" width="300" height="600" fill="#EF3340" />
        </svg>
      </span>
    );
  }

  // Guatemala
  if (norm.includes('guatemala') || flagEmoji === '🇬🇹') {
    return (
      <span className={baseContainerClass} title={country || 'Guatemala'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="600" fill="#4997D0" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#4997D0" />
        </svg>
      </span>
    );
  }

  // Rwanda
  if (norm.includes('rwanda') || flagEmoji === '🇷🇼') {
    return (
      <span className={baseContainerClass} title={country || 'Rwanda'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <rect width="900" height="300" fill="#00A1DE" />
          <rect y="300" width="900" height="150" fill="#E5B200" />
          <rect y="450" width="900" height="150" fill="#20603D" />
          <circle cx="760" cy="150" r="50" fill="#E5B200" />
        </svg>
      </span>
    );
  }

  // Burundi
  if (norm.includes('burundi') || flagEmoji === '🇧🇮') {
    return (
      <span className={baseContainerClass} title={country || 'Burundi'}>
        <svg viewBox="0 0 900 600" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 450,300 0,600" fill="#1EB53A" />
          <polygon points="900,0 450,300 900,600" fill="#1EB53A" />
          <polygon points="0,0 900,0 450,300" fill="#CE1126" />
          <polygon points="0,600 900,600 450,300" fill="#CE1126" />
          <line x1="0" y1="0" x2="900" y2="600" stroke="#FFFFFF" strokeWidth="60" />
          <line x1="0" y1="600" x2="900" y2="0" stroke="#FFFFFF" strokeWidth="60" />
          <circle cx="450" cy="300" r="100" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  // Fallback: If country is not in the recognized vector set, render emoji or text safely
  return (
    <span className="inline-flex items-center text-xs font-semibold text-stone-700" title={country}>
      {flagEmoji || '🏳️'}
    </span>
  );
};
