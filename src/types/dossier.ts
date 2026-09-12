export interface CentralCoffeeDossier {
  // Identification & Classification
  id: string; // unique identifier, e.g. 'budget-espresso', 'selection-daily', 'barrel-buffalo-trace'
  sku?: string;
  webshopProductId?: string;
  collection: string; // 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origin' | 'Barrel Aged' | 'Infused'
  type?: string; // 'Espresso' | 'Daily' | 'Filter' | 'Omni' | 'Specialty'
  scaScore?: string;
  imageUrl?: string;

  // Primary Required Dossier Fields (Single Source of Truth)
  productName: string; // Product Name
  shortIntro: string; // Short Introduction
  coffeeStory: string; // Coffee Story (In-depth background & philosophy)
  origin: string; // Origin (Country / Land van herkomst)
  region: string; // Region (e.g. Huila, Nariño, Yirgacheffe)
  farmProducer: string; // Farm / Producer (e.g. Finca La Esperanza, Cooperatieve)
  varietal: string; // Varietal (e.g. Caturra, Castillo, Geisha, Bourbon)
  processingMethod: string; // Processing Method (e.g. Washed, Natural, Honey, Anaerobic)
  roastProfile: string; // Roast Profile (e.g. Medium-dark espresso roast, 18-20% development)
  flavourNotes: string[]; // Flavour Notes (e.g. ['Pure Chocolade', 'Geroosterde Noten'])
  body: string; // Body (e.g. '5/5' or 'Vol, zwaar en fluweelzacht')
  acidity: string; // Acidity (e.g. '1/5' or 'Zacht, laag')
  sweetness: string; // Sweetness (e.g. '3/5' or 'Karamel, toffee')
  recommendedBrewingMethods: string[]; // Recommended Brewing Methods (e.g. ['Espresso', 'Volautomaat', 'Moka Pot'])
  foodPairings: string; // Food Pairings (Gastronomische combinaties)
  traceabilityInfo: string; // Traceability Information (Lot nummers, transparantie)
  sustainabilityInfo: string; // Sustainability Information (Ethische handel, biologisch)
  additionalNotes: string; // Additional Notes (Publiek zichtbare extra info)
  internalNotes: string; // Internal Notes (Admin Only - strikt privé)

  // Audit
  lastUpdated: string;
  updatedBy?: string;
}
