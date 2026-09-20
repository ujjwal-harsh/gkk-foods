import React, { useState } from 'react';
import { cmsStore } from '../data/cmsStore';

interface CityPageProps {
  citySlug: string;
  onNavigate: (path: string) => void;
  onOpenServiceability: () => void;
}

export const CityPage: React.FC<CityPageProps> = ({
  citySlug,
  onNavigate,
  onOpenServiceability
}) => {
  const cities = cmsStore.getCities();
  const city = cities.find((c) => c.slug === citySlug) || cities[0];
  const isLive = city.status === 'LIVE';

  const kitchens = cmsStore.getKitchens().filter((k) => k.cityId === city.id);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPin, setWaitlistPin] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistPin) return;
    cmsStore.addWaitlist(city.name, waitlistPin, '', waitlistEmail, true);
    setWaitlistDone(true);
  };

  return (
    <div className="city-page-root">
      {/* City Hero */}
      <section className="city-hero-section">
        <div className="container">
          <div className="text-eyebrow">
            <span className={`badge ${isLive ? 'badge-live' : 'badge-coming-soon'}`}>
              {isLive ? '● Live Operations Hub' : 'Planned Expansion City'}
            </span>
          </div>
          <h1 className="text-h1" style={{ margin: '14px 0 16px' }}>
            {city.seoTitle}
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px', marginBottom: '28px' }}>
            {city.description}
          </p>

          {isLive ? (
            <div className="city-hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('/menu')}>
                Order Today’s Delhi Meal
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onOpenServiceability}>
                📍 Check Your PIN Code
              </button>
            </div>
          ) : (
            <div className="city-coming-waitlist-wrap gkk-card">
              <h3 className="text-h3" style={{ marginBottom: '8px' }}>GKK is coming soon to {city.name}</h3>
              <p className="text-lead" style={{ fontSize: '0.92rem', marginBottom: '20px' }}>
                We are actively scouting kitchen facilities in {city.name}. Register your PIN code to help us map our delivery radius.
              </p>
              {!waitlistDone ? (
                <form className="chw-form" onSubmit={handleWaitlistSubmit}>
                  <div className="form-grid-2">
                    <input
                      type="text"
                      maxLength={6}
                      className="form-input"
                      placeholder="Your 6-digit PIN code"
                      value={waitlistPin}
                      onChange={(e) => setWaitlistPin(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Mobile or email for launch notification"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
                    Notify Me When Deliveries Begin
                  </button>
                </form>
              ) : (
                <div className="callout callout-success">
                  ✓ Thank you! We’ve registered your area in {city.name}. You’ll receive a single launch update when kitchen operations go live.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Operational Hubs in City */}
      {isLive && (
        <section className="section-pad">
          <div className="container">
            <div className="section-header-row">
              <div>
                <span className="text-eyebrow">Cloud Kitchen Infrastructure</span>
                <h2 className="text-h2">GKK Central Kitchen Facilities in Delhi</h2>
                <p className="text-lead">Standardized commercial culinary units designed for hygienic daily preparation.</p>
              </div>
            </div>

            <div className="kitchens-grid">
              {kitchens.map((k) => (
                <div key={k.id} className="kitchen-card gkk-card">
                  <div className="kc-top">
                    <div>
                      <span className="badge badge-live">Active Kitchen Hub</span>
                      <h3 className="kc-name">{k.name}</h3>
                      <span className="kc-code">Hub ID: {k.code}</span>
                    </div>
                  </div>

                  <p className="kc-address">{k.address}</p>

                  <div className="kc-service-info">
                    <h4 className="kc-si-title">Serviceable Delivery Areas:</h4>
                    <div className="kc-pin-chips">
                      {k.serviceablePinCodes.map((pin) => (
                        <span key={pin} className="pin-chip">
                          PIN {pin}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="kc-footer">
                    <span className="kc-capacity">Capacity: {k.capacityPerHour} meals/hour</span>
                    <button className="btn btn-secondary btn-sm" onClick={onOpenServiceability}>
                      Verify My Address
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delhi FAQ Notice */}
            <div className="city-faq-box gkk-card" style={{ marginTop: '48px', padding: '32px' }}>
              <h3 className="text-h3" style={{ marginBottom: '12px' }}>Delhi Delivery Schedule & Guidelines</h3>
              <ul className="city-guidelines-list">
                <li><strong>Order Cutoffs:</strong> Lunch preparation begins early morning. We recommend ordering before dispatch windows.</li>
                <li><strong>Standard Packaging:</strong> Food is sealed in tamper-evident food-grade containers to ensure hot and fresh arrival.</li>
                <li><strong>Dietary Assurance:</strong> 100% pure vegetarian preparation with zero cross-contamination.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .city-hero-section {
          padding: 60px 0 68px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .city-hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .city-coming-waitlist-wrap {
          max-width: 580px;
          padding: 28px;
          margin-top: 20px;
          background: #FFF;
        }
        .kitchens-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .kitchen-card {
          padding: 28px;
        }
        .kc-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .kc-name {
          font-size: 1.25rem;
          margin: 6px 0 2px;
        }
        .kc-code {
          font-size: 0.76rem;
          font-family: monospace;
          color: var(--color-text-muted);
        }
        .kc-address {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .kc-service-info {
          background-color: var(--color-surface-subtle);
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
        }
        .kc-si-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          margin-bottom: 10px;
        }
        .kc-pin-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pin-chip {
          font-size: 0.78rem;
          font-weight: 700;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          color: var(--color-text);
        }
        .kc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }
        .kc-capacity {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .city-guidelines-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }
        .city-guidelines-list li {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
};
