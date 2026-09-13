// ==============================================================================
// MAISON MILAU · SECURE B2B CALCULATOR & PRICING ENGINE
// ==============================================================================

import { canAccessB2BPricing, getB2BAccessStatus, UserProfilePricingContext, B2BAccessStatus } from '../auth/pricing';

export interface B2BCalculatorInput {
  settingType: 'kantoor' | 'horeca' | 'residentieel' | 'handelszaken' | 'kapsalon' | 'evenement';
  peopleCount: number;
  cupsPerPersonPerDay: number;
  tasteProfile: 'krachtig' | 'toegankelijk' | 'gebalanceerd' | 'exclusief';
  machineOption: 'beans_only' | 'volautomaat' | 'heavy' | 'piston';
}

export interface B2BCalculationResult {
  basePricePerKg: number;
  workingDays: number;
  estimatedCups: number;
  monthlyKg: number;
  discountPct: number;
  discountedPricePerKg: number;
  totalMonthlyCoffee: number;
  machineCost: number;
  totalMonthly: number;
  costPerCup: number;
  monthlySavings: number;
  recommendedBlend: {
    name: string;
    notes: string;
    beans: string;
  };
}

export interface B2BCalculationResponse {
  success: boolean;
  authorized: boolean;
  status: B2BAccessStatus;
  message?: string;
  error?: string;
  calculation?: B2BCalculationResult;
}

const TASTE_PROFILES = {
  krachtig: {
    name: 'Milau Budget Espresso',
    notes: 'Donkere cacao, karamel & volle crema. Ideaal voor krachtige espresso en cappuccino.',
    beans: 'Milau Budget Espresso (SCA 83+)',
  },
  toegankelijk: {
    name: 'Milau Budget Omni',
    notes: 'Zacht, nootachtig en rond met melkchocolade. Dé allemansvriend voor kantoor en horeca.',
    beans: 'Milau Budget Omni (SCA 83.5)',
  },
  gebalanceerd: {
    name: 'Milau Budget Filter',
    notes: 'Subtiele zoetheid, lichte hazelnoot en zuivere afdronk. Perfect voor doordrinkkoffie.',
    beans: 'Milau Budget Filter (SCA 84)',
  },
  exclusief: {
    name: 'Milau Selection Colombia & Honduras',
    notes: 'Rode bessen, melkchocolade en delicate florale aciditeit. Pure specialty grading.',
    beans: 'Milau Selection Single Origin (SCA 86.5)',
  },
} as const;

/**
 * Voert een strikt beveiligde B2B calculator berekening uit op de server.
 * Indien de gebruiker niet over role='b2b' EN status='approved' beschikt,
 * worden B2B prijzen, staffelkortingen en calculatieresultaten NIET vrijgegeven.
 */
export function calculateB2BPricingServerSide(
  input: B2BCalculatorInput,
  userProfile?: UserProfilePricingContext | null
): B2BCalculationResponse {
  const access = getB2BAccessStatus(userProfile);

  if (!access.hasAccess) {
    return {
      success: false,
      authorized: false,
      status: access.status,
      error: access.message,
      message: access.message,
    };
  }

  // Sanitize and validate inputs
  const safePeopleCount = Math.max(1, Math.min(1000, Number(input.peopleCount) || 15));
  const safeCupsPerPerson = Math.max(0.5, Math.min(10, Number(input.cupsPerPersonPerDay) || 2.5));
  const safeSetting = input.settingType || 'kantoor';
  const safeProfile = input.tasteProfile in TASTE_PROFILES ? input.tasteProfile : 'toegankelijk';
  const safeMachine = input.machineOption || 'beans_only';

  const basePricePerKg = 24.95; // Base price Milau Budget (€24.95 / kg excl. btw)

  const workingDays =
    safeSetting === 'horeca'
      ? 26
      : safeSetting === 'residentieel'
      ? 30
      : safeSetting === 'handelszaken'
      ? 24
      : safeSetting === 'kapsalon'
      ? 22
      : safeSetting === 'evenement'
      ? 12
      : 22;

  const estimatedCups = Math.round(safePeopleCount * safeCupsPerPerson * workingDays);
  // 8g of coffee per cup = 125 cups per kg
  const monthlyKg = Math.max(5, Math.ceil(estimatedCups / 125));

  // B2B discount ladder:
  // < 10 kg: 10%
  // 10 to 14 kg: 12%
  // 15 to 29 kg: 15%
  // 30 to 49 kg: 18%
  // >= 50 kg: 20%
  let discountPct = 10;
  if (monthlyKg >= 50) discountPct = 20;
  else if (monthlyKg >= 30) discountPct = 18;
  else if (monthlyKg >= 15) discountPct = 15;
  else if (monthlyKg >= 10) discountPct = 12;

  const discountedPricePerKg = Number((basePricePerKg * (1 - discountPct / 100)).toFixed(2));
  const totalMonthlyCoffee = Number((monthlyKg * discountedPricePerKg).toFixed(2));

  const machineCost =
    safeMachine === 'volautomaat'
      ? 69
      : safeMachine === 'piston'
      ? 165
      : safeMachine === 'heavy'
      ? 99
      : 0;

  const totalMonthly = Number((totalMonthlyCoffee + machineCost).toFixed(2));
  const costPerCup = estimatedCups > 0 ? Number((totalMonthlyCoffee / estimatedCups).toFixed(3)) : 0;
  const monthlySavings = Number((monthlyKg * basePricePerKg * (discountPct / 100)).toFixed(2));

  return {
    success: true,
    authorized: true,
    status: 'approved',
    calculation: {
      basePricePerKg,
      workingDays,
      estimatedCups,
      monthlyKg,
      discountPct,
      discountedPricePerKg,
      totalMonthlyCoffee,
      machineCost,
      totalMonthly,
      costPerCup,
      monthlySavings,
      recommendedBlend: TASTE_PROFILES[safeProfile],
    },
  };
}
