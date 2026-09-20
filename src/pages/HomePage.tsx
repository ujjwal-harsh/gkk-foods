import React, { useState, useEffect } from 'react';
import { cmsStore } from '../data/cmsStore';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenServiceability: () => void;
  onOpenProduct: (product: Product, price: number, isSoldOut: boolean) => void;
  onOpenCorporate: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenServiceability,
  onOpenProduct,
  onOpenCorporate
}) => {
  const [menuData, setMenuData] = useState(cmsStore.getTodaysMenu());
  const [serviceability, setServiceability] = useState(cmsStore.getServiceability());
  const [quickPin, setQuickPin] = useState('');
  const [quickPinResult, setQuickPinResult] = useState<{ checked: boolean; isServiceable: boolean; message: string } | null>(null);

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setMenuData(cmsStore.getTodaysMenu());
      setServiceability(cmsStore.getServiceability());
    });
  }, []);

  const handleQuickPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPin.length !== 6) return;
    const res = cmsStore.checkServiceability('delhi', quickPin);
    setQuickPinResult({
      checked: true,
      isServiceable: res.isServiceable,
      message: res.message
    });
  };

  return (
    <div className="home-page-root">
      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="text-eyebrow">
              <span className="veg-indicator"><span className="veg-indicator-dot" /></span>
              Branded Cloud Kitchen · Delhi Live Hub
            </div>
            <h1 className="text-h1 hero-heading">
              Everyday Indian food, <br />
              <span className="hero-highlight">made to feel familiar.</span>
            </h1>
            <p className="text-lead hero-subtext">
              For days when you’re away from home and miss everyday dal, seasonal sabzi, and soft rotis. Cooked with standardized consistency and hygiene in our Delhi cloud kitchen.
            </p>

            {/* CTAs */}
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('/menu')}>
                Order Today’s Meal &rarr;
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onOpenServiceability}>
                📍 Check Delivery Area
              </button>
            </div>

            {/* Factual Value Props */}
            <div className="hero-trust-row">
              <div className="ht-item">
                <span className="ht-icon">✓</span>
                <span>Standardized Cloud Kitchen</span>
              </div>
              <div className="ht-item">
                <span className="ht-icon">✓</span>
                <span>Everyday Balanced Combos</span>
              </div>
              <div className="ht-item">
                <span className="ht-icon">✓</span>
                <span>Cooked Daily · Pure Veg</span>
              </div>
              <div className="ht-item">
                <span className="ht-icon">✓</span>
                <span>Delhi Central Hub</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="hero-media-wrapper">
            <div className="hero-img-card gkk-card">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80"
                alt="Everyday Indian meal combo with dal, sabzi, roti and rice"
                className="hero-food-img"
              />
              <div className="hero-img-caption">
                <div className="hic-left">
                  <span className="hic-title">Today’s Meal Combo</span>
                  <span className="hic-sub">Yellow Dal Tadka · Seasonal Sabzi · Phulkas · Jeera Rice</span>
                </div>
                <span className="badge badge-veg">100% Pure Veg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHECK SERVICEABILITY INTERACTIVE */}
      <section className="serviceability-bar-section">
        <div className="container">
          <div className="s-bar-card gkk-card">
            <div className="s-bar-text">
              <span className="s-bar-eyebrow">Serviceability Check</span>
              <h3 className="s-bar-title">Does GKK deliver to your area in Delhi?</h3>
              <p className="s-bar-sub">Enter your 6-digit PIN code to verify live kitchen coverage.</p>
            </div>

            <form className="s-bar-form" onSubmit={handleQuickPinSubmit}>
              <div className="s-bar-input-group">
                <input
                  type="text"
                  maxLength={6}
                  className="form-input s-bar-input"
                  placeholder="Enter 6-digit PIN (e.g. 110016)"
                  value={quickPin}
                  onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={quickPin.length !== 6}>
                  Check Delivery
                </button>
              </div>
            </form>
          </div>

          {quickPinResult && (
            <div className={`quick-result-banner ${quickPinResult.isServiceable ? 'qr-success' : 'qr-unserved'}`}>
              <div className="qr-content">
                <strong>{quickPinResult.isServiceable ? '✓ Serviceable: ' : '📍 Notice: '}</strong>
                <span>{quickPinResult.message}</span>
              </div>
              {quickPinResult.isServiceable ? (
                <button className="btn btn-sm btn-primary" onClick={() => onNavigate('/menu')}>
                  Browse Menu & Order
                </button>
              ) : (
                <button className="btn btn-sm btn-secondary" onClick={onOpenServiceability}>
                  Join Area Waitlist
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: TODAY'S MENU */}
      <section className="section-pad menu-preview-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="text-eyebrow">Today’s Fresh Dispatch</span>
              <h2 className="text-h2">Daily-Changing Meal Combinations</h2>
              <p className="text-lead">
                Cooked fresh this morning in our Delhi central facility. Simple, digestible, and consistent.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('/menu')}>
              View Full Menu →
            </button>
          </div>

          {menuData.menu && menuData.items.length > 0 ? (
            <div className="menu-preview-grid">
              {menuData.items.slice(0, 4).map(({ product, price, isSoldOut }) => (
                <div key={product.id} className="meal-card gkk-card">
                  <div className="mc-img-wrap" onClick={() => onOpenProduct(product, price, isSoldOut)}>
                    <img src={product.imageUrl} alt={product.name} className="mc-img" loading="lazy" />
                    <div className="mc-dietary-badge">
                      <span className="veg-indicator"><span className="veg-indicator-dot" /></span>
                    </div>
                    {product.isDemo && (
                      <span className="badge badge-placeholder mc-demo-tag">Sample Item</span>
                    )}
                    {isSoldOut && (
                      <div className="mc-soldout-overlay">Sold Out Today</div>
                    )}
                  </div>

                  <div className="mc-body">
                    <div className="mc-title-line">
                      <h3 className="mc-title" onClick={() => onOpenProduct(product, price, isSoldOut)}>
                        {product.name}
                      </h3>
                      <span className="mc-price">₹{price}</span>
                    </div>

                    <p className="mc-desc">{product.description}</p>

                    {product.includes && product.includes.length > 0 && (
                      <div className="mc-includes">
                        <span className="mc-inc-lbl">Includes: </span>
                        {product.includes.slice(0, 3).join(' · ')}
                        {product.includes.length > 3 ? '…' : ''}
                      </div>
                    )}

                    <div className="mc-footer">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenProduct(product, price, isSoldOut)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isSoldOut}
                        onClick={() => {
                          cmsStore.addToCart(product, price, 1);
                        }}
                      >
                        {isSoldOut ? 'Sold Out' : '+ Add to Order'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="menu-fallback-card gkk-card">
              <div className="mfc-icon">🍲</div>
              <h3 className="mfc-title">Today’s menu is being updated.</h3>
              <p className="mfc-sub">
                Our Delhi kitchen team prepares daily-changing combinations every morning. The fresh menu will be published shortly.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('/about')}>
                Learn About Our Cloud Kitchen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: WHY GKK (THE 5 CORE PILLARS) */}
      <section className="section-pad why-section">
        <div className="container">
          <div className="why-header text-center">
            <span className="text-eyebrow">The GKK Promise</span>
            <h2 className="text-h2">Why everyday eating deserves consistency</h2>
            <p className="text-lead why-sub">
              Restaurant food is often too oily for daily meals. Unorganized mess options can be unpredictable. GKK bridges the gap.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card gkk-card">
              <div className="pillar-num">01</div>
              <h3 className="pillar-title">Home-Style Familiarity</h3>
              <p className="pillar-text">
                Everyday Indian food you don’t get tired of. Familiar yellow dal, seasonal vegetables, hot tawa phulkas, and light khichdi.
              </p>
            </div>

            <div className="pillar-card gkk-card">
              <div className="pillar-num">02</div>
              <h3 className="pillar-title">Cloud Kitchen Consistency</h3>
              <p className="pillar-text">
                Not a private home kitchen. We operate a standardized commercial cloud facility with structured recipes and repeatable portion sizes.
              </p>
            </div>

            <div className="pillar-card gkk-card">
              <div className="pillar-num">03</div>
              <h3 className="pillar-title">Verified Kitchen Hygiene</h3>
              <p className="pillar-text">
                Prepared with daily vegetable washing, clean oils, and zero-compromise kitchen handling. Packed in food-grade sealed boxes.
              </p>
            </div>

            <div className="pillar-card gkk-card">
              <div className="pillar-num">04</div>
              <h3 className="pillar-title">Daily Reliability</h3>
              <p className="pillar-text">
                Prompt dispatch for lunch and dinner. A dependable everyday service for people whose work and studies leave little time to cook.
              </p>
            </div>

            <div className="pillar-card gkk-card">
              <div className="pillar-num">05</div>
              <h3 className="pillar-title">Honest Convenience</h3>
              <p className="pillar-text">
                Direct digital ordering without unnecessary friction. Fast PIN code verification, straightforward checkout, and quick reorder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW ORDERING WORKS */}
      <section className="section-pad how-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="text-eyebrow">Simple 3-Step Flow</span>
            <h2 className="text-h2">How to order your everyday meal</h2>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card gkk-card">
              <div className="step-circle">1</div>
              <h3 className="step-title">Check Delivery PIN</h3>
              <p className="step-text">
                Enter your area PIN code to confirm live kitchen coverage from our Delhi facility.
              </p>
            </div>

            <div className="how-step-card gkk-card">
              <div className="step-circle">2</div>
              <h3 className="step-title">Select Today's Combo</h3>
              <p className="step-text">
                Choose your everyday plate from today's freshly published lunch or dinner combinations.
              </p>
            </div>

            <div className="how-step-card gkk-card">
              <div className="step-circle">3</div>
              <h3 className="step-title">Fresh Dispatch</h3>
              <p className="step-text">
                Your meal is prepared, sealed in tamper-evident containers, and delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHO GKK IS FOR */}
      <section className="section-pad who-section">
        <div className="container">
          <div className="who-grid">
            <div className="who-content">
              <span className="text-eyebrow">Customer Focus</span>
              <h2 className="text-h2">Designed for anyone living away from their hometown</h2>
              <p className="text-lead" style={{ margin: '16px 0 24px' }}>
                When you relocate for studies or work, finding reliable, non-heavy everyday food is one of the hardest challenges. GKK is built specifically around this reality.
              </p>

              <div className="who-audiences">
                <div className="wa-item">
                  <h4>🎓 Students & Hostel Residents</h4>
                  <p>Reliable daily meals that taste like home without the unpredictability of hostel mess catering.</p>
                </div>
                <div className="wa-item">
                  <h4>💼 Working & WFH Professionals</h4>
                  <p>Nutritious, non-sluggish lunch delivered on time to keep you focused through long work days.</p>
                </div>
                <div className="wa-item">
                  <h4>🏢 Teams & Offices</h4>
                  <p>Coordinated lunch dispatches for offices in Delhi seeking consistent, wholesome food.</p>
                </div>
              </div>
            </div>

            <div className="who-media">
              <div className="gkk-card who-quote-card">
                <div className="wqc-quote-mark">“</div>
                <p className="wqc-quote">
                  Familiar Indian meals for days you’re away from home.
                </p>
                <div className="wqc-signature">
                  <strong>GKK Foods</strong>
                  <span>Branded Cloud Kitchen · Est. 2022</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: LOCATION MATRIX */}
      <section className="section-pad locations-preview-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="text-eyebrow">Operating Hubs</span>
              <h2 className="text-h2">Where GKK Operates</h2>
              <p className="text-lead">
                We only claim locations where our kitchen infrastructure is live and operational.
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('/locations')}>
              View All Locations →
            </button>
          </div>

          <div className="cities-preview-grid">
            <div className="city-hub-card gkk-card city-live">
              <div className="chc-header">
                <h3 className="chc-name">Delhi Hub</h3>
                <span className="badge badge-live">Live & Delivering</span>
              </div>
              <p className="chc-desc">
                Central & South Delhi cloud kitchen facility providing everyday lunch and dinner deliveries.
              </p>
              <div className="chc-footer">
                <span className="chc-pin-count">10 Active PIN Codes</span>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/delhi')}>
                  View Delhi Menu & Areas
                </button>
              </div>
            </div>

            <div className="city-hub-card gkk-card city-coming">
              <div className="chc-header">
                <h3 className="chc-name">Indore</h3>
                <span className="badge badge-coming-soon">Coming Soon</span>
              </div>
              <p className="chc-desc">
                Planned expansion hub for student and commercial hubs across Madhya Pradesh.
              </p>
              <div className="chc-footer">
                <button className="btn btn-secondary btn-sm" onClick={onOpenServiceability}>
                  Join Indore Waitlist
                </button>
              </div>
            </div>

            <div className="city-hub-card gkk-card city-coming">
              <div className="chc-header">
                <h3 className="chc-name">Hyderabad & Pune</h3>
                <span className="badge badge-coming-soon">Planned Cities</span>
              </div>
              <p className="chc-desc">
                Identified tech corridor expansion hubs currently in operational planning.
              </p>
              <div className="chc-footer">
                <button className="btn btn-secondary btn-sm" onClick={onOpenServiceability}>
                  Register Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ TEASER */}
      <section className="section-pad faq-teaser-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <span className="text-eyebrow">Clear Answers</span>
            <h2 className="text-h2">Frequently Asked Questions</h2>
          </div>

          <div className="faq-teaser-list">
            <div className="faq-t-item gkk-card">
              <h4>Is GKK food cooked in private residences?</h4>
              <p>
                No. GKK meals are prepared exclusively in standardized commercial cloud kitchens with food-grade equipment and hygiene protocols. Our recipes are inspired by home cooking, but prepared in professional culinary facilities.
              </p>
            </div>
            <div className="faq-t-item gkk-card">
              <h4>Where does GKK currently deliver?</h4>
              <p>
                GKK currently operates in Delhi. Enter your PIN code to check if our central kitchen reaches your doorstep.
              </p>
            </div>
            <div className="faq-t-item gkk-card">
              <h4>Do you have monthly tiffin subscriptions?</h4>
              <p>
                GKK currently operates on a direct on-demand meal model. Subscriptions and recurring meal plans are in planning and will be released when operational logistics are finalized.
              </p>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '32px' }}>
            <button className="btn btn-secondary" onClick={() => onNavigate('/faq')}>
              Read All Questions & Answers →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 9: CALL TO ACTION BANNER */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-card gkk-card">
            <div className="cta-inner-content">
              <h2 className="cta-heading">Ready for an everyday meal that feels like home?</h2>
              <p className="cta-sub">
                Check your PIN code, see today’s lunch or dinner menu, and order directly from our Delhi cloud kitchen.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('/menu')}>
                  Order Today’s Meal
                </button>
                <button className="btn btn-secondary btn-lg" onClick={onOpenCorporate}>
                  Talk to Us for Office Meals
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          padding: 64px 0 80px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }
        .hero-heading {
          margin: 14px 0 18px;
          color: var(--color-text);
        }
        .hero-highlight {
          color: var(--color-primary);
        }
        .hero-subtext {
          max-width: 540px;
          margin-bottom: 32px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .hero-trust-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 18px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }
        .ht-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .ht-icon {
          color: var(--color-veg);
          font-weight: 800;
        }
        .hero-img-card {
          overflow: hidden;
          background-color: var(--color-surface);
        }
        .hero-food-img {
          width: 100%;
          height: 380px;
          object-fit: cover;
        }
        .hero-img-caption {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-surface);
        }
        .hic-title {
          font-size: 0.95rem;
          font-weight: 700;
          display: block;
        }
        .hic-sub {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .serviceability-bar-section {
          margin-top: -36px;
          position: relative;
          z-index: 10;
        }
        .s-bar-card {
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          background-color: var(--color-surface);
        }
        .s-bar-eyebrow {
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-primary);
          font-weight: 700;
          display: block;
          margin-bottom: 2px;
        }
        .s-bar-title {
          font-size: 1.2rem;
        }
        .s-bar-sub {
          font-size: 0.84rem;
          color: var(--color-text-muted);
        }
        .s-bar-form {
          min-width: 340px;
        }
        .s-bar-input-group {
          display: flex;
          gap: 8px;
        }
        .s-bar-input {
          font-size: 0.95rem;
        }
        .quick-result-banner {
          margin-top: 14px;
          padding: 14px 20px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideUp 0.15s ease-out;
        }
        .qr-success {
          background-color: var(--color-veg-light);
          border: 1px solid var(--color-veg-border);
          color: var(--color-veg);
        }
        .qr-unserved {
          background-color: #FEF7E0;
          border: 1px solid #FEEFC3;
          color: #794400;
        }
        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
        }
        .menu-preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        .meal-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mc-img-wrap {
          position: relative;
          height: 180px;
          cursor: pointer;
          background-color: var(--color-surface-subtle);
        }
        .mc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }
        .meal-card:hover .mc-img {
          transform: scale(1.02);
        }
        .mc-dietary-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #FFF;
          padding: 3px 5px;
          border-radius: 4px;
          box-shadow: var(--shadow-subtle);
        }
        .mc-demo-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
        }
        .mc-soldout-overlay {
          position: absolute;
          inset: 0;
          background: rgba(33, 29, 26, 0.7);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .mc-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .mc-title-line {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }
        .mc-title {
          font-size: 1rem;
          cursor: pointer;
          line-height: 1.25;
        }
        .mc-title:hover {
          color: var(--color-primary);
        }
        .mc-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .mc-desc {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
          margin-bottom: 12px;
          flex: 1;
        }
        .mc-includes {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          background-color: var(--color-surface-subtle);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
        }
        .mc-inc-lbl {
          font-weight: 700;
          color: var(--color-text);
        }
        .mc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .menu-fallback-card {
          padding: 48px 24px;
          text-align: center;
          max-width: 520px;
          margin: 0 auto;
        }
        .mfc-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .mfc-title {
          font-size: 1.25rem;
          margin-bottom: 6px;
        }
        .mfc-sub {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }
        .why-section {
          background-color: #F4EFE7;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .text-center {
          text-align: center;
        }
        .why-sub {
          max-width: 600px;
          margin: 12px auto 0;
        }
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
          margin-top: 48px;
        }
        .pillar-card {
          padding: 24px 20px;
        }
        .pillar-num {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 12px;
        }
        .pillar-title {
          font-size: 1.05rem;
          margin-bottom: 8px;
        }
        .pillar-text {
          font-size: 0.84rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
        .how-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .how-step-card {
          padding: 32px 24px;
          text-align: center;
        }
        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          font-size: 1.15rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .step-title {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        .step-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
        .who-section {
          border-top: 1px solid var(--color-border);
        }
        .who-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
        }
        .who-audiences {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .wa-item h4 {
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .wa-item p {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }
        .who-quote-card {
          padding: 40px 32px;
          background-color: #FAF6F0;
          border: 1px solid var(--color-border);
        }
        .wqc-quote-mark {
          font-size: 3.5rem;
          color: var(--color-primary);
          line-height: 1;
          font-family: serif;
        }
        .wqc-quote {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 24px;
          color: var(--color-text);
        }
        .wqc-signature strong {
          display: block;
          font-size: 0.95rem;
        }
        .wqc-signature span {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .cities-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .city-hub-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .chc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .chc-name {
          font-size: 1.2rem;
        }
        .chc-desc {
          font-size: 0.86rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .chc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chc-pin-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .faq-teaser-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .faq-t-item {
          padding: 24px;
        }
        .faq-t-item h4 {
          font-size: 0.98rem;
          margin-bottom: 8px;
        }
        .faq-t-item p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
        .cta-banner-section {
          padding-bottom: 80px;
        }
        .cta-banner-card {
          background-color: #211D1A;
          color: #FAF6F0;
          padding: 56px 40px;
          text-align: center;
          border-radius: var(--radius-lg);
        }
        .cta-heading {
          color: #FFF;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          max-width: 600px;
          margin: 0 auto 14px;
        }
        .cta-sub {
          color: #D6CCC2;
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto 28px;
        }
        .cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        @media (max-width: 1024px) {
          .menu-preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pillars-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .s-bar-card {
            flex-direction: column;
            align-items: stretch;
          }
          .s-bar-form {
            min-width: 0;
          }
        }
        @media (max-width: 768px) {
          .menu-preview-grid,
          .pillars-grid,
          .how-steps-grid,
          .who-grid,
          .cities-preview-grid,
          .faq-teaser-list {
            grid-template-columns: 1fr;
          }
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
