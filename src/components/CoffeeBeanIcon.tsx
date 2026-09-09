import React from 'react';

interface CoffeeBeanIconProps {
  className?: string;
  filled?: boolean;
  size?: number;
}

/**
 * Premium Specialty Coffee Bean Icon
 * Replaces generic AI star symbols with an authentic, handcrafted roastery visual language.
 */
export const CoffeeBeanIcon: React.FC<CoffeeBeanIconProps> = ({
  className = 'w-4 h-4',
  filled = false,
  size,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer contoured bean body */}
      <path
        d="M12 2C7.03 2 3 6.03 3 11C3 16.5 7.03 21.5 12 21.5C16.97 21.5 21 16.5 21 11C21 6.03 16.97 2 12 2Z"
        fill={filled ? 'currentColor' : 'currentColor'}
        fillOpacity={filled ? '1' : '0.12'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Characteristic curved central crease / fissure */}
      <path
        d="M12 3.5C9.2 7.2 9.4 10.8 12 12C14.6 13.2 14.8 16.8 12 20"
        stroke={filled ? '#FFFFFF' : 'currentColor'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity={filled ? '0.85' : '1'}
      />
    </svg>
  );
};
