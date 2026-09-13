import React, { useState } from 'react';
import { Building2, Calculator, Coffee, CheckCircle, ArrowRight, Send, Gift, Layers, ChevronDown } from 'lucide-react';
import { CONFIG } from '../config';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import coffeeBeansHeroBg from '../assets/images/coffee_beans_hero_bg.jpg';
import { CoffeeBeanAtmosphere } from '../components/common/CoffeeBeanAtmosphere';
import { B2BCalculator } from '../components/b2b/B2BCalculator';
import {
  HorecaIllustration,
  KantoorIllustration,
  ResidentieleZorgIllustration,
  HandelszakenIllustration,
  KapsalonIllustration,
} from '../components/b2b/SectorLineArt';

interface B2BPageProps {
  navigate: (path: string) => void;
}

export const B2BPage: React.FC<B2BPageProps> = ({ navigate }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const response = await fetch('/api/b2b-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyVolumeKg: 10,
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
    <div className="min-h-screen text-stone-800 pb-16 bg-[#FAF7F2]">
      {/* Header Banner - Artisanal Roastery Ambience */}
      <section className="relative overflow-hidden bg-[#1A0E08] border-b border-amber-950/80 py-8 sm:py-10 text-stone-100">
        {/* Coffee Beans Atmosphere Background */}
        <CoffeeBeanAtmosphere variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>B2B · Kantoor & Horeca</span>
              </div>
              {/* H1: ~25% reduced */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2.5 drop-shadow-xs font-serif">
                Koffieformules voor Thuis & Onderneming
              </h1>
              {/* Body */}
              <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed mb-4">
                Flexibele maandabonnementen, aantrekkelijke volumetarieven en unieke custom roasting & white label branding voor horeca en bedrijven.
              </p>

              {/* Premium Line-Art Sector Pills in Hero */}
              <div className="p-3.5 sm:p-4 bg-stone-900/90 backdrop-blur-xs rounded-2xl border border-stone-700/80 text-xs text-stone-300 space-y-2.5 shadow-xl ring-1 ring-amber-900/20">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Geschikt voor elke onderneming</span>
                  </div>
                  <a
                    href="#b2b-calculator"
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Bereken uw formule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 5 Sectors with Custom Line-Art Icons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-0.5">
                  {[
                    { id: 'horeca', label: 'Horeca & Bar', sub: 'Wekelijks vers', Icon: HorecaIllustration },
                    { id: 'kantoor', label: 'Kantoor & B2B', sub: 'Maandfactuur', Icon: KantoorIllustration },
                    { id: 'residentieel', label: 'Residentieel', sub: 'Milde blends', Icon: ResidentieleZorgIllustration },
                    { id: 'handelszaken', label: 'Handelszaken', sub: 'Hospitality', Icon: HandelszakenIllustration },
                    { id: 'kapsalon', label: 'Kapsalon & Spa', sub: 'VIP verwennerij', Icon: KapsalonIllustration },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, sector: sec.label }));
                        const el = document.getElementById('b2b-calculator');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-800/90 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-950/40 border border-amber-900/30 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                        <sec.Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-200 group-hover:text-amber-200 truncate">
                          {sec.label}
                        </div>
                        <div className="text-[10.5px] text-stone-400 truncate">{sec.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* HERO IMAGE OP B2B PAGE */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-700/70 bg-stone-900 w-full aspect-[3/2] max-h-[380px] group ring-1 ring-amber-900/30">
                <img
                  src={encodeURI('/images/foto hero kantoor en horeca.png')}
                  alt="Maison Milau Kantoor & Horeca Professionele Koffiebeleving"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Interactive B2B Calculator Section */}
        <B2BCalculator navigate={navigate} />

        {/* Gratis Proefpakket & Bonenlevering */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Gift className="w-4 h-4" />
              </div>
              {/* H3 */}
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 mb-1.5 font-serif">
                Gratis Proefpakket & Cupping
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                We komen vrijblijvend langs in uw zaak of kantoor voor een smaaktest op maat van uw team of gasten. Of vraag een gratis proefpakket aan via onderstaand formulier.
              </p>
            </div>
            <div className="mt-4">
              <a
                href="#b2b-form"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
              >
                <span>Proefpakket aanvragen</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center mb-3">
                <Coffee className="w-4 h-4" />
              </div>
              {/* H3 */}
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 mb-1.5 font-serif">
                Bonenlevering
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-2.5">
                Stipt geleverd elke 2 weken of maandelijks, naar wens, op factuur met gunstige B2B volumetarieven en persoonlijke opvolging door onze brander.
              </p>
              <ul className="text-xs text-stone-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                  <span>1kg aromadichte ventielzakken</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                  <span>Gratis levering regio Dendermonde/Aalst</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Custom Roasting & White Label Section */}
        <section className="bg-stone-100 p-5 sm:p-6 rounded-xl border border-stone-200">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Custom Roasting & White Label</span>
            </div>
            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2 font-serif">
              Persoonlijke koffie labels op maat
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed mb-3">
              Voor horeca, bedrijven en speciaalzaken ontwikkelen we een eigen exclusief brandprofiel en leveren we zakken bedrukt met jullie eigen logo en branding.
            </p>
            <ul className="text-xs text-stone-700 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>Cupping en tasting sessions ter plaatse of in ons Atelier</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>Eigen blendverhoudingen met volledige herkomsttransparantie</span>
              </li>
            </ul>
            <a
              href="#b2b-form"
              className="inline-flex items-center gap-1.5 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <span>Neem contact op voor White Label and custom roasting solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* B2B Contact & Quote Request Form */}
        <section id="b2b-form" className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
          <div className="max-w-3xl mb-5">
            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 font-serif">
              Vraag een B2B Voorstel of Gratis Proefpakket aan
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
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
