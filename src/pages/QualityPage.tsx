import React from 'react';

export const QualityPage: React.FC = () => {
  return (
    <div className="quality-page-root">
      <section className="quality-hero-section">
        <div className="container">
          <span className="text-eyebrow">Kitchen Standards & Food Safety</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            Hygiene & Preparation Standards
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px' }}>
            How GKK approaches daily ingredient handling, commercial kitchen sanitization, and food-grade packaging.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container quality-body-container">
          {/* Factual Core Pillars */}
          <div className="q-pillars-list">
            <div className="q-pillar-item gkk-card">
              <div className="qpi-header">
                <span className="qpi-icon">🥬</span>
                <h3 className="text-h3">1. Daily Sourcing & Ingredient Handling</h3>
              </div>
              <p className="qpi-text">
                Vegetables are procured fresh for daily cooking cycles rather than bulk cold-stored over weeks. Produce is thoroughly washed and sorted before prep. We cook with standard culinary oils at balanced levels—deliberately avoiding heavy restaurant gravies.
              </p>
            </div>

            <div className="q-pillar-item gkk-card">
              <div className="qpi-header">
                <span className="qpi-icon">🧼</span>
                <h3 className="text-h3">2. Dedicated Cloud Kitchen Environment</h3>
              </div>
              <p className="qpi-text">
                Our operations take place in dedicated commercial cloud kitchen units with stainless-steel prep surfaces, high-temperature utensil sanitization, and segregated cooking and assembly lines.
              </p>
            </div>

            <div className="q-pillar-item gkk-card">
              <div className="qpi-header">
                <span className="qpi-icon">📦</span>
                <h3 className="text-h3">3. Tamper-Evident Food-Grade Packaging</h3>
              </div>
              <p className="qpi-text">
                Meals are packed hot in food-grade, sealable containers that prevent transit leaks and external contamination. Compartmentalized trays ensure that your dal, sabzi, roti, and rice maintain their individual flavors without mixing.
              </p>
            </div>

            <div className="q-pillar-item gkk-card">
              <div className="qpi-header">
                <span className="qpi-icon">⏱️</span>
                <h3 className="text-h3">4. Timed Cooking & Dispatch Windows</h3>
              </div>
              <p className="qpi-text">
                Cooking is scheduled tightly around daily delivery slots (Lunch and Dinner). Rotis are made in fresh batches and packed promptly to retain softness without turning soggy.
              </p>
            </div>
          </div>

          {/* Governance & Certifications Placeholder Framework */}
          <div className="cert-governance-box gkk-card" style={{ marginTop: '48px', padding: '32px' }}>
            <div className="badge badge-placeholder" style={{ marginBottom: '12px' }}>
              Governance Disclosure
            </div>
            <h3 className="text-h3" style={{ marginBottom: '8px' }}>
              Licenses & Official Food Safety Certifications
            </h3>
            <p className="cert-disclosure-text">
              In accordance with GKK Foods’ factual brand policy, official regulatory registration details and audit certificates are displayed only upon verified corporate filing:
            </p>

            <div className="cert-placeholders-grid">
              <div className="cph-item">
                <span className="cph-label">Central Licensing Authority:</span>
                <span className="cph-val">[FSSAI REGISTRATION NUMBER TO BE PROVIDED BY GKK]</span>
              </div>
              <div className="cph-item">
                <span className="cph-label">Facility Water & Sourcing Audit:</span>
                <span className="cph-val">[INTERNAL KITCHEN AUDIT DOC TO BE UPLOADED BY GKK]</span>
              </div>
              <div className="cph-item">
                <span className="cph-label">Commercial Facility License:</span>
                <span className="cph-val">[LOCAL MUNICIPAL HEALTH TRADE LICENSE PENDING GKK INPUT]</span>
              </div>
            </div>

            <p className="cert-footer-note">
              GKK Foods never displays fabricated certificates, unverified hygiene ratings, or artificial quality badges.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .quality-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .quality-body-container {
          max-width: 820px;
        }
        .q-pillars-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .q-pillar-item {
          padding: 28px;
        }
        .qpi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .qpi-icon {
          font-size: 1.6rem;
        }
        .qpi-text {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          padding-left: 44px;
        }
        .cert-governance-box {
          background-color: var(--color-surface-subtle);
          border: 1px dashed var(--color-border-strong);
        }
        .cert-disclosure-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 20px;
        }
        .cert-placeholders-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .cph-item {
          background: #FFF;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cph-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .cph-val {
          font-family: monospace;
          font-size: 0.78rem;
          color: var(--color-primary);
        }
        .cert-footer-note {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        @media (max-width: 600px) {
          .qpi-text {
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  );
};
