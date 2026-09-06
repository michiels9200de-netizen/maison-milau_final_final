import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company, UserRole, UserAddress } from '../types';
import { CONFIG } from '../config';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  token: string | null;
  activeRole: UserRole;
  accountType: 'particulier' | 'professioneel';
  switchAccountType: (type: 'particulier' | 'professioneel') => void;
  setAccountType: (type: any) => void;
  switchUser: (id: string) => void;
  login: (email: string, role?: UserRole) => void;
  loginWithPassword: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  registerUser: (data: any) => Promise<{ success: boolean; error?: string; user?: User }>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (token: string, newPassword: string, confirmPassword?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyEmail: (token: string, email?: string) => Promise<{ success: boolean; error?: string; message?: string; email?: string }>;
  validateResetToken: (token: string) => Promise<{ success: boolean; error?: string; email?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
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
  const [token, setToken] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('mm_auth_token');
      // Invalidate and remove any legacy demo session tokens immediately
      if (saved && (saved === 'tok_demo_laurent_session' || saved.startsWith('demo_'))) {
        localStorage.removeItem('mm_auth_token');
        return null;
      }
      return saved || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['prod-selection-daily', 'prod-barrel-moscatel']);

  // Validate active session token against server on boot
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setAccountType(data.user.accountType || 'particulier');
          if (data.user.accountType === 'professioneel') {
            setCompany({
              ...DEFAULT_B2B_COMPANY,
              name: data.user.companyName || DEFAULT_B2B_COMPANY.name,
              vatNumber: data.user.vatNumber || DEFAULT_B2B_COMPANY.vatNumber,
            });
          }
        } else {
          throw new Error('User not found');
        }
      })
      .catch(() => {
        // Token was revoked, expired, or admin session was invalidated
        try {
          localStorage.removeItem('mm_auth_token');
        } catch (e) {}
        setToken(null);
        setUser(null);
        setCompany(null);
      });
  }, [token]);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (user?.email) {
      headers['x-user-email'] = user.email;
    }
    return headers;
  };

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

  const loginWithPassword = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Inloggen mislukt.' };
      }

      const loggedInUser: User = data.user;
      setUser(loggedInUser);
      setAccountType(loggedInUser.accountType);

      if (data.token) {
        setToken(data.token);
        try {
          localStorage.setItem('mm_auth_token', data.token);
        } catch (e) {}
      }

      if (loggedInUser.accountType === 'professioneel') {
        setCompany({
          ...DEFAULT_B2B_COMPANY,
          name: loggedInUser.companyName || DEFAULT_B2B_COMPANY.name,
          vatNumber: loggedInUser.vatNumber || DEFAULT_B2B_COMPANY.vatNumber,
        });
      } else {
        setCompany(null);
      }

      return { success: true, user: loggedInUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens inloggen.' };
    }
  };

  const registerUser = async (registrationData: any): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registratie mislukt.' };
      }

      const newUser: User = data.user;
      setUser(newUser);
      setAccountType(newUser.accountType);

      if (data.token) {
        setToken(data.token);
        try {
          localStorage.setItem('mm_auth_token', data.token);
        } catch (e) {}
      }

      if (newUser.accountType === 'professioneel') {
        setCompany({
          ...DEFAULT_B2B_COMPANY,
          name: newUser.companyName || 'Nieuw B2B Bedrijf',
          vatNumber: newUser.vatNumber || '',
        });
      } else {
        setCompany(null);
      }

      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens registratie.' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword?: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Wachtwoord wijzigen mislukt.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens wijzigen wachtwoord.' };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Aanvraag mislukt.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens herstelaanvraag.' };
    }
  };

  const validateResetToken = async (token: string): Promise<{ success: boolean; error?: string; email?: string }> => {
    try {
      const res = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Ongeldige of verlopen herstelcode.' };
      }
      return { success: true, email: data.email };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens controleren code.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword?: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Wachtwoord instellen mislukt.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens wachtwoordherstel.' };
    }
  };

  const verifyEmail = async (token: string, email?: string): Promise<{ success: boolean; error?: string; message?: string; email?: string }> => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verificatie mislukt.' };
      }
      // If the currently authenticated user matches, update their isEmailVerified flag
      if (user && (user.email.toLowerCase() === (data.email || email || '').toLowerCase())) {
        setUser({ ...user, isEmailVerified: true });
      }
      return { success: true, message: data.message, email: data.email };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens e-mailverificatie.' };
    }
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verzenden mislukt.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verbindingsfout tijdens verzenden verificatiemail.' };
    }
  };

  const logout = () => {
    try {
      if (token) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
      localStorage.removeItem('mm_auth_token');
    } catch (e) {}
    setToken(null);
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

  const switchUser = (id: string) => {
    if (id.startsWith('b2b')) {
      switchAccountType('professioneel');
    } else {
      switchAccountType('particulier');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        company,
        isAuthenticated: !!user,
        token,
        activeRole: user?.role || 'b2c_customer',
        accountType,
        switchAccountType,
        setAccountType: (type: any) => switchAccountType(type === 'zakelijk' ? 'professioneel' : type),
        switchUser,
        login,
        loginWithPassword,
        registerUser,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        validateResetToken,
        resendVerification,
        logout,
        getAuthHeaders,
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
