import React, { useState } from 'react';
import { CalendarCheck, Calculator, Coffee, UserCheck, ShieldCheck, Send, ArrowRight } from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';

interface EventsPageProps {
  navigate: (path: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ navigate }) => {
  // Event Calculator State
  const [guestsCount, setGuestsCount] = useState<number>(80);
  const [durationHours, setDurationHours] = useState<number>(4);
  const [includeMachine, setIncludeMachine] = useState<boolean>(true);
  const [includeBarista, setIncludeBarista] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    eventType: 'Bruiloft / Trouwfeest',
    eventDate: '',
    guestsCount: 80,
    machineRental: 'Ja, dry-hire espressomachine gewenst',
    baristaService: 'Nee, zelfbediening volstaat',
    notes: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState<string>('');

  // Event calculations based on Milau Budget prices (€19.95 / kg)
  const MILAU_BUDGET_PRICE_PER_KG = 19.95;
  const cupsPerGuest = Math.max(1, Math.min(4, durationHours * 0.45));
  const estimatedCups = Math.round(guestsCount * cupsPerGuest);
  const recommendedKg = Number((estimatedCups / 125).toFixed(1));
  const coffeePrice = recommendedKg * MILAU_BUDGET_PRICE_PER_KG;
  const machinePrice = includeMachine ? 75.0 : 0;
  const baristaPrice = includeBarista ? durationHours * 45.0 : 0;
  const estimatedTotal = coffeePrice + machinePrice + baristaPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch('/api/event-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          calculatedBeansKg: recommendedKg,
          estimatedPrice: estimatedTotal,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setFormStatus('success');
        setFormFeedback(res.message);
      } else {
        setFormStatus('error');
        setFormFeedback(res.error || 'Er is een fout opgetreden.');
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
                <CalendarCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Events & Verhuur</span>
              </div>
              {/* H1: 48-64px, font-weight 700 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 mb-4">
                Koffiecatering & Apparatuur
              </h1>
              {/* Body: 16-18px, font-weight 400, line-height 1.6 */}
              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed mb-8">
                Geef uw gasten een onvergetelijke koffie-ervaring. Van compacte espressomachines voor een intiem tuinfeest of trouwfeest tot complete mobiele barista-bars voor grote beurzen en congressen.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#event-form"
                  className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Neem contact op voor all event solutions
                </a>
                <button
                  onClick={() => navigate('/webshop')}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Koffiebonen Direct Kopen
                </button>
              </div>
            </div>

            {/* 1 FOTO BIJ EVENTS VAN EEN BARISTA BAR */}
            <div className="lg:col-span-5">
              <MediaPlaceholder
                type="image"
                badgeText="Barista Bar op Evenement"
                title="Mobiele Barista Bar & Espressomeubel"
                subtitle="Sfeerbeeld van een professionele artisanale koffiebar op locatie (trouwfeest / bedrijfsevenement) met barista en latte art."
                recommendedSize="1920 × 1280 (16:9 of 4:3)"
                aspectRatio="video"
                className="shadow-sm border-stone-200 min-h-[300px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 3 Core Packages */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2">
                Pakket 1
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                Enkel Verse Bonen
              </h3>
              <p className="text-base text-stone-600 font-normal leading-relaxed mb-4">
                U heeft al een machine op locatie? Bestel onze Milau Selection of Barrel Aged bonen, speciaal afgestemd op feestvolumes met verse branddatum.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-stone-900">Vanaf €21,50 / kg</span>
              <button
                onClick={() => navigate('/webshop')}
                className="text-xs text-amber-900 font-semibold hover:underline"
              >
                Bestel bonen →
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2">
                Pakket 2
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                Dry-Hire Machine + Bonen
              </h3>
              <p className="text-base text-stone-600 font-normal leading-relaxed mb-4">
                Huur een gebruiksvriendelijke volautomatische espressomachine of compacte 1-groeps pistonmachine inclusief koffiebonen, suiker en melkkannetjes.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-stone-900">Vanaf €95 / weekend</span>
              <a href="#event-calculator" className="text-xs text-amber-900 font-semibold hover:underline">
                Bereken formule →
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2">
                Pakket 3
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                Full-Service Barista Bar
              </h3>
              <p className="text-base text-stone-600 font-normal leading-relaxed mb-4">
                Complete ontzorging met professionele barista, latte art, specialty bonen, bio melk, havermelk en stijlvol barmeubel voor uw receptie of bedrijfsfeest.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-stone-900">Op maat berekend</span>
              <a href="#event-form" className="text-xs text-amber-900 font-semibold hover:underline">
                Vraag offerte →
              </a>
            </div>
          </div>
        </section>

        {/* Event Planner Calculator */}
        <section id="event-calculator" className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              <Calculator className="w-4 h-4" />
              <span>Event Planner Calculator</span>
            </div>
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Bereken uw Evenement Benodigdheden
            </h2>
            <p className="text-base text-stone-500 mt-1">
              Bereken exact de benodigde hoeveelheid specialty koffiebonen en apparatuur voor uw bruiloft, bedrijfsreceptie of tuinfeest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                  <span>Aantal gasten / aanwezigen</span>
                  <span className="text-sm font-bold text-amber-900">{guestsCount} personen</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={guestsCount}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setGuestsCount(count);
                    setFormData((prev) => ({ ...prev, guestsCount: count }));
                  }}
                  className="w-full accent-amber-900 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-2">
                  <span>Duur van het evenement</span>
                  <span className="text-sm font-bold text-amber-900">{durationHours} uur</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full accent-amber-900 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeMachine}
                    onChange={(e) => setIncludeMachine(e.target.checked)}
                    className="accent-amber-900 w-4 h-4 rounded-sm"
                  />
                  <div>
                    <span className="font-semibold text-stone-800">
                      Inclusief machine-verhuur
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      (volautomaat of compacte professionele machine)
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeBarista}
                    onChange={(e) => setIncludeBarista(e.target.checked)}
                    className="accent-amber-900 w-4 h-4 rounded-sm"
                  />
                  <div>
                    <span className="font-semibold text-stone-800">
                      Inclusief professionele SCA-gecertificeerde barista ter plaatse
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      (latte art & live baristaservice)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculation Results Card */}
            <div className="lg:col-span-6 bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Gecumuleerde Behoefte
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-800 text-xs">
                <div>
                  <div className="text-stone-400">Geschat aantal kopjes koffie:</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    ~{estimatedCups} kopjes
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Aanbevolen bonenvolume:</div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-300 mt-1">
                    {recommendedKg} kg bonen
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 py-1">
                <div className="flex justify-between">
                  <span>Apparatuurformule:</span>
                  <span className="font-semibold text-white">
                    {includeMachine ? 'Inbegrepen (Dry-hire machine)' : 'Geen machine gewenst'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Baristaservice:</span>
                  <span className="font-semibold text-white">
                    {includeBarista ? `SCA Barista (${durationHours}u)` : 'Zelfbediening'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-800/60 text-[11px] text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300">✓ Service is ALTIJD 100% GRATIS:</span> Gratis afstelling op uw wensen, reinigingsmiddelen en telefonische stand-by support tijdens het evenement inbegrepen.
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                <div className="text-sm font-medium text-stone-300">Indicatieve Totaalprijs:</div>
                <div className="text-3xl font-bold text-amber-100">
                  €{estimatedTotal.toFixed(2)}
                </div>
              </div>

              <a
                href="#event-form"
                className="w-full mt-4 bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-center block transition-colors shadow-xs"
              >
                Vraag Event Voorstel aan voor {guestsCount} personen
              </a>
            </div>
          </div>
        </section>

        {/* Event Inquiry Form */}
        <section id="event-form" className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Vraag een Offerte aan voor uw Evenement
            </h2>
            <p className="text-base text-stone-500 mt-1">
              Koffiecatering & machine-verhuur voor trouwfeesten, verjaardagen, recepties of bedrijfsevenementen.
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm">
              <div className="font-bold mb-1">Evenement aanvraag verzonden!</div>
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
                    Contactpersoon *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="Uw naam"
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
                    placeholder="uw@email.be"
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
                    Type evenement
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    <option>Bruiloft / Trouwfeest</option>
                    <option>Tuinfeest / Verjaardag</option>
                    <option>Bedrijfsreceptie / Nieuwjaarsdrink</option>
                    <option>Beurs / Festival</option>
                    <option>Overige</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Datum van het evenement *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Geschat aantal personen
                  </label>
                  <input
                    type="number"
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Machineverhuur
                  </label>
                  <select
                    value={formData.machineRental}
                    onChange={(e) => setFormData({ ...formData, machineRental: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    <option>Ja, dry-hire espressomachine gewenst</option>
                    <option>Nee, enkel vers gebrande specialty koffiebonen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Baristaservice
                  </label>
                  <select
                    value={formData.baristaService}
                    onChange={(e) => setFormData({ ...formData, baristaService: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    <option>Nee, zelfbediening volstaat</option>
                    <option>Ja, professionele SCA barista ter plaatse gewenst</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bijkomende wensen of vragen
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  placeholder="Locatie van het feest, gewenste timing of speciale koffievoorkeuren..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{formStatus === 'submitting' ? 'Verzenden...' : 'Verstuur Evenement Aanvraag'}</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
