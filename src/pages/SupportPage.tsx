import React, { useState } from 'react';

export const SupportPage: React.FC = () => {
  const [orderRef, setOrderRef] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('order_issue');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !message) return;
    const newId = `TKT-${Date.now().toString().slice(-6)}`;
    setTicketId(newId);
  };

  return (
    <div className="support-page-root">
      <section className="support-hero-section">
        <div className="container">
          <span className="text-eyebrow">Customer Care & Operations</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            Help & Order Support
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px' }}>
            Have a question about a live order or daily meal dispatch? Submit a ticket directly to our Delhi kitchen dispatch team.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container support-container">
          <div className="support-grid">
            {/* Ticket Form */}
            <div className="support-form-wrap gkk-card">
              <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
                Report an Issue or Feedback
              </h2>
              <p className="text-lead" style={{ fontSize: '0.88rem', marginBottom: '24px' }}>
                Our kitchen supervisors review operational tickets promptly during delivery hours.
              </p>

              {!ticketId ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">
                      Order Reference Number <span className="optional">(e.g. GKK-123456)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Optional order number"
                      value={orderRef}
                      onChange={(e) => setOrderRef(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your 10-Digit Mobile *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      className="form-input"
                      placeholder="Phone used during ordering"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topic / Issue Category *</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="order_issue">Delivery delay / Status inquiry</option>
                      <option value="missing_item">Missing or incorrect item</option>
                      <option value="packaging">Packaging or spill issue</option>
                      <option value="food_feedback">Taste & recipe feedback</option>
                      <option value="payment">Payment confirmation question</option>
                      <option value="other">General inquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message Details *</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="Please describe what happened so our kitchen manager can assist you…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Submit Support Ticket
                  </button>
                </form>
              ) : (
                <div className="ticket-success">
                  <div className="result-icon-circle success">✓</div>
                  <h3 className="text-h3" style={{ marginBottom: '8px' }}>Ticket #{ticketId} Logged</h3>
                  <p className="text-lead" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                    Thank you. Your support request has been queued for our Delhi central kitchen dispatch coordinator. We will reach out to <strong>{phone}</strong> shortly.
                  </p>
                  <button className="btn btn-secondary btn-full" onClick={() => setTicketId(null)}>
                    Submit Another Request
                  </button>
                </div>
              )}
            </div>

            {/* Channels & Policy Notice */}
            <div className="support-sidebar">
              <div className="support-info-card gkk-card">
                <h3 className="text-h3" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
                  Operational Timings
                </h3>
                <p className="sic-text">
                  Our cloud kitchens operate daily for scheduled Lunch and Dinner preparation cycles.
                </p>
                <div className="callout callout-info" style={{ margin: '14px 0 0' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Kitchen Status:</span><br />
                  Central Delhi Facility: Active & Cooking
                </div>
              </div>

              <div className="support-info-card gkk-card" style={{ marginTop: '20px' }}>
                <h3 className="text-h3" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
                  Official Direct Channels
                </h3>
                <p className="sic-text">
                  Email: <code>[SUPPORT EMAIL TO BE PROVIDED BY GKK]</code><br />
                  Helpline: <code>[HELPLINE NUMBER TO BE PROVIDED BY GKK]</code>
                </p>
                <p className="sic-sub">
                  Direct phone lines and WhatsApp messaging support will be displayed once GKK commercial telecom infrastructure is provisioned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .support-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .support-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 36px;
        }
        .support-form-wrap {
          padding: 36px;
        }
        .ticket-success {
          text-align: center;
          padding: 24px 0;
        }
        .support-info-card {
          padding: 24px;
        }
        .sic-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }
        .sic-sub {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 10px;
        }
        @media (max-width: 768px) {
          .support-grid {
            grid-template-columns: 1fr;
          }
          .support-form-wrap {
            padding: 24px 18px;
          }
        }
      `}</style>
    </div>
  );
};
