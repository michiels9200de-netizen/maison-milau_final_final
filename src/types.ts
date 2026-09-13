// Maison Milau Type Definitions
// Step 3: Database Entities & Domain Models

export type UserRole = 'b2c_customer' | 'b2b_admin' | 'b2b_buyer' | 'b2b_approver' | 'store_admin';

export interface UserAddress {
  id: string;
  label: string; // 'Thuis' | 'Werk' | 'Vakantieadres' | 'Magazijn' | 'Hoofdkantoor' | 'Vestiging Brussel' | 'Vestiging Antwerpen'
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  phone?: string;
  accountType: 'particulier' | 'professioneel';
  role: UserRole | string;
  b2bRole?: 'b2c' | 'b2b' | 'admin';
  b2bStatus?: 'pending' | 'approved' | 'rejected';
  status?: 'pending' | 'approved' | 'rejected' | 'active' | string;
  companyId?: string;
  companyName?: string;
  vatNumber?: string;
  addresses: UserAddress[];
  loyaltyPoints: number;
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  vatNumber: string;
  billingAddress: UserAddress;
  shippingAddresses: UserAddress[];
  approvedBudget: number;
  usedBudget: number;
  contractDiscountPct: number;
  paymentTermsDays: number;
  status: 'active' | 'pending_approval' | 'suspended';
}

export interface CoffeeOrigin {
  country: string;
  flag: string;
  region?: string;
}

export interface CharacterProfile {
  description: string;
  body: number; // 1 to 5
  acidity: number; // 1 to 5
  sweetness: number; // 1 to 5
}

export interface CollectionIntro {
  id: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origin' | 'Single Origins' | 'Barrel Aged' | 'Infused';
  title: string;
  priceFrom: string;
  description: string[];
  targetAudienceTitle?: string;
  targetAudience?: string[];
  barrelProfiles?: {
    caskName: string;
    notes: string[];
  }[];
  extraNote?: string;
}

export interface CoffeeCatalogItem {
  id: string;
  slug: string;
  name: string;
  collection: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origin' | 'Single Origins' | 'Barrel Aged' | 'Infused';
  type: 'Espresso' | 'Omni' | 'Filter' | 'Specialty';
  scaScore: string; // e.g. "86-87+", "88.5"
  beanSelection: string;
  roastProfile: string;
  flavors: string[];
  character: string;
  characterProfile?: CharacterProfile;
  origins?: CoffeeOrigin[];
  brewRecommendations: string[];
  retailPriceGuide: string; // e.g. "Vanaf €8,50 per 250g"
  webshopProductId: string; // Bi-directional link
  imageUrl?: string;
}

export interface ProductVariant {
  weight: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  collection: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origin' | 'Single Origins' | 'Barrel Aged' | 'Infused' | 'Giftboxes' | 'Toebehoren' | 'Abonnementen';
  category: 'blends' | 'single_origins' | 'barrel_aged' | 'infused' | 'giftboxes' | 'merchandise' | 'subscriptions';
  shortDescription: string;
  variants: ProductVariant[];
  grindOptions: ('Volle bonen' | 'Gemalen (Filter)' | 'Capsule')[];
  defaultGrind: 'Volle bonen' | 'Gemalen (Filter)' | 'Capsule';
  inStock: boolean;
  batchStatus: 'op_voorraad' | 'in_batchplanning' | 'vers_gebrand' | 'binnenkort_beschikbaar';
  catalogSlug?: string; // Bi-directional link to catalog
  imagePlaceholderText: string;
  imageUrl?: string;
  galleryImages?: string[];
  origins?: CoffeeOrigin[];
  characterProfile?: CharacterProfile;
  scaScore?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  collection: string;
  variantWeight: string;
  grindOption: 'Volle bonen' | 'Gemalen (Filter)' | 'Capsule';
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  purchaseType?: 'eenmalig' | 'abonnement';
  subscriptionFrequency?: '2_weken' | '4_weken';
  selectedBeans?: string[];
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_authorized'
  | 'payment_successful'
  | 'payment_failed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'refunded'
  | 'partially_refunded'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerType: 'particulier' | 'professioneel';
  companyName?: string;
  vatNumber?: string;
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  molliePaymentId?: string;
  molliePaymentUrl?: string;
  trackingCode?: string;
  invoiceId?: string;
  createdAt: string;
}

export type InvoiceStatus = 'open' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  vatNumber?: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  vatAmount: number;
  status: InvoiceStatus;
  molliePaymentLink: string;
  mollieQrCodeUrl: string;
  pdfDownloadUrl: string;
}

