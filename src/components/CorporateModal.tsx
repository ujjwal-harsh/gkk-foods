import React, { useState } from 'react';
import { cmsStore } from '../data/cmsStore';

interface CorporateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateModal: React.FC<CorporateModalProps> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi');
  const [approxMealsDaily, setApproxMealsDaily] = useState('20–50 meals');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !email || !phone) return;

    cmsStore.addCorporateLead({
      companyName,
      contactPerson,
      email,
      phone,
      city,
      approxMealsDaily,
      notes
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="text-h3">Talk to GKK for Everyday Office Meals</h3>
            <p className="modal-sub">Everyday home-inspired meals for working teams in Delhi.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close corporate modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Company / Office Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Technologies"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Contact Person *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Daily Meals</label>
                  <select
                    className="form-select"
                    value={approxMealsDaily}
                    onChange={(e) => setApproxMealsDaily(e.target.value)}
                  >
                    <option value="10–25 meals">10–25 meals / day</option>
                    <option value="25–50 meals">25–50 meals / day</option>
                    <option value="50–100 meals">50–100 meals / day</option>
                    <option value="100+ meals">100+ meals / day</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Office Location in Delhi</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Okhla Phase 3 / Connaught Place"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="callout callout-info" style={{ marginTop: '12px' }}>
                GKK provides everyday home-style recurring meal solutions for teams looking for wholesome, non-oily daily food.
              </div>

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary btn-full">
                  Submit Inquiry to GKK Operations
                </button>
              </div>
            </form>
          ) : (
            <div className="corporate-success" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="result-icon-circle success">✓</div>
              <h4 className="result-title">Inquiry Received</h4>
              <p className="result-text">
                Thank you, <strong>{contactPerson}</strong>. Our Delhi operations team will review your office location ({companyName}) and reach out to discuss daily meal dispatch.
              </p>
              <button className="btn btn-secondary btn-full" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
