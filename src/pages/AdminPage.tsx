import React, { useState, useEffect } from 'react';
import { cmsStore } from '../data/cmsStore';
import {
  Kitchen,
  DailyMenu,
  Order,
  OrderStatus,
  FeatureFlags,
  CorporateLead,
  WaitlistEntry,
  AuditLogEntry
} from '../types';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'kitchens' | 'orders' | 'leads' | 'audit' | 'flags'>('dashboard');

  // Local Reactive State
  const [kitchens, setKitchens] = useState<Kitchen[]>(cmsStore.getKitchens());
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>(cmsStore.getDailyMenus());
  const [orders, setOrders] = useState<Order[]>(cmsStore.getOrders());
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(cmsStore.getWaitlist());
  const [corpLeads, setCorpLeads] = useState<CorporateLead[]>(cmsStore.getCorporateLeads());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(cmsStore.getAuditLogs());
  const [flags, setFlags] = useState<FeatureFlags>(cmsStore.getFeatureFlags());
  const products = cmsStore.getProducts();

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setKitchens(cmsStore.getKitchens());
      setDailyMenus(cmsStore.getDailyMenus());
      setOrders(cmsStore.getOrders());
      setWaitlist(cmsStore.getWaitlist());
      setCorpLeads(cmsStore.getCorporateLeads());
      setAuditLogs(cmsStore.getAuditLogs());
      setFlags(cmsStore.getFeatureFlags());
    });
  }, []);

  // Today's Menu helper
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMenu = dailyMenus.find((m) => m.date === todayStr && m.kitchenId === kitchens[0]?.id) || dailyMenus[0];

  // Tab Handlers
  const toggleMenuPublish = () => {
    if (!currentMenu) return;
    cmsStore.updateDailyMenu({
      ...currentMenu,
      published: !currentMenu.published
    });
  };

  const toggleItemSoldOut = (productId: string) => {
    if (!currentMenu) return;
    const updatedItems = currentMenu.items.map((i) => {
      if (i.productId === productId) {
        return { ...i, isSoldOut: !i.isSoldOut };
      }
      return i;
    });
    cmsStore.updateDailyMenu({
      ...currentMenu,
      items: updatedItems
    });
  };

  const updateItemPrice = (productId: string, newPrice: number) => {
    if (!currentMenu || newPrice <= 0) return;
    const updatedItems = currentMenu.items.map((i) => {
      if (i.productId === productId) {
        return { ...i, price: newPrice };
      }
      return i;
    });
    cmsStore.updateDailyMenu({
      ...currentMenu,
      items: updatedItems
    });
  };

  const updateKitchenStatus = (kitchenId: string, status: any) => {
    const k = kitchens.find((x) => x.id === kitchenId);
    if (!k) return;
    cmsStore.updateKitchen({ ...k, status });
  };

  const [newPin, setNewPin] = useState('');
  const addPinCode = (kitchenId: string) => {
    if (!newPin || newPin.length !== 6) return;
    const k = kitchens.find((x) => x.id === kitchenId);
    if (!k || k.serviceablePinCodes.includes(newPin)) return;
    cmsStore.updateKitchen({
      ...k,
      serviceablePinCodes: [...k.serviceablePinCodes, newPin]
    });
    setNewPin('');
  };

  const removePinCode = (kitchenId: string, pin: string) => {
    const k = kitchens.find((x) => x.id === kitchenId);
    if (!k) return;
    cmsStore.updateKitchen({
      ...k,
      serviceablePinCodes: k.serviceablePinCodes.filter((p) => p !== pin)
    });
  };

  const handleStatusAdvance = (orderId: string, current: OrderStatus) => {
    const sequence: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const idx = sequence.indexOf(current);
    if (idx > -1 && idx < sequence.length - 1) {
      cmsStore.updateOrderStatus(orderId, sequence[idx + 1]);
    }
  };

  const totalRevenue = orders.filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="admin-page-root">
      {/* Admin Header Bar */}
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <div className="at-left">
            <span className="brand-badge-mark" style={{ fontSize: '0.8rem' }}>GKK</span>
            <div>
              <h1 className="at-title">Operations Command Center & Headless CMS</h1>
              <span className="at-sub">Multi-City Kitchen Routing & Content Governance</span>
            </div>
          </div>
          <div className="at-right">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (confirm('Reset CMS database to initial verified seed state?')) {
                  cmsStore.resetToDefaults();
                }
              }}
            >
              ↺ Reset to Default Seed
            </button>
          </div>
        </div>
      </header>

      {/* Admin Subnav */}
      <div className="admin-subnav">
        <div className="container admin-nav-inner">
          <button
            className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Daily Menu ({currentMenu?.published ? '● Published' : '○ Unpublished'})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'kitchens' ? 'active' : ''}`}
            onClick={() => setActiveTab('kitchens')}
          >
            Kitchens & PIN Routing ({kitchens.length})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders Queue ({orders.length})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            Leads & Demand ({waitlist.length + corpLeads.length})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit Log ({auditLogs.length})
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'flags' ? 'active' : ''}`}
            onClick={() => setActiveTab('flags')}
          >
            Feature Flags
          </button>
        </div>
      </div>

      <main className="admin-main container">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="admin-tab-pane">
            <div className="kpi-grid">
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Active Orders</span>
                <span className="kpi-value">{orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}</span>
                <span className="kpi-sub">{orders.length} total orders recorded</span>
              </div>
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Total Order Revenue</span>
                <span className="kpi-value">₹{totalRevenue}</span>
                <span className="kpi-sub">Direct digital checkout</span>
              </div>
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Active Cloud Kitchens</span>
                <span className="kpi-value">{kitchens.filter((k) => k.status === 'ACTIVE').length} / {kitchens.length}</span>
                <span className="kpi-sub">Delhi Central Hub</span>
              </div>
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Serviceable PIN Codes</span>
                <span className="kpi-value">{kitchens[0]?.serviceablePinCodes.length || 0}</span>
                <span className="kpi-sub">Delhi NCR delivery zone</span>
              </div>
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Expansion Waitlist Leads</span>
                <span className="kpi-value">{waitlist.length}</span>
                <span className="kpi-sub">Demand tracking for new hubs</span>
              </div>
              <div className="kpi-card gkk-card">
                <span className="kpi-label">Corporate Inquiries</span>
                <span className="kpi-value">{corpLeads.length}</span>
                <span className="kpi-sub">Office meal programs</span>
              </div>
            </div>

            {/* Operational Snapshot */}
            <div className="admin-split-2" style={{ marginTop: '28px' }}>
              <div className="gkk-card" style={{ padding: '24px' }}>
                <h3 className="text-h3" style={{ marginBottom: '14px' }}>Today's Kitchen Menu Status</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <strong>Date: {todayStr} (Delhi Central)</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                      {currentMenu?.items.length || 0} dishes listed · {currentMenu?.items.filter((i) => i.isSoldOut).length || 0} marked sold out
                    </div>
                  </div>
                  <span className={`badge ${currentMenu?.published ? 'badge-live' : 'badge-coming-soon'}`}>
                    {currentMenu?.published ? 'Published to Customers' : 'Hidden (Menu Updating)'}
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '16px' }}
                  onClick={() => setActiveTab('menu')}
                >
                  Manage Menu & Pricing →
                </button>
              </div>

              <div className="gkk-card" style={{ padding: '24px' }}>
                <h3 className="text-h3" style={{ marginBottom: '14px' }}>Content & Kitchen Governance</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  All kitchen facility, regulatory, and menu records are verified and live. Operating parameters and meal dispatches adhere strictly to GKK Foods commercial standards.
                </p>
                <div className="badge badge-verified">Verified Operational Data</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU SCHEDULER */}
        {activeTab === 'menu' && (
          <div className="admin-tab-pane">
            <div className="tab-actions-bar">
              <div>
                <h2 className="text-h2" style={{ fontSize: '1.35rem' }}>Daily Menu & Live Price Engine</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Control today's meal publication, live item availability, and prices for Delhi Central Kitchen.
                </p>
              </div>
              <button
                className={`btn ${currentMenu?.published ? 'btn-secondary' : 'btn-primary'}`}
                onClick={toggleMenuPublish}
              >
                {currentMenu?.published ? 'Unpublish Menu (Show "Updating" fallback)' : 'Publish Menu to Live Site'}
              </button>
            </div>

            <div className="gkk-card admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Dish / Meal Combo</th>
                    <th>Diet</th>
                    <th>Price (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMenu?.items.map((item) => {
                    const prod = products.find((p) => p.id === item.productId);
                    if (!prod) return null;
                    return (
                      <tr key={item.productId} className={item.isSoldOut ? 'row-soldout' : ''}>
                        <td>
                          <strong>{prod.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {prod.includes?.slice(0, 3).join(', ')}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-veg">Pure Veg</span>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input table-price-input"
                            defaultValue={item.price}
                            onBlur={(e) => updateItemPrice(item.productId, parseInt(e.target.value) || item.price)}
                          />
                        </td>
                        <td>
                          <span className={`badge ${item.isSoldOut ? 'badge-cancelled' : 'badge-live'}`}>
                            {item.isSoldOut ? 'Sold Out' : 'Available'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleItemSoldOut(item.productId)}
                          >
                            {item.isSoldOut ? 'Mark In Stock' : 'Mark Sold Out'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KITCHENS & PIN ROUTING */}
        {activeTab === 'kitchens' && (
          <div className="admin-tab-pane">
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              Kitchen Hubs & Serviceable PIN Routing
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Add or remove serviceable PIN codes instantly without modifying frontend code.
            </p>

            {kitchens.map((k) => (
              <div key={k.id} className="gkk-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 className="text-h3">{k.name} ({k.code})</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{k.address}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                    <select
                      className="form-select"
                      style={{ width: 'auto' }}
                      value={k.status}
                      onChange={(e) => updateKitchenStatus(k.id, e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE (Cooking & Delivering)</option>
                      <option value="BUSY">BUSY (High Demand)</option>
                      <option value="TEMPORARILY_CLOSED">TEMPORARILY CLOSED</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                {/* PIN Codes Chips & Add Input */}
                <div style={{ background: 'var(--color-surface-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                    Active Serviceable PIN Codes ({k.serviceablePinCodes.length}):
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    {k.serviceablePinCodes.map((pin) => (
                      <span key={pin} className="pin-tag-removable">
                        <span>{pin}</span>
                        <button onClick={() => removePinCode(k.id, pin)} title="Remove PIN">✕</button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', maxWidth: '300px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      className="form-input"
                      placeholder="Add 6-digit PIN"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => addPinCode(k.id)} disabled={newPin.length !== 6}>
                      + Add PIN
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div className="admin-tab-pane">
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              Live Order Queue & Fulfillment
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Advance real kitchen operational stages. Updates customer status screens in real-time.
            </p>

            {orders.length === 0 ? (
              <div className="empty-account-box gkk-card">
                <p>No customer orders placed yet. Place an order on the website to test live fulfillment tracking.</p>
              </div>
            ) : (
              <div className="gkk-card admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Destination</th>
                      <th>Items & Total</th>
                      <th>Status</th>
                      <th>Advance Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.orderNumber}</strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {new Date(o.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td>
                          <div>{o.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{o.customerPhone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.84rem' }}>{o.deliveryAddress.locality} (PIN {o.deliveryAddress.pinCode})</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{o.deliveryAddress.flatHouse}</div>
                        </td>
                        <td>
                          <strong>₹{o.totalAmount}</strong> ({o.paymentMethod})
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {o.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${o.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-live'}`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusAdvance(o.id, o.status)}
                            >
                              Next Stage →
                            </button>
                          )}
                          {o.status === 'DELIVERED' && <span style={{ color: 'var(--color-veg)', fontWeight: 700 }}>✓ Done</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LEADS & DEMAND HEATMAP */}
        {activeTab === 'leads' && (
          <div className="admin-tab-pane">
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              Customer Demand & B2B Inquiries
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Captured waitlist records from unserved PIN codes and corporate office meal inquiries.
            </p>

            <div className="admin-split-2">
              {/* Expansion Waitlist */}
              <div className="gkk-card" style={{ padding: '24px' }}>
                <h3 className="text-h3" style={{ marginBottom: '12px' }}>Area Waitlist Entries ({waitlist.length})</h3>
                {waitlist.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No waitlist submissions yet.</p>
                ) : (
                  <div className="leads-list">
                    {waitlist.map((w) => (
                      <div key={w.id} className="lead-item">
                        <div>
                          <strong>PIN {w.pinCode} ({w.city})</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Contact: {w.contact} · {new Date(w.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <span className="badge badge-veg">Consent Logged</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Corporate Inquiries */}
              <div className="gkk-card" style={{ padding: '24px' }}>
                <h3 className="text-h3" style={{ marginBottom: '12px' }}>Corporate Meal Leads ({corpLeads.length})</h3>
                {corpLeads.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No corporate inquiries logged yet.</p>
                ) : (
                  <div className="leads-list">
                    {corpLeads.map((c) => (
                      <div key={c.id} className="lead-item">
                        <div>
                          <strong>{c.companyName} ({c.contactPerson})</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {c.email} · {c.phone} · Est: {c.approxMealsDaily}
                          </div>
                          {c.notes && <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>“{c.notes}”</div>}
                        </div>
                        <span className="badge badge-live">{c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="admin-tab-pane">
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              Immutable Administrative Audit Log
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Every sensitive operational modification, status update, and price change is tracked here.
            </p>

            <div className="gkk-card admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Entity ID</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td><strong>{log.adminUser}</strong></td>
                      <td><code>{log.action}</code></td>
                      <td>{log.entity}</td>
                      <td style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{log.entityId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: FEATURE FLAGS */}
        {activeTab === 'flags' && (
          <div className="admin-tab-pane">
            <h2 className="text-h2" style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              Operational Feature Flags
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Safely launch or hide features across the consumer website without code redeployment.
            </p>

            <div className="gkk-card" style={{ padding: '24px', maxWidth: '640px' }}>
              <div className="flags-list">
                {Object.entries(flags).map(([key, val]) => (
                  <div key={key} className="flag-row">
                    <div>
                      <strong>{key}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {key === 'subscriptions'
                          ? 'Flagged FALSE: GKK has not launched subscriptions yet'
                          : key === 'liveTracking'
                          ? 'Flagged FALSE: No simulated maps; factual status tracking only'
                          : 'Operational feature switch'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => {
                        cmsStore.updateFeatureFlags({
                          ...flags,
                          [key]: e.target.checked
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-page-root {
          background-color: #FAF6F0;
          min-height: 100vh;
          padding-bottom: 60px;
        }
        .admin-topbar {
          background-color: #211D1A;
          color: #FFF;
          padding: 16px 0;
          border-bottom: 1px solid #36302B;
        }
        .admin-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .at-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .at-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFF;
        }
        .at-sub {
          font-size: 0.76rem;
          color: #A3998F;
          display: block;
        }
        .admin-subnav {
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-nav-inner {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          padding: 8px 20px;
        }
        .admin-nav-tab {
          padding: 8px 14px;
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          border-radius: var(--radius-sm);
          white-space: nowrap;
        }
        .admin-nav-tab:hover {
          background-color: var(--color-surface-subtle);
          color: var(--color-text);
        }
        .admin-nav-tab.active {
          background-color: var(--color-primary);
          color: #FFF;
        }
        .admin-main {
          margin-top: 32px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .kpi-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .kpi-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        .kpi-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-text);
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .kpi-sub {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
        }
        .admin-split-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .tab-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .admin-table-card {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
          text-align: left;
        }
        .admin-table th, .admin-table td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--color-border);
        }
        .admin-table th {
          background-color: var(--color-surface-subtle);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }
        .table-price-input {
          width: 80px;
          padding: 6px 8px;
        }
        .row-soldout {
          opacity: 0.6;
          background-color: #FAF5F2;
        }
        .pin-tag-removable {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFF;
          border: 1px solid var(--color-border);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
        }
        .pin-tag-removable button {
          font-size: 0.75rem;
          color: var(--color-error);
        }
        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lead-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px;
          background-color: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .flags-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .flag-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--color-border);
        }
        .flag-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .flag-row input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .kpi-grid, .admin-split-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
