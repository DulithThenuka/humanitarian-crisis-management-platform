import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  Search, 
  Download, 
  Plus, 
  Eye, 
  FileText 
} from 'lucide-react';

export const InventoryManagementView = ({
  items = [],
  onOpenAddModal,
  onExportReport,
  onSelectItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.stockStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === 'All' || item.storageLocation === locationFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  return (
    <div className="rm-workspace">
      {/* Title & Action Block (Screenshot 2) */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>RESOURCE CATALOGUE AND STOCK CONTROL</span>
          </div>
          <h1 className="rm-title">Inventory Management</h1>
          <p className="rm-subtitle">
            Manage relief items, quantities, storage locations and stock conditions.
          </p>
        </div>

        <button 
          className="rm-btn rm-btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={14} />
          <span>Add inventory item</span>
        </button>
      </div>

      {/* 4 Mini Metric Cards */}
      <div className="rm-metrics-grid-4">
        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Available</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              <Package size={15} />
            </div>
          </div>
          <div className="rm-metric-val">1,284</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Allocated</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              <Package size={15} />
            </div>
          </div>
          <div className="rm-metric-val">342</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Low stock</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div className="rm-metric-val">5</div>
        </div>

        <div className="rm-metric-card">
          <div className="rm-metric-top">
            <span className="rm-metric-label">Expiring soon</span>
            <div className="rm-metric-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <Clock size={15} />
            </div>
          </div>
          <div className="rm-metric-val">14</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rm-filter-bar">
        <div className="rm-filter-search">
          <Search size={14} className="rm-search-icon" />
          <input
            type="text"
            placeholder="Search item, ID or category..."
            className="rm-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rm-filter-selects">
          <select 
            className="rm-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category</option>
            <option value="Water">Water</option>
            <option value="Food">Food</option>
            <option value="Medicine">Medicine</option>
            <option value="Shelter">Shelter</option>
            <option value="Emergency Kits">Emergency Kits</option>
          </select>

          <select 
            className="rm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Stock status</option>
            <option value="Available">Available</option>
            <option value="Shortage">Shortage</option>
            <option value="Low stock">Low stock</option>
          </select>

          <select 
            className="rm-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">Storage location</option>
            <option value="Central Depot">Central Depot</option>
            <option value="Wattala Store">Wattala Store</option>
            <option value="Biyagama Depot">Biyagama Depot</option>
            <option value="Medical Store">Medical Store</option>
          </select>

          <button 
            className="rm-btn rm-btn-secondary"
            onClick={onExportReport}
            style={{ padding: '7px 14px' }}
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rm-table-container">
        <table className="rm-data-table">
          <thead>
            <tr>
              <th>RESOURCE ID</th>
              <th>ITEM NAME</th>
              <th>CATEGORY</th>
              <th>QUANTITY</th>
              <th>UNIT</th>
              <th>STORAGE LOCATION</th>
              <th>STOCK STATUS</th>
              <th>LAST UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} onClick={() => onSelectItem && onSelectItem(item)}>
                <td>
                  <span style={{ fontWeight: 700, color: '#162e20' }}>{item.id}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#162e20' }}>{item.name}</span>
                </td>
                <td>
                  <span style={{ color: '#405044' }}>{item.category}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: '#162e20' }}>{item.quantity.toLocaleString()}</span>
                </td>
                <td>
                  <span style={{ color: '#657367' }}>{item.unit}</span>
                </td>
                <td>
                  <span style={{ color: '#405044' }}>{item.storageLocation}</span>
                </td>
                <td>
                  <span className={`rm-status-badge ${item.statusBadge || item.stockStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    ● {item.stockStatus}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#738075', fontSize: '11.5px' }}>{item.lastUpdated}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#657367' }}>
                    <Eye size={14} style={{ cursor: 'pointer' }} />
                    <FileText size={14} style={{ cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagementView;
