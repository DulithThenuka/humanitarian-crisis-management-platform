import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  ShieldAlert,
  Building2,
  RefreshCw,
  Layers,
  Compass,
  AlertTriangle,
  Users,
  Navigation,
  Info
} from 'lucide-react';
import { crisisService } from '../../../services/crisisService';
import { shelterService } from '../../../services/shelterService';

// Fix Leaflet Default Icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;

const createMarkerIcon = (color, type) => {
  const iconSymbol = type === 'crisis' ? '⚠️' : '🏠';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #ffffff;
      ">
        ${iconSymbol}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

const DISTRICT_PRESETS = [
  { id: 'all', label: 'Western Province (All)', center: [6.85, 79.95], zoom: 10 },
  { id: 'colombo', label: 'Colombo Zone (Red Alert)', center: [6.9271, 79.8612], zoom: 12 },
  { id: 'gampaha', label: 'Gampaha Zone (High Inundation)', center: [7.0840, 79.9946], zoom: 12 },
  { id: 'kalutara', label: 'Kalutara Basin (Monitoring)', center: [6.5854, 79.9607], zoom: 12 }
];

export const AdminMapView = ({ showToast }) => {
  const [crises, setCrises] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Map Controls
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_PRESETS[0]);
  const [layers, setLayers] = useState({
    crises: true,
    shelters: true,
    hazardRadius: true
  });

  const [selectedFeature, setSelectedFeature] = useState(null);

  const loadGeoData = async () => {
    setLoading(true);
    try {
      const [crisesRes, sheltersRes] = await Promise.all([
        crisisService.getCrises(),
        shelterService.getShelters()
      ]);

      if (crisesRes?.succeeded && Array.isArray(crisesRes.data)) {
        setCrises(crisesRes.data);
      } else if (Array.isArray(crisesRes?.data)) {
        setCrises(crisesRes.data);
      } else if (Array.isArray(crisesRes)) {
        setCrises(crisesRes);
      }

      if (sheltersRes?.succeeded && Array.isArray(sheltersRes.data)) {
        setShelters(sheltersRes.data);
      } else if (Array.isArray(sheltersRes?.data)) {
        setShelters(sheltersRes.data);
      } else if (Array.isArray(sheltersRes)) {
        setShelters(sheltersRes);
      }
    } catch {
      showToast('Error loading geospatial crisis and shelter locations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGeoData();
  }, []);

  // Filter features with valid coordinates safely
  const safeCrises = Array.isArray(crises) ? crises : [];
  const safeShelters = Array.isArray(shelters) ? shelters : [];
  const validCrises = safeCrises.filter(c => c && c.latitude && c.longitude);
  const validShelters = safeShelters.filter(s => s && s.latitude && s.longitude);

  return (
    <div className="space-y-6">
      {/* 1. Map Toolbar & District Filter */}
      <div className="adm-ss-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-700 mr-1 flex items-center gap-1.5">
              <Compass size={15} className="text-[#0e7490]" />
              Geographic Focus:
            </span>
            {DISTRICT_PRESETS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  selectedDistrict.id === d.id
                    ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Layers size={14} /> Layers:
            </span>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.crises}
                onChange={() => setLayers(p => ({ ...p, crises: !p.crises }))}
                className="rounded accent-rose-600"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span>Crises ({validCrises.length})</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.shelters}
                onChange={() => setLayers(p => ({ ...p, shelters: !p.shelters }))}
                className="rounded accent-emerald-600"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Shelters ({validShelters.length})</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.hazardRadius}
                onChange={() => setLayers(p => ({ ...p, hazardRadius: !p.hazardRadius }))}
                className="rounded accent-purple-600"
              />
              <span>Hazard Radii</span>
            </label>

            <button
              onClick={loadGeoData}
              disabled={loading}
              className="adm-ss-btn-reset flex items-center gap-1.5 ml-2"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Map Canvas & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Canvas (2 Columns) */}
        <div className="lg:col-span-2 adm-ss-card p-0 overflow-hidden relative" style={{ minHeight: '520px' }}>
          <MapContainer
            center={selectedDistrict.center}
            zoom={selectedDistrict.zoom}
            scrollWheelZoom={true}
            style={{ height: '520px', width: '100%', zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={selectedDistrict.center} zoom={selectedDistrict.zoom} />

            {/* Crisis Markers */}
            {layers.crises &&
              validCrises.map(crisis => (
                <React.Fragment key={crisis.id}>
                  <Marker
                    position={[crisis.latitude, crisis.longitude]}
                    icon={createMarkerIcon('#e11d48', 'crisis')}
                    eventHandlers={{
                      click: () =>
                        setSelectedFeature({
                          type: 'Crisis Event',
                          title: crisis.title,
                          category: crisis.disasterTypeName || 'Disaster Event',
                          severity: crisis.severityLabel || 'Critical',
                          district: crisis.region || 'Western Province',
                          affected: crisis.estimatedAffectedCount ? `${crisis.estimatedAffectedCount.toLocaleString()} Citizens` : 'Pending Assessment',
                          leadTeam: crisis.assignedLeadTeam || 'Alpha Rescue Unit 4 (Colombo)',
                          status: crisis.status || 'Active Response',
                          description: crisis.description
                        })
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 space-y-1">
                        <span className="font-bold text-rose-700 block text-sm">{crisis.title}</span>
                        <span className="text-slate-600 block">{crisis.region}</span>
                        <div className="pt-1 flex items-center gap-1 font-semibold text-rose-600">
                          <span>Severity: {crisis.severityLabel}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Hazard Radius */}
                  {layers.hazardRadius && crisis.affectedAreaRadius && (
                    <Circle
                      center={[crisis.latitude, crisis.longitude]}
                      radius={(crisis.affectedAreaRadius || 5) * 1000}
                      pathOptions={{
                        color: '#e11d48',
                        fillColor: '#f43f5e',
                        fillOpacity: 0.15,
                        weight: 1.5,
                        dashArray: '4, 4'
                      }}
                    />
                  )}
                </React.Fragment>
              ))}

            {/* Shelter Markers */}
            {layers.shelters &&
              validShelters.map(shelter => (
                <Marker
                  key={shelter.id}
                  position={[shelter.latitude, shelter.longitude]}
                  icon={createMarkerIcon('#059669', 'shelter')}
                  eventHandlers={{
                    click: () =>
                      setSelectedFeature({
                        type: 'High-Ground Shelter',
                        title: shelter.name,
                        category: 'Emergency Shelter Facility',
                        severity: shelter.isActive ? 'Active Shelter' : 'Standby',
                        district: shelter.district || 'Western Province',
                        affected: `${shelter.currentOccupancy || 0} / ${shelter.totalCapacity || 100} Beds Occupied`,
                        leadTeam: shelter.contactPerson || 'District Grama Niladhari',
                        status: `${Math.max(0, (shelter.totalCapacity || 0) - (shelter.currentOccupancy || 0))} Beds Available`,
                        description: shelter.address
                      })
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1 space-y-1">
                      <span className="font-bold text-emerald-700 block text-sm">{shelter.name}</span>
                      <span className="text-slate-600 block">{shelter.address}</span>
                      <div className="pt-1 font-semibold text-emerald-600">
                        Occupancy: {shelter.currentOccupancy} / {shelter.totalCapacity} Beds
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* Feature Inspector Panel (1 Column) */}
        <div className="adm-ss-card space-y-4">
          <div className="adm-ss-card-header">
            <div>
              <h3 className="adm-ss-card-title flex items-center gap-2">
                <Navigation size={16} className="text-[#0e7490]" />
                Geospatial Asset Inspector
              </h3>
              <p className="adm-ss-card-subtitle">Click any hazard or shelter node to inspect operational telemetry</p>
            </div>
          </div>

          {selectedFeature ? (
            <div className="space-y-3.5 text-xs animate-fade-scale">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0e7490]/10 text-[#0e7490] uppercase tracking-wider">
                  {selectedFeature.type}
                </span>
                <h4 className="font-bold text-sm text-slate-900 pt-1">{selectedFeature.title}</h4>
                <p className="text-[11px] text-slate-500">{selectedFeature.district}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold">{selectedFeature.category}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700">
                  <span className="text-slate-500">Status / Severity:</span>
                  <span className="font-bold text-rose-700">{selectedFeature.severity}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700">
                  <span className="text-slate-500">Capacity / Affected:</span>
                  <span className="font-semibold text-slate-900">{selectedFeature.affected}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-700">
                  <span className="text-slate-500">Responsible Unit:</span>
                  <span className="font-semibold text-[#0e7490]">{selectedFeature.leadTeam}</span>
                </div>
              </div>

              {selectedFeature.description && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-1">Field Situation Note:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{selectedFeature.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <MapPin size={32} className="mx-auto text-slate-300" />
              <p className="text-xs">Select any marker on the map to review real-time field information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMapView;
