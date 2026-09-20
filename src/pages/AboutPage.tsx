import React from 'react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="about-page-root">
      <section className="about-hero-section">
        <div className="container">
          <span className="text-eyebrow">Our Story & Proposition</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            Food that feels closer to home.
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px' }}>
            Founded in 2022 in Delhi, GKK Foods operates delivery-first cloud kitchens designed to solve everyday eating for people living away from their hometowns.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container about-body-container">
          {/* Main Narrative */}
          <div className="about-main-text">
            <h2 className="text-h2" style={{ marginBottom: '18px' }}>
              The Challenge of Everyday Eating
            </h2>
            <p className="about-para">
              When people move away from home for college, competitive exams, or office jobs, finding dependable everyday food is a persistent struggle. Restaurant food is prepared for occasional indulgence—heavy on oil, rich in spices, and tiring to eat continuously. Local mess arrangements can often be unpredictable and inconsistent in hygiene.
            </p>
            <p className="about-para">
              GKK Foods was founded in 2022 to provide a reliable answer: <strong>familiar, everyday Indian meals</strong> prepared with the simple balance of home cooking, but delivered with the standard consistency and food safety of an organized cloud-kitchen company.
            </p>

            <div className="callout callout-info" style={{ margin: '32px 0' }}>
              <strong>Important Operating Principle:</strong><br />
              GKK meals are inspired by the comfort and recipes of home cooking, but they are <strong>not cooked in private residences</strong>. We operate standardized, dedicated commercial cloud kitchen facilities built specifically for hygienic food preparation, assembly, and dispatch.
            </div>

            <h2 className="text-h2" style={{ margin: '36px 0 18px' }}>
              Our Customer Focus
            </h2>
            <div className="focus-cards-grid">
              <div className="fc-card gkk-card">
                <h4>Students & Young Adults</h4>
                <p>Living in hostels, PGs, and shared apartments across Delhi without access to home kitchens.</p>
              </div>
              <div className="fc-card gkk-card">
                <h4>Working & WFH Professionals</h4>
                <p>Needing light, digestible, and prompt lunch combinations that sustain long work hours.</p>
              </div>
              <div className="fc-card gkk-card">
                <h4>People Away from Hometowns</h4>
                <p>Anyone longing for simple yellow dal, seasonal dry sabzi, soft phulkas, and comforting khichdi.</p>
              </div>
            </div>

            <h2 className="text-h2" style={{ margin: '36px 0 18px' }}>
              Our Operating Standards
            </h2>
            <p className="about-para">
              GKK’s cloud-kitchen model relies on repeatable, standardized processes rather than ad-hoc cooking:
            </p>
            <ul className="standards-bullets">
              <li><strong>Daily Preparation:</strong> Cooking begins fresh every morning for lunch dispatches and afternoons for dinner dispatches.</li>
              <li><strong>No Artificial Fillers:</strong> Simple home spices, fresh vegetables sourced daily, and whole wheat rotis.</li>
              <li><strong>Tamper-Evident Packaging:</strong> Food-grade sealed meal trays ensuring hygiene and spill prevention during transit.</li>
              <li><strong>Delhi Operational Base:</strong> Operating from central Delhi facilities serving active surrounding PIN codes.</li>
            </ul>

            <div className="about-cta-bar gkk-card" style={{ marginTop: '48px', padding: '32px', textAlign: 'center' }}>
              <h3 className="text-h3" style={{ marginBottom: '10px' }}>Explore What We Cook</h3>
              <p className="text-lead" style={{ fontSize: '0.95rem', marginBottom: '20px' }}>
                Check today’s freshly published meal combos or verify whether our Delhi kitchen reaches your address.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => onNavigate('/menu')}>
                  View Today’s Menu
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate('/delhi')}>
                  Explore Delhi Hub
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .about-body-container {
          max-width: 820px;
        }
        .about-para {
          font-size: 1rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .focus-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }
        .fc-card {
          padding: 20px;
        }
        .fc-card h4 {
          font-size: 0.98rem;
          margin-bottom: 6px;
        }
        .fc-card p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
        }
        .standards-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .standards-bullets li {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          padding-left: 24px;
          position: relative;
        }
        .standards-bullets li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--color-veg);
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .focus-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