export interface Subscription {
  id: string;
  customerId?: string;
  customerName?: string;
  customerEmail: string;
  productName: string;
  collection?: string;
  grindOption: string;
  weight: string;
  frequency: string;
  discountPercent?: number;
  shippingCost?: number;
  pricePerDelivery: number;
  totalRecurring?: number;
  status: 'actief' | 'gepauzeerd' | 'geannuleerd' | 'opgezegd';
  nextBillingDate?: string;
  nextDeliveryDate: string;
  autoRenew: boolean;
  type: 'standaard' | 'coffee_of_the_month' | 'cadeau';
  mollieCustomerId?: string;
  mollieSubscriptionId?: string;
  shippingAddress?: UserAddress | null;
  billingAddress?: UserAddress | null;
  cancelledAt?: string;
  updatedAt?: string;
}

export interface B2BQuoteRequest {
  id: string;
  companyName: string;
  vatNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  sector: string;
  machineNeed: string;
  monthlyVolumeKg?: number;
  notes?: string;
  status: 'nieuw' | 'in_behandeling' | 'offerte_verzonden' | 'geaccepteerd' | 'afgewezen';
  createdAt: string;
}

export interface EventInquiry {
  id: string;
  contactPerson: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestsCount: number;
  machineRental: string;
  baristaService: string;
  calculatedBeansKg: number;
  estimatedPrice: number;
  notes?: string;
  status: 'nieuw' | 'bevestigd' | 'afgerond';
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  type: 'atelier_bezoek' | 'cupping_sessie' | 'white_label_overleg';
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'aangevraagd' | 'bevestigd' | 'geannuleerd';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  orderNumber?: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_behandeling' | 'opgelost';
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerEmail: string;
  reason: string;
  status: 'aangevraagd' | 'goedgekeurd' | 'product_ontvangen' | 'terugbetaling_uitgevoerd';
  mollieRefundId?: string;
  createdAt: string;
}

