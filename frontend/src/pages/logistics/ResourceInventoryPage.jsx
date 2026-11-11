import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Truck, 
  ShoppingCart, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  Search, 
  RotateCw, 
  Eye, 
  Edit2, 
  MoreVertical, 
  Check, 
  MapPin, 
  ChevronRight, 
  ChevronDown, 
  Droplets, 
  UtensilsCrossed, 
  HeartPulse, 
  Home, 
  Shirt, 
  Layers, 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle, 
  X
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ResourceInventoryPage.css';

export const ResourceInventoryPage = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // New Resource Form
  const [newResource, setNewResource] = useState({
    name: '',
    category: 'Food & Water',
    quantity: '',
    unit: 'Units',
    status: 'In Stock',
    location: 'Colombo'
  });

  // Map Layer States
  const [mapLayers, setMapLayers] = useState({
    warehouse: true,
    distribution: true,
    affectedAreas: true,
    roadNetwork: true,
    districtBoundaries: false
  });

  const toggleMapLayer = (key) => {
    setMapLayers(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (layerGroupsRef.current[key] && mapInstanceRef.current) {
        if (next[key]) {
          mapInstanceRef.current.addLayer(layerGroupsRef.current[key]);
        } else {
          mapInstanceRef.current.removeLayer(layerGroupsRef.current[key]);
        }
      }
      return next;
    });
  };

  // Inventory Table Items Data
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 'ITM-2026-001',
      name: 'Bottled Water (1L)',
      category: 'Food & Water',
      quantity: 5000,
      unit: 'Bottles',
      status: 'In Stock',
      location: 'Colombo',
      minThreshold: 1000
    },
    {
      id: 'ITM-2026-002',
      name: 'Rice (10kg)',
      category: 'Food & Water',
      quantity: 1200,
      unit: 'Bags',
      status: 'In Stock',
      location: 'Gampaha',
      minThreshold: 300
    },
    {
      id: 'ITM-2026-003',
      name: 'First Aid Kit',
      category: 'Medical Supplies',
      quantity: 800,
      unit: 'Kits',
      status: 'Low Stock',
      location: 'Colombo',
      minThreshold: 1000
    },
    {
      id: 'ITM-2026-004',
      name: 'Tarpaulin Sheet',
      category: 'Shelter Materials',
      quantity: 450,
      unit: 'Sheets',
      status: 'In Stock',
      location: 'Kalutara',
      minThreshold: 100
    },
    {
      id: 'ITM-2026-005',
      name: 'Blankets',
      category: 'Clothing',
      quantity: 1000,
      unit: 'Pieces',
      status: 'In Stock',
      location: 'Negombo',
      minThreshold: 200
    },
    {
      id: 'ITM-2026-006',
      name: 'Hand Sanitizer (500ml)',
      category: 'Hygiene Kits',
      quantity: 600,
      unit: 'Bottles',
      status: 'Low Stock',
      location: 'Colombo',
      minThreshold: 800
    },
    {
      id: 'ITM-2026-007',
      name: 'Tents (4 Person)',
      category: 'Shelter Materials',
      quantity: 120,
      unit: 'Units',
      status: 'In Stock',
      location: 'Kalutara',
      minThreshold: 50
    },
    {
      id: 'ITM-2026-008',
      name: 'Face Masks (50 pcs)',
      category: 'Medical Supplies',
      quantity: 2000,
      unit: 'Boxes',
      status: 'In Stock',
      location: 'Gampaha',
      minThreshold: 500
    }
  ]);

  // Categories Data matching the top category cards
  const categoriesData = [
    {
      name: 'Food & Water',
      count: '2,140 items',
      pct: '34%',
      barColor: '#ef4444',
      icon: UtensilsCrossed,
      iconBg: '#fef2f2',
      iconColor: '#ef4444'
    },
    {
      name: 'Medical Supplies',
      count: '1,520 items',
      pct: '24%',
      barColor: '#0284c7',
      icon: HeartPulse,
      iconBg: '#eff6ff',
      iconColor: '#0284c7'
    },
    {
      name: 'Shelter Materials',
      count: '980 items',
      pct: '16%',
      barColor: '#f59e0b',
      icon: Home,
      iconBg: '#fffbeb',
      iconColor: '#d97706'
    },
    {
      name: 'Clothing',
      count: '620 items',
      pct: '10%',
      barColor: '#8b5cf6',
      icon: Shirt,
      iconBg: '#faf5ff',
      iconColor: '#7c3aed'
    },
    {
      name: 'Hygiene Kits',
      count: '520 items',
      pct: '8%',
      barColor: '#10b981',
      icon: Droplets,
      iconBg: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      name: 'Other',
      count: '500 items',
      pct: '8%',
      barColor: '#64748b',
      icon: Package,
      iconBg: '#f1f5f9',
      iconColor: '#475569'
    }
  ];

  // Recent Transactions
  const recentTransactions = [
    {
      id: 'TX-1',
      title: '500 Bottled Water dispatched to Kelani Relief Shelter',
      time: '2 hours ago',
      type: 'dispatch',
      icon: ArrowUp,
      iconBg: '#dcfce7',
      iconColor: '#16a34a'
    },
    {
      id: 'TX-2',
      title: '200 Medical Kits received from Red Cross',
      time: '4 hours ago',
      type: 'received',
      icon: Plus,
      iconBg: '#e0f2fe',
      iconColor: '#0284c7'
    },
    {
      id: 'TX-3',
      title: '100 Tents allocated to Gampaha District',
      time: '6 hours ago',
      type: 'allocated',
      icon: ArrowDown,
      iconBg: '#fee2e2',
      iconColor: '#dc2626'
    },
    {
      id: 'TX-4',
      title: 'Low stock alert - Hand Sanitizer (only 50 left)',
      time: '8 hours ago',
      type: 'alert',
      icon: AlertCircle,
      iconBg: '#fef3c7',
      iconColor: '#d97706'
    },
    {
      id: 'TX-5',
      title: '1,000 Blankets received from community donation',
      time: '1 day ago',
      type: 'received',
      icon: ArrowUp,
      iconBg: '#dcfce7',
      iconColor: '#16a34a'
    }
  ];

  // Low Stock Items Data
  const lowStockItems = [
    { name: 'Hand Sanitizer (500ml)', current: 50, target: 500, icon: HeartPulse, iconBg: '#e0f2fe', iconColor: '#0284c7' },
    { name: 'Surgical Masks', current: 80, target: 1000, icon: Package, iconBg: '#ede9fe', iconColor: '#7c3aed' },
    { name: 'Rice (10kg)', current: 120, target: 1500, icon: UtensilsCrossed, iconBg: '#dcfce7', iconColor: '#16a34a' },
    { name: 'Tents (4 Person)', current: 15, target: 200, icon: Home, iconBg: '#ffedd5', iconColor: '#ea580c' },
    { name: 'Blankets', current: 75, target: 1000, icon: Shirt, iconBg: '#ede9fe', iconColor: '#7c3aed' }
  ];

  // Filter Logic
  const filteredItems = inventoryItems.filter(item => {
    const matchSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchLoc = selectedLocation === 'All' || item.location === selectedLocation;

    return matchSearch && matchCat && matchStatus && matchLoc;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRowIds([]);
      setSelectAll(false);
    } else {
      setSelectedRowIds(filteredItems.map(i => i.id));
      setSelectAll(true);
    }
  };

  const handleToggleRow = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
    setSelectedRowIds([]);
    setSelectAll(false);
  };

  // Leaflet Map Initialization for Resource Distribution Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [6.950, 79.920],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      subdomains: ['server', 'services'],
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      opacity: 0.6
    }).addTo(map);

    const groups = {
      warehouse: L.layerGroup().addTo(map),
      distribution: L.layerGroup().addTo(map),
      affectedAreas: L.layerGroup().addTo(map),
      roadNetwork: L.layerGroup().addTo(map),
      districtBoundaries: L.layerGroup()
    };
    layerGroupsRef.current = groups;

    // Red Flood Hazard Polygon
    const floodPolygon = L.polygon([
      [6.974, 79.882],
      [6.969, 79.925],
      [6.960, 79.955],
      [6.945, 79.965],
      [6.928, 79.948],
      [6.922, 79.912],
      [6.928, 79.885],
      [6.942, 79.870],
      [6.960, 79.864]
    ], {
      color: '#dc2626',
      weight: 2,
      opacity: 0.85,
      fillColor: '#ef4444',
      fillOpacity: 0.35,
      dashArray: '3, 3'
    });
    groups.affectedAreas.addLayer(floodPolygon);

    const makePin = (svgInner, bg) => {
      return L.divIcon({
        className: 'rm-map-pin',
        html: `
          <div style="
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            background: ${bg}; 
            border: 2px solid #ffffff; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          ">
            ${svgInner}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    };

    // Central Warehouse Pin (Red)
    const whPin = L.marker([6.948, 79.920], {
      icon: makePin(`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `, '#dc2626')
    });
    groups.warehouse.addLayer(whPin);

    // Distribution Convoys (Green Truck)
    const dist1 = L.marker([7.060, 79.895], {
      icon: makePin(`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10"/>
          <circle cx="7" cy="18" r="2"/>
          <circle cx="17" cy="18" r="2"/>
        </svg>
      `, '#16a34a')
    });
    groups.distribution.addLayer(dist1);

    // Regional Relief Pod (Purple)
    const pod1 = L.marker([6.915, 79.905], {
      icon: makePin(`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      `, '#7c3aed')
    });
    const pod2 = L.marker([6.930, 79.970], {
      icon: makePin(`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      `, '#7c3aed')
    });
    groups.distribution.addLayer(pod1);
    groups.distribution.addLayer(pod2);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleZoom = (delta) => {
    if (mapInstanceRef.current) {
      if (delta > 0) mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  const handleCreateResource = (e) => {
    e.preventDefault();
    if (!newResource.name || !newResource.quantity) return;

    const newItem = {
      id: `ITM-2026-00${inventoryItems.length + 1}`,
      name: newResource.name,
      category: newResource.category,
      quantity: parseInt(newResource.quantity) || 100,
      unit: newResource.unit,
      status: newResource.status,
      location: newResource.location,
      minThreshold: 100
    };

    setInventoryItems([newItem, ...inventoryItems]);
    setShowAddModal(false);
    setNewResource({
      name: '',
      category: 'Food & Water',
      quantity: '',
      unit: 'Units',
      status: 'In Stock',
      location: 'Colombo'
    });
  };

  return (
    <div className="rm-page-wrapper">
      {/* =========================================================
         1. Top Row: 5 KPI Cards + "+ Add New Resource" Button
         ========================================================= */}
      <div className="rm-kpi-row">
        {/* KPI 1: Total Inventory Items */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-box bg-blue-soft">
            <Package size={22} className="text-blue" />
          </div>
          <div className="rm-kpi-content">
            <span className="rm-kpi-label">Total Inventory Items</span>
            <span className="rm-kpi-val">6,280</span>
            <div className="rm-kpi-trend text-green">
              <span>↑ 18%</span>
            </div>
            <span className="rm-kpi-sub">Across all categories</span>
          </div>
        </div>

        {/* KPI 2: Items Dispatched */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-box bg-green-soft">
            <Truck size={22} className="text-green" />
          </div>
          <div className="rm-kpi-content">
            <span className="rm-kpi-label">Items Dispatched</span>
            <span className="rm-kpi-val">4,320</span>
            <div className="rm-kpi-trend text-green">
              <span>↑ 25%</span>
            </div>
            <span className="rm-kpi-sub">This month</span>
          </div>
        </div>

        {/* KPI 3: In Stock */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-box bg-orange-soft">
            <ShoppingCart size={22} className="text-orange" />
          </div>
          <div className="rm-kpi-content">
            <span className="rm-kpi-label">In Stock</span>
            <span className="rm-kpi-val">3,860</span>
            <div className="rm-kpi-trend text-green">
              <span>↑ 12%</span>
            </div>
            <span className="rm-kpi-sub">Available items</span>
          </div>
        </div>

        {/* KPI 4: Low Stock Items */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-box bg-red-soft">
            <AlertTriangle size={22} className="text-red" />
          </div>
          <div className="rm-kpi-content">
            <span className="rm-kpi-label">Low Stock Items</span>
            <span className="rm-kpi-val">320</span>
            <div className="rm-kpi-trend text-red">
              <span>↑ 40%</span>
            </div>
            <span className="rm-kpi-sub">Need replenishment</span>
          </div>
        </div>

        {/* KPI 5: Total Value (Rs.) */}
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-box bg-purple-soft">
            <RotateCcw size={22} className="text-purple" />
          </div>
          <div className="rm-kpi-content">
            <span className="rm-kpi-label">Total Value (Rs.)</span>
            <span className="rm-kpi-val">12,450,000</span>
            <div className="rm-kpi-trend text-green">
              <span>↑ 22%</span>
            </div>
            <span className="rm-kpi-sub">Current inventory value</span>
          </div>
        </div>

        {/* Action Button: + Add New Resource */}
        <div className="rm-kpi-action-col">
          <button 
            className="rm-btn-add-resource"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add New Resource</span>
          </button>
        </div>
      </div>

      {/* =========================================================
         2. Middle Section (Top Row): Resource Categories + Donut Chart
         ========================================================= */}
      <div className="rm-middle-top-grid">
        {/* Resource Categories Card */}
        <div className="rm-card rm-categories-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Resource Categories</h3>
          </div>

          <div className="rm-categories-grid">
            {categoriesData.map((cat, idx) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <div 
                  key={idx} 
                  className={`rm-cat-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
                >
                  <div className="rm-cat-icon-box" style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}>
                    <IconComp size={18} />
                  </div>
                  <span className="rm-cat-name">{cat.name}</span>
                  <span className="rm-cat-count">{cat.count}</span>

                  <div className="rm-cat-progress-track">
                    <div 
                      className="rm-cat-progress-fill" 
                      style={{ width: cat.pct, backgroundColor: cat.barColor }}
                    ></div>
                  </div>
                  <span className="rm-cat-pct-label">{cat.pct}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Status Overview Card (Donut Chart) */}
        <div className="rm-card rm-stock-overview-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Stock Status Overview</h3>
          </div>

          <div className="rm-donut-content">
            <div className="rm-donut-wrapper">
              <svg viewBox="0 0 160 160" className="rm-donut-svg">
                {/* In Stock: 62% (#10b981) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="20"
                  strokeDasharray="225.9 364.4"
                  strokeDashoffset="0"
                />
                {/* Low Stock: 24% (#f59e0b) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="20"
                  strokeDasharray="87.5 364.4"
                  strokeDashoffset="-225.9"
                />
                {/* Out of Stock: 8% (#ef4444) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="20"
                  strokeDasharray="29.2 364.4"
                  strokeDashoffset="-313.4"
                />
                {/* Reserved: 6% (#94a3b8) */}
                <circle 
                  cx="80" cy="80" r="58"
                  fill="none" 
                  stroke="#94a3b8" 
                  strokeWidth="20"
                  strokeDasharray="21.9 364.4"
                  strokeDashoffset="-342.6"
                />
              </svg>
              <div className="rm-donut-center-label">
                <span className="rm-donut-big-num">6,280</span>
                <span className="rm-donut-sub-text">Total Items</span>
              </div>
            </div>

            <div className="rm-donut-legend">
              <div className="rm-legend-item">
                <span className="rm-legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                <span className="rm-legend-name">In Stock</span>
                <span className="rm-legend-val">62%</span>
              </div>
              <div className="rm-legend-item">
                <span className="rm-legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                <span className="rm-legend-name">Low Stock</span>
                <span className="rm-legend-val">24%</span>
              </div>
              <div className="rm-legend-item">
                <span className="rm-legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                <span className="rm-legend-name">Out of Stock</span>
                <span className="rm-legend-val">8%</span>
              </div>
              <div className="rm-legend-item">
                <span className="rm-legend-dot" style={{ backgroundColor: '#94a3b8' }}></span>
                <span className="rm-legend-name">Reserved</span>
                <span className="rm-legend-val">6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
         3. Middle Section (Main Grid): Inventory Table + Transactions
         ========================================================= */}
      <div className="rm-middle-main-grid">
        {/* Left Column: Filterable Inventory Items Table */}
        <div className="rm-card rm-table-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Inventory Items</h3>
          </div>

          {/* Filters Bar */}
          <div className="rm-filters-toolbar">
            <div className="rm-search-box">
              <Search size={14} className="rm-search-icon" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rm-filter-selects">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Food & Water">Food & Water</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Shelter Materials">Shelter Materials</option>
                <option value="Clothing">Clothing</option>
                <option value="Hygiene Kits">Hygiene Kits</option>
              </select>

              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>

              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                <option value="All">All Locations</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Negombo">Negombo</option>
              </select>

              <button className="rm-btn-reset" onClick={handleResetFilters}>
                <RotateCw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rm-table-wrapper">
            <table className="rm-items-table">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Item ID</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const isChecked = selectedRowIds.includes(item.id);
                  const isLow = item.status === 'Low Stock';
                  return (
                    <tr key={item.id} className={isChecked ? 'row-selected' : ''}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleToggleRow(item.id)}
                        />
                      </td>
                      <td className="rm-cell-id">{item.id}</td>
                      <td className="rm-cell-name">{item.name}</td>
                      <td>{item.category}</td>
                      <td className="rm-cell-qty">{item.quantity.toLocaleString()}</td>
                      <td>{item.unit}</td>
                      <td>
                        <span className={`rm-status-pill ${isLow ? 'status-low' : 'status-in'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.location}</td>
                      <td>
                        <div className="rm-actions-cell">
                          <button 
                            className="rm-action-icon-btn" 
                            title="View Details"
                            onClick={() => {
                              setSelectedItemDetail(item);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            className="rm-action-icon-btn" 
                            title="Edit Item"
                            onClick={() => {
                              setSelectedItemDetail(item);
                              setShowDetailModal(true);
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button className="rm-action-icon-btn" title="More Options">
                            <MoreVertical size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="rm-table-footer">
            <span className="rm-showing-text">
              Showing 1-{filteredItems.length} of 6,280 items
            </span>

            <div className="rm-pagination-bar">
              <button className="rm-page-arrow">&lt;</button>
              <button className="rm-page-num active">1</button>
              <button className="rm-page-num">2</button>
              <button className="rm-page-num">3</button>
              <button className="rm-page-num">4</button>
              <button className="rm-page-num">5</button>
              <span className="rm-page-dots">...</span>
              <button className="rm-page-num">785</button>
              <button className="rm-page-arrow">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Resource Transactions */}
        <div className="rm-card rm-transactions-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Recent Resource Transactions</h3>
            <button className="rm-card-link-btn">
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="rm-tx-list">
            {recentTransactions.map(tx => {
              const IconComp = tx.icon;
              return (
                <div key={tx.id} className="rm-tx-item">
                  <div className="rm-tx-icon-wrap" style={{ backgroundColor: tx.iconBg, color: tx.iconColor }}>
                    <IconComp size={15} />
                  </div>
                  <div className="rm-tx-info">
                    <span className="rm-tx-title">{tx.title}</span>
                    <span className="rm-tx-time">{tx.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
         4. Bottom Row (3 Cards): Map, Trend Chart, Low Stock Items
         ========================================================= */}
      <div className="rm-bottom-row-grid">
        {/* Card 1: Resource Distribution Map */}
        <div className="rm-card rm-dist-map-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Resource Distribution Map</h3>
          </div>

          <div className="rm-map-viewport">
            <div ref={mapContainerRef} className="rm-leaflet-map" />

            {/* Map Layers Overlay */}
            <div className="rm-map-layers-panel">
              <h4 className="rm-panel-title">Map Layers</h4>
              <div className="rm-panel-checkboxes">
                <label className="rm-chk-item">
                  <input 
                    type="checkbox" 
                    checked={mapLayers.warehouse} 
                    onChange={() => toggleMapLayer('warehouse')} 
                  />
                  <span className="rm-chk-box">{mapLayers.warehouse && <Check size={10} />}</span>
                  <span className="rm-chk-icon-badge bg-blue-soft"><Home size={10} className="text-blue" /></span>
                  <span>Warehouse Locations</span>
                </label>

                <label className="rm-chk-item">
                  <input 
                    type="checkbox" 
                    checked={mapLayers.distribution} 
                    onChange={() => toggleMapLayer('distribution')} 
                  />
                  <span className="rm-chk-box">{mapLayers.distribution && <Check size={10} />}</span>
                  <span className="rm-chk-icon-badge bg-green-soft"><Truck size={10} className="text-green" /></span>
                  <span>Distribution Points</span>
                </label>

                <label className="rm-chk-item">
                  <input 
                    type="checkbox" 
                    checked={mapLayers.affectedAreas} 
                    onChange={() => toggleMapLayer('affectedAreas')} 
                  />
                  <span className="rm-chk-box">{mapLayers.affectedAreas && <Check size={10} />}</span>
                  <span className="rm-chk-icon-badge bg-red-soft"><AlertTriangle size={10} className="text-red" /></span>
                  <span>Affected Areas</span>
                </label>

                <label className="rm-chk-item">
                  <input 
                    type="checkbox" 
                    checked={mapLayers.roadNetwork} 
                    onChange={() => toggleMapLayer('roadNetwork')} 
                  />
                  <span className="rm-chk-box">{mapLayers.roadNetwork && <Check size={10} />}</span>
                  <span className="rm-chk-icon-badge bg-slate-soft"><Truck size={10} className="text-slate" /></span>
                  <span>Road Network</span>
                </label>

                <label className="rm-chk-item">
                  <input 
                    type="checkbox" 
                    checked={mapLayers.districtBoundaries} 
                    onChange={() => toggleMapLayer('districtBoundaries')} 
                  />
                  <span className="rm-chk-box">{mapLayers.districtBoundaries && <Check size={10} />}</span>
                  <span className="rm-chk-icon-badge bg-slate-soft"><Layers size={10} className="text-slate" /></span>
                  <span>District Boundaries</span>
                </label>
              </div>
            </div>

            {/* Map Zoom Controls */}
            <div className="rm-map-zoom-btns">
              <button onClick={() => handleZoom(1)}>+</button>
              <button onClick={() => handleZoom(-1)}>−</button>
            </div>

            {/* Floating Full Map Button */}
            <button className="rm-btn-view-map">
              <span>View Full Map</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 2: Resource Allocation Trend (Line Graph) */}
        <div className="rm-card rm-trend-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Resource Allocation Trend</h3>
            <div className="rm-trend-filter">
              <span>Last 6 months</span>
              <ChevronDown size={13} />
            </div>
          </div>

          <div className="rm-trend-graph-wrapper">
            <svg viewBox="0 0 420 180" className="rm-trend-svg">
              {/* Y-Axis Grid Lines & Labels */}
              <line x1="35" y1="20" x2="410" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="24" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">4K</text>

              <line x1="35" y1="55" x2="410" y2="55" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="59" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">3K</text>

              <line x1="35" y1="90" x2="410" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="94" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">2K</text>

              <line x1="35" y1="125" x2="410" y2="125" stroke="#f1f5f9" strokeWidth="1" />
              <text x="10" y="129" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">1K</text>

              <line x1="35" y1="155" x2="410" y2="155" stroke="#e2e8f0" strokeWidth="1" />
              <text x="20" y="159" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">0</text>

              {/* X-Axis Month Labels */}
              <text x="50" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Jan</text>
              <text x="120" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Feb</text>
              <text x="190" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Mar</text>
              <text x="260" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Apr</text>
              <text x="330" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">May</text>
              <text x="400" y="172" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">Jun</text>

              {/* Line 1: Items Distributed (Blue) */}
              <path 
                d="M 55 125 L 125 110 L 195 100 L 265 70 L 335 48 L 405 38"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Blue Dots */}
              <circle cx="55" cy="125" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="125" cy="110" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="195" cy="100" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="265" cy="70" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="335" cy="48" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="405" cy="38" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

              {/* Line 2: Items Received (Green) */}
              <path 
                d="M 55 142 L 125 130 L 195 115 L 265 92 L 335 75 L 405 60"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Green Dots */}
              <circle cx="55" cy="142" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="125" cy="130" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="195" cy="115" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="265" cy="92" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="335" cy="75" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="405" cy="60" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Legend below graph */}
            <div className="rm-trend-legend">
              <div className="rm-trend-leg-item">
                <span className="rm-leg-circle" style={{ backgroundColor: '#10b981' }}></span>
                <span>Items Received</span>
              </div>
              <div className="rm-trend-leg-item">
                <span className="rm-leg-circle" style={{ backgroundColor: '#0284c7' }}></span>
                <span>Items Distributed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="rm-card rm-low-stock-card">
          <div className="rm-card-header">
            <h3 className="rm-card-title">Low Stock Items</h3>
            <button className="rm-card-link-btn">
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="rm-low-stock-list">
            {lowStockItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="rm-low-stock-item">
                  <div className="rm-low-stock-icon-wrap" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                    <IconComponent size={14} />
                  </div>
                  <div className="rm-low-stock-info">
                    <span className="rm-low-stock-name">{item.name}</span>
                  </div>
                  <span className="rm-low-stock-ratio">{item.current} / {item.target}</span>
                  <span className="rm-status-pill status-low">Low Stock</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
         Add New Resource Modal
         ========================================================= */}
      {showAddModal && (
        <div className="rm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="rm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="rm-modal-header">
              <div>
                <h3 className="rm-modal-title">Add New Inventory Resource</h3>
                <p className="rm-modal-sub">Register and allocate newly acquired supplies to regional hubs</p>
              </div>
              <button className="rm-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateResource}>
              <div className="rm-modal-body">
                <div className="rm-form-group">
                  <label>Resource Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Inflatable Rescue Raft" 
                    value={newResource.name}
                    onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                    required
                  />
                </div>

                <div className="rm-form-grid">
                  <div className="rm-form-group">
                    <label>Category</label>
                    <select 
                      value={newResource.category}
                      onChange={e => setNewResource({ ...newResource, category: e.target.value })}
                    >
                      <option value="Food & Water">Food & Water</option>
                      <option value="Medical Supplies">Medical Supplies</option>
                      <option value="Shelter Materials">Shelter Materials</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Hygiene Kits">Hygiene Kits</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="rm-form-group">
                    <label>Quantity</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 500" 
                      value={newResource.quantity}
                      onChange={e => setNewResource({ ...newResource, quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="rm-form-grid">
                  <div className="rm-form-group">
                    <label>Unit of Measure</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Units, Bottles, Boxes" 
                      value={newResource.unit}
                      onChange={e => setNewResource({ ...newResource, unit: e.target.value })}
                    />
                  </div>

                  <div className="rm-form-group">
                    <label>Assigned Location</label>
                    <select 
                      value={newResource.location}
                      onChange={e => setNewResource({ ...newResource, location: e.target.value })}
                    >
                      <option value="Colombo">Colombo Central Depot</option>
                      <option value="Gampaha">Gampaha Warehouse</option>
                      <option value="Kalutara">Kalutara Depot</option>
                      <option value="Negombo">Negombo Facility</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rm-modal-footer">
                <button type="button" className="rm-btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="rm-btn-submit">
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         View Resource Detail Modal
         ========================================================= */}
      {showDetailModal && selectedItemDetail && (
        <div className="rm-modal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="rm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="rm-modal-header">
              <div>
                <h3 className="rm-modal-title">{selectedItemDetail.name}</h3>
                <p className="rm-modal-sub">ID: {selectedItemDetail.id} • {selectedItemDetail.category}</p>
              </div>
              <button className="rm-modal-close" onClick={() => setShowDetailModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="rm-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Current Stock Level</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    {selectedItemDetail.quantity.toLocaleString()} {selectedItemDetail.unit}
                  </span>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Hub Location</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0e6f76' }}>
                    {selectedItemDetail.location}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6' }}>
                <p>
                  <strong>Minimum Restock Threshold:</strong> {selectedItemDetail.minThreshold} {selectedItemDetail.unit}
                </p>
                <p style={{ marginTop: '6px' }}>
                  <strong>Inventory Status:</strong>{' '}
                  <span className={`rm-status-pill ${selectedItemDetail.status === 'Low Stock' ? 'status-low' : 'status-in'}`}>
                    {selectedItemDetail.status}
                  </span>
                </p>
                <p style={{ marginTop: '8px', color: '#64748b' }}>
                  Allocations for this resource are automatically routed around flooded road networks in Kelani Basin.
                </p>
              </div>
            </div>

            <div className="rm-modal-footer">
              <button className="rm-btn-cancel" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
              <button 
                className="rm-btn-submit"
                onClick={() => {
                  alert(`Restock request triggered for ${selectedItemDetail.name}`);
                  setShowDetailModal(false);
                }}
              >
                Trigger Restock Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
