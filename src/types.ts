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
  role: UserRole;
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

export type ProductAvailabilityStatus = 'available' | 'low_stock' | 'coming_soon' | 'out_of_stock';
export type ManualStatusOverride = ProductAvailabilityStatus | 'auto';

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
  lastUpdated: string;
}

export interface GreenCoffeeItem {
  id: string;
  name: string;
  origin: string;
  availableKg: number;
  reservedKg: number;
  incomingKg: number;
  status: 'Ruim op voorraad' | 'Lage voorraad' | 'Nabesteld' | 'Onderweg' | 'Uitverkocht';
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
  availableProductionKg: number;
  availableRoastedKg: number;
  bottleneckGreenCoffeeId: string;
  bottleneckGreenCoffeeName: string;
  bottleneckAvailableKg: number;
  limitingComponentPct: number;
  status: 'Ruim produseerbaar' | 'Beperkte productie' | 'Niet produseerbaar (Grondstof tekort)';
  componentBreakdown: Array<{
    greenCoffeeId: string;
    greenCoffeeName: string;
    percentage: number;
    availableKg: number;
    maxSupportedBlendKg: number;
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
    lowStockProductCount: number;
    outOfStockProductCount: number;
    comingSoonProductCount: number;
    availableProductCount: number;
  };
}
