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
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Delhi Hub', path: '/delhi' },
    { name: 'Locations', path: '/locations' },
    { name: 'About', path: '/about' },
    { name: 'Quality', path: '/quality' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Support', path: '/support' }
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
        {/* Brand Logo */}
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
            title="Check delivery serviceability in your area"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="loc-text">
              <span className="loc-title">
                {serviceability?.isServiceable
                  ? `Delivering to ${serviceability.pinCode}`
                  : 'Check Your Location'}
              </span>
              <span className="loc-city">Delhi (Live)</span>
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
            title="Customer Account & Orders"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Admin Operations Access */}
          <button
            className="admin-link-badge"
            onClick={() => handleLinkClick('/admin')}
            title="GKK Operations CMS & Dashboard"
          >
            Operations
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
              <span>{serviceability ? `PIN ${serviceability.pinCode} (Delhi)` : 'Select Your Area in Delhi'}</span>
            </button>

            <div className="mobile-nav-list">
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
                onClick={() => handleLinkClick('/account')}
              >
                My Account & Orders
              </button>
              <button
                className="mobile-nav-link"
                onClick={() => handleLinkClick('/admin')}
              >
                ⚙ Operations CMS
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
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 1px 4px rgba(33, 29, 26, 0.03);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--header-height);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .brand-logo-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .brand-badge-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-primary);
          color: #FFF;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          padding: 6px 9px;
          border-radius: var(--radius-sm);
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text);
          line-height: 1.1;
        }
        .brand-subline {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .location-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          transition: all 0.15s ease;
          text-align: left;
        }
        .location-trigger:hover {
          border-color: var(--color-border-strong);
          background-color: #EDE5D8;
        }
        .location-trigger.loc-active {
          border-color: var(--color-veg-border);
          background-color: var(--color-veg-light);
          color: var(--color-veg);
        }
        .loc-text {
          display: flex;
          flex-direction: column;
        }
        .loc-title {
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.15;
        }
        .loc-city {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          padding: 8px 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
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
        }
        .cart-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          transition: background-color 0.15s ease;
        }
        .cart-btn:hover {
          background-color: var(--color-primary-hover);
        }
        .cart-count-badge {
          background-color: #FFFFFF;
          color: var(--color-primary);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
        }
        .account-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }
        .account-nav-btn:hover {
          background-color: var(--color-surface-subtle);
          color: var(--color-text);
        }
        .admin-link-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
          background-color: var(--color-surface-sunken);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }
        .admin-link-badge:hover {
          background-color: var(--color-text);
          color: var(--color-text-inverse);
        }
        .mobile-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
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
        @media (max-width: 1024px) {
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
          .admin-link-badge {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
