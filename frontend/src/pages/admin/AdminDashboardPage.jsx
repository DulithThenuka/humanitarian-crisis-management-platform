import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Shield,
  ShieldAlert,
  ClipboardList,
  Package,
  Building2,
  Users,
  Gift,
  Cpu,
  MapPin,
  Bell,
  FileBarChart,
  ShieldCheck,
  Settings,
  ChevronRight,
  Search,
  Plus,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Truck,
  Droplets,
  HeartPulse,
  Lock,
  Unlock,
  Key,
  Trash2,
  Edit,
  Eye,
  X,
  PhoneCall,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';

import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import reliefcoreIcon from '../../assets/reliefcore-icon.png';
import sarahJohnsonAvatar from '../../assets/sarah-johnson.jpg';
import westernProvinceMap from '../../assets/western-province-map-clean.png';
import shelterPhoto1 from '../../assets/shelter-1.jpg';
import reqEvidencePhoto from '../../assets/req-evidence-1.jpg';

import './AdminDashboard.css';

// Default Telemetry Stats matching the screenshots
const DEFAULT_STATS = {
  activeCrises: 8,
  totalUsers: 1248,
  activeVolunteers: 1245,
  resourcesDeployed: 6280,
  peopleAssisted: 12450,
  totalInventoryItems: 6280,
  itemsDispatched: 4320,
  inStock: 3860,
  lowStockItems: 320,
  inventoryValueRs: 12450000,
  totalShelters: 28,
  totalShelterCapacity: 6240,
  occupiedShelterBeds: 4618,
  availableShelterBeds: 1622,
  systemUptimePercentage: 99.98,
  databaseLatencyMs: 14.2
};

// Default User Accounts
const DEFAULT_USERS = [
  { id: 'usr-001', fullName: 'Sarah Johnson', email: 'sarah.johnson@reliefcore.lk', role: 'Coordinator', assignedDistrict: 'Colombo', isActive: true, createdAt: '2026-09-12' },
  { id: 'usr-002', fullName: 'Kasun Perera', email: 'kasun.p@reliefcore.lk', role: 'LogisticsManager', assignedDistrict: 'Gampaha', isActive: true, createdAt: '2026-09-14' },
  { id: 'usr-003', fullName: 'Tharushi De Alwis', email: 'tharushi.d@reliefcore.lk', role: 'ShelterAdministrator', assignedDistrict: 'Kalutara', isActive: true, createdAt: '2026-09-18' },
  { id: 'usr-004', fullName: 'Dulith Thenuka', email: 'admin@reliefcore.lk', role: 'Admin', assignedDistrict: 'National Command', isActive: true, createdAt: '2026-09-01' },
  { id: 'usr-005', fullName: 'Nimali Silva', email: 'nimali.s@gmail.com', role: 'Volunteer', assignedDistrict: 'Galle', isActive: false, createdAt: '2026-10-02' },
  { id: 'usr-006', fullName: 'Kamal Bandara', email: 'kamal.b@outlook.com', role: 'Citizen', assignedDistrict: 'Ratnapura', isActive: true, createdAt: '2026-10-05' },
  { id: 'usr-007', fullName: 'Tharindu Perera', email: 'tharindu.p@field.lk', role: 'Volunteer', assignedDistrict: 'Colombo', isActive: true, createdAt: '2026-10-10' },
  { id: 'usr-008', fullName: 'Kavindu Fernando', email: 'kavindu.f@reliefcore.lk', role: 'LogisticsManager', assignedDistrict: 'Kalutara', isActive: true, createdAt: '2026-10-12' }
];

