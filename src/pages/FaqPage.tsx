import React, { useState } from 'react';
import { INITIAL_FAQS } from '../data/defaultData';
import { FAQItem } from '../types';

export const FaqPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(INITIAL_FAQS[0].id);

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'about', label: 'About GKK' },
    { key: 'ordering', label: 'Ordering & Reorder' },
    { key: 'delivery', label: 'Delivery & Locations' },
    { key: 'food_quality', label: 'Food & Quality' },
    { key: 'policy', label: 'Policies' }
  ];

  const filteredFaqs = INITIAL_FAQS.filter((f) => {
    if (selectedCat === 'all') return true;
    return f.category === selectedCat;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq-page-root">
      <section className="faq-hero-section">
        <div className="container">
          <span className="text-eyebrow">Clear, Transparent Information</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px' }}>
            Straightforward answers about our everyday meals, cloud kitchen model, and delivery operations in Delhi.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container faq-container">
          {/* Category Filter Pills */}
          <div className="faq-filter-tabs">
            {categories.map((c) => (
              <button
                key={c.key}
                className={`faq-pill ${selectedCat === c.key ? 'active' : ''}`}
                onClick={() => setSelectedCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq: FAQItem) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className={`faq-acc-item gkk-card ${isOpen ? 'acc-open' : ''}`}>
                  <button
                    className="faq-acc-trigger"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.question}</span>
                    <span className="faq-acc-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-acc-content">
                      <p className="faq-ans-text">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .faq-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .faq-container {
          max-width: 820px;
        }
        .faq-filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .faq-pill {
          padding: 8px 16px;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
        }
        .faq-pill:hover {
          border-color: var(--color-border-strong);
        }
        .faq-pill.active {
          background-color: var(--color-primary);
          color: #FFF;
          border-color: var(--color-primary);
        }
        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .faq-acc-item {
          overflow: hidden;
        }
        .faq-acc-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          text-align: left;
          gap: 16px;
        }
        .faq-q-text {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.35;
        }
        .faq-acc-icon {
          font-size: 1.4rem;
          color: var(--color-primary);
          font-weight: bold;
        }
        .faq-acc-content {
          padding: 0 24px 20px;
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
          background-color: var(--color-surface-subtle);
        }
        .faq-ans-text {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};
