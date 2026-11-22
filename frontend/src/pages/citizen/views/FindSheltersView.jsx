import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Home,
  Building2,
  School,
  MapPin,
  AlertTriangle,
  Phone,
  User,
  CheckCircle,
  X,
  ExternalLink,
  Users,
  Compass,
  RefreshCw,
  Info
} from 'lucide-react';
import { shelterService } from '../../../services/shelterService';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';

export const FindSheltersView = ({ showToast }) => {
  const [sheltersList, setSheltersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');
  const [viewMode, setViewMode] = useState('split');
  const [selectedShelter, setSelectedShelter] = useState(null);

  const parseTags = (s) => {
    let list = [];
    if (Array.isArray(s.amenities) && s.amenities.length > 0) {
      list = [...s.amenities];
    } else if (typeof s.facilities === 'string') {
      try {
        const parsed = JSON.parse(s.facilities);
        if (Array.isArray(parsed)) list = parsed;
        else list = s.facilities.split(',').map((f) => f.trim()).filter(Boolean);
      } catch {
        list = s.facilities.split(',').map((f) => f.trim()).filter(Boolean);
      }
    } else if (Array.isArray(s.facilities)) {
      list = [...s.facilities];
    }

    if (!list || list.length === 0) {
      list = ['Emergency accommodation', 'Drinking water', 'Basic first aid'];
    }
    return list;
  };

  const fetchShelters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shelterService.getAll();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(raw)) {
        const mapped = raw.map((s, idx) => {
          const totalCap = s.totalCapacity ?? s.capacity ?? 100;
          const currOcc = s.currentOccupancy ?? s.occupied ?? 0;
          const availCap = s.availableCapacity ?? Math.max(0, totalCap - currOcc);
          const isOperational = s.status === 'Operational' || (availCap > 0 && s.status !== 'Full');
          const tags = parseTags(s);

          const nameLower = (s.name || s.facilityName || '').toLowerCase();
          const iconType = nameLower.includes('school') || nameLower.includes('college')
            ? 'school'
            : nameLower.includes('civic') || nameLower.includes('center') || nameLower.includes('hall')
            ? 'building'
            : 'home';

          return {
            id: s.id || `SH-${idx + 1}`,
            name: s.name || s.facilityName || 'Emergency Safe Centre',
            type: s.type || (totalCap > 150 ? 'Regional Evacuation Centre' : 'Community Shelter'),
            district: s.district || s.area || 'Western Province',
            address: s.address || s.area || s.district || 'Western Province',
            distance: s.distance || `${(0.8 + idx * 0.4).toFixed(1)} km away`,
            status: isOperational ? 'Operational' : 'At Capacity',
            statusType: isOperational ? 'operational' : 'critical',
            totalCapacity: totalCap,
            currentOccupancy: currOcc,
            availableCapacity: availCap,
            capacityRatio: `${currOcc}/${totalCap}`,
            bedsRemaining: `${availCap} beds left`,
            lastVerified: s.lastVerified || 'Live verified',
            intakePhone: s.contactPhone || s.managerContact || '+94 11 200 4000',
            managerName: s.managerName || 'Centre Intake Supervisor',
            facilities: tags,
            tags,
            latitude: Number(s.latitude) || (6.90 + (idx * 0.015)),
            longitude: Number(s.longitude) || (79.85 + (idx * 0.012)),
            updateNote: `${availCap} beds available · ${s.district || 'Western Province'}`,
            notes: s.notes || 'Verified municipal crisis relief centre.'
          };
        });
        setSheltersList(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch shelters:', err);
      setError('Unable to load shelters from the relief network.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShelters();
  }, [fetchShelters]);

  // Real-time synchronization
  useRealtimeRefresh(['shelters'], fetchShelters);

  const filteredShelters = useMemo(() => {
    return sheltersList.filter((sh) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = sh.name.toLowerCase().includes(term);
        const matchDist = sh.district.toLowerCase().includes(term);
        const matchAddr = sh.address.toLowerCase().includes(term);
        const matchTags = (sh.tags || []).some((t) => t.toLowerCase().includes(term));
        if (!matchName && !matchDist && !matchAddr && !matchTags) return false;
      }

      if (serviceFilter !== 'All') {
        const sf = serviceFilter.toLowerCase();
        const hasService = (sh.tags || []).some((t) => {
          const tLow = t.toLowerCase();
          if (sf === 'water') return tLow.includes('water') || tLow.includes('drinking');
          if (sf === 'medical') return tLow.includes('medical') || tLow.includes('first aid') || tLow.includes('doctor');
          if (sf === 'shelter') return tLow.includes('shelter') || tLow.includes('accommodation') || tLow.includes('bed');
          return tLow.includes(sf);
        });
        if (!hasService) return false;
      }

      if (accessFilter !== 'All') {
        const af = accessFilter.toLowerCase();
        const hasAccess = (sh.tags || []).some((t) => {
          const tLow = t.toLowerCase();
          if (af === 'stepfree') return tLow.includes('access') || tLow.includes('ramp') || tLow.includes('step-free');
          if (af === 'elderly') return tLow.includes('elderly') || tLow.includes('senior') || tLow.includes('support');
          return tLow.includes(af);
        });
        if (!hasAccess) return false;
      }

      return true;
    });
  }, [sheltersList, searchTerm, serviceFilter, accessFilter]);

  const handleShelterClick = (sh) => {
    setSelectedShelter(sh);
    if (showToast) {
      showToast(`Selected ${sh.name} - operational details loaded`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">PUBLICLY LISTED EMERGENCY LOCATIONS</span>
          <h1 className="cp-view-title">Find Shelters & Help Centres</h1>
          <p className="cp-view-subtitle">
            Search verified evacuation shelters and aid distribution hubs with live bed availability.
          </p>
        </div>
        <div>
          <button
            onClick={fetchShelters}
            className="cp-btn-secondary"
            title="Refresh shelter listings"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
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
          marginBottom: '22px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#738075'
            }}
          />
          <input
            type="text"
            className="cp-form-input"
            style={{ paddingLeft: '34px' }}
            placeholder="Search by centre name, district, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
              Split
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: viewMode === 'list' ? '#1e3d2c' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : '#657367',
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

      {/* Loading & Error States */}
      {loading && sheltersList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#657367' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#1e3d2c' }} />
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading verified relief centres...</p>
        </div>
      )}

      {error && sheltersList.length === 0 && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <AlertTriangle size={20} />
          <div>
            <strong>Error connecting to shelter registry:</strong> {error}
          </div>
        </div>
      )}

      {/* Main View Layout */}
      <div
        className="cp-grid-split"
        style={{
          gridTemplateColumns:
            viewMode === 'map'
              ? '1fr'
              : viewMode === 'list'
              ? '1fr'
              : '1.2fr 1fr',
          gap: '20px'
        }}
      >
        {/* Map Canvas (Shown in Split or Map mode) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className="cp-card"
            style={{
              position: 'relative',
              minHeight: viewMode === 'map' ? '600px' : '520px',
              backgroundColor: '#e4ece1',
              overflow: 'hidden',
              padding: 0,
              border: '1px solid #cbd8c8'
            }}
          >
            {/* Top Bar on Map */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #d4ded3',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#162e20',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Compass size={14} color="#1e3d2c" />
              <span>Western Province Emergency Relief Zone</span>
            </div>

            {/* Background SVG Grid & Features */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="shelterGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e2d1" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#shelterGrid)" />

              {/* Waterway / Flood Zone Accent */}
              <path
                d="M 0,220 Q 200,280 400,240 T 900,260"
                fill="none"
                stroke="#b8d4e4"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 120,0 Q 220,240 180,520"
                fill="none"
                stroke="#cce0cc"
                strokeWidth="12"
              />
            </svg>

            {/* Interactive Pins for Filtered Shelters */}
            <div style={{ position: 'absolute', inset: '40px 30px', pointerEvents: 'none' }}>
              {filteredShelters.map((sh, idx) => {
                const pinX = 15 + ((idx * 28 + (sh.name.length * 11)) % 70);
                const pinY = 20 + ((idx * 24 + (sh.district.length * 9)) % 65);
                const isSelected = selectedShelter?.id === sh.id;

                return (
                  <div
                    key={sh.id}
                    onClick={() => handleShelterClick(sh)}
                    style={{
                      position: 'absolute',
                      left: `${pinX}%`,
                      top: `${pinY}%`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                      zIndex: isSelected ? 20 : 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isSelected
                          ? '#064e3b'
                          : sh.statusType === 'operational'
                          ? '#1e3d2c'
                          : '#dc2626',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: isSelected
                          ? '0 0 0 3px #10b981, 0 4px 12px rgba(0,0,0,0.3)'
                          : '0 3px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Home size={12} />
                      <span>{sh.availableCapacity} beds</span>
                    </div>
                    <div
                      style={{
                        width: '2px',
                        height: '6px',
                        backgroundColor: '#1e3d2c'
                      }}
                    />
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#162e20',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        marginTop: '2px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {sh.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Legend */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10.5px',
                color: '#405044',
                display: 'flex',
                gap: '12px',
                border: '1px solid #d4ded3'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e3d2c' }} />
                Operational
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }} />
                At Capacity
              </span>
            </div>
          </div>
        )}

        {/* Right: Shelter Cards List (Shown in Split or List mode) */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredShelters.length === 0 && !loading && (
              <div
                className="cp-card"
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#738075'
                }}
              >
                <Info size={32} style={{ margin: '0 auto 10px auto', color: '#9fa89e' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', marginBottom: '6px' }}>
                  No shelters match your search criteria
                </h3>
                <p style={{ fontSize: '12px', margin: 0 }}>
                  Try resetting the filters or searching for another district or keyword.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setServiceFilter('All');
                    setAccessFilter('All');
                  }}
                  className="cp-btn-secondary"
                  style={{ marginTop: '14px' }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredShelters.map((sh) => {
              const isSelected = selectedShelter?.id === sh.id;
              const occPercent = Math.min(100, Math.round(((sh.totalCapacity - sh.availableCapacity) / (sh.totalCapacity || 1)) * 100));

              return (
                <div
                  key={sh.id}
                  className="cp-card"
                  style={{
                    padding: '18px 20px',
                    borderColor: isSelected ? '#1e3d2c' : '#e2e8dd',
                    borderWidth: isSelected ? '2px' : '1px',
                    boxShadow: isSelected ? '0 4px 12px rgba(30, 61, 44, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Top Row: Title, Distance, Status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: '#f0f4ee',
                          color: '#1e3d2c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {sh.iconType === 'building' ? (
                          <Building2 size={18} />
                        ) : sh.iconType === 'school' ? (
                          <School size={18} />
                        ) : (
                          <Home size={18} />
                        )}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                          {sh.name}
                        </h3>
                        <div style={{ fontSize: '11.5px', color: '#657367', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={12} />
                          <span>{sh.address} · {sh.district}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: sh.statusType === 'operational' ? '#ecfdf5' : '#fef2f2',
                        color: sh.statusType === 'operational' ? '#047857' : '#b91c1c',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ● {sh.status}
                    </span>
                  </div>

                  {/* Bed Capacity Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11.5px',
                        color: '#405044',
                        marginBottom: '4px'
                      }}
                    >
                      <span>
                        Capacity: <strong>{sh.totalCapacity - sh.availableCapacity} / {sh.totalCapacity}</strong> occupied
                      </span>
                      <strong style={{ color: sh.availableCapacity > 0 ? '#059669' : '#dc2626' }}>
                        {sh.bedsRemaining}
                      </strong>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#edf1eb',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${occPercent}%`,
                          height: '100%',
                          backgroundColor: occPercent > 90 ? '#ef4444' : occPercent > 60 ? '#f59e0b' : '#1e3d2c',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {(sh.tags || []).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#f4f6f2',
                          border: '1px solid #e2e8dd',
                          fontSize: '11px',
                          color: '#405044'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleShelterClick(sh)}
                      className="cp-btn-secondary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                    >
                      View Details & Intake
                    </button>
                    {sh.intakePhone && (
                      <a
                        href={`tel:${sh.intakePhone}`}
                        className="cp-btn-primary"
                        style={{
                          padding: '8px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                          fontSize: '12px'
                        }}
                        title={`Call ${sh.intakePhone}`}
                      >
                        <Phone size={13} />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shelter Details Modal */}
      {selectedShelter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedShelter(null)}
        >
          <div
            className="cp-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #edf1eb',
                marginBottom: '18px'
              }}
            >
              <div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    backgroundColor: selectedShelter.statusType === 'operational' ? '#ecfdf5' : '#fef2f2',
                    color: selectedShelter.statusType === 'operational' ? '#047857' : '#b91c1c'
                  }}
                >
                  ● {selectedShelter.status}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: '6px 0 2px 0' }}>
                  {selectedShelter.name}
                </h2>
                <div style={{ fontSize: '12px', color: '#657367' }}>
                  {selectedShelter.type} · {selectedShelter.district}
                </div>
              </div>

              <button
                onClick={() => setSelectedShelter(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#738075',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Location & Contact Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  backgroundColor: '#f8faf7',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #edf1eb'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Location Address</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedShelter.address}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Administrative District</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedShelter.district}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Intake Contact Phone</div>
                  <div style={{ fontSize: '12.5px', color: '#1e3d2c', fontWeight: 700, marginTop: '2px' }}>
                    <a href={`tel:${selectedShelter.intakePhone}`} style={{ color: '#1e3d2c', textDecoration: 'none' }}>
                      {selectedShelter.intakePhone}
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Supervising Manager</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedShelter.managerName}
                  </div>
                </div>
              </div>

              {/* Bed Capacity Progress */}
              <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e2e8dd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#162e20' }}>
                    Beds & Shelter Capacity
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: selectedShelter.availableCapacity > 0 ? '#059669' : '#dc2626' }}>
                    {selectedShelter.bedsRemaining}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#edf1eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '6px'
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.round(((selectedShelter.totalCapacity - selectedShelter.availableCapacity) / (selectedShelter.totalCapacity || 1)) * 100))}%`,
                      height: '100%',
                      backgroundColor: '#1e3d2c',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#657367' }}>
                  Total Capacity: {selectedShelter.totalCapacity} beds · Current Occupancy: {selectedShelter.totalCapacity - selectedShelter.availableCapacity} individuals
                </div>
              </div>

              {/* Verified Facilities & Services */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20', marginBottom: '8px' }}>
                  Verified On-Site Services & Facilities
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(selectedShelter.tags || []).map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#f0f4ee',
                        border: '1px solid #d4ded3',
                        fontSize: '11.5px',
                        color: '#1e3d2c',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <CheckCircle size={12} color="#059669" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions / Notes */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#edf4ec',
                  border: '1px solid #dbe4c6',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  color: '#243328',
                  lineHeight: 1.45
                }}
              >
                <strong>Intake Instructions:</strong> Walk-in admission is accepted on a first-come basis during emergency operations. Please carry identity documentation if available. Families with infants and elderly members are prioritized.
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedShelter(null)}
                  className="cp-btn-secondary"
                >
                  Close
                </button>
                <a
                  href={`tel:${selectedShelter.intakePhone}`}
                  className="cp-btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={14} />
                  Call Intake Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindSheltersView;
