import React, { useState, useEffect, useCallback } from 'react';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
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

// Default metadata
import {
  SHELTER_MANAGER_USER,
  CONNECTED_ASSISTANCE_WORKFLOW
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
import { EditShelterModal } from './components/EditShelterModal';
import { CreatePlacementModal } from './components/CreatePlacementModal';
import { TransferPlacementModal } from './components/TransferPlacementModal';
import { CreateResourceRequestModal } from './components/CreateResourceRequestModal';
import { ExportReportModal } from './components/ExportReportModal';
import { ReviewActionModal } from './components/ReviewActionModal';

// Styles
import './ShelterManager.css';

export const ShelterAdminDashboard = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab with URL route and props
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

  // Current User State
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

  // Core Data States (Initialized safely as empty or defaults)
  const [shelters, setShelters] = useState([]);
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [metrics, setMetrics] = useState({
    registeredShelters: 0,
    operationalShelters: 0,
    currentOccupancy: 0,
    acrossSites: 0,
    remainingCapacity: 0,
    nearCapacityCount: 0,
    supplyShortages: 0,
    criticalShortages: 0,
    admissionsToday: 0,
    transfersToday: 0
  });
  const [priorityItems, setPriorityItems] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState(CONNECTED_ASSISTANCE_WORKFLOW);
  const [recentActivity, setRecentActivity] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [intakeQueue, setIntakeQueue] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);
  const [reportsData, setReportsData] = useState({
    dailySummary: {
      totalAdmissions: 0,
      discharges: 0,
      occupancyRateAverage: '0%',
      safetyCompliantShelters: 0,
      pendingSafetyInspections: 0
    },
    areaOccupancies: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [isCreateShelterModalOpen, setIsCreateShelterModalOpen] = useState(false);
  const [editModalState, setEditModalState] = useState({ isOpen: false, shelter: null });
  const [placementModalState, setPlacementModalState] = useState({
    isOpen: false,
    intakeItem: null,
    targetShelterId: null
  });
  const [transferModalState, setTransferModalState] = useState({
    isOpen: false,
    placement: null
  });
  const [resourceModalState, setResourceModalState] = useState({
    isOpen: false,
    targetShelterId: null
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
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
    }, 4500);
  };

  // Authoritative Data Fetching & Synchronization
  const refreshAllShelterData = useCallback(async () => {
    try {
      // 1. Fetch all shelters
      const shelterRes = await shelterService.getAll();
      let liveShelters = [];
      if (shelterRes?.succeeded && shelterRes?.data) {
        liveShelters = shelterRes.data.map((s) => ({
          id: s.id,
          name: s.name,
          facilityName: s.facilityName || s.name,
          area: s.area || s.district || 'Western Province',
          capacity: s.totalCapacity ?? s.capacity ?? 100,
          totalCapacity: s.totalCapacity ?? s.capacity ?? 100,
          occupied: s.currentOccupancy ?? s.occupied ?? 0,
          currentOccupancy: s.currentOccupancy ?? s.occupied ?? 0,
          available: s.availableCapacity ?? s.available ?? Math.max(0, (s.totalCapacity || 100) - (s.currentOccupancy || 0)),
          accessibility: s.facilities || s.accessibility || 'Step-free access',
          facilities: s.facilities || s.accessibility || '',
          status: s.status || 'Operational',
          statusType: s.statusType || (s.status === 'Full' ? 'critical' : s.status === 'Near capacity' ? 'warning' : 'operational'),
          guardActive: s.guardActive ?? true,
          contactPhone: s.contactPhone || s.managerContact || '',
          managerContact: s.contactPhone || s.managerContact || 'Authorised Staff (+94 11 000 0000)',
          notes: s.notes || 'Verified operational relief location.',
          isActive: s.isActive ?? true
        }));
        setShelters(liveShelters);
        if (!selectedShelterId && liveShelters[0]) {
          setSelectedShelterId(liveShelters[0].id);
        }
      }

      // 2. Fetch dashboard telemetry & KPIs
      const dashRes = await shelterService.getDashboard();
      if (dashRes?.succeeded && dashRes?.data) {
        if (dashRes.data.metrics) setMetrics(dashRes.data.metrics);
        if (dashRes.data.priorityItems) setPriorityItems(dashRes.data.priorityItems);
        if (dashRes.data.workflowSteps?.length > 0) setWorkflowSteps(dashRes.data.workflowSteps);
        if (dashRes.data.recentActivity) setRecentActivity(dashRes.data.recentActivity);
      }

      // 3. Fetch placements
      const plcRes = await shelterService.getPlacements();
      if (plcRes?.succeeded && plcRes?.data) {
        setPlacements(plcRes.data.map((p) => ({
          id: p.allocationCode || p.id,
          rawId: p.id,
          evacueeName: p.evacueeName,
          headOfFamily: p.headOfFamily,
          partySize: p.partySize,
          assignedShelter: p.assignedShelter,
          shelterId: p.shelterId,
          accessibilityNeeded: p.accessibilityNeeded,
          specialNotes: p.specialNotes,
          status: p.status,
          statusType: p.statusType,
          allocatedAt: p.allocatedAt,
          checkInDate: p.checkInDate,
          checkOutDate: p.checkOutDate
        })));
      }

      // 4. Fetch family intake queue
      const intakeRes = await shelterService.getIntakeQueue();
      if (intakeRes?.succeeded && intakeRes?.data) {
        setIntakeQueue(intakeRes.data);
      }

      // 5. Fetch resource requests
      const resReqRes = await shelterService.getResourceRequests();
      if (resReqRes?.succeeded && resReqRes?.data) {
        setResourceRequests(resReqRes.data.map((r) => ({
          id: r.requestCode || r.id,
          rawId: r.id,
          shelterId: r.shelterId,
          shelterName: r.shelterName,
          itemCategory: r.itemCategory,
          requestedQuantity: r.requestedQuantity,
          urgency: r.urgency,
          urgencyType: r.urgencyType,
          status: r.status,
          statusType: r.statusType,
          requestedBy: r.requestedBy,
          eta: r.eta,
          notes: r.notes
        })));
      }

      // 6. Fetch reports analytics
      const repRes = await shelterService.getReports();
      if (repRes?.succeeded && repRes?.data) {
        setReportsData(repRes.data);
      }
    } catch (err) {
      console.error('Error synchronizing shelter data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedShelterId]);

  // Initial load
  useEffect(() => {
    refreshAllShelterData();
  }, [refreshAllShelterData]);

  // Real-time synchronization
  useRealtimeRefresh(['shelters', 'resources', 'placements'], refreshAllShelterData);

  // Selected Shelter Object
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

  // Handlers for Modals & Actions
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

  // Open Edit Modal for a Shelter
  const handleOpenEditShelter = (shelter) => {
    setEditModalState({
      isOpen: true,
      shelter: shelter || selectedShelter
    });
  };

  // Save Edited Shelter
  const handleShelterEdited = async (updated) => {
    showToast(`Shelter "${updated.name}" updated successfully.`);
    await refreshAllShelterData();
  };

  // Save New Shelter
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
      showToast(`Operational shelter registered: ${newShelter.name}`);
      await refreshAllShelterData();
      if (res?.data?.id) setSelectedShelterId(res.data.id);
    } catch (err) {
      showToast(`Error creating shelter: ${err?.message || 'Failed'}`);
    }
  };

  // Open Placement Modal
  const handleOpenPlacementModal = (intakeOrShelter = null) => {
    if (intakeOrShelter && intakeOrShelter.citizenName) {
      // Opening for an intake request
      setPlacementModalState({
        isOpen: true,
        intakeItem: intakeOrShelter,
        targetShelterId: null
      });
    } else if (intakeOrShelter && intakeOrShelter.capacity !== undefined) {
      // Opening for a specific shelter
      setPlacementModalState({
        isOpen: true,
        intakeItem: null,
        targetShelterId: intakeOrShelter.id
      });
    } else {
      setPlacementModalState({
        isOpen: true,
        intakeItem: null,
        targetShelterId: selectedShelterId
      });
    }
  };

  // Placement created
  const handlePlacementSuccess = async (placed) => {
    showToast(`Evacuee placement committed for ${placed.personName || 'household'}. Audit logged.`);
    await refreshAllShelterData();
  };

  // Open Transfer Modal
  const handleOpenTransferModal = (placement) => {
    setTransferModalState({
      isOpen: true,
      placement
    });
  };

  // Transfer completed
  const handleTransferSuccess = async (transferred) => {
    showToast(`Evacuee transferred successfully. Bed capacities rebalanced.`);
    await refreshAllShelterData();
  };

  // Discharge placement
  const handleDischargePlacement = async (placementId) => {
    try {
      const targetPlc = placements.find((p) => p.id === placementId || p.rawId === placementId);
      const idToUse = targetPlc?.rawId || placementId;
      await shelterService.updatePlacementStatus(idToUse, { status: 'Discharged' });
      showToast(`Placement discharged. Bed spaces released back to shelter inventory.`);
      await refreshAllShelterData();
    } catch (err) {
      showToast(`Error discharging placement: ${err?.message || 'Failed'}`);
    }
  };

  // Open Supply Requisition Modal
  const handleOpenResourceModal = (targetShelter = null) => {
    setResourceModalState({
      isOpen: true,
      targetShelterId: targetShelter?.id || selectedShelterId
    });
  };

  // Save Supply Requisition
  const handleSaveResourceRequest = async (requestData) => {
    try {
      await shelterService.createResourceRequest({
        shelterId: requestData.shelterId,
        itemCategory: requestData.itemCategory,
        quantity: requestData.quantity,
        unit: requestData.unit,
        priority: requestData.urgency === 'Critical' ? 3 : requestData.urgency === 'High' ? 2 : requestData.urgency === 'Medium' ? 1 : 0,
        notes: requestData.notes
      });
      showToast(`Requisition submitted for ${requestData.itemCategory} (${requestData.quantity} ${requestData.unit})`);
      await refreshAllShelterData();
    } catch (err) {
      showToast(`Error submitting request: ${err?.message || 'Failed to submit'}`);
    }
  };

  // Update Supply Requisition Status (Dispatch, Delivered, Cancel)
  const handleUpdateResourceStatus = async (requestId, dispatchStatus) => {
    try {
      const targetReq = resourceRequests.find((r) => r.id === requestId || r.rawId === requestId);
      const idToUse = targetReq?.rawId || requestId;
      await shelterService.updateResourceRequestStatus(idToUse, { dispatchStatus });
      const statusName = dispatchStatus === 1 ? 'Dispatched' : dispatchStatus === 2 ? 'Delivered' : 'Cancelled';
      showToast(`Requisition status updated: ${statusName}`);
      await refreshAllShelterData();
    } catch (err) {
      showToast(`Error updating requisition: ${err?.message || 'Failed'}`);
    }
  };

  // Open the Review Action Modal
  const handleOpenReviewAction = (shelterId, actionType = 'allocation') => {
    const target = shelters.find((s) => s.id === shelterId) || selectedShelter;
    setReviewModalState({
      isOpen: true,
      actionType,
      shelter: target
    });
  };

  // Execute Reviewed Action
  const handleExecuteReviewedAction = async ({ shelterId, actionType, reason }) => {
    try {
      if (shelterId) {
        await shelterService.executeAction(shelterId, { actionType, reason });
      }
      showToast(`Action executed: ${actionType.toUpperCase()} logged for audit trail.`);
      await refreshAllShelterData();
    } catch (err) {
      showToast(`Action failed: ${err?.message || 'Could not complete action'}`);
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
                <span className="sh-nav-badge">{shelters.length}</span>
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
                {intakeQueue.length > 0 && (
                  <span className="sh-nav-badge" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
                    {intakeQueue.length}
                  </span>
                )}
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
                {resourceRequests.filter(r => r.status === 'Approved' || r.status === 'Pending').length > 0 && (
                  <span className="sh-nav-badge">
                    {resourceRequests.filter(r => r.status === 'Approved' || r.status === 'Pending').length}
                  </span>
                )}
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
          <div className="sh-top-breadcrumbs">
            <span className="sh-breadcrumb-portal">Shelter Manager Portal</span>
            <span className="sh-breadcrumb-current">{tabTitles[activeTab]}</span>
          </div>

          <div className="sh-top-search-box">
            <Search size={16} color="#657367" />
            <input
              type="text"
              className="sh-top-search-input"
              placeholder="Search authorised records..."
            />
          </div>

          <div className="sh-top-right-group">
            <div className="sh-active-op-chip">
              <span className="sh-op-indicator-dot" />
              <span>{currentUser.operationArea}</span>
            </div>

            <button
              className="sh-bell-btn"
              onClick={() => showToast(`${metrics.nearCapacityCount || 0} shelters near capacity. Telemetry live.`)}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="sh-bell-badge">{metrics.nearCapacityCount || 0}</span>
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
          {activeTab === 'dashboard' && (
            <ShelterDashboardView
              metrics={metrics}
              priorityItems={priorityItems}
              shelters={shelters}
              workflowSteps={workflowSteps}
              recentActivity={recentActivity}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectPriorityItem={handleSelectPriorityItem}
              onRefresh={refreshAllShelterData}
            />
          )}

          {activeTab === 'directory' && (
            <DirectoryFacilitiesView
              shelters={shelters}
              selectedShelter={selectedShelter}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateShelterModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenEditModal={handleOpenEditShelter}
              onOpenAllocateModal={handleOpenPlacementModal}
              onRequestSupplies={handleOpenResourceModal}
              onRequestClarification={(id) => handleOpenReviewAction(id, 'clarification')}
              onEscalate={(id) => handleOpenReviewAction(id, 'escalation')}
              onRefreshData={refreshAllShelterData}
            />
          )}

          {activeTab === 'capacity' && (
            <CapacityOccupancyView
              shelters={shelters}
              selectedShelter={selectedShelter}
              onSelectShelter={(s) => setSelectedShelterId(s.id)}
              onOpenCreateModal={() => setIsCreateShelterModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenEditModal={handleOpenEditShelter}
              onOpenAllocateModal={handleOpenPlacementModal}
              onRefreshData={refreshAllShelterData}
            />
          )}

          {activeTab === 'placements' && (
            <PlacementAllocationsView
              shelters={shelters}
              placements={placements}
              intakeQueue={intakeQueue}
              metrics={metrics}
              onOpenCreatePlacementModal={handleOpenPlacementModal}
              onOpenTransferModal={handleOpenTransferModal}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onDischargePlacement={handleDischargePlacement}
              onRefreshData={refreshAllShelterData}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceRequestsView
              shelters={shelters}
              resourceRequests={resourceRequests}
              onRequestSupplies={() => handleOpenResourceModal(null)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onUpdateStatus={handleUpdateResourceStatus}
              onRefreshData={refreshAllShelterData}
            />
          )}

          {activeTab === 'reports' && (
            <ShelterReportsView
              shelters={shelters}
              reportData={reportsData}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Review Confirmation Modal Card */}
      <ReviewActionModal
        isOpen={reviewModalState.isOpen}
        actionType={reviewModalState.actionType}
        shelter={reviewModalState.shelter}
        onClose={() => setReviewModalState({ ...reviewModalState, isOpen: false })}
        onConfirm={handleExecuteReviewedAction}
      />

      {/* Create Shelter Modal */}
      <CreateRecordModal
        isOpen={isCreateShelterModalOpen}
        onClose={() => setIsCreateShelterModalOpen(false)}
        onSave={handleSaveNewShelter}
      />

      {/* Edit Shelter Modal */}
      <EditShelterModal
        isOpen={editModalState.isOpen}
        shelter={editModalState.shelter}
        onClose={() => setEditModalState({ isOpen: false, shelter: null })}
        onSuccess={handleShelterEdited}
      />

      {/* Allocate Evacuee Placement Modal */}
      <CreatePlacementModal
        isOpen={placementModalState.isOpen}
        shelters={shelters}
        intakeQueue={intakeQueue}
        preselectedIntake={placementModalState.intakeItem}
        preselectedShelterId={placementModalState.targetShelterId}
        onClose={() => setPlacementModalState({ isOpen: false, intakeItem: null, targetShelterId: null })}
        onSuccess={handlePlacementSuccess}
      />

      {/* Transfer Placement Modal */}
      <TransferPlacementModal
        isOpen={transferModalState.isOpen}
        placement={transferModalState.placement}
        shelters={shelters}
        onClose={() => setTransferModalState({ isOpen: false, placement: null })}
        onSuccess={handleTransferSuccess}
      />

      {/* Shelter Resource Request Modal */}
      <CreateResourceRequestModal
        isOpen={resourceModalState.isOpen}
        onClose={() => setResourceModalState({ isOpen: false, targetShelterId: null })}
        shelters={shelters}
        currentShelterId={resourceModalState.targetShelterId}
        onSave={handleSaveResourceRequest}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportComplete={(msg) => showToast(msg)}
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
