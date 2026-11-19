import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Home, Droplet, Eye } from 'lucide-react';
import { MY_REQUESTS_LIST } from '../data/citizenPortalData';

export const MyRequestsView = ({ onSelectTab, showToast }) => {
  const [activeSubtab, setActiveSubtab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = MY_REQUESTS_LIST.filter((req) => {
    if (activeSubtab === 'active' && req.statusType === 'completed') return false;
    if (activeSubtab === 'completed' && req.statusType !== 'completed') return false;

    if (
      searchTerm &&
      !req.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !req.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    if (showToast) {
      showToast(`Showing operational audit tracking for ${req.id}`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* View Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">YOUR ASSISTANCE HISTORY</span>
          <h1 className="cp-view-title">My Requests</h1>
          <p className="cp-view-subtitle">
            View and track requests submitted from your account.
          </p>
        </div>
        <div>
          <button onClick={() => onSelectTab('submit')} className="cp-btn-primary">
            <Plus size={16} />
            Submit Assistance Request
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #d4ded3',
          marginBottom: '20px'
        }}
      >
        <button
          onClick={() => setActiveSubtab('active')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'active' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'active' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Active Requests (2)
        </button>

        <button
          onClick={() => setActiveSubtab('completed')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'completed' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'completed' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Completed Requests (3)
        </button>

        <button
          onClick={() => setActiveSubtab('all')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'all' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'all' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          All Requests (5)
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8dd',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '22px'
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#738075' }} />
          <input
            type="text"
            className="cp-form-input"
            style={{ paddingLeft: '34px' }}
            placeholder="Search by request ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="cp-form-select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="review">Under Review</option>
            <option value="warning">More Information Required</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="cp-form-select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Shelter">Shelter</option>
            <option value="Water">Water</option>
            <option value="Food">Food</option>
          </select>

          <select className="cp-form-select" style={{ width: 'auto' }}>
            <option value="any">Any date</option>
            <option value="7days">Past 7 days</option>
            <option value="30days">Past 30 days</option>
          </select>
        </div>
      </div>

      {/* Request Cards Grid (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {filteredRequests.map((req) => (
          <div key={req.id} className="cp-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header with icon, ID and Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#f0f4ee',
                      color: '#1e3d2c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {req.iconType === 'home' ? <Home size={16} /> : <Droplet size={16} />}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#738075' }}>
                    {req.id}
                  </div>
                </div>

                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor:
                      req.statusType === 'completed'
                        ? '#ecfdf5'
                        : req.statusType === 'warning'
                        ? '#fee2e2'
                        : '#fef3c7',
                    color:
                      req.statusType === 'completed'
                        ? '#047857'
                        : req.statusType === 'warning'
                        ? '#b91c1c'
                        : '#92400e'
                  }}
                >
                  ● {req.status}
                </span>
              </div>

              {/* Title & Sub */}
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#162e20', margin: '0 0 4px 0' }}>
                {req.category}
              </h3>
              <p style={{ fontSize: '12px', color: '#657367', margin: 0, minHeight: '36px' }}>
                {req.title}
              </p>

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  marginTop: '14px',
                  borderTop: '1px solid #edf1eb',
                  fontSize: '11px',
                  color: '#738075'
                }}
              >
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', textTransform: 'uppercase', color: '#9fa89e', fontWeight: 700 }}>
                    Submitted
                  </span>
                  {req.submitted}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '9.5px', textTransform: 'uppercase', color: '#9fa89e', fontWeight: 700 }}>
                    Last updated
                  </span>
                  {req.lastUpdated}
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => handleViewDetails(req)}
              className="cp-btn-secondary"
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequestsView;
