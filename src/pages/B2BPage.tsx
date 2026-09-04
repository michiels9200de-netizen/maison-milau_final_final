import React, { useState } from 'react';
import { Building2, Calculator, Coffee, CheckCircle, ArrowRight, Sparkles, Send, Gift, Layers } from 'lucide-react';
import { CONFIG } from '../config';

interface B2BPageProps {
  navigate: (path: string) => void;
}

export const B2BPage: React.FC<B2BPageProps> = ({ navigate }) => {
  // Calculator State
  const [monthlyKg, setMonthlyKg] = useState<number>(15);
  const [machineOption, setMachineOption] = useState<string>('beans_only');

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    sector: 'Horeca / Restaurant / Café / Koffiebar',
    machineNeed: 'Enkel verse specialty koffiebonen (wij hebben al een machine)',
    notes: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState<string>('');

  // Indicative calculations
  // Average 8g of coffee per cup = ~125 cups per kg
  const estimatedCups = monthlyKg * 125;
  const basePricePerKg = 28.0; // Base reference price for specialty blend

  // B2B discount ladder strictly following instructions:
  // < 5 kg: 10%
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
    machineOption === 'volautomaat' ? 95 : machineOption === 'piston' ? 180 : 0;
  const totalMonthly = totalMonthlyCoffee + machineCost;
  const costPerCup = totalMonthlyCoffee / estimatedCups;
  const monthlySavings = monthlyKg * basePricePerKg * (discountPct / 100);

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
      <section className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Formules & Tarieven op Maat</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 mb-4">
              Koffieformules voor Thuis & Onderneming
            </h1>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base mb-6">
              Flexibele maandabonnementen, aantrekkelijke volumetarieven en unieke custom roasting & white label branding.
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Interactive B2B Calculator Section */}
        <section className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactiële Calculator (indicative)</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Bereken uw B2B Prijs (indicatief)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Bereken uw maandelijkse koffiebehoefte, geschat aantal kopjes en volumekorting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                  <span>Maandelijks volume</span>
                  <span className="text-sm font-bold text-amber-900">{monthlyKg} kg per maand</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={monthlyKg}
                  onChange={(e) => setMonthlyKg(Number(e.target.value))}
                  className="w-full accent-amber-900 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>5 kg</span>
                  <span>25 kg</span>
                  <span>50 kg</span>
                  <span>100 kg</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-stone-700 mb-2">
                  Machine & Apparatuur Formule
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMachineOption('beans_only')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      machineOption === 'beans_only'
                        ? 'border-amber-900 bg-amber-50/70 font-semibold text-amber-950'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>Enkel bonen</div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">Eigen machine</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMachineOption('volautomaat')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      machineOption === 'volautomaat'
                        ? 'border-amber-900 bg-amber-50/70 font-semibold text-amber-950'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>Kantoor Volautomaat</div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">+ €95/mnd lease</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMachineOption('piston')}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      machineOption === 'piston'
                        ? 'border-amber-900 bg-amber-50/70 font-semibold text-amber-950'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>Horeca Pistonmachine</div>
                    <div className="text-[10px] text-stone-500 font-normal mt-0.5">+ €180/mnd lease</div>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">Inclusief:</span> 1kg aromadichte ventielzakken, gratis levering regio Dendermonde, Wetteren en Aalst, stipt elke 2 of 4 weken.
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Indicatieve Berekening
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-800 text-xs">
                <div>
                  <div className="text-stone-400">Geschat aantal kopjes per maand</div>
                  <div className="text-xl font-bold font-serif text-white mt-0.5">
                    ~{estimatedCups} kopjes
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Kostprijs per kopje:</div>
                  <div className="text-xl font-bold font-serif text-amber-300 mt-0.5">
                    €{costPerCup.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 py-2">
                <div className="flex justify-between">
                  <span>Uw B2B prijs per kg:</span>
                  <span className="font-semibold text-white">€{discountedPricePerKg.toFixed(2)} / kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Toegepaste volumekorting:</span>
                  <span className="font-semibold text-emerald-400">-{discountPct}% korting</span>
                </div>
                <div className="flex justify-between">
                  <span>Uw maandelijkse besparing:</span>
                  <span className="font-semibold text-emerald-400">€{monthlySavings.toFixed(2)} / maand</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-between items-baseline">
                <div className="text-sm font-medium text-stone-300">Totaal maandelijks:</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-100">
                  €{totalMonthly.toFixed(2)}{' '}
                  <span className="text-xs text-stone-400 font-normal">/ mnd</span>
                </div>
              </div>

              <a
                href="#b2b-form"
                className="w-full mt-4 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-center block transition-colors shadow-xs"
              >
                Vraag Offerte aan
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
              <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                Gratis Proefpakket & Cupping
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
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
              <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                02 Bonenlevering
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
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
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-3">
              Persoonlijke koffie labels op maat
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed mb-4">
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
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              <span>Neem contact op voor White Label and custom roasting solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* B2B Contact & Quote Request Form */}
        <section id="b2b-form" className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h3 className="font-serif text-2xl font-semibold text-stone-900">
              Vraag een B2B Voorstel of Gratis Proefpakket aan
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Vul onderstaand formulier in en we bezorgen u binnen 24u een voorstel op maat van uw onderneming.
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm">
              <div className="font-bold mb-1">Aanvraag succesvol ontvangen!</div>
              <p>{formFeedback}</p>
              <button
                onClick={() => setFormStatus('idle')}
                className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-medium"
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
                    Bedrijfsnaam / Horecazaak *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="bijv. Brasserie De Markt"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    BTW-nummer
                  </label>
                  <input
                    type="text"
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
                    placeholder="Voornaam en Achternaam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="naam@uwbedrijf.be"
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
                    Sector / Type zaak
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    <option>Horeca / Restaurant / Café / Koffiebar</option>
                    <option>Kantoor / Bedrijfsruimte</option>
                    <option>Handelszaak / Boetiek / Kapper</option>
                    <option>Residentieel centrum / Zorginstelling/Overige</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Machine & Behoefte
                </label>
                <select
                  value={formData.machineNeed}
                  onChange={(e) => setFormData({ ...formData, machineNeed: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                >
                  <option>Enkel verse specialty koffiebonen (wij hebben al een machine)</option>
                  <option>Koffiebonen + Volautomaat bonenmachine (Kantoor)</option>
                  <option>Koffiebonen + Professionele traditionele pistonmachine (Horeca)</option>
                  <option>Enkel gratis proefpakket aanvragen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Eventuele vragen of opmerkingen
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  placeholder="Laat ons weten hoeveel kopjes per dag u zet of wat uw specifieke wensen zijn..."
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
