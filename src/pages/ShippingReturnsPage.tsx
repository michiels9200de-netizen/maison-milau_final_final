import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';

interface ShippingReturnsPageProps {
  navigate: (path: string) => void;
}

export const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = () => {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-20">
      <div className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-200">
            <Truck className="w-3.5 h-3.5 text-amber-800" />
            <span>Bezorging & Retourneren</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Verzending & Retourbeleid · Maison Milau
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Transparante informatie over levertijden, verzendtarieven en herroepingsrecht
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 text-sm leading-relaxed text-stone-700">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Verzending & Tarieven</h2>
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="font-semibold text-stone-900">Reguliere Webshop Bestellingen</div>
              <p className="text-xs text-stone-600 mt-1">
                Standaard verzendkost binnen België: <strong>€4,95</strong>. Vanaf €45,- totale bestelwaarde verzenden wij uw order <strong>volledig gratis</strong>.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-950">Koffie-abonnementen Verzending</div>
              <ul className="text-xs text-stone-700 mt-2 space-y-1 list-disc pl-5">
                <li><strong>250g verpakkingen:</strong> €4,95 per periodieke bezorging.</li>
                <li><strong>500g en 1kg verpakkingen:</strong> Altijd 100% <strong>GRATIS</strong> verzending per bezorging, ongeacht de gekozen frequentie (elke 2, 4 of 6 weken).</li>
              </ul>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="font-semibold text-stone-900">Gratis Afhalen in het Atelier</div>
              <p className="text-xs text-stone-600 mt-1">
                U kunt uw bestelling altijd kosteloos afhalen in ons branderij-atelier te {CONFIG.atelierAddress.street}, {CONFIG.atelierAddress.city} of op onze wekelijkse marktlocaties (Dendermonde op maandag, Wetteren op donderdag, Aalst op zaterdag).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Retourneren & Herroepingsrecht</h2>
          <p>
            Consumenten hebben het recht om binnen 14 dagen na ontvangst van de aankoop af te zien van niet-bederfelijke producten (zoals mokken, glazen, T-shirts en accessoires), mits ongeopend en in originele staat.
          </p>
          <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-600">
            <strong>Let op bij vers gebrande koffiebonen:</strong> Om redenen van gezondheidsbescherming en hygiëne kunnen geopende koffiezakken met verbroken aromazegel niet worden geretourneerd. Indien u onverhoopt twijfelt over de kwaliteit van een batch, neem dan direct contact op via{' '}
            <a href={`mailto:${CONFIG.supportEmail}`} className="font-semibold text-amber-900 underline">
              {CONFIG.supportEmail}
            </a>. Wij bieden te allen tijde een ambachtelijke tevredenheidsgarantie.
          </div>
        </div>
      </div>
    </div>
  );
};
