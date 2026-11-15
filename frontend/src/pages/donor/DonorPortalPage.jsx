import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Heart,
  Gift,
  DollarSign,
  Package,
  Truck,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  Download,
  ExternalLink,
  CreditCard,
  Building,
  ArrowRight,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';
import './DonorPortalPage.css';

const RELIEF_PACKAGES = [
  {
    id: 'PKG-01',
    name: 'Displaced Family 7-Day Ration Pack',
    target: '4-5 Person Household',
    cost: 'Rs. 7,500',
    impact: 'Rice, dhal, canned fish, milk powder, biscuits, tea, matches & clean water',
    funded: 840,
    goal: 1200,
    badge: 'Most Urgent'
  },
  {
    id: 'PKG-02',
    name: 'Clean Drinking Water Bowser Delivery',
    target: '500 Flood-Stranded Citizens',
    cost: 'Rs. 25,000',
    impact: '6,000 Litres of certified potable drinking water dispatched via municipal tanker',
    funded: 42,
    goal: 60,
    badge: 'High Impact'
  },
  {
    id: 'PKG-03',
    name: 'Emergency Medical & Triage Kit',
    target: 'Community First-Aid Post',
    cost: 'Rs. 15,000',
    impact: 'Antiseptics, bandages, burn cream, ORS rehydration salts, fever medication & sterile gloves',
    funded: 190,
    goal: 250,
    badge: 'Critical Care'
  },
  {
    id: 'PKG-04',
    name: 'Infant Care & Maternal Nutrition Pack',
    target: 'Mothers with Infants in Shelters',
    cost: 'Rs. 10,000',
    impact: 'Infant formula, sterile baby bottles, diapers, baby soap & maternal nutritional supplements',
    funded: 310,
    goal: 400,
    badge: 'Vulnerable'
  }
];

const DONOR_TRANSACTIONS = [
  { id: 'TXN-9021', donor: 'Help Sri Lanka Foundation', type: 'Financial Grant', amount: 'Rs. 2,500,000', allocation: 'Clean Water Bowsers & Peliyagoda Depot', status: 'Distributed', date: 'Today, 14:20' },
  { id: 'TXN-9020', donor: 'Dr. Anura Bandara & Friends', type: 'Relief Packs', amount: 'Rs. 150,000', allocation: '20x Family Ration Packs (Kolonnawa)', status: 'In Transit', date: 'Today, 11:05' },
  { id: 'TXN-9019', donor: 'Rotary Club of Colombo West', type: 'Medical Supplies', amount: 'Rs. 750,000', allocation: '50x Emergency Medical Kits', status: 'Allocated', date: 'Yesterday' },
  { id: 'TXN-9018', donor: 'Anonymous Citizen Donor', type: 'Direct Aid', amount: 'Rs. 25,000', allocation: '1x Water Tanker (Kaduwela Shelter)', status: 'Distributed', date: '12 Nov 2026' },
  { id: 'TXN-9017', donor: 'Ceylon Tea Exporters Association', type: 'Corporate Aid', amount: 'Rs. 1,800,000', allocation: '240x Family Food Relief Packages', status: 'Distributed', date: '11 Nov 2026' }
];

