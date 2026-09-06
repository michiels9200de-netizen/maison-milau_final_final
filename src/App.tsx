import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { WebshopPage } from './pages/WebshopPage';
import { B2BPage } from './pages/B2BPage';
import { EventsPage } from './pages/EventsPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { CookieBanner } from './components/CookieBanner';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  const navigate = (pathWithQuery: string) => {
    const [path, query] = pathWithQuery.split('?');
    window.history.pushState({}, '', pathWithQuery);
    setCurrentPath(path || '/');
    setSearchParams(new URLSearchParams(query || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/koffies':
        return <CatalogPage navigate={navigate} />;
      case '/webshop':
        return <WebshopPage navigate={navigate} searchParams={searchParams} />;
      case '/kantoor-en-horeca':
        return <B2BPage navigate={navigate} />;
      case '/events':
        return <EventsPage navigate={navigate} />;
      case '/over-ons':
        return <AboutPage navigate={navigate} />;
      case '/faq':
        return <FAQPage navigate={navigate} />;
      case '/afspraakplanner':
        return <AppointmentPage navigate={navigate} />;
      case '/checkout':
        return <CheckoutPage navigate={navigate} />;
      case '/account':
      case '/login':
      case '/register':
      case '/forgot-password':
      case '/reset-password':
      case '/verify-email':
        return <AccountPage navigate={navigate} />;
      case '/admin':
        return <AdminPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/cookies':
        return <CookiePolicyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      case '/shipping':
        return <ShippingReturnsPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div
          className="min-h-screen flex flex-col text-stone-800 font-sans selection:bg-amber-100 selection:text-amber-950"
          style={{
            backgroundColor: '#F8F6F2',
            backgroundImage:
              'radial-gradient(circle at top left, #EFE7DB 0%, transparent 40%), radial-gradient(circle at bottom right, #E8DDCF 0%, transparent 35%)',
            backgroundAttachment: 'fixed',
          }}
        >
          <Header currentPath={currentPath} navigate={navigate} />

          <main className="flex-1">
            {renderCurrentPage()}
          </main>

          <Footer navigate={navigate} />

          <CartDrawer navigate={navigate} />
          <CookieBanner />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
