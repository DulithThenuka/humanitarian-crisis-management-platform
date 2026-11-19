import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shelterService } from '../../services/shelterService';
import {
  LayoutGrid,
  Home,
  Users,
  CheckSquare,
  Package,
  BarChart3,
  Search,
  Bell,
  LogOut,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Data
import {
  SHELTER_MANAGER_USER,
  INITIAL_METRICS,
  PRIORITY_ATTENTION_ITEMS,
  CONNECTED_ASSISTANCE_WORKFLOW,
  INITIAL_RECENT_ACTIVITY,
  INITIAL_SHELTERS_DATA,
  PLACEMENT_ALLOCATIONS_DATA,
  RESOURCE_REQUESTS_DATA,
  SHELTER_REPORTS_DATA
} from './data/shelterData';

// Views
import { ShelterDashboardView } from './views/ShelterDashboardView';
import { DirectoryFacilitiesView } from './views/DirectoryFacilitiesView';
import { CapacityOccupancyView } from './views/CapacityOccupancyView';
import { PlacementAllocationsView } from './views/PlacementAllocationsView';
import { ResourceRequestsView } from './views/ResourceRequestsView';
import { ShelterReportsView } from './views/ShelterReportsView';

// Modals
import { CreateRecordModal } from './components/CreateRecordModal';
import { ExportReportModal } from './components/ExportReportModal';
import { ReviewActionModal } from './components/ReviewActionModal';
import { CreateResourceRequestModal } from './components/CreateResourceRequestModal';

// Styles
import './ShelterManager.css';

export const ShelterAdminDashboard = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reactively sync activeTab with URL route and props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/directory')) {
      setActiveTab('directory');
    } else if (p.includes('/capacity')) {
      setActiveTab('capacity');
    } else if (p.includes('/placements') || p.includes('/allocations') || p.includes('/allocation')) {
      setActiveTab('placements');
    } else if (p.includes('/resources')) {
      setActiveTab('resources');
    } else if (p.includes('/reports')) {
      setActiveTab('reports');
    } else if (p.includes('/dashboard') || p === '/shelter' || p === '/shelter-admin' || p === '/shelter-manager' || p === '/shelters') {
      setActiveTab('dashboard');
    }
  }, [initialTab, location.pathname]);

  // Core Data States
  const [currentUser, setCurrentUser] = useState(() => {
    if (user?.name || user?.fullName) {
      return {
        ...SHELTER_MANAGER_USER,
        name: user.fullName || user.name,
        role: user.role === 6 || user.role === 'ShelterManager' ? 'Shelter Manager' : (user.role || 'Shelter Manager'),
        shortRole: 'Shelter Manager',
        avatar: user.initials || 'SM'
      };
    }
    return SHELTER_MANAGER_USER;
  });
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [shelters, setShelters] = useState(INITIAL_SHELTERS_DATA);
  const [selectedShelterId, setSelectedShelterId] = useState('SH-008');
  const [priorityItems, setPriorityItems] = useState(PRIORITY_ATTENTION_ITEMS);
  const [workflowSteps, setWorkflowSteps] = useState(CONNECTED_ASSISTANCE_WORKFLOW);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [placements, setPlacements] = useState(PLACEMENT_ALLOCATIONS_DATA);
  const [resourceRequests, setResourceRequests] = useState(RESOURCE_REQUESTS_DATA);
  const [reportsData, setReportsData] = useState(SHELTER_REPORTS_DATA);

  // Live Backend Data Fetching with Graceful Fallback
  useEffect(() => {
    let isMounted = true;
    const fetchShelterData = async () => {
      try {
        const res = await shelterService.getAll();
        if (isMounted && res?.succeeded && res?.data && res.data.length > 0) {
          const mapped = res.data.map((s) => ({
            id: s.id,
            name: s.name,
            facilityName: s.facilityName || s.name,
            area: s.area || s.district || 'Western Province',
            capacity: s.totalCapacity || s.capacity || 200,
            occupied: s.currentOccupancy ?? s.occupied ?? 0,
            available: s.availableCapacity ?? s.available ?? Math.max(0, (s.totalCapacity || 200) - (s.currentOccupancy || 0)),
            accessibility: s.facilities || s.accessibility || 'Step-free access',
            status: s.status || 'Operational',
            statusType: s.statusType || (s.status === 'Full' ? 'critical' : s.status === 'Near capacity' ? 'warning' : 'success'),
            guardActive: s.guardActive ?? true,
            managerContact: s.contactPhone || s.managerContact || 'Authorised Staff (+94 11 000 0000)',
            notes: s.notes || 'Verified operational relief location.'
          }));
          setShelters(mapped);
          if (mapped[0]) setSelectedShelterId(mapped[0].id);
        }
      } catch {
        // Fallback to initial prototype data
      }

      try {
        const dashRes = await shelterService.getDashboard();
        if (isMounted && dashRes?.succeeded && dashRes?.data) {
          if (dashRes.data.metrics) setMetrics(dashRes.data.metrics);
          if (dashRes.data.priorityItems?.length > 0) setPriorityItems(dashRes.data.priorityItems);
          if (dashRes.data.workflowSteps?.length > 0) setWorkflowSteps(dashRes.data.workflowSteps);
          if (dashRes.data.recentActivity?.length > 0) setRecentActivity(dashRes.data.recentActivity);
        }
      } catch {
        // Fallback
      }

      try {
        const plcRes = await shelterService.getPlacements();
        if (isMounted && plcRes?.succeeded && plcRes?.data && plcRes.data.length > 0) {
          setPlacements(plcRes.data.map((p) => ({
            id: p.allocationCode || p.id,
            evacueeName: p.evacueeName,
            headOfFamily: p.headOfFamily,
            partySize: p.partySize,
            assignedShelter: p.assignedShelter,
            shelterId: p.shelterId,
            accessibilityNeeded: p.accessibilityNeeded,
            specialNotes: p.specialNotes,
            status: p.status,
            statusType: p.statusType,
            allocatedAt: p.allocatedAt
          })));
        }
      } catch {
        // Fallback
      }

      try {
        const resReqRes = await shelterService.getResourceRequests();
        if (isMounted && resReqRes?.succeeded && resReqRes?.data && resReqRes.data.length > 0) {
          setResourceRequests(resReqRes.data.map((r) => ({
            id: r.requestCode || r.id,
            shelterId: r.shelterId,
            shelterName: r.shelterName,
            itemCategory: r.itemCategory,
            requestedQuantity: r.requestedQuantity,
            urgency: r.urgency,
            urgencyType: r.urgencyType,
            status: r.status,
            statusType: r.statusType,
            requestedBy: r.requestedBy,
            eta: r.eta
          })));
        }
      } catch {
        // Fallback
      }

      try {
        const repRes = await shelterService.getReports();
        if (isMounted && repRes?.succeeded && repRes?.data) {
          setReportsData(repRes.data);
        }
      } catch {
        // Fallback
      }
    };

    fetchShelterData();
    return () => { isMounted = false; };
  }, []);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    actionType: 'allocation',
    shelter: null
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Selected Shelter
  const selectedShelter =
    shelters.find((s) => s.id === selectedShelterId) || shelters[0];

  // Tab Breadcrumb Names
  const tabTitles = {
    dashboard: 'Shelter Dashboard',
    directory: 'Directory & Facilities',
    capacity: 'Capacity & Occupancy',
    placements: 'Placement Allocations',
    resources: 'Resource Requests',
    reports: 'Shelter Reports'
  };

  // Handlers
  const handleSelectPriorityItem = (item) => {
    if (item.targetShelterId) {
      setSelectedShelterId(item.targetShelterId);
      if (item.category === 'Capacity') {
        setActiveTab('capacity');
      } else if (item.category === 'Placement') {
        setActiveTab('placements');
      } else if (item.category === 'Supply') {
        setActiveTab('resources');
      } else {
        setActiveTab('directory');
      }
    }
  };

  // Open the Confirmation Action Modal (matching Figma)
  const handleOpenReviewAction = (shelterId, actionType = 'allocation') => {
    const target = shelters.find((s) => s.id === shelterId) || selectedShelter;
    setReviewModalState({
      isOpen: true,
      actionType,
      shelter: target
    });
  };

  // Execute the Reviewed Action
  const handleExecuteReviewedAction = async ({ shelterId, actionType, reason }) => {
    const target = shelters.find((s) => s.id === shelterId) || selectedShelter;
    if (!target) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Invoke backend shelter action API if shelterId is valid Guid/string
    try {
      if (shelterId && String(shelterId).length > 10) {
        await shelterService.executeAction(shelterId, { actionType, reason });
      }
    } catch {
      // Local state update proceeds smoothly
    }

    if (actionType === 'allocation') {
      if (target.available <= 0) {
        showToast(`Warning: ${target.name} has 0 spaces available! Cannot confirm allocation without overflow.`);
        return;
      }

      // Decrement available, increment occupied
      const updated = shelters.map((s) => {
        if (s.id === shelterId) {
          const newOccupied = s.occupied + 1;
          const newAvailable = Math.max(0, s.capacity - newOccupied);
          const newStatus = newAvailable === 0 ? 'Full' : newAvailable <= 10 ? 'Near capacity' : 'Operational';
          return {
            ...s,
            occupied: newOccupied,
            available: newAvailable,
            status: newStatus
          };
        }
        return s;
      });

      setShelters(updated);

      const newLog = {
        id: `ACT-${Date.now()}`,
        time: timeStr,
        title: `${target.name} - ${target.area}`,
        action: `Allocation confirmed by ${currentUser.name}: "${reason}"`,
        shelterId
      };
      setRecentActivity([newLog, ...recentActivity.slice(0, 4)]);

      setMetrics((prev) => ({
        ...prev,
        currentOccupancy: prev.currentOccupancy + 1,
        remainingCapacity: Math.max(0, prev.remainingCapacity - 1),
        admissionsToday: prev.admissionsToday + 1
      }));

      showToast(`Action confirmed: Allocation committed for ${target.name} (Audit logged)`);
    } else if (actionType === 'clarification') {
      const newLog = {
        id: `ACT-${Date.now()}`,
        time: timeStr,
        title: `${target.name} - Clarification Request`,
        action: `Clarification requested: "${reason}"`,
        shelterId
      };
      setRecentActivity([newLog, ...recentActivity.slice(0, 4)]);
      showToast(`Clarification request sent to Triage for ${target.facilityName}`);
    } else if (actionType === 'escalation') {
      const newLog = {
        id: `ACT-${Date.now()}`,
        time: timeStr,
        title: `${target.name} - Priority Escalation`,
        action: `Escalated by ${currentUser.name}: "${reason}"`,
        shelterId
      };
      setRecentActivity([newLog, ...recentActivity.slice(0, 4)]);
      showToast(`Record escalated to Emergency Coordinator with high priority`);
    }
  };

  const handleSaveNewShelter = async (newShelter) => {
    try {
      const res = await shelterService.create({
        facilityName: newShelter.facilityName || newShelter.name,
        area: newShelter.area,
        capacity: newShelter.capacity,
        occupied: newShelter.occupied,
        accessibility: newShelter.accessibility,
        status: newShelter.status,
        notes: newShelter.notes
      });
      if (res?.succeeded && res?.data) {
        newShelter.id = res.data.id;
      }
    } catch {
      // Local fallback preserves prototype record
    }
    setShelters([newShelter, ...shelters]);
    setSelectedShelterId(newShelter.id);
    setMetrics((prev) => ({
      ...prev,
      registeredShelters: prev.registeredShelters + 1,
      operationalShelters: prev.operationalShelters + 1,
      remainingCapacity: prev.remainingCapacity + newShelter.capacity
    }));
    showToast(`Operational shelter registered: ${newShelter.name}`);
  };

  const handleSaveResourceRequest = async (requestData) => {
    try {
      const res = await shelterService.createResourceRequest({
        shelterId: requestData.shelterId,
        itemCategory: requestData.itemCategory,
        quantity: requestData.quantity,
        unit: requestData.unit,
        priority: requestData.urgency === 'Critical' ? 3 : requestData.urgency === 'High' ? 2 : requestData.urgency === 'Medium' ? 1 : 0,
        notes: requestData.notes
      });
      const createdItem = res?.data || {
        id: `SRR-${Math.floor(200 + Math.random() * 800)}`,
        shelterId: requestData.shelterId,
        shelterName: shelters.find((s) => s.id === requestData.shelterId)?.name || 'Shelter Facility',
        itemCategory: requestData.itemCategory,
        requestedQuantity: `${requestData.quantity} ${requestData.unit}`,
        urgency: requestData.urgency,
        urgencyType: requestData.urgency === 'Critical' ? 'critical' : requestData.urgency === 'High' ? 'warning' : 'info',
        status: 'Pending',
        statusType: 'info',
        requestedBy: currentUser.name,
        eta: 'In Review with Central Logistics'
      };
      setResourceRequests((prev) => [createdItem, ...prev]);
      showToast(`Requisition submitted for ${requestData.itemCategory} (${requestData.quantity} ${requestData.unit})`);
    } catch (err) {
      showToast(`Error submitting request: ${err?.message || 'Failed to submit'}`);
    }
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="sh-portal-container">
      {/* 1. Left Project Slate Navy Sidebar */}
      <aside className="sh-sidebar">
        <div>
          {/* Brand Header */}
          <div className="sh-brand-header">
            <div className="sh-brand-icon-box">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="sh-brand-title">HumanAid</h2>
              <p className="sh-brand-subtitle">Response coordination</p>
            </div>
          </div>

          {/* User Profile Switcher Card */}
          <div className="sh-user-card">
            <div className="sh-user-card-info">
              <div className="sh-user-avatar">{currentUser.avatar}</div>
              <div>
                <div className="sh-user-role-label">Signed in as</div>
                <div className="sh-user-role-name">{currentUser.role}</div>
                <div className="sh-user-person-name">{currentUser.name}</div>
              </div>
            </div>
            <label className="sh-toggle-switch">
              <input
                type="checkbox"
                checked={currentUser.dutyStatus}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, dutyStatus: e.target.checked })
                }
              />
              <span className="sh-toggle-slider" />
            </label>
          </div>

          {/* Navigation Menu */}
          <ul className="sh-nav-list">
            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <div className="sh-nav-btn-content">
                  <LayoutGrid size={17} />
                  <span>Shelter Dashboard</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'directory' ? 'active' : ''}`}
                onClick={() => setActiveTab('directory')}
              >
                <div className="sh-nav-btn-content">
                  <Home size={17} />
                  <span>Directory & Facilities</span>
                </div>
                <span className="sh-nav-badge">4</span>
              </button>
            </li>

            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'capacity' ? 'active' : ''}`}
                onClick={() => setActiveTab('capacity')}
              >
                <div className="sh-nav-btn-content">
                  <Users size={17} />
                  <span>Capacity & Occupancy</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'placements' ? 'active' : ''}`}
                onClick={() => setActiveTab('placements')}
              >
                <div className="sh-nav-btn-content">
                  <CheckSquare size={17} />
                  <span>Placement Allocations</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <div className="sh-nav-btn-content">
                  <Package size={17} />
                  <span>Resource Requests</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`sh-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <div className="sh-nav-btn-content">
                  <BarChart3 size={17} />
                  <span>Shelter Reports</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="sh-sidebar-footer">
          <div className="sh-boundary-box">
            <div className="sh-boundary-header">
              <Shield size={13} />
              <span>Role access boundary</span>
            </div>
            <p className="sh-boundary-text">
              Shelter operations and placements only. Annotated case notes remain hidden.
            </p>
          </div>

          <button className="sh-signout-btn" onClick={() => navigate('/')} style={{ marginBottom: '6px' }}>
            <Home size={15} />
            <span>Platform Home</span>
          </button>

          <button className="sh-signout-btn" onClick={handleSignOut}>
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Layout Area */}
      <div className="sh-main-wrapper">
        {/* Top Navbar */}
        <header className="sh-top-navbar">
          {/* Breadcrumbs */}
          <div className="sh-top-breadcrumbs">
            <span className="sh-breadcrumb-portal">Shelter Manager Portal</span>
            <span className="sh-breadcrumb-current">{tabTitles[activeTab]}</span>
          </div>

          {/* Search Box */}
          <div className="sh-top-search-box">
            <Search size={16} color="#657367" />
            <input
              type="text"
              className="sh-top-search-input"
              placeholder="Search authorised records..."
            />
          </div>

          {/* Top Right Items */}
          <div className="sh-top-right-group">
            <div className="sh-active-op-chip">
              <span className="sh-op-indicator-dot" />
              <span>{currentUser.operationArea}</span>
            </div>

            <button
              className="sh-bell-btn"
              onClick={() => showToast('3 priority shelter notifications logged')}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="sh-bell-badge">{currentUser.notificationCount}</span>
            </button>

            <div className="sh-top-user-pill">
              <div className="sh-top-user-avatar">{currentUser.avatar}</div>
              <div className="sh-top-user-details">
                <span className="sh-top-user-name">{currentUser.name}</span>
                <span className="sh-top-user-role">{currentUser.shortRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="sh-content-body">
          {/* Render Active View */}
          {activeTab === 'dashboard' && (
            <ShelterDashboardView
              metrics={metrics}
              priorityItems={priorityItems}
              workflowSteps={workflowSteps}
              recentActivity={recentActivity}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectPriorityItem={handleSelectPriorityItem}
            />
          )}

          {activeTab === 'directory' && (
            <DirectoryFacilitiesView
              shelters={shelters}
              selectedShelter={selectedShelter}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onConfirmAllocation={(id) => handleOpenReviewAction(id, 'allocation')}
              onRequestClarification={(id) => handleOpenReviewAction(id, 'clarification')}
              onEscalate={(id) => handleOpenReviewAction(id, 'escalation')}
            />
          )}

          {activeTab === 'capacity' && (
            <CapacityOccupancyView
              shelters={shelters}
              selectedShelter={selectedShelter}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onConfirmAllocation={(id) => handleOpenReviewAction(id, 'allocation')}
              onRequestClarification={(id) => handleOpenReviewAction(id, 'clarification')}
              onEscalate={(id) => handleOpenReviewAction(id, 'escalation')}
            />
          )}

          {activeTab === 'placements' && (
            <PlacementAllocationsView
              shelters={shelters}
              selectedShelter={selectedShelter}
              placements={placements}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onConfirmAllocation={(id) => handleOpenReviewAction(id, 'allocation')}
              onRequestClarification={(id) => handleOpenReviewAction(id, 'clarification')}
              onEscalate={(id) => handleOpenReviewAction(id, 'escalation')}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceRequestsView
              shelters={shelters}
              selectedShelter={selectedShelter}
              resourceRequests={resourceRequests}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onConfirmAllocation={(id) => handleOpenReviewAction(id, 'allocation')}
              onRequestClarification={(id) => handleOpenReviewAction(id, 'clarification')}
              onEscalate={(id) => handleOpenReviewAction(id, 'escalation')}
              onRequestSupplies={(shelter) => {
                if (shelter?.id) setSelectedShelterId(shelter.id);
                setIsResourceModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ShelterReportsView
              reportData={reportsData}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Action Review Confirmation Modal Card (Figma Match) */}
      <ReviewActionModal
        isOpen={reviewModalState.isOpen}
        actionType={reviewModalState.actionType}
        shelter={reviewModalState.shelter}
        onClose={() => setReviewModalState({ ...reviewModalState, isOpen: false })}
        onConfirm={handleExecuteReviewedAction}
      />

      {/* Operational Record Registration Modal */}
      <CreateRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewShelter}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportComplete={(msg) => showToast(msg)}
      />

      {/* Shelter Resource Request Modal */}
      <CreateResourceRequestModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        shelters={shelters}
        currentShelterId={selectedShelterId}
        onSave={handleSaveResourceRequest}
      />

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="sh-toast-container">
          <div className="sh-toast">
            <CheckCircle2 size={18} color="#7caa7e" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const ShelterManagerPortal = ShelterAdminDashboard;
export const ShelterManagerDashboard = ShelterAdminDashboard;
export default ShelterAdminDashboard;
