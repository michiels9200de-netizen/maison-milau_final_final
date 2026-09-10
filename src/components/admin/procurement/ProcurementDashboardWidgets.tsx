import React from 'react';
import {
  Package,
  Euro,
  AlertTriangle,
  Truck,
  Building2,
  Layers,
  Sparkles,
  Calendar,
  ArrowUpRight,
  Coffee,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';

interface ProcurementDashboardWidgetsProps {
  onSelectTab?: (tab: string) => void;
  onFilterLowStock?: () => void;
}

export const ProcurementDashboardWidgets: React.FC<ProcurementDashboardWidgetsProps> = ({
  onSelectTab,
  onFilterLowStock,
}) => {
  const { metrics, seasonalCalendar, beans } = useProcurement();

  const monthNamesNl = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  const curMonthName = monthNamesNl[new Date().getMonth()];

  const activeHarvestOrigins = seasonalCalendar.filter((item) => {
    const text = (item.harvestMonths || '').toString().toLowerCase();
    return text.includes(curMonthName) || text.includes('jaarrond');
  });

  const arrivingInEuOrigins = seasonalCalendar.filter((item) => {
    const text = (item.arrivalEurope || '').toString().toLowerCase();
    return text.includes(curMonthName);
  });

  return (
    <div className="space-y-4 mb-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Green Coffee Stock */}
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Groene Koffie Voorraad
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {metrics.totalGreenInventoryKg.toLocaleString('nl-NL')}
            </span>
            <span className="text-sm font-semibold text-[#D4AF37]">kg</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
            <span>{beans.length} unieke lots / herkomsten</span>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('master_beans')}
                className="text-[#D4AF37] hover:underline flex items-center gap-0.5"
              >
                Bekijk <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Inventory Value */}
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Totale Voorraadwaarde
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Euro className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-sm font-semibold text-emerald-400">€</span>
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {metrics.totalInventoryValueEur.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="mt-2 text-xs text-stone-400">
            Gem. €{(metrics.totalGreenInventoryKg > 0 ? metrics.totalInventoryValueEur / metrics.totalGreenInventoryKg : 0).toFixed(2)} / kg groen
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div
          onClick={onFilterLowStock}
          className={`bg-[#242220] border rounded-xl p-4 cursor-pointer transition-colors ${
            metrics.lowStockCount > 0
              ? 'border-amber-500/50 hover:border-amber-400 bg-amber-950/10'
              : 'border-[#3A3530] hover:border-stone-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Lage Voorraad Alarm
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                metrics.lowStockCount > 0
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                metrics.lowStockCount > 0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {metrics.lowStockCount}
            </span>
            <span className="text-xs text-stone-400">bonen ≤ 30 kg</span>
          </div>
          <div className="mt-2 text-xs text-amber-400/90 flex items-center justify-between">
            <span>{metrics.lowStockCount > 0 ? 'Actie vereist: inkoop plannen' : 'Alle voorraden gezond'}</span>
            <span className="underline text-[11px]">Filter</span>
          </div>
        </div>

        {/* Card 4: Pending Purchases */}
        <div
          onClick={() => onSelectTab && onSelectTab('purchasing')}
          className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Lopende Inkooporders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {metrics.pendingPurchasesCount}
            </span>
            <span className="text-xs text-stone-400">orders openstaand</span>
          </div>
          <div className="mt-2 text-xs text-blue-400 flex items-center justify-between">
            <span>
              €{metrics.pendingPurchasesValueEur.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} onderweg
            </span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Secondary Bar: Active Suppliers, Blends & Sourcing Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Most Used Coffees */}
        <div className="bg-[#1F1D1A] border border-[#3A3530] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-stone-300">
            <Coffee className="w-4 h-4 text-[#D4AF37]" />
            <span>Meest Gebruikte Koffies in Blends</span>
          </div>
          <div className="space-y-2">
            {metrics.mostUsedCoffees.length === 0 ? (
              <span className="text-xs text-stone-500">Geen actieve blends gevonden.</span>
            ) : (
              metrics.mostUsedCoffees.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 truncate max-w-[180px]">{item.beanName}</span>
                  <span className="px-2 py-0.5 rounded bg-[#2D2A26] text-[#D4AF37] font-medium text-[11px]">
                    {item.blendUsageCount} {item.blendUsageCount === 1 ? 'blend' : 'blends'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suppliers & Master Network */}
        <div className="bg-[#1F1D1A] border border-[#3A3530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Sourcing Netwerk</span>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('suppliers')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Beheer
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#2D2A26] border border-stone-800">
              <div className="text-stone-400 text-[11px]">Actieve Leveranciers</div>
              <div className="text-base font-bold text-white mt-0.5">{metrics.activeSuppliersCount}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#2D2A26] border border-stone-800">
              <div className="text-stone-400 text-[11px]">Actieve Blends</div>
              <div className="text-base font-bold text-white mt-0.5">{metrics.activeBlendsCount}</div>
            </div>
          </div>
        </div>

        {/* Seasonal Sourcing Insights */}
        <div className="bg-[#1F1D1A] border border-[#3A3530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Oogst- & Aankomstkalender</span>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('sourcing_planner')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Planning
              </button>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span className="font-medium text-stone-400">Nu in oogst:</span>
              <span className="text-white truncate">
                {activeHarvestOrigins.map((o) => o.origin || o.country).join(', ') || 'Tussen seizoenen'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span className="font-medium text-stone-400">Aankomst EU:</span>
              <span className="text-white truncate">
                {arrivingInEuOrigins.map((o) => o.origin || o.country).join(', ') || 'Reguliere voorraad'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
