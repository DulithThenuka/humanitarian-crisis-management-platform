import React, { useState } from 'react';
import { Search, Home, Building2, School, MapPin, AlertTriangle } from 'lucide-react';
import { SHELTERS_LIST } from '../data/citizenPortalData';

export const FindSheltersView = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');
  const [viewMode, setViewMode] = useState('split');

  const filteredShelters = SHELTERS_LIST.filter((sh) => {
    if (
      searchTerm &&
      !sh.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sh.distance.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleShelterClick = (sh) => {
    if (showToast) {
      showToast(`Selected ${sh.name} - verification data & intake contact`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">PUBLICLY LISTED LOCATIONS</span>
          <h1 className="cp-view-title">Find Shelters & Help Centres</h1>
          <p className="cp-view-subtitle">
            Search verified assistance locations. Availability is demonstration data, not live information.
          </p>
        </div>
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
            placeholder="Search by area or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="cp-form-select"
            style={{ width: 'auto' }}
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="All">All services</option>
            <option value="water">Drinking water</option>
            <option value="medical">Medical support</option>
            <option value="shelter">Overnight shelter</option>
          </select>

          <select
            className="cp-form-select"
            style={{ width: 'auto' }}
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
          >
            <option value="All">Accessibility</option>
            <option value="stepfree">Accessible entrance</option>
            <option value="elderly">Elderly care</option>
          </select>

          {/* List | Map Toggle */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f4f6f2',
              borderRadius: '8px',
              border: '1px solid #d4ded3',
              padding: '2px'
            }}
          >
            <button
              onClick={() => setViewMode('split')}
              style={{
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'split' ? '#1e3d2c' : 'transparent',
                color: viewMode === 'split' ? '#ffffff' : '#657367',
                cursor: 'pointer'
              }}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'map' ? '#1e3d2c' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : '#657367',
                cursor: 'pointer'
              }}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Map on Left & Shelter Cards on Right */}
      <div className="cp-grid-split" style={{ gridTemplateColumns: '1.25fr 1fr', gap: '20px' }}>
        {/* Left: Map Canvas */}
        <div
          className="cp-card"
          style={{
            position: 'relative',
            minHeight: '480px',
            backgroundColor: '#e6ece3',
            overflow: 'hidden',
            padding: 0
          }}
        >
          {/* Background Map Graphic */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <polygon points="0,0 260,0 140,480 0,480" fill="#dce6d8" />
            <polygon points="260,0 580,0 660,480 140,480" fill="#d3e0cf" />
            <polygon points="580,0 900,0 900,480 660,480" fill="#dce6d8" />
            <line x1="0" y1="210" x2="900" y2="280" stroke="#ffffff" strokeWidth="6" />
            <line x1="380" y1="0" x2="320" y2="480" stroke="#ffffff" strokeWidth="4.5" />
            <line x1="180" y1="480" x2="750" y2="60" stroke="#ffffff" strokeWidth="3.5" />
            <circle cx="230" cy="280" r="100" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="500" cy="360" r="80" fill="rgba(30, 61, 44, 0.12)" stroke="#1e3d2c" strokeWidth="1.5" />
          </svg>

          {/* Red Emergency Zone Tag */}
          <div
            style={{
              position: 'absolute',
              left: '190px',
              top: '260px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <AlertTriangle size={12} />
            11 spaces
          </div>

          {/* Blue Resource Depot Tag */}
          <div
            style={{
              position: 'absolute',
              right: '180px',
              top: '190px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '14px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            RES-021 · 240
          </div>

          {/* Green Shelter Pin */}
          <div
            style={{
              position: 'absolute',
              right: '220px',
              bottom: '100px',
              backgroundColor: '#14291e',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <Home size={12} />
            SH-008 · 36 spaces
          </div>

          {/* Zoom controls */}
          <div
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              border: '1px solid #d4ded3',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <button style={{ border: 'none', background: 'transparent', padding: '6px 10px', fontSize: '13px', cursor: 'pointer' }}>+</button>
            <div style={{ height: '1px', backgroundColor: '#e2e8dd' }} />
            <button style={{ border: 'none', background: 'transparent', padding: '6px 10px', fontSize: '13px', cursor: 'pointer' }}>-</button>
            <div style={{ height: '1px', backgroundColor: '#e2e8dd' }} />
            <button style={{ border: 'none', background: 'transparent', padding: '6px 10px', fontSize: '11px', cursor: 'pointer' }}>⌖</button>
          </div>
        </div>

        {/* Right: Shelter Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredShelters.map((sh) => (
            <div key={sh.id} className="cp-card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
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
                    {sh.iconType === 'building' ? <Building2 size={16} /> : <Home size={16} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                      {sh.name}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#738075' }}>
                      {sh.distance}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: sh.statusType === 'operational' ? '#ecfdf5' : '#fef3c7',
                    color: sh.statusType === 'operational' ? '#047857' : '#92400e'
                  }}
                >
                  ● {sh.status}
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#657367', marginBottom: '12px' }}>
                {sh.updateNote}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {sh.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#f4f6f2',
                      border: '1px solid #e2e8dd',
                      fontSize: '10.5px',
                      color: '#405044'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleShelterClick(sh)}
                className="cp-btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindSheltersView;
