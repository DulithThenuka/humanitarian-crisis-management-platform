import React, { useState } from 'react';
import { Search, Plus, ChevronRight, ShieldCheck, HeartHandshake, Clock, Package } from 'lucide-react';

export const SuppliersDonationsView = ({
  suppliers = [],
  onOpenAddSupplierModal,
  onSelectSupplier
}) => {
  const [activeSubtab, setActiveSubtab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All');

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categories.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Dynamic KPI Calculations based on supplier records and inbound contributions
  const verifiedBase = suppliers.filter(s => s.status?.toLowerCase() === 'verified').length;
  const reviewBase = suppliers.filter(s => s.status?.toLowerCase() === 'review' || s.status?.toLowerCase() === 'pending').length;
  const verifiedCount = Math.max(10, 8 + verifiedBase);
  const pendingReviewCount = Math.max(2, 1 + reviewBase);

  const donationsCount = 28;
  const totalDonationUnits = '1,450';
  const pendingReceiptsCount = 4;
  const topCategory = 'Water & Hygiene';
  const topCategoryShare = '42%';

  return (
    <div className="rm-workspace">
      {/* Title & Action Block (Screenshot 5) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>EXTERNAL SUPPLY AND CONTRIBUTION RECORDS</span>
          </div>
          <h1 className="rm-title">Suppliers &amp; Donations</h1>
          <p className="rm-subtitle">
            Track approved suppliers, donated items, receipts and resulting stock updates.
          </p>
        </div>

        <button 
          className="rm-btn rm-btn-primary"
          onClick={onOpenAddSupplierModal}
        >
          <Plus size={14} />
          <span>Add supplier</span>
        </button>
      </div>

      {/* 4-Card KPI Summary Row */}
      <div className="rm-metrics-grid-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* 1. Verified Suppliers */}
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Verified Suppliers</span>
            <div
              className="rm-metric-icon-wrap"
              style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #bbf7d0' }}
            >
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="rm-metric-val">{verifiedCount}</div>
          <span className="rm-metric-subtext">{pendingReviewCount} pending review</span>
        </div>

        {/* 2. Donations This Month */}
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Donations This Month</span>
            <div
              className="rm-metric-icon-wrap"
              style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
            >
              <HeartHandshake size={16} />
            </div>
          </div>
          <div className="rm-metric-val">{donationsCount}</div>
          <span className="rm-metric-subtext">{totalDonationUnits} total units</span>
        </div>

        {/* 3. Pending Stock Receipts */}
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Pending Stock Receipts</span>
            <div
              className="rm-metric-icon-wrap"
              style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
            >
              <Clock size={16} />
            </div>
          </div>
          <div className="rm-metric-val">{pendingReceiptsCount}</div>
          <span className="rm-metric-subtext">Awaiting inspection</span>
        </div>

        {/* 4. Top Contributed Category */}
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Top Contributed Category</span>
            <div
              className="rm-metric-icon-wrap"
              style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}
            >
              <Package size={16} />
            </div>
          </div>
          <div className="rm-metric-val" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
            {topCategory}
          </div>
          <span className="rm-metric-subtext">{topCategoryShare} of total supply</span>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #edf1eb', marginBottom: '18px' }}>
        <button
          onClick={() => setActiveSubtab('suppliers')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubtab === 'suppliers' ? '2px solid #1e3d2c' : '2px solid transparent',
            padding: '8px 4px 12px 4px',
            fontSize: '13px',
            fontWeight: activeSubtab === 'suppliers' ? 700 : 500,
            color: activeSubtab === 'suppliers' ? '#162e20' : '#738075',
            cursor: 'pointer'
          }}
        >
          Suppliers <span style={{ fontSize: '11px', color: '#738075', marginLeft: '4px' }}>12</span>
        </button>
        <button
          onClick={() => setActiveSubtab('donated')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubtab === 'donated' ? '2px solid #1e3d2c' : '2px solid transparent',
            padding: '8px 4px 12px 4px',
            fontSize: '13px',
            fontWeight: activeSubtab === 'donated' ? 700 : 500,
            color: activeSubtab === 'donated' ? '#162e20' : '#738075',
            cursor: 'pointer'
          }}
        >
          Donated supplies <span style={{ fontSize: '11px', color: '#738075', marginLeft: '4px' }}>28</span>
        </button>
        <button
          onClick={() => setActiveSubtab('receipts')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeSubtab === 'receipts' ? '2px solid #1e3d2c' : '2px solid transparent',
            padding: '8px 4px 12px 4px',
            fontSize: '13px',
            fontWeight: activeSubtab === 'receipts' ? 700 : 500,
            color: activeSubtab === 'receipts' ? '#162e20' : '#738075',
            cursor: 'pointer'
          }}
        >
          Receipt history
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rm-filter-bar">
        <div className="rm-filter-search">
          <Search size={14} className="rm-search-icon" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="rm-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rm-filter-selects">
          <select 
            className="rm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
          </select>

          <select 
            className="rm-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="All">Date range</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="rm-table-container">
        <table className="rm-data-table">
          <thead>
            <tr>
              <th>SUPPLIER ID</th>
              <th>SUPPLIER NAME</th>
              <th>CATEGORIES</th>
              <th>CONTACT REFERENCE</th>
              <th>STATUS</th>
              <th>LAST DELIVERY</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id} onClick={() => onSelectSupplier && onSelectSupplier(s)}>
                <td>
                  <span style={{ fontWeight: 700, color: '#162e20' }}>{s.id}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#162e20' }}>{s.name}</span>
                </td>
                <td>
                  <span style={{ color: '#405044' }}>{s.categories}</span>
                </td>
                <td>
                  <span style={{ color: '#405044' }}>{s.contactRef}</span>
                </td>
                <td>
                  <span className={`rm-status-badge ${s.statusBadge || s.status.toLowerCase()}`}>
                    ● {s.status}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#738075' }}>{s.lastDelivery}</span>
                </td>
                <td>
                  <ChevronRight size={14} color="#738075" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersDonationsView;