export const DonorPortalPage = ({ initialTab = 'overview' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reactively sync activeTab with URL route and props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/packages')) {
      setActiveTab('packages');
    } else if (p.includes('/tracking')) {
      setActiveTab('tracking');
    } else if (p.includes('/contribute') || p === '/donor' || p === '/donor/portal' || p === '/donor/dashboard' || p === '/donations') {
      setActiveTab('overview');
    }
  }, [initialTab, location.pathname]);
  const [selectedPackage, setSelectedPackage] = useState(RELIEF_PACKAGES[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setCustomAmount('');
    }, 4500);
  };

  return (
    <div className="donor-portal-container">
      {/* Top Banner */}
      <div className="donor-header-card">
        <div className="donor-header-left">
          <div className="donor-badge-row">
            <span className="donor-pill pill-cyan">Module 07 · Donor & Funding Management</span>
            <span className="donor-pill pill-emerald">● 100% Transparent Aid Tracking</span>
            <span className="donor-pill pill-amber">Western Province Flood Emergency</span>
          </div>
          <h1 className="donor-title">Humanitarian Aid & Donor Funding Portal</h1>
          <p className="donor-subtitle">
            Directly fund emergency rations, medical supplies, and clean drinking water tankers for over 18,000 flood-affected individuals with real-time distribution tracking.
          </p>
        </div>
        <div className="donor-header-actions">
          <button className="donor-btn btn-secondary" onClick={() => window.location.href = '/citizen/shelters'}>
            Find Shelters
          </button>
          <button className="donor-btn btn-primary" onClick={() => setActiveTab('packages')}>
            <Heart size={16} /> Donate Relief Kit
          </button>
        </div>
      </div>

      {/* Live Financial & Material Telemetry */}
      <div className="donor-metrics-grid">
        <div className="donor-metric-card">
          <div className="donor-metric-icon icon-emerald">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="metric-label">Total Relief Funds Raised</span>
            <h3 className="metric-val">Rs. 24,850,000</h3>
            <span className="metric-note text-emerald">↑ Rs. 3.4M in last 48 hours</span>
          </div>
        </div>

        <div className="donor-metric-card">
          <div className="donor-metric-icon icon-blue">
            <Package size={22} />
          </div>
          <div>
            <span className="metric-label">Relief Packs Distributed</span>
            <h3 className="metric-val">12,420 Kits</h3>
            <span className="metric-note text-cyan">Reaching 46 emergency centers</span>
          </div>
        </div>

        <div className="donor-metric-card">
          <div className="donor-metric-icon icon-purple">
            <Users size={22} />
          </div>
          <div>
            <span className="metric-label">Active Contributing Donors</span>
            <h3 className="metric-val">1,842 Donors</h3>
            <span className="metric-note text-emerald">Individuals & organisations</span>
          </div>
        </div>

        <div className="donor-metric-card">
          <div className="donor-metric-icon icon-amber">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="metric-label">Audited Utilization Ratio</span>
            <h3 className="metric-val">96.8%</h3>
            <span className="metric-note text-emerald">Direct frontline aid ratio</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="donor-tabs-bar">
        <button
          className={`donor-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} /> Overview & Transparency
        </button>
        <button
          className={`donor-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <Gift size={16} /> Emergency Relief Packages
        </button>
        <button
          className={`donor-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          <Truck size={16} /> Supply Distribution Ledger
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="donor-two-col">
          {/* Donation Form Card */}
          <div className="donor-card">
            <div className="donor-card-header">
              <div>
                <h3 className="card-heading">Contribute Immediate Relief Aid</h3>
                <p className="card-sub">Select a verified package or enter custom contribution amount</p>
              </div>
              <span className="ssl-badge"><ShieldCheck size={14} /> 256-bit Secure</span>
            </div>

            {donationSuccess ? (
              <div className="donation-success-alert">
                <CheckCircle2 size={32} color="#34d399" />
                <h4>Thank You For Your Life-Saving Contribution!</h4>
                <p>Your donation has been registered with HumanitarianCrisisDb. Receipt and GPS dispatch dispatch code dispatched to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="donor-form">
                <div className="packages-select-grid">
                  {RELIEF_PACKAGES.map(pkg => (
                    <div
                      key={pkg.id}
                      className={`pkg-select-card ${selectedPackage.id === pkg.id ? 'active' : ''}`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <div className="pkg-card-top">
                        <span className="pkg-badge">{pkg.badge}</span>
                        <strong className="pkg-cost">{pkg.cost}</strong>
                      </div>
                      <h5 className="pkg-name">{pkg.name}</h5>
                      <span className="pkg-target">{pkg.target}</span>
                    </div>
                  ))}
                </div>

                <div className="form-group-donor">
                  <label>Or Enter Custom Amount (LKR)</label>
                  <div className="currency-input-wrap">
                    <span className="curr-symbol">Rs.</span>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      className="donor-input"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-donor">
                  <div className="form-group-donor" style={{ flex: 1 }}>
                    <label>Donor / Organisation Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyantha Silva or ABC Foundation"
                      className="donor-input"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                    />
                  </div>
                  <div className="form-group-donor" style={{ flex: 1 }}>
                    <label>Email for Tax Receipt</label>
                    <input
                      type="email"
                      required
                      placeholder="donor@example.com"
                      className="donor-input"
                      value={donorEmail}
                      onChange={e => setDonorEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="donor-submit-btn">
                  <Heart size={18} /> Confirm Aid Pledge ({customAmount ? `Rs. ${Number(customAmount).toLocaleString()}` : selectedPackage.cost})
                </button>
              </form>
            )}
          </div>

          {/* Transparency & Recent Pledges */}
          <div className="donor-card">
            <div className="donor-card-header">
              <div>
                <h3 className="card-heading">Live Contributions & Deployments</h3>
                <p className="card-sub">Audited real-time ledger from verified donors</p>
              </div>
            </div>

            <div className="recent-pledges-list">
              {DONOR_TRANSACTIONS.map(txn => (
                <div key={txn.id} className="pledge-item">
                  <div className="pledge-item-left">
                    <div className="pledge-icon">
                      <Gift size={18} />
                    </div>
                    <div>
                      <h4 className="pledge-donor">{txn.donor}</h4>
                      <p className="pledge-alloc">{txn.allocation}</p>
                      <span className="pledge-date">{txn.date} · ID: {txn.id}</span>
                    </div>
                  </div>
                  <div className="pledge-item-right">
                    <strong className="pledge-amount">{txn.amount}</strong>
                    <span className={`status-pill ${txn.status === 'Distributed' ? 'status-active' : 'status-warning'}`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Relief Packages Detail */}
      {activeTab === 'packages' && (
        <div className="packages-full-grid">
          {RELIEF_PACKAGES.map(pkg => (
            <div key={pkg.id} className="package-full-card">
              <div className="pkg-header">
                <span className="pkg-badge">{pkg.badge}</span>
                <span className="pkg-code">{pkg.id}</span>
              </div>
              <h3 className="pkg-title">{pkg.name}</h3>
              <p className="pkg-target-desc">Target: <strong>{pkg.target}</strong></p>
              <p className="pkg-impact-desc">{pkg.impact}</p>
              
              <div className="pkg-progress-bar-wrap">
                <div className="progress-labels">
                  <span>{pkg.funded} Packs Funded</span>
                  <span>Goal: {pkg.goal}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, (pkg.funded / pkg.goal) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pkg-footer">
                <div className="pkg-price-wrap">
                  <span className="pkg-price-label">Cost per unit:</span>
                  <span className="pkg-price-val">{pkg.cost}</span>
                </div>
                <button
                  className="donor-btn btn-primary"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setActiveTab('overview');
                  }}
                >
                  Sponsor Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Distribution Ledger */}
      {activeTab === 'tracking' && (
        <div className="donor-card">
          <div className="donor-card-header">
            <div>
              <h3 className="card-heading">Frontline Supply Chain Dispatch Ledger</h3>
              <p className="card-sub">Full transparency tracking from donation receipt to shelter intake</p>
            </div>
          </div>
          <div className="ledger-table-wrap">
            <table className="donor-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Donor Entity</th>
                  <th>Aid Type</th>
                  <th>Amount / Value</th>
                  <th>Designated Destination Zone</th>
                  <th>Supply Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {DONOR_TRANSACTIONS.map(tx => (
                  <tr key={tx.id}>
                    <td><code>{tx.id}</code></td>
                    <td><strong>{tx.donor}</strong></td>
                    <td>{tx.type}</td>
                    <td><strong className="text-emerald">{tx.amount}</strong></td>
                    <td>{tx.allocation}</td>
                    <td>
                      <span className={`status-pill ${tx.status === 'Distributed' ? 'status-active' : 'status-warning'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      <button className="receipt-btn" onClick={() => alert(`Official tax receipt for ${tx.id} generated.`)}>
                        <Download size={13} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorPortalPage;
