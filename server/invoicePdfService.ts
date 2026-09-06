import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

export interface InvoiceItem {
  productName: string;
  variantWeight?: string;
  grindOption?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  vatRate?: number; // 6 or 21
  selectedBeans?: string[];
  selectedColor?: string;
  selectedSize?: string;
}

export interface SubscriptionInvoiceDetails {
  subscriptionId: string;
  coffeeName: string;
  weight?: string;
  grindOption?: string;
  frequency: string;
  discountPercent?: number;
  nextBillingDate?: string;
  nextDeliveryDate?: string;
}

export interface MolliePaymentDetails {
  paymentId?: string;
  transactionReference?: string;
  paymentMethod?: string;
  paymentDate?: string;
  status?: string;
  refundStatus?: string;
  settlementAmount?: string;
}

export interface FullInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  orderNumber?: string;
  orderId?: string;
  status: 'paid' | 'open' | 'pending' | 'cancelled' | 'partially_paid' | string;
  
  // Customer & Billing
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  vatNumber?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  deliveryMethod?: string;
  trackingCode?: string;

  // Items & Pricing
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  vatAmount: number;
  total: number;
  currency?: string;

  // Mollie Source of Truth
  mollie?: MolliePaymentDetails;

  // Subscription (if applicable)
  subscription?: SubscriptionInvoiceDetails;
}

const COMPANY_INFO = {
  name: 'Maison Milau',
  legalName: 'Maison Milau Ambachtelijke Koffiebranderij',
  street: 'Jef Scheirsstraat 29',
  postalCode: '9200',
  city: 'Oudegem (Dendermonde)',
  country: 'België',
  vatNumber: 'BE 1041.542.844',
  rpr: 'RPR Dendermonde',
  email: 'maisonmilau@gmail.com',
  website: 'www.maison-milau.be',
  phone: '+32 467 77 37 66',
  iban: 'BE24 7370 1234 5678',
  bic: 'KREDBEBB',
};

/**
 * Generate a luxury, professional PDF Invoice conforming to Belgian VAT regulations
 * and using Mollie as the payment source of truth.
 */
