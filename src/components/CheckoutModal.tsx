import React, { useState } from 'react';
import { cmsStore } from '../data/cmsStore';
import { Address, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const cart = cmsStore.getCart();
  const customer = cmsStore.getCustomer();
  const defaultAddress = customer.addresses[0];
  const serviceability = cmsStore.getServiceability();

  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [flatHouse, setFlatHouse] = useState(defaultAddress?.flatHouse || '');
  const [building, setBuilding] = useState(defaultAddress?.building || '');
  const [street, setStreet] = useState(defaultAddress?.street || '');
  const [locality, setLocality] = useState(defaultAddress?.locality || serviceability?.locality || '');
  const [landmark, setLandmark] = useState(defaultAddress?.landmark || '');
  const [pinCode, setPinCode] = useState(serviceability?.pinCode || defaultAddress?.pinCode || '110016');
  const [city] = useState('Delhi');
  const [state] = useState('Delhi NCR');
  const [deliveryInstructions, setDeliveryInstructions] = useState(defaultAddress?.deliveryInstructions || '');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_UPI' | 'COD'>('ONLINE_UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = 30;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !flatHouse || !street || !pinCode) {
      alert('Please fill all mandatory address details.');
      return;
    }

    setIsProcessing(true);

    const address: Address = {
      name,
      phone,
      flatHouse,
      building,
      street,
      locality,
      landmark,
      pinCode,
      city,
      state,
      deliveryInstructions
    };

    // Simulated Server Gateway Processing Machine (PENDING -> SUCCESS)
    setTimeout(() => {
      try {
        const order: Order = cmsStore.placeOrder(
          address,
          paymentMethod === 'ONLINE_UPI' ? 'UPI / Online Payment' : 'Cash on Delivery',
          deliveryInstructions
        );
        setIsProcessing(false);
        onClose();
        onOrderSuccess(order.id);
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || 'Failed to place order');
      }
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-h3">Confirm Delivery & Place Order</h3>
            <p className="modal-sub">Direct ordering from GKK Delhi Cloud Kitchen</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body checkout-body">
            {/* Step 1: Customer Contact */}
            <div className="checkout-section">
              <h4 className="cs-heading">1. Contact Information</h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">10-Digit Mobile *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="checkout-section">
              <h4 className="cs-heading">2. Delivery Address</h4>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Flat / House No. / Floor *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Flat 304, 3rd Floor"
                    value={flatHouse}
                    onChange={(e) => setFlatHouse(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Building / Society <span className="optional">(optional)</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Green Heights"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street / Colony / Main Road *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Outer Ring Road, Near Gate 2"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Locality / Area *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="form-input"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-input" value={city} disabled />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Landmark <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Opposite Community Hall"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Instructions <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Leave with guard / Don't ring bell"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="checkout-section">
              <h4 className="cs-heading">3. Payment Option</h4>
              <div className="payment-options-grid">
                <label className={`payment-card ${paymentMethod === 'ONLINE_UPI' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="ONLINE_UPI"
                    checked={paymentMethod === 'ONLINE_UPI'}
                    onChange={() => setPaymentMethod('ONLINE_UPI')}
                  />
                  <div className="pay-text">
                    <span className="pay-title">UPI / Instant Online Gateway</span>
                    <span className="pay-desc">GPay, PhonePe, Paytm, or Net Banking</span>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="pay-text">
                    <span className="pay-title">Cash on Delivery</span>
                    <span className="pay-desc">Pay cash to rider upon arrival</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Preview */}
            <div className="checkout-bill-summary">
              <div className="cbs-line">
                <span>Items ({cart.length})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="cbs-line">
                <span>Delivery Charge</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="cbs-line">
                <span>GST (5%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="cbs-divider" />
              <div className="cbs-line cbs-total">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? 'Verifying & Placing Order…' : `Confirm & Pay ₹${total}`}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .checkout-modal-card {
          max-width: 620px;
        }
        .checkout-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 70vh;
          overflow-y: auto;
        }
        .checkout-section {
          background-color: var(--color-surface-subtle);
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }
        .cs-heading {
          font-size: 0.95rem;
          margin-bottom: 12px;
          color: var(--color-text);
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .form-grid-3 {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 12px;
        }
        .payment-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .payment-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background-color: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .payment-card input {
          margin-top: 3px;
        }
        .payment-card.selected {
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
        }
        .pay-text {
          display: flex;
          flex-direction: column;
        }
        .pay-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .pay-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .checkout-bill-summary {
          background-color: #FAF6F0;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }
        .cbs-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
          color: var(--color-text-secondary);
          margin-bottom: 6px;
        }
        .cbs-divider {
          height: 1px;
          background-color: var(--color-border);
          margin: 8px 0;
        }
        .cbs-total {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0;
        }
        @media (max-width: 600px) {
          .form-grid-2, .form-grid-3, .payment-options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
