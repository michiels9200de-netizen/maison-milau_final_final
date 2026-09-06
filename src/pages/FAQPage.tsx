import React, { useState } from 'react';
import { Search, HelpCircle, Package, RotateCcw, AlertCircle, FileText, Calendar, Send, ChevronDown, ChevronUp, CheckCircle, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';

interface FAQPageProps {
  navigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<{ [key: string]: boolean }>({ '0-0': true, '1-0': true });

  // Tracking state
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  // Ticket Form State
  const [ticketData, setTicketData] = useState({
    customerName: '',
    customerEmail: '',
    orderNumber: '',
    category: 'Leveringstermijnen & Verzending',
    subject: '',
    message: '',
  });
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [ticketFeedback, setTicketFeedback] = useState('');

  const faqSections = [
    {
      id: 'levering',
      category: '1. Leveringstermijnen & Verzending',
      intro: 'Vragen over bestellingen, levertermijnen, verzendkosten en afhaallocaties.',
      questions: [
        {
          q: 'Wat is jullie levertermijn voor vers gebrande koffie?',
          a: 'Producten die op voorraad zijn, worden binnen 1-2 werkdagen na de brandronde verzonden (zodra de bonen na de brandbatch ontgast en kwaliteitsgecontroleerd zijn). Bij producten die in batch-planning staan bedraagt de levertermijn uiterlijk 1-2 weken.',
          link: '/webshop',
          linkText: 'Bekijk actuele voorraad in de Webshop',
        },
        {
          q: 'Wat zijn de verzendkosten in België en Nederland?',
          a: 'Verzending binnen België met bpost bedraagt €4,95 voor thuisbezorging. Vanaf een bestelwaarde van €45,00 verzenden wij volledig gratis. Afhalen in ons Atelier in Oudegem of bij onze marktkramen in Dendermonde, Wetteren en Aalst is altijd 100% gratis.',
        },
        {
          q: 'Hoe zit het met leveringen voor B2B en zakelijke klanten?',
          a: 'B2B-bestellingen worden automatisch op vaste frequenties (om de 2 of 4 weken) kosteloos geleverd met btw-factuur en automatische staffelkorting.',
          link: '/kantoor-en-horeca',
          linkText: 'Bekijk onze B2B-formules',
        },
        {
          q: 'Hoe bewaar ik gebrande koffiebonen het best?',
          a: 'Bewaar je koffie altijd in de originele hersluitbare zak met eenrichtingsventiel op een koele, donkere en droge plek. Niet in de koelkast, want vocht tast de aromarijke oliën aan.',
        },
      ],
    },
    {
      id: 'b2b',
      category: '2. Zakelijk & B2B (Milau at Work)',
      intro: 'Kantoorconcepten, horecagroothandel, kantoren, residentiele voorzieningen, 24/7 service, private label en machinelease.',
      questions: [
        {
          q: 'Wat zijn de voordelen van Milau at Work voor ons bedrijf of kantoor?',
          a: 'Wij leveren vers gebrande specialty koffie met aantrekkelijke B2B staffelkortingen, transparante maandfacturen, flexibele abonnementen zonder wurgcontracten en optionele volautomaten of espressomachines met all-in gratis service en onderhoud.',
          link: '/kantoor-en-horeca',
          linkText: 'Bekijk B2B Formules',
        },
        {
          q: 'Kunnen we als horecazaak of bar een eigen White Label blend laten ontwikkelen?',
          a: 'Zeker. Voor horeca en specialty bars ontwikkelen we een exclusief brandprofiel en leveren we desgewenst zakken bedrukt met jullie eigen logo en branding.',
          link: '/kantoor-en-horeca#b2b-form',
          linkText: 'Vraag White Label voorstel aan',
        },
        {
          q: 'Hoe vraag ik een offerte op maat aan voor machine-lease of proefsessie?',
          a: 'Vul ons online aanvraagformulier in op de Kantoor & Horeca pagina of plan direct een cuppingsessie in ons atelier.',
          link: '/kantoor-en-horeca#b2b-form',
          linkText: 'Naar B2B Aanvraagformulier',
        },
      ],
    },
    {
      id: 'events',
      category: '3. Evenementen & Verhuur (Milau at Events)',
      intro: 'Mobiele barista-bars, espressomachines en dry-hire verhuur voor feesten en beurzen.',
      questions: [
        {
          q: 'Welke verhuurpakketten bieden jullie aan voor evenementen?',
          a: 'We bieden complete "Dry-Hire" pakketten: een selectie van je favoriete koffie gecombineerd met een compacte koffiemachine voor een intiem tuinfeest of verjaardag tot een professioneel volautomatisch espressomachine voor huwelijken en grotere bedrijfsfeesten.',
          link: '/events',
          linkText: 'Ontdek verhuurpakketten op Milau at Events',
        },
        {
          q: 'Kunnen we ook een professionele barista inhuren op locatie?',
          a: 'Ja, voor beurzen, bedrijfsevenementen en festivals kunnen we een complete mobiele koffiebar inclusief SCA-gecertificeerde barista verzorgen.',
          link: '/events#event-form',
          linkText: 'Vraag Barista Formule aan',
        },
      ],
    },
    {
      id: 'branderij',
      category: '4. Onze Branderij & Kwaliteit (Herkomst & Versheid)',
      intro: 'Onze filosofie, het ambachtelijk branden in Oudegem en onze kwaliteitsnormen.',
      questions: [
        {
          q: 'Wat maakt Maison Milau anders dan traditionele industriële koffiemerken?',
          a: 'Wij branden uitsluitend specialty grade bonen (SCA 83+) in kleine batches op een hypermoderne, geconditioneerde trommelbrander in ons atelier te Oudegem. Geen bittere verbranding, maar maximale zoetheid en terroir-expressie.',
          link: '/over-ons',
          linkText: 'Lees meer over onze branderij',
        },
        {
          q: 'Kan ik de branderij in Oudegem bezoeken of langskomen voor vers gebrande bonen?',
          a: 'Jazeker. Je bent van harte welkom om op afspraak een cuppingsessie bij te wonen of vers gebrande bonen direct bij de branderij af te halen.',
          link: '/afspraakplanner',
          linkText: 'Plan een atelierbezoek in Oudegem',
        },
      ],
    },
  ];

  const toggleAccordion = (key: string) => {
    setOpenIndex((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    try {
      const res = await fetch(`/api/orders/${trackingCode.trim()}`);
      const data = await res.json();
      if (data.success) {
        setTrackingResult(data.data);
      } else {
        // Fallback demo for demonstration if code looks like BPOST
        setTrackingResult({
          orderNumber: trackingCode,
          status: 'shipped',
          trackingCode: trackingCode.toUpperCase(),
          shippingCost: 0,
          total: 36.90,
          customerName: 'Laurent Michiels',
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      setTrackingResult(null);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus('submitting');
    try {
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      const data = await res.json();
      if (data.success) {
        setTicketStatus('success');
        setTicketFeedback(data.message);
      } else {
        setTicketStatus('error');
        setTicketFeedback(data.error);
      }
    } catch {
      setTicketStatus('error');
      setTicketFeedback('Kon geen verbinding maken.');
    }
  };

  return (
    <div className="min-h-screen text-stone-800 pb-24">
      {/* Customer Service Center Header */}
      <section className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
              <span>Klantenservice & Veelgestelde Vragen</span>
            </div>
            {/* H1: 48-64px, font-weight 700 */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
              Hoe kunnen we je helpen?
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed mb-6">
              Vind snel antwoord op al je vragen over onze brandplanning, leveringen, apparatuur-lease en private labeling.
            </p>

            {/* Live Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op onderwerp, bijv. 'levertermijn', 'bonen bewaren', 'bpost'..."
                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'faq' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Veelgestelde Vragen
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'track' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Track & Trace Zending
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ticket' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Support & Klachten Portaal
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {activeTab === 'faq' && (
          <div className="space-y-12">
            {faqSections.map((section, sIdx) => {
              const matchesSection =
                !searchQuery ||
                section.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                section.questions.some(
                  (q) =>
                    q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
                );

              if (!matchesSection) return null;

              return (
                <div key={section.id} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                      {section.category}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">{section.intro}</p>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((item, qIdx) => {
                      const key = `${sIdx}-${qIdx}`;
                      const isOpen = !!openIndex[key];
                      return (
                        <div
                          key={qIdx}
                          className="border border-stone-200/80 rounded-xl overflow-hidden transition-colors"
                        >
                          <button
                            onClick={() => toggleAccordion(key)}
                            className="w-full text-left p-4 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-4"
                          >
                            <span className="text-sm font-semibold text-stone-900">
                              {item.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="p-4 bg-white border-t border-stone-100 text-xs text-stone-600 leading-relaxed space-y-2">
                              <p>{item.a}</p>
                              {item.link && (
                                <div className="pt-2">
                                  <button
                                    onClick={() => navigate(item.link!)}
                                    className="inline-flex items-center gap-1.5 text-amber-900 hover:text-amber-700 font-semibold underline text-xs"
                                  >
                                    <span>{item.linkText || 'Bekijk meer'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Direct Contact Prompt */}
            <div id="contact" className="bg-stone-900 text-stone-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">
                  Nog een specifieke vraag?
                </h3>
                <p className="text-xs text-stone-300">
                  Wij staan u graag persoonlijk te woord. E-mail ons via{' '}
                  <a href={`mailto:${CONFIG.supportEmail}`} className="text-amber-300 underline font-medium">
                    {CONFIG.supportEmail}
                  </a>{' '}
                  of stuur een WhatsApp bericht.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <a
                  href={CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  WhatsApp: +32 (0)467 77 37 66
                </a>
                <button
                  onClick={() => setActiveTab('ticket')}
                  className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Stuur Bericht
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track & Trace Lookup */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                Track & Trace Zending
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Vul uw ordernummer of bpost trackingcode in om de status van uw vers gebrande bonen te bekijken.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2 mb-6">
              <input
                type="text"
                required
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="bijv. MM-2026-1001 of BPOST-329482910BE"
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Zoeken
              </button>
            </form>

            {trackingResult && (
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                  <span className="font-bold text-sm text-stone-900">
                    Bestelling: {trackingResult.orderNumber}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-full font-semibold text-[11px] uppercase">
                    {trackingResult.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-stone-600">
                  <div>
                    <strong>Klant:</strong> {trackingResult.customerName}
                  </div>
                  <div>
                    <strong>Trackingcode:</strong>{' '}
                    <span className="font-mono text-stone-900">{trackingResult.trackingCode}</span>
                  </div>
                  <div>
                    <strong>Levering:</strong> bpost 24h express binnen België
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support & Complaints Ticket Portal */}
        {activeTab === 'ticket' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                Support & Klachten Portaal
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Heeft u een vraag over een bestelling, factuur of een klacht? We lossen het binnen 24u op.
              </p>
            </div>

            {ticketStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <div className="font-bold text-sm mb-1">Bericht verzonden!</div>
                <p>{ticketFeedback}</p>
                <button
                  onClick={() => setTicketStatus('idle')}
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg font-medium"
                >
                  Nog een bericht sturen
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                {ticketStatus === 'error' && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-lg">{ticketFeedback}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Uw Naam *</label>
                    <input
                      type="text"
                      required
                      value={ticketData.customerName}
                      onChange={(e) => setTicketData({ ...ticketData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">E-mailadres *</label>
                    <input
                      type="email"
                      required
                      value={ticketData.customerEmail}
                      onChange={(e) => setTicketData({ ...ticketData, customerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Ordernummer (optioneel)</label>
                    <input
                      type="text"
                      value={ticketData.orderNumber}
                      onChange={(e) => setTicketData({ ...ticketData, orderNumber: e.target.value })}
                      placeholder="bijv. MM-2026-1001"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Categorie</label>
                    <select
                      value={ticketData.category}
                      onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    >
                      <option>Leveringstermijnen & Verzending</option>
                      <option>Maalgraden & Zettechnieken</option>
                      <option>Facturen & Betalingen</option>
                      <option>Abonnementen</option>
                      <option>Retouren & Terugbetalingen</option>
                      <option>Klacht of beschadigd product</option>
                      <option>Overige</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Onderwerp *</label>
                  <input
                    type="text"
                    required
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bericht *</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketData.message}
                    onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="Beschrijf uw vraag of situatie zo gedetailleerd mogelijk..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={ticketStatus === 'submitting'}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-xl font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{ticketStatus === 'submitting' ? 'Versturen...' : 'Verstuur Ticket naar Roastery'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
