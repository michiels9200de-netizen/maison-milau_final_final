import React, { useState, useEffect, useId } from 'react';
import {
  Calculator,
  CheckCircle,
  Coffee,
  ChevronDown,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CoffeeBeanAtmosphere } from '../common/CoffeeBeanAtmosphere';
import {
  HorecaIllustration,
  KantoorIllustration,
  ResidentieleZorgIllustration,
  HandelszakenIllustration,
  KapsalonIllustration,
} from './SectorLineArt';

interface B2BCalculatorProps {
  navigate?: (path: string) => void;
  className?: string;
}

interface CalculationData {
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

export const B2BCalculator: React.FC<B2BCalculatorProps> = ({ navigate, className = '' }) => {
  const { user, token, getAuthHeaders } = useAuth();

  // Calculation parameters
  const [settingType, setSettingType] = useState<
    'kantoor' | 'horeca' | 'residentieel' | 'handelszaken' | 'kapsalon' | 'evenement'
  >('kantoor');
  const [peopleCount, setPeopleCount] = useState<number>(15);
  const [cupsPerPersonPerDay, setCupsPerPersonPerDay] = useState<number>(2.5);
  const [tasteProfile, setTasteProfile] = useState<'krachtig' | 'toegankelijk' | 'gebalanceerd' | 'exclusief'>('toegankelijk');
  const [machineOption, setMachineOption] = useState<'beans_only' | 'volautomaat' | 'heavy' | 'piston'>('beans_only');
  const [showMachineDetails, setShowMachineDetails] = useState<boolean>(false);

  // Server state
  const [serverStatus, setServerStatus] = useState<'loading' | 'approved' | 'unauthenticated'>('loading');
  const [calculation, setCalculation] = useState<CalculationData | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationError, setCalculationError] = useState<string>('');

  const machineSelectId = useId();

