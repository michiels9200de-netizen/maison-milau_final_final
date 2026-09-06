// Production Configuration for Maison Milau
// All URLs, endpoints, credentials and integrations are configured here.
// Never hardcode values.

export interface AppConfig {
  siteUrl: string;
  loginUrl: string;
  registerUrl: string;
  apiBaseUrl: string;
  supportEmail: string;
  whatsappNumber: string;
  whatsappUrl: string;
  vatNumber: string;
  atelierAddress: {
    street: string;
    city: string;
    country: string;
    googleMapsUrl: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  mollie: {
    apiKey: string;
    profileId: string;
    apiUrl: string;
    methods: string[];
  };
  auth: {
    provider: string; // 'database' | 'google' | 'firebase' | 'clerk' | 'auth0' | 'entra' | 'supabase'
    googleClientId: string;
  };
}

export const CONFIG: AppConfig = {
  siteUrl: (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'https://maisonmilau.be',
  loginUrl: '/account/login',
  registerUrl: '/account/register',
  apiBaseUrl: '/api',
  supportEmail: 'maisonmilau@gmail.com',
  whatsappNumber: '+32467773766',
  whatsappUrl: 'https://wa.me/32467773766',
  vatNumber: 'BE 1041.542.844',
  atelierAddress: {
    street: 'Jef Scheirsstraat 29',
    city: '9200 Oudegem (Dendermonde)',
    country: 'België',
    googleMapsUrl: 'https://maps.google.com/?q=Jef+Scheirsstraat+29+9200+Oudegem+Belgium',
  },
  social: {
    instagram: 'https://www.instagram.com/maison_milau?igsi=MTR4ZnZmeXB4OWQ2aQ%3D%3D&utm_source=qr',
    facebook: 'https://www.facebook.com/people/Maison-Milau/61594088783935/?mibextid=wwXIfr&rdid=2NNl8EbSQSj7FY2P&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19aNRNmCbA%2F%3Fmibextid%3DwwXIfr',
  },
  mollie: {
    apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWKaSlpRR',
    profileId: 'pfl_maisonmilau_production',
    apiUrl: 'https://api.mollie.com/v2',
    methods: [
      'bancontact',
      'ideal',
      'creditcard', // Visa / Mastercard
      'applepay',
      'wero',
      'cartesbancaires',
    ],
  },
  auth: {
    provider: 'database',
    googleClientId: '',
  },
};