export function generateInvoicePdfBuffer(data: FullInvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
        info: {
          Title: `Factuur ${data.invoiceNumber} - ${COMPANY_INFO.name}`,
          Author: COMPANY_INFO.legalName,
          Subject: `Factuur ${data.invoiceNumber} voor ${data.customerName}`,
          Creator: 'Maison Milau Invoice Engine',
          Producer: 'Maison Milau Roastery Systems',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const pageWidth = 595.28; // A4 width in pt
      const pageHeight = 841.89; // A4 height in pt
      const contentWidth = pageWidth - 80; // 515.28
      const left = 40;
      const right = left + contentWidth;

      // Color Palette (Luxury Coffee Brand Aesthetic)
      const primaryColor = '#1C1917'; // Stone 900
      const accentBronze = '#78350F'; // Amber 900
      const mutedText = '#78716C'; // Stone 500
      const darkText = '#292524'; // Stone 800
      const tableHeaderBg = '#292524'; // Stone 800
      const boxBg = '#FAF7F2'; // Warm luxury cream
      const borderLine = '#E7E5E4'; // Stone 200

      let y = 40;

      // =======================================================================
      // 1. BRAND HEADER & INVOICE METADATA
      // =======================================================================
      const logoPath = path.resolve(process.cwd(), 'public/logo.png');
      const hasLogo = fs.existsSync(logoPath);

      if (hasLogo) {
        try {
          doc.image(logoPath, left, y, { width: 105 });
        } catch (e) {
          // Fallback typography if image fails
          doc.font('Helvetica-Bold').fontSize(20).fillColor(accentBronze).text('MAISON MILAU', left, y);
        }
      } else {
        doc.font('Helvetica-Bold').fontSize(20).fillColor(accentBronze).text('MAISON MILAU', left, y);
      }

      // Company Information under Logo
      const companyY = y + (hasLogo ? 75 : 30);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(primaryColor).text(COMPANY_INFO.legalName, left, companyY);
      doc.font('Helvetica').fontSize(8).fillColor(mutedText);
      doc.text(`Atelier: ${COMPANY_INFO.street}, ${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}`, left, companyY + 14);
      doc.text(`BTW / Ondernemingsnr: ${COMPANY_INFO.vatNumber} (${COMPANY_INFO.rpr})`, left, companyY + 25);
      doc.text(`E-mail: ${COMPANY_INFO.email} · Web: ${COMPANY_INFO.website}`, left, companyY + 36);
      doc.text(`Telefoon: ${COMPANY_INFO.phone} · IBAN: ${COMPANY_INFO.iban}`, left, companyY + 47);

      // Top Right: Factuur Meta Box
      const metaBoxX = 330;
      const metaBoxWidth = contentWidth - (metaBoxX - left);
      doc.rect(metaBoxX, y, metaBoxWidth, 120).fillAndStroke(boxBg, borderLine);

      doc.font('Helvetica-Bold').fontSize(15).fillColor(accentBronze).text('FACTUUR / INVOICE', metaBoxX + 14, y + 14);

      doc.font('Helvetica-Bold').fontSize(9).fillColor(darkText);
      doc.text('Factuurnummer:', metaBoxX + 14, y + 36);
      doc.font('Helvetica').text(data.invoiceNumber, metaBoxX + 105, y + 36);

      doc.font('Helvetica-Bold').text('Factuurdatum:', metaBoxX + 14, y + 50);
      doc.font('Helvetica').text(data.issueDate, metaBoxX + 105, y + 50);

      doc.font('Helvetica-Bold').text('Vervaldatum:', metaBoxX + 14, y + 64);
      doc.font('Helvetica').text(data.dueDate || 'Voldaan bij bestelling', metaBoxX + 105, y + 64);

      doc.font('Helvetica-Bold').text('Orderreferentie:', metaBoxX + 14, y + 78);
      doc.font('Helvetica').text(data.orderNumber || data.orderId || '-', metaBoxX + 105, y + 78);

      // Status Pill inside Meta Box
      const isPaid = data.status === 'paid' || data.status === 'payment_successful';
      const statusText = isPaid ? 'STATUS: VOLDAAN (BETAALD)' : 'STATUS: OPENSTAAND';
      const statusBg = isPaid ? '#ECFDF5' : '#FEF3C7';
      const statusBorder = isPaid ? '#10B981' : '#F59E0B';
      const statusColor = isPaid ? '#065F46' : '#92400E';

      doc.rect(metaBoxX + 14, y + 94, metaBoxWidth - 28, 16).fillAndStroke(statusBg, statusBorder);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(statusColor).text(statusText, metaBoxX + 14, y + 98, {
        width: metaBoxWidth - 28,
        align: 'center',
      });

      // Accent gold divider line
      y = companyY + 68;
      doc.strokeColor(accentBronze).lineWidth(1.5).moveTo(left, y).lineTo(right, y).stroke();
      y += 15;

      // =======================================================================
      // 2. CUSTOMER & BILLING INFORMATION (2 Columns)
      // =======================================================================
      const colWidth = (contentWidth - 20) / 2;
      const col2Left = left + colWidth + 20;

      // Left Column: Facturatiegegevens
      doc.rect(left, y, colWidth, 95).fillAndStroke(boxBg, borderLine);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(accentBronze).text('FACTUUR VOOR (KLANT / FACTURATIEADRES):', left + 12, y + 10);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor);
      doc.text(data.companyName ? `${data.companyName}` : data.customerName, left + 12, y + 26);
      
      doc.font('Helvetica').fontSize(8).fillColor(darkText);
      let addressLine = 38;
      if (data.companyName && data.customerName) {
        doc.text(`T.a.v. ${data.customerName}`, left + 12, y + addressLine);
        addressLine += 12;
      }
      if (data.vatNumber) {
        doc.font('Helvetica-Bold').text(`BTW-nummer: ${data.vatNumber}`, left + 12, y + addressLine);
        doc.font('Helvetica');
        addressLine += 12;
      }
      const bill = data.billingAddress || data.shippingAddress;
      if (bill?.street) {
        doc.text(`${bill.street}`, left + 12, y + addressLine);
        addressLine += 11;
        doc.text(`${bill.postalCode || ''} ${bill.city || ''} (${bill.country || 'België'})`, left + 12, y + addressLine);
        addressLine += 11;
      }
      doc.fillColor(mutedText).text(`E-mail: ${data.customerEmail}`, left + 12, y + addressLine);

      // Right Column: Leverings- & Logistieke gegevens
      doc.rect(col2Left, y, colWidth, 95).fillAndStroke(boxBg, borderLine);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(accentBronze).text('LEVERING & VERZENDING:', col2Left + 12, y + 10);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor);
      doc.text(data.customerName, col2Left + 12, y + 26);

      doc.font('Helvetica').fontSize(8).fillColor(darkText);
      let shipLine = 38;
      const ship = data.shippingAddress || data.billingAddress;
      if (ship?.street) {
        doc.text(`${ship.street}`, col2Left + 12, y + shipLine);
        shipLine += 11;
        doc.text(`${ship.postalCode || ''} ${ship.city || ''} (${ship.country || 'België'})`, col2Left + 12, y + shipLine);
        shipLine += 11;
      }
      doc.text(`Methode: ${data.deliveryMethod || 'Bpost Thuislevering'}`, col2Left + 12, y + shipLine);
      shipLine += 11;
      doc.fillColor(mutedText).text(`Tracking: ${data.trackingCode || 'Wordt toegekend bij verzending'}`, col2Left + 12, y + shipLine);

      y += 105;

      // =======================================================================
      // 3. SUBSCRIPTION INVOICE CALLOUT (If applicable)
      // =======================================================================
      if (data.subscription) {
        const sub = data.subscription;
        doc.rect(left, y, contentWidth, 52).fillAndStroke('#FFFBEB', '#FDE68A');
        doc.font('Helvetica-Bold').fontSize(9).fillColor(accentBronze).text('PERIODIEK KOFFIE ABONNEMENT (RECURRING SUBSCRIPTION):', left + 12, y + 8);
        doc.font('Helvetica').fontSize(8).fillColor(darkText);
        doc.text(`Abonnement ID: ${sub.subscriptionId} · Koffie: ${sub.coffeeName} (${sub.weight || '1kg'} · ${sub.grindOption || 'Volle bonen'})`, left + 12, y + 22);
        doc.text(`Leverfrequentie: ${sub.frequency} · Korting: ${sub.discountPercent || 10}% vaste abonnementskorting`, left + 12, y + 34);
        doc.text(`Volgende facturatie: ${sub.nextBillingDate || '-'} · Volgende leverdatum: ${sub.nextDeliveryDate || '-'}`, 330, y + 34);
        y += 60;
      }

      // =======================================================================
      // 4. ORDER DETAILS & LINE ITEMS TABLE
      // =======================================================================
      const tableTop = y;
      const rowHeight = 22;

      // Table Header
      doc.rect(left, tableTop, contentWidth, rowHeight).fill(tableHeaderBg);
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF');

      const colPos = {
        desc: left + 10,
        descW: 240,
        qty: left + 260,
        qtyW: 40,
        price: left + 310,
        priceW: 60,
        vat: left + 380,
        vatW: 45,
        total: left + 435,
        totalW: 70,
      };

      doc.text('Artikel / Omschrijving', colPos.desc, tableTop + 6);
      doc.text('Aantal', colPos.qty, tableTop + 6, { width: colPos.qtyW, align: 'center' });
      doc.text('Prijs excl.', colPos.price, tableTop + 6, { width: colPos.priceW, align: 'right' });
      doc.text('BTW %', colPos.vat, tableTop + 6, { width: colPos.vatW, align: 'center' });
      doc.text('Totaal incl.', colPos.total, tableTop + 6, { width: colPos.totalW, align: 'right' });

      y = tableTop + rowHeight;

      // Table Rows
      let coffeeExclSum = 0;
      let coffeeVatSum = 0;
      let otherExclSum = 0;
      let otherVatSum = 0;

      data.items.forEach((item, idx) => {
        const isCoffee = !item.productName.toLowerCase().includes('machine') &&
                         !item.productName.toLowerCase().includes('workshop') &&
                         !item.productName.toLowerCase().includes('mok') &&
                         !item.productName.toLowerCase().includes('t-shirt');

        const vatRate = item.vatRate !== undefined ? item.vatRate : (isCoffee ? 6 : 21);
        const itemTotalIncl = item.totalPrice !== undefined ? item.totalPrice : ((item.unitPrice || 0) * (item.quantity || 1));
        const itemTotalExcl = itemTotalIncl / (1 + vatRate / 100);
        const itemVat = itemTotalIncl - itemTotalExcl;

        if (vatRate === 6) {
          coffeeExclSum += itemTotalExcl;
          coffeeVatSum += itemVat;
        } else {
          otherExclSum += itemTotalExcl;
          otherVatSum += itemVat;
        }

        const bg = idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9';
        const itemRowHeight = item.selectedBeans?.length ? 30 : 22;

        doc.rect(left, y, contentWidth, itemRowHeight).fillAndStroke(bg, borderLine);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(primaryColor);

        // Product description + specs
        const specs = [item.variantWeight, item.grindOption, item.selectedColor].filter(Boolean).join(' · ');
        const mainDesc = specs ? `${item.productName} (${specs})` : item.productName;
        doc.text(mainDesc, colPos.desc, y + 6, { width: colPos.descW, ellipsis: true });

        if (item.selectedBeans?.length) {
          doc.font('Helvetica').fontSize(7).fillColor(accentBronze);
          doc.text(`Bonenselectie: ${item.selectedBeans.join(', ')}`, colPos.desc, y + 17, { width: colPos.descW });
        }

        // Qty
        doc.font('Helvetica').fontSize(8).fillColor(darkText);
        doc.text(`${item.quantity}x`, colPos.qty, y + 6, { width: colPos.qtyW, align: 'center' });

        // Unit price excl
        const unitExcl = (item.unitPrice || 0) / (1 + vatRate / 100);
        doc.text(`€${unitExcl.toFixed(2)}`, colPos.price, y + 6, { width: colPos.priceW, align: 'right' });

        // VAT rate
        doc.text(`${vatRate}%`, colPos.vat, y + 6, { width: colPos.vatW, align: 'center' });

        // Line total incl
        doc.font('Helvetica-Bold').text(`€${itemTotalIncl.toFixed(2)}`, colPos.total, y + 6, { width: colPos.totalW, align: 'right' });

        y += itemRowHeight;
      });

      // Shipping line item (Belgian 21% VAT on logistics)
      if (data.shippingCost > 0) {
        const shipExcl = data.shippingCost / 1.21;
        const shipVat = data.shippingCost - shipExcl;
        otherExclSum += shipExcl;
        otherVatSum += shipVat;

        doc.rect(left, y, contentWidth, 20).fillAndStroke('#FFFFFF', borderLine);
        doc.font('Helvetica').fontSize(8).fillColor(primaryColor);
        doc.text(`Verzending & Verpakking (${data.deliveryMethod || 'Bpost Thuislevering'})`, colPos.desc, y + 5);
        doc.text('1x', colPos.qty, y + 5, { width: colPos.qtyW, align: 'center' });
        doc.text(`€${shipExcl.toFixed(2)}`, colPos.price, y + 5, { width: colPos.priceW, align: 'right' });
        doc.text('21%', colPos.vat, y + 5, { width: colPos.vatW, align: 'center' });
        doc.font('Helvetica-Bold').text(`€${data.shippingCost.toFixed(2)}`, colPos.total, y + 5, { width: colPos.totalW, align: 'right' });
        y += 20;
      }

      y += 12;

      // =======================================================================
      // 5. VAT BREAKDOWN & FINANCIAL SUMMARY BOXES
      // =======================================================================
      const summaryLeft = 310;
      const summaryWidth = contentWidth - (summaryLeft - left);
      const vatBoxWidth = summaryLeft - left - 15;

      // Left Box: Belgian Legal VAT Breakdown (Fiscale BTW-uitsplitsing)
      doc.rect(left, y, vatBoxWidth, 90).fillAndStroke(boxBg, borderLine);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(accentBronze).text('FISCALE BTW-UITSPLITSING (BELGIË):', left + 10, y + 8);

      doc.font('Helvetica-Bold').fontSize(7.5).fillColor(mutedText);
      doc.text('Tarief', left + 10, y + 22);
      doc.text('Maatstaf van heffing', left + 55, y + 22);
      doc.text('BTW-bedrag', left + 145, y + 22);

      doc.font('Helvetica').fontSize(7.5).fillColor(darkText);
      doc.text('6% (Koffiebonen):', left + 10, y + 36);
      doc.text(`€${coffeeExclSum.toFixed(2)}`, left + 75, y + 36);
      doc.text(`€${coffeeVatSum.toFixed(2)}`, left + 145, y + 36);

      doc.text('21% (Verzending/App.):', left + 10, y + 49);
      doc.text(`€${otherExclSum.toFixed(2)}`, left + 75, y + 49);
      doc.text(`€${otherVatSum.toFixed(2)}`, left + 145, y + 49);

      doc.strokeColor(borderLine).lineWidth(0.5).moveTo(left + 10, y + 62).lineTo(left + vatBoxWidth - 10, y + 62).stroke();

      doc.font('Helvetica-Bold').text('Totaal BTW:', left + 10, y + 68);
      const calculatedTotalVat = coffeeVatSum + otherVatSum;
      doc.text(`€${(data.vatAmount || calculatedTotalVat).toFixed(2)}`, left + 145, y + 68);

      // Right Box: Totals
      doc.rect(summaryLeft, y, summaryWidth, 90).fillAndStroke('#FFFFFF', borderLine);
      doc.font('Helvetica').fontSize(8).fillColor(darkText);

      let totY = y + 8;
      doc.text('Subtotaal artikelen (excl. BTW):', summaryLeft + 10, totY);
      const totalExcl = (coffeeExclSum + (data.shippingCost ? (otherExclSum - data.shippingCost / 1.21) : otherExclSum));
      doc.text(`€${totalExcl.toFixed(2)}`, summaryLeft + 120, totY, { width: summaryWidth - 130, align: 'right' });

      if (data.discountAmount && data.discountAmount > 0) {
        totY += 12;
        doc.fillColor(accentBronze).text('Toegepaste korting:', summaryLeft + 10, totY);
        doc.text(`-€${data.discountAmount.toFixed(2)}`, summaryLeft + 120, totY, { width: summaryWidth - 130, align: 'right' });
        doc.fillColor(darkText);
      }

      totY += 12;
      doc.text('Verzendkosten:', summaryLeft + 10, totY);
      doc.text(data.shippingCost > 0 ? `€${data.shippingCost.toFixed(2)}` : 'Gratis', summaryLeft + 120, totY, { width: summaryWidth - 130, align: 'right' });

      totY += 12;
      doc.text('Inbegrepen BTW (6% & 21%):', summaryLeft + 10, totY);
      doc.text(`€${(data.vatAmount || calculatedTotalVat).toFixed(2)}`, summaryLeft + 120, totY, { width: summaryWidth - 130, align: 'right' });

      totY += 14;
      // Grand Total Highlight Bar
      doc.rect(summaryLeft, totY, summaryWidth, 24).fill(primaryColor);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
      doc.text('TOTAAL INCL. BTW:', summaryLeft + 10, totY + 7);
      doc.text(`€${data.total.toFixed(2)}`, summaryLeft + 100, totY + 7, { width: summaryWidth - 110, align: 'right' });

      y += 102;

      // =======================================================================
      // 6. MOLLIE INTEGRATION (PAYMENT SOURCE OF TRUTH)
      // =======================================================================
      const mollie = data.mollie || {};
      const mollieId = mollie.paymentId || (data as any).molliePaymentId || 'tr_geen_id';
      const paymentMethod = mollie.paymentMethod || (data as any).paymentMethod || 'Mollie Online Betaling';
      const paymentStatus = mollie.status || (isPaid ? 'paid' : 'open');
      const refundStatus = mollie.refundStatus || 'Geen terugbetaling van toepassing';

      doc.rect(left, y, contentWidth, 58).fillAndStroke(boxBg, borderLine);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(accentBronze).text('BETALINGSGEGEVENS (MOLLIE SOURCE OF TRUTH):', left + 12, y + 8);

      doc.font('Helvetica').fontSize(8).fillColor(darkText);
      doc.text(`Mollie Betaal-ID: `, left + 12, y + 23);
      doc.font('Helvetica-Bold').text(mollieId, left + 92, y + 23);

      doc.font('Helvetica').text(`Betaalmethode: `, left + 270, y + 23);
      doc.font('Helvetica-Bold').text(paymentMethod, left + 345, y + 23);

      doc.font('Helvetica').text(`Transactiereferentie: `, left + 12, y + 35);
      doc.font('Helvetica').text(mollie.transactionReference || mollieId, left + 98, y + 35);

      doc.font('Helvetica').text(`Betalingsdatum: `, left + 270, y + 35);
      doc.font('Helvetica').text(mollie.paymentDate || data.issueDate, left + 345, y + 35);

      doc.font('Helvetica').text(`Status / Terugbetaling: `, left + 12, y + 46);
      doc.font('Helvetica-Bold').text(`${paymentStatus.toUpperCase()} · ${refundStatus}`, left + 98, y + 46);

      y += 68;

      // =======================================================================
      // 7. FOOTER (LUXURY BRAND & LEGAL COMPLIANCE)
      // =======================================================================
      const footerY = pageHeight - 55;
      doc.strokeColor(borderLine).lineWidth(1).moveTo(left, footerY).lineTo(right, footerY).stroke();

      doc.font('Helvetica').fontSize(7.5).fillColor(mutedText);
      doc.text(
        `${COMPANY_INFO.name} · ${COMPANY_INFO.street}, ${COMPANY_INFO.postalCode} ${COMPANY_INFO.city} · BTW ${COMPANY_INFO.vatNumber} (${COMPANY_INFO.rpr})`,
        left,
        footerY + 6,
        { width: contentWidth, align: 'center' }
      );
      doc.text(
        `IBAN: ${COMPANY_INFO.iban} · BIC: ${COMPANY_INFO.bic} · E-mail: ${COMPANY_INFO.email} · Website: ${COMPANY_INFO.website}`,
        left,
        footerY + 16,
        { width: contentWidth, align: 'center' }
      );
      doc.text(
        'Factuur opgemaakt conform de Belgische BTW-wetgeving. Bedankt voor uw bestelling bij Maison Milau!',
        left,
        footerY + 26,
        { width: contentWidth, align: 'center' }
      );

      // Finalize page numbering
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica').fontSize(7.5).fillColor(mutedText).text(
          `Pagina ${i + 1} van ${totalPages}`,
          right - 100,
          footerY + 36,
          { width: 100, align: 'right' }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
