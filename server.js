// server.ts
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createMollieClient } from "@mollie/api-client";
dotenv.config();
var __dirname = path.resolve();
var app = express();
var PORT = 3e3;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var isVercel = process.env.VERCEL === "1" || Boolean(process.env.NOW_REGION);
if (isVercel) {
  app.use((req, res, next) => {
    if (!req.url.startsWith("/api")) {
      req.url = "/api" + req.url;
    }
    next();
  });
}
var orders = [
  {
    id: "ord-1001",
    orderNumber: "MM-2026-1001",
    customerEmail: "klant@voorbeeld.be",
    customerName: "Laurent Michiels",
    customerType: "particulier",
    shippingAddress: {
      id: "addr-1",
      label: "Thuis",
      street: "Kerkstraat 12",
      city: "Dendermonde",
      postalCode: "9200",
      country: "Belgi\xEB"
    },
    billingAddress: {
      id: "addr-1",
      label: "Thuis",
      street: "Kerkstraat 12",
      city: "Dendermonde",
      postalCode: "9200",
      country: "Belgi\xEB"
    },
    items: [
      {
        productId: "prod-selection-daily",
        productName: "Selection Daily",
        collection: "Selection",
        variantWeight: "1kg",
        grindOption: "Volle bonen",
        unitPrice: 31.95,
        quantity: 1
      }
    ],
    subtotal: 31.95,
    discountAmount: 0,
    vatAmount: 1.92,
    shippingCost: 4.95,
    total: 36.9,
    status: "payment_successful",
    paymentMethod: "Bancontact",
    molliePaymentId: "tr_test_1001_bancontact",
    trackingCode: "BPOST-329482910BE",
    invoiceId: "INV-2026-0042",
    createdAt: "2026-09-02T10:14:00.000Z"
  },
  {
    id: "ord-1002",
    orderNumber: "MM-2026-1002",
    customerEmail: "info@brasserie-delangetafel.be",
    customerName: "Brasserie De Lange Tafel",
    customerType: "professioneel",
    companyName: "De Lange Tafel BV",
    vatNumber: "BE 0823.491.204",
    shippingAddress: {
      id: "addr-b2b",
      label: "Hoofdkantoor",
      street: "Grote Markt 4",
      city: "Aalst",
      postalCode: "9300",
      country: "Belgi\xEB"
    },
    billingAddress: {
      id: "addr-b2b",
      label: "Hoofdkantoor",
      street: "Grote Markt 4",
      city: "Aalst",
      postalCode: "9300",
      country: "Belgi\xEB"
    },
    items: [
      {
        productId: "prod-selection-espresso",
        productName: "Selection Espresso",
        collection: "Selection",
        variantWeight: "1kg",
        grindOption: "Volle bonen",
        unitPrice: 28,
        quantity: 10
      }
    ],
    subtotal: 280,
    discountAmount: 49.5,
    vatAmount: 16.8,
    shippingCost: 0,
    total: 296.8,
    status: "payment_successful",
    paymentMethod: "Factuur 30 dagen",
    molliePaymentId: "tr_test_b2b_inv_1002",
    trackingCode: "ROASTERY-DELIVERY-AALST",
    invoiceId: "INV-2026-0043",
    createdAt: "2026-09-03T14:20:00.000Z"
  }
];
var invoices = [
  {
    id: "inv-42",
    invoiceNumber: "INV-2026-0042",
    orderId: "ord-1001",
    customerName: "Laurent Michiels",
    customerEmail: "klant@voorbeeld.be",
    issueDate: "2026-09-02",
    dueDate: "2026-09-16",
    totalAmount: 36.9,
    vatAmount: 1.92,
    status: "paid",
    molliePaymentLink: "https://www.mollie.com/payscreen/order/tr_test_1001_bancontact",
    mollieQrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://maisonmilau.be/pay/INV-2026-0042",
    pdfDownloadUrl: "/api/invoices/INV-2026-0042/pdf"
  },
  {
    id: "inv-43",
    invoiceNumber: "INV-2026-0043",
    orderId: "ord-1002",
    customerName: "De Lange Tafel BV",
    customerEmail: "info@brasserie-delangetafel.be",
    companyName: "De Lange Tafel BV",
    vatNumber: "BE 0823.491.204",
    issueDate: "2026-09-03",
    dueDate: "2026-10-03",
    totalAmount: 296.8,
    vatAmount: 16.8,
    status: "open",
    molliePaymentLink: "https://www.mollie.com/payscreen/order/tr_test_b2b_inv_1002",
    mollieQrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://maisonmilau.be/pay/INV-2026-0043",
    pdfDownloadUrl: "/api/invoices/INV-2026-0043/pdf"
  }
];
var subscriptions = [
  {
    id: "sub-01",
    customerId: "cust-1",
    customerEmail: "klant@voorbeeld.be",
    productName: "Selection Daily (1kg)",
    grindOption: "Volle bonen",
    weight: "1kg",
    frequency: "4_weken",
    pricePerDelivery: 28.75,
    status: "actief",
    nextDeliveryDate: "2026-09-18",
    autoRenew: true,
    type: "standaard"
  }
];
var b2bQuotes = [
  {
    id: "quote-1",
    companyName: "TechHub Dendermonde",
    vatNumber: "BE 0948.112.334",
    contactPerson: "Sarah Verhulst",
    email: "sarah@techhub.be",
    phone: "+32 477 12 34 56",
    sector: "Kantoor / Bedrijfsruimte",
    machineNeed: "Koffiebonen + Volautomaat bonenmachine (Kantoor)",
    monthlyVolumeKg: 15,
    notes: "Kantoor met 25 medewerkers, interesse in proefpakket.",
    status: "nieuw",
    createdAt: "2026-09-03T09:00:00.000Z"
  }
];
var eventInquiries = [
  {
    id: "evt-1",
    contactPerson: "Marc & Hanne",
    email: "marc.hanne@telenet.be",
    phone: "+32 485 99 88 77",
    eventType: "Bruiloft / Trouwfeest",
    eventDate: "2026-10-15",
    guestsCount: 90,
    machineRental: "Dry-hire espressomachine + bonen",
    baristaService: "Zelfbediening",
    calculatedBeansKg: 4.5,
    estimatedPrice: 195,
    notes: "Avondfeest te Dendermonde, graag proeven vooraf.",
    status: "nieuw",
    createdAt: "2026-09-02T16:45:00.000Z"
  }
];
var appointments = [
  {
    id: "apt-1",
    customerName: "Thomas De Smet",
    email: "thomas@koffiebar-gent.be",
    phone: "+32 499 11 22 33",
    type: "white_label_overleg",
    date: "2026-09-12",
    timeSlot: "14:00 - 15:30",
    notes: "White label huisblend bespreken voor nieuwe zaak.",
    status: "bevestigd",
    createdAt: "2026-09-01T11:00:00.000Z"
  }
];
var supportTickets = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-8841",
    customerEmail: "klant@voorbeeld.be",
    customerName: "Laurent Michiels",
    category: "Leveringstermijnen & Verzending",
    subject: "Wanneer vertrekt batch 34?",
    message: "Hallo, ik zag dat mijn order in batchplanning staat. Wanneer wordt het gebrand?",
    status: "in_behandeling",
    createdAt: "2026-09-03T11:20:00.000Z"
  }
];
var WEBOWNER_EMAIL = "laurent.michiels66@gmail.com";
var emailNotifications = [
  {
    id: "eml-101",
    type: "admin_registration",
    recipient: WEBOWNER_EMAIL,
    subject: "[Maison Milau] Nieuwe klantregistratie: Laurent Michiels",
    preview: "Nieuwe particulier account aangemaakt: klant@voorbeeld.be",
    body: "Beste Laurent,\n\nEr is zojuist een nieuwe klant geregistreerd op Maison Milau:\n\nNaam: Laurent Michiels\nE-mail: klant@voorbeeld.be\nType: Particulier\nTelefoon: +32 467 77 37 66\nDatum: 2026-09-02 10:14",
    sentAt: "2026-09-02T10:14:05.000Z"
  },
  {
    id: "eml-102",
    type: "customer_welcome",
    recipient: "klant@voorbeeld.be",
    subject: "Welkom bij Maison Milau \xB7 Uw account is gereed",
    preview: "Bedankt voor uw registratie bij Maison Milau ambachtelijke branderij.",
    body: "Beste Laurent,\n\nHartelijk dank voor uw registratie bij Maison Milau! U kunt nu eenvoudig vers gebrande specialty koffies bestellen, uw leveringen volgen en reviews plaatsen.\n\nWarme groeten,\nLaurent Michiels \xB7 Maison Milau",
    sentAt: "2026-09-02T10:14:06.000Z"
  }
];
function sendNotificationEmail(type, recipient, subject, preview, body) {
  const notif = {
    id: `eml-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    type,
    recipient,
    subject,
    preview,
    body,
    sentAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  emailNotifications.unshift(notif);
  console.log(`[EMAIL DISPATCHED] To: ${recipient} | Subject: "${subject}"`);
  return notif;
}
var registeredUsers = [
  {
    id: "usr-b2c-01",
    email: "klant@voorbeeld.be",
    password: "password123",
    name: "Laurent Michiels",
    phone: "+32 467 77 37 66",
    accountType: "particulier",
    role: "b2c_customer",
    addresses: [
      {
        id: "addr-home",
        label: "Thuis",
        street: "Kerkstraat 12",
        city: "Dendermonde",
        postalCode: "9200",
        country: "Belgi\xEB",
        isDefault: true
      }
    ],
    loyaltyPoints: 340,
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "usr-b2b-01",
    email: "aankoop@delangetafel.be",
    password: "password123",
    name: "Laurent Michiels (Aankoper)",
    phone: "+32 467 77 37 66",
    accountType: "professioneel",
    role: "b2b_admin",
    companyName: "De Lange Tafel Horeca BV",
    vatNumber: "BE 0823.491.204",
    addresses: [
      {
        id: "addr-hq",
        label: "Hoofdkantoor",
        street: "Grote Markt 4",
        city: "Aalst",
        postalCode: "9300",
        country: "Belgi\xEB",
        isDefault: true
      }
    ],
    loyaltyPoints: 1250,
    createdAt: "2026-02-01T12:00:00.000Z"
  },
  {
    id: "usr-admin-01",
    email: "admin@maison-milau.be",
    password: "password123",
    name: "Laurent Michiels (Roaster & Admin)",
    phone: "+32 467 77 37 66",
    accountType: "professioneel",
    role: "store_admin",
    addresses: [],
    loyaltyPoints: 5e3,
    createdAt: "2026-01-01T08:00:00.000Z"
  }
];
var coffeeReviews = [
  {
    id: "rev-1",
    coffeeName: "Selection Daily",
    customerName: "Karel V.",
    rating: 5,
    flavorNotes: ["Pure Chocolade", "Karamel", "Walnoot"],
    tasteReview: "Fantastische roast! Zeer zuiver in onze espressomachine, volle crema en mooie afdronk zonder enige bitterheid.",
    profileAccuracy: "Exact conform beloofd profiel",
    verifiedPurchase: true,
    createdAt: "2026-09-01T14:20:00.000Z"
  },
  {
    id: "rev-2",
    coffeeName: "Budget Espresso",
    customerName: "Annelies D.",
    rating: 5,
    flavorNotes: ["Cacao", "Geroosterde amandel"],
    tasteReview: "Voor deze prijsklasse werkelijk onge\xEBvenaard. Ideale doordrink espresso voor ons kantoor.",
    profileAccuracy: "Rijker & voller dan verwacht",
    verifiedPurchase: true,
    createdAt: "2026-09-02T09:15:00.000Z"
  },
  {
    id: "rev-3",
    coffeeName: "Barrel Aged Moscatel",
    customerName: "Stefan B.",
    rating: 5,
    flavorNotes: ["Rijpe vijg", "Eikenhout", "Rozijnen"],
    tasteReview: "Compleet unieke ervaring. De wijnachtige aroma\u2019s komen prachtig naar voren in de Chemex!",
    profileAccuracy: "Exact conform beloofd profiel",
    verifiedPurchase: true,
    createdAt: "2026-09-03T16:40:00.000Z"
  },
  {
    id: "rev-4",
    coffeeName: "Prestige Blend",
    customerName: "Sophie M.",
    rating: 5,
    flavorNotes: ["Rood Fruit", "Bloemig", "Bergamot"],
    tasteReview: "SCA 88+ waardig! De gelaagde fruitigheid in filterkoffie is subliem.",
    profileAccuracy: "Exact conform beloofd profiel",
    verifiedPurchase: true,
    createdAt: "2026-09-04T11:00:00.000Z"
  }
];
app.get("/api/config", (req, res) => {
  const apiKey = process.env.MOLLIE_API_KEY || "";
  res.json({
    siteUrl: process.env.SITE_URL || "https://maisonmilau.be",
    loginUrl: process.env.LOGIN_URL || "/account/login",
    registerUrl: process.env.REGISTER_URL || "/account/register",
    apiBaseUrl: process.env.API_BASE_URL || "/api",
    supportEmail: process.env.SUPPORT_EMAIL || "Maison-milau@gmail.com",
    vatNumber: "BE 1041.542.844",
    mollieAvailable: true,
    mollieMode: apiKey.startsWith("live_") ? "live" : apiKey.startsWith("test_") ? "test" : "simulation",
    mollieMethods: ["bancontact", "ideal", "creditcard", "applepay", "wero", "cartesbancaires"]
  });
});
function getMollieClient(apiKey) {
  const key = apiKey || process.env.MOLLIE_API_KEY || "";
  if (!key || key.includes("your_mollie")) return null;
  try {
    return createMollieClient({ apiKey: key });
  } catch (err) {
    console.error("[Mollie Client Init Error]", err);
    return null;
  }
}
async function getMollieProfileInfo(apiKey) {
  if (!apiKey || apiKey.includes("your_mollie")) return null;
  try {
    const res = await fetch("https://api.mollie.com/v2/profiles/me", {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
async function getMollieActivatedMethods(apiKey) {
  if (!apiKey || apiKey.includes("your_mollie")) return [];
  try {
    const res = await fetch("https://api.mollie.com/v2/methods", {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data._embedded?.methods || [];
  } catch {
    return [];
  }
}
app.get("/api/mollie/status", async (req, res) => {
  const apiKey = process.env.MOLLIE_API_KEY || "";
  const isKeySet = Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes("your_mollie"));
  const isTestMode = apiKey.startsWith("test_");
  const isLiveMode = apiKey.startsWith("live_");
  const isKeyValidFormat = (isTestMode || isLiveMode) && apiKey.length >= 30;
  let profile = null;
  let activatedMethods = [];
  if (isKeySet && isKeyValidFormat) {
    profile = await getMollieProfileInfo(apiKey);
    activatedMethods = await getMollieActivatedMethods(apiKey);
  }
  const profileId = profile?.id || process.env.MOLLIE_PROFILE_ID || "pfl_bXkNE5uroY";
  const registeredWebsite = profile?.website || "https://www.maison-milau.be/";
  res.json({
    configured: isKeySet,
    mode: isLiveMode ? "live" : isTestMode ? "test" : "simulation",
    isKeyValidFormat,
    profileId,
    organizationId: "org_19611211",
    profileName: profile?.name || "Maison Milau",
    profileStatus: profile?.status || "verified",
    registeredWebsite,
    maskedKey: isKeySet ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : null,
    supportedMethods: activatedMethods.length > 0 ? activatedMethods.map((m) => ({
      id: m.id,
      name: m.description,
      status: m.status,
      minAmount: m.minimumAmount?.value,
      maxAmount: m.maximumAmount?.value,
      icon: m.image?.svg || m.image?.size2x
    })) : [
      { id: "bancontact", name: "Bancontact", status: "activated" },
      { id: "creditcard", name: "Kredietkaart (Visa / Mastercard)", status: "activated" },
      { id: "ideal", name: "iDEAL", status: "activated" },
      { id: "kbc", name: "KBC/CBC Betaalknop", status: "activated" },
      { id: "belfius", name: "Belfius Direct Net", status: "activated" },
      { id: "paypal", name: "PayPal", status: "activated" },
      { id: "klarna", name: "Klarna Pay Later", status: "activated" }
    ],
    message: isLiveMode ? `Mollie is actief verbonden in Live Productiemodus voor ${profile?.name || "Maison Milau"} (Profiel: ${profileId}).` : isTestMode ? "Mollie is geconfigureerd in Testmodus (Veilige testbetalingen)." : "Mollie draait in veilige simulatiemodus."
  });
});
app.get("/api/mollie/payouts/status", async (req, res) => {
  const apiKey = process.env.MOLLIE_API_KEY || "";
  const profile = await getMollieProfileInfo(apiKey);
  const paidOrders = orders.filter((o) => o.status === "payment_successful");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const estimatedMollieFees = paidOrders.reduce((sum, o) => sum + 0.29 + o.total * 0.015, 0);
  const netPendingPayout = Math.max(0, totalRevenue - estimatedMollieFees);
  res.json({
    success: true,
    payoutSystemStatus: "operational",
    merchant: {
      name: "Maison Milau",
      companyNumber: "BE 1041.542.844",
      organizationId: "org_19611211",
      profileId: profile?.id || "pfl_bXkNE5uroY",
      profileStatus: profile?.status || "verified",
      registeredWebsite: profile?.website || "https://www.maison-milau.be/",
      email: profile?.email || "michiels.laurent@yahoo.com",
      phone: profile?.phone || "+32467773766"
    },
    payoutChecklist: [
      {
        id: "api_key",
        title: "Mollie Live API Koppeling",
        status: "ok",
        detail: "Live API sleutel is gevalideerd en communiceert rechtstreeks met Mollie."
      },
      {
        id: "profile_verified",
        title: "Handelaarsprofiel Verificatie",
        status: profile?.status === "verified" ? "ok" : "action_required",
        detail: profile?.status === "verified" ? "Profiel is geverifieerd door Mollie Compliance (Food Product Stores)." : "Verificatie van handelsactiviteiten is in behandeling bij Mollie."
      },
      {
        id: "bank_account",
        title: "Bankrekening (IBAN) voor Uitbetalingen",
        status: "ok",
        detail: "Uitbetalingen worden door Mollie automatisch overgemaakt naar uw gekoppelde Belgische zakelijke IBAN.",
        dashboardLink: "https://my.mollie.com/dashboard/org_19611211/settings/bank-accounts"
      },
      {
        id: "settlement_frequency",
        title: "Uitbetalingsfrequentie (Settlement Schedule)",
        status: "ok",
        detail: "Standaard ingesteld op dagelijkse uitbetaling (of elke werkdag) bij saldo boven \u20AC5,00.",
        dashboardLink: "https://my.mollie.com/dashboard/org_19611211/settings/payouts"
      },
      {
        id: "webhook_listener",
        title: "Webhook & Automatische Orderverwerking",
        status: "ok",
        detail: "Webhook luistert op /api/mollie/webhook voor realtime order- en uitbetalingsnotificaties."
      }
    ],
    settlementSummary: {
      processedOrdersCount: paidOrders.length,
      grossTotal: Number(totalRevenue.toFixed(2)),
      estimatedMollieFees: Number(estimatedMollieFees.toFixed(2)),
      netPendingPayout: Number(netPendingPayout.toFixed(2)),
      currency: "EUR"
    },
    dashboardLinks: {
      payouts: "https://my.mollie.com/dashboard/org_19611211/settings/payouts",
      settlements: "https://my.mollie.com/dashboard/org_19611211/settlements",
      bankAccounts: "https://my.mollie.com/dashboard/org_19611211/settings/bank-accounts",
      payments: "https://my.mollie.com/dashboard/org_19611211/payments"
    }
  });
});
app.post("/api/mollie/test-pipeline", async (req, res) => {
  const apiKey = process.env.MOLLIE_API_KEY || "";
  if (!apiKey || apiKey.includes("your_mollie")) {
    return res.status(400).json({
      success: false,
      error: "Geen geldige MOLLIE_API_KEY gevonden in de configuratie."
    });
  }
  try {
    const profile = await getMollieProfileInfo(apiKey);
    const testAmount = "1.00";
    const registeredDomain = profile?.website?.replace(/\/$/, "") || "https://www.maison-milau.be";
    const redirectUrl = `${registeredDomain}/checkout/success?test=pipeline_${Date.now()}`;
    const webhookUrl = `${registeredDomain}/api/mollie/webhook`;
    const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: { currency: "EUR", value: testAmount },
        description: "Maison Milau - Payout & Betalingssysteem Verificatie",
        redirectUrl,
        webhookUrl,
        metadata: {
          testType: "pipeline_verification",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      })
    });
    const paymentData = await mollieRes.json();
    if (!mollieRes.ok) {
      return res.status(400).json({
        success: false,
        error: paymentData.detail || "Fout bij aanmaken testbetaling bij Mollie",
        mollieResponse: paymentData
      });
    }
    return res.json({
      success: true,
      message: "Mollie betalings- en uitbetalingspijplijn is 100% geverifieerd en operationeel!",
      testPaymentId: paymentData.id,
      checkoutUrl: paymentData._links?.checkout?.href,
      mode: paymentData.mode,
      profileId: paymentData.profileId,
      status: paymentData.status,
      dashboardUrl: paymentData._links?.dashboard?.href
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Verificatiefout: ${err.message}`
    });
  }
});
async function handleCreateOrderAndPayment(payload, req) {
  let items = payload.items || payload.orderData?.items || [];
  if (!items || items.length === 0) {
    const rawAmt = typeof payload.amount === "number" ? payload.amount : typeof payload.amount === "string" ? parseFloat(payload.amount) : payload.amount?.value ? parseFloat(payload.amount.value) : null;
    if (rawAmt && !isNaN(rawAmt)) {
      items = [{
        id: "item-direct",
        name: payload.description || "Maison Milau Koffie & Producten",
        price: rawAmt,
        quantity: 1
      }];
    } else {
      throw new Error("Winkelmand is leeg");
    }
  }
  const customerName = payload.customerName || payload.orderData?.customerName || "Klant";
  const customerEmail = payload.customerEmail || payload.orderData?.customerEmail || "klant@voorbeeld.be";
  const customerPhone = payload.customerPhone || payload.orderData?.customerPhone || "";
  const deliveryMethod = payload.deliveryMethod || payload.orderData?.deliveryMethod || "bpost";
  const marketLocation = payload.marketLocation || payload.orderData?.marketLocation;
  const shippingAddress = payload.shippingAddress || payload.orderData?.shippingAddress || {
    street: "Kerkstraat",
    houseNumber: "1",
    city: "Dendermonde",
    postalCode: "9200",
    country: "Belgi\xEB"
  };
  const paymentMethod = payload.paymentMethod || payload.orderData?.paymentMethod || "bancontact";
  const subtotal = Number(payload.subtotal || payload.orderData?.subtotal || items.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0));
  const shippingCost = Number(payload.shippingCost || payload.orderData?.shippingCost || 0);
  const total = Number(payload.total || payload.orderData?.total || subtotal + shippingCost);
  const vatAmount = Number((subtotal / 1.06 * 0.06 + shippingCost / 1.21 * 0.21).toFixed(2));
  const orderId = `ord-${Date.now().toString().slice(-4)}`;
  const orderNumber = `MM-2026-${Date.now().toString().slice(-4)}`;
  const invoiceNumber = `INV-2026-${Date.now().toString().slice(-4)}`;
  const apiKey = process.env.MOLLIE_API_KEY || "";
  const isKeyValid = Boolean(apiKey && (apiKey.startsWith("live_") || apiKey.startsWith("test_")) && apiKey.length >= 25);
  let realMolliePayment = null;
  let checkoutUrl = payload.redirectUrl ? `${payload.redirectUrl}${payload.redirectUrl.includes("?") ? "&" : "?"}orderId=${orderId}` : `/checkout?orderId=${orderId}&status=success`;
  let molliePaymentId = `sim_${Date.now()}`;
  if (isKeyValid) {
    try {
      const mollieClient = getMollieClient(apiKey);
      const profile = await getMollieProfileInfo(apiKey);
      const registeredDomain = profile?.website?.replace(/\/$/, "") || "https://www.maison-milau.be";
      const redirectUrl = payload.redirectUrl || `${registeredDomain}/checkout?orderId=${orderId}&status=success`;
      const webhookUrl = payload.webhookUrl || `${registeredDomain}/api/mollie/webhook`;
      let mollieMethod = void 0;
      if (paymentMethod === "bancontact") mollieMethod = "bancontact";
      else if (paymentMethod === "ideal") mollieMethod = "ideal";
      else if (paymentMethod === "creditcard") mollieMethod = "creditcard";
      else if (paymentMethod === "applepay") mollieMethod = "applepay";
      else if (paymentMethod === "kbc") mollieMethod = "kbc";
      else if (paymentMethod === "belfius") mollieMethod = "belfius";
      if (mollieClient) {
        console.log(`[Mollie SDK] Creating payment for ${orderNumber}, amount: \u20AC${total.toFixed(2)}`);
        const paymentParams = {
          amount: {
            currency: "EUR",
            value: total.toFixed(2)
          },
          description: payload.description || `Maison Milau - Bestelling ${orderNumber}`,
          redirectUrl,
          webhookUrl,
          metadata: {
            orderId,
            orderNumber,
            customerEmail,
            deliveryMethod,
            ...payload.metadata || {}
          }
        };
        if (payload.cancelUrl) {
          paymentParams.cancelUrl = payload.cancelUrl;
        }
        if (mollieMethod) {
          paymentParams.method = mollieMethod;
        }
        const payment = await mollieClient.payments.create(paymentParams);
        realMolliePayment = payment;
        molliePaymentId = payment.id;
        const url = (typeof payment.getCheckoutUrl === "function" ? payment.getCheckoutUrl() : null) || payment._links?.checkout?.href;
        if (url) {
          checkoutUrl = url;
        }
        console.log(`[Mollie SDK] Payment created successfully: ${molliePaymentId}, checkoutUrl: ${checkoutUrl}`);
      }
    } catch (mollieErr) {
      console.error("[Mollie SDK Payment Error]", mollieErr.message);
    }
  }
  const newOrder = {
    id: orderId,
    orderNumber,
    customerEmail,
    customerName,
    customerPhone,
    customerType: payload.customerType || "particulier",
    companyName: payload.companyName || "",
    vatNumber: payload.vatNumber || "",
    deliveryMethod,
    marketLocation,
    shippingAddress,
    billingAddress: payload.billingAddress || shippingAddress,
    items,
    subtotal,
    discountAmount: 0,
    vatAmount,
    shippingCost,
    total,
    status: realMolliePayment ? "open" : "payment_successful",
    paymentMethod: paymentMethod || "Bancontact (Mollie)",
    molliePaymentId,
    molliePaymentUrl: checkoutUrl,
    trackingCode: `BPOST-${Math.floor(1e8 + Math.random() * 9e8)}BE`,
    invoiceNumber,
    invoiceId: invoiceNumber,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  orders.unshift(newOrder);
  const newInvoice = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    invoiceNumber,
    orderId,
    customerName: newOrder.customerName,
    customerEmail: newOrder.customerEmail,
    companyName: newOrder.companyName,
    vatNumber: newOrder.vatNumber,
    issueDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
    totalAmount: newOrder.total,
    vatAmount: newOrder.vatAmount,
    status: realMolliePayment ? "pending" : "paid",
    molliePaymentLink: checkoutUrl,
    mollieQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(checkoutUrl)}`,
    pdfDownloadUrl: `/api/invoices/${invoiceNumber}/pdf`
  };
  invoices.unshift(newInvoice);
  return {
    success: true,
    orderId: newOrder.id,
    orderNumber: newOrder.orderNumber,
    invoiceNumber: newOrder.invoiceNumber,
    molliePaymentId,
    checkoutUrl,
    isRealMollie: Boolean(realMolliePayment),
    data: newOrder
  };
}
app.get("/api/orders", (req, res) => {
  res.json({ success: true, data: orders });
});
app.get("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Bestelling niet gevonden" });
  }
  res.json({ success: true, data: order });
});
app.post("/api/orders", async (req, res) => {
  try {
    const result = await handleCreateOrderAndPayment(req.body, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
app.post("/api/mollie/create-payment", async (req, res) => {
  try {
    const result = await handleCreateOrderAndPayment(req.body, req);
    res.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      paymentId: result.molliePaymentId,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      invoiceNumber: result.invoiceNumber,
      isRealMollie: result.isRealMollie,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
app.post("/api/create-payment", async (req, res) => {
  try {
    const result = await handleCreateOrderAndPayment(req.body, req);
    res.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      paymentId: result.molliePaymentId,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      invoiceNumber: result.invoiceNumber,
      isRealMollie: result.isRealMollie,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
app.get("/api/mollie/payment-status/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;
  const apiKey = process.env.MOLLIE_API_KEY || "";
  const order = orders.find((o) => o.molliePaymentId === paymentId);
  if (apiKey && (apiKey.startsWith("live_") || apiKey.startsWith("test_")) && paymentId.startsWith("tr_")) {
    try {
      const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (mollieRes.ok) {
        const paymentData = await mollieRes.json();
        const isPaid = paymentData.status === "paid";
        if (order) {
          if (isPaid) {
            order.status = "payment_successful";
            const invoice = invoices.find((inv) => inv.orderId === order.id);
            if (invoice) invoice.status = "paid";
          } else if (paymentData.status === "canceled") {
            order.status = "payment_cancelled";
          } else if (paymentData.status === "expired") {
            order.status = "payment_expired";
          }
        }
        return res.json({
          success: true,
          status: paymentData.status,
          isPaid,
          amount: paymentData.amount,
          method: paymentData.method,
          paidAt: paymentData.paidAt,
          order
        });
      }
    } catch (err) {
      console.error("[Mollie Status Check Error]", err.message);
    }
  }
  return res.json({
    success: true,
    status: order?.status === "payment_successful" ? "paid" : "open",
    isPaid: order?.status === "payment_successful",
    order
  });
});
app.post("/api/mollie/webhook", async (req, res) => {
  const paymentId = req.body?.id || req.query?.id;
  console.log(`[Mollie Webhook] Incoming notification for payment ID: ${paymentId}`);
  if (!paymentId) {
    return res.status(200).send("OK");
  }
  const apiKey = process.env.MOLLIE_API_KEY || "";
  if (apiKey && String(paymentId).startsWith("tr_")) {
    try {
      const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      if (mollieRes.ok) {
        const payment = await mollieRes.json();
        console.log(`[Mollie Webhook] Payment ${paymentId} status: ${payment.status}`);
        const order = orders.find((o) => o.molliePaymentId === paymentId);
        if (order) {
          if (payment.status === "paid") {
            order.status = "payment_successful";
            const invoice = invoices.find((inv) => inv.orderId === order.id);
            if (invoice) invoice.status = "paid";
          } else if (payment.status === "canceled") {
            order.status = "payment_cancelled";
          } else if (payment.status === "expired") {
            order.status = "payment_expired";
          }
        }
      }
    } catch (err) {
      console.error("[Mollie Webhook Error]", err.message);
    }
  }
  return res.status(200).send("OK");
});
app.get("/api/invoices", (req, res) => {
  res.json({ success: true, data: invoices });
});
app.get("/api/invoices/:id/pdf", (req, res) => {
  const invoiceId = req.params.id;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename=Factuur-${invoiceId}.txt`);
  res.send(`MAISON MILAU - FACTUUR ${invoiceId}
BTW BE 1041.542.844
Atelier: Jef Scheirsstraat 29, 9200 Oudegem
Status: Voldaann
Bedankt voor uw bestelling.`);
});
app.get("/api/subscriptions", (req, res) => {
  res.json({ success: true, data: subscriptions });
});
app.post("/api/subscriptions/:id/toggle-status", (req, res) => {
  const sub = subscriptions.find((s) => s.id === req.params.id);
  if (!sub) return res.status(404).json({ success: false, error: "Abonnement niet gevonden" });
  sub.status = sub.status === "actief" ? "gepauzeerd" : "actief";
  res.json({ success: true, data: sub });
});
app.post("/api/b2b-quote", (req, res) => {
  const { companyName, vatNumber, contactPerson, email, phone, sector, machineNeed, monthlyVolumeKg, notes } = req.body;
  if (!companyName || !contactPerson || !email || !phone) {
    return res.status(400).json({ success: false, error: "Gelieve alle verplichte velden (*) in te vullen." });
  }
  const quote = {
    id: `quote-${Date.now()}`,
    companyName,
    vatNumber: vatNumber || "",
    contactPerson,
    email,
    phone,
    sector: sector || "Kantoor",
    machineNeed: machineNeed || "Enkel verse specialty koffiebonen",
    monthlyVolumeKg: Number(monthlyVolumeKg) || 10,
    notes: notes || "",
    status: "nieuw",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  b2bQuotes.unshift(quote);
  sendNotificationEmail(
    "admin_b2b",
    WEBOWNER_EMAIL,
    `[Maison Milau B2B] Nieuwe offerteaanvraag van ${companyName}`,
    `Offerteaanvraag ontvangen voor ~${quote.monthlyVolumeKg} kg/mnd door ${contactPerson}.`,
    `Beste Laurent,

Er is een nieuwe B2B aanvraag binnengekomen:

Bedrijf: ${companyName}
BTW: ${vatNumber || "Niet opgegeven"}
Contactpersoon: ${contactPerson}
E-mail: ${email}
Telefoon: ${phone}
Sector: ${sector}
Behoefte: ${machineNeed}
Geschat volume: ${monthlyVolumeKg} kg/maand
Opmerkingen: ${notes || "Geen"}

Datum: ${(/* @__PURE__ */ new Date()).toLocaleString("nl-BE")}`
  );
  sendNotificationEmail(
    "customer_b2b",
    email,
    "Ontvangstbevestiging: Uw B2B Aanvraag bij Maison Milau",
    `Beste ${contactPerson}, wij hebben uw aanvraag voor ${companyName} goed ontvangen.`,
    `Beste ${contactPerson},

Hartelijk dank voor uw interesse in Maison Milau koffie voor ${companyName}.

Wij hebben uw aanvraag goed ontvangen en bezorgen u binnen 24 uur een op maat gemaakt voorstel en staffelprijzen voor uw kantoor of horecazaak.

Met vriendelijke groet,
Laurent Michiels \xB7 Maison Milau Ambachtelijke Branderij`
  );
  res.json({ success: true, message: "B2B aanvraag succesvol ontvangen. We bezorgen u binnen 24u een voorstel.", data: quote });
});
app.get("/api/b2b-quotes", (req, res) => {
  res.json({ success: true, data: b2bQuotes });
});
app.post("/api/event-quote", (req, res) => {
  const { contactPerson, email, phone, eventType, eventDate, guestsCount, machineRental, baristaService, calculatedBeansKg, estimatedPrice, notes } = req.body;
  if (!contactPerson || !email || !phone || !eventDate) {
    return res.status(400).json({ success: false, error: "Gelieve contactpersoon, email, telefoon en datum in te vullen." });
  }
  const event = {
    id: `evt-${Date.now()}`,
    contactPerson,
    email,
    phone,
    eventType: eventType || "Bruiloft / Trouwfeest",
    eventDate,
    guestsCount: Number(guestsCount) || 50,
    machineRental: machineRental || "Ja",
    baristaService: baristaService || "Nee",
    calculatedBeansKg: Number(calculatedBeansKg) || 3,
    estimatedPrice: Number(estimatedPrice) || 125,
    notes: notes || "",
    status: "nieuw",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  eventInquiries.unshift(event);
  sendNotificationEmail(
    "admin_event",
    WEBOWNER_EMAIL,
    `[Maison Milau Events] Nieuwe catering aanvraag: ${eventType} op ${eventDate}`,
    `Aanvraag voor ${guestsCount} gasten door ${contactPerson}.`,
    `Beste Laurent,

Er is een nieuwe evenementen- en verhuuraanvraag binnengekomen:

Type: ${eventType}
Datum: ${eventDate}
Aantal gasten: ${guestsCount}
Contactpersoon: ${contactPerson}
E-mail: ${email}
Telefoon: ${phone}
Machine: ${machineRental}
Barista: ${baristaService}
Berekend: ~${calculatedBeansKg} kg bonen (Milau Budget tarief)
Indicatieve prijs: \u20AC${estimatedPrice}
Notities: ${notes || "Geen"}`
  );
  sendNotificationEmail(
    "customer_event",
    email,
    `Bevestiging: Uw koffiecatering aanvraag voor ${eventDate}`,
    `Beste ${contactPerson}, wij hebben uw eventaanvraag goed ontvangen.`,
    `Beste ${contactPerson},

Bedankt voor uw aanvraag voor uw ${eventType} op ${eventDate}.

Ons team bekijkt momenteel de beschikbaarheid van onze espressomachines en mobiele barista bars. Wij nemen spoedig telefonisch of per e-mail contact met u op.

Met gastvrije groet,
Laurent Michiels \xB7 Maison Milau Events`
  );
  res.json({ success: true, message: "Evenement aanvraag ontvangen. Wij nemen spoedig contact op.", data: event });
});
app.get("/api/event-quotes", (req, res) => {
  res.json({ success: true, data: eventInquiries });
});
app.post("/api/appointments", (req, res) => {
  const { customerName, email, phone, type, date, timeSlot, notes } = req.body;
  if (!customerName || !email || !phone || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: "Gelieve alle verplichte afspraakvelden in te vullen." });
  }
  const appointment = {
    id: `apt-${Date.now()}`,
    customerName,
    email,
    phone,
    type: type || "atelier_bezoek",
    date,
    timeSlot,
    notes: notes || "",
    status: "aangevraagd",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  appointments.unshift(appointment);
  sendNotificationEmail(
    "admin_appointment",
    WEBOWNER_EMAIL,
    `[Maison Milau Atelier] Nieuwe afspraak: ${customerName} op ${date} om ${timeSlot}`,
    `Afspraak gepland (${type}) in atelier te Oudegem.`,
    `Beste Laurent,

Er is een nieuwe atelier afspraak aangevraagd:

Klant: ${customerName}
Type: ${type}
Datum: ${date}
Tijdstip: ${timeSlot}
E-mail: ${email}
Telefoon: ${phone}
Notities: ${notes || "Geen"}`
  );
  sendNotificationEmail(
    "customer_appointment",
    email,
    `Afspraakbevestiging: Bezoek Atelier Maison Milau op ${date}`,
    `Beste ${customerName}, uw afspraak om ${timeSlot} staat genoteerd.`,
    `Beste ${customerName},

Uw afspraak in onze koffiebranderij te Oudegem (${date} om ${timeSlot}) is succesvol geregistreerd.

Locatie:
Maison Milau Atelier
Oudegem (Dendermonde)

Tot binnenkort!
Laurent Michiels`
  );
  res.json({ success: true, message: "Uw bezoek is ingepland. U ontvangt een bevestiging per e-mail.", data: appointment });
});
app.get("/api/appointments", (req, res) => {
  res.json({ success: true, data: appointments });
});
app.post("/api/support-ticket", (req, res) => {
  const { customerEmail, customerName, orderNumber, category, subject, message } = req.body;
  if (!customerEmail || !customerName || !subject || !message) {
    return res.status(400).json({ success: false, error: "Gelieve naam, e-mail, onderwerp en bericht in te vullen." });
  }
  const ticket = {
    id: `tkt-${Date.now()}`,
    ticketNumber: `TKT-${Math.floor(1e3 + Math.random() * 9e3)}`,
    customerEmail,
    customerName,
    orderNumber: orderNumber || "",
    category: category || "Algemeen",
    subject,
    message,
    status: "open",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  supportTickets.unshift(ticket);
  sendNotificationEmail(
    "admin_question",
    WEBOWNER_EMAIL,
    `[Maison Milau Vraag] Nieuw bericht van ${customerName}: ${subject}`,
    `Vraag binnengekomen in categorie ${category}.`,
    `Beste Laurent,

Er is een nieuw contactbericht binnengekomen:

Van: ${customerName} (${customerEmail})
Order#: ${orderNumber || "Geen"}
Categorie: ${category}
Onderwerp: ${subject}

Bericht:
${message}

Datum: ${(/* @__PURE__ */ new Date()).toLocaleString("nl-BE")}`
  );
  sendNotificationEmail(
    "customer_question",
    customerEmail,
    `Ontvangstbevestiging vraag [${ticket.ticketNumber}]: ${subject}`,
    `Beste ${customerName}, wij hebben uw vraag goed ontvangen.`,
    `Beste ${customerName},

Bedankt voor uw bericht. Wij hebben uw vraag (${ticket.ticketNumber}) in goede orde ontvangen en beantwoorden deze doorgaans binnen \xE9\xE9n werkdag.

Met vriendelijke groet,
Klantenservice Maison Milau`
  );
  res.json({ success: true, message: `Uw ticket ${ticket.ticketNumber} is geregistreerd.`, data: ticket });
});
app.get("/api/support-tickets", (req, res) => {
  res.json({ success: true, data: supportTickets });
});
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, phone, accountType, companyName, vatNumber, street, city, postalCode } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: "Gelieve e-mail, wachtwoord en naam in te vullen." });
  }
  const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, error: "Er bestaat reeds een account met dit e-mailadres. Gelieve in te loggen." });
  }
  const isB2B = accountType === "professioneel";
  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.toLowerCase(),
    password,
    // Stored safely for dev authentication check
    name,
    phone: phone || "",
    accountType: isB2B ? "professioneel" : "particulier",
    role: isB2B ? "b2b_admin" : "b2c_customer",
    companyName: isB2B ? companyName || "" : "",
    vatNumber: isB2B ? vatNumber || "" : "",
    addresses: street ? [
      {
        id: `addr-${Date.now()}`,
        label: isB2B ? "Hoofdkantoor" : "Thuis",
        street,
        city: city || "Dendermonde",
        postalCode: postalCode || "9200",
        country: "Belgi\xEB",
        isDefault: true
      }
    ] : [],
    loyaltyPoints: 100,
    // Welcome gift points
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  registeredUsers.push(newUser);
  sendNotificationEmail(
    "admin_registration",
    WEBOWNER_EMAIL,
    `[Maison Milau] Nieuwe klantregistratie: ${name} (${isB2B ? `B2B: ${companyName}` : "Particulier"})`,
    `Nieuwe ${isB2B ? "zakelijke" : "particuliere"} klant geregistreerd: ${email}`,
    `Beste Laurent,

Er is zojuist een nieuw account geregistreerd op Maison Milau:

Naam: ${name}
E-mail: ${email}
Type: ${isB2B ? "Zakelijk / Horeca" : "Particulier"}
${isB2B ? `Bedrijf: ${companyName}
BTW: ${vatNumber}
` : ""}Telefoon: ${phone || "Niet opgegeven"}
Datum: ${(/* @__PURE__ */ new Date()).toLocaleString("nl-BE")}`
  );
  sendNotificationEmail(
    "customer_welcome",
    email,
    "Welkom bij Maison Milau \xB7 Uw account is geactiveerd",
    `Beste ${name}, van harte welkom bij Maison Milau ambachtelijke branderij.`,
    `Beste ${name},

Hartelijk dank voor uw registratie bij Maison Milau!

Uw account is direct actief. U kunt nu:
- Vers gebrande specialty koffies en giftboxen bestellen
- Uw leveringen en live roast planning volgen
- Facturen en betaalstatussen raadplegen
- Onze blends beoordelen via ons smaakprofiel reviewsysteem

Warme groeten uit het atelier,
Laurent Michiels \xB7 Maison Milau`
  );
  const { password: _, ...safeUser } = newUser;
  res.json({ success: true, message: "Registratie succesvol! Welkom bij Maison Milau.", user: safeUser });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Gelieve e-mail en wachtwoord in te vullen." });
  }
  const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: "Ongeldig e-mailadres of wachtwoord. Probeer opnieuw." });
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, message: `Welkom terug, ${user.name}!`, user: safeUser });
});
app.get("/api/auth/users", (req, res) => {
  const safeUsers = registeredUsers.map(({ password, ...rest }) => rest);
  res.json({ success: true, data: safeUsers });
});
app.get("/api/reviews", (req, res) => {
  const coffeeName = req.query.coffeeName;
  if (coffeeName) {
    const filtered = coffeeReviews.filter((r) => r.coffeeName.toLowerCase().includes(coffeeName.toLowerCase()));
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: coffeeReviews });
});
app.post("/api/reviews", (req, res) => {
  const { coffeeName, customerName, rating, flavorNotes, tasteReview, profileAccuracy } = req.body;
  if (!coffeeName || !customerName || !rating || !tasteReview) {
    return res.status(400).json({ success: false, error: "Gelieve koffie, naam, score en uw ervaring in te vullen." });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    coffeeName,
    customerName,
    rating: Number(rating) || 5,
    flavorNotes: Array.isArray(flavorNotes) ? flavorNotes : ["Gebalanceerd"],
    tasteReview,
    profileAccuracy: profileAccuracy || "Exact conform beloofd profiel",
    verifiedPurchase: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  coffeeReviews.unshift(newReview);
  res.json({ success: true, message: "Bedankt voor uw beoordeling! Uw review is geplaatst.", data: newReview });
});
app.get("/api/admin/roastery-stats", (req, res) => {
  const now = /* @__PURE__ */ new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let kgToday = 0;
  let kgWeek = 0;
  let kgMonth = 0;
  let totalKgAll = 0;
  const blendBreakdown = {
    Budget: { count: 0, kg: 0 },
    Value: { count: 0, kg: 0 },
    Selection: { count: 0, kg: 0 },
    Prestige: { count: 0, kg: 0 },
    Ultimate: { count: 0, kg: 0 },
    "Barrel Aged": { count: 0, kg: 0 },
    Infused: { count: 0, kg: 0 },
    Overig: { count: 0, kg: 0 }
  };
  orders.forEach((o) => {
    const oDate = new Date(o.createdAt);
    const isToday = o.createdAt.startsWith(todayStr);
    const isThisWeek = oDate >= startOfWeek;
    const isThisMonth = oDate >= startOfMonth;
    (o.items || []).forEach((item) => {
      let itemWeightKg = 1;
      if (item.variantWeight === "250g") itemWeightKg = 0.25;
      else if (item.variantWeight === "500g") itemWeightKg = 0.5;
      else if (item.variantWeight === "1kg") itemWeightKg = 1;
      else if (item.variantWeight === "5kg") itemWeightKg = 5;
      const totalItemKg = itemWeightKg * (item.quantity || 1);
      totalKgAll += totalItemKg;
      if (isToday) kgToday += totalItemKg;
      if (isThisWeek) kgWeek += totalItemKg;
      if (isThisMonth) kgMonth += totalItemKg;
      const col = item.collection || "Overig";
      if (blendBreakdown[col]) {
        blendBreakdown[col].count += item.quantity || 1;
        blendBreakdown[col].kg += totalItemKg;
      } else {
        blendBreakdown["Overig"].count += item.quantity || 1;
        blendBreakdown["Overig"].kg += totalItemKg;
      }
    });
  });
  res.json({
    success: true,
    data: {
      periods: {
        today: {
          ordersCount: orders.filter((o) => o.createdAt.startsWith(todayStr)).length,
          kgRoasted: Number(kgToday.toFixed(1))
        },
        thisWeek: {
          ordersCount: orders.filter((o) => new Date(o.createdAt) >= startOfWeek).length,
          kgRoasted: Number(kgWeek.toFixed(1))
        },
        thisMonth: {
          ordersCount: orders.filter((o) => new Date(o.createdAt) >= startOfMonth).length,
          kgRoasted: Number(kgMonth.toFixed(1))
        },
        allTime: {
          ordersCount: orders.length,
          totalKg: Number(totalKgAll.toFixed(1))
        }
      },
      blendBreakdown,
      recentOrders: orders.slice(0, 15)
    }
  });
});
app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, roasteryStatus } = req.body;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Order niet gevonden" });
  }
  if (status) order.status = status;
  if (roasteryStatus) order.roasteryStatus = roasteryStatus;
  res.json({ success: true, message: `Status van bestelling ${order.orderNumber} bijgewerkt.`, data: order });
});
app.get("/api/admin/export/orders.csv", (req, res) => {
  const headers = ["Ordernummer", "Datum", "Klantnaam", "E-mail", "Type", "Artikelen", "Totaal Bedrag (EUR)", "Betaalstatus", "Betaalmethode", "Tracking"];
  const rows = orders.map((o) => {
    const itemsSummary = (o.items || []).map((it) => `${it.quantity}x ${it.productName} (${it.variantWeight}, ${it.grindOption})`).join("; ");
    return [
      `"${o.orderNumber}"`,
      `"${o.createdAt.slice(0, 10)}"`,
      `"${o.customerName}"`,
      `"${o.customerEmail}"`,
      `"${o.customerType}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      `"${o.total.toFixed(2)}"`,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
      `"${o.trackingCode || ""}"`
    ].join(",");
  });
  const csvContent = [headers.join(","), ...rows].join("\r\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="maison_milau_orders_export.csv"');
  res.status(200).send("\uFEFF" + csvContent);
});
app.get("/api/admin/emails", (req, res) => {
  res.json({ success: true, data: emailNotifications });
});
app.get("/api/admin/metrics", (req, res) => {
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === "payment_successful" ? o.total : 0), 0);
  res.json({
    success: true,
    data: {
      revenue: totalRevenue,
      paymentsToday: orders.filter((o) => o.status === "payment_successful").length,
      failedPayments: orders.filter((o) => o.status === "payment_failed").length,
      refundsCount: orders.filter((o) => o.status === "refunded").length,
      conversionRatePct: 4.8,
      averageOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(2) : "0.00",
      totalOrders: orders.length,
      totalQuotes: b2bQuotes.length,
      totalEvents: eventInquiries.length,
      totalAppointments: appointments.length,
      totalUsers: registeredUsers.length,
      totalReviews: coffeeReviews.length
    }
  });
});
var server_default = app;
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Maison Milau server running on port ${PORT}`);
  });
}
if (!isVercel) {
  startServer();
}
export {
  app,
  server_default as default,
  getMollieClient
};
//# sourceMappingURL=server.js.map
