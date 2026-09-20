import React, { useState, useEffect } from 'react';
import { cmsStore } from '../data/cmsStore';
import { Product } from '../types';

interface MenuPageProps {
  onOpenProduct: (product: Product, price: number, isSoldOut: boolean) => void;
  onOpenServiceability: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onOpenProduct,
  onOpenServiceability
}) => {
  const [menuData, setMenuData] = useState(cmsStore.getTodaysMenu());
  const [serviceability, setServiceability] = useState(cmsStore.getServiceability());
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = cmsStore.getCategories();

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setMenuData(cmsStore.getTodaysMenu());
      setServiceability(cmsStore.getServiceability());
    });
  }, []);

  const filteredItems = menuData.items.filter(({ product }) => {
    const matchesCat = selectedCat === 'all' || product.categoryId === selectedCat;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="menu-page-root">
      {/* Menu Header Bar */}
      <section className="menu-header-section">
        <div className="container">
          <div className="mh-flex">
            <div>
              <span className="text-eyebrow">Daily-Changing Menu</span>
              <h1 className="text-h1">Today’s Fresh Dispatch</h1>
              <p className="text-lead">
                Freshly prepared this morning in our Delhi cloud kitchen. Simple, wholesome, and familiar.
              </p>
            </div>

            {/* Serviceability Pill */}
            <div className="mh-serviceability-card">
              <span className="mhs-label">Delivery Location:</span>
              <div className="mhs-val-row">
                <span className="mhs-pin">
                  {serviceability?.isServiceable
                    ? `PIN ${serviceability.pinCode} (Delhi Hub)`
                    : 'Location Not Selected'}
                </span>
                <button className="mhs-change-btn" onClick={onOpenServiceability}>
                  {serviceability?.isServiceable ? 'Change' : 'Check PIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Filter & Search Bar */}
      <div className="menu-filter-bar sticky-filters">
        <div className="container mfb-inner">
          <div className="category-tabs" role="tablist">
            <button
              className={`cat-tab ${selectedCat === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCat('all')}
            >
              All Items ({menuData.items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="menu-search-wrap">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search dishes (e.g. Rajma, Roti, Dal)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Menu Grid */}
      <section className="section-pad" style={{ paddingTop: '36px' }}>
        <div className="container">
          {menuData.menu && filteredItems.length > 0 ? (
            <div className="full-menu-grid">
              {filteredItems.map(({ product, price, isSoldOut }) => (
                <div key={product.id} className="fmg-card gkk-card">
                  <div className="fmg-img-wrap" onClick={() => onOpenProduct(product, price, isSoldOut)}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="fmg-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="fmg-badge">
                      <span className="veg-indicator"><span className="veg-indicator-dot" /></span>
                    </div>
                    {product.isDemo && (
                      <span className="badge badge-placeholder fmg-demo">Sample Dish</span>
                    )}
                    {isSoldOut && (
                      <div className="mc-soldout-overlay">Sold Out Today</div>
                    )}
                  </div>

                  <div className="fmg-body">
                    <div className="fmg-header">
                      <h3 className="fmg-title" onClick={() => onOpenProduct(product, price, isSoldOut)}>
                        {product.name}
                      </h3>
                      <span className="fmg-price">₹{price}</span>
                    </div>

                    <p className="fmg-desc">{product.description}</p>

                    {product.includes && product.includes.length > 0 && (
                      <div className="fmg-includes">
                        <strong>Includes: </strong>
                        {product.includes.join(' · ')}
                      </div>
                    )}

                    <div className="fmg-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenProduct(product, price, isSoldOut)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isSoldOut}
                        onClick={() => cmsStore.addToCart(product, price, 1)}
                      >
                        {isSoldOut ? 'Sold Out' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !menuData.menu ? (
            <div className="menu-fallback-card gkk-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
              <div className="mfc-icon">🍲</div>
              <h3 className="mfc-title">Today’s menu is being updated.</h3>
              <p className="mfc-sub">
                Our kitchen team prepares daily-changing combinations every morning. The fresh menu for today will be published shortly.
              </p>
              <button className="btn btn-primary btn-sm" onClick={onOpenServiceability}>
                Check If GKK Delivers to You
              </button>
            </div>
          ) : (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <p className="text-lead" style={{ color: 'var(--color-text-muted)' }}>
                No dishes found matching your current category or search query.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => { setSelectedCat('all'); setSearchQuery(''); }}
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .menu-header-section {
          padding: 48px 0 40px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .mh-flex {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .mh-serviceability-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          min-width: 240px;
        }
        .mhs-label {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 2px;
        }
        .mhs-val-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .mhs-pin {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .mhs-change-btn {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-primary);
          text-decoration: underline;
        }
        .sticky-filters {
          position: sticky;
          top: var(--header-height);
          z-index: 800;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 1px 4px rgba(33, 29, 26, 0.04);
        }
        .mfb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          gap: 16px;
        }
        .category-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
        }
        .cat-tab {
          padding: 8px 14px;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          border-radius: var(--radius-full);
          background-color: var(--color-surface-subtle);
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .cat-tab:hover {
          color: var(--color-text);
        }
        .cat-tab.active {
          background-color: var(--color-primary);
          color: #FFF;
        }
        .search-input {
          max-width: 260px;
          padding: 8px 12px;
          font-size: 0.84rem;
        }
        .full-menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .fmg-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .fmg-img-wrap {
          position: relative;
          height: 200px;
          cursor: pointer;
          background-color: var(--color-surface-subtle);
        }
        .fmg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }
        .fmg-card:hover .fmg-img {
          transform: scale(1.02);
        }
        .fmg-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #FFF;
          padding: 3px 5px;
          border-radius: 4px;
        }
        .fmg-demo {
          position: absolute;
          bottom: 10px;
          left: 10px;
        }
        .fmg-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .fmg-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .fmg-title {
          font-size: 1.05rem;
          cursor: pointer;
        }
        .fmg-title:hover {
          color: var(--color-primary);
        }
        .fmg-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .fmg-desc {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 14px;
          flex: 1;
        }
        .fmg-includes {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          background-color: var(--color-surface-subtle);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
        }
        .fmg-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        @media (max-width: 992px) {
          .full-menu-grid {
            grid-template-columns: 1fr 1fr;
          }
          .mh-flex {
            flex-direction: column;
            align-items: flex-start;
          }
          .mfb-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .search-input {
            max-width: none;
            width: 100%;
          }
        }
        @media (max-width: 600px) {
          .full-menu-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
