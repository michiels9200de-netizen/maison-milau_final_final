import React, { useState } from 'react';
import { Building2, Calculator, Coffee, CheckCircle, ArrowRight, Sparkles, Send, Gift, Layers } from 'lucide-react';
import { CONFIG } from '../config';
import { MediaPlaceholder } from '../components/MediaPlaceholder';

interface B2BPageProps {
  navigate: (path: string) => void;
}

export const B2BPage: React.FC<B2BPageProps> = ({ navigate }) => {
  // Calculator State
  const [settingType, setSettingType] = useState<'kantoor' | 'horeca' | 'residentieel' | 'evenement'>('kantoor');
  const [peopleCount, setPeopleCount] = useState<number>(15);
  const [cupsPerPersonPerDay, setCupsPerPersonPerDay] = useState<number>(2.5);
  const [tasteProfile, setTasteProfile] = useState<'krachtig' | 'toegankelijk' | 'gebalanceerd' | 'exclusief'>('toegankelijk');
  const [machineOption, setMachineOption] = useState<string>('beans_only');

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    sector: 'Kantoor / Bedrijf',
    machineNeed: 'Enkel verse specialty koffiebonen (wij hebben al een machine)',
    notes: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState<string>('');

  // Dynamic calculations based strictly on Milau Budget pricing (€19.95 / kg)
  const basePricePerKg = 19.95; // Based on Milau Budget Blend
  const workingDays = settingType === 'horeca' ? 26 : settingType === 'evenement' ? 12 : 22;
  const estimatedCups = Math.round(peopleCount * cupsPerPersonPerDay * workingDays);
  // 8g of coffee per cup = 125 cups per kg
  const calculatedKg = Math.max(5, Math.ceil((estimatedCups / 125)));
  const monthlyKg = calculatedKg;

  // B2B discount ladder:
  // < 10 kg: 10%
  // 10 to 15 kg: 12%
  // 15 to 30 kg: 15%
  // 30 to 50 kg: 18%
  // > 50 kg: 20%
  let discountPct = 10;
  if (monthlyKg >= 50) discountPct = 20;
  else if (monthlyKg >= 30) discountPct = 18;
  else if (monthlyKg >= 15) discountPct = 15;
  else if (monthlyKg >= 10) discountPct = 12;

  const discountedPricePerKg = basePricePerKg * (1 - discountPct / 100);
  const totalMonthlyCoffee = monthlyKg * discountedPricePerKg;
  const machineCost =
    machineOption === 'volautomaat' ? 69 : machineOption === 'piston' ? 165 : machineOption === 'heavy' ? 99 : 0;
  const totalMonthly = totalMonthlyCoffee + machineCost;
  const costPerCup = totalMonthlyCoffee / estimatedCups;
  const monthlySavings = monthlyKg * basePricePerKg * (discountPct / 100);

  // Dynamic profile recommendation
  const profileDetails = {
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
      name: 'Milau Selection Blend',
      notes: 'Complexe tonen van steenvruchten en verfijnde citrus. Voor kenners en specialty bars.',
      beans: 'Milau Selection Daily (SCA 86+)',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch('/api/b2b-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyVolumeKg: monthlyKg,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormFeedback(result.message);
      } else {
        setFormStatus('error');
        setFormFeedback(result.error || 'Er is een fout opgetreden.');
      }
    } catch {
      setFormStatus('error');
      setFormFeedback('Kon geen verbinding maken met de server.');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-stone-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200/80">
                <Building2 className="w-3.5 h-3.5 text-amber-800" />
                <span>Formules & Tarieven op Maat</span>
              </div>
              {/* H1: 48-64px, font-weight 700 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 mb-4">
                Koffieformules voor Thuis & Onderneming
              </h1>
              {/* Body: 16-18px, font-weight 400, line-height 1.6 */}
              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed mb-6">
                Flexibele maandabonnementen, aantrekkelijke volumetarieven en unieke custom roasting & white label branding voor horeca en bedrijven.
              </p>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                <div>
                  <strong>Geschikt voor:</strong> Horeca (brasseries, restaurants, koffiebars), Kantoren, Bedrijven, Handelszaken & Residentiële centra.
                </div>
                <div>
                  <strong>BTW Facturatie:</strong> {CONFIG.vatNumber} (Maandelijkse verzamelfactuur met 6% BTW op koffiebonen en 21% op apparatuur/diensten).
                </div>
              </div>
            </div>

            {/* 1 FOTO OP B2B PAGE (MediaPlaceholder) */}
            <div className="lg:col-span-5">
              <MediaPlaceholder
                type="image"
                badgeText="B2B & Kantoorbeleving"
                title="Professionele Koffiecorner & Horeca Espressomachine"
                subtitle="Beeld van een moderne bedrijfsbarista-corner en professionele espressomachine met vers gebrande Maison Milau bonen."
                recommendedSize="1920 × 1280 (16:9 of 4:3)"
                aspectRatio="video"
                className="shadow-sm border-stone-200 min-h-[300px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Interactive B2B Calculator Section */}
        <section className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactieve Calculator (indicatief)</span>
            </div>
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Bereken uw B2B Prijs (indicatief)
            </h2>
            <p className="text-base text-stone-500 mt-1">
              Bereken uw maandelijkse koffiebehoefte, geschat aantal kopjes en staffelkorting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              {/* Setting Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  1. Type Onderneming / Setting:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'kantoor', label: 'Kantoor / Bedrijf', sub: '22 werkdagen' },
                    { id: 'horeca', label: 'Horeca Zaak / Café', sub: '26 dagen per mnd' },
                    { id: 'residentieel', label: 'Residentiële Voorziening', sub: 'Zorg & Co-living' },
                    { id: 'evenement', label: 'Evenement / Pop-up', sub: 'Flexibele periode' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSettingType(s.id as any);
                        setFormData((prev) => ({ ...prev, sector: s.label }));
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settingType === s.id
                          ? 'border-amber-900 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-900'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div>{s.label}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{s.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* People and Daily Cups */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                    <span>Aantal personen / gasten</span>
                    <span className="text-sm font-bold text-amber-900">{peopleCount} pers.</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full accent-amber-900 h-2 bg-stone-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>5</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                    <span>Kopjes per persoon/dag</span>
                    <span className="text-sm font-bold text-amber-900">{cupsPerPersonPerDay} koppen</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={cupsPerPersonPerDay}
                    onChange={(e) => setCupsPerPersonPerDay(Number(e.target.value))}
                    className="w-full accent-amber-900 h-2 bg-stone-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>1 kop</span>
                    <span>2.5 koppen</span>
                    <span>5 koppen</span>
                  </div>
                </div>
              </div>

              {/* Taste Profile with dynamic suggestions */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  2. Gewenst Smaak- & Koffieprofiel:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'krachtig', label: 'Krachtig & Chocolade', desc: 'Intens, donkere cacao, stevige body' },
                    { id: 'toegankelijk', label: 'Toegankelijk & Nootachtig', desc: 'Rond, melkchocolade, allemansvriend' },
                    { id: 'gebalanceerd', label: 'Gebalanceerd & Zacht', desc: 'Lichte hazelnoot, zuivere afdronk' },
                    { id: 'exclusief', label: 'Exclusief Specialty', desc: 'SCA 86+ complexiteit, fruittoetsen' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTasteProfile(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        tasteProfile === p.id
                          ? 'border-amber-900 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-900'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs">{p.label}</div>
                      <div className="text-[10px] text-stone-500 font-normal leading-tight mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Dynamic Blend Recommendation Pill */}
                <div className="mt-2.5 p-3 bg-amber-100/70 border border-amber-300/80 rounded-xl flex items-start gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950">
                    <span className="font-bold">Aanbevolen Blend: </span>
                    <span className="underline decoration-amber-900/40 font-semibold">{profileDetails[tasteProfile].name}</span>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">{profileDetails[tasteProfile].notes}</p>
                  </div>
                </div>
              </div>

              {/* Machine Lease Option */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  3. Machinelease Optie (optioneel):
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="machine"
                      checked={machineOption === 'beans_only'}
                      onChange={() => setMachineOption('beans_only')}
                      className="accent-amber-900"
                    />
                    <div>
                      <span className="font-semibold text-stone-800">
                        Enkel verse koffiebonen (+€0 / mnd)
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Wij beschikken reeds over een eigen machine of leasen elders.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="machine"
                      checked={machineOption === 'volautomaat'}
                      onChange={() => setMachineOption('volautomaat')}
                      className="accent-amber-900"
                    />
                    <div>
                      <span className="font-semibold text-stone-800">
                        Compacte Office Bean-to-Cup Volautomaat (+€69 / mnd)
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Tot 40 koppen per dag. One-touch espresso, lungo en warm water.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="machine"
                      checked={machineOption === 'heavy'}
                      onChange={() => setMachineOption('heavy')}
                      className="accent-amber-900"
                    />
                    <div>
                      <span className="font-semibold text-stone-800">
                        High-Capacity Professionele Volautomaat (+€99 / mnd)
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Tot 120 koppen per dag. Dubbele uitloop, verse melkopschuimer, vaste wateraansluiting.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="machine"
                      checked={machineOption === 'piston'}
                      onChange={() => setMachineOption('piston')}
                      className="accent-amber-900"
                    />
                    <div>
                      <span className="font-semibold text-stone-800">
                        Traditionele 2-Groeps Horeca Espressomachine (+€165 / mnd)
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Voor restaurants, bars en brasseries inclusief professionele on-demand molen.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Indicatieve B2B Berekening
                </div>
                <div className="text-[11px] text-stone-400">
                  Basis: Milau Budget (€{basePricePerKg.toFixed(2)}/kg)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-800 text-xs">
                <div>
                  <div className="text-stone-400">Geschat aantal kopjes / mnd</div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    ~{estimatedCups} kopjes
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Benodigd bonenvolume:</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">
                    {monthlyKg} kg / maand
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 py-1">
                <div className="flex justify-between">
                  <span>Aanbevolen blend:</span>
                  <span className="font-semibold text-amber-200">{profileDetails[tasteProfile].name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uw B2B bonenprijs:</span>
                  <span className="font-semibold text-white">€{discountedPricePerKg.toFixed(2)} / kg (excl. btw)</span>
                </div>
                <div className="flex justify-between">
                  <span>Toegepaste staffelkorting:</span>
                  <span className="font-semibold text-emerald-400">-{discountPct}% korting</span>
                </div>
                <div className="flex justify-between">
                  <span>Kostprijs per kopje specialty koffie:</span>
                  <span className="font-bold text-amber-300 text-sm">€{costPerCup.toFixed(2)} per kop</span>
                </div>
                <div className="flex justify-between">
                  <span>Uw maandelijkse besparing:</span>
                  <span className="font-semibold text-emerald-400">€{monthlySavings.toFixed(2)} / maand</span>
                </div>
              </div>

              {/* Service Always Free Notice */}
              <div className="p-3.5 bg-amber-950/80 rounded-xl border border-amber-700/80 text-xs text-amber-100 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SERVICE IS ALTIJD 100% GRATIS & INBEGREPEN</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Geen voorrijkosten, all-in preventief onderhoud, periodieke ontkalking en gratis wisselmachine binnen 24 uur bij storing. Geen verborgen kosten.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <div>
                  <div className="text-sm font-medium text-stone-300">Totaal maandelijks:</div>
                  <div className="text-[11px] text-stone-400">Koffie + gekozen apparatuur</div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-100">
                  €{totalMonthly.toFixed(2)}{' '}
                  <span className="text-xs text-stone-400 font-normal">/ mnd</span>
                </div>
              </div>

              <a
                href="#b2b-form"
                className="w-full mt-2 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-center block transition-colors shadow-xs"
              >
                Vraag B2B Voorstel aan voor {peopleCount} personen
              </a>
            </div>
          </div>
        </section>

        {/* Gratis Proefpakket & Bonenlevering */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                <Gift className="w-5 h-5" />
              </div>
              {/* H3: 24-28px, font-weight 600 */}
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                Gratis Proefpakket & Cupping
              </h3>
              <p className="text-base text-stone-600 font-normal leading-relaxed">
                We komen vrijblijvend langs in uw zaak of kantoor voor een smaaktest op maat van uw team of gasten. Of vraag een gratis proefpakket aan via onderstaand formulier.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="#b2b-form"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
              >
                <span>Proefpakket aanvragen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              {/* H3: 24-28px, font-weight 600 */}
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                02 Bonenlevering
              </h3>
              <p className="text-base text-stone-600 font-normal leading-relaxed mb-3">
                Stipt geleverd elke 2 weken of maandelijks, naar wens, op factuur met gunstige B2B volumetarieven en persoonlijke opvolging door onze brander.
              </p>
              <ul className="text-xs text-stone-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1kg aromadichte ventielzakken</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Gratis levering regio Dendermonde/Aalst</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Custom Roasting & White Label Section */}
        <section className="bg-stone-100 p-8 rounded-2xl border border-stone-200">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Layers className="w-4 h-4" />
              <span>Custom Roasting & White Label</span>
            </div>
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-3">
              Persoonlijke koffie labels op maat
            </h2>
            <p className="text-base text-stone-700 font-normal leading-relaxed mb-4">
              Voor horeca, bedrijven en speciaalzaken ontwikkelen we een eigen exclusief brandprofiel en leveren we zakken bedrukt met jullie eigen logo en branding.
            </p>
            <ul className="text-xs text-stone-700 space-y-1.5 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cupping en tasting sessions ter plaatse of in ons Atelier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Eigen blendverhoudingen met volledige herkomsttransparantie</span>
              </li>
            </ul>
            <a
              href="#b2b-form"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <span>Neem contact op voor White Label and custom roasting solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* B2B Contact & Quote Request Form */}
        <section id="b2b-form" className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Vraag een B2B Voorstel of Gratis Proefpakket aan
            </h2>
            <p className="text-base text-stone-500 mt-1">
              Vul onderstaand formulier in en we bezorgen u binnen 24u een voorstel op maat van uw onderneming.
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm">
              <div className="font-bold mb-1">Aanvraag succesvol ontvangen!</div>
              <p>{formFeedback}</p>
              <button
                onClick={() => setFormStatus('idle')}
                className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Nieuwe aanvraag indienen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">
                  {formFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bedrijfsnaam *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="Mijn Bedrijf BV"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    BTW-nummer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vatNumber}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="BE 0123.456.789"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contactpersoon *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="Voornaam + Achternaam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    E-mailadres voor facturen & offerte *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="info@uwbedrijf.be"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Telefoonnummer *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="+32 ..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sector / Type onderneming
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    <option>Horeca / Restaurant / Café / Koffiebar</option>
                    <option>Kantoor / Bedrijfsruimte (10 - 50 medewerkers)</option>
                    <option>Grote onderneming (50+ medewerkers)</option>
                    <option>Winkel / Concept store / Traiteur</option>
                    <option>Evenementenlocatie / Zaalverhuur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Apparatuurbehoefte
                </label>
                <select
                  value={formData.machineNeed}
                  onChange={(e) => setFormData({ ...formData, machineNeed: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                >
                  <option>Enkel verse specialty koffiebonen (wij hebben al een machine)</option>
                  <option>Bonen + Professionele volautomaat gewenst</option>
                  <option>Bonen + Traditionele pistonmachine (horeca) gewenst</option>
                  <option>Ik wil graag een gratis proefpakket ontvangen</option>
                  <option>Interesse in White Label / Eigen blend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Specifieke wensen of opmerkingen
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  placeholder="Bijvoorbeeld: geschatte consumptie per dag, voorkeur voor smaakprofiel of aanvraag bezoek ter plaatse..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{formStatus === 'submitting' ? 'Verzenden...' : 'Verstuur B2B Aanvraag'}</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
