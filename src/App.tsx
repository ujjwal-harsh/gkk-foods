import React, { useState, useEffect } from 'react';
import { cmsStore } from './data/cmsStore';
import { Product, Order } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContentAuditBanner } from './components/ContentAuditBanner';
import { ServiceabilityModal } from './components/ServiceabilityModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CorporateModal } from './components/CorporateModal';
import { OrderStatusView } from './components/OrderStatusView';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CityPage } from './pages/CityPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage } from './pages/AboutPage';
import { QualityPage } from './pages/QualityPage';
import { FaqPage } from './pages/FaqPage';
import { SupportPage } from './pages/SupportPage';
import { AccountPage } from './pages/AccountPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  // Navigation & Route State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Modals & Drawers
  const [isServiceabilityOpen, setIsServiceabilityOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<{
    product: Product;
    price: number;
    isSoldOut: boolean;
  } | null>(null);

  // Sync state with browser history (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic Navigate
  const navigate = (path: string) => {
    if (path === '/corporate') {
      setIsCorporateOpen(true);
      return;
    }
    if (path !== currentPath) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Product Modal
  const handleOpenProduct = (product: Product, price: number, isSoldOut: boolean) => {
    setSelectedProductData({ product, price, isSoldOut });
  };

  // Checkout Handlers
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setIsCheckoutOpen(false);
    navigate(`/order/${orderId}`);
  };

  // Reorder Handler
  const handleReorder = (order: Order) => {
    const res = cmsStore.verifyAndReorder(order);
    if (res.success) {
      setIsCartOpen(true);
    } else {
      alert(`Could not reorder all items: ${res.unavailableItems.join(', ')} are unavailable on today's active menu.`);
    }
  };

  // Dynamic Route Matching
  const renderCurrentView = () => {
    // 1. Order Status View: /order/:id
    if (currentPath.startsWith('/order/')) {
      const orderId = currentPath.replace('/order/', '');
      const orders = cmsStore.getOrders();
      const order = orders.find((o) => o.id === orderId);

      if (order) {
        return (
          <OrderStatusView
            order={order}
            onBackToHome={() => navigate('/')}
            onReorder={handleReorder}
          />
        );
      }
      return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 className="text-h2">Order Not Found</h2>
          <p className="text-muted" style={{ margin: '16px 0 24px' }}>
            We could not find an active or historical record for Order #{orderId}.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Return to Homepage
          </button>
        </div>
      );
    }

    // 2. City Pages: /delhi, /indore, /hyderabad, /pune
    const citySlugs = ['delhi', 'indore', 'hyderabad', 'pune'];
    const matchedCity = citySlugs.find((slug) => currentPath === `/${slug}`);
    if (matchedCity) {
      return (
        <CityPage
          citySlug={matchedCity}
          onNavigate={navigate}
          onOpenServiceability={() => setIsServiceabilityOpen(true)}
        />
      );
    }

    // 3. Static Pages
    switch (currentPath) {
      case '/menu':
        return (
          <MenuPage
            onOpenProduct={handleOpenProduct}
            onOpenServiceability={() => setIsServiceabilityOpen(true)}
          />
        );
      case '/locations':
        return (
          <LocationsPage
            onNavigate={navigate}
            onOpenServiceability={() => setIsServiceabilityOpen(true)}
          />
        );
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/quality':
        return <QualityPage />;
      case '/faq':
        return <FaqPage />;
      case '/support':
        return <SupportPage />;
      case '/account':
        return (
          <AccountPage
            onNavigateToOrder={(id) => navigate(`/order/${id}`)}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigateHome={() => navigate('/')}
          />
        );
      case '/legal':
        return <LegalPage />;
      case '/admin':
        return <AdminPage />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onOpenServiceability={() => setIsServiceabilityOpen(true)}
            onOpenProduct={handleOpenProduct}
            onOpenCorporate={() => setIsCorporateOpen(true)}
          />
        );
    }
  };

  const isAdminView = currentPath === '/admin';

  return (
    <div className="gkk-app-shell">
      {/* 1. Top Content Governance & Audit Bar */}
      <ContentAuditBanner />

      {/* 2. Primary Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenServiceability={() => setIsServiceabilityOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Main Viewport */}
      <main className="gkk-main-content">
        {renderCurrentView()}
      </main>

      {/* 4. Storefront Footer (hidden in admin view for cleaner workspace) */}
      {!isAdminView && <Footer onNavigate={navigate} />}

      {/* 5. Global Interactive Drawers & Modals */}
      <ServiceabilityModal
        isOpen={isServiceabilityOpen}
        onClose={() => setIsServiceabilityOpen(false)}
        onSuccess={() => setIsServiceabilityOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        onOpenServiceability={() => {
          setIsCartOpen(false);
          setIsServiceabilityOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProductDetailModal
        product={selectedProductData?.product || null}
        price={selectedProductData?.price || 0}
        isSoldOut={selectedProductData?.isSoldOut || false}
        onClose={() => setSelectedProductData(null)}
        onAdded={() => {
          setSelectedProductData(null);
          setIsCartOpen(true);
        }}
      />

      <CorporateModal
        isOpen={isCorporateOpen}
        onClose={() => setIsCorporateOpen(false)}
      />

      {/* 6. Quick Operations Portal Switcher (Floating utility for easy testing & demo review) */}
      <aside className="portal-quick-switch" aria-label="Quick Portal Mode Switcher">
        <button
          className={`pqs-btn ${isAdminView ? 'active' : ''}`}
          onClick={() => navigate(isAdminView ? '/' : '/admin')}
          title={isAdminView ? 'Switch to Customer Storefront' : 'Switch to Kitchen Operations & CMS'}
        >
          {isAdminView ? '← View Customer Storefront' : '⚙ Kitchen CMS & Ops Portal'}
        </button>
      </aside>
    </div>
  );
};

export default App;
