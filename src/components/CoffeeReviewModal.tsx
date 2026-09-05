import React, { useState } from 'react';
import { Star, X, CheckCircle, Coffee, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Sluiten"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Bedankt voor uw beoordeling!</h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              Uw smaaknotities en ervaring voor <span className="font-semibold text-amber-900">{coffeeName}</span> zijn opgeslagen en zichtbaar op het platform.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 leading-tight">Koffie Smaakbeoordeling</h3>
                <p className="text-xs text-stone-500">Deel uw ervaring & smaakprofiel overeenkomst met onze brander</p>
              </div>
            </div>

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
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900"
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
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Algemene score:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-110 transition-transform"
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
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {accuracyOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setProfileAccuracy(opt)}
                    className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
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
                <span>Herkenbare smaaknotities (klik om te selecteren):</span>
                <span className="text-[10px] text-stone-400">{selectedNotes.length} geselecteerd</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableNotes.map((note) => {
                  const isSelected = selectedNotes.includes(note);
                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => toggleNote(note)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-amber-900 border-amber-900 text-white font-medium shadow-xs'
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
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-amber-900 hover:bg-amber-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
              >
                {isSubmitting ? 'Bezig met plaatsen...' : 'Review Plaatsen'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
