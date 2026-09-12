import React, { useState, useMemo } from 'react';
import { Printer, X, Check, SlidersHorizontal, Eye, Copy, RefreshCw, FileText } from 'lucide-react';
import { Order, CartItem } from '../../types';
import {
  ReceiptLabelTemplate,
  ReceiptLabelFormat,
  ReceiptLabelData,
  resolveReceiptData,
  generateReceiptHtml,
  printReceiptViaIframe,
} from './ReceiptLabelTemplate';

export interface PrintReceiptButtonProps {
  order: Partial<Order>;
  item?: Partial<CartItem>;
  buttonClassName?: string;
  variant?: 'compact' | 'standard' | 'icon-only';
  skipModal?: boolean;
  defaultFormat?: ReceiptLabelFormat;
}

export const PrintReceiptButton: React.FC<PrintReceiptButtonProps> = ({
  order,
  item: initialItem,
  buttonClassName = '',
  variant = 'compact',
  skipModal = false,
  defaultFormat = 'thermal_80mm',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ReceiptLabelFormat>(defaultFormat);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Determine items list from order
  const orderItems = useMemo(() => {
    if (initialItem) return [initialItem];
    if (order?.items && order.items.length > 0) return order.items;
    return [{
      productName: 'Maison Milau Specialty Roast',
      variantWeight: '250g',
      grindOption: 'Volle bonen',
      quantity: 1,
    } as CartItem];
  }, [order, initialItem]);

  // Active item index for multi-product orders
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const activeItem = orderItems[selectedItemIndex] || orderItems[0];

  // Resolve initial data through smart data-handling (Scenario A / B)
  const initialResolved = useMemo(() => {
    return resolveReceiptData(order, activeItem);
  }, [order, activeItem]);

  // Modal editable form states
  const [roastDate, setRoastDate] = useState(initialResolved.roastDate);
  const [lotNumber, setLotNumber] = useState(initialResolved.lotNumber);
  const [customerName, setCustomerName] = useState(initialResolved.customerName);
  const [grindOption, setGrindOption] = useState(initialResolved.grindOption);
  const [weight, setWeight] = useState(initialResolved.weight);
  const [customNotes, setCustomNotes] = useState('');

  // Update fields when switching items
  const handleSelectItem = (idx: number) => {
    setSelectedItemIndex(idx);
    const targetItem = orderItems[idx];
    const resolved = resolveReceiptData(order, targetItem);
    setRoastDate(resolved.roastDate);
    setLotNumber(resolved.lotNumber);
    setGrindOption(resolved.grindOption);
    setWeight(resolved.weight);
  };

  // Reset to auto-generated smart defaults (Scenario B)
  const handleResetDefaults = () => {
    const fresh = resolveReceiptData(order, activeItem);
    setRoastDate(fresh.roastDate);
    setLotNumber(fresh.lotNumber);
    setCustomerName(fresh.customerName);
    setGrindOption(fresh.grindOption);
    setWeight(fresh.weight);
    setCustomNotes('');
  };

  // Current effective label data for preview & printing
  const currentLabelData: ReceiptLabelData = useMemo(() => {
    return resolveReceiptData(order, activeItem, {
      roastDate,
      lotNumber,
      customerName,
      grindOption,
      weight,
      customNotes,
    });
  }, [order, activeItem, roastDate, lotNumber, customerName, grindOption, weight, customNotes]);

  // Execute isolated print via hidden iframe (100% non-breaking)
  const triggerPrint = (dataToPrint = currentLabelData) => {
    setIsPrinting(true);
    try {
      const html = generateReceiptHtml(dataToPrint, selectedFormat);
      printReceiptViaIframe(html);
    } catch (err) {
      console.error('[PrintReceiptButton] Error firing print:', err);
    } finally {
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  // Print all items in order if multi-product
  const triggerPrintAllItems = () => {
    setIsPrinting(true);
    try {
      orderItems.forEach((itm, i) => {
        setTimeout(() => {
          const itemData = resolveReceiptData(order, itm, {
            roastDate,
            lotNumber: `${lotNumber}-${i + 1}`,
            customerName,
          });
          const html = generateReceiptHtml(itemData, selectedFormat);
          printReceiptViaIframe(html);
        }, i * 600);
      });
    } catch (err) {
      console.error('[PrintReceiptButton] Print all failed:', err);
    } finally {
      setTimeout(() => setIsPrinting(false), orderItems.length * 600 + 400);
    }
  };

  // Direct click handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (skipModal || e.shiftKey) {
      triggerPrint(currentLabelData);
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLot = () => {
    navigator.clipboard.writeText(lotNumber);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <>
      {/* 1. STANDALONE TRIGGER BUTTON */}
      {variant === 'icon-only' ? (
        <button
          type="button"
          onClick={handleClick}
          className={`p-1.5 text-stone-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors border border-stone-200 ${buttonClassName}`}
          title="Druk kassabon-etiket af (Shift+klik voor direct afdrukken)"
          aria-label="Druk kassabon-etiket af"
        >
          <Printer className="w-4 h-4" />
        </button>
      ) : variant === 'standard' ? (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all ${buttonClassName}`}
          title="Druk kassabon-etiket af"
        >
          <Printer className="w-3.5 h-3.5 text-amber-300" />
          <span>Etiket Afdrukken</span>
        </button>
      ) : (
        /* Compact table cell button */
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 shadow-2xs transition-colors ${buttonClassName}`}
          title="Druk kassabon-etiket af (Shift+klik voor direct printen)"
        >
          <Printer className="w-3.5 h-3.5 text-amber-800" />
          <span>Etiket</span>
        </button>
      )}

      {/* 2. LIGHTWEIGHT CONFIRMATION & PREVIEW MODAL */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                    Kassabon Koffie-Etiket Afdrukken
                    <span className="font-mono text-xs font-normal text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-sm">
                      #{order?.orderNumber || 'PREVIEW'}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Controleer branddatum & lotnummer vóór verzending naar de labelprinter
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
                aria-label="Sluit afdrukdialoog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Split into Controls (Left) & Realtime Ticket Preview (Right) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-100/50">
              {/* Left Column: Smart Production Parameters */}
              <div className="md:col-span-6 space-y-4">
                {/* Multi-item selector if order contains multiple products */}
                {orderItems.length > 1 && (
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <label className="text-xs font-bold text-stone-700 block">
                      Selecteer artikel uit bestelling ({orderItems.length} artikelen):
                    </label>
                    <div className="space-y-1.5">
                      {orderItems.map((itm, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectItem(i)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex justify-between items-center ${
                            selectedItemIndex === i
                              ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span className="truncate max-w-[200px]">{itm.productName}</span>
                          <span className="text-[11px] opacity-70">
                            {itm.variantWeight || '250g'} · {itm.quantity}x
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Info Box */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3.5">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                      Productiedata (Slimme Data-Handling)
                    </span>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="text-[11px] text-amber-900 hover:underline flex items-center gap-1 font-medium"
                      title="Herstel naar automatische datum van vandaag & standaard lotcode"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Herstel defaults
                    </button>
                  </div>

                  {/* Branddatum (Roast Date) */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Branddatum (Roast Date)
                    </label>
                    <input
                      type="date"
                      value={roastDate}
                      onChange={(e) => setRoastDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Automatisch berekende T.H.T.: 6 maanden na branddatum ({currentLabelData.bestBefore})
                    </span>
                  </div>

                  {/* Lot / Batchnummer */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Batch / Lotnummer
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyLot}
                        className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center gap-1"
                      >
                        {copiedNotification ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedNotification ? 'Gekopieerd' : 'Kopieer'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={lotNumber}
                      onChange={(e) => setLotNumber(e.target.value.toUpperCase())}
                      placeholder="LOT-20260912-CODE"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white uppercase"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Scenario B: Automatisch gegenereerd op basis van branddatum en koffiecode.
                    </span>
                  </div>

                  {/* Klantnaam ("Gebrand voor") */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Klantnaam (Gepersonaliseerde vermelding)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>

                  {/* Maalgraad & Gewicht */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Maalgraad
                      </label>
                      <select
                        value={grindOption}
                        onChange={(e) => setGrindOption(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                      >
                        <option value="Volle bonen">Volle bonen</option>
                        <option value="Espresso fijn">Espresso fijn</option>
                        <option value="Filter medium">Filter medium</option>
                        <option value="French Press grof">French Press grof</option>
                        <option value="Moka pot">Moka pot</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Netto Gewicht
                      </label>
                      <select
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                      >
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="1000g">1000g (1 kg)</option>
                        <option value="10x Caps">10x Capsules</option>
                      </select>
                    </div>
                  </div>

                  {/* Label Formaat Selector */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Afdrukformaat
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedFormat('thermal_80mm')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          selectedFormat === 'thermal_80mm'
                            ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div>80mm Thermische Rol</div>
                        <div className="text-[10px] text-stone-500 font-normal">Kassabon / Epson / Zebra</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedFormat('label_100x150mm')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          selectedFormat === 'label_100x150mm'
                            ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div>100 x 150mm Sticker</div>
                        <div className="text-[10px] text-stone-500 font-normal">Pakketlabel / Dymo 4XL</div>
                      </button>
                    </div>
                  </div>

                  {/* Extra notitie */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Optionele brandersnotitie / felicitatie
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="bijv. Eerste oogst 2026 · Geniet ervan!"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Authentic Receipt Preview */}
              <div className="md:col-span-6 flex flex-col items-center justify-start">
                <div className="w-full flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-800" />
                    Live Afdrukvoorbeeld ({selectedFormat === 'thermal_80mm' ? '80mm Rol' : '100x150mm'})
                  </span>
                  <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full font-mono">
                    100% Monospace Thermal
                  </span>
                </div>

                <div className="w-full flex justify-center py-2 max-h-[520px] overflow-y-auto">
                  <ReceiptLabelTemplate
                    order={order}
                    item={activeItem}
                    overrides={{
                      roastDate,
                      lotNumber,
                      customerName,
                      grindOption,
                      weight,
                      customNotes,
                    }}
                    format={selectedFormat}
                    isInteractivePreview={true}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
              <div className="text-xs text-stone-500 text-center sm:text-left">
                <span>Direct verzenden via geïsoleerde iframe-driver.</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {orderItems.length > 1 && (
                  <button
                    type="button"
                    onClick={triggerPrintAllItems}
                    disabled={isPrinting}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors inline-flex items-center justify-center gap-1.5"
                    title={`Druk alle ${orderItems.length} zak-etiketten achter elkaar af`}
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    <span>Druk Alle ({orderItems.length}) Etiketten Af</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors"
                >
                  Annuleren
                </button>

                <button
                  type="button"
                  onClick={() => triggerPrint(currentLabelData)}
                  disabled={isPrinting}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>{isPrinting ? 'Afdrukken...' : 'Direct Afdrukken'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
