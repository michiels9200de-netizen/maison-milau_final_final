import React from 'react';
import { Order, CartItem } from '../../types';
import { getCoffeeDossier } from '../../data/coffeeDiscoveryHelpers';

export type ReceiptLabelFormat = 'thermal_80mm' | 'label_100x150mm';

export interface ReceiptLabelData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail?: string;
  productName: string;
  origin?: string;
  varietal?: string;
  processingMethod?: string;
  roastLevel?: string;
  grindOption: string;
  weight: string;
  roastDate: string;
  lotNumber: string;
  bestBefore: string;
  flavourNotes?: string[];
  scaScore?: string;
  invoiceNumber?: string;
  qrUrl?: string;
  roasteryName: string;
  roasteryAddress: string;
  roasteryVat: string;
  roasteryPhone?: string;
  roasteryWebsite?: string;
  customNotes?: string;
}

/**
 * Intelligent helper to resolve label data from Order & CartItem
 * Follows SCENARIO A (pre-existing data) and SCENARIO B (smart defaults)
 */
export function resolveReceiptData(
  order: Partial<Order>,
  item?: Partial<CartItem>,
  overrides?: Partial<ReceiptLabelData>
): ReceiptLabelData {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const todayDigits = todayIso.replace(/-/g, '');

  // 1. Order Basics
  const orderNumber = order?.orderNumber || (order?.id ? `ORD-${order.id.slice(0, 8).toUpperCase()}` : 'ORD-2026-PREVIEW');
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const customerName = order?.customerName || 'Koffieliefhebber';
  const customerEmail = order?.customerEmail;
  const invoiceNumber = order?.invoiceId || (order as any)?.invoiceNumber || `INV-${orderNumber.replace(/[^0-9]/g, '') || '2026'}`;

  // 2. Item Basics
  const fallbackItem = order?.items && order.items.length > 0 ? order.items[0] : null;
  const effectiveItem = item || fallbackItem;

  const productName = effectiveItem?.productName || 'Maison Milau Specialty Roast';
  const weight = effectiveItem?.variantWeight || '250g';
  const grindOption = effectiveItem?.grindOption || 'Volle bonen';

  // 3. Coffee Metadata Lookup (Enrichment from dossier or product catalog)
  const productId = effectiveItem?.productId || '';
  const cleanId = productId.replace(/^prod-/, '');
  const dossier = getCoffeeDossier(cleanId) || getCoffeeDossier(productId);

  // Generate short coffee code for Lot number fallback
  const coffeeCode = productName
    .replace(/^(milau|maison milau)\s*/i, '')
    .slice(0, 4)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '') || 'MLU';

  // SCENARIO A vs SCENARIO B: Branddatum (Roast Date)
  const resolvedRoastDate =
    overrides?.roastDate ||
    (effectiveItem as any)?.roast_date ||
    (effectiveItem as any)?.roastDate ||
    (order as any)?.roast_date ||
    (order as any)?.roastDate ||
    todayIso;

  // SCENARIO A vs SCENARIO B: Lotnummer (Lot Number)
  const resolvedLotNumber =
    overrides?.lotNumber ||
    (effectiveItem as any)?.lot_number ||
    (effectiveItem as any)?.lotNumber ||
    (order as any)?.lot_number ||
    (order as any)?.lotNumber ||
    (order as any)?.batchNumber ||
    `LOT-${todayDigits}-${coffeeCode}`;

  // Best Before date: 6 months after roast date
  let bestBefore = '';
  try {
    const rDate = new Date(resolvedRoastDate);
    if (!isNaN(rDate.getTime())) {
      rDate.setMonth(rDate.getMonth() + 6);
      bestBefore = rDate.toISOString().slice(0, 10);
    } else {
      bestBefore = 'Zie verpakking (+6M)';
    }
  } catch {
    bestBefore = '6 maanden na branddatum';
  }

  // Origin & Terroir resolution
  const origin = overrides?.origin || dossier?.originStory?.slice(0, 65) || 'Specialty Arabica & Terroir Selectie';
  const varietal = overrides?.varietal || dossier?.varietyInfo || '100% Arabica Selectie';
  const processingMethod = overrides?.processingMethod || 'Specialty Handgeplukt & Ambachtelijk Gebrand';
  const roastLevel = overrides?.roastLevel || 'Medium Ambachtelijke Branding';
  const scaScore = overrides?.scaScore || (dossier as any)?.scaScore || '';
  const flavourNotes = overrides?.flavourNotes || dossier?.signatureCharacteristics?.slice(0, 4) || ['Chocolade', 'Karamel', 'Zachte noten'];

  // QR URL: links directly to digital invoice or product dossier
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.maison-milau.be';
  const qrUrl = overrides?.qrUrl || `${originUrl}/api/invoices/${encodeURIComponent(invoiceNumber)}/pdf`;

  return {
    orderNumber,
    orderDate,
    customerName,
    customerEmail,
    productName,
    origin,
    varietal,
    processingMethod,
    roastLevel,
    grindOption,
    weight,
    roastDate: resolvedRoastDate,
    lotNumber: resolvedLotNumber,
    bestBefore,
    flavourNotes,
    scaScore,
    invoiceNumber,
    qrUrl,
    roasteryName: 'MAISON MILAU',
    roasteryAddress: 'Ambachtelijke Koffiebranderij · Dendermonde, België',
    roasteryVat: 'BTW BE 0123.456.789',
    roasteryPhone: '+32 (0)52 12 34 56',
    roasteryWebsite: 'www.maison-milau.be',
    customNotes: overrides?.customNotes,
    ...overrides,
  };
}

