import PDFDocument from 'pdfkit';
import { CoffeeDossier } from '../src/types';

export function generateCoffeeDossierPdf(dossier: CoffeeDossier): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `Koffiedossier - ${dossier.productName}`,
      Author: 'Maison Milau Ambachtelijke Branderij',
      Subject: 'Officiële Koffiespecificaties & Terroir Dossier',
      Keywords: 'koffie, dossier, specialty coffee, maison milau, branderij',
    },
  });

  // Color Palette
  const PRIMARY = '#2C1810'; // Dark Espresso
  const ACCENT = '#9A3412'; // Warm Terracotta / Amber
  const MUTED = '#57534E'; // Stone 600
  const LIGHT_BG = '#F5F5F4'; // Stone 100
  const BORDER = '#E7E5E4'; // Stone 200

  // 1. Header with Maison Milau Branding
  doc.rect(40, 40, 515, 60).fill('#24140E');

  doc.fillColor('#FFFFFF')
     .fontSize(10)
     .font('Helvetica-Bold')
     .text('MAISON MILAU', 55, 55, { characterSpacing: 2 });

  doc.fillColor('#D6D3D1')
     .fontSize(8)
     .font('Helvetica')
     .text('AMBACHTELIJKE KOFFIEBRANDERIJ · OUDEGEM, BELGIË', 55, 70, { characterSpacing: 1 });

  doc.fillColor('#F59E0B')
     .fontSize(10)
     .font('Helvetica-Bold')
     .text('OFFICIEEL KOFFIEDOSSIER', 380, 55, { align: 'right' });

  if (dossier.collection) {
    doc.fillColor('#E7E5E4')
       .fontSize(8)
       .font('Helvetica')
       .text(`COLLECTIE: ${dossier.collection.toUpperCase()}`, 380, 70, { align: 'right' });
  }

  // 2. Product Title & Short Intro
  doc.fillColor(PRIMARY)
     .fontSize(22)
     .font('Helvetica-Bold')
     .text(dossier.productName, 40, 120);

  if (dossier.scaScore) {
    doc.rect(450, 120, 105, 24).fill(LIGHT_BG);
    doc.strokeColor(BORDER).rect(450, 120, 105, 24).stroke();
    doc.fillColor(ACCENT)
       .fontSize(9)
       .font('Helvetica-Bold')
       .text(`SCA SCORE: ${dossier.scaScore}`, 455, 127, { align: 'center', width: 95 });
  }

  doc.fillColor(MUTED)
     .fontSize(10)
     .font('Helvetica-Oblique')
     .text(dossier.shortIntro || '', 40, 150, { width: 515, lineGap: 3 });

  // Divider
  doc.moveTo(40, 180).lineTo(555, 180).strokeColor(BORDER).stroke();

  // 3. Two-Column Layout: Left (Terroir & Specs), Right (Sensory & Roast)
  const colY = 195;
  const colWidth = 245;

  // Left Box: Herkomst, Terroir & Botanica
  doc.rect(40, colY, colWidth, 190).fill(LIGHT_BG);
  doc.strokeColor(BORDER).rect(40, colY, colWidth, 190).stroke();

  doc.fillColor(PRIMARY)
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('HERKOMST & BOTANICA', 52, colY + 12);

  const leftFields = [
    { label: 'Land van herkomst', value: dossier.origin },
    { label: 'Regio / Terroir', value: dossier.region },
    { label: 'Boerderij / Producent', value: dossier.farmProducer },
    { label: 'Botanische Variëteit', value: dossier.varietal },
    { label: 'Verwerkingsmethode', value: dossier.processingMethod },
  ];

  let currentLeftY = colY + 34;
  leftFields.forEach(f => {
    doc.fillColor(MUTED).fontSize(7).font('Helvetica-Bold').text(f.label.toUpperCase(), 52, currentLeftY);
    doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica').text(f.value || 'Niet gespecificeerd', 52, currentLeftY + 9, { width: colWidth - 24 });
    currentLeftY += 28;
  });

  // Right Box: Smaakprofiel & Sensorische Schaal
  const rightX = 310;
  doc.rect(rightX, colY, colWidth, 190).fill(LIGHT_BG);
  doc.strokeColor(BORDER).rect(rightX, colY, colWidth, 190).stroke();

  doc.fillColor(PRIMARY)
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('SMAAKPROFIEL & BRANDING', rightX + 12, colY + 12);

  doc.fillColor(MUTED).fontSize(7).font('Helvetica-Bold').text('BRANDPROFIEL', rightX + 12, colY + 34);
  doc.fillColor(ACCENT).fontSize(8.5).font('Helvetica-Bold').text(dossier.roastProfile || 'Ambachtelijke branding', rightX + 12, colY + 43, { width: colWidth - 24 });

  // Flavour Notes Badges
  doc.fillColor(MUTED).fontSize(7).font('Helvetica-Bold').text('SMAAKTONEN', rightX + 12, colY + 68);
  const notesText = Array.isArray(dossier.flavourNotes) ? dossier.flavourNotes.join(' · ') : dossier.flavourNotes;
  doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text(notesText || 'Karakteristiek profiel', rightX + 12, colY + 77, { width: colWidth - 24 });

  // Sensory Gauges
  const renderGauge = (title: string, value: number, desc: string | undefined, yPos: number) => {
    doc.fillColor(MUTED).fontSize(7).font('Helvetica-Bold').text(title.toUpperCase(), rightX + 12, yPos);
    doc.fillColor(PRIMARY).fontSize(7.5).font('Helvetica').text(`${value}/5 ${desc ? `(${desc})` : ''}`, rightX + 12, yPos + 8, { width: colWidth - 24 });
    
    // Bar Background
    doc.rect(rightX + 12, yPos + 18, 200, 4).fill('#E7E5E4');
    // Filled Bar
    const filledWidth = Math.min(200, Math.max(10, (value / 5) * 200));
    doc.rect(rightX + 12, yPos + 18, filledWidth, 4).fill(ACCENT);
  };

  renderGauge('Body & Mondgevoel', dossier.body, dossier.bodyDescription, colY + 100);
  renderGauge('Levendigheid & Aciditeit', dossier.acidity, dossier.acidityDescription, colY + 128);
  renderGauge('Natuurlijke Zoetheid', dossier.sweetness, dossier.sweetnessDescription, colY + 156);

  // 4. Coffee Story Section
  const storyY = 405;
  doc.fillColor(PRIMARY)
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('HET KOFFIEVERHAAL', 40, storyY);

  doc.fillColor(MUTED)
     .fontSize(9)
     .font('Helvetica')
     .text(dossier.coffeeStory || '', 40, storyY + 18, { width: 515, lineGap: 3 });

  // 5. Preparation & Pairings
  const prepY = 480;
  doc.rect(40, prepY, 515, 65).fill(LIGHT_BG);
  doc.strokeColor(BORDER).rect(40, prepY, 515, 65).stroke();

  doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('AANBEVOLEN ZETMETHODES', 52, prepY + 10);
  const brewText = Array.isArray(dossier.brewingMethods) ? dossier.brewingMethods.join(', ') : dossier.brewingMethods;
  doc.fillColor(ACCENT).fontSize(8.5).font('Helvetica-Bold').text(brewText || 'Espresso, Volautomaat, Filter', 52, prepY + 24, { width: 230 });

  doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('GASTRONOMISCHE FOOD PAIRING', 300, prepY + 10);
  doc.fillColor(MUTED).fontSize(8.5).font('Helvetica').text(dossier.foodPairings || 'Heerlijk puur of met artisanale patisserie.', 300, prepY + 24, { width: 240 });

  // 6. Traceability & Sustainability
  const certY = 560;
  doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('TRACEERBAARHEID & HERKOMSTTRANSPARANTIE', 40, certY);
  doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(dossier.traceabilityInfo || 'Volledig traceerbare toeleveringsketen.', 40, certY + 14, { width: 515 });

  doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('DUURZAAMHEID & SOCIALE IMPACT', 40, certY + 45);
  doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(dossier.sustainabilityInfo || 'Eerlijke vergoeding en milieubewuste teelt.', 40, certY + 59, { width: 515 });

  if (dossier.additionalNotes) {
    doc.fillColor(PRIMARY).fontSize(9).font('Helvetica-Bold').text('AANVULLENDE BRANDERSNOTITIES', 40, certY + 90);
    doc.fillColor(MUTED).fontSize(8).font('Helvetica-Oblique').text(dossier.additionalNotes, 40, certY + 102, { width: 515 });
  }

  // 7. Footer & Authenticity Stamp
  doc.moveTo(40, 750).lineTo(555, 750).strokeColor(BORDER).stroke();

  doc.fillColor(MUTED)
     .fontSize(7.5)
     .font('Helvetica')
     .text('Maison Milau · Ambachtelijke Koffiebranderij · www.maison-milau.be · info@maison-milau.be · Gecertificeerd Enkelvoudig Dossier', 40, 760);

  doc.fillColor(ACCENT)
     .fontSize(7.5)
     .font('Helvetica-Bold')
     .text(`Dossier ID: ${dossier.id} · Laatst bijgewerkt: ${new Date(dossier.updatedAt || Date.now()).toLocaleDateString('nl-BE')}`, 40, 772);

  return doc;
}
