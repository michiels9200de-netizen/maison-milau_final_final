import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { Flame, X, CheckCircle2, History, Calendar, User, Scale } from 'lucide-react';

interface RoastBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBlendId?: string;
}

export const RoastBatchModal: React.FC<RoastBatchModalProps> = ({
  isOpen,
  onClose,
  initialBlendId,
}) => {
  const { blendRecipes, executeRoastBatch, roastBatches } = useStock();

  const recipeKeys = Object.keys(blendRecipes);
  const defaultBlendId = recipeKeys.length > 0 ? recipeKeys[0] : 'blend-budget-espresso';

  const [selectedBlendId, setSelectedBlendId] = useState<string>(
    initialBlendId && blendRecipes[initialBlendId] ? initialBlendId : defaultBlendId
  );

  React.useEffect(() => {
    if (initialBlendId && blendRecipes[initialBlendId]) {
      setSelectedBlendId(initialBlendId);
    } else if (!blendRecipes[selectedBlendId] && recipeKeys.length > 0) {
      setSelectedBlendId(recipeKeys[0]);
    }
  }, [initialBlendId, blendRecipes]);
  const [greenKg, setGreenKg] = useState<number>(15);
  const [roastedKg, setRoastedKg] = useState<number>(12.6);
  const [roasterName, setRoasterName] = useState<string>('Hoofdbrander Laurent');
  const [roastDate, setRoastDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('Optimale ontwikkeling crack 1 bij 204°C, volle aromastructuur.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(
    null
  );

  const activeRecipe = blendRecipes[selectedBlendId];

  // Auto-calculate roasted yield whenever greenKg or blend changes
  const handleGreenKgChange = (kg: number) => {
    setGreenKg(kg);
    const yieldPct = activeRecipe ? activeRecipe.roastYieldPct : 84;
    const estimatedRoasted = Math.round(kg * (yieldPct / 100) * 10) / 10;
    setRoastedKg(estimatedRoasted);
  };

  const handleBlendChange = (blendId: string) => {
    setSelectedBlendId(blendId);
    const recipe = blendRecipes[blendId];
    const yieldPct = recipe ? recipe.roastYieldPct : 84;
    const estimatedRoasted = Math.round(greenKg * (yieldPct / 100) * 10) / 10;
    setRoastedKg(estimatedRoasted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (greenKg <= 0 || roastedKg <= 0) {
      alert('Vul een geldig gewicht in voor groene bonen en gebrande bonen.');
      return;
    }

    setIsSubmitting(true);
    setResultMessage(null);

    try {
      const res = await executeRoastBatch({
        blendId: selectedBlendId,
        greenKgUsed: greenKg,
        roaster: roasterName,
        notes,
      });

      if (res.success) {
        setResultMessage({
          success: true,
          text: `Batch succesvol verwerkt! ${res.batch?.batchNumber}: ${roastedKg} kg gebrande koffie toegevoegd aan voorraad en ${greenKg} kg groene bonen afgeboekt.`,
        });
        setTimeout(() => {
          setResultMessage(null);
          onClose();
        }, 3000);
      } else {
        setResultMessage({ success: false, text: res.message });
      }
    } catch (err: any) {
      setResultMessage({
        success: false,
        text: err?.message || 'Onbekende fout bij verwerken van brandbatch.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-700" />
            <span>Ambachtelijke Branderij Productie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            Voltooide Brandbatch Registreren
          </h2>
          <p className="text-xs text-stone-500">
            Boekt direct de gebruikte groene koffie af uit het magazijn en vermeerdert automatisch de gebrande voorraad in de webshop.
          </p>
        </div>

        {resultMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              resultMessage.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300'
            }`}
          >
            {resultMessage.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blend selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Selecteer Recept / Blend</label>
              <select
                value={selectedBlendId}
                onChange={(e) => handleBlendChange(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-900"
              >
                {Object.values(blendRecipes).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.blendName} ({r.roastYieldPct}% rendement)
                  </option>
                ))}
              </select>
            </div>

            {/* Roaster Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Naam Meesterbrander</label>
              <input
                type="text"
                value={roasterName}
                onChange={(e) => setRoasterName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-900"
                placeholder="bv. Laurent of Thomas"
                required
              />
            </div>

            {/* Green KG */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Groene Koffie Gebruikt (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={greenKg}
                  onChange={(e) => handleGreenKgChange(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-mono font-semibold focus:ring-2 focus:ring-amber-900"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                  kg groen
                </span>
              </div>
            </div>

            {/* Roasted KG */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Gebrande Koffie Geproduceerd (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.1"
                  value={roastedKg}
                  onChange={(e) => setRoastedKg(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 font-mono font-bold text-amber-950 focus:ring-2 focus:ring-amber-900"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800 font-semibold text-xs">
                  kg gebrand
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Branddatum</label>
              <input
                type="date"
                value={roastDate}
                onChange={(e) => setRoastDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-900"
                required
              />
            </div>

            {/* Yield Indicator */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Berekend Rendement</label>
              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono font-semibold text-stone-700">
                {greenKg > 0 ? ((roastedKg / greenKg) * 100).toFixed(1) : 0}%{' '}
                <span className="text-stone-500 font-normal font-sans">
                  ({(greenKg - roastedKg).toFixed(1)} kg vochtverlies)
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">Branderij Notities & Profiel</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-900"
              placeholder="bv. Eerste crack bij 9:15, afkoeltijd 3:20"
            />
          </div>

          {/* Recipe Components Breakdown Notice */}
          {activeRecipe && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-800">
                Automatische afboeking van groene bonen voor deze batch:
              </div>
              <ul className="text-stone-600 list-disc list-inside space-y-0.5 text-[11px]">
                {activeRecipe.components.map((c) => {
                  const usedCompKg = (greenKg * (c.percentage / 100)).toFixed(2);
                  return (
                    <li key={c.greenCoffeeId}>
                      <strong>{usedCompKg} kg</strong> {c.greenCoffeeName} ({c.percentage}%)
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Bezig met registreren...' : 'Batch Registreren & Verwerken'}</span>
            </button>
          </div>
        </form>

        {/* History of Batches */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
            <History className="w-4 h-4 text-stone-500" />
            <span>Recente Brandbatches ({roastBatches.length})</span>
          </div>

          <div className="overflow-x-auto max-h-48 border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase text-[9px] border-b border-stone-200">
                <tr>
                  <th className="p-2">Batch #</th>
                  <th className="p-2">Blend / Koffie</th>
                  <th className="p-2">Groen (kg)</th>
                  <th className="p-2">Gebrand (kg)</th>
                  <th className="p-2">Brander</th>
                  <th className="p-2">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {roastBatches.slice(0, 8).map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="p-2 font-mono font-bold text-amber-900">{b.batchNumber}</td>
                    <td className="p-2 font-medium">{b.blendName}</td>
                    <td className="p-2 font-mono">{b.greenKgUsed} kg</td>
                    <td className="p-2 font-mono font-bold text-emerald-800">
                      +{b.roastedKgProduced} kg
                    </td>
                    <td className="p-2 text-stone-600">{b.roaster}</td>
                    <td className="p-2 text-stone-500 font-mono text-[10px]">{b.roastDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