/**
 * Generates an ultra-crisp standalone HTML string for isolated iframe printing
 * Completely isolated from parent page styles and zero CSS bleed
 */
export function generateReceiptHtml(
  data: ReceiptLabelData,
  format: ReceiptLabelFormat = 'thermal_80mm'
): string {
  const isLabel100x150 = format === 'label_100x150mm';
  const encodedQr = encodeURIComponent(data.qrUrl || `https://www.maison-milau.be/order/${data.orderNumber}`);
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodedQr}&bgcolor=FFFFFF&color=000000&margin=0&format=svg`;

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>Koffie Etiket #${data.orderNumber} - ${data.productName}</title>
  <style>
    @page {
      size: ${isLabel100x150 ? '100mm 150mm' : '80mm auto'};
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      background-color: #ffffff;
      color: #000000;
      font-family: 'Space Mono', 'Courier New', Courier, monospace;
      font-size: ${isLabel100x150 ? '12px' : '11px'};
      line-height: 1.35;
      padding: ${isLabel100x150 ? '8mm' : '4mm 3mm 8mm 3mm'};
      width: ${isLabel100x150 ? '100mm' : '80mm'};
      margin: 0 auto;
    }
    .receipt-container {
      width: 100%;
      background: #ffffff;
      color: #000000;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
    
    .divider-dashed {
      border-bottom: 1px dashed #000000;
      margin: 6px 0;
      height: 1px;
    }
    .divider-double {
      border-bottom: 2px solid #000000;
      margin: 6px 0;
      height: 2px;
    }
    .divider-dotted {
      border-bottom: 1px dotted #000000;
      margin: 5px 0;
      height: 1px;
    }
    
    .header-brand {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }
    .header-sub {
      font-size: 10px;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .label {
      color: #000000;
      font-weight: bold;
      white-space: nowrap;
    }
    .val {
      text-align: right;
      word-break: break-word;
    }
    
    .coffee-title {
      font-size: 14px;
      font-weight: 900;
      text-align: center;
      margin: 6px 0 4px 0;
      line-height: 1.25;
      text-transform: uppercase;
    }
    .coffee-highlight-box {
      border: 1px solid #000000;
      padding: 4px 6px;
      margin: 4px 0;
      background: #ffffff;
    }
    
    .qr-section {
      text-align: center;
      margin: 8px 0 6px 0;
    }
    .qr-img {
      width: ${isLabel100x150 ? '90px' : '78px'};
      height: ${isLabel100x150 ? '90px' : '78px'};
      margin: 0 auto 4px auto;
      display: block;
      image-rendering: pixelated;
    }
    .qr-caption {
      font-size: 8.5px;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }
    
    .footer-legal {
      font-size: 8px;
      line-height: 1.25;
      text-align: center;
      margin-top: 6px;
      border-top: 1px dashed #000000;
      padding-top: 5px;
    }
    .cut-line {
      font-size: 10px;
      text-align: center;
      margin-top: 10px;
      letter-spacing: 1.5px;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <!-- HEADER -->
    <div class="text-center">
      <div class="header-brand">${data.roasteryName}</div>
      <div class="header-sub">AMBACHTELIJKE KOFFIEBRANDERIJ</div>
      <div style="font-size: 9px; line-height: 1.2;">
        ${data.roasteryAddress}<br>
        Tel: ${data.roasteryPhone} · ${data.roasteryWebsite}
      </div>
    </div>

    <div class="divider-double"></div>

    <!-- ORDER & CUSTOMER LINE -->
    <div class="row">
      <span class="label">BESTELNUMMER:</span>
      <span class="val font-bold">#${data.orderNumber}</span>
    </div>
    <div class="row">
      <span class="label">BESTELD DATUM:</span>
      <span class="val">${data.orderDate}</span>
    </div>
    <div class="row">
      <span class="label">KLANT:</span>
      <span class="val font-bold">${data.customerName}</span>
    </div>
    <div class="coffee-highlight-box text-center" style="margin-top: 4px;">
      <span style="font-size: 9.5px; font-weight: bold; letter-spacing: 0.5px;">
        ★ SPECIAAL GEBRAND VOOR ${data.customerName.toUpperCase()} ★
      </span>
    </div>

    <div class="divider-dashed"></div>

    <!-- COFFEE ITEM DETAILS -->
    <div class="coffee-title">${data.productName}</div>
    
    <div class="row">
      <span class="label">NETTO GEWICHT:</span>
      <span class="val font-bold">${data.weight.toUpperCase()}</span>
    </div>
    <div class="row">
      <span class="label">MAALGRAAD:</span>
      <span class="val font-bold">${data.grindOption.toUpperCase()}</span>
    </div>
    <div class="row">
      <span class="label">BRANDGRAAD:</span>
      <span class="val">${data.roastLevel}</span>
    </div>
    <div class="row">
      <span class="label">VERWERKING:</span>
      <span class="val">${data.processingMethod}</span>
    </div>
    <div class="row">
      <span class="label">ORIGINE/VARIËTEIT:</span>
      <span class="val" style="font-size: 9.5px;">${data.origin}</span>
    </div>

    ${data.scaScore ? `
    <div class="row">
      <span class="label">SCA SCORE:</span>
      <span class="val font-bold">${data.scaScore} PTS</span>
    </div>
    ` : ''}

    ${data.flavourNotes && data.flavourNotes.length > 0 ? `
    <div class="divider-dotted"></div>
    <div style="font-size: 9.5px; margin: 3px 0;">
      <span class="font-bold">SMAAKNOTITIES:</span> ${data.flavourNotes.join(' · ')}
    </div>
    ` : ''}

    <div class="divider-double"></div>

    <!-- PRODUCTION & TRACEABILITY (SCENARIO A / B) -->
    <div style="background: #f4f4f4; padding: 4px 6px; border: 1px solid #000000; margin: 4px 0;">
      <div class="row" style="font-size: 11px;">
        <span class="label">BRANDDATUM (ROAST):</span>
        <span class="val font-bold" style="letter-spacing: 0.5px;">${data.roastDate}</span>
      </div>
      <div class="row" style="font-size: 11px;">
        <span class="label">BATCH / LOTNUMMER:</span>
        <span class="val font-bold" style="letter-spacing: 0.5px;">${data.lotNumber}</span>
      </div>
      <div class="row" style="font-size: 10px;">
        <span class="label">T.H.T. (BEST BEFORE):</span>
        <span class="val font-bold">${data.bestBefore}</span>
      </div>
    </div>

    ${data.customNotes ? `
    <div style="font-size: 9px; font-style: italic; margin: 4px 0; text-align: center;">
      "${data.customNotes}"
    </div>
    ` : ''}

    <!-- QR CODE SECTION -->
    <div class="qr-section">
      <img class="qr-img" src="${qrImgSrc}" alt="QR Code Factuur & Dossier" />
      <div class="qr-caption font-bold">SCAN VOOR DIGITALE BTW-FACTUUR</div>
      <div class="qr-caption">& ONLINE AMBACHTELIJK DOSSIER</div>
      <div style="font-size: 7.5px; color: #333; margin-top: 1px;">Factuur: #${data.invoiceNumber}</div>
    </div>

    <!-- LEGAL COMPLIANCE FOOTER -->
    <div class="footer-legal">
      <div><strong>INGREDIËNTEN:</strong> 100% ambachtelijk gebrande koffiebonen.</div>
      <div><strong>BEWAARVOORSCHRIFT:</strong> Koel, droog en donker bewaren. Sluit de zak zorgvuldig na opening voor optimaal aromabehoud.</div>
      <div style="margin-top: 3px;">
        <strong>PRODUCENT:</strong> Maison Milau BV · ${data.roasteryVat}<br>
        Geroosterd met passie in België · Vers van de brander
      </div>
    </div>

    <div class="cut-line">
      ✂ - - - - - - - - - - - - - - - - - - - -
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers printing using a sandboxed, hidden iframe
 * Guarantees zero interference with parent application styles!
 */
export function printReceiptViaIframe(receiptHtml: string) {
  if (typeof window === 'undefined') return;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    console.error('[ReceiptPrinter] Failed to access iframe document');
    return;
  }

  doc.open();
  doc.write(receiptHtml);
  doc.close();

  // Allow fonts & QR SVG to render, then fire print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('[ReceiptPrinter] Print execution error:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 250);
}

interface ReceiptLabelTemplateProps {
  order: Partial<Order>;
  item?: Partial<CartItem>;
  overrides?: Partial<ReceiptLabelData>;
  format?: ReceiptLabelFormat;
  className?: string;
  isInteractivePreview?: boolean;
}

/**
 * Visual Receipt Label Component for on-screen preview & direct DOM printing
 */
export const ReceiptLabelTemplate: React.FC<ReceiptLabelTemplateProps> = ({
  order,
  item,
  overrides,
  format = 'thermal_80mm',
  className = '',
  isInteractivePreview = false,
}) => {
  const data = resolveReceiptData(order, item, overrides);
  const isLabel100x150 = format === 'label_100x150mm';
  const encodedQr = encodeURIComponent(data.qrUrl || `https://www.maison-milau.be/order/${data.orderNumber}`);
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodedQr}&bgcolor=FFFFFF&color=000000&margin=0&format=svg`;

  return (
    <div
      className={`receipt-label-wrapper ${className}`}
      style={{
        fontFamily: "'Space Mono', 'Courier New', Courier, monospace",
      }}
    >
      {/* Visual authentic receipt card with serrated bottom edge */}
      <div
        className={`receipt-ticket relative bg-white text-black border border-stone-300 shadow-lg mx-auto ${
          isLabel100x150 ? 'w-[370px] p-6' : 'w-[310px] p-4'
        }`}
        style={{
          boxShadow: isInteractivePreview ? '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* Paper texture overlay subtle line */}
        <div className="text-center pb-2">
          <div className="text-lg font-black tracking-widest leading-none text-black">
            {data.roasteryName}
          </div>
          <div className="text-[10px] font-bold tracking-wider text-stone-800 mt-1 uppercase">
            Ambachtelijke Koffiebranderij
          </div>
          <div className="text-[9px] text-stone-600 leading-tight mt-0.5">
            {data.roasteryAddress}
            <br />
            Tel: {data.roasteryPhone} · {data.roasteryWebsite}
          </div>
        </div>

        {/* Double solid divider */}
        <div className="border-b-2 border-black my-2" />

        {/* Order header information */}
        <div className="space-y-0.5 text-[11px]">
          <div className="flex justify-between">
            <span className="font-bold">BESTELNUMMER:</span>
            <span className="font-bold font-mono">#{data.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">BESTELD:</span>
            <span>{data.orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">KLANT:</span>
            <span className="font-bold">{data.customerName}</span>
          </div>
        </div>

        {/* Personalized "Gebrand voor" Callout */}
        <div className="border border-black bg-stone-50 text-center py-1 px-2 my-2">
          <span className="text-[10px] font-bold tracking-wide uppercase">
            ★ Speciaal gebrand voor {data.customerName} ★
          </span>
        </div>

        {/* Dashed divider */}
        <div className="border-b border-dashed border-black my-2" />

        {/* Coffee item specs */}
        <div className="text-center my-1.5">
          <h3 className="text-sm font-black uppercase tracking-tight leading-snug">
            {data.productName}
          </h3>
        </div>

        <div className="space-y-1 text-[11px] mt-2">
          <div className="flex justify-between">
            <span className="font-bold">NETTO GEWICHT:</span>
            <span className="font-black">{data.weight.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">MAALGRAAD:</span>
            <span className="font-black">{data.grindOption.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">BRANDGRAAD:</span>
            <span>{data.roastLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">VERWERKING:</span>
            <span>{data.processingMethod}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="font-bold">ORIGINE:</span>
            <span className="text-right truncate max-w-[170px]">{data.origin}</span>
          </div>
          {data.scaScore && (
            <div className="flex justify-between">
              <span className="font-bold">SCA SCORE:</span>
              <span className="font-black">{data.scaScore} PTS</span>
            </div>
          )}
        </div>

        {/* Flavour notes */}
        {data.flavourNotes && data.flavourNotes.length > 0 && (
          <div className="border-t border-dotted border-black my-2 pt-1.5 text-[10px]">
            <span className="font-bold">SMAAKPROFIEL: </span>
            <span>{data.flavourNotes.join(' · ')}</span>
          </div>
        )}

        {/* Double solid divider */}
        <div className="border-b-2 border-black my-2" />

        {/* Smart Roast & Batch box */}
        <div className="border border-black bg-stone-50 p-2 my-2 space-y-0.5 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="font-bold">BRANDDATUM (ROAST):</span>
            <span className="font-black font-mono tracking-wider bg-black text-white px-1.5 py-0.2 rounded-xs">
              {data.roastDate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">LOT / BATCH:</span>
            <span className="font-black font-mono tracking-wider">
              {data.lotNumber}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-stone-800 pt-0.5">
            <span className="font-bold">T.H.T. (BEST BEFORE):</span>
            <span className="font-semibold">{data.bestBefore}</span>
          </div>
        </div>

        {data.customNotes && (
          <div className="text-[10px] italic text-center my-1 text-stone-700">
            "{data.customNotes}"
          </div>
        )}

        {/* Dynamic QR Code */}
        <div className="text-center my-3">
          <img
            src={qrImgSrc}
            alt="Factuur & Dossier QR"
            className="w-20 h-20 mx-auto border border-stone-300 p-0.5 bg-white mb-1"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="text-[9px] font-black tracking-wide leading-tight">
            SCAN VOOR DIGITALE BTW-FACTUUR
          </div>
          <div className="text-[8.5px] text-stone-700 leading-tight">
            & ONLINE AMBACHTELIJK KOFFIEDOSSIER
          </div>
          <div className="text-[7.5px] text-stone-500 font-mono mt-0.5">
            Factuur ref: #{data.invoiceNumber}
          </div>
        </div>

        {/* Legal notice according to EU / FAVV standards */}
        <div className="border-t border-dashed border-black pt-2 mt-2 text-[8px] leading-tight text-center text-stone-700 space-y-1">
          <div>
            <strong>INGREDIËNTEN:</strong> 100% ambachtelijk gebrande koffiebonen.
          </div>
          <div>
            <strong>BEWAARADVIES:</strong> Koel, droog en donker bewaren in de originele verpakking met aromaventiel.
          </div>
          <div>
            <strong>PRODUCENT:</strong> Maison Milau BV · {data.roasteryVat}
            <br />
            Ambachtelijk geroosterd in België · Vers van de brander
          </div>
        </div>

        {/* Authentic receipt cut-line */}
        <div className="text-center text-[10px] tracking-widest text-stone-500 pt-3 mt-1">
          ✂ - - - - - - - - - - - - - - - - - - - -
        </div>
      </div>
    </div>
  );
};
