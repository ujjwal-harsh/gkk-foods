import React from 'react';
import { Order, OrderStatus } from '../types';
import { cmsStore } from '../data/cmsStore';

interface OrderStatusViewProps {
  order: Order;
  onBackToHome: () => void;
  onReorder: (order: Order) => void;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received at GKK Delhi Cloud Kitchen' },
  { key: 'ACCEPTED', label: 'Kitchen Accepted', desc: 'Order confirmed and queued for preparation' },
  { key: 'PREPARING', label: 'Cooking & Assembling', desc: 'Fresh dal, sabzi, and hot rotis being prepared' },
  { key: 'PACKED', label: 'Hygiene Packed', desc: 'Sealed in tamper-evident food-grade containers' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Dispatched for zero-contact delivery' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your everyday meal!' }
];

export const OrderStatusView: React.FC<OrderStatusViewProps> = ({
  order,
  onBackToHome,
  onReorder
}) => {
  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cmsStore.updateOrderStatus(order.id, 'CANCELLED', 'Cancelled by customer before kitchen preparation started.');
    }
  };

  return (
    <div className="order-status-container">
      <div className="container">
        <div className="os-card">
          {/* Header */}
          <div className="os-header">
            <div>
              <span className="text-eyebrow">Direct Kitchen Order Status</span>
              <h2 className="os-title">Order #{order.orderNumber}</h2>
              <p className="os-meta">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · GKK Delhi Central Kitchen
              </p>
            </div>
            <div className="os-badge-wrap">
              <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-live'}`}>
                {isCancelled ? 'Order Cancelled' : order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Realistic Status Tracker (No Fake Maps) */}
          {!isCancelled ? (
            <div className="os-tracker-wrap">
              <div className="os-steps">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.key} className={`os-step-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="step-marker">
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="step-content">
                        <span className="step-label">{step.label}</span>
                        <span className="step-desc">{step.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="callout callout-warning" style={{ margin: '24px 0' }}>
              <strong>This order was cancelled.</strong> If an online payment was processed, the refund will be credited back via original source as per standard banking terms.
            </div>
          )}

          {/* Operational Details Grid */}
          <div className="os-details-grid">
            {/* Delivery Address */}
            <div className="os-section">
              <h4 className="os-sec-title">Delivery Destination</h4>
              <p className="os-sec-name"><strong>{order.deliveryAddress.name}</strong> ({order.deliveryAddress.phone})</p>
              <p className="os-sec-text">
                {order.deliveryAddress.flatHouse}, {order.deliveryAddress.building ? `${order.deliveryAddress.building}, ` : ''}
                {order.deliveryAddress.street}, {order.deliveryAddress.locality}
              </p>
              <p className="os-sec-text">Delhi — PIN {order.deliveryAddress.pinCode}</p>
              {order.deliveryInstructions && (
                <p className="os-instructions">Note: “{order.deliveryInstructions}”</p>
              )}
            </div>

            {/* Payment & Breakdown */}
            <div className="os-section">
              <h4 className="os-sec-title">Payment & Billing</h4>
              <p className="os-sec-text">Method: <strong>{order.paymentMethod}</strong></p>
              <p className="os-sec-text">Payment State: <strong>{order.paymentStatus}</strong></p>
              <div className="os-cost-summary">
                <div className="ocs-row">
                  <span>Items Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="ocs-row">
                  <span>Delivery Fee:</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="ocs-row">
                  <span>GST (5%):</span>
                  <span>₹{order.taxAmount}</span>
                </div>
                <div className="ocs-row ocs-total">
                  <span>Total Amount Paid:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Snapshot */}
          <div className="os-items-section">
            <h4 className="os-sec-title">Meal Summary</h4>
            <div className="os-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="os-item-row">
                  <div className="osi-left">
                    <span className="veg-indicator"><span className="veg-indicator-dot" /></span>
                    <span className="osi-name">{item.productName}</span>
                    <span className="osi-qty">× {item.quantity}</span>
                  </div>
                  <span className="osi-price">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="os-actions-bar">
            <button className="btn btn-secondary" onClick={onBackToHome}>
              Back to Home
            </button>
            <div className="os-right-actions">
              {order.status === 'PLACED' && !isCancelled && (
                <button className="btn btn-outline-primary btn-sm" onClick={handleCancel}>
                  Cancel Order
                </button>
              )}
              <button className="btn btn-primary" onClick={() => onReorder(order)}>
                Order Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-status-container {
          padding: 60px 0;
          min-height: calc(100vh - var(--header-height));
        }
        .os-card {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 36px;
          box-shadow: var(--shadow-card);
          max-width: 820px;
          margin: 0 auto;
        }
        .os-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .os-title {
          font-size: 1.6rem;
          margin: 4px 0 6px;
        }
        .os-meta {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .badge-cancelled {
          background-color: #FFEDEA;
          color: #BA1A1A;
          border: 1px solid #FFDAD6;
        }
        .os-tracker-wrap {
          padding: 32px 0 24px;
        }
        .os-steps {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          position: relative;
        }
        .os-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .step-marker {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--color-surface-subtle);
          border: 2px solid var(--color-border-strong);
          color: var(--color-text-muted);
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          z-index: 2;
          transition: all 0.2s ease;
        }
        .os-step-item.done .step-marker {
          background-color: var(--color-veg);
          border-color: var(--color-veg);
          color: #FFF;
        }
        .os-step-item.current .step-marker {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: #FFF;
          box-shadow: 0 0 0 4px var(--color-primary-light);
        }
        .step-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .step-desc {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          line-height: 1.3;
        }
        .os-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 28px 0;
        }
        .os-section {
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          padding: 20px;
          border-radius: var(--radius-md);
        }
        .os-sec-title {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: 10px;
        }
        .os-sec-name {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .os-sec-text {
          font-size: 0.86rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
        }
        .os-instructions {
          font-size: 0.82rem;
          font-style: italic;
          color: var(--color-primary);
          margin-top: 8px;
        }
        .os-cost-summary {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ocs-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          color: var(--color-text-secondary);
        }
        .ocs-total {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--color-text);
          border-top: 1px solid var(--color-border);
          padding-top: 6px;
          margin-top: 4px;
        }
        .os-items-section {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 28px;
        }
        .os-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        .os-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--color-border);
        }
        .os-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .osi-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .osi-name {
          font-size: 0.92rem;
          font-weight: 600;
        }
        .osi-qty {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .osi-price {
          font-weight: 700;
          font-size: 0.92rem;
        }
        .os-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }
        .os-right-actions {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .os-steps {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .os-step-item {
            flex-direction: row;
            text-align: left;
            gap: 14px;
          }
          .step-marker {
            margin-bottom: 0;
          }
          .os-details-grid {
            grid-template-columns: 1fr;
          }
          .os-card {
            padding: 24px 18px;
          }
        }
      `}</style>
    </div>
  );
};
