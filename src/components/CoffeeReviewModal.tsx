import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Coffee, Star, MessageSquare, Plus, Check } from 'lucide-react';
import { CATALOG_ITEMS } from '../data/catalogData';

export interface CoffeeReviewItem {
  id: string;
  coffeeName: string;
  customerName: string;
  rating: number;
  flavorNotes?: string[];
  selectedNotes?: string[];
  tasteReview: string;
  profileAccuracy?: string;
  verifiedPurchase?: boolean;
  createdAt: string;
}

interface CoffeeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCoffeeName?: string;
  coffeeName?: string;
  initialMode?: 'view' | 'write';
  onReviewSubmitted?: () => void;
}

export const CoffeeReviewModal: React.FC<CoffeeReviewModalProps> = ({
  isOpen,
  onClose,
  defaultCoffeeName,
  coffeeName: propCoffeeName,
  initialMode = 'view',
  onReviewSubmitted,
}) => {
  const activeSelectedCoffee = propCoffeeName || defaultCoffeeName || CATALOG_ITEMS[0]?.name || 'Selection Daily';
  const [coffeeName, setCoffeeName] = useState(activeSelectedCoffee);
  const [activeTab, setActiveTab] = useState<'view' | 'write'>(initialMode);
  const [filterCoffee, setFilterCoffee] = useState<string>(activeSelectedCoffee);

  // Reviews list state
  const [reviewsList, setReviewsList] = useState<CoffeeReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [profileAccuracy, setProfileAccuracy] = useState<string>('Exact conform beloofd profiel');
  const [selectedNotes, setSelectedNotes] = useState<string[]>(['Pure Chocolade', 'Karamel']);
  const [tasteReview, setTasteReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync prop changes
  useEffect(() => {
    if (propCoffeeName || defaultCoffeeName) {
      const selected = propCoffeeName || defaultCoffeeName || 'Selection Daily';
      setCoffeeName(selected);
      setFilterCoffee(selected);
    }
    setActiveTab(initialMode);
  }, [propCoffeeName, defaultCoffeeName, initialMode, isOpen]);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReviewsList(json.data);
        }
      }
    } catch (e) {
      console.warn('Could not fetch reviews:', e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // ESC key support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const availableNotes = [
    'Pure Chocolade',
    'Melkchocolade',
    'Karamel',
    'Hazelnoot',
    'Walnoot',
    'Rood Fruit',
    'Steenvrucht / Perzik',
    'Bergamot & Citrus',
    'Honing',
    'Specerijen / Kaneel',
    'Wijnachtig / Moscatel',
    'Bloemig / Jasmijn',
  ];

  const accuracyOptions = [
    'Exact conform beloofd profiel',
    'Rijker & voller dan verwacht',
    'Zachter & ronder van smaak',
    'Fruitiger / frisser van smaak',
  ];

  const toggleNote = (note: string) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter((n) => n !== note));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !tasteReview.trim()) {
      setErrorMessage('Gelieve uw naam en een proefnotitie / ervaring in te vullen.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeName,
          customerName,
          rating,
          flavorNotes: selectedNotes,
          tasteReview,
          profileAccuracy,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        if (onReviewSubmitted) onReviewSubmitted();
        await fetchReviews();
        setTimeout(() => {
          setIsSuccess(false);
          setActiveTab('view');
        }, 1500);
      } else {
        setErrorMessage(data.error || 'Er is een fout opgetreden bij het plaatsen van uw review.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verbindingsfout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered reviews for viewing
  const displayedReviews = filterCoffee === 'all'
    ? reviewsList
    : reviewsList.filter((r) => r.coffeeName.toLowerCase().includes(filterCoffee.toLowerCase()) || filterCoffee.toLowerCase().includes(r.coffeeName.toLowerCase()));

  const avgRating = displayedReviews.length > 0
    ? (displayedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / displayedReviews.length).toFixed(1)
    : '5.0';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl w-[94vw] sm:w-full max-w-2xl max-h-[90vh] shadow-2xl border border-stone-200 relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header with Title, Tabs, and Accessible Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 id="review-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight truncate">
                  Koffie Smaakbeoordelingen & Ervaringen
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                  {coffeeName ? `Maison Milau Micro-Roastery · ${coffeeName}` : 'Artisanaal gebrand in Oudegem (Dendermonde)'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 min-w-[40px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 active:bg-stone-200 transition-colors shrink-0"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'view'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bekijk Reviews ({displayedReviews.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'write'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Zelf een Review Schrijven</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6">
          {activeTab === 'view' ? (
            <div className="space-y-4">
              {/* Filter and Summary Bar */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="text-sm font-bold text-stone-900">{avgRating}</span>
                    <span className="text-[10px] text-stone-500">/ 5.0</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    <span className="font-semibold text-stone-900">{displayedReviews.length}</span> geverifieerde cupping reviews
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setFilterCoffee('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filterCoffee === 'all'
                        ? 'bg-amber-900 text-white'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Alle melanges
                  </button>
                  {coffeeName && (
                    <button
                      type="button"
                      onClick={() => setFilterCoffee(coffeeName)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterCoffee === coffeeName
                          ? 'bg-amber-900 text-white'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {coffeeName}
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              {isLoadingReviews ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  Reviews ophalen...
                </div>
              ) : displayedReviews.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-stone-50/50 rounded-2xl border border-stone-200/60 p-6">
                  <Coffee className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Nog geen reviews voor <span className="font-semibold text-stone-700">{filterCoffee}</span>. Wees de eerste die zijn proefervaring deelt!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schrijf de eerste review</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedReviews.map((rev) => {
                    const notes = rev.flavorNotes || rev.selectedNotes || [];
                    return (
                      <div
                        key={rev.id}
                        className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-amber-200 transition-colors space-y-2.5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                {rev.customerName}
                              </span>
                              {rev.verifiedPurchase !== false && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200/60">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Geverifieerde koper</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                              {rev.coffeeName} · {new Date(rev.createdAt).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Review text */}
                        <p className="text-xs text-stone-700 leading-relaxed italic">
                          "{rev.tasteReview}"
                        </p>

                        {/* Flavor notes and accuracy */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100">
                          {notes.map((note, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {note}
                            </span>
                          ))}
                          {rev.profileAccuracy && (
                            <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium ml-auto">
                              {rev.profileAccuracy}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {isSuccess ? (
                <div className="py-10 sm:py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">Bedankt voor uw beoordeling!</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    Uw smaaknotities en ervaring voor <span className="font-semibold text-amber-900">{coffeeName}</span> zijn opgeslagen en zichtbaar op het platform.
                  </p>
                </div>
              ) : (
                <form id="coffee-review-form" onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  {/* Select coffee */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kies de specialty blend of single origin:
                    </label>
                    <select
                      value={coffeeName}
                      onChange={(e) => {
                        setCoffeeName(e.target.value);
                        setFilterCoffee(e.target.value);
                      }}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900"
                    >
                      {CATALOG_ITEMS.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name} ({item.collection} · SCA {item.scaScore})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Uw naam of initialen:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bv. Sarah V. of Laurent M."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Algemene score:
                    </label>
                    <div className="flex items-center flex-wrap gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating !== null ? hoverRating >= starVal : rating >= starVal);
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 hover:scale-125 active:scale-95 transition-all cursor-pointer"
                            aria-label={`${starVal} sterren`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled
                                  ? 'text-amber-500 fill-amber-400 drop-shadow-xs'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-amber-950 ml-2">
                        {rating === 5 ? 'Uitmuntend (5/5 sterren)' : `${rating} van 5 sterren`}
                      </span>
                    </div>
                  </div>

                  {/* Smaakprofiel overeenkomst */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Overeenkomst met branderij smaakprofiel:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {accuracyOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setProfileAccuracy(opt)}
                          className={`p-2 rounded-lg border text-left text-[11px] sm:text-xs transition-all ${
                            profileAccuracy === opt
                              ? 'border-amber-900 bg-amber-50 text-amber-950 font-semibold ring-1 ring-amber-900'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smaaknotities chips */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                      <span>Herkenbare smaaknotities:</span>
                      <span className="text-[10px] text-stone-400">{selectedNotes.length} geselecteerd</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-w-full">
                      {availableNotes.map((note) => {
                        const isSelected = selectedNotes.includes(note);
                        return (
                          <button
                            key={note}
                            type="button"
                            onClick={() => toggleNote(note)}
                            className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                              isSelected
                                ? 'bg-amber-900 border-amber-900 text-white font-medium shadow-2xs'
                                : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            {note}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Taste review text */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Uw ervaring (aroma, versheid, brandkwaliteit, crema, afdronk):
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="bv. Geweldig aroma van cacao en karamel bij het openen van het zakje. Bonen waren slechts enkele dagen oud. Mooie crema in de espressomachine en zijdezachte afdronk..."
                      value={tasteReview}
                      onChange={(e) => setTasteReview(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                    />
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer with Action Buttons */}
        {activeTab === 'write' && !isSuccess && (
          <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3 sm:py-4 border-t border-stone-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Terug naar reviews
            </button>
            <button
              type="submit"
              form="coffee-review-form"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-amber-900 hover:bg-amber-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
            >
              {isSubmitting ? 'Bezig met plaatsen...' : 'Review Plaatsen'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
