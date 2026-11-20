import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  Package,
  RotateCcw,
  CheckCircle,
  FileCheck,
  Download
} from 'lucide-react';
import { RecordDonationModal } from '../components/modals/RecordDonationModal';
import { SupplierDetailDrawer } from '../components/modals/SupplierDetailDrawer';

const INITIAL_RECEIPTS = [
  {
    receiptNo: 'RCP-2026-042',
    supplierDonor: 'Global Relief Trust',
    manifest: 'MNF-9921 · Central Depot',
    itemsReceived: '450 boxes · Bottled Water',
    inspectionLog: 'PASSED · Quality Verified',
    status: 'Cleared',
    statusBadge: 'available',
    dateReceived: '18 Feb 2026 · 09:30'
  },
  {
    receiptNo: 'RCP-2026-039',
    supplierDonor: 'HealthLine Distributors',
    manifest: 'MNF-8840 · Medical Store',
    itemsReceived: '140 packs · First Aid Packs',
    inspectionLog: 'PASSED · Seal Intact',
    status: 'Cleared',
    statusBadge: 'available',
    dateReceived: '17 Feb 2026 · 14:15'
  },
  {
    receiptNo: 'RCP-2026-035',
    supplierDonor: 'Rotary Club Colombo West',
    manifest: 'MNF-7712 · Central Depot',
    itemsReceived: '320 boxes · Emergency Rations',
    inspectionLog: 'QUARANTINE · Awaiting Lab Test',
    status: 'Pending Inspection',
    statusBadge: 'warning',
    dateReceived: '16 Feb 2026 · 11:00'
  }
];

const INITIAL_DONATIONS = [
  {
    id: 'DON-2026-081',
    donorName: 'Global Humanitarian Relief Trust',
    category: 'Water',
    description: 'Purified Bottled Water 5L Packs',
    quantity: 450,
    unit: 'boxes',
    stockStatus: 'Pending Inspection',
    statusBadge: 'warning',
    warehouse: 'Central Depot',
    recordedDate: 'Today · 09:15'
  },
  {
    id: 'DON-2026-078',
    donorName: 'Sri Lanka Red Cross Society',
    category: 'Medicine',
    description: 'Emergency Trauma & First Aid Kits',
    quantity: 120,
    unit: 'kits',
    stockStatus: 'Add Directly to Inventory',
    statusBadge: 'available',
    warehouse: 'Medical Store',
    recordedDate: '18 Feb · 08:30'
  },
  {
    id: 'DON-2026-074',
    donorName: 'UNICEF Emergency Support',
    category: 'Hygiene',
    description: 'Family Hygiene & Sanitation Packs',
    quantity: 350,
    unit: 'packs',
    stockStatus: 'Add Directly to Inventory',
    statusBadge: 'available',
    warehouse: 'Wattala Store',
    recordedDate: '17 Feb · 16:40'
  },
  {
    id: 'DON-2026-069',
    donorName: 'Rotary Club Colombo West',
    category: 'Food',
    description: 'High-Energy Emergency Rations',
    quantity: 320,
    unit: 'boxes',
    stockStatus: 'Pending Inspection',
    statusBadge: 'warning',
    warehouse: 'Central Depot',
    recordedDate: '16 Feb · 14:10'
  },
  {
    id: 'DON-2026-065',
    donorName: 'Care International',
    category: 'Shelter',
    description: 'Heavy-Duty Waterproof Tarpaulins',
    quantity: 210,
    unit: 'packs',
    stockStatus: 'Add Directly to Inventory',
    statusBadge: 'available',
    warehouse: 'Biyagama Depot',
    recordedDate: '15 Feb · 11:20'
  }
];

