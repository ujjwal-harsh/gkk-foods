import React, { useState, useEffect } from 'react';
import { cmsStore } from '../data/cmsStore';
import { CartItem } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenServiceability: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenServiceability,
  onOpenCart
}) => {
  const [cart, setCart] = useState<CartItem[]>(cmsStore.getCart());
  const [serviceability, setServiceability] = useState(cmsStore.getServiceability());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const flags = cmsStore.getFeatureFlags();

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setCart(cmsStore.getCart());
      setServiceability(cmsStore.getServiceability());
    });
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Menu', path: '/menu' },
    { name: 'Locations', path: '/locations' },
    { name: 'Kitchen Standards', path: '/quality' },
    { name: 'About GKK', path: '/about' },
    { name: 'Help & FAQ', path: '/faq' }
  ];

  if (flags.corporateOrders) {
    navLinks.push({ name: 'Corporate', path: '/corporate' });
  }

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo & Location Indicator */}
        <div className="header-left">
          <button className="brand-logo-btn" onClick={() => handleLinkClick('/')}>
            <span className="brand-badge-mark">GKK</span>
            <div className="brand-text-block">
              <span className="brand-name">GKK Foods</span>
              <span className="brand-subline">Everyday Indian Meals</span>
            </div>
          </button>

          {/* Location / Serviceability Trigger */}
          <button
            className={`location-trigger ${serviceability?.isServiceable ? 'loc-active' : ''}`}
            onClick={onOpenServiceability}
            title="Check delivery serviceability in Delhi"
          >
            <svg className="loc-pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="loc-text">
              <span className="loc-title">
                {serviceability?.isServiceable
                  ? `Delivering: ${serviceability.pinCode}`
                  : 'Check Your Location'}
              </span>
              <span className="loc-city">Delhi (Live Hub)</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`nav-link ${currentPath === link.path ? 'nav-link-active' : ''}`}
              onClick={() => handleLinkClick(link.path)}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right Actions: Cart & Account */}
        <div className="header-right">
          <button
            className="cart-btn"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${totalCartCount} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-label">Cart</span>
            {totalCartCount > 0 && <span className="cart-count-badge">{totalCartCount}</span>}
          </button>

          <button
            className="account-nav-btn"
            onClick={() => handleLinkClick('/account')}
            title="My Orders & Profile"
            aria-label="My Orders & Profile"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`burger-line ${mobileMenuOpen ? 'open-1' : ''}`} />
            <span className={`burger-line ${mobileMenuOpen ? 'open-2' : ''}`} />
            <span className={`burger-line ${mobileMenuOpen ? 'open-3' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner">
            <button className="mobile-loc-btn" onClick={() => { onOpenServiceability(); setMobileMenuOpen(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{serviceability ? `Delivering to PIN ${serviceability.pinCode}` : 'Check Your Area in Delhi'}</span>
            </button>

            <div className="mobile-nav-list">
              <button
                className={`mobile-nav-link ${currentPath === '/' ? 'active' : ''}`}
                onClick={() => handleLinkClick('/')}
              >
                Home
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  className={`mobile-nav-link ${currentPath === link.path ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link.path)}
                >
                  {link.name}
                </button>
              ))}
              <button
                className="mobile-nav-link"
                onClick={() => handleLinkClick('/support')}
              >
                Customer Support
              </button>
              <button
                className="mobile-nav-link"
                onClick={() => handleLinkClick('/account')}
              >
                My Account & Orders
              </button>
              <button
                className="mobile-nav-link mobile-nav-admin"
                onClick={() => handleLinkClick('/admin')}
              >
                ⚙ Kitchen CMS & Operations
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 900;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 2px 8px rgba(33, 29, 26, 0.04);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 16px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .brand-logo-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          flex-shrink: 0;
          padding: 4px 0;
        }
        .brand-badge-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-primary);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
          white-space: nowrap;
        }
        .brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text);
          line-height: 1.15;
          white-space: nowrap;
        }
        .brand-subline {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-weight: 500;
          white-space: nowrap;
        }
        .location-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background-color: #F8F5EE;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          transition: all 0.15s ease;
          text-align: left;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .location-trigger:hover {
          border-color: var(--color-border-strong);
          background-color: #EDE4D6;
        }
        .location-trigger.loc-active {
          border-color: var(--color-veg-border);
          background-color: var(--color-veg-light);
          color: var(--color-veg);
        }
        .loc-pin-icon {
          flex-shrink: 0;
        }
        .loc-text {
          display: flex;
          flex-direction: column;
          white-space: nowrap;
        }
        .loc-title {
          font-size: 0.76rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
        }
        .loc-city {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          white-space: nowrap;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 1;
        }
        .nav-link {
          padding: 8px 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--color-primary);
          background-color: var(--color-surface-subtle);
        }
        .nav-link-active {
          color: var(--color-primary);
          background-color: var(--color-primary-light);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .cart-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: var(--color-primary);
          color: #FFFFFF;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          transition: background-color 0.15s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .cart-btn:hover {
          background-color: var(--color-primary-hover);
        }
        .cart-count-badge {
          background-color: #FFFFFF;
          color: var(--color-primary);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 999px;
          line-height: 1.4;
        }
        .account-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
          background-color: #FFFFFF;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .account-nav-btn:hover {
          background-color: var(--color-surface-subtle);
          color: var(--color-text);
          border-color: var(--color-border-strong);
        }
        .mobile-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          border-radius: var(--radius-sm);
        }
        .burger-line {
          width: 22px;
          height: 2px;
          background-color: var(--color-text);
          transition: all 0.2s ease;
        }
        .mobile-drawer {
          display: none;
        }
        @media (max-width: 1080px) {
          .desktop-nav {
            display: none;
          }
          .mobile-hamburger {
            display: flex;
          }
          .mobile-drawer {
            display: block;
            border-top: 1px solid var(--color-border);
            background-color: var(--color-surface);
            padding: 16px 20px 24px;
            animation: fadeIn 0.15s ease-out;
          }
          .mobile-loc-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 10px 14px;
            background-color: var(--color-surface-subtle);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--color-text);
            margin-bottom: 16px;
          }
          .mobile-nav-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .mobile-nav-link {
            text-align: left;
            padding: 10px 12px;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--color-text-secondary);
            border-radius: var(--radius-sm);
          }
          .mobile-nav-link.active {
            color: var(--color-primary);
            background-color: var(--color-primary-light);
          }
          .mobile-nav-admin {
            margin-top: 8px;
            border-top: 1px solid var(--color-border);
            padding-top: 14px;
            color: var(--color-text-muted);
            font-size: 0.88rem;
          }
        }
        @media (max-width: 640px) {
          .location-trigger {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
