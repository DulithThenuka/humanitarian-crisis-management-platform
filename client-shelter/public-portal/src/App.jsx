import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [activeTab, setActiveTab] = useState('shelters');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedShelter, setSelectedShelter] = useState(null);

  const [shelters] = useState([
    { id: 1, name: 'Colombo Central Relief Center', location: 'Colombo', capacity: 500, currentOccupancy: 420, status: 'Open', contact: '011-2345678', facilities: 'Food, Medical, Beds', address: 'Independence Avenue, Colombo 07', lat: 6.9022, lng: 79.8612 },
    { id: 2, name: 'Gampaha Community Hall Shelter', location: 'Gampaha', capacity: 300, currentOccupancy: 210, status: 'Open', contact: '033-2234567', facilities: 'Water, Food, Rest Area', address: 'Main Street, Gampaha', lat: 7.0840, lng: 79.9930 },
    { id: 3, name: 'Kalutara Disaster Care Hub', location: 'Kalutara', capacity: 250, currentOccupancy: 200, status: 'Open', contact: '034-2256789', facilities: 'First Aid, Temporary Housing', address: 'Station Road, Kalutara', lat: 6.5854, lng: 79.9607 },
    { id: 4, name: 'Negombo Coastal Safe House', location: 'Negombo', capacity: 200, currentOccupancy: 190, status: 'Filling Fast', contact: '031-2223344', facilities: 'Emergency Shelter', address: 'Beach Road, Negombo', lat: 7.2094, lng: 79.8383 },
    { id: 5, name: 'Kelani Valley Safe Zone', location: 'Colombo', capacity: 400, currentOccupancy: 395, status: 'Full', contact: '011-2998877', facilities: 'Dry Rations, Medical', address: 'Low Level Road, Kaduwela', lat: 6.9344, lng: 79.9800 }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } else {
      alert('Please enter email and password');
    }
  };

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          shelter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shelter.facilities.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'All' || shelter.location === selectedZone;
    return matchesSearch && matchesZone;
  });

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvailableBeds = totalCapacity - totalOccupied;

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex overflow-hidden">
      
      {/* Left Sidebar Navigation (Always Dark) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-teal-500/20">
              <i className="fa-solid fa-hands-holding-child"></i>
            </div>
            <div>
              <h1 className="font-extrabold tracking-wider text-lg text-white leading-tight">ReliefCore</h1>
              <span className="text-[9px] font-bold tracking-widest uppercase text-teal-400">Citizen Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-house w-5"></i>
              <span>Home & Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('shelters')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'shelters' ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-house-chimney-user w-5"></i>
              <span>Find Shelters & Map</span>
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'requests' ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className="fa-solid fa-triangle-exclamation w-5"></i>
              <span>Request Assistance</span>
            </button>
          </nav>
        </div>

        <div className="p-4 m-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WESTERN PROVINCE LIVE</span>
          </div>
          <a href="tel:119" className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 transition-all">
            <i className="fa-solid fa-phone-volume"></i>
            <span>Emergency: 119</span>
          </a>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Top Header (Always Dark) */}
        <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <i className="fa-solid fa-hands-holding-child"></i>
            </div>
            <span className="font-extrabold text-sm text-white">ReliefCore Portal</span>
          </div>

          <div className="text-xs font-bold text-slate-400 hidden md:block">
            <span>Western Province Disaster Coordination • Citizen Support Network</span>
          </div>

          {/* Right Side Top Corner Controls */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-slate-800 border-slate-700 text-teal-400 hover:bg-slate-700 transition-all cursor-pointer flex items-center space-x-2"
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {isLoggedIn ? (
              <div className="border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center space-x-2">
                <i className="fa-solid fa-user-check text-teal-400"></i>
                <span className="hidden sm:inline">{loginEmail}</span>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-rose-400 font-bold ml-2 hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center space-x-2"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Log In</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Body Content (Changes based on theme state) */}
        <main className={`flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto transition-colors duration-300 ${
          theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
        }`}>
          
          {activeTab === 'shelters' ? (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`border p-5 rounded-2xl backdrop-blur-md transition-colors ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Shelters</p>
                  <h3 className="text-3xl font-black mt-1">{shelters.length} Verified</h3>
                </div>
                <div className={`border p-5 rounded-2xl backdrop-blur-md transition-colors ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Beds</p>
                  <h3 className="text-3xl font-black text-emerald-500 mt-1">{totalAvailableBeds} Beds</h3>
                </div>
                <div className={`border p-5 rounded-2xl backdrop-blur-md transition-colors ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Occupied</p>
                  <h3 className="text-3xl font-black text-amber-500 mt-1">{totalOccupied} People</h3>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row gap-4 justify-between items-center transition-colors ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="w-full sm:w-80 relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-sm text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Search shelters or locations..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-teal-500 transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'Colombo', 'Gampaha', 'Kalutara', 'Negombo'].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedZone === zone 
                          ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' 
                          : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side View: Map on Left, Cards on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Map */}
                <div className="lg:col-span-6 sticky top-20 order-2 lg:order-1">
                  <div className={`border rounded-3xl overflow-hidden shadow-2xl w-full h-[650px] relative z-10 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <MapContainer 
                      center={[6.9271, 79.8612]} 
                      zoom={10} 
                      scrollWheelZoom={true} 
                      style={{ height: '100%', width: '100%', background: theme === 'dark' ? '#020617' : '#f8fafc' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {filteredShelters.map(shelter => (
                        <Marker key={shelter.id} position={[shelter.lat, shelter.lng]}>
                          <Popup>
                            <div className="p-2 space-y-1 font-sans text-slate-900">
                              <h4 className="font-bold text-sm">{shelter.name}</h4>
                              <p className="text-xs text-slate-600">{shelter.address}</p>
                              <p className="text-xs font-semibold text-teal-700">Contact: {shelter.contact}</p>
                              <p className="text-xs font-bold text-emerald-600">Capacity: {shelter.capacity - shelter.currentOccupancy} Beds Free</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* Right Side: Shelter Cards */}
                <div className="lg:col-span-6 space-y-4 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin order-1 lg:order-2">
                  {filteredShelters.length === 0 ? (
                    <div className={`py-16 text-center text-slate-400 space-y-2 border rounded-2xl ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <i className="fa-solid fa-campground text-4xl opacity-40"></i>
                      <p className="text-sm font-semibold">No shelters found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredShelters.map(shelter => {
                      const availableBeds = shelter.capacity - shelter.currentOccupancy;
                      const occupancyRate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
                      const isFull = occupancyRate >= 95 || shelter.status === 'Full';

                      return (
                        <div 
                          key={shelter.id} 
                          className={`border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl backdrop-blur-md group ${
                            theme === 'dark' ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-100' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-black tracking-wider text-teal-500 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                                <i className="fa-solid fa-location-dot mr-1"></i>{shelter.location}
                              </span>
                              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider ${
                                isFull ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                                occupancyRate > 80 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              }`}>
                                {isFull ? 'Full' : shelter.status}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold group-hover:text-teal-500 transition-colors">{shelter.name}</h3>
                              <p className="text-xs text-slate-400 mt-0.5"><i className="fa-solid fa-map-pin mr-1 text-slate-500"></i>{shelter.address}</p>
                            </div>

                            <div className={`text-xs space-y-1.5 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Contact Desk:</span>
                                <span className="font-mono font-bold">{shelter.contact}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Available Facilities:</span>
                                <span className="font-semibold text-teal-500">{shelter.facilities}</span>
                              </div>
                            </div>
                          </div>

                          <div className={`space-y-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex justify-between text-xs font-bold">
                              <span className={isFull ? 'text-rose-500' : 'text-emerald-500'}>
                                {isFull ? 'No Beds Available' : `${availableBeds} Beds Free`}
                              </span>
                              <span className="text-slate-400">{shelter.currentOccupancy} / {shelter.capacity} ({occupancyRate}%)</span>
                            </div>
                            
                            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                              <div 
                                className={`h-full transition-all duration-500 ${isFull ? 'bg-rose-500' : occupancyRate > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${occupancyRate}%` }}
                              ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button 
                                onClick={() => setSelectedShelter(shelter)}
                                className={`py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                }`}
                              >
                                <i className="fa-solid fa-circle-info"></i>
                                <span>Details</span>
                              </button>
                              <a 
                                href={`tel:${shelter.contact}`}
                                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                                  isFull 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none' 
                                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                                }`}
                              >
                                <i className="fa-solid fa-phone"></i>
                                <span>Call Shelter</span>
                              </a>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </>
          ) : (
            <div className={`py-24 text-center space-y-3 border rounded-3xl ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <i className="fa-solid fa-hands-holding-child text-5xl text-teal-500"></i>
              <h3 className="text-xl font-bold capitalize">{activeTab} Section</h3>
              <p className="text-xs text-slate-400">Citizens can view and interact with real-time disaster relief data here.</p>
            </div>
          )}

        </main>
      </div>

      {/* Login Modal Popup */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h3 className="text-lg font-bold">Citizen Portal Sign In</h3>
                <p className="text-xs text-slate-400">Access your relief profile</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 uppercase tracking-wider text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  placeholder="citizen@reliefcore.lk" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 uppercase tracking-wider text-slate-400">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowLoginModal(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer text-xs ${
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-lg shadow-teal-500/20 cursor-pointer text-xs"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Modal Popup */}
      {selectedShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">
                  {selectedShelter.location}
                </span>
                <h3 className="text-lg font-bold mt-1">{selectedShelter.name}</h3>
              </div>
              <button onClick={() => setSelectedShelter(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-xl border space-y-2 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <p className="flex justify-between"><span className="text-slate-400">Address:</span> <strong className="font-semibold">{selectedShelter.address}</strong></p>
                <p className="flex justify-between"><span className="text-slate-400">Emergency Hotlines:</span> <strong className="text-teal-500 font-mono">{selectedShelter.contact}</strong></p>
                <p className="flex justify-between"><span className="text-slate-400">Operational Status:</span> <strong className="text-emerald-500">{selectedShelter.status}</strong></p>
                <p className="flex justify-between"><span className="text-slate-400">Total Capacity:</span> <strong className="font-semibold">{selectedShelter.capacity} Beds</strong></p>
                <p className="flex justify-between"><span className="text-slate-400">Current Occupancy:</span> <strong className="text-amber-500">{selectedShelter.currentOccupancy} People</strong></p>
              </div>

              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Verified Relief Facilities</p>
                <div className={`p-3 rounded-xl border font-semibold ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  {selectedShelter.facilities}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedShelter(null)}
                className={`w-full py-2.5 rounded-xl font-bold transition-colors cursor-pointer text-xs ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}