import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle, Coffee } from 'lucide-react';
import { CATALOG_ITEMS } from '../data/catalogData';

interface CoffeeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCoffeeName?: string;
  onReviewSubmitted?: () => void;
}

export const CoffeeReviewModal: React.FC<CoffeeReviewModalProps> = ({
  isOpen,
  onClose,
  defaultCoffeeName,
  onReviewSubmitted,
}) => {
  const [coffeeName, setCoffeeName] = useState(defaultCoffeeName || CATALOG_ITEMS[0]?.name || 'Selection Daily');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [profileAccuracy, setProfileAccuracy] = useState<string>('Exact conform beloofd profiel');
  const [selectedNotes, setSelectedNotes] = useState<string[]>(['Pure Chocolade', 'Karamel']);
  const [tasteReview, setTasteReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock background scrolling when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Support ESC key to close modal
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
      setErrorMessage('Gelieve uw naam en een korte smaakbeoordeling in te vullen.');
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
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      } else {
        setErrorMessage(data.error || 'Er is een fout opgetreden bij het plaatsen van uw review.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verbindingsfout.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="bg-white rounded-2xl sm:rounded-3xl w-[92vw] sm:w-full max-w-lg max-h-[88vh] sm:max-h-[90vh] shadow-2xl border border-stone-200 relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header with Title and Accessible Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="review-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight truncate">
                Koffie Smaakbeoordeling
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                Deel uw ervaring met onze brander
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

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6">
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
                  onChange={(e) => setCoffeeName(e.target.value)}
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
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 hover:scale-110 active:scale-95 transition-transform"
                      aria-label={`${star} sterren`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating !== null ? hoverRating >= star : rating >= star)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-950 ml-2">
                    {rating === 5 ? 'Uitmuntend (5/5)' : `${rating} van 5 sterren`}
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
                  Uw ervaring (zetmethode, crema, mondgevoel, afdronk):
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="bv. Gezet in onze Sage Barista Touch espressomachine. Zeer mooie crema, fluweelzachte afdronk en heerlijke chocoladetonen..."
                  value={tasteReview}
                  onChange={(e) => setTasteReview(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Sticky Footer with Action Buttons */}
        {!isSuccess && (
          <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3 sm:py-4 border-t border-stone-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Annuleren
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
