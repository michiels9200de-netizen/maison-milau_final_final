import React from 'react';
import { useStock } from '../../context/StockContext';
import { Flame, AlertCircle, CheckCircle2, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface BlendCapacityViewProps {
  onOpenRoastModal?: (blendId: string) => void;
}

export const BlendCapacityView: React.FC<BlendCapacityViewProps> = ({ onOpenRoastModal }) => {
  const { blendCapacities, blendRecipes, greenCoffee } = useStock();

  const capacitiesList = Object.values(blendCapacities);

  const getStatusBadge = (status: string) => {
    if (status === 'Ruim produseerbaar') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
    if (status === 'Beperkte productie') {
      return 'bg-amber-50 text-amber-900 border-amber-300';
    }
    return 'bg-rose-50 text-rose-900 border-rose-300';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-800" />
            <span>Blend Recepturen & Productiecapaciteit (Knelpuntanalyse)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Automatische berekening van het maximaal te branden volume op basis van de actuele groene koffievoorraad per component.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capacitiesList.map((cap) => {
          const recipe = blendRecipes[cap.blendId];
          const isBottleneckSevere = cap.availableProductionKg < 30;

          return (
            <div
              key={cap.blendId}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400/80 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Blend Recept
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{cap.blendName}</h3>
                    {recipe && (
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        Brandrendement: {recipe.roastYieldPct}% · Profiel: {recipe.targetProfile}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(
                      cap.status
                    )}`}
                  >
                    {cap.status}
                  </span>
                </div>

                {/* Main Metric Capacity */}
                <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="text-xs font-semibold text-stone-600 flex items-center justify-between">
                    <span>Maximaal te produceren gebrand:</span>
                    <span className="text-stone-400 font-normal text-[11px]">
                      (o.b.v. {cap.availableProductionKg.toFixed(0)} kg groen)
                    </span>
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-1 flex items-baseline gap-1.5">
                    <span>{cap.availableRoastedKg.toFixed(1)}</span>
                    <span className="text-sm font-semibold text-amber-800">kg gebrand</span>
                  </div>

                  {/* Limiting Bottleneck Factor */}
                  <div className="mt-2 pt-2 border-t border-stone-200 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <AlertCircle
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isBottleneckSevere ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      />
                      <span className="font-semibold">Beperkende factor:</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-stone-600 pl-5">
                      <strong className="text-stone-900">{cap.bottleneckGreenCoffeeName}</strong>
                      <span>
                        {' '}
                        (Nog slechts {cap.bottleneckAvailableKg} kg voorradig · aandeel{' '}
                        {cap.limitingComponentPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recipe Breakdown */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Samenstelling van recept:
                  </div>
                  <div className="space-y-1">
                    {cap.componentBreakdown.map((comp) => {
                      const isLimiting = comp.greenCoffeeId === cap.bottleneckGreenCoffeeId;
                      return (
                        <div
                          key={comp.greenCoffeeId}
                          className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                            isLimiting
                              ? 'bg-amber-50/60 border-amber-300/80 text-amber-950 font-semibold'
                              : 'bg-stone-50/60 border-stone-200/60 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                            <span>{comp.greenCoffeeName}</span>
                            <span className="text-[10px] text-stone-500 font-normal">({comp.percentage}%)</span>
                          </div>
                          <div className="text-right font-mono text-[11px]">
                            <span>{comp.availableKg} kg groen</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {onOpenRoastModal && (
                <button
                  type="button"
                  onClick={() => onOpenRoastModal(cap.blendId)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Registreer Brandbatch</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
