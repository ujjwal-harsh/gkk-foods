import React, { useState } from 'react';
import { cmsStore } from '../data/cmsStore';

interface ServiceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ServiceabilityModal: React.FC<ServiceabilityModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [pinCode, setPinCode] = useState('');
  const [locality, setLocality] = useState('');
  const [result, setResult] = useState<{
    checked: boolean;
    isServiceable: boolean;
    message: string;
  } | null>(null);

  // Waitlist State
  const [waitlistContact, setWaitlistContact] = useState('');
  const [waitlistConsent, setWaitlistConsent] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  if (!isOpen) return null;

  const cities = cmsStore.getCities();

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;

    const res = cmsStore.checkServiceability(selectedCity, pinCode, locality);
    setResult({
      checked: true,
      isServiceable: res.isServiceable,
      message: res.message
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        // Delhi default fallback simulation if coordinates are within NCR
        setPinCode('110016');
        setLocality('Hauz Khas Area');
        const res = cmsStore.checkServiceability('delhi', '110016', 'Hauz Khas Area');
        setResult({
          checked: true,
          isServiceable: res.isServiceable,
          message: res.message
        });
      },
      () => {
        setGpsLoading(false);
        alert('Could not access location. Please enter your 6-digit PIN code manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistContact.trim()) return;

    cmsStore.addWaitlist(selectedCity, pinCode, locality, waitlistContact, waitlistConsent);
    setWaitlistSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-h3">Check Delivery in Your Area</h3>
            <p className="modal-sub">Confirm whether GKK cloud kitchens currently serve your address.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!result?.checked ? (
            <form onSubmit={handleCheck}>
              {/* City Selection */}
              <div className="form-group">
                <label className="form-label">Select City</label>
                <select
                  className="form-select"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setResult(null);
                  }}
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} {c.status === 'LIVE' ? '(Operational)' : '(Coming Soon)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* PIN Code Input */}
              <div className="form-group">
                <label className="form-label">
                  Delivery PIN Code <span className="pin-hint">(e.g. 110016 for Hauz Khas / Delhi)</span>
                </label>
                <div className="pin-input-wrap">
                  <input
                    type="text"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className="form-input"
                    placeholder="Enter 6-digit PIN code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                  <button
                    type="button"
                    className="gps-detect-btn"
                    onClick={handleDetectLocation}
                    disabled={gpsLoading}
                    title="Detect location automatically"
                  >
                    {gpsLoading ? 'Detecting…' : '📍 Use GPS'}
                  </button>
                </div>
              </div>

              {/* Locality Input (Optional) */}
              <div className="form-group">
                <label className="form-label">
                  Area / Locality <span className="optional">(optional)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Green Park, South Ext, Saket"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary btn-full" disabled={pinCode.length !== 6}>
                  Check Serviceability
                </button>
              </div>
            </form>
          ) : result.isServiceable ? (
            /* Serviceable Confirmation State */
            <div className="result-box result-success">
              <div className="result-icon-circle success">✓</div>
              <h4 className="result-title">Good news. GKK delivers to your area!</h4>
              <p className="result-text">{result.message}</p>

              <div className="service-pills">
                <span className="badge badge-veg">100% Pure Veg & Everyday Staples</span>
                <span className="badge badge-live">Active Kitchen Hub</span>
              </div>

              <div className="result-cta-group">
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => {
                    onClose();
                    if (onSuccess) onSuccess();
                  }}
                >
                  View Today’s Menu
                </button>
                <button className="btn btn-secondary btn-full" onClick={() => setResult(null)}>
                  Check Another PIN Code
                </button>
              </div>
            </div>
          ) : (
            /* Not Serviceable / Waitlist State */
            <div className="result-box result-unserviceable">
              <div className="result-icon-circle unserved">📍</div>
              <h4 className="result-title">We’re not delivering here yet</h4>
              <p className="result-text">{result.message}</p>

              {!waitlistSubmitted ? (
                <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
                  <p className="waitlist-prompt">
                    Tell us where you’d like GKK to come next. We track high-demand PIN codes to plan our next cloud kitchen locations.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Phone or Email for Launch Updates</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter mobile number or email"
                      value={waitlistContact}
                      onChange={(e) => setWaitlistContact(e.target.value)}
                      required
                    />
                  </div>
                  <label className="consent-label">
                    <input
                      type="checkbox"
                      checked={waitlistConsent}
                      onChange={(e) => setWaitlistConsent(e.target.checked)}
                      required
                    />
                    <span>I agree to receive a one-time notification when GKK launches in PIN code {pinCode}.</span>
                  </label>

                  <div className="result-cta-group">
                    <button type="submit" className="btn btn-primary btn-full" disabled={!waitlistConsent}>
                      Notify Me at Launch
                    </button>
                    <button type="button" className="btn btn-secondary btn-full" onClick={() => setResult(null)}>
                      Try Another Area
                    </button>
                  </div>
                </form>
              ) : (
                <div className="waitlist-confirmed">
                  <span className="badge badge-live">Waitlist Registered</span>
                  <p className="wc-text">
                    Thank you. We have recorded your interest for PIN <strong>{pinCode}</strong> ({selectedCity}). We’ll notify you as soon as our kitchen hub opens nearby.
                  </p>
                  <button className="btn btn-secondary btn-full" onClick={onClose}>
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-sub {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          margin-top: 2px;
        }
        .modal-close-btn {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
        }
        .modal-close-btn:hover {
          background-color: var(--color-surface-subtle);
          color: var(--color-text);
        }
        .pin-hint {
          font-weight: 400;
          color: var(--color-text-muted);
          font-size: 0.78rem;
        }
        .pin-input-wrap {
          display: flex;
          gap: 8px;
        }
        .gps-detect-btn {
          padding: 0 14px;
          font-size: 0.82rem;
          font-weight: 600;
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          white-space: nowrap;
        }
        .gps-detect-btn:hover {
          border-color: var(--color-border-strong);
        }
        .modal-actions {
          margin-top: 22px;
        }
        .result-box {
          text-align: center;
          padding: 8px 0;
        }
        .result-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .result-icon-circle.success {
          background-color: var(--color-veg-light);
          color: var(--color-veg);
        }
        .result-icon-circle.unserved {
          background-color: var(--color-surface-sunken);
          color: var(--color-text-secondary);
        }
        .result-title {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .result-text {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .service-pills {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .result-cta-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .waitlist-prompt {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 16px;
          text-align: left;
        }
        .consent-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          margin-bottom: 20px;
          text-align: left;
          cursor: pointer;
        }
        .consent-label input {
          margin-top: 3px;
        }
        .waitlist-confirmed {
          padding: 16px 0;
        }
        .wc-text {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin: 16px 0 24px;
        }
      `}</style>
    </div>
  );
};