export interface CoffeeReview {
  id: string;
  coffeeName: string;
  customerName: string;
  rating: number; // 1-5
  flavorNotes: string[];
  tasteReview: string;
  profileAccuracy: 'Exact conform beloofd profiel' | 'Rijker & voller dan verwacht' | 'Zachter & ronder van smaak' | 'Fruitiger / frisser van smaak';
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface EmailNotification {
  id: string;
  type: 'admin_registration' | 'customer_welcome' | 'admin_appointment' | 'customer_appointment' | 'admin_b2b' | 'admin_question' | 'customer_question';
  recipient: string;
  subject: string;
  preview: string;
  body: string;
  sentAt: string;
}

// ==================================================
// ROASTING, INVENTORY & AVAILABILITY MANAGEMENT TYPES
// ==================================================

// Unified 3-status availability system for Webshop & Admin:
// 1. 'available' (Beschikbaar) - Reeds gebrand, fysiek op voorraad, klaar voor verzending. Order: Enabled
// 2. 'freshly_roasted' (Net Gebrand) - Nieuwe batch gepland of in verwerking, leverbaar binnen ~2 weken. Order: Enabled (Pre-order)
// 3. 'out_of_stock' (Niet Beschikbaar) - Momenteel niet leverbaar, geen actieve batch beschikbaar. Order: Disabled
export type ProductAvailabilityStatus = 'available' | 'freshly_roasted' | 'out_of_stock';
export type ManualStatusOverride = ProductAvailabilityStatus | 'auto' | 'low_stock' | 'coming_soon' | 'not_configured';

export function normalizeAvailabilityStatus(status?: string | null): ProductAvailabilityStatus {
  if (!status) return 'available';
  if (status === 'available' || status === 'low_stock') return 'available';
  if (status === 'freshly_roasted' || status === 'net_gebrand' || status === 'coming_soon' || status === 'in_batchplanning') return 'freshly_roasted';
  if (status === 'out_of_stock' || status === 'unavailable' || status === 'not_configured') return 'out_of_stock';
  return 'available';
}

export interface RoasteryInventoryItem {
  productId: string;
  stockKg: number;
  rawStockKg: number;
  reservedKg: number;
  subscriptionAllocatedKg: number;
  availableKg: number;
  manualStatus?: ManualStatusOverride;
  effectiveStatus: ProductAvailabilityStatus;
  inStock: boolean;
  isConfigured: boolean; // true ONLY if entered manually by an administrator
  lastUpdated: string;
}

export interface GreenCoffeeItem {
  id: string;
  name: string;
  origin: string;
  availableKg: number;
  reservedKg: number;
  incomingKg: number;
  status: 'Ruim op voorraad' | 'Lage voorraad' | 'Nabesteld' | 'Onderweg' | 'Uitverkocht' | 'Niet geconfigureerd';
  isConfigured: boolean; // true ONLY if entered manually by an administrator
  lastUpdated: string;
}

export interface BlendComponent {
  greenCoffeeId: string;
  greenCoffeeName: string;
  percentage: number;
}

export interface BlendRecipe {
  id: string;
  blendName: string;
  associatedProductIds: string[];
  components: BlendComponent[];
  roastYieldPct: number;
  targetProfile: string;
}

export interface BlendCapacity {
  blendId: string;
  blendName: string;
  availableProductionKg: number | null; // null if unconfigured / insufficient data
  availableRoastedKg: number | null;
  hasSufficientData: boolean; // false if any component has unconfigured stock
  unconfiguredComponents?: string[];
  bottleneckGreenCoffeeId?: string;
  bottleneckGreenCoffeeName?: string;
  bottleneckAvailableKg?: number;
  limitingComponentPct?: number;
  status: 'Ruim produseerbaar' | 'Beperkte productie' | 'Niet produseerbaar (Grondstof tekort)' | 'Onvoldoende Data (Voorraad Niet Ingesteld)';
  componentBreakdown: Array<{
    greenCoffeeId: string;
    greenCoffeeName: string;
    percentage: number;
    availableKg: number;
    isConfigured: boolean;
    maxSupportedBlendKg: number | null;
  }>;
}

export interface RoastBatchRecord {
  id: string;
  batchNumber: string;
  blendId: string;
  blendName: string;
  targetProductId?: string;
  greenKgUsed: number;
  roastedKgProduced: number;
  roaster: string;
  roastDate: string;
  notes: string;
}

export interface RoasteryInventoryData {
  products: Record<string, RoasteryInventoryItem>;
  greenCoffee: Record<string, GreenCoffeeItem>;
  blendRecipes: Record<string, BlendRecipe>;
  blendCapacities: Record<string, BlendCapacity>;
  roastBatches: RoastBatchRecord[];
  summary: {
    totalRoastedStockKg: number;
    totalGreenCoffeeKg: number;
    totalReservedKg: number;
    availableProductCount: number;
    freshlyRoastedProductCount: number;
    outOfStockProductCount: number;
    lowStockProductCount?: number;
    comingSoonProductCount?: number;
  };
}

// ==================================================
// SOURCING & PROCUREMENT MANAGEMENT TYPES
// ==================================================

export type GreenCoffeeStatus = 'Ruim op voorraad' | 'Lage voorraad' | 'Nabesteld' | 'Onderweg' | 'Uitverkocht' | 'Niet geconfigureerd';
export type SourcingAvailability = 'Direct leverbaar' | 'In transit' | 'Pre-order oogst' | 'Beperkte toewijzing';
export type CoffeeProcess = 'Washed' | 'Natural' | 'Pulped Natural' | 'Honey' | 'Anaerobic Washed' | 'Anaerobic Natural' | 'Experimental' | 'Wet-Hulled (Giling Basah)';

export interface GreenCoffeeMasterBean {
  id: string;
  beanName: string;
  lot: string;
  origin: string; // e.g. Brazil, Colombia, Ethiopia
  region: string; // e.g. Serra da Canastra, Huila, Yirgacheffe
  process: CoffeeProcess;
  supplier: string; // Supplier name
  supplierId: string;
  warehouse: string; // e.g. Antwerp Port, Hamburg, Roastery Silo
  currentStockKg: number;
  reservedKg: number;
  incomingKg: number;
  availableKg: number;
  packSizeKg: number; // e.g. 60 or 30 kg
  availablePacks: number;
  scaScore: number; // e.g. 84.5, 87.0
  greenPricePerKg: number; // €/kg green
  roastedPricePerKg: number; // estimated or retail €/kg
  flavorNotes: string;
  status: GreenCoffeeStatus;
  availability: SourcingAvailability;
  minOrderQtyKg: number;
  reorderAlert: boolean;
  isConfigured?: boolean; // true ONLY if entered manually by an administrator
  notes?: string;
  lastUpdated: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  country?: string;
  warehouseLocation: string;
  status: 'active' | 'archived';
  rating: number; // 1-5
  leadTimeDays: number;
  website?: string;
  notes?: string;
}

export type PurchaseOrderStatus = 'open' | 'pending_delivery' | 'completed' | 'cancelled';

export interface PurchaseOrderRecord {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  beanId: string;
  beanName: string;
  purchaseDate: string;
  expectedDeliveryDate: string;
  quantityOrderedKg: number;
  quantityReceivedKg: number;
  packCount: number;
  pricePerKg: number;
  totalCost: number;
  deliveryStatus: PurchaseOrderStatus;
  notes?: string;
}

export type BlendTier = 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Specialty' | 'Barrel Aged' | 'Infusion' | 'Single Origin';
export type BlendApplication = 'Espresso' | 'Daily' | 'Filter' | 'Omni' | 'Infusion' | 'Barrel Aged' | 'Espresso Bar & Milk Drinks' | 'Espresso & Filter';

export interface ProcurementBlendComponent {
  greenCoffeeId: string;
  greenCoffeeName: string;
  ratioPct: number; // e.g. 50%
  greenPricePerKg: number;
  costContribution: number; // (ratioPct / 100) * greenPricePerKg / (roastYieldPct / 100)
}

export interface ProcurementBlendRecord {
  id: string;
  name: string;
  tier: BlendTier;
  application: BlendApplication | string;
  components: ProcurementBlendComponent[];
  roastYieldPct: number; // e.g. 85 for 15% moisture loss
  totalBlendCostPerKg: number; // sum of costContribution
  targetProfile: string;
  active: boolean;
  notes?: string;
  // Computed live:
  hasSufficientData?: boolean;
  availableProductionKg?: number | null;
  bottleneckBeanName?: string;
  limitingComponentPct?: number;
  unconfiguredComponents?: string[];
}

export interface SeasonalHarvestInfo {
  origin: string;
  country?: string;
  harvestMonths: any;
  shippingWindow?: string;
  arrivalEurope: string;
  arrivalEuropeMonths?: any;
  mainVarietals?: string;
  cupProfile?: string;
  notes?: string;
}

export interface SourcingDashboardMetrics {
  totalGreenInventoryKg: number;
  totalInventoryValueEur: number;
  lowStockCount: number;
  pendingPurchasesCount: number;
  pendingPurchasesValueEur: number;
  activeSuppliersCount: number;
  activeBlendsCount: number;
  mostUsedCoffees: Array<{ beanName: string; blendUsageCount: number; totalAssignedKg: number }>;
}

// ============================================================================
// CENTRALIZED COFFEE DOSSIER SYSTEM
// Single Source of Truth for all Maison Milau Coffee Products
// ============================================================================
export interface CoffeeDossier {
  id: string; // unique ID (e.g. 'budget-espresso', 'selection-daily')
  slug?: string;
  productName: string; // Product Name
  shortIntro: string; // Short Introduction
  coffeeStory: string; // Coffee Story
  origin: string; // Origin (Land van herkomst)
  region: string; // Region (Regio)
  farmProducer: string; // Farm / Producer (Boerderij / Producent)
  varietal: string; // Varietal (Botanische Variëteit)
  processingMethod: string; // Processing Method (Verwerkingsmethode)
  roastProfile: string; // Roast Profile (Brandprofiel)
  flavourNotes: string[]; // Flavour Notes (Smaaktonen)
  body: number; // Body (1 to 5)
  bodyDescription?: string;
  acidity: number; // Acidity (1 to 5)
  acidityDescription?: string;
  sweetness: number; // Sweetness (1 to 5)
  sweetnessDescription?: string;
  brewingMethods: string[]; // Recommended Brewing Methods
  foodPairings: string; // Food Pairings
  traceabilityInfo: string; // Traceability Information
  sustainabilityInfo: string; // Sustainability Information
  additionalNotes: string; // Additional Notes
  internalNotes: string; // Internal Notes (Admin Only)

  // Auxiliary fields for unified cross-system display
  collection?: string; // 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Barrel Aged' | 'Infused' | 'Single Origins' | string
  type?: string; // 'Espresso' | 'Daily' | 'Omni' | 'Filter' | 'Specialty'
  scaScore?: string;
  imageUrl?: string;
  webshopProductId?: string;
  discoveryTag?: string;
  secondaryTag?: string;
  idealFor?: string[];
  lessSuitableFor?: string[];
  recommendedBrewingMethod?: string;
  brewingParameters?: {
    grindSize?: string;
    ratio?: string;
    waterTemperature?: string;
    bloomTime?: string;
    extractionNotes?: string;
  };
  signatureCharacteristics?: string[];
  specialStory?: {
    title: string;
    badge: string;
    paragraphs: string[];
    calloutQuote?: string;
    sections?: { heading: string; body: string }[];
  };
  aliases?: string[]; // e.g. ['budget-omni', 'budget-daily']
  updatedAt?: string;
  updatedBy?: string;
}


