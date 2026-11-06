import React, { useState } from 'react';
import {
  Truck,
  Heart,
  FileText,
  Search,
  Plus,
  Download,
  ShieldCheck,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const SuppliersDonationsView = ({
  suppliers,
  onOpenAddSupplier,
  onOpenExport
}) => {
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers', 'donations', 'receipts'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sup.categories.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || sup.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sampleDonations = [
    {
      id: 'DON-102',
      donor: 'UNICEF Sri Lanka Emergency Response',
      items: 'Water Purification Tablets (5,000 packs)',
      intakeDate: '18 Feb 2026',
      depot: 'Central Depot',
      status: 'Stocked'
    },
    {
      id: 'DON-103',
      donor: 'Red Cross Colombo Chapter',
      items: 'Family Hygiene & First Aid Kits (250 kits)',
      intakeDate: '17 Feb 2026',
      depot: 'Wattala Store',
      status: 'Stocked'
    },
    {
      id: 'DON-104',
      donor: 'Lanka Chamber of Commerce Disaster Aid',
      items: 'High-Energy Biscuit Packs (1,200 packs)',
      intakeDate: '16 Feb 2026',
      depot: 'Central Depot',
      status: 'Stocked'
    }
  ];

  const sampleReceipts = [
    {
      id: 'RCP-501',
      date: '18 Feb 2026 • 10:12',
      source: 'Aqua Relief Supplies (SUP-014)',
      manifest: '500x Bottled Drinking Water 5L',
      signedBy: 'K. Bandara (Warehouse Lead)',
      verified: true
    },
    {
      id: 'RCP-502',
      date: '17 Feb 2026 • 15:40',
      source: 'HealthLine Distributors (SUP-009)',
      manifest: '120x Trauma Dressing & Burn Kits',
      signedBy: 'M. Seneviratne (Inventory Officer)',
      verified: true
    },
    {
      id: 'RCP-503',
      date: '16 Feb 2026 • 11:25',
      source: 'Ceylon Logistics & Rations (SUP-033)',
      manifest: '300x Family Rations Boxes',
      signedBy: 'T. Perera (Receiving Clerk)',
      verified: true
    }
  ];

  return (
    <div className="rm-view-container">
      {/* Header Row */}
      <div className="rm-header-row">
        <div>
          <span className="rm-header-kicker">
            PARTNER LOGISTICS AND INBOUND RELIEF
          </span>
          <h1 className="rm-header-title">Suppliers & Donations</h1>
          <p className="rm-header-subtitle">
            Coordinate verified commercial distributors, NGO donation shipments and consignment intake.
          </p>
        </div>
        <div className="rm-header-actions">
          <button
            type="button"
            className="rm-btn-primary"
            onClick={onOpenAddSupplier}
          >
            <Plus size={16} />
            Add supplier
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--rm-border)', marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'suppliers' ? '2.5px solid var(--rm-primary-blue)' : '2.5px solid transparent',
            color: activeTab === 'suppliers' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
            fontWeight: activeTab === 'suppliers' ? 700 : 500,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Truck size={16} />
          Verified Suppliers ({suppliers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('donations')}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'donations' ? '2.5px solid var(--rm-primary-blue)' : '2.5px solid transparent',
            color: activeTab === 'donations' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
            fontWeight: activeTab === 'donations' ? 700 : 500,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Heart size={16} />
          Donated Supplies ({sampleDonations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          style={{
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'receipts' ? '2.5px solid var(--rm-primary-blue)' : '2.5px solid transparent',
            color: activeTab === 'receipts' ? 'var(--rm-primary-blue)' : 'var(--rm-text-secondary)',
            fontWeight: activeTab === 'receipts' ? 700 : 500,
            fontSize: 13.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <FileText size={16} />
          Receipt History
        </button>
      </div>

      {/* Tab 1: Suppliers */}
      {activeTab === 'suppliers' && (
        <>
          {/* Filter Bar */}
          <div className="rm-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360 }}>
              <Search size={16} color="var(--rm-text-muted)" />
              <input
                type="text"
                className="rm-top-search-input"
                placeholder="Search supplier, category or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select
                className="rm-form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: 12.5 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Status: All</option>
                <option value="Verified">Verified</option>
                <option value="Review">Review</option>
              </select>

              <button
                type="button"
                className="rm-btn-outline"
                style={{ padding: '6px 14px', fontSize: 12.5 }}
                onClick={() => onOpenExport('Suppliers')}
              >
                <Download size={14} />
                Export partner directory
              </button>
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="rm-table-card" style={{ marginTop: 14 }}>
            <table className="rm-data-table">
              <thead>
                <tr>
                  <th>Supplier ID</th>
                  <th>Organization Name</th>
                  <th>Supplied Categories</th>
                  <th>Contact Reference</th>
                  <th>Status</th>
                  <th>Last Delivery</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td style={{ fontWeight: 700, color: 'var(--rm-primary-blue)' }}>
                      {sup.id}
                    </td>
                    <td style={{ fontWeight: 700 }}>{sup.name}</td>
                    <td>{sup.categories}</td>
                    <td style={{ color: 'var(--rm-text-secondary)', fontSize: 12 }}>
                      {sup.contactReference}
                    </td>
                    <td>
                      <span className={`rm-badge rm-badge-${sup.statusType}`}>
                        <span className="rm-badge-dot" />
                        {sup.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--rm-text-muted)', fontSize: 12 }}>
                      {sup.lastDelivery}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tab 2: Donated Supplies */}
      {activeTab === 'donations' && (
        <div className="rm-table-card">
          <table className="rm-data-table">
            <thead>
              <tr>
                <th>Consignment ID</th>
                <th>Donor Organization</th>
                <th>Items & Quantities</th>
                <th>Designated Depot</th>
                <th>Intake Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleDonations.map((don) => (
                <tr key={don.id}>
                  <td style={{ fontWeight: 700, color: 'var(--rm-primary-blue)' }}>{don.id}</td>
                  <td style={{ fontWeight: 700 }}>{don.donor}</td>
                  <td>{don.items}</td>
                  <td>{don.depot}</td>
                  <td style={{ color: 'var(--rm-text-muted)', fontSize: 12 }}>{don.intakeDate}</td>
                  <td>
                    <span className="rm-badge rm-badge-success">
                      <span className="rm-badge-dot" />
                      {don.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Receipt History */}
      {activeTab === 'receipts' && (
        <div className="rm-table-card">
          <table className="rm-data-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Timestamp</th>
                <th>Vendor / Source</th>
                <th>Cargo Manifest</th>
                <th>Received & Verified By</th>
              </tr>
            </thead>
            <tbody>
              {sampleReceipts.map((rcp) => (
                <tr key={rcp.id}>
                  <td style={{ fontWeight: 700, color: 'var(--rm-primary-blue)' }}>{rcp.id}</td>
                  <td style={{ color: 'var(--rm-text-muted)', fontSize: 12 }}>{rcp.date}</td>
                  <td style={{ fontWeight: 700 }}>{rcp.source}</td>
                  <td>{rcp.manifest}</td>
                  <td style={{ color: 'var(--rm-text-secondary)', fontWeight: 600 }}>{rcp.signedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

