import React, { useState } from 'react';
import { GreenCoffeeItem } from '../../types';
import { useStock } from '../../context/StockContext';
import { Wheat, Save, Plus, ArrowUpRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const GreenCoffeeManagement: React.FC = () => {
  const { greenCoffee, updateGreenCoffee, refreshStock, isLoading } = useStock();

  const [editingState, setEditingState] = useState<
    Record<
      string,
      {
        availableKg: number;
        reservedKg: number;
        incomingKg: number;
        status: GreenCoffeeItem['status'];
      }
    >
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  const items = Object.values(greenCoffee);

  const getStatusBadge = (status: GreenCoffeeItem['status']) => {
    switch (status) {
      case 'Niet geconfigureerd':
        return 'bg-stone-100 text-stone-700 border-dashed border-stone-300';
      case 'Ruim op voorraad':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Lage voorraad':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Nabesteld':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'Onderweg':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'Uitverkocht':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const handleFieldChange = (
    id: string,
    field: 'availableKg' | 'reservedKg' | 'incomingKg' | 'status',
    value: any
  ) => {
    setEditingState((prev) => {
      const current = prev[id] || {
        availableKg: greenCoffee[id]?.availableKg || 0,
        reservedKg: greenCoffee[id]?.reservedKg || 0,
        incomingKg: greenCoffee[id]?.incomingKg || 0,
        status: greenCoffee[id]?.status || 'Ruim op voorraad',
      };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: field === 'status' ? value : Math.max(0, parseFloat(value) || 0),
        },
      };
    });
  };

  const handleSave = async (id: string) => {
    const item = greenCoffee[id];
    if (!item) return;

    const changes = editingState[id] || {
      availableKg: item.availableKg,
      reservedKg: item.reservedKg,
      incomingKg: item.incomingKg,
      status: item.status,
    };

    setSavingId(id);
    try {
      const success = await updateGreenCoffee(id, changes);
      if (success) {
        setEditingState((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setSaveSuccessMsg(`Groene voorraad voor ${item.name} (${item.origin}) succesvol opgeslagen.`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert(`Fout bij opslaan: ${err?.message || err}`);
    } finally {
      setSavingId(null);
    }
  };

  const handleQuickAdd = (id: string, addKg: number) => {
    const current = editingState[id]?.availableKg ?? greenCoffee[id]?.availableKg ?? 0;
    handleFieldChange(id, 'availableKg', current + addKg);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-amber-800" />
            <span>Groene Koffie Voorraad (Ruwe Bonen per Herkomst)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Realtime beheer van ongebrande bonen per herkomst. Uitsluitend handmatig ingevoerde data is geldig. Wijzigingen werken direct door in brandcapaciteit en blendcalculaties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshStock}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Laden...' : 'Verversen'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Herkomst & Groene Koffie</th>
                <th className="py-3 px-3">Beschikbaar (kg)</th>
                <th className="py-3 px-3">Gereserveerd (kg)</th>
                <th className="py-3 px-3">Inkomend (kg)</th>
                <th className="py-3 px-3">Status Herkomst</th>
                <th className="py-3 px-3">Snelle Aanvulknop</th>
                <th className="py-3 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {items.map((item) => {
                const currentDraft = editingState[item.id];
                const availableKg = currentDraft?.availableKg !== undefined ? currentDraft.availableKg : item.availableKg;
                const reservedKg = currentDraft?.reservedKg !== undefined ? currentDraft.reservedKg : item.reservedKg;
                const incomingKg = currentDraft?.incomingKg !== undefined ? currentDraft.incomingKg : item.incomingKg;
                const status = currentDraft?.status || item.status;
                const isSaving = savingId === item.id;
                const hasChanges = currentDraft !== undefined;

                const isConfigured = item.isConfigured !== false;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                        <span>{item.name}</span>
                        {!isConfigured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            Niet geconfigureerd (0 kg)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                        <span className="font-mono text-amber-800 font-semibold">{item.origin}</span>
                        <span>· ID: {item.id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="50000"
                          step="1"
                          value={availableKg}
                          onChange={(e) => handleFieldChange(item.id, 'availableKg', e.target.value)}
                          className="w-20 text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-mono font-semibold focus:ring-1 focus:ring-amber-900"
                        />
                        <span className="text-stone-500 font-medium">kg</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="50000"
                          step="1"
                          value={reservedKg}
                          onChange={(e) => handleFieldChange(item.id, 'reservedKg', e.target.value)}
                          className="w-18 text-xs p-1.5 rounded-lg border border-stone-200 bg-stone-50 font-mono text-stone-600 focus:bg-white focus:ring-1 focus:ring-amber-900"
                        />
                        <span className="text-stone-400 font-medium">kg</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="50000"
                          step="1"
                          value={incomingKg}
                          onChange={(e) => handleFieldChange(item.id, 'incomingKg', e.target.value)}
                          className="w-18 text-xs p-1.5 rounded-lg border border-stone-200 bg-stone-50 font-mono text-blue-700 focus:bg-white focus:ring-1 focus:ring-amber-900"
                        />
                        <span className="text-stone-400 font-medium">kg</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={status}
                        onChange={(e) => handleFieldChange(item.id, 'status', e.target.value)}
                        className={`text-xs font-semibold py-1.5 px-2 rounded-lg border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-900 ${getStatusBadge(
                          status
                        )}`}
                      >
                        <option value="Niet geconfigureerd">Niet geconfigureerd</option>
                        <option value="Ruim op voorraad">Ruim op voorraad</option>
                        <option value="Lage voorraad">Lage voorraad</option>
                        <option value="Nabesteld">Nabesteld</option>
                        <option value="Onderweg">Onderweg</option>
                        <option value="Uitverkocht">Uitverkocht</option>
                      </select>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.id, 60)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-[10px] font-semibold cursor-pointer"
                          title="+60 kg jute zak toevoegen"
                        >
                          +60 kg zak
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.id, 120)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-[10px] font-semibold cursor-pointer"
                          title="+120 kg (2 zakken) toevoegen"
                        >
                          +120 kg
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={isSaving || (!hasChanges && isConfigured)}
                        onClick={() => handleSave(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-white font-semibold text-xs transition-colors flex items-center gap-1 ml-auto shadow-2xs ${
                          isSaving
                            ? 'bg-amber-700 opacity-70 cursor-wait'
                            : hasChanges || !isConfigured
                            ? 'bg-emerald-700 hover:bg-emerald-600 cursor-pointer ring-1 ring-emerald-500'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Opslaan...' : 'Opslaan'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
