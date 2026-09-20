import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-mark-square">GKK</span>
            <span className="footer-brand-title">GKK Foods</span>
          </div>
          <p className="footer-bio">
            Founded in 2022, GKK Foods operates delivery-first cloud kitchens serving everyday Indian meals designed around home-inspired familiarity, standardized kitchen hygiene, and everyday convenience.
          </p>
          <div className="footer-meta-pill">
            <span className="meta-dot"></span>
            Current Live Market: Delhi NCR
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('/')}>Home</button></li>
            <li><button onClick={() => onNavigate('/menu')}>Today’s Menu</button></li>
            <li><button onClick={() => onNavigate('/delhi')}>Delhi Hub</button></li>
            <li><button onClick={() => onNavigate('/locations')}>Locations & Waitlist</button></li>
            <li><button onClick={() => onNavigate('/about')}>About GKK</button></li>
            <li><button onClick={() => onNavigate('/quality')}>Kitchen Standards</button></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="footer-col">
          <h4 className="footer-heading">Compliance & Policy</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('/legal?doc=privacy')}>Privacy Policy <span className="tag-req">DPDP 2023</span></button></li>
            <li><button onClick={() => onNavigate('/legal?doc=terms')}>Terms of Service</button></li>
            <li><button onClick={() => onNavigate('/legal?doc=refunds')}>Refund & Cancellation Policy</button></li>
            <li><button onClick={() => onNavigate('/legal?doc=delivery')}>Delivery Guidelines</button></li>
            <li><button onClick={() => onNavigate('/faq')}>Frequently Asked Questions</button></li>
            <li><button onClick={() => onNavigate('/admin')}>Operations CMS</button></li>
          </ul>
        </div>

        {/* Operational Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">Kitchen Operations</h4>
          <div className="footer-contact-info">
            <p className="contact-item">
              <span className="ci-label">Central Kitchen Facility:</span>
              <span className="ci-val">South / Central Delhi Cloud Facility</span>
              <span className="ci-note">[EXACT FACILITY ADDRESS TO BE PROVIDED BY GKK]</span>
            </p>
            <p className="contact-item">
              <span className="ci-label">Customer Support:</span>
              <span className="ci-val">[OFFICIAL SUPPORT EMAIL TO BE PROVIDED BY GKK]</span>
              <span className="ci-val">[OFFICIAL PHONE TO BE PROVIDED BY GKK]</span>
            </p>
            <p className="contact-item">
              <span className="ci-label">Delivery Windows:</span>
              <span className="ci-val">Lunch & Dinner Operations</span>
              <span className="ci-note">[EXACT DISPATCH CUTOFFS TO BE CONFIRMED BY GKK]</span>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copy-text">
            © {new Date().getFullYear()} GKK Foods. All rights reserved. Branded Cloud-Kitchen Operations.
          </p>
          <div className="compliance-statement">
            <span className="tag-compliance">Factual Brand Standard</span>
            <span>No fabricated reviews, prices, or certifications are displayed on this platform.</span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: #211D1A;
          color: #FAF6F0;
          padding-top: 64px;
          border-top: 1px solid #36302B;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.8fr;
          gap: 40px;
          padding-bottom: 56px;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .brand-mark-square {
          background-color: var(--color-primary);
          color: #FFF;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 5px 8px;
          border-radius: var(--radius-sm);
        }
        .footer-brand-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFF;
        }
        .footer-bio {
          font-size: 0.88rem;
          color: #A3998F;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .footer-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          background-color: #2D2724;
          color: #D6CCC2;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid #3E3732;
        }
        .meta-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #34A853;
        }
        .footer-heading {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #D6CCC2;
          margin-bottom: 18px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links button {
          color: #A3998F;
          font-size: 0.88rem;
          text-align: left;
          transition: color 0.15s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-links button:hover {
          color: #FFFFFF;
        }
        .tag-req {
          font-size: 0.65rem;
          background-color: #3E3732;
          color: #D6CCC2;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .footer-contact-info {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .contact-item {
          display: flex;
          flex-direction: column;
          font-size: 0.84rem;
        }
        .ci-label {
          color: #D6CCC2;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .ci-val {
          color: #A3998F;
        }
        .ci-note {
          font-size: 0.72rem;
          color: #C5441D;
          font-family: monospace;
          margin-top: 2px;
        }
        .footer-bottom {
          border-top: 1px solid #36302B;
          padding: 20px 0;
          background-color: #1A1614;
        }
        .footer-bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #8A8178;
        }
        .compliance-statement {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tag-compliance {
          background-color: #2D2724;
          color: #C5441D;
          border: 1px solid #473B35;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-bottom-inner {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
