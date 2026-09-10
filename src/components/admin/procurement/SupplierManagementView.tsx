import React, { useState, useMemo } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Star,
  Plus,
  Edit2,
  Archive,
  RotateCcw,
  Search,
  CheckCircle2,
  Package,
  Layers,
  X,
  CreditCard,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';
import { SupplierRecord } from '../../../types';

interface SupplierManagementViewProps {
  onViewCoffeesForSupplier?: (supplierName: string) => void;
}

export const SupplierManagementView: React.FC<SupplierManagementViewProps> = ({
  onViewCoffeesForSupplier,
}) => {
  const { suppliers, beans, addSupplier, updateSupplier } = useProcurement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New Supplier Form State
  const [supplierForm, setSupplierForm] = useState<Omit<SupplierRecord, 'id'>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    region: 'Europe / Direct Trade',
    country: 'Nederland',
    warehouseLocations: ['Antwerpen Haven'],
    leadTimeDays: 7,
    paymentTerms: 'Net 30',
    rating: 5,
    status: 'active',
    specialties: ['Specialty Arabica'],
    notes: '',
  });

  // Calculate coffee lots per supplier
  const coffeeCountPerSupplier = useMemo(() => {
    const map: Record<string, number> = {};
    beans.forEach((b) => {
      map[b.supplier] = (map[b.supplier] || 0) + 1;
    });
    return map;
  }, [beans]);

  // Regions list
  const regions = useMemo(() => {
    const set = new Set(suppliers.map((s) => s.region));
    return Array.from(set).sort();
  }, [suppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (showArchived ? s.status !== 'archived' : s.status === 'archived') {
        return false;
      }
      if (selectedRegion !== 'ALL' && s.region !== selectedRegion) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = s.name.toLowerCase().includes(term);
        const matchPerson = s.contactPerson.toLowerCase().includes(term);
        const matchEmail = s.email.toLowerCase().includes(term);
        const matchCountry = (s.country || s.region || '').toLowerCase().includes(term);
        if (!matchName && !matchPerson && !matchEmail && !matchCountry) {
          return false;
        }
      }
      return true;
    });
  }, [suppliers, showArchived, selectedRegion, searchTerm]);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) return;
    setIsSubmitting(true);
    try {
      await addSupplier(supplierForm);
      setFeedbackMessage(`Leverancier "${supplierForm.name}" succesvol aangemaakt!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      setIsAddModalOpen(false);
      setSupplierForm({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        region: 'Europe / Direct Trade',
        country: 'Nederland',
        warehouseLocations: ['Antwerpen Haven'],
        leadTimeDays: 7,
        paymentTerms: 'Net 30',
        rating: 5,
        status: 'active',
        specialties: ['Specialty Arabica'],
        notes: '',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSupplier) return;
    setIsSubmitting(true);
    try {
      await updateSupplier(editingSupplier.id, editingSupplier);
      setFeedbackMessage(`Leverancier "${editingSupplier.name}" succesvol bijgewerkt!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      setEditingSupplier(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (supplier: SupplierRecord) => {
    const newStatus = supplier.status === 'active' ? 'archived' : 'active';
    await updateSupplier(supplier.id, { status: newStatus });
    setFeedbackMessage(
      newStatus === 'archived'
        ? `Leverancier "${supplier.name}" gearchiveerd.`
        : `Leverancier "${supplier.name}" hersteld naar actief.`
    );
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between animate-fadeIn">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Leveranciers & Importeurs Beheer
          </h2>
          <p className="text-xs text-stone-400">
            Beheer alle specialty coffee importeurs, direct trade partners, contactpersonen en levertijden.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-semibold text-xs hover:bg-[#c49f27] flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Leverancier Toevoegen
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Zoek op leverancier, contactpersoon, land..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="ALL">Alle Regio's</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Active vs Archived Toggle */}
        <div className="flex items-center gap-1.5 bg-[#191816] p-1 rounded-lg border border-stone-800 text-xs">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-3 py-1 rounded-md transition-colors ${
              !showArchived
                ? 'bg-[#2D2A26] text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Actief ({suppliers.filter((s) => s.status === 'active').length})
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-3 py-1 rounded-md transition-colors ${
              showArchived
                ? 'bg-[#2D2A26] text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Gearchiveerd ({suppliers.filter((s) => s.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-500 bg-[#242220] rounded-xl border border-[#3A3530]">
            Geen leveranciers gevonden met deze filters.
          </div>
        ) : (
          filteredSuppliers.map((supplier) => {
            const coffeeCount = coffeeCountPerSupplier[supplier.name] || 0;

            return (
              <div
                key={supplier.id}
                className="bg-[#242220] border border-[#3A3530] rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-sm relative group"
              >
                <div>
                  {/* Top line: Name & rating */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {supplier.name}
                      </h3>
                      <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        <span>
                          {supplier.country} • {supplier.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold">{supplier.rating || 5}</span>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-stone-300 border-t border-[#332F2B] pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 w-24">Contact:</span>
                      <span className="text-white font-medium">{supplier.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      <a href={`mailto:${supplier.email}`} className="text-[#D4AF37] hover:underline truncate">
                        {supplier.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-stone-300">{supplier.phone}</span>
                    </div>
                    {supplier.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-stone-500" />
                        <span className="text-stone-400 truncate">{supplier.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Logistics & Conditions */}
                  <div className="mt-3 pt-2.5 border-t border-[#332F2B] grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#1C1B19] p-2 rounded-lg border border-stone-800">
                      <div className="text-stone-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        Levertijd
                      </div>
                      <div className="font-semibold text-white mt-0.5">{supplier.leadTimeDays} werkdagen</div>
                    </div>
                    <div className="bg-[#1C1B19] p-2 rounded-lg border border-stone-800">
                      <div className="text-stone-400 text-[11px] flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-emerald-400" />
                        Betaalconditie
                      </div>
                      <div className="font-semibold text-white mt-0.5">{supplier.paymentTerms}</div>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  {supplier.specialties && supplier.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {supplier.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#2D2A26] text-stone-300 border border-stone-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer bar */}
                <div className="mt-4 pt-3 border-t border-[#332F2B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-stone-400">
                    <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-white font-semibold">{coffeeCount}</span> koffies in database
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingSupplier(supplier)}
                      className="p-1.5 rounded-md bg-[#332F2B] text-stone-300 hover:text-white hover:bg-[#403B36] transition-colors"
                      title="Gegevens bewerken"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleArchive(supplier)}
                      className="p-1.5 rounded-md bg-[#332F2B] text-stone-300 hover:text-white hover:bg-[#403B36] transition-colors"
                      title={supplier.status === 'active' ? 'Archiveer leverancier' : 'Herstel naar actief'}
                    >
                      {supplier.status === 'active' ? (
                        <Archive className="w-3.5 h-3.5 text-stone-400" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Edit Supplier */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Leverancier Bewerken
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">{editingSupplier.name}</p>
              </div>
              <button
                onClick={() => setEditingSupplier(null)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Naam Leverancier</label>
                <input
                  type="text"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Contactpersoon</label>
                  <input
                    type="text"
                    value={editingSupplier.contactPerson}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingSupplier.email}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Telefoonnummer</label>
                  <input
                    type="text"
                    value={editingSupplier.phone}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Website</label>
                  <input
                    type="text"
                    value={editingSupplier.website}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Levertijd (dagen)</label>
                  <input
                    type="number"
                    value={editingSupplier.leadTimeDays}
                    onChange={(e) =>
                      setEditingSupplier({ ...editingSupplier, leadTimeDays: parseInt(e.target.value) || 7 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Betaalconditie</label>
                  <input
                    type="text"
                    value={editingSupplier.paymentTerms}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingSupplier.rating || 5}
                    onChange={(e) =>
                      setEditingSupplier({ ...editingSupplier, rating: parseInt(e.target.value) || 5 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Notities / Kwaliteitsafspraken</label>
                <textarea
                  rows={2}
                  value={editingSupplier.notes || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[#3A3530]">
              <button
                type="button"
                onClick={() => setEditingSupplier(null)}
                className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50"
              >
                {isSubmitting ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Nieuwe Leverancier Toevoegen
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Registreer een nieuwe koffie-importeur of farm-partner.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Naam Leverancier / Importeur *</label>
                <input
                  type="text"
                  required
                  placeholder="bijv. Nordic Approach, Sucafina, Cru Coffee..."
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Contactpersoon *</label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Jan Jansen"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">E-mailadres *</label>
                  <input
                    type="email"
                    required
                    placeholder="order@supplier.com"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Telefoonnummer</label>
                  <input
                    type="text"
                    placeholder="+31 (0)20 123 4567"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Website</label>
                  <input
                    type="text"
                    placeholder="https://supplier.com"
                    value={supplierForm.website}
                    onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Land</label>
                  <input
                    type="text"
                    value={supplierForm.country}
                    onChange={(e) => setSupplierForm({ ...supplierForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Regio</label>
                  <input
                    type="text"
                    value={supplierForm.region}
                    onChange={(e) => setSupplierForm({ ...supplierForm, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Levertijd (dagen)</label>
                  <input
                    type="number"
                    value={supplierForm.leadTimeDays}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, leadTimeDays: parseInt(e.target.value) || 7 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Betaaltermijn</label>
                  <input
                    type="text"
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={supplierForm.rating}
                    onChange={(e) => setSupplierForm({ ...supplierForm, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#3A3530]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50"
                >
                  {isSubmitting ? 'Toevoegen...' : 'Leverancier Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
