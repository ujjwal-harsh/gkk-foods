import React, { useState, useEffect } from 'react';
import { cmsStore } from '../data/cmsStore';
import { Order, Customer } from '../types';

interface AccountPageProps {
  onNavigateToOrder: (orderId: string) => void;
  onOpenCart: () => void;
  onNavigateHome: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigateToOrder,
  onOpenCart,
  onNavigateHome
}) => {
  const [customer, setCustomer] = useState<Customer>(cmsStore.getCustomer());
  const [orders, setOrders] = useState<Order[]>(cmsStore.getOrders());
  const [reorderFeedback, setReorderFeedback] = useState<string | null>(null);

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setCustomer(cmsStore.getCustomer());
      setOrders(cmsStore.getOrders());
    });
  }, []);

  const handleReorder = (order: Order) => {
    const res = cmsStore.verifyAndReorder(order);
    if (res.success) {
      if (res.unavailableItems.length > 0) {
        setReorderFeedback(`Added ${res.addedCount} items to your cart. Note: ${res.unavailableItems.join(', ')} is not on today’s active menu.`);
      } else {
        setReorderFeedback(`Added ${res.addedCount} items to your cart.`);
      }
      onOpenCart();
    } else {
      alert(`None of the items from this past order are available on today’s daily-changing menu. Please browse today’s fresh menu.`);
    }
  };

  return (
    <div className="account-page-root">
      <section className="account-hero-section">
        <div className="container">
          <span className="text-eyebrow">Customer Account</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            {customer.name}
          </h1>
          <p className="text-lead">
            Mobile: +91 {customer.phone} · Registered Customer
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container account-container">
          {reorderFeedback && (
            <div className="callout callout-info" style={{ marginBottom: '24px' }}>
              {reorderFeedback}
            </div>
          )}

          <div className="account-grid">
            {/* Orders Column */}
            <div className="account-main">
              <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
                Your Order History
              </h2>

              {orders.length === 0 ? (
                <div className="empty-account-box gkk-card">
                  <div className="eab-icon">🍱</div>
                  <h3 className="text-h3" style={{ marginBottom: '6px' }}>No orders placed yet</h3>
                  <p className="text-lead" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                    You haven’t ordered from GKK yet. Browse today’s fresh meal combinations from our Delhi cloud kitchen.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={onNavigateHome}>
                    Browse Today’s Menu
                  </button>
                </div>
              ) : (
                <div className="orders-history-list">
                  {orders.map((ord) => (
                    <div key={ord.id} className="order-history-card gkk-card">
                      <div className="ohc-header">
                        <div>
                          <span className="ohc-num">Order #{ord.orderNumber}</span>
                          <span className="ohc-date">
                            {new Date(ord.placedAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <span className={`badge ${ord.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-live'}`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="ohc-items">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="ohc-item-line">
                            <span>{i.productName} × {i.quantity}</span>
                            <span>₹{i.subtotal}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ohc-footer">
                        <span className="ohc-total">Total: ₹{ord.totalAmount}</span>
                        <div className="ohc-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onNavigateToOrder(ord.id)}
                          >
                            Track Status
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReorder(ord)}
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile & Saved Addresses Sidebar */}
            <div className="account-sidebar">
              <div className="gkk-card account-card">
                <h3 className="text-h3" style={{ fontSize: '1.1rem', marginBottom: '14px' }}>
                  Saved Addresses
                </h3>

                {customer.addresses.map((addr, idx) => (
                  <div key={idx} className="saved-addr-item">
                    <div className="sai-header">
                      <strong className="sai-title">{addr.locality}</strong>
                      {addr.isDefault && <span className="badge badge-veg">Default</span>}
                    </div>
                    <p className="sai-text">
                      {addr.flatHouse}, {addr.street}<br />
                      PIN {addr.pinCode}, Delhi
                    </p>
                  </div>
                ))}
              </div>

              <div className="gkk-card account-card" style={{ marginTop: '20px' }}>
                <h3 className="text-h3" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                  Preferences & Diet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  GKK cloud kitchens operate exclusively pure vegetarian food lines. Everyday staples are prepared with light spices and standard culinary oils.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .account-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .account-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 36px;
        }
        .empty-account-box {
          padding: 48px 24px;
          text-align: center;
        }
        .eab-icon {
          font-size: 2.8rem;
          margin-bottom: 10px;
        }
        .orders-history-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .order-history-card {
          padding: 24px;
        }
        .ohc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--color-border);
        }
        .ohc-num {
          font-weight: 700;
          font-size: 1.05rem;
          display: block;
        }
        .ohc-date {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .badge-cancelled {
          background-color: #FFEDEA;
          color: #BA1A1A;
          border: 1px solid #FFDAD6;
        }
        .ohc-items {
          padding: 14px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ohc-item-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
        .ohc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--color-border);
        }
        .ohc-total {
          font-weight: 800;
          font-size: 1.05rem;
        }
        .ohc-actions {
          display: flex;
          gap: 10px;
        }
        .account-card {
          padding: 24px;
        }
        .saved-addr-item {
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 14px;
        }
        .sai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .sai-title {
          font-size: 0.9rem;
        }
        .sai-text {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
        }
        @media (max-width: 768px) {
          .account-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
