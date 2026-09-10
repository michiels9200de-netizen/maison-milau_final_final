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
    if (status.includes('Onvoldoende Data')) {
      return 'bg-stone-100 text-stone-700 border-stone-300 border-dashed font-medium';
    }
    if (status === 'Ruim produseerbaar') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    }
    if (status === 'Beperkte productie') {
      return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
    }
    return 'bg-rose-50 text-rose-900 border-rose-300 font-bold';
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
            Berekening van het maximaal te branden volume op basis van uitsluitend door de beheerder ingevoerde groene voorraad. Geen aannames of schattingen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capacitiesList.map((cap) => {
          const recipe = blendRecipes[cap.blendId];
          const hasData = cap.hasSufficientData && cap.availableProductionKg !== null && cap.availableRoastedKg !== null;
          const isBottleneckSevere = hasData && (cap.availableProductionKg ?? 0) < 30;

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
                    className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(
                      cap.status
                    )}`}
                  >
                    {cap.status}
                  </span>
                </div>

                {/* Main Metric Capacity */}
                {hasData ? (
                  <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div className="text-xs font-semibold text-stone-600 flex items-center justify-between">
                      <span>Maximaal te produceren gebrand:</span>
                      <span className="text-stone-400 font-normal text-[11px]">
                        (o.b.v. {cap.availableProductionKg!.toFixed(0)} kg groen)
                      </span>
                    </div>
                    <div className="text-2xl font-black text-stone-900 mt-1 flex items-baseline gap-1.5">
                      <span>{cap.availableRoastedKg!.toFixed(1)}</span>
                      <span className="text-sm font-semibold text-amber-800">kg gebrand</span>
                    </div>

                    {/* Limiting Bottleneck Factor */}
                    {cap.bottleneckGreenCoffeeName && (
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
                            ({cap.bottleneckAvailableKg} kg voorradig · aandeel{' '}
                            {cap.limitingComponentPct}%)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-950">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Onvoldoende Data (Capaciteit Onbekend)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Productiecapaciteit kan pas berekend worden zodra alle vereiste componenten een door de beheerder ingevoerde voorraad hebben.
                    </p>
                    {cap.unconfiguredComponents && cap.unconfiguredComponents.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-amber-200/80 text-[11px]">
                        <span className="font-semibold text-amber-950">Nog in te voeren bonen:</span>
                        <ul className="list-disc list-inside mt-0.5 text-amber-900 space-y-0.5">
                          {cap.unconfiguredComponents.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Recipe Breakdown */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Samenstelling van recept:
                  </div>
                  <div className="space-y-1">
                    {cap.componentBreakdown.map((comp) => {
                      const isLimiting = hasData && comp.greenCoffeeId === cap.bottleneckGreenCoffeeId;
                      const isCompConfigured = comp.isConfigured !== false;

                      return (
                        <div
                          key={comp.greenCoffeeId}
                          className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                            !isCompConfigured
                              ? 'bg-stone-50 border-stone-300/80 text-stone-600'
                              : isLimiting
                              ? 'bg-amber-50/60 border-amber-300/80 text-amber-950 font-semibold'
                              : 'bg-stone-50/60 border-stone-200/60 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isCompConfigured ? 'bg-amber-700' : 'bg-stone-400'}`} />
                            <span>{comp.greenCoffeeName}</span>
                            <span className="text-[10px] text-stone-500 font-normal">({comp.percentage}%)</span>
                          </div>
                          <div className="text-right font-mono text-[11px]">
                            {isCompConfigured ? (
                              <span>{comp.availableKg} kg groen</span>
                            ) : (
                              <span className="text-stone-400 italic">Niet geconfigureerd</span>
                            )}
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
                  disabled={!hasData}
                  className={`w-full mt-2 py-2 px-3 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs ${
                    hasData
                      ? 'bg-amber-900 hover:bg-amber-800 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${hasData ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span>{hasData ? 'Registreer Brandbatch' : 'Invoer Grondstof Vereist'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
