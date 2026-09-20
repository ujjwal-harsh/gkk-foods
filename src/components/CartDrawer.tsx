import React from 'react';
import { cmsStore } from '../data/cmsStore';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onOpenServiceability: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onOpenServiceability
}) => {
  if (!isOpen) return null;

  const cart: CartItem[] = cmsStore.getCart();
  const serviceability = cmsStore.getServiceability();

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <h3 className="drawer-title">Your Everyday Basket</h3>
            <p className="drawer-sub">
              {serviceability?.isServiceable
                ? `Delivering to PIN ${serviceability.pinCode} (Delhi Hub)`
                : 'Delhi Cloud Kitchen'}
            </p>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Location prompt if not checked */}
        {!serviceability?.isServiceable && cart.length > 0 && (
          <div className="cart-location-notice">
            <span>Please check delivery serviceability for your address before checkout.</span>
            <button className="cln-btn" onClick={onOpenServiceability}>Check PIN</button>
          </div>
        )}

        {/* Items List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🍱</div>
              <h4 className="empty-cart-title">Your cart is empty</h4>
              <p className="empty-cart-text">
                Browse today's freshly prepared meal combos and everyday home-style staples.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                View Today’s Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <div className="cir-info">
                    <div className="cir-title-line">
                      <span className="veg-indicator" title="Pure Vegetarian">
                        <span className="veg-indicator-dot" />
                      </span>
                      <span className="cir-name">{item.product.name}</span>
                    </div>
                    <span className="cir-price">₹{item.unitPrice} each</span>
                  </div>

                  <div className="cir-actions">
                    <div className="quantity-stepper">
                      <button
                        className="qs-btn"
                        onClick={() => cmsStore.updateCartQuantity(item.product.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qs-val">{item.quantity}</span>
                      <button
                        className="qs-btn"
                        onClick={() => cmsStore.updateCartQuantity(item.product.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="cir-subtotal">₹{item.unitPrice * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill Summary & Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="bill-breakdown">
              <div className="bb-row">
                <span className="bb-label">Item Total</span>
                <span className="bb-val">₹{subtotal}</span>
              </div>
              <div className="bb-row">
                <span className="bb-label">Delivery Fee</span>
                <span className="bb-val">₹{deliveryFee}</span>
              </div>
              <div className="bb-row">
                <span className="bb-label">Taxes (5% GST)</span>
                <span className="bb-val">₹{taxes}</span>
              </div>
              <div className="bb-divider" />
              <div className="bb-row bb-total">
                <span className="bb-label">To Pay</span>
                <span className="bb-val">₹{total}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => {
                onClose();
                onCheckout();
              }}
            >
              Proceed to Checkout · ₹{total}
            </button>
            <p className="checkout-security-note">
              🔒 Standardized kitchen hygiene & zero-contact dispatch
            </p>
          </div>
        )}
      </div>

      <style>{`
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-title {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .drawer-sub {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
        .drawer-close-btn {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
        }
        .drawer-close-btn:hover {
          background-color: var(--color-surface-subtle);
          color: var(--color-text);
        }
        .cart-location-notice {
          background-color: #FEF7E0;
          color: #794400;
          padding: 10px 16px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #FEEFC3;
        }
        .cln-btn {
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: underline;
          color: #794400;
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }
        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          min-height: 260px;
        }
        .empty-cart-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .empty-cart-title {
          font-size: 1.1rem;
          margin-bottom: 6px;
        }
        .empty-cart-text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          max-width: 260px;
          margin-bottom: 20px;
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-border);
        }
        .cir-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cir-title-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cir-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .cir-price {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .cir-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .quantity-stepper {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-sm);
          background-color: var(--color-surface);
        }
        .qs-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          color: var(--color-text-secondary);
        }
        .qs-btn:hover {
          background-color: var(--color-surface-subtle);
        }
        .qs-val {
          font-size: 0.85rem;
          font-weight: 700;
          min-width: 22px;
          text-align: center;
        }
        .cir-subtotal {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-text);
          min-width: 50px;
          text-align: right;
        }
        .drawer-footer {
          padding: 20px 24px 24px;
          border-top: 1px solid var(--color-border);
          background-color: var(--color-surface-subtle);
        }
        .bill-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }
        .bb-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }
        .bb-divider {
          height: 1px;
          background-color: var(--color-border);
          margin: 4px 0;
        }
        .bb-total {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .checkout-security-note {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};
