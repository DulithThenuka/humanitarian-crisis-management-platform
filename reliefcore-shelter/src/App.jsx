import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

export default function App() {
  const [activeTab, setActiveTab] = useState('shelters');
  const [theme, setTheme] = useState(localStorage.getItem('reliefcore_theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  // Modal States
  const [isShelterModalOpen, setIsShelterModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Edit IDs
  const [editingShelterId, setEditingShelterId] = useState(null);
  const [editingVolunteerId, setEditingVolunteerId] = useState(null);
  const [editingOrgId, setEditingOrgId] = useState(null);

  // Form Inputs
  const [newShelter, setNewShelter] = useState({ name: '', location: '', capacity: '', currentOccupancy: 0, status: 'Open' });
  const [newVolunteer, setNewVolunteer] = useState({ name: '', email: '', phone: '', skills: '', status: 'Available' });
  const [newOrg, setNewOrg] = useState({ name: '', contactPerson: '', email: '', sector: '' });

  // Mock Initial Data
  const [shelters, setShelters] = useState([
    { id: 1, name: 'Colombo Central Relief Center', location: 'Colombo 07', capacity: 500, currentOccupancy: 420, status: 'Open' },
    { id: 2, name: 'Gampaha Community Hall Shelter', location: 'Gampaha', capacity: 300, currentOccupancy: 210, status: 'Open' },
    { id: 3, name: 'Kalutara Disaster Care Hub', location: 'Kalutara', capacity: 250, currentOccupancy: 200, status: 'Open' }
  ]);

  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'Kamal Perera', email: 'kamal@gmail.com', phone: '0771234567', skills: 'First Aid, Logistics', status: 'Available' },
    { id: 2, name: 'Nimal Silva', email: 'nimal@gmail.com', phone: '0719876543', skills: 'Medical, Rescue', status: 'Deployed' },
    { id: 3, name: 'Sunethra Perera', email: 'sunethra@gmail.com', phone: '0751122334', skills: 'Food Distribution', status: 'Available' }
  ]);

  const [organisations, setOrganisations] = useState([
    { id: 1, name: 'Red Cross Sri Lanka', contactPerson: 'Dr. Rohan', email: 'info@redcross.lk', sector: 'Medical' },
    { id: 2, name: 'Sarvodaya Shramadana', contactPerson: 'Sunil Wickramasinghe', email: 'contact@sarvodaya.org', sector: 'Food & Relief' }
  ]);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('reliefcore_theme', newTheme);
  };

  // --- SHELTERS LOCAL CRUD ---
  const handleSaveShelter = (e) => {
    e.preventDefault();
    if (editingShelterId) {
      setShelters(shelters.map(s => s.id === editingShelterId ? {
        ...s,
        name: newShelter.name,
        location: newShelter.location,
        capacity: parseInt(newShelter.capacity),
        currentOccupancy: parseInt(newShelter.currentOccupancy),
        status: newShelter.status
      } : s));
      showToast('Shelter updated successfully!');
    } else {
      const newItem = {
        id: Date.now(),
        name: newShelter.name,
        location: newShelter.location,
        capacity: parseInt(newShelter.capacity),
        currentOccupancy: parseInt(newShelter.currentOccupancy),
        status: newShelter.status
      };
      setShelters([...shelters, newItem]);
      showToast('Shelter added successfully!');
    }
    setIsShelterModalOpen(false);
    setEditingShelterId(null);
    setNewShelter({ name: '', location: '', capacity: '', currentOccupancy: 0, status: 'Open' });
  };

  const handleEditShelter = (s) => {
    setEditingShelterId(s.id);
    setNewShelter({ 
      name: s.name, 
      location: s.location, 
      capacity: s.capacity, 
      currentOccupancy: s.currentOccupancy, 
      status: s.status || 'Open' 
    });
    setIsShelterModalOpen(true);
  };

  const handleDeleteShelter = (id) => {
    if (!window.confirm('Are you sure you want to delete this shelter?')) return;
    setShelters(shelters.filter(s => s.id !== id));
    showToast('Shelter deleted successfully!');
  };

  // --- VOLUNTEERS LOCAL CRUD ---
  const handleSaveVolunteer = (e) => {
    e.preventDefault();
    if (editingVolunteerId) {
      setVolunteers(volunteers.map(v => v.id === editingVolunteerId ? { ...v, ...newVolunteer } : v));
      showToast('Volunteer updated successfully!');
    } else {
      setVolunteers([...volunteers, { id: Date.now(), ...newVolunteer }]);
      showToast('Volunteer added successfully!');
    }
    setIsVolunteerModalOpen(false);
    setEditingVolunteerId(null);
    setNewVolunteer({ name: '', email: '', phone: '', skills: '', status: 'Available' });
  };

  const handleEditVolunteer = (v) => {
    setEditingVolunteerId(v.id);
    setNewVolunteer({ name: v.name, email: v.email, phone: v.phone, skills: v.skills, status: v.status || 'Available' });
    setIsVolunteerModalOpen(true);
  };

  const handleDeleteVolunteer = (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    setVolunteers(volunteers.filter(v => v.id !== id));
    showToast('Volunteer deleted successfully!');
  };

  // --- ORGANISATIONS LOCAL CRUD ---
  const handleSaveOrg = (e) => {
    e.preventDefault();
    if (editingOrgId) {
      setOrganisations(organisations.map(o => o.id === editingOrgId ? { ...o, ...newOrg } : o));
      showToast('Organisation updated successfully!');
    } else {
      setOrganisations([...organisations, { id: Date.now(), ...newOrg }]);
      showToast('Organisation added successfully!');
    }
    setIsOrgModalOpen(false);
    setEditingOrgId(null);
    setNewOrg({ name: '', contactPerson: '', email: '', sector: '' });
  };

  const handleEditOrg = (o) => {
    setEditingOrgId(o.id);
    setNewOrg({ name: o.name, contactPerson: o.contactPerson, email: o.email, sector: o.sector });
    setIsOrgModalOpen(true);
  };

  const handleDeleteOrg = (id) => {
    if (!window.confirm('Are you sure you want to delete this organisation?')) return;
    setOrganisations(organisations.filter(o => o.id !== id));
    showToast('Organisation deleted successfully!');
  };

  useEffect(() => {
    let currentMap = null;

    if (activeTab === 'shelters') {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }

          currentMap = L.map(mapRef.current).setView([6.9271, 79.8612], 10);
          mapInstanceRef.current = currentMap;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(currentMap);

          const pins = [
            { name: "Colombo Central Relief", lat: 6.9271, lng: 79.8612, beds: "80 available" },
            { name: "Gampaha Community Hall", lat: 7.0840, lng: 79.9925, beds: "90 available" },
            { name: "Kalutara Disaster Care Hub", lat: 6.5854, lng: 79.9607, beds: "50 available" }
          ];

          pins.forEach(pin => {
            L.marker([pin.lat, pin.lng]).addTo(currentMap)
              .bindPopup(`<b style="color:#0f172a">${pin.name}</b><br><span style="color:#0d9488">${pin.beds}</span>`);
          });
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        if (currentMap) {
          currentMap.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [activeTab, theme]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen w-full flex flex-col relative transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-[100] ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-teal-500/20">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
          <div className="flex items-baseline space-x-2">
            <h1 className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">RELIEFCORE</h1>
            <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${isDark ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-teal-700 bg-teal-50 border-teal-200'}`}>Humanitarian Operations</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${isDark ? 'border-slate-800 bg-slate-900 text-amber-400 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-amber-600 hover:bg-slate-200'}`}
            title="Toggle Dark/Light Mode"
          >
            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
          </button>

          <button onClick={() => { setEditingShelterId(null); setNewShelter({ name: '', location: '', capacity: '', currentOccupancy: 0, status: 'Open' }); setIsShelterModalOpen(true); }} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 cursor-pointer transition-all">
            <i className="fa-solid fa-plus"></i>
            <span>Register New Shelter</span>
          </button>

          <button onClick={() => setIsLoginModalOpen(true)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${isDark ? 'border-slate-800 bg-slate-900 text-teal-400 hover:bg-slate-800' : 'border-slate-200 bg-white text-teal-600 hover:bg-slate-100'}`}>
            <i className="fa-solid fa-right-to-bracket"></i>
            <span>Log In</span>
          </button>
        </div>
      </header>

      {/* Live Alert Bar */}
      <div 
        onClick={() => setActiveTab('notifications')}
        className={`border-b px-6 py-2.5 flex items-center space-x-4 overflow-hidden shadow-inner transition-all cursor-pointer hover:opacity-90 ${isDark ? 'bg-rose-950/40 border-rose-900/50 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'}`}
      >
        <div className="flex items-center space-x-2 shrink-0 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping mr-1"></span>
          <span>Live Alert</span>
        </div>
        <div className="text-xs font-medium truncate flex-1">
          <span className="font-bold">Critical Water Level Warning:</span> Kelani River water levels approaching flood mark in Gampaha zone. Immediate deployment advised.
        </div>
        <div className="text-xs font-semibold underline shrink-0 hidden sm:block">View All →</div>
      </div>

      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <aside className={`w-64 border-r p-4 hidden md:flex flex-col justify-start ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
          <nav className="space-y-1.5">
            {[
              { id: 'shelters', name: 'Shelters', icon: 'fa-tent', count: shelters.length },
              { id: 'volunteers', name: 'Volunteers', icon: 'fa-users', count: volunteers.length },
              { id: 'organisations', name: 'Organisations', icon: 'fa-building-ngo', count: organisations.length },
              { id: 'notifications', name: 'Notifications', icon: 'fa-triangle-exclamation', count: 4 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/25' 
                    : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className={`fa-solid ${tab.icon} text-base`}></i>
                  <span>{tab.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${activeTab === tab.id ? 'bg-teal-700/80 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 p-8 overflow-y-auto ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          
          {/* 1. SHELTERS TAB */}
          {activeTab === 'shelters' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Shelters Management</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage shelters, track occupancy, allocate resources and ensure safety</p>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Shelters</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-teal-500">{shelters.length}</p>
                    <span className="text-xs text-emerald-500 font-bold">↑ 12%</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active centers</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Capacity</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-emerald-500">{shelters.reduce((acc, s) => acc + (Number(s.capacity) || 0), 0)}</p>
                    <span className="text-xs text-emerald-500 font-bold">↑ 18%</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Available bed spaces</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currently Occupied</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-amber-500">{shelters.reduce((acc, s) => acc + (Number(s.currentOccupancy) || 0), 0)}</p>
                    <span className="text-xs text-amber-500 font-bold">↑ 22%</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total occupancy rate</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Urgent Needs</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-rose-500">5</p>
                    <span className="text-xs text-rose-500 font-bold">↑ 25%</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Require immediate support</span>
                </div>
              </div>

              {/* Row 2: Map, Donut Chart & Urgent Needs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={`lg:col-span-6 p-5 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-bold flex items-center text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <i className="fa-solid fa-map-location-dot text-teal-500 mr-2"></i>Shelter Locations Map
                    </h3>
                    <span className="text-xs text-teal-500 font-semibold cursor-pointer">View All →</span>
                  </div>
                  <div ref={mapRef} className={`w-full h-64 rounded-xl overflow-hidden border relative z-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}></div>
                </div>

                <div className={`lg:col-span-3 p-5 rounded-2xl border shadow-lg flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Shelter Occupancy Overview</h3>
                    <span className="text-xs text-teal-500 font-semibold cursor-pointer">View All →</span>
                  </div>
                  <div className="flex flex-col items-center justify-center my-auto py-2">
                    <div className={`relative w-32 h-32 rounded-full border-8 flex items-center justify-center shadow-inner ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="absolute inset-0 rounded-full border-8 border-teal-500 border-t-transparent animate-spin-slow"></div>
                      <div className="text-center">
                        <span className="text-xl font-black text-amber-500">{shelters.reduce((acc, s) => acc + (Number(s.currentOccupancy) || 0), 0)}</span>
                        <p className={`text-[9px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>People Sheltered</p>
                      </div>
                    </div>
                  </div>
                  <div className={`space-y-1.5 text-[11px] pt-2 border-t ${isDark ? 'text-slate-400 border-slate-800/60' : 'text-slate-600 border-slate-200'}`}>
                    <div className="flex justify-between items-center"><span>● High (80-100%)</span><span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>6</span></div>
                    <div className="flex justify-between items-center"><span>● Medium (50-80%)</span><span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>12</span></div>
                    <div className="flex justify-between items-center"><span>● Low (0-50%)</span><span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>3</span></div>
                  </div>
                </div>

                <div className={`lg:col-span-3 p-5 rounded-2xl border shadow-lg flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Urgent Shelter Needs</h4>
                      <span className="text-xs text-teal-500 font-semibold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <div className="flex justify-between items-center"><span className="font-bold">Kelani Relief Shelter</span><span className="text-[9px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-bold">High</span></div>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Required immediate support</p>
                      </div>
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <div className="flex justify-between items-center"><span className="font-bold">Gampaha Temporary Shelter</span><span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold">Medium</span></div>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Needs clean drinking water</p>
                      </div>
                      <div className={`p-2 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <div className="flex justify-between items-center"><span className="font-bold">Negombo Safe House</span><span className="text-[9px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-bold">High</span></div>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Medical supplies required</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => showToast('Dispatched emergency support!', 'success')} className={`w-full py-2 mt-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'}`}>
                    Allocate Resources
                  </button>
                </div>
              </div>

              {/* Row 3: Shelter List & Shelter Details Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Shelter List</h3>
                    <div className="flex space-x-2 text-xs">
                      <input type="text" placeholder="Search shelters..." className={`px-3 py-1 rounded-lg border text-xs focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`} />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`uppercase font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        <tr><th className="p-3 rounded-l-lg">Shelter Name</th><th className="p-3">Location</th><th className="p-3">Capacity</th><th className="p-3">Occupied</th><th className="p-3">Occupancy</th><th className="p-3">Status</th><th className="p-3 rounded-r-lg text-right">Actions</th></tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                        {shelters.length === 0 ? (
                          <tr><td colSpan="7" className="p-6 text-center text-slate-400">No shelters registered yet.</td></tr>
                        ) : (
                          shelters.map(s => {
                            const percent = Math.round((s.currentOccupancy / s.capacity) * 100) || 0;
                            return (
                              <tr key={s.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                                <td className="p-3 font-bold">{s.name}</td>
                                <td className="p-3">{s.location}</td>
                                <td className="p-3">{s.capacity}</td>
                                <td className="p-3">{s.currentOccupancy}</td>
                                <td className="p-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-amber-500">{percent}%</span>
                                    <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                      <div className="bg-amber-500 h-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">{s.status || 'Open'}</span></td>
                                <td className="p-3 text-right space-x-2">
                                  <button onClick={() => handleEditShelter(s)} className="text-teal-500 hover:text-teal-400" title="Edit"><i className="fa-solid fa-pen"></i></button>
                                  <button onClick={() => handleDeleteShelter(s.id)} className="text-rose-500 hover:text-rose-400" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shelter Details Card with Modern Building Direct Image */}
                <div className={`lg:col-span-4 p-5 rounded-2xl border shadow-lg flex flex-col justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Shelter Details</h3>
                      <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold">High Occupancy</span>
                    </div>
                    <div className={`w-full h-32 rounded-xl overflow-hidden mb-3 relative shadow-inner ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" 
                        alt="Modern Building Exterior" 
                        className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                        <span className="font-bold text-xs text-white">Colombo Central Relief Center</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400"><span>Location</span><span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Colombo 07, Western Province</span></div>
                      <div className="flex justify-between text-slate-400"><span>Total Capacity</span><span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>500 people</span></div>
                      <div className="flex justify-between text-slate-400"><span>Current Occupancy</span><span className="font-semibold text-amber-400">420 people (84%)</span></div>
                      <div className="flex justify-between text-slate-400"><span>Status</span><span className="font-semibold text-emerald-400">Active</span></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <button onClick={() => showToast('Full details loaded')} className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'}`}>
                      View Full Details
                    </button>
                    <button onClick={() => showToast('Resources allocated successfully!')} className="w-full py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md cursor-pointer">
                      Allocate Resources
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Capacity vs Occupancy Line Graph */}
              <div className={`p-5 rounded-2xl border shadow-lg space-y-3 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Capacity vs Occupancy Trend</h3>
                  <div className="flex items-center space-x-4 text-[11px]">
                    <span className="flex items-center text-teal-500"><span className="w-2 h-2 rounded-full bg-teal-500 mr-1.5"></span>Total Capacity</span>
                    <span className="flex items-center text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>Currently Occupied</span>
                  </div>
                </div>
                <div className={`w-full h-32 rounded-xl flex flex-col justify-end px-4 py-3 border relative overflow-hidden ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <svg className="absolute inset-x-4 inset-y-6 w-[calc(100%-2rem)] h-[calc(100%-2.5rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                    <path d="M 0,40 Q 100,20 200,35 T 400,15 500,25" fill="none" stroke="#0d9488" strokeWidth="2.5" />
                    <path d="M 0,70 Q 100,50 200,60 T 400,35 500,45" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                  <div className={`flex justify-between text-[10px] pt-16 font-mono uppercase z-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. VOLUNTEERS TAB */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Volunteer Operations</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage volunteers, skills, assignments and deployments</p>
                </div>
                <button onClick={() => { setEditingVolunteerId(null); setNewVolunteer({ name: '', email: '', phone: '', skills: '', status: 'Available' }); setIsVolunteerModalOpen(true); }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/20 cursor-pointer">
                  <i className="fa-solid fa-plus mr-2"></i>Register Volunteer
                </button>
              </div>

              {/* Volunteer KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Volunteers</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-teal-500">{volunteers.length}</p>
                    <span className="text-xs text-emerald-500 font-bold">↑ 15%</span>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Registered active members</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Available</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-emerald-500">{volunteers.filter(v => v.status === 'Available').length}</p>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready for deployment</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currently Deployed</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-amber-500">{volunteers.filter(v => v.status === 'Deployed').length}</p>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>On active missions</span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Medical & Rescue</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <p className="text-2xl font-black text-rose-500">2</p>
                  </div>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Specialized personnel</span>
                </div>
              </div>

              {/* Volunteers Directory */}
              <div className={`p-5 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Volunteers Directory</h3>
                  <div className="flex space-x-2 text-xs">
                    <input type="text" placeholder="Search volunteers..." className={`px-3 py-1 rounded-lg border text-xs focus:outline-none ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'}`} />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      <tr><th className="p-3.5 rounded-l-xl">Name</th><th className="p-3.5">Email</th><th className="p-3.5">Phone</th><th className="p-3.5">Skills</th><th className="p-3.5">Status</th><th className="p-3.5 rounded-r-xl text-right">Actions</th></tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                      {volunteers.length === 0 ? (
                        <tr><td colSpan="6" className="p-6 text-center text-slate-400">No volunteers registered yet.</td></tr>
                      ) : (
                        volunteers.map(v => (
                          <tr key={v.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                            <td className="p-3.5 font-bold">{v.name}</td>
                            <td className="p-3.5">{v.email}</td>
                            <td className="p-3.5">{v.phone}</td>
                            <td className="p-3.5 text-teal-500 font-medium">{v.skills}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.status === 'Deployed' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {v.status || 'Available'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button onClick={() => handleEditVolunteer(v)} className="text-teal-500 hover:text-teal-400"><i className="fa-solid fa-pen"></i></button>
                              <button onClick={() => handleDeleteVolunteer(v.id)} className="text-rose-500 hover:text-rose-400"><i className="fa-solid fa-trash"></i></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ORGANISATIONS TAB */}
          {activeTab === 'organisations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Partner Organisations</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Coordinate relief efforts with partner NGOs and institutions</p>
                </div>
                <button onClick={() => { setEditingOrgId(null); setNewOrg({ name: '', contactPerson: '', email: '', sector: '' }); setIsOrgModalOpen(true); }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/20 cursor-pointer">
                  <i className="fa-solid fa-plus mr-2"></i>Add Organisation
                </button>
              </div>

              <div className={`p-5 rounded-2xl border shadow-lg ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Partner Organisations Directory</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      <tr><th className="p-3.5 rounded-l-xl">Name</th><th className="p-3.5">Contact Person</th><th className="p-3.5">Email</th><th className="p-3.5">Sector</th><th className="p-3.5 rounded-r-xl text-right">Actions</th></tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                      {organisations.length === 0 ? (
                        <tr><td colSpan="5" className="p-6 text-center text-slate-400">No partner organisations found.</td></tr>
                      ) : (
                        organisations.map(o => (
                          <tr key={o.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                            <td className="p-3.5 font-bold">{o.name}</td>
                            <td className="p-3.5">{o.contactPerson}</td>
                            <td className="p-3.5">{o.email}</td>
                            <td className="p-3.5 text-sky-500 font-medium">{o.sector}</td>
                            <td className="p-3.5 text-right space-x-2">
                              <button onClick={() => handleEditOrg(o)} className="text-teal-500 hover:text-teal-400"><i className="fa-solid fa-pen"></i></button>
                              <button onClick={() => handleDeleteOrg(o.id)} className="text-rose-500 hover:text-rose-400"><i className="fa-solid fa-trash"></i></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>System Notifications</h2>
              <div className="space-y-4">
                {[
                  { title: "Critical Water Level Warning", message: "Kelani River water levels approaching flood mark in Gampaha zone.", time: "10 mins ago" },
                  { title: "Shelter Capacity Alert", message: "Colombo Central Relief Center reached 84% capacity.", time: "25 mins ago" }
                ].map((n, i) => (
                  <div key={i} className={`p-5 rounded-2xl border shadow-lg flex items-start space-x-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                      <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{n.title}</h4>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{n.message}</p>
                      <span className={`text-xs mt-2 block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="px-4 py-3 rounded-xl border bg-slate-900 border-teal-500 text-teal-400 shadow-2xl backdrop-blur-md">
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-lg font-bold flex items-center"><i className="fa-solid fa-right-to-bracket text-teal-500 mr-2"></i>Command Center Login</h3>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoginModalOpen(false); showToast('Logged in successfully!'); }} className="space-y-3">
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
                <input required type="email" placeholder="admin@reliefcore.org" className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
                <input required type="password" placeholder="••••••••" className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsLoginModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold cursor-pointer">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT SHELTER MODAL */}
      {isShelterModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-lg font-bold">{editingShelterId ? 'Edit Shelter' : 'Register New Shelter'}</h3>
            <form onSubmit={handleSaveShelter} className="space-y-3">
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Shelter Name</label>
                <input required type="text" value={newShelter.name} onChange={e => setNewShelter({...newShelter, name: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Location</label>
                <input required type="text" value={newShelter.location} onChange={e => setNewShelter({...newShelter, location: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Capacity</label>
                <input required type="number" value={newShelter.capacity} onChange={e => setNewShelter({...newShelter, capacity: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Current Occupancy</label>
                <input required type="number" value={newShelter.currentOccupancy} onChange={e => setNewShelter({...newShelter, currentOccupancy: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsShelterModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT VOLUNTEER MODAL */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-lg font-bold">{editingVolunteerId ? 'Edit Volunteer' : 'Register New Volunteer'}</h3>
            <form onSubmit={handleSaveVolunteer} className="space-y-3">
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Name</label>
                <input required type="text" value={newVolunteer.name} onChange={e => setNewVolunteer({...newVolunteer, name: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</label>
                <input required type="email" value={newVolunteer.email} onChange={e => setNewVolunteer({...newVolunteer, email: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone</label>
                <input required type="text" value={newVolunteer.phone} onChange={e => setNewVolunteer({...newVolunteer, phone: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Skills</label>
                <input required type="text" value={newVolunteer.skills} onChange={e => setNewVolunteer({...newVolunteer, skills: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsVolunteerModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT ORGANISATION MODAL */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="text-lg font-bold">{editingOrgId ? 'Edit Organisation' : 'Add Partner Organisation'}</h3>
            <form onSubmit={handleSaveOrg} className="space-y-3">
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Organisation Name</label>
                <input required type="text" value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value})} className={`w-full border rounded-xl px-3 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Contact Person</label>
                <input required type="text" value={newOrg.contactPerson} onChange={e => setNewOrg({...newOrg, contactPerson: e.target.value})} className={`w-full border rounded-xl px-3.5 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</label>
                <input required type="email" value={newOrg.email} onChange={e => setNewOrg({...newOrg, email: e.target.value})} className={`w-full border rounded-xl px-3.5 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div>
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sector</label>
                <input required type="text" value={newOrg.sector} onChange={e => setNewOrg({...newOrg, sector: e.target.value})} className={`w-full border rounded-xl px-3.5 py-2 text-sm ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsOrgModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}