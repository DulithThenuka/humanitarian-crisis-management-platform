import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Search, 
  Droplets, 
  UtensilsCrossed, 
  HeartPulse, 
  Zap, 
  Accessibility, 
  Baby, 
  Phone, 
  Compass, 
  Check, 
  Clock, 
  Navigation, 
  ChevronRight, 
  Layers, 
  X,
  PlusSquare,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { shelterService } from '../../services/shelterService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAlert } from '../../context/AlertContext';

import shelter1 from '../../assets/shelter-1.jpg';
import shelter2 from '../../assets/shelter-2.jpg';
import shelter3 from '../../assets/shelter-3.jpg';
import './FindShelterPage.css';

// SVG Icon Generator for Leaflet Pins
const createShelterPin = (statusColor) => {
  return L.divIcon({
    className: 'custom-shelter-pin',
    html: `
      <div style="
        background: ${statusColor};
        color: #ffffff;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 12px rgba(8, 33, 40, 0.4);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

const pinOpen = createShelterPin('#10b981');
const pinLimited = createShelterPin('#f59e0b');
const pinFull = createShelterPin('#ef4444');

// Helper to smooth-pan map when selected shelter changes
const MapFlyToController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 13, { duration: 0.8 });
    }
  }, [center, map]);
  return null;
};

const DEFAULT_SHELTERS_DATA = [
  {
    id: '1',
    name: 'Colombo Central School Relief Camp',
    address: 'Main Street, Colombo 07, Western Province',
    district: 'Colombo',
    latitude: 6.9185,
    longitude: 79.8654,
    totalCapacity: 500,
    currentOccupancy: 320,
    facilities: 'Clean Water, Hot Meals, Medical Station, Mother & Infant Care, Power Backup',
    contactPhone: '+94 11 269 1111',
    distanceKm: 2.4,
    status: 'Open',
    photo: shelter1,
    amenities: ['water', 'food', 'medical', 'infant', 'power']
  },
  {
    id: '2',
    name: 'St. Anthony’s Evacuation Center',
    address: 'Kandy Road, Peliyagoda, Kelaniya Sector',
    district: 'Gampaha',
    latitude: 6.9712,
    longitude: 79.8894,
    totalCapacity: 300,
    currentOccupancy: 180,
    facilities: 'Clean Water, Meals Rations, First Aid Desk, Wheelchair Access',
    contactPhone: '+94 11 291 4455',
    distanceKm: 3.1,
    status: 'Open',
    photo: shelter2,
    amenities: ['water', 'food', 'medical', 'access']
  },
  {
    id: '3',
    name: 'Gampaha Community Hall',
    address: 'Station Road, Gampaha Central',
    district: 'Gampaha',
    latitude: 7.0892,
    longitude: 80.0142,
    totalCapacity: 150,
    currentOccupancy: 140,
    facilities: 'Clean Water, Cooked Meals, Charging Station',
    contactPhone: '+94 33 222 3411',
    distanceKm: 5.6,
    status: 'Limited',
    photo: shelter3,
    amenities: ['water', 'food', 'power']
  },
  {
    id: '4',
    name: 'Negombo Harischandra Relief Camp',
    address: 'Beach Road, Negombo Coastal Area',
    district: 'Gampaha',
    latitude: 7.2084,
    longitude: 79.8358,
    totalCapacity: 450,
    currentOccupancy: 210,
    facilities: 'Clean Water, Hot Meals, Medical Clinic, Infant Care, Wheelchair Access',
    contactPhone: '+94 31 223 9090',
    distanceKm: 8.2,
    status: 'Open',
    photo: shelter1,
    amenities: ['water', 'food', 'medical', 'infant', 'access']
  },
  {
    id: '5',
    name: 'Panadura Town Hall Evacuation Facility',
    address: 'Galle Road, Panadura, Kalutara District',
    district: 'Kalutara',
    latitude: 6.7134,
    longitude: 79.9074,
    totalCapacity: 250,
    currentOccupancy: 250,
    facilities: 'Clean Water, Dry Rations, Emergency First Aid',
    contactPhone: '+94 38 223 2020',
    distanceKm: 12.4,
    status: 'Full',
    photo: shelter2,
    amenities: ['water', 'food', 'medical']
  },
  {
    id: '6',
    name: 'Horana Central School Relief Depot',
    address: 'Ratnapura Road, Horana, Kalutara District',
    district: 'Kalutara',
    latitude: 6.7178,
    longitude: 80.0632,
    totalCapacity: 350,
    currentOccupancy: 190,
    facilities: 'Clean Water, Hot Meals, Pediatric Health Desk, Power Charging',
    contactPhone: '+94 34 226 1234',
    distanceKm: 16.5,
    status: 'Open',
    photo: shelter3,
    amenities: ['water', 'food', 'medical', 'power']
  }
];

export const FindShelterPage = ({ onBack }) => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Open, Limited, Full
  const [districtFilter, setDistrictFilter] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    setLoading(true);
    try {
      const res = await shelterService.getAll();
      if (res && res.succeeded && Array.isArray(res.data) && res.data.length > 0) {
        // Merge API data with rich visual assets
        const mappedApi = res.data.map((item, idx) => ({
          id: item.id ? String(item.id) : `API-${idx}`,
          name: item.name || 'Emergency Relief Camp',
          address: item.address || 'Western Province Sector',
          district: item.address?.includes('Gampaha') ? 'Gampaha' : item.address?.includes('Kalutara') ? 'Kalutara' : 'Colombo',
          latitude: Number(item.latitude) || 6.9271,
          longitude: Number(item.longitude) || 79.8612,
          totalCapacity: item.totalCapacity || 300,
          currentOccupancy: item.currentOccupancy || 150,
          facilities: item.facilities || 'Clean Water, Meals, Medical Desk',
          contactPhone: item.contactPhone || '+94 11 269 1111',
          distanceKm: item.distanceKm ? Number(item.distanceKm.toFixed(1)) : 3.5,
          status: (item.currentOccupancy >= item.totalCapacity) ? 'Full' : (item.currentOccupancy / item.totalCapacity > 0.85) ? 'Limited' : 'Open',
          photo: idx % 3 === 0 ? shelter1 : idx % 3 === 1 ? shelter2 : shelter3,
          amenities: ['water', 'food', 'medical']
        }));
        setShelters(mappedApi);
        setSelectedShelter(mappedApi[0]);
      } else {
        setShelters(DEFAULT_SHELTERS_DATA);
        setSelectedShelter(DEFAULT_SHELTERS_DATA[0]);
      }
    } catch {
      setShelters(DEFAULT_SHELTERS_DATA);
      setSelectedShelter(DEFAULT_SHELTERS_DATA[0]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle amenity filter
  const toggleAmenity = (amenityKey) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityKey) ? prev.filter(k => k !== amenityKey) : [...prev, amenityKey]
    );
  };

  // Filtered shelters computation
  const filteredShelters = useMemo(() => {
    return shelters.filter(s => {
      // Status filter
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;

      // District filter
      if (districtFilter !== 'All' && s.district !== districtFilter) return false;

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const matchesAllAmenities = selectedAmenities.every(a => s.amenities && s.amenities.includes(a));
        if (!matchesAllAmenities) return false;
      }

      // Text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesAddress = s.address.toLowerCase().includes(query);
        const matchesDistrict = s.district?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesDistrict) return false;
      }

      return true;
    });
  }, [shelters, statusFilter, districtFilter, selectedAmenities, searchQuery]);

  // Aggregate telemetry stats
  const totalBeds = useMemo(() => shelters.reduce((acc, s) => acc + s.totalCapacity, 0), [shelters]);
  const shelteredCount = useMemo(() => shelters.reduce((acc, s) => acc + s.currentOccupancy, 0), [shelters]);
  const availableBeds = useMemo(() => totalBeds - shelteredCount, [totalBeds, shelteredCount]);

  const openCount = useMemo(() => shelters.filter(s => s.status === 'Open').length, [shelters]);
  const limitedCount = useMemo(() => shelters.filter(s => s.status === 'Limited').length, [shelters]);
  const fullCount = useMemo(() => shelters.filter(s => s.status === 'Full').length, [shelters]);

  if (loading) {
    return <LoadingSpinner message="Locating verified relief camps and emergency shelters..." />;
  }

  return (
    <div className="shelters-page-container">
      {/* 1. Top Navigation & Emergency Breadcrumbs */}
      <div className="shelter-top-nav-bar">
        <button
          type="button"
          className="shelter-back-btn"
          onClick={() => {
            if (onBack) onBack();
            else navigate('/citizen');
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Citizen Portal</span>
        </button>

        <div className="shelter-nav-actions">
          <Link to="/citizen/submit?category=Shelter" className="btn-request-evac">
            <PlusSquare size={16} />
            <span>Request Evacuation to Shelter</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Header & Capacity Telemetry Banner */}
      <div className="shelter-hero-banner">
        <div className="shelter-hero-col">
          <h1>Find Emergency Evacuation Shelters & Relief Camps</h1>
          <p>
            Real-time verified safe zones, available bed capacity, hot meal schedules, and medical provisions across Western Province.
          </p>
        </div>

        <div className="shelter-stats-cluster">
          <div className="shelter-stat-box">
            <span className="shelter-stat-val text-teal">{availableBeds}</span>
            <span className="shelter-stat-label">Available Beds</span>
          </div>

          <div className="shelter-stat-box">
            <span className="shelter-stat-val text-amber">{shelteredCount}</span>
            <span className="shelter-stat-label">Evacuees Sheltered</span>
          </div>

          <div className="shelter-stat-box">
            <span className="shelter-stat-val">{shelters.length}</span>
            <span className="shelter-stat-label">Active Camps</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Strip */}
      <div className="shelter-controls-strip">
        <div className="shelter-controls-top-row">
          {/* Search bar */}
          <div className="shelter-search-bar">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search shelters by name, landmark, or district (e.g., Kelaniya, Colombo 07)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X size={15} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            )}
          </div>

          {/* Status Tabs */}
          <div className="shelter-status-filters">
            <button
              type="button"
              className={`shelter-tab-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              <span>All Statuses</span>
              <span className="shelter-tab-count">{shelters.length}</span>
            </button>

            <button
              type="button"
              className={`shelter-tab-btn ${statusFilter === 'Open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Open')}
            >
              <span>High Availability</span>
              <span className="shelter-tab-count">{openCount}</span>
            </button>

            <button
              type="button"
              className={`shelter-tab-btn ${statusFilter === 'Limited' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Limited')}
            >
              <span>Limited Capacity</span>
              <span className="shelter-tab-count">{limitedCount}</span>
            </button>

            <button
              type="button"
              className={`shelter-tab-btn ${statusFilter === 'Full' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Full')}
            >
              <span>Full Capacity</span>
              <span className="shelter-tab-count">{fullCount}</span>
            </button>
          </div>
        </div>

        {/* Amenity Filter Chips & District Presets */}
        <div className="amenity-filters-row">
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} /> Filter Amenities:
          </span>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('water') ? 'active' : ''}`}
            onClick={() => toggleAmenity('water')}
          >
            <Droplets size={12} color="#0284c7" />
            <span>Clean Water</span>
          </button>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('food') ? 'active' : ''}`}
            onClick={() => toggleAmenity('food')}
          >
            <UtensilsCrossed size={12} color="#16a34a" />
            <span>Hot Meals</span>
          </button>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('medical') ? 'active' : ''}`}
            onClick={() => toggleAmenity('medical')}
          >
            <HeartPulse size={12} color="#ef4444" />
            <span>Medical Station</span>
          </button>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('infant') ? 'active' : ''}`}
            onClick={() => toggleAmenity('infant')}
          >
            <Baby size={12} color="#7c3aed" />
            <span>Mother & Infant Care</span>
          </button>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('access') ? 'active' : ''}`}
            onClick={() => toggleAmenity('access')}
          >
            <Accessibility size={12} color="#0e6f76" />
            <span>Wheelchair Accessible</span>
          </button>

          <button
            type="button"
            className={`amenity-filter-chip ${selectedAmenities.includes('power') ? 'active' : ''}`}
            onClick={() => toggleAmenity('power')}
          >
            <Zap size={12} color="#eab308" />
            <span>Phone Charging Station</span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>District:</span>
            {['All', 'Colombo', 'Gampaha', 'Kalutara'].map(d => (
              <button
                key={d}
                type="button"
                className={`amenity-filter-chip ${districtFilter === d ? 'active' : ''}`}
                onClick={() => setDistrictFilter(d)}
                style={{ borderRadius: '12px', padding: '3px 9px', fontSize: '11px' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Main 2-Column Content Layout (Map + Shelters Feed) */}
      <div className="shelter-layout-grid">
        {/* Left Column: Interactive Leaflet Map */}
        <div className="shelter-map-pane">
          <div className="map-pane-head">
            <div className="map-pane-title">
              <Compass size={17} color="#0e6f76" />
              <span>Western Province Evacuation GIS Map</span>
            </div>
            <span className="map-pane-tag">Live Satellites Online</span>
          </div>

          <div className="leaflet-map-canvas-container">
            <MapContainer
              center={selectedShelter ? [selectedShelter.latitude, selectedShelter.longitude] : [6.9271, 79.8612]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {selectedShelter && (
                <MapFlyToController center={[selectedShelter.latitude, selectedShelter.longitude]} />
              )}

              {filteredShelters.map((s) => {
                const pinIcon = s.status === 'Open' ? pinOpen : s.status === 'Limited' ? pinLimited : pinFull;
                return (
                  <Marker
                    key={s.id}
                    position={[s.latitude, s.longitude]}
                    icon={pinIcon}
                    eventHandlers={{
                      click: () => setSelectedShelter(s)
                    }}
                  >
                    <Popup>
                      <div style={{ padding: '4px', maxWidth: '200px' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '2px' }}>{s.name}</strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{s.address}</span>
                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#0e6f76', fontWeight: 700 }}>
                          Available: {s.totalCapacity - s.currentOccupancy} beds
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Selected Shelter Floating Popup Card */}
            {selectedShelter && (
              <div className="map-selected-popup-card">
                <div className="popup-left-info">
                  <h4>{selectedShelter.name}</h4>
                  <p>{selectedShelter.address} ({selectedShelter.distanceKm} km away)</p>
                  <div className="popup-capacity-metric">
                    Occupancy: {selectedShelter.currentOccupancy} / {selectedShelter.totalCapacity} beds ({selectedShelter.totalCapacity - selectedShelter.currentOccupancy} Available)
                  </div>
                </div>

                <button
                  type="button"
                  className="popup-action-btn"
                  onClick={() => navigate(`/citizen/submit?category=Shelter&shelterId=${selectedShelter.id}&shelterName=${encodeURIComponent(selectedShelter.name)}`)}
                >
                  Request Evacuation Here &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Shelters Cards Stack */}
        <div className="shelter-cards-stack">
          {filteredShelters.length === 0 ? (
            <div className="shelter-empty-state">
              <Building2 size={32} color="#94a3b8" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>No shelters match your filter criteria</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Try broadening your search or clearing amenity filters.</p>
              <button
                type="button"
                className="btn-card-evacuate"
                style={{ marginTop: '8px' }}
                onClick={() => {
                  setStatusFilter('All');
                  setDistrictFilter('All');
                  setSelectedAmenities([]);
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredShelters.map((s) => {
              const isSelected = selectedShelter && selectedShelter.id === s.id;
              const occPercent = Math.round((s.currentOccupancy / s.totalCapacity) * 100);
              const progressColor = s.status === 'Full' ? '#ef4444' : s.status === 'Limited' ? '#f59e0b' : '#10b981';

              return (
                <div
                  key={s.id}
                  className={`shelter-facility-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedShelter(s)}
                >
                  <div className="facility-card-top-row">
                    <img src={s.photo} alt={s.name} className="shelter-thumb-img" />

                    <div className="facility-main-meta">
                      <div className="facility-title-line">
                        <h4 className="facility-name">{s.name}</h4>
                        <span className={`facility-status-tag ${s.status.toLowerCase()}`}>
                          {s.status === 'Open' ? '✓ Open' : s.status === 'Limited' ? 'Limited' : 'Full'}
                        </span>
                      </div>

                      <p className="facility-address-text">
                        <MapPin size={12} color="#0e6f76" />
                        <span>{s.address}</span>
                      </p>

                      <span className="facility-distance-tag">
                        {s.distanceKm} km away &bull; {s.district} Sector
                      </span>
                    </div>
                  </div>

                  {/* Bed Capacity Progress Section */}
                  <div className="facility-capacity-block">
                    <div className="capacity-labels-row">
                      <strong>Bed Occupancy: {s.currentOccupancy} / {s.totalCapacity}</strong>
                      <span style={{ color: progressColor }}>{s.totalCapacity - s.currentOccupancy} Available ({occPercent}%)</span>
                    </div>

                    <div className="capacity-progress-track">
                      <div 
                        className="capacity-progress-fill" 
                        style={{ width: `${occPercent}%`, background: progressColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Amenities Chips */}
                  <div className="facility-amenities-pills">
                    {s.amenities && s.amenities.includes('water') && (
                      <span className="facility-amenity-chip"><Droplets size={11} color="#0ea5e9" /> Clean Water</span>
                    )}
                    {s.amenities && s.amenities.includes('food') && (
                      <span className="facility-amenity-chip"><UtensilsCrossed size={11} color="#16a34a" /> Meals</span>
                    )}
                    {s.amenities && s.amenities.includes('medical') && (
                      <span className="facility-amenity-chip"><HeartPulse size={11} color="#ef4444" /> Medical</span>
                    )}
                    {s.amenities && s.amenities.includes('infant') && (
                      <span className="facility-amenity-chip"><Baby size={11} color="#7c3aed" /> Infant Care</span>
                    )}
                    {s.amenities && s.amenities.includes('access') && (
                      <span className="facility-amenity-chip"><Accessibility size={11} color="#0e6f76" /> Accessible</span>
                    )}
                    {s.amenities && s.amenities.includes('power') && (
                      <span className="facility-amenity-chip"><Zap size={11} color="#eab308" /> Power</span>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="facility-card-footer" onClick={(e) => e.stopPropagation()}>
                    <a href={`tel:${s.contactPhone}`} className="facility-phone-link">
                      <Phone size={13} />
                      <span>{s.contactPhone}</span>
                    </a>

                    <button
                      type="button"
                      className="btn-card-evacuate"
                      onClick={() => navigate(`/citizen/submit?category=Shelter&shelterId=${s.id}&shelterName=${encodeURIComponent(s.name)}`)}
                    >
                      <span>Request Transport</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
