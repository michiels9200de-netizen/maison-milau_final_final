import React, { createContext, useContext, useState } from 'react';
import { User, Company, UserRole, UserAddress } from '../types';
import { CONFIG } from '../config';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  accountType: 'particulier' | 'professioneel';
  switchAccountType: (type: 'particulier' | 'professioneel') => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  authProvider: string;
}

const DEFAULT_B2C_USER: User = {
  id: 'usr-b2c-01',
  email: 'klant@voorbeeld.be',
  name: 'Laurent Michiels',
  phone: '+32 467 77 37 66',
  accountType: 'particulier',
  role: 'b2c_customer',
  addresses: [
    {
      id: 'addr-home',
      label: 'Thuis',
      street: 'Kerkstraat 12',
      city: 'Dendermonde',
      postalCode: '9200',
      country: 'België',
      isDefault: true,
    },
    {
      id: 'addr-work',
      label: 'Werk',
      street: 'Industrieweg 44',
      city: 'Aalst',
      postalCode: '9300',
      country: 'België',
    },
    {
      id: 'addr-vacation',
      label: 'Vakantieadres',
      street: 'Zeedijk 120',
      city: 'Knokke-Heist',
      postalCode: '8300',
      country: 'België',
    },
  ],
  loyaltyPoints: 340,
  createdAt: '2026-01-15T10:00:00.000Z',
};

const DEFAULT_B2B_COMPANY: Company = {
  id: 'comp-01',
  name: 'De Lange Tafel Horeca BV',
  vatNumber: 'BE 0823.491.204',
  billingAddress: {
    id: 'addr-hq',
    label: 'Hoofdkantoor',
    street: 'Grote Markt 4',
    city: 'Aalst',
    postalCode: '9300',
    country: 'België',
  },
  shippingAddresses: [
    {
      id: 'addr-magazijn',
      label: 'Magazijn',
      street: 'Logistiekweg 8',
      city: 'Dendermonde',
      postalCode: '9200',
      country: 'België',
    },
    {
      id: 'addr-bxl',
      label: 'Vestiging Brussel',
      street: 'Antoine Dansaertstraat 99',
      city: 'Brussel',
      postalCode: '1000',
      country: 'België',
    },
    {
      id: 'addr-antw',
      label: 'Vestiging Antwerpen',
      street: 'Kloosterstraat 32',
      city: 'Antwerpen',
      postalCode: '2000',
      country: 'België',
    },
  ],
  approvedBudget: 1500.0,
  usedBudget: 296.8,
  contractDiscountPct: 15,
  paymentTermsDays: 30,
  status: 'active',
};

const DEFAULT_B2B_USER: User = {
  id: 'usr-b2b-01',
  email: 'aankoop@delangetafel.be',
  name: 'Laurent Michiels (Aankoper)',
  phone: '+32 467 77 37 66',
  accountType: 'professioneel',
  role: 'b2b_admin',
  companyId: 'comp-01',
  vatNumber: 'BE 0823.491.204',
  addresses: DEFAULT_B2B_COMPANY.shippingAddresses,
  loyaltyPoints: 1250,
  createdAt: '2026-02-01T12:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accountType, setAccountType] = useState<'particulier' | 'professioneel'>('particulier');
  const [user, setUser] = useState<User | null>(DEFAULT_B2C_USER);
  const [company, setCompany] = useState<Company | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['prod-selection-daily', 'prod-barrel-moscatel']);

  const switchAccountType = (type: 'particulier' | 'professioneel') => {
    setAccountType(type);
    if (type === 'professioneel') {
      setUser(DEFAULT_B2B_USER);
      setCompany(DEFAULT_B2B_COMPANY);
    } else {
      setUser(DEFAULT_B2C_USER);
      setCompany(null);
    }
  };

  const login = (email: string, role: UserRole = 'b2c_customer') => {
    if (accountType === 'professioneel' || role.startsWith('b2b')) {
      setUser({ ...DEFAULT_B2B_USER, email, role });
      setCompany(DEFAULT_B2B_COMPANY);
    } else {
      setUser({ ...DEFAULT_B2C_USER, email, role });
      setCompany(null);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddress: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setUser({
      ...user,
      addresses: [...user.addresses, newAddress],
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated: !!user,
        activeRole: user?.role || 'b2c_customer',
        accountType,
        switchAccountType,
        login,
        logout,
        addAddress,
        wishlist,
        toggleWishlist,
        authProvider: CONFIG.auth.provider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