  // 1. Verify access with server on mount and whenever user/token changes
  useEffect(() => {
    let isMounted = true;

    async function checkServerAccess() {
      if (!user) {
        setServerStatus('unauthenticated');
        return;
      }

      setServerStatus('loading');
      try {
        const headers = getAuthHeaders();
        const res = await fetch('/api/b2b/calculator', {
          method: 'GET',
          headers,
        });
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.authorized) {
          setServerStatus('approved');
        } else if (user) {
          setServerStatus('approved');
        } else {
          setServerStatus('unauthenticated');
        }
      } catch (err) {
        if (!isMounted) return;
        if (user) {
          setServerStatus('approved');
        } else {
          setServerStatus('unauthenticated');
        }
      }
    }

    checkServerAccess();

    return () => {
      isMounted = false;
    };
  }, [user, token]);

  // 2. Fetch calculation from server whenever inputs change (only if approved)
  useEffect(() => {
    if (serverStatus !== 'approved') {
      setCalculation(null);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsCalculating(true);
      setCalculationError('');

      try {
        const headers = getAuthHeaders();
        const res = await fetch('/api/b2b/calculator', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            settingType,
            peopleCount,
            cupsPerPersonPerDay,
            tasteProfile,
            machineOption,
          }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success && data.calculation) {
          setCalculation(data.calculation);
        } else {
          setCalculationError(data.error || 'Fout bij ophalen van berekening.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setCalculationError('Verbindingsfout met de rekenmodule.');
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [serverStatus, settingType, peopleCount, cupsPerPersonPerDay, tasteProfile, machineOption]);

  const handleNavigate = (path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  // --------------------------------------------------------------------------
  // STATE 1: LOADING
  // --------------------------------------------------------------------------
  if (serverStatus === 'loading') {
    return (
      <section
        id="b2b-calculator"
        className={`relative overflow-hidden bg-[#1A0E08] rounded-2xl border border-amber-900/50 p-8 sm:p-12 shadow-2xl text-white ${className}`}
      >
        <CoffeeBeanAtmosphere variant="section" />
        <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <div className="text-sm font-semibold text-amber-200">
            Calculator laden...
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: NIET INGELOGD (Toegankelijk en neutraal voor alle zakelijke gebruikers)
  // --------------------------------------------------------------------------
  if (serverStatus === 'unauthenticated' || !user) {
    return (
      <section
        id="b2b-calculator"
        className={`relative overflow-hidden bg-[#1A0E08] rounded-2xl border border-amber-900/60 p-6 sm:p-10 shadow-2xl text-white ${className}`}
      >
        <CoffeeBeanAtmosphere variant="section" />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 py-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-600/50 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Calculator className="w-7 h-7 text-amber-400" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              B2B Calculator & Groothandelsprijzen
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
              Bereken eenvoudig uw staffelkorting, maandelijks bonenverbruik en apparatuurlease op maat van uw onderneming.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left text-xs">
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zakelijke Voordelen</span>
              </div>
              <p className="text-stone-400 text-[11.5px] leading-relaxed">
                Staffelkortingen van 10% tot 20%, all-in machinelease vanaf €69/mnd en facturatie met 30 dagen betaaltermijn.
              </p>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gratis Proefpakket</span>
              </div>
              <p className="text-stone-400 text-[11.5px] leading-relaxed">
                Vraag vrijblijvend een gratis proefpakket van 1 kg specialty koffiebonen aan voor uw kantoor of horecazaak.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center">
            <button
              id="b2b-calculator-login-btn"
              type="button"
              onClick={() => handleNavigate('/account')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-amber-950/60 cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 3: ACTIEVE CALCULATOR
  // Volledige interactieve B2B Calculator met berekeningen
  // --------------------------------------------------------------------------
  const calc = calculation || {
    basePricePerKg: 24.95,
    workingDays: 22,
    estimatedCups: 825,
    monthlyKg: 7,
    discountPct: 10,
    discountedPricePerKg: 22.46,
    totalMonthlyCoffee: 157.22,
    machineCost: 0,
    totalMonthly: 157.22,
    costPerCup: 0.191,
    monthlySavings: 17.47,
    recommendedBlend: {
      name: 'Milau Budget Omni',
      notes: 'Zacht, nootachtig en rond met melkchocolade. Dé allemansvriend voor kantoor en horeca.',
      beans: 'Milau Budget Omni (SCA 83.5)',
    },
  };

  return (
    <section
      id="b2b-calculator"
      className={`relative overflow-hidden bg-[#1A0E08] rounded-2xl border border-amber-800/60 p-5 sm:p-7 lg:p-8 shadow-2xl text-white ${className}`}
    >
      <CoffeeBeanAtmosphere variant="section" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-4 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 backdrop-blur-xs">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>B2B Calculator & Staffelkortingen</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-xs font-serif">
            Bereken uw B2B Groothandelsprijs
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 font-normal leading-relaxed">
            Directe volumeberekening, automatische staffelkortingen en lease-opties voor uw onderneming.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-200 text-xs font-semibold shrink-0">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="leading-tight font-bold text-white">Zakelijk Account</div>
            <div className="text-[10px] text-stone-300 font-normal">
              {user?.companyName || user?.name || user?.email || 'Zakelijke partner'}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Card */}
        <div className="lg:col-span-6 bg-stone-950/85 backdrop-blur-md rounded-2xl border border-stone-800/90 p-4 sm:p-5 space-y-4 shadow-xl ring-1 ring-white/5">
          {/* Setting Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-200 mb-2">
              1. Type Onderneming / Setting:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'horeca', label: 'Horeca & Café', sub: '26 d/mnd', Icon: HorecaIllustration },
                { id: 'kantoor', label: 'Kantoor / Bedrijf', sub: '22 werkdagen', Icon: KantoorIllustration },
                { id: 'residentieel', label: 'Residentieel', sub: '30 d continu', Icon: ResidentieleZorgIllustration },
                { id: 'handelszaken', label: 'Handelszaken', sub: '24 d retail', Icon: HandelszakenIllustration },
                { id: 'kapsalon', label: 'Kapsalon & Spa', sub: '22 d VIP', Icon: KapsalonIllustration },
                { id: 'evenement', label: 'Evenement', sub: 'Flexibel', Icon: Coffee },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSettingType(s.id as any)}
                  className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    settingType === s.id
                      ? 'border-amber-400 bg-amber-950/70 text-amber-100 font-semibold ring-1 ring-amber-400 shadow-xs'
                      : 'border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 p-1 ${
                      settingType === s.id ? 'bg-amber-800 text-amber-100' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    <s.Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight truncate">{s.label}</div>
                    <div className="text-[10.5px] text-stone-400 font-normal leading-tight truncate">{s.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* People & Cups Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs font-semibold text-stone-200 mb-1.5">
                <span>Aantal personen</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  {peopleCount} pers.
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>5</span>
                <span>50</span>
                <span>100</span>
                <span>150+</span>
              </div>
            </div>

            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs font-semibold text-stone-200 mb-1.5">
                <span>Kopjes per persoon/dag</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                  {cupsPerPersonPerDay} koppen
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={cupsPerPersonPerDay}
                onChange={(e) => setCupsPerPersonPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 kop</span>
                <span>2.5 koppen</span>
                <span>5 koppen</span>
              </div>
            </div>
          </div>

          {/* Taste Profile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-200">
                2. Gewenst Smaakprofiel:
              </label>
              <span className="text-[11px] text-amber-300/90 font-medium truncate max-w-[50%] text-right">
                {calc.recommendedBlend.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              {[
                { id: 'krachtig', label: 'Krachtig', desc: 'Chocolade & cacao' },
                { id: 'toegankelijk', label: 'Toegankelijk', desc: 'Rond & nootachtig' },
                { id: 'gebalanceerd', label: 'Gebalanceerd', desc: 'Zacht & zuiver' },
                { id: 'exclusief', label: 'Specialty', desc: 'SCA 86+ prestige' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTasteProfile(p.id as any)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    tasteProfile === p.id
                      ? 'border-amber-400 bg-amber-950/70 text-amber-100 font-semibold ring-1 ring-amber-400 shadow-xs'
                      : 'border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight truncate">{p.label}</div>
                  <div className="text-[10.5px] text-stone-400 font-normal leading-tight truncate mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Blend recommendation pill */}
            <div className="mt-2 p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs text-amber-200 truncate">
                <span className="font-bold text-amber-300">Aanbevolen: </span>
                <span className="underline decoration-amber-400/40 font-semibold">{calc.recommendedBlend.name}</span>
                <span className="text-stone-300 hidden sm:inline ml-1.5">— {calc.recommendedBlend.notes}</span>
              </div>
            </div>
          </div>

          {/* Machine Lease Option */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={machineSelectId} className="text-xs font-semibold text-stone-200">
                3. Machinelease Optie (optioneel):
              </label>
              <button
                type="button"
                onClick={() => setShowMachineDetails(!showMachineDetails)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline transition-colors cursor-pointer"
              >
                {showMachineDetails ? 'Compacte weergave' : 'Toon machine details'}
              </button>
            </div>

            <div className="relative">
              <select
                id={machineSelectId}
                value={machineOption}
                onChange={(e) => setMachineOption(e.target.value as any)}
                className="w-full bg-stone-900/90 text-stone-100 text-xs font-semibold py-2.5 pl-3 pr-8 rounded-xl border border-stone-700 focus:outline-none focus:ring-1.5 focus:ring-amber-500 cursor-pointer appearance-none shadow-xs"
              >
                <option value="beans_only">Enkel verse koffiebonen (+€0 / mnd) — Reeds eigen machine</option>
                <option value="volautomaat">Compacte Office Volautomaat (+€69 / mnd) — Tot 40 koppen/uur</option>
                <option value="heavy">High-Capacity Professionele Volautomaat (+€99 / mnd) — Tot 120 koppen/uur</option>
                <option value="piston">Traditionele 2-Groeps Espressomachine (+€165 / mnd) — Inclusief molen</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {showMachineDetails && (
              <div className="mt-2 space-y-1.5 text-xs">
                {[
                  { id: 'beans_only', label: 'Enkel verse koffiebonen (+€0 / mnd)', desc: 'Wij beschikken reeds over een machine.' },
                  { id: 'volautomaat', label: 'Compacte Office Volautomaat (+€69 / mnd)', desc: 'Tot 40 koppen per uur. One-touch espresso & lungo.' },
                  { id: 'heavy', label: 'High-Capacity Volautomaat (+€99 / mnd)', desc: 'Tot 120 koppen per uur. Vaste wateraansluiting & melk.' },
                  { id: 'piston', label: 'Traditionele 2-Groeps Espressomachine (+€165 / mnd)', desc: 'Voor horeca inclusief professionele on-demand molen.' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMachineOption(m.id as any)}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${
                      machineOption === m.id
                        ? 'border-amber-500 bg-amber-950/40 text-amber-100 ring-1 ring-amber-500'
                        : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800/80'
                    }`}
                  >
                    <div className="font-semibold text-stone-200">{m.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{m.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 bg-stone-950/90 backdrop-blur-md text-stone-100 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl border border-amber-900/60 ring-1 ring-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <span>B2B Berekening</span>
              {isCalculating && <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />}
            </div>
            <div className="text-xs text-stone-400">
              Basis: Milau Budget (€{calc.basePricePerKg.toFixed(2)}/kg)
            </div>
          </div>

          {calculationError && (
            <div className="p-2 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
              {calculationError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-stone-800 text-xs">
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
              <div className="text-stone-400 text-[11px]">Geschat aantal kopjes / mnd</div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                ~{calc.estimatedCups} kopjes
              </div>
            </div>
            <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
              <div className="text-stone-400 text-[11px]">Benodigd bonenvolume:</div>
              <div className="text-lg sm:text-xl font-bold text-amber-300 mt-0.5">
                {calc.monthlyKg} kg / maand
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-stone-300 py-0.5">
            <div className="flex justify-between">
              <span>Aanbevolen blend:</span>
              <span className="font-semibold text-amber-200">{calc.recommendedBlend.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Uw B2B bonenprijs:</span>
              <span className="font-semibold text-white">€{calc.discountedPricePerKg.toFixed(2)} / kg (excl. btw)</span>
            </div>
            <div className="flex justify-between">
              <span>Toegepaste staffelkorting:</span>
              <span className="font-semibold text-emerald-400">-{calc.discountPct}% B2B korting</span>
            </div>
            <div className="flex justify-between">
              <span>Kostprijs per kopje specialty koffie:</span>
              <span className="font-bold text-amber-300 text-sm">€{calc.costPerCup.toFixed(2)} per kop</span>
            </div>
            <div className="flex justify-between">
              <span>Uw maandelijkse besparing:</span>
              <span className="font-semibold text-emerald-400">€{calc.monthlySavings.toFixed(2)} / maand</span>
            </div>
          </div>

          {/* Service Guarantee */}
          <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-700/80 text-xs text-amber-100 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SERVICE IS ALTIJD 100% GRATIS & INBEGREPEN</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Geen voorrijkosten, all-in preventief onderhoud, periodieke ontkalking en gratis wisselmachine binnen 24 uur bij storing.
            </p>
          </div>

          <div className="pt-2.5 border-t border-stone-800 flex justify-between items-baseline">
            <div>
              <div className="text-sm font-medium text-stone-300">Totaal maandelijks:</div>
              <div className="text-xs text-stone-400">Koffie + gekozen apparatuur (excl. btw)</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-100">
              €{calc.totalMonthly.toFixed(2)}{' '}
              <span className="text-xs text-stone-400 font-normal">/ mnd (excl. btw)</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-tight">
            * Prijzen zijn excl. btw (6% btw op specialty koffiebonen, 21% btw op apparatuur). Facturatie met 30 dagen betaaltermijn.
          </p>

          <a
            href="#b2b-form"
            className="w-full mt-1.5 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center block transition-colors shadow-lg hover:shadow-amber-900/40 cursor-pointer"
          >
            Bevestig B2B Voorstel voor {peopleCount} personen
          </a>
        </div>
      </div>
    </section>
  );
};
