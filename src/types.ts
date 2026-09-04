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
  name: string;
  phone?: string;
  accountType: 'particulier' | 'professioneel';
  role: UserRole;
  companyId?: string;
  vatNumber?: string;
  addresses: UserAddress[];
  loyaltyPoints: number;
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
  id: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origins' | 'Barrel Aged' | 'Infused';
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
  collection: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origins' | 'Barrel Aged' | 'Infused';
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
}

export interface ProductVariant {
  weight: '250g' | '500g' | '1kg' | 'Box' | 'Stuk';
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  collection: 'Budget' | 'Value' | 'Selection' | 'Premium' | 'Prestige' | 'Single Origins' | 'Barrel Aged' | 'Infused' | 'Giftboxes' | 'Toebehoren' | 'Abonnementen';
  category: 'blends' | 'barrel_aged' | 'infused' | 'giftboxes' | 'merchandise' | 'subscriptions';
  shortDescription: string;
  variants: ProductVariant[];
  grindOptions: ('Volle bonen' | 'Gemalen (Filter)')[];
  defaultGrind: 'Volle bonen' | 'Gemalen (Filter)';
  inStock: boolean;
  batchStatus: 'op_voorraad' | 'in_batchplanning' | 'vers_gebrand';
  catalogSlug?: string; // Bi-directional link to catalog
  imagePlaceholderText: string;
  origins?: CoffeeOrigin[];
  characterProfile?: CharacterProfile;
}

export interface CartItem {
  productId: string;
  productName: string;
  collection: string;
  variantWeight: string;
  grindOption: 'Volle bonen' | 'Gemalen (Filter)';
  unitPrice: number;
  quantity: number;
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
  customerId: string;
  customerEmail: string;
  productName: string;
  grindOption: 'Volle bonen' | 'Gemalen (Filter)';
  weight: string;
  frequency: '2_weken' | '4_weken' | '6_weken';
  pricePerDelivery: number;
  status: 'actief' | 'gepauzeerd' | 'opgezegd';
  nextDeliveryDate: string;
  autoRenew: boolean;
  type: 'standaard' | 'coffee_of_the_month' | 'cadeau';
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
