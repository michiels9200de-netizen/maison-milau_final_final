import React, { useState, useMemo } from 'react';
import { useCoffeeDossiers } from '../../context/CoffeeDossierContext';
import { CentralCoffeeDossier } from '../../types/dossier';
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  FileDown,
  QrCode,
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  Compass,
  Coffee,
  Info,
  Layers,
  Copy,
  RotateCcw,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface CoffeeDossierManagerProps {
  navigate?: (path: string) => void;
}

export const CoffeeDossierManager: React.FC<CoffeeDossierManagerProps> = ({ navigate }) => {
  const { dossiers, dossierList, updateDossier, createDossier, exportDossierPdf, getQrCodeUrl, resetToDefaults } =
    useCoffeeDossiers();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  // Edit / Modal State
  const [editingDossier, setEditingDossier] = useState<CentralCoffeeDossier | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'basis' | 'story' | 'origin' | 'sensory' | 'brew' | 'transparency' | 'internal'>('basis');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // QR Modal State
  const [activeQrDossier, setActiveQrDossier] = useState<CentralCoffeeDossier | null>(null);
  const [qrCopied, setQrCopied] = useState(false);

  // Temp tag input states
  const [newTagInput, setNewTagInput] = useState('');
  const [newBrewInput, setNewBrewInput] = useState('');

  // Collections for filter
  const collections = useMemo(() => {
    const set = new Set<string>();
    dossierList.forEach((d) => {
      if (d.collection) set.add(d.collection);
    });
    return Array.from(set);
  }, [dossierList]);

  // Filtered list
  const filteredDossiers = useMemo(() => {
    return dossierList.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.varietal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.flavourNotes?.some((n) => n.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCollection =
        selectedCollection === 'all' || d.collection?.toLowerCase() === selectedCollection.toLowerCase();

      return matchesSearch && matchesCollection;
    });
  }, [dossierList, searchTerm, selectedCollection]);

  // Open Edit Modal
  const handleEdit = (dossier: CentralCoffeeDossier) => {
    setEditingDossier({ ...dossier });
    setIsCreatingNew(false);
    setActiveTab('basis');
    setSaveSuccess(false);
  };

  // Open Create New Modal
  const handleAddNew = () => {
    const newId = `custom-coffee-${Date.now().toString(36)}`;
    setEditingDossier({
      id: newId,
      productName: 'Nieuwe Koffie',
      shortIntro: 'Korte wervende inleiding over het karakter van deze koffie.',
      coffeeStory: 'Het volledige ambachtelijke verhaal over de oorsprong, oogst en brandfilosofie.',
      origin: 'Bijv. Colombia',
      region: 'Bijv. Huila',
      farmProducer: 'Bijv. Finca El Mirador',
      varietal: 'Bijv. 100% Arabica Caturra',
      processingMethod: 'Bijv. Washed',
      roastProfile: 'Medium Espresso',
      flavourNotes: ['Pure Chocolade', 'Karamel'],
      body: '4/5',
      acidity: '2/5',
      sweetness: '3/5',
      recommendedBrewingMethods: ['Espresso', 'Volautomaat'],
      foodPairings: 'Pure chocolade, biscotti',
      traceabilityInfo: 'Direct Trade en traceerbaar lot.',
      sustainabilityInfo: 'Ethische bodemprijs voor de producent.',
      additionalNotes: '',
      internalNotes: '',
      collection: 'Specialty',
      type: 'Espresso',
      lastUpdated: new Date().toISOString(),
    });
    setIsCreatingNew(true);
    setActiveTab('basis');
    setSaveSuccess(false);
  };

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingDossier) return;

    setIsSaving(true);
    try {
      if (isCreatingNew) {
        await createDossier(editingDossier);
      } else {
        await updateDossier(editingDossier.id, editingDossier);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingDossier(null);
        setIsCreatingNew(false);
      }, 1400);
    } catch (err) {
      console.error('Error saving dossier:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Tag helper
  const addFlavourTag = () => {
    if (!newTagInput.trim() || !editingDossier) return;
    const current = editingDossier.flavourNotes || [];
    if (!current.includes(newTagInput.trim())) {
      setEditingDossier({
        ...editingDossier,
        flavourNotes: [...current, newTagInput.trim()],
      });
    }
    setNewTagInput('');
  };

  const removeFlavourTag = (tagToRemove: string) => {
    if (!editingDossier) return;
    setEditingDossier({
      ...editingDossier,
      flavourNotes: (editingDossier.flavourNotes || []).filter((t) => t !== tagToRemove),
    });
  };

  const addBrewMethod = () => {
    if (!newBrewInput.trim() || !editingDossier) return;
    const current = editingDossier.recommendedBrewingMethods || [];
    if (!current.includes(newBrewInput.trim())) {
      setEditingDossier({
        ...editingDossier,
        recommendedBrewingMethods: [...current, newBrewInput.trim()],
      });
    }
    setNewBrewInput('');
  };

  const removeBrewMethod = (methodToRemove: string) => {
    if (!editingDossier) return;
    setEditingDossier({
      ...editingDossier,
      recommendedBrewingMethods: (editingDossier.recommendedBrewingMethods || []).filter((m) => m !== methodToRemove),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System of Record Notice */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Centraal Koffiedossier Systeem (Single Source of Truth)
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-2xs font-bold rounded-full uppercase tracking-wider">
                Actief
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Elke koffie heeft één centraal dossier. Een wijziging hier propageert <strong>onmiddellijk en automatisch</strong> naar alle kanalen: de <em>Meer Info</em> modals in de webshop en koffiegids, het publieke digitale paspoort, PDF-leaflets en QR-code landingspagina&apos;s.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Nieuw Dossier Toevoegen
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Collection Filters */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zoek op naam, herkomst, variëteit of smaak..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 bg-stone-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Collection Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCollection === 'all'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Alle ({dossierList.length})
          </button>
          {collections.map((col) => {
            const count = dossierList.filter((d) => d.collection === col).length;
            return (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCollection === col
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {col} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Dossier Table / Cards */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Koffie / Product</th>
                <th className="px-4 py-3">Collectie</th>
                <th className="px-4 py-3">Herkomst & Terroir</th>
                <th className="px-4 py-3">Smaakprofiel</th>
                <th className="px-4 py-3">Sensoriek</th>
                <th className="px-4 py-3 text-center">QR & PDF</th>
                <th className="px-4 py-3 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDossiers.map((dossier) => (
                <tr key={dossier.id} className="hover:bg-amber-50/40 transition-colors group">
                  {/* Name & Intro */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="font-serif font-bold text-stone-900 text-sm">{dossier.productName}</div>
                    <div className="text-stone-500 line-clamp-1 text-2xs mt-0.5">{dossier.shortIntro}</div>
                    {dossier.internalNotes && (
                      <div className="inline-flex items-center gap-1 text-amber-800 text-3xs font-medium mt-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        <Lock className="w-2.5 h-2.5" />
                        Interne nota aanwezig
                      </div>
                    )}
                  </td>

                  {/* Collection */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-full font-semibold text-2xs border border-stone-200">
                      {dossier.collection}
                    </span>
                    {dossier.type && (
                      <div className="text-3xs text-stone-500 mt-1 uppercase tracking-wider font-medium">
                        {dossier.type}
                      </div>
                    )}
                  </td>

                  {/* Origin */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-stone-800">{dossier.origin || 'Onbekend'}</div>
                    <div className="text-stone-500 text-2xs">{dossier.region || 'Diverse'}</div>
                    <div className="text-3xs text-stone-400 mt-0.5 truncate max-w-[140px]">{dossier.varietal}</div>
                  </td>

                  {/* Flavour Notes */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(dossier.flavourNotes || []).slice(0, 3).map((note, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/60 rounded text-3xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                      {(dossier.flavourNotes || []).length > 3 && (
                        <span className="text-3xs text-stone-400 self-center">
                          +{dossier.flavourNotes.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Sensory */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-3xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-700">Body:</span> {dossier.body?.split(' ')[0] || dossier.body}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700">Aciditeit:</span> {dossier.acidity?.split(' ')[0] || dossier.acidity}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700">Zoetheid:</span> {dossier.sweetness?.split(' ')[0] || dossier.sweetness}
                    </div>
                  </td>

                  {/* QR & PDF Quick export */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveQrDossier(dossier)}
                        title="Toon QR-code voor verpakking/marketing"
                        className="p-1.5 text-stone-600 hover:text-amber-900 hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => exportDossierPdf(dossier)}
                        title="Download officieel Dossier PDF Leaflet"
                        className="p-1.5 text-stone-600 hover:text-amber-900 hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (navigate) {
                            navigate(`/dossier/${dossier.id}`);
                          } else {
                            window.open(`/dossier/${dossier.id}`, '_blank');
                          }
                        }}
                        title="Bekijk Live Klantendossier Pagina"
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </button>

                      <button
                        onClick={() => handleEdit(dossier)}
                        className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg transition-colors shadow-2xs inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Bewerk
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDossiers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-500">
                    Geen koffiedossiers gevonden voor de zoekopdracht &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 text-2xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Totaal {dossierList.length} koffiedossiers in de centrale databank · Enkelvoudige bron van waarheid
          </div>
          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors"
            title="Herstel fabrieksinstellingen dossiers"
          >
            <RotateCcw className="w-3 h-3" />
            Herstel alle standaarddossiers
          </button>
        </div>
      </div>

      {/* =========================================================================
          FULL DOSSIER EDITOR MODAL (SINGLE SOURCE OF TRUTH)
      ========================================================================= */}
      {editingDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-800/50 flex items-center justify-center border border-amber-600/40">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {isCreatingNew ? 'Nieuw Koffiedossier Aanmaken' : `Koffiedossier: ${editingDossier.productName}`}
                  </h3>
                  <p className="text-2xs text-amber-200/80">
                    Eén keer bewerken hier = automatische synchronisatie naar alle aangesloten pagina&apos;s
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingDossier(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Tabs Navigation */}
            <div className="bg-stone-100 border-b border-stone-200 px-4 flex gap-1 overflow-x-auto shrink-0 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('basis')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'basis'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                1. Basis & Info
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'story'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                2. Het Koffieverhaal
              </button>
              <button
                onClick={() => setActiveTab('origin')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'origin'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                3. Terroir & Herkomst
              </button>
              <button
                onClick={() => setActiveTab('sensory')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'sensory'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                4. Smaak & Sensoriek
              </button>
              <button
                onClick={() => setActiveTab('brew')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'brew'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                5. Zetadvies & Pairing
              </button>
              <button
                onClick={() => setActiveTab('transparency')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'transparency'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                6. Traceerbaarheid & Duurzaamheid
              </button>
              <button
                onClick={() => setActiveTab('internal')}
                className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'internal'
                    ? 'border-amber-900 text-amber-900 bg-white'
                    : 'border-transparent text-amber-800/80 hover:text-amber-900'
                }`}
              >
                <Lock className="w-3 h-3 text-amber-700" />
                7. Interne Notities (Admin)
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIS & INFO */}
              {activeTab === 'basis' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Product Naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingDossier.productName}
                        onChange={(e) => setEditingDossier({ ...editingDossier, productName: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 font-bold"
                        placeholder="bijv. Budget Espresso of Pink Bourbon"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Collectie *
                      </label>
                      <select
                        value={editingDossier.collection}
                        onChange={(e) => setEditingDossier({ ...editingDossier, collection: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                      >
                        <option value="Budget">Budget</option>
                        <option value="Value">Value</option>
                        <option value="Selection">Selection</option>
                        <option value="Premium">Premium</option>
                        <option value="Prestige">Prestige</option>
                        <option value="Single Origin">Single Origin</option>
                        <option value="Barrel Aged">Barrel Aged</option>
                        <option value="Infused">Infused</option>
                        <option value="Specialty">Specialty</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Type / Bereiding
                      </label>
                      <input
                        type="text"
                        value={editingDossier.type || ''}
                        onChange={(e) => setEditingDossier({ ...editingDossier, type: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                        placeholder="Espresso, Daily, Filter, Specialty"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        SCA Score
                      </label>
                      <input
                        type="text"
                        value={editingDossier.scaScore || ''}
                        onChange={(e) => setEditingDossier({ ...editingDossier, scaScore: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                        placeholder="bijv. 84-85 of 88.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Gekoppeld Webshop ID / SKU
                      </label>
                      <input
                        type="text"
                        value={editingDossier.webshopProductId || editingDossier.id}
                        onChange={(e) => setEditingDossier({ ...editingDossier, webshopProductId: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg text-stone-600 font-mono"
                        placeholder="prod-budget-espresso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Korte Introductie (Short Introduction) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingDossier.shortIntro}
                      onChange={(e) => setEditingDossier({ ...editingDossier, shortIntro: e.target.value })}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                      placeholder="Beknopte samenvatting van 1-2 zinnen voor overzichtskaarten en productintroducties."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Aanvullende Publieke Notities (Additional Notes)
                    </label>
                    <textarea
                      rows={2}
                      value={editingDossier.additionalNotes}
                      onChange={(e) => setEditingDossier({ ...editingDossier, additionalNotes: e.target.value })}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                      placeholder="Optionele extra toelichting, serveertips of seizoensdetails."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: COFFEE STORY */}
              {activeTab === 'story' && (
                <div className="space-y-4">
                  <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Het <strong>Koffieverhaal</strong> is het centrale narratief dat verschijnt in de &quot;Meer Info&quot; modal, op de digitale dossierpagina en in de gedownloade PDF leaflets.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Koffie Verhaal & Achtergrond (Coffee Story) *
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={editingDossier.coffeeStory}
                      onChange={(e) => setEditingDossier({ ...editingDossier, coffeeStory: e.target.value })}
                      className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 leading-relaxed font-serif"
                      placeholder="Schrijf hier het uitgebreide verhaal over de producent, het microklimaat, de brandfilosofie en de unieke belevingswaarde..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ORIGIN & TERROIR */}
              {activeTab === 'origin' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Land van Herkomst (Origin) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingDossier.origin}
                        onChange={(e) => setEditingDossier({ ...editingDossier, origin: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. Colombia & Brazilië"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Regio (Region)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.region}
                        onChange={(e) => setEditingDossier({ ...editingDossier, region: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. Huila & Antioquia"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Plantage / Producent (Farm / Producer)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.farmProducer}
                        onChange={(e) => setEditingDossier({ ...editingDossier, farmProducer: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. Finca Monteblanco / Rodrigo Sanchez"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Variëteit (Varietal)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.varietal}
                        onChange={(e) => setEditingDossier({ ...editingDossier, varietal: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. 100% Arabica Pink Bourbon"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Verwerkingsmethode (Processing Method)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.processingMethod}
                        onChange={(e) => setEditingDossier({ ...editingDossier, processingMethod: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. Washed & Sun-dried op Afrikaanse bedden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Brandprofiel (Roast Profile)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.roastProfile}
                        onChange={(e) => setEditingDossier({ ...editingDossier, roastProfile: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. Medium espresso roast (Development: 18%)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SENSORY & FLAVOURS */}
              {activeTab === 'sensory' && (
                <div className="space-y-5">
                  {/* Flavour Notes Editor */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Smaaknotities (Flavour Notes)
                    </label>
                    <div className="flex gap-2 mb-2.5">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFlavourTag();
                          }
                        }}
                        placeholder="Typ een smaaknotitie (bijv. 'Pure Chocolade') en druk op toevoegen..."
                        className="flex-1 text-xs p-2 border border-stone-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={addFlavourTag}
                        className="px-3 py-2 bg-stone-800 text-white rounded-lg text-xs font-bold hover:bg-stone-900"
                      >
                        Toevoegen
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 border border-stone-200 rounded-lg min-h-[50px]">
                      {(editingDossier.flavourNotes || []).map((note) => (
                        <span
                          key={note}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100/80 text-amber-950 border border-amber-300/80 rounded-md text-xs font-medium"
                        >
                          {note}
                          <button
                            type="button"
                            onClick={() => removeFlavourTag(note)}
                            className="text-amber-800 hover:text-red-700 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(editingDossier.flavourNotes || []).length === 0 && (
                        <span className="text-xs text-stone-400 italic">Nog geen smaaknotities toegevoegd.</span>
                      )}
                    </div>
                  </div>

                  {/* Body, Acidity, Sweetness */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Body
                      </label>
                      <input
                        type="text"
                        value={editingDossier.body}
                        onChange={(e) => setEditingDossier({ ...editingDossier, body: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. 5/5 (Zeer vol en romig)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Aciditeit (Acidity)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.acidity}
                        onChange={(e) => setEditingDossier({ ...editingDossier, acidity: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. 2/5 (Zacht, laag)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Zoetheid (Sweetness)
                      </label>
                      <input
                        type="text"
                        value={editingDossier.sweetness}
                        onChange={(e) => setEditingDossier({ ...editingDossier, sweetness: e.target.value })}
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-medium"
                        placeholder="bijv. 4/5 (Rijpe perzikzoetheid)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: BREW METHODS & PAIRINGS */}
              {activeTab === 'brew' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Aanbevolen Zetwijzen (Brewing Methods)
                    </label>
                    <div className="flex gap-2 mb-2.5">
                      <input
                        type="text"
                        value={newBrewInput}
                        onChange={(e) => setNewBrewInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addBrewMethod();
                          }
                        }}
                        placeholder="Voeg methode toe (bijv. 'Espresso', 'V60', 'Volautomaat')..."
                        className="flex-1 text-xs p-2 border border-stone-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={addBrewMethod}
                        className="px-3 py-2 bg-stone-800 text-white rounded-lg text-xs font-bold hover:bg-stone-900"
                      >
                        Toevoegen
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 border border-stone-200 rounded-lg min-h-[50px]">
                      {(editingDossier.recommendedBrewingMethods || []).map((method) => (
                        <span
                          key={method}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200 text-stone-800 rounded-md text-xs font-medium"
                        >
                          {method}
                          <button
                            type="button"
                            onClick={() => removeBrewMethod(method)}
                            className="text-stone-600 hover:text-red-700 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Gastronomische Combinaties (Food Pairings)
                    </label>
                    <textarea
                      rows={3}
                      value={editingDossier.foodPairings}
                      onChange={(e) => setEditingDossier({ ...editingDossier, foodPairings: e.target.value })}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg leading-relaxed"
                      placeholder="bijv. Biscotti, pure chocolade (>70%), tiramisu of rijpe zachte kazen."
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: TRACEABILITY & SUSTAINABILITY */}
              {activeTab === 'transparency' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Traceerbaarheid & Transparantie (Traceability Info)
                    </label>
                    <textarea
                      rows={3}
                      value={editingDossier.traceabilityInfo}
                      onChange={(e) => setEditingDossier({ ...editingDossier, traceabilityInfo: e.target.value })}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg leading-relaxed"
                      placeholder="bijv. Direct Trade gecertificeerd via exporteur in Neiva, micro-lot B-2026."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Duurzaamheid & Ethische Impact (Sustainability Info)
                    </label>
                    <textarea
                      rows={3}
                      value={editingDossier.sustainabilityInfo}
                      onChange={(e) => setEditingDossier({ ...editingDossier, sustainabilityInfo: e.target.value })}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg leading-relaxed"
                      placeholder="bijv. Gegarandeerde bodemprijs 40% boven fairtrade, biologische schaduwteelt en herbebossing."
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: INTERNAL NOTES (ADMIN ONLY) */}
              {activeTab === 'internal' && (
                <div className="space-y-4">
                  <div className="bg-amber-950/5 border border-amber-900/20 p-3.5 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Vertrouwelijke Interne Notities (Strikt Privé)</span>
                      Deze gegevens zijn <strong>uitsluitend zichtbaar voor beheerders</strong> in het admin panel. Ze worden nooit getoond aan klanten in de webshop, PDF leaflets of op de QR-code pagina.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Interne Meesterbrander & Inkoopnotities (Internal Notes)
                    </label>
                    <textarea
                      rows={6}
                      value={editingDossier.internalNotes}
                      onChange={(e) => setEditingDossier({ ...editingDossier, internalNotes: e.target.value })}
                      className="w-full text-xs p-3 border border-amber-300/80 rounded-lg bg-amber-50/20 font-mono text-stone-800 leading-relaxed"
                      placeholder="bijv. Inkoopprijs $4.20/lb FOB, batchgrootte max 20kg, ideale droogtijd 12 dagen, marge 62%."
                    />
                  </div>
                </div>
              )}

              {/* Success Notification Banner */}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Dossier succesvol opgeslagen! Alle gekoppelde pagina&apos;s zijn direct automatisch geüpdatet.
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-2xs text-stone-500">
                  ID: <span className="font-mono">{editingDossier.id}</span> · Laatste update:{' '}
                  {new Date(editingDossier.lastUpdated).toLocaleTimeString('nl-BE')}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDossier(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Annuleren
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Opslaan...' : 'Dossier Opslaan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          QR CODE PREVIEW & COPY MODAL
      ========================================================================= */}
      {activeQrDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                QR-Code voor Verpakking
              </h3>
              <button
                onClick={() => setActiveQrDossier(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-2xs text-stone-500 mb-4">
              Product: <strong>{activeQrDossier.productName}</strong>
              <br />
              Wanneer de consument deze QR scant, opent het officiële digitale dossier direct.
            </p>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 inline-block mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                  getQrCodeUrl(activeQrDossier.id)
                )}&color=451a03&bgcolor=ffffff`}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="bg-stone-100 p-2 rounded text-3xs font-mono text-stone-600 truncate mb-4 select-all">
              {getQrCodeUrl(activeQrDossier.id)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getQrCodeUrl(activeQrDossier.id));
                  setQrCopied(true);
                  setTimeout(() => setQrCopied(false), 2000);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {qrCopied ? 'Gekopieerd!' : 'Kopieer Link'}
              </button>
              <button
                onClick={() => exportDossierPdf(activeQrDossier)}
                className="flex-1 inline-flex items-center justify-center gap-1 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
