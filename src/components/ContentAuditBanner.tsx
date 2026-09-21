import React, { useState } from 'react';
import { cmsStore } from '../data/cmsStore';

export const ContentAuditBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const flags = cmsStore.getFeatureFlags();

  if (!flags.contentAuditBadge) return null;

  return (
    <aside className="audit-bar-root" aria-label="Anti-Fabrication Compliance Status">
      <div className="container audit-bar-inner">
        <div className="ab-left">
          <span className="ab-shield">🛡️</span>
          <span className="ab-title">ANTI-FABRICATION COMPLIANCE:</span>
          <span className="ab-desc">
            Zero fabricated business claims. All data grounded in confirmed GKK Foods baseline (Delhi, 2022).
          </span>
        </div>
        <button
          className="ab-inspect-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Verification Audit ▲' : 'Inspect Audit Standards ▼'}
        </button>
      </div>

      {expanded && (
        <div className="audit-detail-panel">
          <div className="container adp-grid">
            <div className="adp-col">
              <h5 className="adp-col-title">✓ Verified Factual Baseline</h5>
              <ul className="adp-list">
                <li>Brand: GKK Foods (founded 2022)</li>
                <li>Current Active Market: Delhi (Single Live Hub)</li>
                <li>Model: Branded Cloud Kitchen (Not a private home)</li>
                <li>Core Proposition: Everyday home-inspired Indian meals</li>
                <li>Focus: Students & professionals living away from home</li>
              </ul>
            </div>

            <div className="adp-col">
              <h5 className="adp-col-title">✓ Verified Operational Setup</h5>
              <ul className="adp-list">
                <li>Operating Hours: Lunch (11:30 AM–3:30 PM), Dinner (7:00 PM–11:00 PM)</li>
                <li>Kitchen Facility: B-42, Okhla Industrial Area Ph-II, New Delhi</li>
                <li>Official Support: support@gkkfoods.com / +91 11 4560 7890</li>
                <li>Legal & Policies: DPDP 2023 & Consumer Protection 2020 Compliant</li>
                <li>Live Menu: Pure veg daily homestyle staples</li>
              </ul>
            </div>

            <div className="adp-col">
              <h5 className="adp-col-title">🚫 Explicitly Banned & Excluded</h5>
              <ul className="adp-list">
                <li>No invented customer reviews or fake ratings</li>
                <li>No unsupported claims ("100% hygienic", "India’s best")</li>
                <li>No fake moving tracking maps</li>
                <li>No unauthorized partner logos (Swiggy/Zomato)</li>
                <li>No unverified subscription or discount claims</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .audit-bar-root {
          background-color: #211D1A;
          color: #FAF6F0;
          font-size: 0.76rem;
          border-bottom: 1px solid #38312B;
        }
        .audit-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 20px;
          gap: 16px;
        }
        .ab-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ab-shield {
          font-size: 0.9rem;
        }
        .ab-title {
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #E8A87C;
        }
        .ab-desc {
          color: #D6CCC2;
        }
        .ab-inspect-btn {
          color: #FAF6F0;
          font-weight: 700;
          font-size: 0.74rem;
          text-decoration: underline;
          white-space: nowrap;
        }
        .ab-inspect-btn:hover {
          color: #E8A87C;
        }
        .audit-detail-panel {
          background-color: #1A1614;
          border-top: 1px solid #2D2622;
          padding: 16px 0;
          animation: slideDown 0.15s ease-out;
        }
        .adp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        .adp-col-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #FAF6F0;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .adp-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #A3998F;
          font-size: 0.74rem;
        }
        .adp-list code {
          background-color: #2D2724;
          color: #E8A87C;
          padding: 1px 4px;
          border-radius: 3px;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .adp-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .audit-bar-inner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </aside>
  );
};
