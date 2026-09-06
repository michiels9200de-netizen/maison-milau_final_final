import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Coffee, Users, Send } from 'lucide-react';
import { CONFIG } from '../config';

interface AppointmentPageProps {
  navigate: (path: string) => void;
}

export const AppointmentPage: React.FC<AppointmentPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    appointmentType: 'Cupping & Tasting Session (Atelier Oudegem)',
    date: '',
    timeSlot: '10:00 - 11:30',
    participants: 2,
    customerName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const timeSlots = [
    '09:30 - 11:00',
    '11:30 - 13:00',
    '14:00 - 15:30',
    '16:00 - 17:30',
    'Zaterdag 10:00 - 12:00',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFeedback(data.message);
      } else {
        setStatus('error');
        setFeedback(data.error);
      }
    } catch {
      setStatus('error');
      setFeedback('Kon afspraak niet inplannen.');
    }
  };

  return (
    <div className="min-h-screen text-stone-800 pb-24">
      <section className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>Atelier Bezoek & Proeverijen</span>
            </div>
            {/* H1: 48-64px, font-weight 700 */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
              Afspraakplanner Atelier
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
              Bezoek ons atelier in Oudegem (Dendermonde). Proef onze nieuwste brandbatches, stel je eigen huisblend samen of ontdek onze machine- en kantoorformules.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-stone-200 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
              <div>
                <strong>Locatie:</strong>
                <p className="text-stone-600 mt-0.5">
                  Jef Scheirsstraat 29, 9200 Oudegem
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
              <div>
                <strong>Beschikbaarheid:</strong>
                <p className="text-stone-600 mt-0.5">
                  Maandag t/m Zaterdag op afspraak
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Coffee className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
              <div>
                <strong>Inclusief:</strong>
                <p className="text-stone-600 mt-0.5">
                  Verse cupping, aroma-analyse & proeverij
                </p>
              </div>
            </div>
          </div>

          {status === 'success' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-sm">
              <div className="font-bold mb-1">Afspraak aangevraagd!</div>
              <p className="text-xs text-emerald-800">{feedback}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Nieuwe datum kiezen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl">{feedback}</div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Type Afspraak / Doel van uw bezoek *
                </label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                >
                  <option>Cupping & Tasting Session (Atelier Oudegem)</option>
                  <option>Huisblend & Custom Roasting Ontwikkeling (Horeca / Bedrijf)</option>
                  <option>B2B Machine Demonstratie & Proefpakket bespreking</option>
                  <option>Evenement Koffiecatering Bespreking</option>
                  <option>Koffie Afhaling & Adviesgesprek</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Gewenste Datum *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Tijdslot *
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Aantal Personen
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Uw Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="Voor- en achternaam"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="naam@domein.be"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Telefoonnummer *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    placeholder="+32 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Eventuele specifieke voorkeuren of koffies die u wilt proeven
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                  placeholder="Bijv. geïnteresseerd in onze Pedro Ximénez Barrel Aged of een espressoblend voor kantoor..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-xl font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Afspraak inplannen...' : 'Bevestig Afspraak'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
