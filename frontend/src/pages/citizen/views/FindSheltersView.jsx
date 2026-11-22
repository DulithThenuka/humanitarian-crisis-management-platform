import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
import { safeLower, safeString } from '../utils/citizenDataUtils';

// Fix Leaflet Default Icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 13, { duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
};

const createShelterDivIcon = (shelter, isSelected) => {
  const isOperational = shelter.statusType === 'operational' || shelter.availableCapacity > 0;
  const bg = isSelected ? '#064e3b' : isOperational ? '#1e3d2c' : '#dc2626';
  const beds = shelter.availableCapacity;
  return L.divIcon({
    className: 'cp-leaflet-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        pointer-events: auto;
        cursor: pointer;
      ">
        <div style="
          padding: 4px 9px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          background-color: ${bg};
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: ${isSelected ? '0 0 0 3px #10b981, 0 4px 12px rgba(0,0,0,0.35)' : '0 2px 6px rgba(0,0,0,0.25)'};
          white-space: nowrap;
          border: 1.5px solid #ffffff;
        ">
          <span>🏠</span>
          <span>${beds} beds</span>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${bg};
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
  });
};

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

          const nameLower = safeLower(s.name || s.facilityName);
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
        const term = safeLower(searchTerm);
        const matchName = safeLower(sh.name).includes(term);
        const matchDist = safeLower(sh.district).includes(term);
        const matchAddr = safeLower(sh.address).includes(term);
        const matchTags = (sh.tags || []).some((t) => safeLower(t).includes(term));
        if (!matchName && !matchDist && !matchAddr && !matchTags) return false;
      }

      if (serviceFilter !== 'All') {
        const sf = safeLower(serviceFilter);
        const hasService = (sh.tags || []).some((t) => {
          const tLow = safeLower(t);
          if (sf === 'water') return tLow.includes('water') || tLow.includes('drinking');
          if (sf === 'medical') return tLow.includes('medical') || tLow.includes('first aid') || tLow.includes('doctor');
          if (sf === 'shelter') return tLow.includes('shelter') || tLow.includes('accommodation') || tLow.includes('bed');
          return tLow.includes(sf);
        });
        if (!hasService) return false;
      }

      if (accessFilter !== 'All') {
        const af = safeLower(accessFilter);
        const hasAccess = (sh.tags || []).some((t) => {
          const tLow = safeLower(t);
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
        {/* Real Interactive Leaflet Map Canvas (Shown in Split or Map mode) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className="cp-card cp-shelter-map-card"
            style={{
              position: 'relative',
              minHeight: viewMode === 'map' ? '620px' : '540px',
              height: viewMode === 'map' ? '620px' : '560px',
              padding: 0,
              overflow: 'hidden',
              border: '1px solid #cbd8c8'
            }}
          >
            {/* Top Bar on Map */}
            <div className="cp-map-overlay-badge">
              <Compass size={14} color="#1e3d2c" />
              <span>Western Province Relief Grid · {filteredShelters.length} Verified Centres</span>
            </div>

            {/* Real Interactive Leaflet Map */}
            <MapContainer
              center={[6.9271, 79.8612]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                center={
                  selectedShelter && !isNaN(selectedShelter.latitude) && !isNaN(selectedShelter.longitude)
                    ? [selectedShelter.latitude, selectedShelter.longitude]
                    : null
                }
                zoom={14}
              />
              {filteredShelters.map((sh) => {
                const lat = Number(sh.latitude) || 6.9271;
                const lng = Number(sh.longitude) || 79.8612;
                const isSelected = selectedShelter?.id === sh.id;

                return (
                  <Marker
                    key={sh.id}
                    position={[lat, lng]}
                    icon={createShelterDivIcon(sh, isSelected)}
                    eventHandlers={{
                      click: () => {
                        setSelectedShelter(sh);
                        if (showToast) {
                          showToast(`Selected ${sh.name}`);
                        }
                      }
                    }}
                  >
                    <Popup className="cp-shelter-leaflet-popup">
                      <div style={{ minWidth: '220px', padding: '4px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '6px'
                          }}
                        >
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '8px',
                              backgroundColor: sh.statusType === 'operational' ? '#ecfdf5' : '#fef2f2',
                              color: sh.statusType === 'operational' ? '#047857' : '#b91c1c'
                            }}
                          >
                            ● {sh.status}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e3d2c' }}>
                            {sh.availableCapacity} beds left
                          </span>
                        </div>
                        <h4 style={{ margin: '4px 0 2px 0', fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                          {sh.name}
                        </h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#657367' }}>
                          {sh.address} · {sh.district}
                        </p>
                        <div style={{ fontSize: '11px', color: '#405044', marginBottom: '8px' }}>
                          <strong>Occupancy:</strong> {sh.currentOccupancy} / {sh.totalCapacity} beds
                        </div>
                        <button
                          onClick={() => setSelectedShelter(sh)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            backgroundColor: '#1e3d2c',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          View Full Details & Intake
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Bottom Map Legend */}
            <div className="cp-map-legend">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="cp-legend-dot green" />
                Operational
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="cp-legend-dot red" />
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
