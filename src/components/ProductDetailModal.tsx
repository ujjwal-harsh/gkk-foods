import React, { useState } from 'react';
import { Product } from '../types';
import { cmsStore } from '../data/cmsStore';

interface ProductDetailModalProps {
  product: Product | null;
  price: number;
  isSoldOut: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  price,
  isSoldOut,
  onClose,
  onAdded
}) => {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const handleAddToCart = () => {
    if (isSoldOut) return;
    cmsStore.addToCart(product, price, qty, notes);
    onAdded();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card product-detail-card" onClick={(e) => e.stopPropagation()}>
        <div className="pdm-image-wrap">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="pdm-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <button className="pdm-close-float" onClick={onClose} aria-label="Close product view">
            ✕
          </button>
        </div>

        <div className="modal-body pdm-body">
          <div className="pdm-title-row">
            <div>
              <div className="pdm-badges">
                <span className="veg-indicator" title="Pure Vegetarian">
                  <span className="veg-indicator-dot" />
                </span>
                <span className="badge badge-veg">Pure Veg</span>
              </div>
              <h3 className="pdm-title">{product.name}</h3>
            </div>
            <div className="pdm-price-box">
              <span className="pdm-price">₹{price}</span>
            </div>
          </div>

          <p className="pdm-desc">{product.description}</p>

          {/* Includes List */}
          {product.includes && product.includes.length > 0 && (
            <div className="pdm-section">
              <h4 className="pdm-sec-title">What’s in this meal:</h4>
              <ul className="pdm-includes-list">
                {product.includes.map((inc, i) => (
                  <li key={i} className="pdm-inc-item">
                    <span className="pdm-check">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergens Notice */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="pdm-allergens">
              <span className="pa-label">Allergen Notice:</span> Contains {product.allergens.join(', ')}
            </div>
          )}

          {/* Special Instructions */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              Special Instructions <span className="optional">(e.g. less spice, no onion salad)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Add cooking or packing instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer pdm-footer">
          <div className="pdm-qty-controls">
            <button className="pdm-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} disabled={isSoldOut}>
              −
            </button>
            <span className="pdm-qty-val">{qty}</span>
            <button className="pdm-qty-btn" onClick={() => setQty(qty + 1)} disabled={isSoldOut}>
              +
            </button>
          </div>

          <button
            className="btn btn-primary pdm-add-btn"
            onClick={handleAddToCart}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out Today' : `Add to Cart · ₹${price * qty}`}
          </button>
        </div>
      </div>

      <style>{`
        .product-detail-card {
          max-width: 520px;
          overflow: hidden;
        }
        .pdm-image-wrap {
          position: relative;
          width: 100%;
          height: 240px;
          background-color: var(--color-surface-subtle);
        }
        .pdm-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdm-close-float {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.85);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          backdrop-filter: blur(4px);
        }
        .pdm-demo-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background-color: rgba(33, 29, 26, 0.85);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: monospace;
        }
        .pdm-body {
          padding: 20px 24px;
        }
        .pdm-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .pdm-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .pdm-title {
          font-size: 1.3rem;
          color: var(--color-text);
        }
        .pdm-price {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .pdm-desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 18px;
        }
        .pdm-section {
          background-color: var(--color-surface-subtle);
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
          border: 1px solid var(--color-border);
        }
        .pdm-sec-title {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }
        .pdm-includes-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .pdm-inc-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          color: var(--color-text);
        }
        .pdm-check {
          color: var(--color-veg);
          font-weight: bold;
        }
        .pdm-allergens {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          background-color: #FAF8F5;
        }
        .pa-label {
          font-weight: 700;
          color: var(--color-text-secondary);
        }
        .pdm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
        }
        .pdm-qty-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-sm);
          background-color: var(--color-surface);
        }
        .pdm-qty-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .pdm-qty-val {
          font-size: 0.95rem;
          font-weight: 700;
          min-width: 28px;
          text-align: center;
        }
        .pdm-add-btn {
          flex: 1;
          margin-left: 16px;
        }
        @media (max-width: 600px) {
          .pdm-includes-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