export const SuppliersDonationsView = ({
  suppliers = [],
  onOpenAddSupplierModal,
  onSelectSupplier,
  onUpdateSupplierStatus,
  showToast
}) => {
  const [activeSubtab, setActiveSubtab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All');

  // Supplier state and detail drawer state
  const [localSuppliers, setLocalSuppliers] = useState(suppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setLocalSuppliers(suppliers);
  }, [suppliers]);

  // Record Donation Modal State & Donations List State
  const [isRecordDonationOpen, setIsRecordDonationOpen] = useState(false);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [addedDonations, setAddedDonations] = useState([]);
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS);

  // Dynamically extract unique categories from supplier records
  const dynamicCategories = useMemo(() => {
    const catMap = new Map();
    const defaults = ['Water', 'Medicine', 'Hygiene', 'Blankets', 'Shelter', 'Emergency kits'];
    defaults.forEach(c => catMap.set(c.toLowerCase(), c));

    localSuppliers.forEach(s => {
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
  }, [localSuppliers]);

  // Combined search, status, category, and date filtering for suppliers
  const filteredSuppliers = useMemo(() => {
    return localSuppliers.filter(s => {
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
  }, [localSuppliers, searchTerm, statusFilter, categoryFilter, dateRange]);

  // Filtering for Donated Supplies
  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        d.id.toLowerCase().includes(term) ||
        d.donorName.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term);

      const matchesCategory = categoryFilter === 'All' ||
        d.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [donations, searchTerm, categoryFilter]);

  // Filtering for Receipt History
  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        r.receiptNo.toLowerCase().includes(term) ||
        r.supplierDonor.toLowerCase().includes(term) ||
        r.itemsReceived.toLowerCase().includes(term) ||
        r.manifest.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term);

      return matchesSearch;
    });
  }, [receipts, searchTerm]);

  // Clean CSV Export for active subtab's filtered records
  const handleExportCsv = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let headers = [];
    let rows = [];
    let filename = '';
    let recordCount = 0;
    let label = '';

    if (activeSubtab === 'suppliers') {
      headers = ['Supplier ID', 'Supplier Name', 'Categories', 'Contact Reference', 'Status', 'Last Delivery'];
      rows = filteredSuppliers.map(s => [
        s.id,
        s.name,
        s.categories,
        s.contactRef,
        s.status,
        s.lastDelivery
      ]);
      filename = `suppliers_catalog_${timestamp}.csv`;
      recordCount = filteredSuppliers.length;
      label = 'supplier';
    } else if (activeSubtab === 'donated') {
      headers = ['Donation ID', 'Donor / Organization', 'Category', 'Description', 'Quantity', 'Unit', 'Stock Status', 'Warehouse', 'Recorded Date'];
      rows = filteredDonations.map(d => [
        d.id,
        d.donorName,
        d.category,
        d.description,
        d.quantity,
        d.unit,
        d.stockStatus,
        d.warehouse || d.targetWarehouse || 'Central Depot',
        d.recordedDate
      ]);
      filename = `donated_supplies_${timestamp}.csv`;
      recordCount = filteredDonations.length;
      label = 'donated supply';
    } else {
      headers = ['Receipt No', 'Supplier / Donor', 'Dispatch Manifest & Depot', 'Items Received', 'Inspection Log', 'Status', 'Date Received'];
      rows = filteredReceipts.map(r => [
        r.receiptNo,
        r.supplierDonor,
        r.manifest,
        r.itemsReceived,
        r.inspectionLog,
        r.status,
        r.dateReceived
      ]);
      filename = `receipt_history_${timestamp}.csv`;
      recordCount = filteredReceipts.length;
      label = 'receipt';
    }

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) {
      showToast(`Exported ${recordCount} ${label} records as CSV`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setDateRange('All');
  };

  const isFiltered = searchTerm !== '' || categoryFilter !== 'All' || statusFilter !== 'All' || dateRange !== 'All';

  // Handle opening supplier drawer
  const handleOpenSupplierDrawer = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDrawerOpen(true);
    if (onSelectSupplier) {
      onSelectSupplier(supplier);
    }
  };

  // Handle approving a supplier in "Review" status (e.g. SUP-021)
  const handleApproveSupplier = (supplierId) => {
    setLocalSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          status: 'Verified',
          statusBadge: 'verified',
          contactRef: 'Approved contact'
        };
      }
      return s;
    }));

    setSelectedSupplier(prev => prev && prev.id === supplierId ? {
      ...prev,
      status: 'Verified',
      statusBadge: 'verified',
      contactRef: 'Approved contact'
    } : prev);

    if (onUpdateSupplierStatus) {
      onUpdateSupplierStatus(supplierId, 'Verified');
    }
  };

  // Handle saving newly recorded donation
  const handleSaveDonation = (newDonation) => {
    setDonations(prev => [newDonation, ...prev]);
    setAddedDonations(prev => [newDonation, ...prev]);
    if (showToast) {
      showToast(`Donation recorded from ${newDonation.donorName}: ${newDonation.quantity} ${newDonation.unit} (${newDonation.stockStatus})`);
    }
  };

  // Dynamic KPI Calculations based on supplier records and inbound contributions
  const verifiedBase = localSuppliers.filter(s => s.status?.toLowerCase() === 'verified').length;
  const reviewBase = localSuppliers.filter(s => s.status?.toLowerCase() === 'review' || s.status?.toLowerCase() === 'pending').length;
  const verifiedCount = 8 + verifiedBase;
  const pendingReviewCount = Math.max(0, 1 + reviewBase);

  // Dynamic Donation KPIs
  const addedUnitsTotal = addedDonations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
  const totalDonationsCount = 28 + addedDonations.length;
  const totalDonationUnitsNumber = 1450 + addedUnitsTotal;
  const addedPendingReceipts = addedDonations.filter(d => d.stockStatus === 'Pending Inspection').length;
  const pendingReceiptsCount = 4 + addedPendingReceipts;

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

        {/* Top-Right Action Area: Secondary "+ Record donation" and Primary "+ Add supplier" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button"
            className="rm-btn rm-btn-secondary"
            onClick={() => setIsRecordDonationOpen(true)}
          >
            <Plus size={14} />
            <span>Record donation</span>
          </button>
          <button 
            type="button"
            className="rm-btn rm-btn-primary"
            onClick={onOpenAddSupplierModal}
          >
            <Plus size={14} />
            <span>Add supplier</span>
          </button>
        </div>
      </div>

      {/* 4-Card KPI Summary Row (Dynamically updated) */}
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

        {/* 2. Donations This Month (Dynamically updated) */}
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
          <div className="rm-metric-val">{totalDonationsCount}</div>
          <span className="rm-metric-subtext">{totalDonationUnitsNumber.toLocaleString()} total units</span>
        </div>

        {/* 3. Pending Stock Receipts (Dynamically updated) */}
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
          Donated supplies <span style={{ 
            fontSize: '11px', 
            fontWeight: 700,
            color: addedDonations.length > 0 ? '#1e3d2c' : '#738075', 
            marginLeft: '4px',
            backgroundColor: addedDonations.length > 0 ? '#edf4ec' : 'transparent',
            padding: addedDonations.length > 0 ? '1px 6px' : '0',
            borderRadius: '10px'
          }}>
            {totalDonationsCount}
          </span>
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
          Receipt history <span style={{ fontSize: '11px', color: '#738075', marginLeft: '4px' }}>
            {searchTerm ? `${filteredReceipts.length} of ${receipts.length}` : receipts.length}
          </span>
        </button>
      </div>

      {/* Filter Bar with Category Dropdown Filter & CSV Export */}
      <div className="rm-filter-bar">
        <div className="rm-filter-search">
          <Search size={14} className="rm-search-icon" />
          <input
            type="text"
            placeholder={
              activeSubtab === 'donated' 
                ? "Search donation, donor or description..." 
                : activeSubtab === 'receipts'
                ? "Search receipt number, donor, depot or status..."
                : "Search supplier, category or reference..."
            }
            className="rm-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rm-filter-selects" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Dynamic Category Filter (for Suppliers and Donations) */}
          {activeSubtab !== 'receipts' && (
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
          )}

          {activeSubtab === 'suppliers' && (
            <>
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
            </>
          )}

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

          {/* Export CSV Button */}
          <button
            type="button"
            className="rm-btn rm-btn-secondary"
            onClick={handleExportCsv}
            style={{ 
              padding: '6px 12px', 
              fontSize: '11.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
            title={`Export ${activeSubtab === 'suppliers' ? 'supplier' : activeSubtab === 'donated' ? 'donation' : 'receipt'} records as CSV`}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Suppliers Table */}
      {activeSubtab === 'suppliers' && (
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
                    onClick={() => handleOpenSupplierDrawer(s)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-[#f6f8f5] transition-colors"
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
                      <button
                        type="button"
                        className="rm-btn-ghost"
                        style={{ padding: '6px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSupplierDrawer(s);
                        }}
                        title="Open supplier details drawer"
                      >
                        <ChevronRight size={16} color="#1e3d2c" />
                      </button>
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
      )}

      {/* Subtab 2: Donated Supplies Table */}
      {activeSubtab === 'donated' && (
        <div className="rm-table-container">
          <table className="rm-data-table">
            <thead>
              <tr>
                <th>DONATION ID</th>
                <th>DONOR / ORGANIZATION</th>
                <th>ITEM DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>QUANTITY</th>
                <th>WAREHOUSE</th>
                <th>STATUS</th>
                <th>RECORDED DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#f6f8f5] transition-colors">
                    <td>
                      <span style={{ fontWeight: 700, color: '#162e20' }}>{d.id}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#162e20' }}>{d.donorName}</span>
                    </td>
                    <td>
                      <span style={{ color: '#243328' }}>{d.description}</span>
                    </td>
                    <td>
                      <span className="rm-category-tag">{d.category}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#162e20' }}>
                        {d.quantity.toLocaleString()} <span style={{ fontWeight: 500, color: '#657367', fontSize: '12px' }}>{d.unit}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#405044' }}>{d.targetWarehouse || d.warehouse}</span>
                    </td>
                    <td>
                      <span className={`rm-status-badge ${d.statusBadge || (d.stockStatus?.includes('Directly') ? 'available' : 'warning')}`}>
                        ● {d.stockStatus}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#738075', fontSize: '11.5px' }}>{d.recordedDate}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: 0 }}>
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
                        <HeartHandshake size={20} />
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#162e20' }}>
                        No donated supplies found
                      </h4>
                      <p style={{ margin: '0 0 18px 0', fontSize: '12.5px', color: '#657367', maxWidth: '380px' }}>
                        No donations match your active query. Record an inbound donation to register new external contributions.
                      </p>
                      <button
                        type="button"
                        className="rm-btn rm-btn-primary"
                        onClick={() => setIsRecordDonationOpen(true)}
                        style={{ fontSize: '12px', padding: '7px 16px' }}
                      >
                        <Plus size={13} />
                        <span>Record new donation</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Subtab 3: Receipt History */}
      {activeSubtab === 'receipts' && (
        <div className="rm-table-container">
          <table className="rm-data-table">
            <thead>
              <tr>
                <th>RECEIPT NO</th>
                <th>SUPPLIER / DONOR</th>
                <th>DISPATCH MANIFEST</th>
                <th>ITEMS RECEIVED</th>
                <th>INSPECTION LOG</th>
                <th>STATUS</th>
                <th>DATE RECEIVED</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((r) => (
                  <tr key={r.receiptNo} className="hover:bg-[#f6f8f5] transition-colors">
                    <td><span style={{ fontWeight: 700, color: '#162e20' }}>{r.receiptNo}</span></td>
                    <td><span style={{ fontWeight: 600, color: '#162e20' }}>{r.supplierDonor}</span></td>
                    <td><span style={{ color: '#405044' }}>{r.manifest}</span></td>
                    <td><span style={{ fontWeight: 600, color: '#162e20' }}>{r.itemsReceived}</span></td>
                    <td>
                      <span style={{ 
                        color: r.inspectionLog.includes('PASSED') ? '#047857' : '#b45309', 
                        fontWeight: 600 
                      }}>
                        {r.inspectionLog}
                      </span>
                    </td>
                    <td>
                      <span className={`rm-status-badge ${r.statusBadge || (r.status === 'Cleared' ? 'available' : 'warning')}`}>
                        ● {r.status}
                      </span>
                    </td>
                    <td><span style={{ color: '#738075' }}>{r.dateReceived}</span></td>
                  </tr>
                ))
              ) : (
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
                        No matching receipts found
                      </h4>
                      <p style={{ margin: '0 0 18px 0', fontSize: '12.5px', color: '#657367', maxWidth: '380px', lineHeight: 1.5 }}>
                        No warehouse intake receipts matched your current search query. Clear search term to view all logged manifest receipts.
                      </p>
                      <button
                        type="button"
                        className="rm-btn rm-btn-secondary"
                        onClick={handleResetFilters}
                        style={{ fontSize: '12px', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <RotateCcw size={13} />
                        <span>Clear search</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Donation Modal Dialog */}
      <RecordDonationModal
        isOpen={isRecordDonationOpen}
        onClose={() => setIsRecordDonationOpen(false)}
        onSave={handleSaveDonation}
      />

      {/* Supplier Detail Drawer */}
      <SupplierDetailDrawer
        isOpen={isDrawerOpen}
        supplier={selectedSupplier}
        onClose={() => setIsDrawerOpen(false)}
        onApproveSupplier={handleApproveSupplier}
        showToast={showToast}
      />
    </div>
  );
};

export default SuppliersDonationsView;
