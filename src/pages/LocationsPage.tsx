import React from 'react';
import { cmsStore } from '../data/cmsStore';

interface LocationsPageProps {
  onNavigate: (path: string) => void;
  onOpenServiceability: () => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({
  onNavigate,
  onOpenServiceability
}) => {
  const cities = cmsStore.getCities();
  const liveCities = cities.filter((c) => c.status === 'LIVE');
  const comingSoonCities = cities.filter((c) => c.status === 'COMING_SOON');

  return (
    <div className="locations-page-root">
      <section className="locations-hero-section">
        <div className="container">
          <span className="text-eyebrow">Operational Geographic Footprint</span>
          <h1 className="text-h1" style={{ margin: '12px 0 16px' }}>
            Where GKK Foods Delivers
          </h1>
          <p className="text-lead" style={{ maxWidth: '640px' }}>
            We only claim locations where our cloud kitchen infrastructure is fully operational. If we are not in your city yet, you can register for launch alerts.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          {/* Live Cities Section */}
          <div className="loc-group-block">
            <div className="loc-group-header">
              <h2 className="text-h2">Operational Cities (Live)</h2>
              <p className="text-lead">Full daily lunch and dinner meal delivery available.</p>
            </div>

            <div className="loc-cards-grid">
              {liveCities.map((city) => (
                <div key={city.id} className="loc-full-card gkk-card live-card">
                  <div className="lfc-top">
                    <div>
                      <span className="badge badge-live">● Live Delivering</span>
                      <h3 className="lfc-city-name">{city.name}</h3>
                      <span className="lfc-state">{city.state}</span>
                    </div>
                  </div>

                  <p className="lfc-desc">{city.description}</p>

                  <div className="lfc-callout">
                    <span>Central Delhi Kitchen Hub: Serving 10 Active PIN Codes</span>
                  </div>

                  <div className="lfc-footer">
                    <button className="btn btn-secondary btn-sm" onClick={onOpenServiceability}>
                      Check Specific PIN Code
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => onNavigate(`/delhi`)}>
                      View Delhi Hub & Menu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Expansion Cities */}
          <div className="loc-group-block" style={{ marginTop: '56px' }}>
            <div className="loc-group-header">
              <h2 className="text-h2">Planned Expansion Cities</h2>
              <p className="text-lead">
                Kitchen facilities currently being planned or scouted. Register your interest to help us prioritize specific neighborhoods.
              </p>
            </div>

            <div className="loc-cards-grid">
              {comingSoonCities.map((city) => (
                <div key={city.id} className="loc-full-card gkk-card coming-card">
                  <div className="lfc-top">
                    <div>
                      <span className="badge badge-coming-soon">Coming Soon</span>
                      <h3 className="lfc-city-name">{city.name}</h3>
                      <span className="lfc-state">{city.state}</span>
                    </div>
                  </div>

                  <p className="lfc-desc">{city.description}</p>

                  <div className="lfc-callout unserved-callout">
                    <span>Kitchen Facility Status: In Planning / Site Identification</span>
                  </div>

                  <div className="lfc-footer">
                    <button className="btn btn-secondary btn-full" onClick={onOpenServiceability}>
                      Join {city.name} Launch Waitlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .locations-hero-section {
          padding: 56px 0 60px;
          background: linear-gradient(180deg, #FAF6F0 0%, #F5EFE6 100%);
          border-bottom: 1px solid var(--color-border);
        }
        .loc-group-header {
          margin-bottom: 28px;
        }
        .loc-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .loc-full-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .live-card {
          border-left: 4px solid var(--color-veg);
        }
        .coming-card {
          border-left: 4px solid var(--color-accent-amber);
        }
        .lfc-top {
          margin-bottom: 14px;
        }
        .lfc-city-name {
          font-size: 1.45rem;
          margin: 8px 0 2px;
        }
        .lfc-state {
          font-size: 0.84rem;
          color: var(--color-text-muted);
        }
        .lfc-desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 20px;
        }
        .lfc-callout {
          background-color: var(--color-surface-subtle);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 24px;
          border: 1px solid var(--color-border);
        }
        .unserved-callout {
          color: var(--color-text-secondary);
          font-weight: 400;
        }
        .lfc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border);
        }
        @media (max-width: 768px) {
          .loc-cards-grid {
            grid-template-columns: 1fr;
          }
          .lfc-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};
