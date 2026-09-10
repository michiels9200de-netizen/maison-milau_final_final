import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Package,
  Truck,
  Layers,
  BarChart3,
  Calendar,
  Euro,
  TrendingUp,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';

export const ProcurementReportsView: React.FC = () => {
  const { exportData, metrics, blends, beans, purchaseOrders } = useProcurement();

  // Blend categories volume breakdown (preserving historical kilogram stats model)
  const categoryVolumes = [
    { tier: 'Prestige', kg: 145, color: 'bg-purple-500', pct: 15 },
    { tier: 'Premium', kg: 310, color: 'bg-[#D4AF37]', pct: 32 },
    { tier: 'Selection', kg: 260, color: 'bg-blue-500', pct: 27 },
    { tier: 'Value', kg: 155, color: 'bg-amber-600', pct: 16 },
    { tier: 'Budget', kg: 95, color: 'bg-stone-500', pct: 10 },
  ];

  const totalMonthlyKg = categoryVolumes.reduce((acc, c) => acc + c.kg, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          Inkooprapportages & Kilogram Statistieken
        </h2>
        <p className="text-xs text-stone-400">
          Exporteer complete inkoop-, voorraad- en blendgegevens direct naar Microsoft Excel of CSV formaat.
        </p>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export 1: Master Inventory */}
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-colors shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Groene Koffie Voorraad & Waarde</h3>
            <p className="text-xs text-stone-400 mt-1">
              Volledig overzicht van alle {beans.length} unieke lots, fysieke kilo's, SCA scores, pack sizes, magazijnen en actuele voorraadwaardering (€{metrics.totalInventoryValueEur.toLocaleString('nl-NL')}).
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-[#332F2B] flex items-center gap-2">
            <button
              onClick={() => exportData('inventory', 'excel')}
              className="flex-1 px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => exportData('inventory', 'csv')}
              className="px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold text-stone-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Export 2: Purchase Orders */}
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition-colors shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Inkooporders & Leveringen</h3>
            <p className="text-xs text-stone-400 mt-1">
              Historisch en actueel rapport van alle {purchaseOrders.length} PO-orders, besteldata, leveranciers, kilo's, ontvangstdata en inkoopfactuurbedragen.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-[#332F2B] flex items-center gap-2">
            <button
              onClick={() => exportData('pos', 'excel')}
              className="flex-1 px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => exportData('pos', 'csv')}
              className="px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold text-stone-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              CSV
            </button>
          </div>
        </div>

        {/* Export 3: Blend Recipes & Costing */}
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-colors shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Blend Recepten & Kostprijs Calculatie</h3>
            <p className="text-xs text-stone-400 mt-1">
              Uitgebreide formules voor alle {blends.length} blends, met exacte percentages componentkoffies, berekende kostprijzen per kg en brandrendementen.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-[#332F2B] flex items-center gap-2">
            <button
              onClick={() => exportData('blends', 'excel')}
              className="flex-1 px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => exportData('blends', 'csv')}
              className="px-3 py-2 rounded-lg bg-[#2D2A26] border border-stone-700 hover:border-[#D4AF37] text-xs font-semibold text-stone-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Kilogram Volume & Tier Breakdown */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3530] pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              Kilogram Statistieken naar Blend Segment
            </h3>
            <p className="text-xs text-stone-400">
              Maandelijks gebrand volume per kwaliteitscategorie (Totaal: {totalMonthlyKg} kg / maand).
            </p>
          </div>
        </div>

        {/* Stacked bar */}
        <div className="h-4 w-full rounded-full bg-[#191816] overflow-hidden flex border border-stone-800">
          {categoryVolumes.map((cat) => (
            <div
              key={cat.tier}
              style={{ width: `${cat.pct}%` }}
              className={`${cat.color} h-full transition-all`}
              title={`${cat.tier}: ${cat.kg}kg (${cat.pct}%)`}
            />
          ))}
        </div>

        {/* Category breakdown cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {categoryVolumes.map((cat) => (
            <div key={cat.tier} className="bg-[#1C1B19] p-3 rounded-lg border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`}></span>
                <span className="font-semibold">{cat.tier}</span>
              </div>
              <div className="text-lg font-bold text-white tracking-tight">{cat.kg} kg</div>
              <div className="text-[11px] text-stone-400">{cat.pct}% van totaal volume</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
