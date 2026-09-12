import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  QrCode,
  Download,
  Mail,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Flame,
  Globe2,
  Coffee,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Tag,
  BookOpen,
} from 'lucide-react';
import { CoffeeDossier } from '../../types';
import { useDossier } from '../../context/DossierContext';
import { generateQrSvgUrl, getDossierPublicUrl } from '../../utils/qrCode';

const COLLECTION_OPTIONS = [
  'Alle',
  'Budget',
  'Value',
  'Selection',
  'Premium',
  'Prestige',
  'Single Origins',
  'Barrel Aged',
  'Infused',
];

const COMMON_BREW_METHODS = [
  'Espresso',
  'Volautomaat',
  'Filter / V60',
  'Chemex',
  'AeroPress',
  'Moka Pot',
  'French Press',
  'Lungo',
  'Cold Drip',
  'Cappuccino',
];

export const CoffeeDossiersManagement: React.FC<{
  onOpenPublicDossier?: (dossierId: string) => void;
}> = ({ onOpenPublicDossier }) => {
  const { dossiers, isLoading, error, saveDossier, deleteDossier, downloadDossierPdf, refreshDossiers } = useDossier();

  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [activeCollectionFilter, setActiveCollectionFilter] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview_info' | 'preview_qr' | 'preview_pdf' | 'preview_email' | 'preview_passport'>('edit');

  // Active editing state
  const [currentEdit, setCurrentEdit] = useState<CoffeeDossier | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmailSnippet, setCopiedEmailSnippet] = useState(false);

  // Filtered dossier list
  const filteredDossiers = useMemo(() => {
    return dossiers.filter((d) => {
      const matchCollection =
        activeCollectionFilter === 'Alle' ||
        (d.collection && d.collection.toLowerCase() === activeCollectionFilter.toLowerCase()) ||
        (activeCollectionFilter === 'Single Origins' && (d.collection?.toLowerCase().includes('single') || d.id.startsWith('so-')));

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.productName.toLowerCase().includes(q) ||
        d.origin.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.farmProducer.toLowerCase().includes(q) ||
        d.varietal.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        (Array.isArray(d.flavourNotes) && d.flavourNotes.some((n) => n.toLowerCase().includes(q)));

      return matchCollection && matchSearch;
    });
  }, [dossiers, activeCollectionFilter, searchQuery]);

  // Open editor for a dossier
  const handleSelectDossier = (dossier: CoffeeDossier) => {
    setSelectedDossierId(dossier.id);
    setCurrentEdit({ ...dossier });
    setEditorTab('edit');
    setSaveStatus(null);
  };

  // Create new empty dossier
  const handleCreateNew = () => {
    const newId = `coffee-nieuw-${Date.now().toString().slice(-4)}`;
    const newDossier: CoffeeDossier = {
      id: newId,
      slug: newId,
      productName: 'Nieuwe Koffiecreatie',
      shortIntro: 'Korte introductie van dit koffieprofiel.',
      coffeeStory: 'Het ambachtelijke verhaal achter deze oogst en brandwijze.',
      origin: 'Land van herkomst',
      region: 'Regio / Vallei',
      farmProducer: 'Boerderij / Coöperatie / Producent',
      varietal: 'Botanische variëteit (bijv. 100% Caturra)',
      processingMethod: 'Verwerkingsmethode (bijv. Fully Washed)',
      roastProfile: 'Medium Slow Drum Roast',
      flavourNotes: ['Chocolade', 'Noten', 'Karamel'],
      body: 4,
      bodyDescription: 'Rond en romig',
      acidity: 2,
      acidityDescription: 'Zacht en uitgebalanceerd',
      sweetness: 3,
      sweetnessDescription: 'Gekarameliseerde rietsuiker',
      brewingMethods: ['Espresso', 'Volautomaat'],
      foodPairings: 'Past perfect bij pure chocolade en artisanale biscotti.',
      traceabilityInfo: 'Geteeld op 1.500m hoogte. Direct trade import.',
      sustainabilityInfo: 'Eerlijke beloning voor kleinschalige telers en duurzame bodemzorg.',
      additionalNotes: 'Brandadvies en serveertips van onze hoofdbrander.',
      internalNotes: 'Interne brandersnotitie (alleen zichtbaar voor beheerders in het admin panel).',
      collection: 'Selection',
      type: 'Daily',
      scaScore: '84+',
      updatedAt: new Date().toISOString(),
    };
    setSelectedDossierId(newId);
    setCurrentEdit(newDossier);
    setEditorTab('edit');
    setSaveStatus(null);
  };

  // Save changes to Single Source of Truth
  const handleSave = async () => {
    if (!currentEdit) return;
    setIsSaving(true);
    setSaveStatus(null);

    const res = await saveDossier(currentEdit);
    setIsSaving(false);

    if (res.success && res.data) {
      setCurrentEdit({ ...res.data });
      setSelectedDossierId(res.data.id);
      setSaveStatus({
        success: true,
        message: 'Koffiedossier succesvol opgeslagen! Alle gekoppelde pagina’s (Meer Info, Webshop, PDF, QR) zijn automatisch gesynchroniseerd.',
      });
      setTimeout(() => setSaveStatus(null), 5000);
    } else {
      setSaveStatus({
        success: false,
        message: res.error || 'Fout bij opslaan van dossier',
      });
    }
  };

  // Delete dossier
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Weet je zeker dat je het dossier voor '${name}' wilt verwijderen?`)) return;
    const res = await deleteDossier(id);
    if (res.success) {
      if (selectedDossierId === id) {
        setSelectedDossierId(null);
        setCurrentEdit(null);
      }
    } else {
      alert(res.error || 'Kon dossier niet verwijderen');
    }
  };

  // Flavour notes tag management
  const handleAddTag = () => {
    if (!newTagInput.trim() || !currentEdit) return;
    const updated = [...(currentEdit.flavourNotes || []), newTagInput.trim()];
    setCurrentEdit({ ...currentEdit, flavourNotes: updated });
    setNewTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    if (!currentEdit) return;
    const updated = currentEdit.flavourNotes.filter((_, i) => i !== index);
    setCurrentEdit({ ...currentEdit, flavourNotes: updated });
  };

  // Toggle brewing method
  const handleToggleBrewMethod = (method: string) => {
    if (!currentEdit) return;
    const methods = currentEdit.brewingMethods || [];
    const exists = methods.includes(method);
    const updated = exists ? methods.filter((m) => m !== method) : [...methods, method];
    setCurrentEdit({ ...currentEdit, brewingMethods: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Single Source of Truth
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50">
              Centraal Koffiedossier Systeem
            </h2>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              Elke koffie heeft één centraal dossier. Wijzigingen hier worden direct automatisch doorgevoerd in de Meer Info pop-up, Webshop productpagina’s, PDF leaflets, QR-codes en het koffiepaspoort.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshDossiers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-100 text-sm font-medium transition backdrop-blur-sm border border-white/10"
              title="Herlaad alle dossiers"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Verversen
            </button>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-sm transition shadow-lg shadow-amber-900/40"
            >
              <Plus className="w-4 h-4" />
              Nieuw Koffiedossier
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column = Product List; Right Column = Active Editor & Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Dossiers List (4 Cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                Product Dossiers ({filteredDossiers.length})
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                Totaal: {dossiers.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Zoek op naam, land, variëteit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Wis
                </button>
              )}
            </div>

            {/* Collection Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {COLLECTION_OPTIONS.map((col) => (
                <button
                  key={col}
                  onClick={() => setActiveCollectionFilter(col)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    activeCollectionFilter === col
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>

            {/* Coffee Items List */}
            <div className="divide-y divide-stone-100 max-h-[720px] overflow-y-auto pr-1 space-y-1">
              {filteredDossiers.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-sm">
                  Geen dossiers gevonden voor deze selectie.
                </div>
              ) : (
                filteredDossiers.map((dossier) => {
                  const isSelected = selectedDossierId === dossier.id;
                  return (
                    <div
                      key={dossier.id}
                      onClick={() => handleSelectDossier(dossier)}
                      className={`p-3.5 rounded-xl cursor-pointer transition border text-left mt-1 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                          : 'bg-white hover:bg-stone-50/80 border-transparent hover:border-stone-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-stone-900">
                              {dossier.productName}
                            </span>
                            {dossier.collection && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                {dossier.collection}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {dossier.origin} · {dossier.processingMethod}
                          </p>
                        </div>
                        {dossier.scaScore && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                            SCA {dossier.scaScore}
                          </span>
                        )}
                      </div>

                      {/* Flavour Notes Badges */}
                      {Array.isArray(dossier.flavourNotes) && dossier.flavourNotes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {dossier.flavourNotes.slice(0, 3).map((note, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600"
                            >
                              {note}
                            </span>
                          ))}
                          {dossier.flavourNotes.length > 3 && (
                            <span className="text-[10px] text-stone-400">
                              +{dossier.flavourNotes.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Dossier Editor & Connected Output Previews (8 Cols on desktop) */}
        <div className="lg:col-span-8">
          {!currentEdit ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-700">
                <Coffee className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl">
                Selecteer een koffiedossier om te bewerken
              </h3>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Kies een koffie uit de linkerlijst of maak direct een nieuw dossier aan. Alle wijzigingen die je hier opslaat werken direct door in de hele webshop en documenten.
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nieuw Dossier Toevoegen
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Top Navigation & Mode Selector */}
              <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">
                      ID: {currentEdit.id}
                    </span>
                    {currentEdit.collection && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {currentEdit.collection}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-2xl">
                    {currentEdit.productName}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => downloadDossierPdf(currentEdit.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition"
                    title="Download Koffiedossier PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF Leaflet
                  </button>

                  <button
                    onClick={() => handleDelete(currentEdit.id, currentEdit.productName)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-medium transition border border-red-200/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Verwijder
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Opslaan...' : 'Opslaan naar Dossier'}
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {saveStatus && (
                <div
                  className={`p-4 mx-6 mt-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                    saveStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {saveStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
              )}

              {/* Connected Outputs Tab Switcher */}
              <div className="px-6 border-b border-stone-200 flex gap-2 overflow-x-auto text-xs font-medium pt-2">
                <button
                  onClick={() => setEditorTab('edit')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'edit'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Dossier Gegevens
                </button>

                <button
                  onClick={() => setEditorTab('preview_info')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'preview_info'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Live "Meer Info" Weergave
                </button>

                <button
                  onClick={() => setEditorTab('preview_qr')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'preview_qr'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  QR-Code & Verpakking
                </button>

                <button
                  onClick={() => setEditorTab('preview_pdf')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'preview_pdf'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  PDF Leaflet Preview
                </button>

                <button
                  onClick={() => setEditorTab('preview_email')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'preview_email'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Klant E-mail Template
                </button>

                <button
                  onClick={() => setEditorTab('preview_passport')}
                  className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition ${
                    editorTab === 'preview_passport'
                      ? 'border-amber-700 text-amber-800 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Koffie Paspoort Kaart
                </button>
              </div>

              {/* TAB 1: Complete Dossier Editor Form */}
              {editorTab === 'edit' && (
                <div className="p-6 space-y-8">
                  {/* Section 1: Basis Informatie */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      1. Basis Productinformatie
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Product Name *</label>
                        <input
                          type="text"
                          value={currentEdit.productName}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, productName: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Dossier ID (Systeem Sleutel)</label>
                        <input
                          type="text"
                          value={currentEdit.id}
                          disabled
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-mono cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Collectie</label>
                        <select
                          value={currentEdit.collection || 'Selection'}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, collection: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition bg-white"
                        >
                          <option value="Budget">Budget</option>
                          <option value="Value">Value</option>
                          <option value="Selection">Selection</option>
                          <option value="Premium">Premium</option>
                          <option value="Prestige">Prestige</option>
                          <option value="Single Origins">Single Origins</option>
                          <option value="Barrel Aged">Barrel Aged</option>
                          <option value="Infused">Infused</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">SCA Score (Kwaliteitsscore)</label>
                        <input
                          type="text"
                          placeholder="bijv. 86 - 87"
                          value={currentEdit.scaScore || ''}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, scaScore: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Short Introduction *</label>
                      <input
                        type="text"
                        placeholder="Een bondige samenvatting van het smaakprofiel..."
                        value={currentEdit.shortIntro}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, shortIntro: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Coffee Story (Het Koffieverhaal) *</label>
                      <textarea
                        rows={3}
                        placeholder="Het volledige verhaal van deze blend of micro-lot..."
                        value={currentEdit.coffeeStory}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, coffeeStory: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                      />
                    </div>
                  </div>

                  {/* Section 2: Herkomst & Terroir */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Globe2 className="w-4 h-4 text-amber-700" />
                      2. Herkomst, Terroir & Botanica
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Origin (Land van Herkomst) *</label>
                        <input
                          type="text"
                          placeholder="bijv. Brazilië, Ethiopië & Costa Rica"
                          value={currentEdit.origin}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, origin: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Region (Regio) *</label>
                        <input
                          type="text"
                          placeholder="bijv. Cerrado Mineiro, Djimmah & Tarrazú"
                          value={currentEdit.region}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, region: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Farm / Producer (Boerderij / Producent) *</label>
                        <input
                          type="text"
                          placeholder="bijv. Fazenda Sitio dos Cedros & El Bueyerito Estate"
                          value={currentEdit.farmProducer}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, farmProducer: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">Varietal (Botanische Variëteit) *</label>
                        <input
                          type="text"
                          placeholder="bijv. 100% Arabica (Bourbon, Catuai, Heirloom)"
                          value={currentEdit.varietal}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, varietal: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-stone-700">Processing Method (Verwerkingsmethode) *</label>
                        <input
                          type="text"
                          placeholder="bijv. Natural & Fully Washed"
                          value={currentEdit.processingMethod}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, processingMethod: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Smaakprofiel, Sensoriek & Roosterprofiel */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Flame className="w-4 h-4 text-amber-700" />
                      3. Smaak, Sensoriek & Roosterprofiel
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Roast Profile (Brandprofiel) *</label>
                      <input
                        type="text"
                        placeholder="bijv. Veelzijdige Omniroast voor espresso en filter"
                        value={currentEdit.roastProfile}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, roastProfile: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                      />
                    </div>

                    {/* Flavour Notes Interactive Tag Cloud */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700">Flavour Notes (Smaaktonen) *</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 min-h-[48px] items-center">
                        {Array.isArray(currentEdit.flavourNotes) &&
                          currentEdit.flavourNotes.map((note, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-medium"
                            >
                              {note}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="text-amber-700 hover:text-amber-950 font-bold ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Toets toevoegen..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-600 bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs rounded-lg font-medium"
                          >
                            + Toevoegen
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sensory Sliders: Body, Acidity, Sweetness */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
                      {/* Body */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Body ({currentEdit.body}/5)</span>
                          <span className="text-stone-500 text-[11px]">{currentEdit.bodyDescription}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={currentEdit.body}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              body: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-amber-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="Omschrijving (bijv. Vol & romig)"
                          value={currentEdit.bodyDescription || ''}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, bodyDescription: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                        />
                      </div>

                      {/* Acidity */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Acidity ({currentEdit.acidity}/5)</span>
                          <span className="text-stone-500 text-[11px]">{currentEdit.acidityDescription}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={currentEdit.acidity}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              acidity: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-amber-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="Omschrijving (bijv. Aromatisch fris)"
                          value={currentEdit.acidityDescription || ''}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, acidityDescription: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                        />
                      </div>

                      {/* Sweetness */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Sweetness ({currentEdit.sweetness}/5)</span>
                          <span className="text-stone-500 text-[11px]">{currentEdit.sweetnessDescription}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={currentEdit.sweetness}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              sweetness: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-amber-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder="Omschrijving (bijv. Karamel & toffee)"
                          value={currentEdit.sweetnessDescription || ''}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, sweetnessDescription: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Bereidingsadvies & Food Pairing */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Coffee className="w-4 h-4 text-amber-700" />
                      4. Bereiding & Gastronomische Pairing
                    </h4>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-stone-700">
                        Recommended Brewing Methods (Aanbevolen zetmethodes) *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {COMMON_BREW_METHODS.map((method) => {
                          const isChecked = currentEdit.brewingMethods?.includes(method);
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => handleToggleBrewMethod(method)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border transition text-center ${
                                isChecked
                                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {method}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">Food Pairings (Gastronomische Combinaties) *</label>
                      <input
                        type="text"
                        placeholder="bijv. Pure chocolade 70%+, amandelcroissants, tiramisu..."
                        value={currentEdit.foodPairings}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, foodPairings: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                      />
                    </div>
                  </div>

                  {/* Section 5: Traceerbaarheid & Duurzaamheid */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Layers className="w-4 h-4 text-amber-700" />
                      5. Traceerbaarheid & Duurzaamheid
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">
                          Traceability Information (Hoogte, Oogst, Lotnummer) *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Hoogte 1.450m, direct trade via haven Antwerpen..."
                          value={currentEdit.traceabilityInfo}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, traceabilityInfo: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700">
                          Sustainability Information (Milieu, Eerlijke Vergoeding) *
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Biologische teelt, eerlijke boerenpremies 40% boven beurs..."
                          value={currentEdit.sustainabilityInfo}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, sustainabilityInfo: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Extra & Interne Notities */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Lock className="w-4 h-4 text-amber-700" />
                      6. Aanvullende Notities & Intern Beheer
                    </h4>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Additional Notes (Zichtbaar voor Klant in Meer Info) *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Aanvullende serveersuggesties of tips van de brander..."
                        value={currentEdit.additionalNotes}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, additionalNotes: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
                      />
                    </div>

                    <div className="space-y-1.5 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-800" />
                        Internal Notes (Admin Only - Nooit zichtbaar voor klanten) *
                      </div>
                      <p className="text-[11px] text-amber-800/80">
                        Opslag voor interne branderij-notities, leverancierscontracten, batch-instellingen of marge-aantekeningen.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="Interne notities, leverancier, contractreferentie..."
                        value={currentEdit.internalNotes}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, internalNotes: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-amber-300/80 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition bg-white"
                      />
                    </div>
                  </div>

                  {/* Bottom Save Action */}
                  <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Opslaan...' : 'Opslaan naar Single Source of Truth'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Live "Meer Info" Modal Preview */}
              {editorTab === 'preview_info' && (
                <div className="p-6 bg-stone-100/70 space-y-6">
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
                    <span>
                      Dit is exact hoe de klant dit dossier te zien krijgt wanneer op <strong>"Meer Info"</strong> of <strong>"Bekijk Dossier"</strong> wordt geklikt.
                    </span>
                    <button
                      onClick={() => onOpenPublicDossier && onOpenPublicDossier(currentEdit.id)}
                      className="inline-flex items-center gap-1 font-bold underline ml-2 hover:text-amber-950"
                    >
                      Open in Modal <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Simulated Modal Card */}
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl mx-auto overflow-hidden text-stone-800">
                    <div className="bg-gradient-to-r from-stone-900 to-amber-950 p-6 text-white">
                      <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                        <span>MAISON MILAU KOFFIEDOSSIER</span>
                        <span>{currentEdit.collection?.toUpperCase()}</span>
                      </div>
                      <h4 className="font-serif font-bold text-2xl text-white">
                        {currentEdit.productName}
                      </h4>
                      <p className="text-stone-300 text-xs mt-1 italic">
                        {currentEdit.shortIntro}
                      </p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Smaaktonen */}
                      <div>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                          Smaakprofiel & Tonen
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {currentEdit.flavourNotes?.map((n, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-900 font-medium text-xs border border-amber-200"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sensorische Meters */}
                      <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
                        <div>
                          <span className="text-[10px] text-stone-500 font-bold block uppercase">Body</span>
                          <span className="font-bold text-stone-900 text-sm">{currentEdit.body} / 5</span>
                          <span className="text-[10px] text-stone-500 block truncate">{currentEdit.bodyDescription}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 font-bold block uppercase">Aciditeit</span>
                          <span className="font-bold text-stone-900 text-sm">{currentEdit.acidity} / 5</span>
                          <span className="text-[10px] text-stone-500 block truncate">{currentEdit.acidityDescription}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 font-bold block uppercase">Zoetheid</span>
                          <span className="font-bold text-stone-900 text-sm">{currentEdit.sweetness} / 5</span>
                          <span className="text-[10px] text-stone-500 block truncate">{currentEdit.sweetnessDescription}</span>
                        </div>
                      </div>

                      {/* Terroir Table */}
                      <div className="text-xs space-y-2 border-t border-stone-100 pt-4">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Herkomst:</span>
                          <span className="col-span-2 text-stone-900 font-semibold">{currentEdit.origin}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Regio:</span>
                          <span className="col-span-2 text-stone-900">{currentEdit.region}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Producent:</span>
                          <span className="col-span-2 text-stone-900">{currentEdit.farmProducer}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Variëteit:</span>
                          <span className="col-span-2 text-stone-900">{currentEdit.varietal}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Verwerking:</span>
                          <span className="col-span-2 text-stone-900">{currentEdit.processingMethod}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-stone-500 font-medium">Brandprofiel:</span>
                          <span className="col-span-2 text-amber-900 font-semibold">{currentEdit.roastProfile}</span>
                        </div>
                      </div>

                      {/* Verhaal */}
                      <div className="text-xs space-y-1.5 border-t border-stone-100 pt-4">
                        <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Het Koffieverhaal</span>
                        <p className="text-stone-600 leading-relaxed">{currentEdit.coffeeStory}</p>
                      </div>

                      {/* Food Pairing */}
                      {currentEdit.foodPairings && (
                        <div className="text-xs space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          <span className="font-bold text-amber-900 text-[11px] block">Aanbevolen Food Pairing</span>
                          <p className="text-stone-700">{currentEdit.foodPairings}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QR-Code & Verpakking */}
              {editorTab === 'preview_qr' && (
                <div className="p-6 space-y-6">
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm flex items-start gap-3">
                    <QrCode className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Gereed voor Koffiezak Verpakkingen & Etiketten:</strong>
                      <p className="text-xs text-amber-800 mt-1">
                        Elke koffiezak kan voorzien worden van deze unieke QR-code. Wanneer een klant deze scant met hun smartphone, opent direct het mobiele koffiedossier met alle herkomstinformatie, brouwparameters en zetadviezen.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* QR Code Render Card */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-center space-y-4 shadow-sm">
                      <div className="bg-white p-6 rounded-2xl inline-block shadow-md border border-stone-100 mx-auto">
                        <img
                          src={generateQrSvgUrl(getDossierPublicUrl(currentEdit.id), 240)}
                          alt={`QR Code voor ${currentEdit.productName}`}
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{currentEdit.productName}</span>
                        <span className="text-[11px] font-mono text-stone-500">{getDossierPublicUrl(currentEdit.id)}</span>
                      </div>
                      <div className="flex justify-center gap-2">
                        <a
                          href={generateQrSvgUrl(getDossierPublicUrl(currentEdit.id), 600)}
                          target="_blank"
                          rel="noreferrer"
                          download={`QR_${currentEdit.id}.png`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white font-semibold text-xs hover:bg-amber-900 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Hoge Resolutie QR
                        </a>
                      </div>
                    </div>

                    {/* QR Packaging Instructions */}
                    <div className="space-y-4">
                      <h4 className="font-serif font-bold text-stone-900 text-lg">
                        Verpakking & Doellink
                      </h4>
                      <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                        <label className="text-xs font-semibold text-stone-600 block">Openbare Dossier URL:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={getDossierPublicUrl(currentEdit.id)}
                            className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getDossierPublicUrl(currentEdit.id));
                              setCopiedUrl(true);
                              setTimeout(() => setCopiedUrl(false), 2500);
                            }}
                            className="px-3 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium flex items-center gap-1"
                          >
                            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedUrl ? 'Gekopieerd' : 'Kopieer'}
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600 space-y-2">
                        <p>✓ <strong>Single Source of Truth:</strong> Je hoeft nooit nieuwe QR-codes af te drukken als je een smaaknoot of brandprofiel wijzigt. De URL blijft exact hetzelfde en toont altijd de nieuwste gegevens.</p>
                        <p>✓ <strong>Afmeting op etiket:</strong> Minimaal 20mm x 20mm voor vlekkeloze scanbaarheid met standaard smartphonecamera’s.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PDF Leaflet Preview */}
              {editorTab === 'preview_pdf' && (
                <div className="p-6 space-y-6">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                      <Download className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-stone-900 text-lg">
                        Artisanaal Koffiedossier PDF Leaflet
                      </h4>
                      <p className="text-stone-600 text-xs max-w-md mx-auto">
                        Genereert automatisch een A4-leaflet in Maison Milau huisstijl met alle herkomstspecificaties, SCA-score, sensorische balken en brouwadviezen.
                      </p>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => downloadDossierPdf(currentEdit.id)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        Download Koffiedossier PDF (Direct)
                      </button>
                      <a
                        href={`/api/dossiers/${currentEdit.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Openen in Nieuw Tabblad
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Klant E-mail Snippet */}
              {editorTab === 'preview_email' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base">
                        Klant E-mail Template (Dossier Snippet)
                      </h4>
                      <p className="text-stone-500 text-xs">
                        Kopieer deze kant-en-klare HTML / Tekst om toe te voegen aan bestellingsbevestigingen of nieuwsbrieven.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const text = `Koffiedossier: ${currentEdit.productName}\nHerkomst: ${currentEdit.origin} (${currentEdit.region})\nBrandprofiel: ${currentEdit.roastProfile}\nSmaaktonen: ${currentEdit.flavourNotes?.join(', ')}\nZetadvies: ${currentEdit.brewingMethods?.join(', ')}\nMeer info: ${getDossierPublicUrl(currentEdit.id)}`;
                        navigator.clipboard.writeText(text);
                        setCopiedEmailSnippet(true);
                        setTimeout(() => setCopiedEmailSnippet(false), 2500);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                    >
                      {copiedEmailSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmailSnippet ? 'Tekst Gekopieerd' : 'Kopieer E-mail Tekst'}
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-700 space-y-2 whitespace-pre-line leading-relaxed">
                    {`☕ MAISON MILAU · JOUW KOFFIEDOSSIER

Beste koffieliefhebber,

Hierbij het officiële brandersdossier van jouw gekozen koffie:

📦 Product: ${currentEdit.productName}
🌍 Herkomst: ${currentEdit.origin} · ${currentEdit.region}
🌱 Variëteit: ${currentEdit.varietal} (${currentEdit.processingMethod})
🔥 Brandprofiel: ${currentEdit.roastProfile}
🍒 Smaaktonen: ${currentEdit.flavourNotes?.join(' · ')}
✨ Sensoriek: Body ${currentEdit.body}/5 | Aciditeit ${currentEdit.acidity}/5 | Zoetheid ${currentEdit.sweetness}/5
🍵 Aanbevolen Zetmethodes: ${currentEdit.brewingMethods?.join(', ')}
🍫 Food Pairing: ${currentEdit.foodPairings}

Bekijk het volledige digitale dossier inclusief herkomstcertificaten via:
${getDossierPublicUrl(currentEdit.id)}`}
                  </div>
                </div>
              )}

              {/* TAB 6: Koffie Paspoort Kaart */}
              {editorTab === 'preview_passport' && (
                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-xl border border-amber-900/40 max-w-lg mx-auto relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                          Maison Milau Koffiepaspoort
                        </span>
                        <h4 className="font-serif font-bold text-xl text-white">
                          {currentEdit.productName}
                        </h4>
                      </div>
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400/50 flex items-center justify-center text-[10px] font-mono text-amber-300 font-bold rotate-12">
                        PASPOORT
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 text-xs text-stone-300 border-t border-stone-700/60 pt-4">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Herkomst</span>
                        <span className="font-semibold text-white">{currentEdit.origin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">SCA Score</span>
                        <span className="font-semibold text-amber-400">{currentEdit.scaScore || 'Geverifieerd'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Variëteit</span>
                        <span className="font-semibold text-white">{currentEdit.varietal}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Verwerking</span>
                        <span className="font-semibold text-white">{currentEdit.processingMethod}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Geregistreerd in Branderij Oudegem</span>
                      <span className="font-mono text-amber-500">MM-DOSSIER-{currentEdit.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
