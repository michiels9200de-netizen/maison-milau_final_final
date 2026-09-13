// ==============================================================================
// MAISON MILAU · SECURE B2B CALCULATOR SERVICE (SERVER-SIDE)
// ==============================================================================

export interface UserProfilePricingContext {
  role?: string | null;
  status?: string | null;
  b2bRole?: string | null;
  b2bStatus?: string | null;
}

export type B2BAccessStatus = 'approved' | 'pending' | 'rejected' | 'b2c' | 'unauthenticated';

export interface B2BAccessDecision {
  hasAccess: boolean;
  status: B2BAccessStatus;
  message?: string;
}

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

export const TASTE_PROFILES = {
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

export function canAccessB2BPricing(
  profile?: UserProfilePricingContext | null
): boolean {
  if (!profile) return false;

  const role = String(profile.role || profile.b2bRole || '').toLowerCase().trim();
  const status = String(profile.status || profile.b2bStatus || '').toLowerCase().trim();

  const isB2B = role === 'b2b' || role === 'b2b_admin' || role === 'b2b_buyer';
  const isAdmin = role === 'admin' || role === 'store_admin';

  if (isAdmin) return true;

  return isB2B && (status === 'approved' || status === 'active');
}

export function getB2BAccessStatus(
  profile?: UserProfilePricingContext | null
): B2BAccessDecision {
  if (!profile) {
    return {
      hasAccess: false,
      status: 'unauthenticated',
      message: 'Gelieve in te loggen om de B2B calculator te raadplegen.',
    };
  }

  return {
    hasAccess: true,
    status: 'approved',
  };
}

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

  const safePeopleCount = Math.max(1, Math.min(1000, Number(input.peopleCount) || 15));
  const safeCupsPerPerson = Math.max(0.5, Math.min(10, Number(input.cupsPerPersonPerDay) || 2.5));
  const safeSetting = input.settingType || 'kantoor';
  const safeProfile = (input.tasteProfile in TASTE_PROFILES) ? input.tasteProfile : 'toegankelijk';
  const safeMachine = input.machineOption || 'beans_only';

  const basePricePerKg = 24.95;

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
  const monthlyKg = Math.max(5, Math.ceil(estimatedCups / 125));

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
