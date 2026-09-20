import React, { useState } from 'react';

export const LegalPage: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms' | 'refunds' | 'delivery'>('privacy');

  return (
    <div className="legal-page-root">
      <section className="legal-hero-section">
        <div className="container">
          <div className="badge badge-placeholder" style={{ marginBottom: '12px' }}>
            STATUS: LEGAL REVIEW REQUIRED PRIOR TO COMMERCIAL EXPANSION
          </div>
          <h1 className="text-h1" style={{ margin: '8px 0 14px' }}>
            Compliance, Governance & Policies
          </h1>
          <p className="text-lead" style={{ maxWidth: '680px' }}>
            Transparency principles governing GKK Foods digital ordering platform, data protection under India’s DPDP Act 2023, and operational dispatch rules.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container legal-container">
          <div className="legal-nav-tabs">
            <button
              className={`legal-tab-btn ${activeDoc === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveDoc('privacy')}
            >
              Privacy Policy (DPDP 2023)
            </button>
            <button
              className={`legal-tab-btn ${activeDoc === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveDoc('terms')}
            >
              Terms of Service
            </button>
            <button
              className={`legal-tab-btn ${activeDoc === 'refunds' ? 'active' : ''}`}
              onClick={() => setActiveDoc('refunds')}
            >
              Refunds & Cancellations
            </button>
            <button
              className={`legal-tab-btn ${activeDoc === 'delivery' ? 'active' : ''}`}
              onClick={() => setActiveDoc('delivery')}
            >
              Delivery & Kitchen Standards
            </button>
          </div>

          <div className="legal-doc-content gkk-card">
            {activeDoc === 'privacy' && (
              <div>
                <div className="badge badge-placeholder" style={{ marginBottom: '16px' }}>
                  DRAFT FRAMEWORK · PENDING GKK LEGAL COUNSEL APPROVAL
                </div>
                <h2 className="text-h2" style={{ marginBottom: '14px' }}>Privacy Policy</h2>
                <p className="legal-p">
                  GKK Foods ("we", "our", "us") values customer privacy. In compliance with the Digital Personal Data Protection Act (DPDP Act, 2023) and Information Technology Act, 2000:
                </p>
                <h4 className="legal-h4">1. Data Collected Solely for Operational Fulfillment</h4>
                <p className="legal-p">
                  We collect strictly necessary customer information: Name, delivery address, contact phone number, and optional delivery notes to prepare and dispatch your everyday meals.
                </p>
                <h4 className="legal-h4">2. What We Never Do</h4>
                <p className="legal-p">
                  We do not sell customer personal records to third-party advertisers. Payment transactions are processed via secure PCI-DSS compliant banking channels; GKK does not store raw credit card credentials on its local servers.
                </p>
                <h4 className="legal-h4">3. Waitlist Communications</h4>
                <p className="legal-p">
                  Users registering interest for unserved PIN codes or planned expansion cities receive notifications solely regarding service availability in their designated area.
                </p>
              </div>
            )}

            {activeDoc === 'terms' && (
              <div>
                <div className="badge badge-placeholder" style={{ marginBottom: '16px' }}>
                  DRAFT FRAMEWORK · PENDING GKK LEGAL COUNSEL APPROVAL
                </div>
                <h2 className="text-h2" style={{ marginBottom: '14px' }}>Terms of Service</h2>
                <p className="legal-p">
                  By accessing the GKK Foods digital ordering platform and purchasing everyday meals, customers agree to the operational conditions below:
                </p>
                <h4 className="legal-h4">1. Food Preparation & Cloud Kitchen Model</h4>
                <p className="legal-p">
                  All meals are prepared in commercial cloud kitchen facilities operated by or affiliated with GKK Foods. Meals are inspired by home recipes but produced under commercial food handling protocols.
                </p>
                <h4 className="legal-h4">2. Daily Menu Changes</h4>
                <p className="legal-p">
                  GKK operates on a daily-changing meal format. Item availability is subject to real-time kitchen inventory and daily preparation quotas.
                </p>
              </div>
            )}

            {activeDoc === 'refunds' && (
              <div>
                <div className="badge badge-placeholder" style={{ marginBottom: '16px' }}>
                  DRAFT FRAMEWORK · PENDING GKK LEGAL COUNSEL APPROVAL
                </div>
                <h2 className="text-h2" style={{ marginBottom: '14px' }}>Refund & Cancellation Policy</h2>
                <p className="legal-p">
                  [OFFICIAL REFUND & CANCELLATION POLICY TO BE PROVIDED BY GKK OPERATIONS]
                </p>
                <h4 className="legal-h4">Baseline Operational Rules:</h4>
                <ul className="legal-list">
                  <li>Orders cancelled while still in the "Placed" status before kitchen prep begins are eligible for full cancellation.</li>
                  <li>Once cooking and packing have commenced ("Preparing" status), cancellations cannot be accepted due to the perishable nature of fresh food.</li>
                  <li>In the event of verified transit spillages or incorrect meal dispatch, customer support reviews and processes appropriate credits or refunds to the original payment source.</li>
                </ul>
              </div>
            )}

            {activeDoc === 'delivery' && (
              <div>
                <div className="badge badge-placeholder" style={{ marginBottom: '16px' }}>
                  DRAFT FRAMEWORK · PENDING GKK LEGAL COUNSEL APPROVAL
                </div>
                <h2 className="text-h2" style={{ marginBottom: '14px' }}>Delivery Guidelines</h2>
                <p className="legal-p">
                  GKK deliveries are dispatched within mapped serviceable PIN codes from our Delhi cloud kitchen hubs.
                </p>
                <h4 className="legal-h4">1. Delivery Radii & Zones</h4>
                <p className="legal-p">
                  Delivery charges and dispatch times are determined by zone distance from the assigned kitchen facility.
                </p>
                <h4 className="legal-h4">2. Tamper-Evident Packaging</h4>
                <p className="legal-p">
                  All meals are sealed at our kitchen. Customers are advised not to accept packages if the security seal has been broken or tampered with.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .legal-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .legal-container {
          max-width: 860px;
        }
        .legal-nav-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .legal-tab-btn {
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
        }
        .legal-tab-btn:hover {
          border-color: var(--color-border-strong);
        }
        .legal-tab-btn.active {
          background-color: var(--color-primary);
          color: #FFF;
          border-color: var(--color-primary);
        }
        .legal-doc-content {
          padding: 40px;
        }
        .legal-p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin-bottom: 18px;
        }
        .legal-h4 {
          font-size: 1.05rem;
          margin: 22px 0 8px;
          color: var(--color-text);
        }
        .legal-list {
          list-style: disc;
          padding-left: 24px;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .legal-doc-content {
            padding: 24px 18px;
          }
        }
      `}</style>
    </div>
  );
};