export const AdminDashboardPage = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  // Active Tab State (matching Sidebar Screenshot 1)
  const [activeTab, setActiveTab] = useState(initialTab === 'users' ? 'settings' : initialTab);
  const [settingsSubTab, setSettingsSubTab] = useState('users');

  // Core Data States
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  // Selected Item Modal / Inspector States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', role: 'Coordinator', password: '', assignedDistrict: 'Colombo' });
  const [resetPasswordModal, setResetPasswordModal] = useState({ isOpen: false, user: null, newPassword: '' });
  const [roleChangeModal, setRoleChangeModal] = useState({ isOpen: false, user: null, newRole: 'Coordinator' });

  // Map Filter Layers
  const [mapLayers, setMapLayers] = useState({
    activeCrises: true,
    shelters: true,
    medicalFacilities: true,
    volunteers: true,
    roadConditions: true,
    affectedAreas: true
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch real data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getDashboardStats();
      if (statsRes?.succeeded && statsRes.data) {
        setStats(prev => ({
          ...prev,
          ...statsRes.data,
          totalUsers: statsRes.data.totalUsers || prev.totalUsers,
          activeCrises: statsRes.data.activeCrises || prev.activeCrises
        }));
      }
    } catch {
      // Keep rich fallback
    }

    try {
      const usersRes = await adminService.getUsers({
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        search: searchQuery || undefined
      });
      if (usersRes?.succeeded && usersRes.data && usersRes.data.length > 0) {
        setUsers(usersRes.data);
      }
    } catch {
      // Keep rich fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  // User RBAC Actions
  const handleToggleStatus = async (targetUser) => {
    const updatedStatus = !targetUser.isActive;
    try {
      await adminService.updateUserStatus(targetUser.id, updatedStatus);
    } catch {
      // Dev mode fallback
    }
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, isActive: updatedStatus } : u));
    showToast(`Account for ${targetUser.fullName} ${updatedStatus ? 'unlocked' : 'locked'}.`);
  };

  const handleRoleChange = async () => {
    if (!roleChangeModal.user) return;
    try {
      await adminService.updateUserRole(roleChangeModal.user.id, roleChangeModal.newRole);
    } catch {
      // Dev mode fallback
    }
    setUsers(prev => prev.map(u => u.id === roleChangeModal.user.id ? { ...u, role: roleChangeModal.newRole } : u));
    showToast(`Security role for ${roleChangeModal.user.fullName} updated to ${roleChangeModal.newRole}.`);
    setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' });
  };

  const handleResetPassword = async () => {
    if (!resetPasswordModal.user || !resetPasswordModal.newPassword) return;
    try {
      await adminService.resetPassword(resetPasswordModal.user.id, resetPasswordModal.newPassword);
    } catch {
      // Dev mode fallback
    }
    showToast(`Temporary password hash generated for ${resetPasswordModal.user.fullName}.`);
    setResetPasswordModal({ isOpen: false, user: null, newPassword: '' });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      showToast('Please fill out all required fields.');
      return;
    }
    try {
      await adminService.createUser(newUser);
    } catch {
      // Dev mode fallback
    }
    const created = {
      id: `usr-${Date.now()}`,
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([created, ...users]);
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    setIsCreateModalOpen(false);
    setNewUser({ fullName: '', email: '', role: 'Coordinator', password: '', assignedDistrict: 'Colombo' });
    showToast(`Account created for ${created.fullName}.`);
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;
    try {
      await adminService.deleteUser(id);
    } catch {
      // Dev mode fallback
    }
    setUsers(users.filter(u => u.id !== id));
    setStats(prev => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
    showToast(`User account deleted.`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.assignedDistrict && u.assignedDistrict.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sidebar Menu Config Matching Screenshot 1
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, hasChevron: false },
    { id: 'crisis', label: 'Crisis Management', icon: ShieldAlert, hasChevron: true },
    { id: 'requests', label: 'Assistance Requests', icon: ClipboardList, hasChevron: true },
    { id: 'resources', label: 'Resources', icon: Package, hasChevron: true },
    { id: 'shelters', label: 'Shelters', icon: Building2, hasChevron: true },
    { id: 'volunteers', label: 'Volunteers', icon: Users, hasChevron: true },
    { id: 'donations', label: 'Donations', icon: Gift, hasChevron: true },
    { id: 'ai-ops', label: 'AI Operations', icon: Cpu, hasChevron: true },
    { id: 'maps', label: 'Maps', icon: MapPin, hasChevron: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, hasChevron: false, badge: '3' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, hasChevron: false },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, hasChevron: false },
    { id: 'settings', label: 'Settings', icon: Settings, hasChevron: false }
  ];

  // Dynamic Header Titles
  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Crisis Command Center',
          subtitle: 'Real-time overview of humanitarian operations and emergency coordination',
          icon: Home,
          iconBg: 'bg-[#0e7490]'
        };
      case 'crisis':
        return {
          title: 'Crisis Management',
          subtitle: 'Monitor crises, assess impact, coordinate response, and track recovery',
          icon: ShieldAlert,
          iconBg: 'bg-rose-600'
        };
      case 'requests':
        return {
          title: 'Assistance Requests',
          subtitle: 'Manage, review, and coordinate all emergency assistance requests',
          icon: ClipboardList,
          iconBg: 'bg-indigo-600'
        };
      case 'resources':
        return {
          title: 'Resources Management',
          subtitle: 'Track inventory, allocate resources, and manage supply distribution',
          icon: Package,
          iconBg: 'bg-emerald-600'
        };
      case 'shelters':
        return {
          title: 'Shelter Management',
          subtitle: 'Manage shelter locations, occupancy, facilities, and evacuee services',
          icon: Building2,
          iconBg: 'bg-amber-600'
        };
      case 'volunteers':
        return {
          title: 'Volunteer Management',
          subtitle: 'Manage volunteer rosters, skills, deployments, and mission teams',
          icon: Users,
          iconBg: 'bg-blue-600'
        };
      case 'donations':
        return {
          title: 'Donations Management',
          subtitle: 'Track monetary & item donations, manage donors, and allocate relief supplies',
          icon: Gift,
          iconBg: 'bg-teal-600'
        };
      case 'ai-ops':
        return {
          title: 'AI Operations Center',
          subtitle: 'Explainable AI decision oversight, automated triage models, and ethical governance',
          icon: Cpu,
          iconBg: 'bg-purple-600'
        };
      case 'maps':
        return {
          title: 'Satellite GIS Map',
          subtitle: 'High-resolution geospatial Western Province hazard radar and operational zones',
          icon: MapPin,
          iconBg: 'bg-sky-600'
        };
      case 'notifications':
        return {
          title: 'System Notifications & Alerts',
          subtitle: 'Real-time broadcast alerts, security events, and DMC operational warnings',
          icon: Bell,
          iconBg: 'bg-rose-500'
        };
      case 'reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'Generate insights, track performance, and support data-driven decisions',
          icon: FileBarChart,
          iconBg: 'bg-cyan-600'
        };
      case 'audit':
        return {
          title: 'Immutable Audit Ledger',
          subtitle: 'Cryptographic oversight logs, administrative changes, and verification history',
          icon: ShieldCheck,
          iconBg: 'bg-slate-700'
        };
      case 'settings':
      default:
        return {
          title: 'Platform Administration & RBAC',
          subtitle: 'Manage user credentials, security roles, system health, and global controls',
          icon: Settings,
          iconBg: 'bg-[#0e7490]'
        };
    }
  };

  const currentMeta = getHeaderMeta();
  const HeaderIcon = currentMeta.icon;

  return (
    <div className="adm-ss-layout">
      {/* =========================================================
         1. Left Navigation Sidebar (Exact Match to Screenshot 1)
         ========================================================= */}
      <aside className="adm-ss-sidebar">
        <div className="adm-ss-sidebar-top">
          {/* Brand Header */}
          <div className="adm-ss-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={reliefcoreIcon} alt="RELIEFCORE" className="adm-ss-brand-logo" />
            <div>
              <h2 className="adm-ss-brand-title">RELIEFCORE</h2>
              <span className="adm-ss-brand-sub">Humanitarian Operations</span>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="adm-ss-nav-list">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`adm-ss-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="adm-ss-nav-left">
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </div>
                    <div className="adm-ss-nav-right">
                      {item.badge && (
                        <span className="adm-ss-badge-pill">{item.badge}</span>
                      )}
                      {item.hasChevron && (
                        <ChevronRight size={13} className="adm-ss-chevron" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="adm-ss-sidebar-bottom">
          <div className="adm-ss-user-pill" onClick={() => setActiveTab('settings')}>
            <img src={sarahJohnsonAvatar} alt="Admin User" className="adm-ss-user-avatar" />
            <div className="min-w-0">
              <div className="adm-ss-user-name truncate">
                {authUser?.fullName || 'Sarah Johnson'}
              </div>
              <div className="adm-ss-user-role truncate">
                {authUser?.role || 'Emergency Coordinator'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
         2. Main Application Wrapper (#F4F7FB)
         ========================================================= */}
      <main className="adm-ss-main">
        {/* Top Header Bar */}
        <header className="adm-ss-topbar">
          <div className="adm-ss-title-group">
            <div className={`adm-ss-title-icon ${currentMeta.iconBg}`}>
              <HeaderIcon size={20} />
            </div>
            <div>
              <h1 className="adm-ss-page-heading">{currentMeta.title}</h1>
              <p className="adm-ss-page-subheading">{currentMeta.subtitle}</p>
            </div>
          </div>

          {/* Global Search Input */}
          <div className="adm-ss-search-box">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search people, locations, resources, tickets..."
              className="adm-ss-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right Profile & Alert Badges */}
          <div className="adm-ss-actions-right">
            <button
              className="adm-ss-bell-btn"
              onClick={() => setActiveTab('notifications')}
              title="3 Operational Notifications"
            >
              <Bell size={18} />
              <span className="adm-ss-bell-dot"></span>
            </button>

            <div className="adm-ss-profile-pill" onClick={() => setActiveTab('settings')}>
              <img src={sarahJohnsonAvatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
              <div className="hidden sm:block text-left">
                <div className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {authUser?.fullName || 'Sarah Johnson'}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {authUser?.role || 'Emergency Coordinator'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="adm-ss-content">

          {/* =====================================================
             VIEW 1: DASHBOARD (Matching Screenshot 7 & 9)
             ===================================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* KPI Banner Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <ShieldAlert size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Crises</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">{stats.activeCrises}</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 33% Requiring attention</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Volunteers</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">1,245</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Active volunteers</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resources Deployed</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,280</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 22% Items delivered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">People Assisted</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">12,450</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 28% This month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button
                    className="adm-ss-btn-primary"
                    onClick={() => {
                      setActiveTab('settings');
                      setIsCreateModalOpen(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>+ New Assistance Request</span>
                  </button>
                </div>
              </div>

              {/* Middle Section: Crisis Map + Active Crises */}
              <div className="adm-ss-split-grid">
                {/* Left: Crisis Map */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <div>
                      <h3 className="adm-ss-card-title">Crisis Zones Map</h3>
                      <p className="adm-ss-card-subtitle">Real-time geospatial disaster overlays for Western Province</p>
                    </div>
                    <button
                      className="text-[12px] font-semibold text-[#0e7490] hover:underline bg-transparent border-0 cursor-pointer"
                      onClick={() => setActiveTab('maps')}
                    >
                      View Full Map →
                    </button>
                  </div>

                  <div className="adm-ss-map-container">
                    <img src={westernProvinceMap} alt="Crisis Radar Map" className="adm-ss-map-bg" />
                    {/* Layer Floating Box */}
                    <div className="adm-ss-map-layers-panel">
                      <div className="font-semibold text-slate-800 mb-1">Map Layers</div>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.activeCrises}
                          onChange={() => setMapLayers(p => ({ ...p, activeCrises: !p.activeCrises }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>Active Crises</span>
                      </label>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.shelters}
                          onChange={() => setMapLayers(p => ({ ...p, shelters: !p.shelters }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Shelters</span>
                      </label>
                      <label className="adm-ss-map-legend-item cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mapLayers.medicalFacilities}
                          onChange={() => setMapLayers(p => ({ ...p, medicalFacilities: !p.medicalFacilities }))}
                        />
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>Medical Centers</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Active Crises List */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Active Crises</h3>
                    <span className="text-[11px] text-slate-400">View All →</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Flood - Kelani Area</div>
                        <div className="text-[11.5px] text-slate-500">Colombo, Western Province · 3,200 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-red">High</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Landslide Risk</div>
                        <div className="text-[11.5px] text-slate-500">Gampaha District · 850 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-orange">Medium</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Severe Weather</div>
                        <div className="text-[11.5px] text-slate-500">Kalutara District · 2,100 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-red">High</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900">Coastal Erosion</div>
                        <div className="text-[11.5px] text-slate-500">Negombo Area · 600 affected</div>
                      </div>
                      <span className="adm-ss-pill pill-green">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: Recent Responders & Resource Deployment */}
              <div className="adm-ss-split-grid">
                {/* Recent Responders Table */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Recent Volunteers & Responders</h3>
                    <button
                      className="text-[12px] font-semibold text-[#0e7490] hover:underline bg-transparent border-0 cursor-pointer"
                      onClick={() => setActiveTab('volunteers')}
                    >
                      View All →
                    </button>
                  </div>

                  <div className="adm-ss-table-container">
                    <table className="adm-ss-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-semibold text-slate-800">Tharindu Perera</td>
                          <td>Field Volunteer</td>
                          <td>Colombo</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>Today</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Nimali Silva</td>
                          <td>Medical Support</td>
                          <td>Gampaha</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>Today</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Kavindu Fernando</td>
                          <td>Logistics</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-blue">On Mission</span></td>
                          <td>Yesterday</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-slate-800">Sadeepa Wickramasinghe</td>
                          <td>Community Support</td>
                          <td>Negombo</td>
                          <td><span className="adm-ss-pill pill-green">Active</span></td>
                          <td>2 days ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resource Deployment Progress */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Resource Deployment</h3>
                    <span className="text-[11px] text-slate-400">View All →</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Food Packs</span>
                        <span className="text-slate-500">3,200 / 5,000 (64%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Medical Kits</span>
                        <span className="text-slate-500">1,450 / 2,000 (73%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Tents</span>
                        <span className="text-slate-500">320 / 500 (64%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">Blankets</span>
                        <span className="text-slate-500">980 / 1,500 (65%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 2: RESOURCES MANAGEMENT (Matching Screenshot 2 & 3)
             ===================================================== */}
          {activeTab === 'resources' && (
            <>
              {/* KPI Banner Row */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Inventory Items</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,280</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Across all categories</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <Truck size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Items Dispatched</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">4,320</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 25% This month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Package size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">In Stock</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">3,860</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Available items</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Low Stock Items</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">320</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 40% Need replenishment</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <RefreshCw size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Value (Rs.)</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">12,450,000</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 22% Current inventory value</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('New Resource modal opened')}>
                    <Plus size={16} />
                    <span>+ Add New Resource</span>
                  </button>
                </div>
              </div>

              {/* Resource Categories Row */}
              <div className="adm-ss-card">
                <h3 className="adm-ss-card-title mb-3">Resource Categories</h3>
                <div className="adm-ss-category-grid">
                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-red-50 text-red-500">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Food & Water</span>
                    <span className="adm-ss-category-items">2,140 items · 34%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-blue-50 text-blue-500">
                      <HeartPulse size={20} />
                    </div>
                    <span className="adm-ss-category-name">Medical Supplies</span>
                    <span className="adm-ss-category-items">1,520 items · 24%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-amber-50 text-amber-500">
                      <Building2 size={20} />
                    </div>
                    <span className="adm-ss-category-name">Shelter Materials</span>
                    <span className="adm-ss-category-items">980 items · 16%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-purple-50 text-purple-500">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Clothing</span>
                    <span className="adm-ss-category-items">620 items · 10%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-emerald-50 text-emerald-500">
                      <Droplets size={20} />
                    </div>
                    <span className="adm-ss-category-name">Hygiene Kits</span>
                    <span className="adm-ss-category-items">520 items · 8%</span>
                  </div>

                  <div className="adm-ss-category-card">
                    <div className="adm-ss-category-icon bg-slate-100 text-slate-600">
                      <Package size={20} />
                    </div>
                    <span className="adm-ss-category-name">Other Supplies</span>
                    <span className="adm-ss-category-items">500 items · 8%</span>
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="adm-ss-filters-bar">
                  <div className="adm-ss-filters-left">
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="adm-ss-filter-select w-[220px]"
                    />
                    <select className="adm-ss-filter-select">
                      <option>All Categories</option>
                      <option>Food & Water</option>
                      <option>Medical Supplies</option>
                      <option>Shelter Materials</option>
                    </select>
                    <select className="adm-ss-filter-select">
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                    </select>
                    <select className="adm-ss-filter-select">
                      <option>All Locations</option>
                      <option>Colombo Hub</option>
                      <option>Gampaha Depot</option>
                      <option>Kalutara Safe Camp</option>
                    </select>
                    <button className="adm-ss-btn-reset">
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
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
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-001</td>
                        <td className="font-semibold text-slate-800">Bottled Water (1L)</td>
                        <td>Food & Water</td>
                        <td>5,000</td>
                        <td>Bottles</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Colombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-002</td>
                        <td className="font-semibold text-slate-800">Rice (10kg Bags)</td>
                        <td>Food & Water</td>
                        <td>1,200</td>
                        <td>Bags</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Gampaha</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-003</td>
                        <td className="font-semibold text-slate-800">First Aid Emergency Kit</td>
                        <td>Medical Supplies</td>
                        <td>800</td>
                        <td>Kits</td>
                        <td><span className="adm-ss-pill pill-orange">Low Stock</span></td>
                        <td>Colombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-004</td>
                        <td className="font-semibold text-slate-800">Tarpaulin Heavy Sheet</td>
                        <td>Shelter Materials</td>
                        <td>450</td>
                        <td>Sheets</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Kalutara</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-mono text-slate-500">ITM-2026-005</td>
                        <td className="font-semibold text-slate-800">Emergency Blankets</td>
                        <td>Clothing</td>
                        <td>1,000</td>
                        <td>Pieces</td>
                        <td><span className="adm-ss-pill pill-green">In Stock</span></td>
                        <td>Negombo</td>
                        <td>
                          <div className="adm-ss-row-actions">
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                            <button className="adm-ss-icon-btn"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 3: ASSISTANCE REQUESTS (Matching Screenshot 4 & 5)
             ===================================================== */}
          {activeTab === 'requests' && (
            <>
              {/* Top Stats */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <ClipboardList size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Requests</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">186</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Incoming flow</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Critical Priority</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">24</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-red">↑ 8% Immediate dispatch</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <AlertTriangle size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">High Priority</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">48</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 5% Urgent review</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-teal-soft">
                    <RefreshCw size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Pending Review</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">62</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 15% Processing</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resolved</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">52</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Completed</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('New Assistance Request dialog active')}>
                    <Plus size={16} />
                    <span>+ New Request</span>
                  </button>
                </div>
              </div>

              {/* Split View: Requests Table + AI Decision Support Side Panel */}
              <div className="adm-ss-split-grid">
                {/* Left: Requests Table */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header">
                    <h3 className="adm-ss-card-title">Live Assistance Request Queue</h3>
                    <span className="text-[12px] text-slate-500">Showing 1-5 of 186 requests</span>
                  </div>

                  <div className="adm-ss-table-container">
                    <table className="adm-ss-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Requester</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Priority</th>
                          <th>AI Score</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className="cursor-pointer hover:bg-slate-100/80 transition-colors"
                          onClick={() => setSelectedRequest({
                            id: 'REQ-2026-01842',
                            requester: 'Nimal Perera',
                            phone: '+94 77 123 4567',
                            email: 'nimalp@example.com',
                            category: 'Medical Assistance',
                            urgency: 'Critical',
                            people: 3,
                            location: 'Colombo, Western Province (6.9271° N, 79.8612° E)',
                            aiConfidence: '91%',
                            recommendedPriority: 'HIGH',
                            desc: 'Elderly person with serious health condition needs immediate medical assistance. Unable to reach hospital due to severe local flash flood water levels.',
                            specialReq: 'Elderly, wheelchair access, ongoing heart medication'
                          })}
                        >
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01842</td>
                          <td className="font-semibold text-slate-800">N. Perera</td>
                          <td>Medical</td>
                          <td>Colombo</td>
                          <td><span className="adm-ss-pill pill-red">Critical</span></td>
                          <td><span className="font-semibold text-emerald-600">91%</span></td>
                          <td><span className="adm-ss-pill pill-orange">Under Review</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr
                          className="cursor-pointer hover:bg-slate-100/80 transition-colors"
                          onClick={() => setSelectedRequest({
                            id: 'REQ-2026-01877',
                            requester: 'S. Fernando',
                            phone: '+94 71 889 2233',
                            email: 's.fernando@gmail.com',
                            category: 'Temporary Shelter',
                            urgency: 'High',
                            people: 5,
                            location: 'Gampaha District Center',
                            aiConfidence: '87%',
                            recommendedPriority: 'HIGH',
                            desc: 'House inundated to window height. Family of 5 including 2 children stranded on terrace without drinking water.',
                            specialReq: 'Infant formula, blankets'
                          })}
                        >
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01877</td>
                          <td className="font-semibold text-slate-800">S. Fernando</td>
                          <td>Shelter</td>
                          <td>Gampaha</td>
                          <td><span className="adm-ss-pill pill-orange">High</span></td>
                          <td><span className="font-semibold text-emerald-600">87%</span></td>
                          <td><span className="adm-ss-pill pill-blue">Assigned</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01835</td>
                          <td className="font-semibold text-slate-800">K. Silva</td>
                          <td>Food</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-orange">High</span></td>
                          <td><span className="font-semibold text-emerald-600">82%</span></td>
                          <td><span className="adm-ss-pill pill-gray">Pending</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01628</td>
                          <td className="font-semibold text-slate-800">M. Jayasiri</td>
                          <td>Transport</td>
                          <td>Negombo</td>
                          <td><span className="adm-ss-pill pill-blue">Medium</span></td>
                          <td><span className="font-semibold text-emerald-600">76%</span></td>
                          <td><span className="adm-ss-pill pill-orange">Under Review</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>

                        <tr>
                          <td className="font-mono font-semibold text-sky-700">REQ-2026-01821</td>
                          <td className="font-semibold text-slate-800">D. Perera</td>
                          <td>Evacuation</td>
                          <td>Kalutara</td>
                          <td><span className="adm-ss-pill pill-blue">Medium</span></td>
                          <td><span className="font-semibold text-emerald-600">72%</span></td>
                          <td><span className="adm-ss-pill pill-blue">Assigned</span></td>
                          <td>
                            <button className="adm-ss-icon-btn"><Eye size={13} /></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Selected Request Details & AI Decision Support Card (Matching Screenshot 4) */}
                <div className="adm-ss-card">
                  <div className="adm-ss-card-header border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-slate-900">
                          {selectedRequest ? selectedRequest.id : 'Request #REQ-2026-01842'}
                        </span>
                        <span className="adm-ss-pill pill-red">Critical Priority</span>
                      </div>
                      <span className="text-[11.5px] text-slate-500">Submitted 15 Jun 2026 · AI Triage Verified</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-3">
                    {/* Requester Info */}
                    <div>
                      <div className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Requester Information
                      </div>
                      <div className="text-[13.5px] font-semibold text-slate-900">
                        {selectedRequest ? selectedRequest.requester : 'Nimal Perera'}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        {selectedRequest ? selectedRequest.phone : '+94 77 123 4567'} · Household: 3 people
                      </div>
                      <div className="mt-1">
                        <span className="adm-ss-pill pill-blue">Vulnerable Household (Elderly)</span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div>
                      <div className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Urgency & Medical Description
                      </div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed">
                        {selectedRequest ? selectedRequest.desc : 'Elderly person with serious health condition needs immediate medical assistance. Flood waters breached access roads.'}
                      </p>
                    </div>

                    {/* AI Decision Support Panel */}
                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[13px]">
                          <Cpu size={15} />
                          <span>AI Decision Support</span>
                        </div>
                        <span className="text-[11px] font-semibold text-purple-700">91% Confidence</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="adm-ss-pill pill-red">RECOMMENDED: HIGH</span>
                        <span className="text-[11.5px] text-slate-600">Immediate ground rescue unit required</span>
                      </div>
                      <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-[11.5px] text-amber-800 font-medium">
                        Human Review Required: Coordinator approval mandatory before fleet dispatch.
                      </div>

                      {/* Action Decision Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request #REQ-2026-01842 Approved & Dispatched.')}
                        >
                          Approve
                        </button>
                        <button
                          className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request modified for joint shelter placement.')}
                        >
                          Modify
                        </button>
                        <button
                          className="h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request rejected with advisory notes.')}
                        >
                          Reject
                        </button>
                        <button
                          className="h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-[12px] border-0 cursor-pointer transition-colors"
                          onClick={() => showToast('Request deferred to secondary review queue.')}
                        >
                          Defer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 4: SHELTERS (Matching Screenshot 11)
             ===================================================== */}
          {activeTab === 'shelters' && (
            <>
              {/* KPI Banner */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft">
                    <Building2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Shelters</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">28</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Operational centers</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-teal-soft">
                    <Users size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Capacity</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">6,240</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 8% Available bed spaces</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft">
                    <Building2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Occupied</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">4,618</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 6% Currently in use</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Available Beds</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">1,622</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Ready for placement</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Accessibility Ready</span>
                    <div className="adm-ss-kpi-val-row">
                      <span className="adm-ss-kpi-number">18</span>
                    </div>
                    <span className="adm-ss-kpi-trend text-green">↑ 20% Disabled friendly</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Add New Shelter dialog active')}>
                    <Plus size={16} />
                    <span>+ Add Shelter</span>
                  </button>
                </div>
              </div>

              {/* Shelter Directory Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <div>
                    <h3 className="adm-ss-card-title">Verified Shelters Directory</h3>
                    <p className="adm-ss-card-subtitle">Real-time status, capacities and facilities across Western Province</p>
                  </div>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Shelter Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Occupancy</th>
                        <th>Available</th>
                        <th>Accessibility</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">Colombo Central School</td>
                        <td>Colombo</td>
                        <td>500</td>
                        <td><span className="text-rose-600 font-semibold">420 (84%)</span></td>
                        <td>80 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Gampaha Community Hall</td>
                        <td>Gampaha</td>
                        <td>300</td>
                        <td><span className="text-amber-600 font-semibold">210 (70%)</span></td>
                        <td>90 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Kalutara Relief Center</td>
                        <td>Kalutara</td>
                        <td>250</td>
                        <td><span className="text-rose-600 font-semibold">200 (80%)</span></td>
                        <td>50 beds</td>
                        <td><span className="adm-ss-pill pill-gray">No</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Negombo Public School</td>
                        <td>Negombo</td>
                        <td>400</td>
                        <td><span className="text-rose-600 font-semibold">320 (80%)</span></td>
                        <td>80 beds</td>
                        <td><span className="adm-ss-pill pill-green">Yes</span></td>
                        <td><span className="adm-ss-pill pill-green">Open</span></td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 5: VOLUNTEERS (Matching Screenshot 12)
             ===================================================== */}
          {activeTab === 'volunteers' && (
            <>
              {/* KPI Banner */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Total Volunteers</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">328</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 15% Registered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft"><CheckCircle2 size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Available</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">142</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Ready for deployment</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft"><Truck size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Assigned</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">136</span></div>
                    <span className="adm-ss-kpi-trend text-orange">↑ 8% Currently deployed</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-purple-soft"><RefreshCw size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Pending Verification</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">32</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 5% Awaiting check</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Register Volunteer modal opened')}>
                    <Plus size={16} />
                    <span>+ Register Volunteer</span>
                  </button>
                </div>
              </div>

              {/* Volunteer Roster Table with AI Match Scores */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <h3 className="adm-ss-card-title">Registered Volunteer Personnel</h3>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Skills</th>
                        <th>Location</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Match Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">Amal Perera</td>
                        <td>Medical, First Aid</td>
                        <td>Colombo</td>
                        <td><span className="adm-ss-pill pill-green">Available</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '95%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">95%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Sena Fernando</td>
                        <td>Logistics, Transport</td>
                        <td>Gampaha</td>
                        <td><span className="adm-ss-pill pill-green">Available</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '92%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">92%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Nadee Silva</td>
                        <td>Food Distribution, Community</td>
                        <td>Kalutara</td>
                        <td><span className="adm-ss-pill pill-orange">Busy</span></td>
                        <td><span className="adm-ss-pill pill-teal">Verified</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-purple-600 h-2" style={{ width: '88%' }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">88%</span>
                          </div>
                        </td>
                        <td><button className="adm-ss-icon-btn"><Eye size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 6: SETTINGS / USER MANAGEMENT & RBAC (CORE ADMIN)
             ===================================================== */}
          {activeTab === 'settings' && (
            <>
              {/* Sub-tabs for Settings */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <button
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border-0 transition-colors ${
                    settingsSubTab === 'users' ? 'bg-[#0e7490] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setSettingsSubTab('users')}
                >
                  User Accounts & Security Roles
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border-0 transition-colors ${
                    settingsSubTab === 'system' ? 'bg-[#0e7490] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setSettingsSubTab('system')}
                >
                  System Telemetry & Platform Health
                </button>
              </div>

              {settingsSubTab === 'users' && (
                <>
                  {/* KPI Row for Users */}
                  <div className="adm-ss-kpi-row">
                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Total System Users</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">{stats.totalUsers}</span></div>
                        <span className="adm-ss-kpi-trend text-green">All roles combined</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-purple-soft"><Shield size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Administrators</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">4</span></div>
                        <span className="adm-ss-kpi-trend text-purple">National Command</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-green-soft"><CheckCircle2 size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Active Coordinators</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">18</span></div>
                        <span className="adm-ss-kpi-trend text-green">Online in field hubs</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-card">
                      <div className="adm-ss-kpi-icon-box bg-orange-soft"><AlertTriangle size={22} /></div>
                      <div className="adm-ss-kpi-content">
                        <span className="adm-ss-kpi-label">Security Alerts</span>
                        <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">0</span></div>
                        <span className="adm-ss-kpi-trend text-green">No breach attempts</span>
                      </div>
                    </div>

                    <div className="adm-ss-kpi-action-col">
                      <button className="adm-ss-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} />
                        <span>+ Add New User</span>
                      </button>
                    </div>
                  </div>

                  {/* Users Filter & Table Card */}
                  <div className="adm-ss-card">
                    <div className="adm-ss-card-header">
                      <div>
                        <h3 className="adm-ss-card-title">User Accounts & RBAC Matrix</h3>
                        <p className="adm-ss-card-subtitle">Manage administrative privileges, credentials and field district assignments</p>
                      </div>
                      <button className="adm-ss-btn-reset" onClick={loadData}>
                        <RefreshCw size={12} />
                        <span>Refresh List</span>
                      </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="adm-ss-filters-bar">
                      <div className="adm-ss-filters-left">
                        <input
                          type="text"
                          placeholder="Filter by name, email, district..."
                          className="adm-ss-filter-select w-[240px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                          className="adm-ss-filter-select"
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          <option value="ALL">All Roles</option>
                          <option value="Admin">Admin</option>
                          <option value="Coordinator">Coordinator</option>
                          <option value="LogisticsManager">Logistics Manager</option>
                          <option value="ShelterAdministrator">Shelter Admin</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Citizen">Citizen</option>
                        </select>
                        <select
                          className="adm-ss-filter-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="ALL">All Status</option>
                          <option value="ACTIVE">Active Accounts</option>
                          <option value="LOCKED">Locked Accounts</option>
                        </select>
                        <button
                          className="adm-ss-btn-reset"
                          onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('ALL');
                            setStatusFilter('ALL');
                          }}
                        >
                          <span>Clear Filters</span>
                        </button>
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium">
                        Showing {filteredUsers.length} accounts
                      </span>
                    </div>

                    {/* User Data Table */}
                    <div className="adm-ss-table-container">
                      <table className="adm-ss-table">
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Full Name & Email</th>
                            <th>Role & Permissions</th>
                            <th>District</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id}>
                              <td className="font-mono text-slate-400 text-[11px]">{u.id}</td>
                              <td>
                                <div className="font-semibold text-slate-900">{u.fullName}</div>
                                <div className="text-[11.5px] text-slate-500">{u.email}</div>
                              </td>
                              <td>
                                <span className={`adm-ss-pill ${
                                  u.role === 'Admin' ? 'pill-purple' :
                                  u.role === 'Coordinator' ? 'pill-teal' :
                                  u.role === 'LogisticsManager' ? 'pill-blue' :
                                  u.role === 'ShelterAdministrator' ? 'pill-orange' :
                                  u.role === 'Volunteer' ? 'pill-green' : 'pill-gray'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="text-slate-700">{u.assignedDistrict || 'National'}</td>
                              <td>
                                <span className={`adm-ss-pill ${u.isActive ? 'pill-green' : 'pill-red'}`}>
                                  {u.isActive ? 'Active' : 'Locked'}
                                </span>
                              </td>
                              <td className="text-slate-400 text-[11.5px]">{u.createdAt}</td>
                              <td>
                                <div className="adm-ss-row-actions">
                                  {/* Lock / Unlock Toggle */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => handleToggleStatus(u)}
                                    title={u.isActive ? 'Lock Account' : 'Unlock Account'}
                                  >
                                    {u.isActive ? <Lock size={13} className="text-amber-600" /> : <Unlock size={13} className="text-emerald-600" />}
                                  </button>

                                  {/* Change Role */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => setRoleChangeModal({ isOpen: true, user: u, newRole: u.role })}
                                    title="Modify Role"
                                  >
                                    <Edit size={13} className="text-blue-600" />
                                  </button>

                                  {/* Reset Password */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => setResetPasswordModal({ isOpen: true, user: u, newPassword: '' })}
                                    title="Reset Password Hash"
                                  >
                                    <Key size={13} className="text-purple-600" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    className="adm-ss-icon-btn"
                                    onClick={() => handleDeleteUser(u.id, u.fullName)}
                                    title="Delete User"
                                  >
                                    <Trash2 size={13} className="text-rose-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {settingsSubTab === 'system' && (
                <div className="adm-ss-card space-y-6">
                  <div>
                    <h3 className="adm-ss-card-title">System Infrastructure & Diagnostics</h3>
                    <p className="adm-ss-card-subtitle">Real-time health telemetry across the Western Province server cluster</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">System Uptime</div>
                      <div className="text-[26px] font-bold text-emerald-600">99.98%</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">Continuous operation 48 days</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">Database Latency</div>
                      <div className="text-[26px] font-bold text-sky-600">14.2 ms</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">SQL Server connection verified</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[12px] font-semibold text-slate-500">Cryptographic Ledger</div>
                      <div className="text-[26px] font-bold text-purple-600">Synced</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">SHA-256 block hash valid</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =====================================================
             VIEW 7: REPORTS & ANALYTICS (Matching Screenshot 8)
             ===================================================== */}
          {activeTab === 'reports' && (
            <>
              {/* Top Stats */}
              <div className="adm-ss-kpi-row">
                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-blue-soft"><Users size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">People Assisted</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">12,560</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 28% vs last month</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-green-soft"><Package size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Resources Distributed</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">6,280</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 18% Items delivered</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-orange-soft"><Building2 size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Shelters</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">28</span></div>
                    <span className="adm-ss-kpi-trend text-green">↑ 12% Operational</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-card">
                  <div className="adm-ss-kpi-icon-box bg-red-soft"><ShieldAlert size={22} /></div>
                  <div className="adm-ss-kpi-content">
                    <span className="adm-ss-kpi-label">Active Crises</span>
                    <div className="adm-ss-kpi-val-row"><span className="adm-ss-kpi-number">8</span></div>
                    <span className="adm-ss-kpi-trend text-red">↑ 33% Attention</span>
                  </div>
                </div>

                <div className="adm-ss-kpi-action-col">
                  <button className="adm-ss-btn-primary" onClick={() => showToast('Generating Provincial Humanitarian Report PDF...')}>
                    <Download size={16} />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              {/* Reports Table */}
              <div className="adm-ss-card">
                <div className="adm-ss-card-header">
                  <h3 className="adm-ss-card-title">Recent Operational Reports</h3>
                </div>

                <div className="adm-ss-table-container">
                  <table className="adm-ss-table">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Date Generated</th>
                        <th>Generated By</th>
                        <th>Format</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold text-slate-800">June 2026 - Monthly Crisis Summary</td>
                        <td>Monthly</td>
                        <td>30 Jun 2026</td>
                        <td>Sarah Johnson</td>
                        <td><span className="adm-ss-pill pill-red">PDF</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Q2 2026 - Provincial Impact Report</td>
                        <td>Quarterly</td>
                        <td>15 Jun 2026</td>
                        <td>Admin User</td>
                        <td><span className="adm-ss-pill pill-red">PDF</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-800">Resource Distribution Audit Ledger</td>
                        <td>Operational</td>
                        <td>10 Jun 2026</td>
                        <td>Kasun Perera</td>
                        <td><span className="adm-ss-pill pill-green">Excel</span></td>
                        <td><button className="adm-ss-icon-btn"><Download size={13} /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =====================================================
             VIEW 8: AUDIT LOGS (Cryptographic Ledger)
             ===================================================== */}
          {activeTab === 'audit' && (
            <div className="adm-ss-card">
              <div className="adm-ss-card-header">
                <div>
                  <h3 className="adm-ss-card-title">Immutable Audit Trail</h3>
                  <p className="adm-ss-card-subtitle">Every administrative action, permission elevation and critical dispatch is cryptographically signed</p>
                </div>
              </div>

              <div className="adm-ss-table-container">
                <table className="adm-ss-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Operator</th>
                      <th>Action</th>
                      <th>Target Entity</th>
                      <th>IP Address</th>
                      <th>Verification Hash</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 17:20:12</td>
                      <td className="font-semibold text-slate-800">Sarah Johnson</td>
                      <td>APPROVED_AID_DISPATCH</td>
                      <td>REQ-2026-01842</td>
                      <td>192.168.1.100</td>
                      <td className="font-mono text-[11px] text-purple-700">e82a...91b4</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 16:45:00</td>
                      <td className="font-semibold text-slate-800">Admin User</td>
                      <td>ROLE_SECURITY_ELEVATION</td>
                      <td>usr-002 (Kasun P.)</td>
                      <td>172.20.240.1</td>
                      <td className="font-mono text-[11px] text-purple-700">4c12...88df</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-slate-500">2026-11-14 15:30:19</td>
                      <td className="font-semibold text-slate-800">Kasun Perera</td>
                      <td>CONVOY_DISPATCH_AUTHORIZED</td>
                      <td>CNV-2026-004</td>
                      <td>10.4.2.2</td>
                      <td className="font-mono text-[11px] text-purple-700">77bb...aa01</td>
                      <td><span className="adm-ss-pill pill-green">Verified</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================
             VIEW 9: CRISIS MANAGEMENT, MAPS, NOTIFICATIONS, DONATIONS
             ===================================================== */}
          {['crisis', 'maps', 'notifications', 'donations', 'ai-ops'].includes(activeTab) && (
            <div className="adm-ss-card text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-[#0e7490] flex items-center justify-center mx-auto mb-4">
                <HeaderIcon size={32} />
              </div>
              <h2 className="text-[22px] font-bold text-slate-900">{currentMeta.title}</h2>
              <p className="text-[14px] text-slate-500 max-w-[500px] mx-auto mt-1 mb-6">
                {currentMeta.subtitle}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  className="adm-ss-btn-primary"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Home size={15} />
                  <span>Return to Command Center</span>
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setActiveTab('settings')}
                >
                  Go to User Management & RBAC
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================
         3. Administrative Modals (Add User, Change Role, Reset Password)
         ========================================================= */}

      {/* CREATE NEW USER MODAL */}
      {isCreateModalOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-[18px] font-bold text-slate-900 m-0">Create Platform Account</h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  className="adm-ss-form-input"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kasun.f@reliefcore.lk"
                  className="adm-ss-form-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="adm-ss-form-label">Security Role *</label>
                  <select
                    className="adm-ss-form-input"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="LogisticsManager">Logistics Manager</option>
                    <option value="ShelterAdministrator">Shelter Administrator</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Citizen">Citizen</option>
                  </select>
                </div>
                <div>
                  <label className="adm-ss-form-label">Assigned District</label>
                  <select
                    className="adm-ss-form-input"
                    value={newUser.assignedDistrict}
                    onChange={(e) => setNewUser({ ...newUser, assignedDistrict: e.target.value })}
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="National Command">National Command</option>
                  </select>
                </div>
              </div>

              <div className="adm-ss-form-group">
                <label className="adm-ss-form-label">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="adm-ss-form-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-ss-btn-primary"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE SECURITY ROLE MODAL */}
      {roleChangeModal.isOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 m-0">
                Modify Role for {roleChangeModal.user?.fullName}
              </h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
              >
                <X size={15} />
              </button>
            </div>

            <div className="adm-ss-form-group">
              <label className="adm-ss-form-label">Select Platform Privilege Level</label>
              <select
                className="adm-ss-form-input"
                value={roleChangeModal.newRole}
                onChange={(e) => setRoleChangeModal({ ...roleChangeModal, newRole: e.target.value })}
              >
                <option value="Admin">Admin (Full System Controls)</option>
                <option value="Coordinator">Emergency Coordinator</option>
                <option value="LogisticsManager">Resource & Logistics Manager</option>
                <option value="ShelterAdministrator">Shelter Administrator</option>
                <option value="Volunteer">Field Volunteer</option>
                <option value="Citizen">Citizen / Affected Person</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                onClick={() => setRoleChangeModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
              >
                Cancel
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={handleRoleChange}
              >
                Update Privilege
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordModal.isOpen && (
        <div className="adm-ss-modal-overlay" onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}>
          <div className="adm-ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 m-0">
                Reset Password: {resetPasswordModal.user?.fullName}
              </h3>
              <button
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border-0 flex items-center justify-center cursor-pointer text-slate-500"
                onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}
              >
                <X size={15} />
              </button>
            </div>

            <div className="adm-ss-form-group">
              <label className="adm-ss-form-label">New Temporary Password</label>
              <input
                type="password"
                placeholder="Enter secure temporary password"
                className="adm-ss-form-input"
                value={resetPasswordModal.newPassword}
                onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, newPassword: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold border-0 cursor-pointer"
                onClick={() => setResetPasswordModal({ isOpen: false, user: null, newPassword: '' })}
              >
                Cancel
              </button>
              <button
                className="adm-ss-btn-primary"
                onClick={handleResetPassword}
              >
                Generate Hash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="adm-ss-toast">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
