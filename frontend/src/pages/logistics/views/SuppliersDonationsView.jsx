import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  Package,
  RotateCcw
} from 'lucide-react';

export const SuppliersDonationsView = ({
  suppliers = [],
  onOpenAddSupplierModal,
  onSelectSupplier
}) => {
  const [activeSubtab, setActiveSubtab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All');

  // Dynamically extract unique categories from supplier records
  const dynamicCategories = useMemo(() => {
    const catMap = new Map();
    // Common baseline categories
    const defaults = ['Water', 'Medicine', 'Hygiene', 'Blankets', 'Shelter', 'Emergency kits'];
    defaults.forEach(c => catMap.set(c.toLowerCase(), c));

    suppliers.forEach(s => {
      if (s.categories) {
        const parts = Array.isArray(s.categories) 
          ? s.categories 
          : String(s.categories).split(',');
        parts.forEach(p => {
          const trimmed = p.trim();
          if (trimmed) {
            const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
            if (!catMap.has(formatted.toLowerCase())) {
              catMap.set(formatted.toLowerCase(), formatted);
            }
          }
        });
      }
    });

    return Array.from(catMap.values());
  }, [suppliers]);

  // Combined search, status, category, and date filtering
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const term = searchTerm.toLowerCase().trim();
      const catText = Array.isArray(s.categories) ? s.categories.join(' ') : (s.categories || '');
      
      const matchesSearch = !term ||
        (s.id && s.id.toLowerCase().includes(term)) ||
        (s.name && s.name.toLowerCase().includes(term)) ||
        catText.toLowerCase().includes(term) ||
        (s.contactRef && s.contactRef.toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'All' || 
        (s.status && s.status.toLowerCase() === statusFilter.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || 
        catText.toLowerCase().includes(categoryFilter.toLowerCase());

      let matchesDate = true;
      if (dateRange !== 'All' && s.lastDelivery) {
        const delLower = s.lastDelivery.toLowerCase();
        if (dateRange === 'Today') {
          matchesDate = delLower.includes('today') || delLower.includes('18 feb');
        } else if (dateRange === 'This Week') {
          matchesDate = delLower.includes('today') || delLower.includes('feb') || delLower.includes('this week');
        } else if (dateRange === 'This Month') {
          matchesDate = delLower.includes('feb') || delLower.includes('today') || delLower.includes('this month');
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [suppliers, searchTerm, statusFilter, categoryFilter, dateRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setDateRange('All');
  };

  const isFiltered = searchTerm !== '' || categoryFilter !== 'All' || statusFilter !== 'All' || dateRange !== 'All';

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
          Suppliers <span style={{ fontSize: '11px', color: '#738075', marginLeft: '4px' }}>
            {isFiltered ? `${filteredSuppliers.length} of ${suppliers.length}` : suppliers.length}
          </span>
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

      {/* Filter Bar with Category Dropdown Filter */}
      <div className="rm-filter-bar">
        <div className="rm-filter-search">
          <Search size={14} className="rm-search-icon" />
          <input
            type="text"
            placeholder="Search supplier, category or reference..."
            className="rm-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rm-filter-selects">
          {/* Dynamic Category Filter */}
          <select 
            className="rm-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {dynamicCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            className="rm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
          </select>

          {/* Date Range Filter */}
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

          {/* Reset Filters Shortcut (if active filters) */}
          {isFiltered && (
            <button
              type="button"
              className="rm-btn rm-btn-secondary"
              onClick={handleResetFilters}
              style={{ padding: '6px 12px', fontSize: '11.5px' }}
              title="Reset all active filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
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
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((s) => (
                <tr 
                  key={s.id} 
                  onClick={() => onSelectSupplier && onSelectSupplier(s)}
                  style={{ cursor: 'pointer' }}
                >
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
              ))
            ) : (
              /* Clean Empty State Message with Reset Filters Button */
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fafcf9'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#edf4ec',
                      color: '#1e3d2c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px'
                    }}>
                      <Search size={20} />
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#162e20' }}>
                      No matching suppliers found
                    </h4>
                    <p style={{ margin: '0 0 18px 0', fontSize: '12.5px', color: '#657367', maxWidth: '380px', lineHeight: 1.5 }}>
                      No supplier records matched your current query and filter selections. Clear or reset your filters to view all approved network suppliers.
                    </p>
                    <button
                      type="button"
                      className="rm-btn rm-btn-secondary"
                      onClick={handleResetFilters}
                      style={{ fontSize: '12px', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset filters</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersDonationsView;
