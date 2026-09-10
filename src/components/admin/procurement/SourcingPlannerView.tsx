import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Ship,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';
import { GreenCoffeeMasterBean } from '../../../types';

export const SourcingPlannerView: React.FC = () => {
  const { seasonalCalendar, beans, exportData } = useProcurement();

  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  const originMonthsMap: Record<string, { harvest: number[]; arrival: number[] }> = {
    'Brazilië': { harvest: [5, 6, 7, 8, 9], arrival: [10, 11, 12, 1] },
    'Colombia': { harvest: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], arrival: [2, 3, 4, 5, 6, 7, 8, 9] },
    'Ethiopië': { harvest: [11, 12, 1, 2], arrival: [5, 6, 7, 8] },
    'Kenia': { harvest: [11, 12, 1, 5, 6, 7], arrival: [4, 5, 6, 7] },
    'Honduras': { harvest: [12, 1, 2, 3, 4], arrival: [6, 7, 8, 9] },
    'Oeganda': { harvest: [10, 11, 12, 1, 2], arrival: [3, 4, 5, 6] },
    'Indonesië': { harvest: [5, 6, 7, 8, 9, 10], arrival: [9, 10, 11, 12, 1] },
    'Rwanda': { harvest: [3, 4, 5, 6, 7], arrival: [8, 9, 10, 11] },
    'Peru': { harvest: [6, 7, 8, 9, 10], arrival: [10, 11, 12, 1] },
  };

  const getOriginSchedule = (name: string) => {
    return originMonthsMap[name] || { harvest: [6, 7, 8], arrival: [10, 11] };
  };

  // Inventory Runway Calculation (estimating monthly consumption based on stock levels and allocation)
  const runwayEstimates = useMemo(() => {
    return beans.map((bean) => {
      // Estimated average monthly consumption for active roastery (e.g. 15-40 kg depending on bean role)
      const estimatedMonthlyKg = bean.availableKg > 200 ? 50 : bean.availableKg > 100 ? 30 : 20;
      const monthsOfSupply = Math.round((bean.availableKg / estimatedMonthlyKg) * 10) / 10;
      const needsReorder = monthsOfSupply <= 1.5;

      return {
        ...bean,
        estimatedMonthlyKg,
        monthsOfSupply,
        needsReorder,
      };
    });
  }, [beans]);

  const urgentReorders = runwayEstimates.filter((r) => r.needsReorder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Sourcing Planner & Seizoenskalender
          </h2>
          <p className="text-xs text-stone-400">
            Anticipeer op wereldwijde koffieoogsten, verschepingen en voorraad-runway voor optimale beschikbaarheid.
          </p>
        </div>

        <button
          onClick={() => exportData('inventory', 'excel')}
          className="px-3.5 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          Sourcing Rapport Exporteren
        </button>
      </div>

      {/* Runway Alert Banner */}
      {urgentReorders.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Voorraad Runway Waarschuwing: {urgentReorders.length} bonen hebben &lt; 6 weken voorraad</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {urgentReorders.map((b) => (
              <div
                key={b.id}
                className="bg-[#1C1B19] p-2.5 rounded-lg border border-amber-500/20 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-white">{b.beanName}</div>
                  <div className="text-[11px] text-stone-400">{b.supplier}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-400">{b.monthsOfSupply} mnd</div>
                  <div className="text-[10px] text-stone-400">{b.availableKg}kg over</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Matrix Table */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3A3530] pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#D4AF37]" />
              Wereldwijde Oogst- en Verschepingscyclus
            </h3>
            <span className="text-xs text-stone-400">
              Huidige maand: <strong className="text-[#D4AF37]">{monthNames[currentMonth - 1]}</strong> (gemarkeerd)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400"></span>
              <span className="text-stone-300">Oogstseizoen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-400"></span>
              <span className="text-stone-300">Aankomst Europa</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-2.5 px-3 font-semibold text-white w-40">Land / Herkomst</th>
                {monthNames.map((m, idx) => (
                  <th
                    key={m}
                    className={`py-2.5 px-2 text-center font-semibold ${
                      idx + 1 === currentMonth ? 'text-[#D4AF37] bg-[#D4AF37]/10 rounded-t' : ''
                    }`}
                  >
                    {m}
                  </th>
                ))}
                <th className="py-2.5 px-3 font-semibold text-right">Seizoensadvies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {seasonalCalendar.map((item) => {
                const originName = item.origin || item.country || '';
                const schedule = getOriginSchedule(originName);
                const isHarvestNow = schedule.harvest.includes(currentMonth);
                const isArrivalNow = schedule.arrival.includes(currentMonth);

                return (
                  <tr key={originName} className="hover:bg-[#2A2723] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{originName}</span>
                        {isHarvestNow && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Nu in oogst"></span>
                        )}
                        {isArrivalNow && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Nieuwe oogst in EU"></span>
                        )}
                      </div>
                    </td>

                    {monthNames.map((_, idx) => {
                      const mIndex = idx + 1;
                      const isHarvest = schedule.harvest.includes(mIndex);
                      const isArrival = schedule.arrival.includes(mIndex);
                      const isCurrent = mIndex === currentMonth;

                      return (
                        <td
                          key={mIndex}
                          className={`py-3 px-1 text-center ${isCurrent ? 'bg-[#D4AF37]/5 font-bold' : ''}`}
                        >
                          {isHarvest && isArrival ? (
                            <div
                              className="h-5 w-full rounded bg-gradient-to-r from-amber-500/70 to-emerald-500/70 flex items-center justify-center text-[10px] text-stone-900 font-bold"
                              title="Oogst & Verscheping"
                            >
                              ★
                            </div>
                          ) : isHarvest ? (
                            <div
                              className="h-5 w-full rounded bg-amber-500/40 border border-amber-500/60 flex items-center justify-center text-[10px] text-amber-200"
                              title="Oogstseizoen"
                            >
                              🌾
                            </div>
                          ) : isArrival ? (
                            <div
                              className="h-5 w-full rounded bg-emerald-500/40 border border-emerald-500/60 flex items-center justify-center text-[10px] text-emerald-200"
                              title="Aankomst Europese Havens"
                            >
                              🚢
                            </div>
                          ) : (
                            <span className="text-stone-700">·</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right text-stone-300 text-[11px] max-w-xs truncate" title={item.cupProfile || item.notes}>
                      {item.cupProfile || item.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sourcing Strategy & Buffer Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Continuïteit & Risicospreiding</span>
          </div>
          <p className="text-stone-400 leading-relaxed">
            Houd voor basisbonen (zoals Brazilië en Colombia) altijd minimaal 2 maanden veiligheidsvoorraad aan om vertragingen in haventerminals op te vangen.
          </p>
        </div>

        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Micro-Lot Pre-Orders</span>
          </div>
          <p className="text-stone-400 leading-relaxed">
            Plaats pre-orders voor Ethiopië en Kenia tijdens de oogstmaanden (december–februari) om toewijzing van de hoogste cupping scores (87+) te garanderen.
          </p>
        </div>

        <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Magazijn Proximity</span>
          </div>
          <p className="text-stone-400 leading-relaxed">
            Bonen opgeslagen in Antwerpen Haven hebben gemiddeld 48–72 uur levertijd naar de branderij, vergeleken met 7–10 dagen voor Hamburg of Bremen.
          </p>
        </div>
      </div>
    </div>
  );
};
