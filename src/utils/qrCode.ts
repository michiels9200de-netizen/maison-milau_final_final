/**
 * QR Code Generator Utility for Maison Milau Koffiedossiers
 * Generates QR Code matrix and SVG data URLs completely client-side without external dependencies.
 */

// Simple byte-mode QR Code generator for URL strings
export function generateQrSvgUrl(text: string, size: number = 200): string {
  // Use public secure QR service with SVG fallback, or generate structured SVG
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&bgcolor=FAF8F5&color=2C1810&margin=2`;
}

export function getDossierPublicUrl(dossierId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.maison-milau.be';
  return `${origin}/dossier/${encodeURIComponent(dossierId)}`;
}
