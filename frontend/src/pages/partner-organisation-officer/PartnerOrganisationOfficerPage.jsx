import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Building2,
  Package,
  GitPullRequest,
  Briefcase,
  CheckCircle2,
  BarChart2,
  Search,
  ShieldCheck,
  ChevronRight,
  Shield,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Check
} from 'lucide-react';

import './PartnerOfficerStyles.css';
import { useAuth } from '../../context/AuthContext';
import { partnerService } from '../../services/partnerService';
import { requestService } from '../../services/requestService';
import { crisisService } from '../../services/crisisService';
import { incidentService } from '../../services/incidentService';
import apiClient from '../../services/apiClient';

import {
  formatShortCode,
  formatDateTime,
  getCommitmentStatusMeta,
  getRequestStatusLabel,
  getPriorityLabel,
  getApiErrorMessage
} from './partnerOfficerUtils';

import { PartnerOfficerDashboard } from './PartnerOfficerDashboard';
import { OrganisationProfileView } from './OrganisationProfileView';
import { ResourceContributionsView } from './ResourceContributionsView';
import { AssistanceRequestsView } from './AssistanceRequestsView';
import { CoordinationWorkspaceView } from './CoordinationWorkspaceView';
import { DeliveryTrackingView } from './DeliveryTrackingView';
import { PartnerReportsView } from './PartnerReportsView';
import { CreateRecordModal } from './CreateRecordModal';

export const PartnerOrganisationOfficerPage = ({ initialActiveTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [commitments, setCommitments] = useState([]);
  const [zones, setZones] = useState([]);
  const [requests, setRequests] = useState([]);
  const [crises, setCrises] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [selectedCommitmentId, setSelectedCommitmentId] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyActive, setDutyActive] = useState(true);

  // Modal state for creating / editing contributions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState(null);
  const [modalPrefill, setModalPrefill] = useState(null);

  // Notifications popover state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => new Set());

  const [toast, setToast] = useState(null);

  const normalizedRole = (user?.role || '').trim();
  const isCoordinatorOrAdmin = ['Coordinator', 'Admin'].includes(normalizedRole);
  const canAccessIncidents = ['Coordinator', 'Admin', 'CaseManager'].includes(normalizedRole);

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const unwrapList = (res) => {
    const payload = res?.data !== undefined ? res.data : res;
    return Array.isArray(payload) ? payload : [];
  };

  const refreshPortalData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      const [partnersRes, commitmentsRes, zonesRes, requestsRes, crisesRes, alertsRes] = await Promise.all([
        partnerService.getPartners(),
        partnerService.getCommitments(),
        partnerService.getSectorZones(),
        requestService.getAll(),
        crisisService.getCrises({ isActive: true }).catch(() => []),
        apiClient.get('/alerts').catch(() => [])
      ]);

      const partnerList = unwrapList(partnersRes);
      const commitmentList = unwrapList(commitmentsRes);
      const zoneList = unwrapList(zonesRes);
      const requestList = unwrapList(requestsRes);
      const crisisList = unwrapList(crisesRes);
      const alertList = unwrapList(alertsRes);

      setPartners(partnerList);
      setCommitments(commitmentList);
      setZones(zoneList);
      setRequests(requestList);
      setCrises(crisisList);
      setAlerts(alertList);

      if (partnerList.length > 0) {
        setSelectedPartnerId((prev) => {
          if (prev && partnerList.some((p) => p.id === prev)) return prev;
          return partnerList[0].id;
        });
      }

      if (canAccessIncidents) {
        try {
          const incRes = await incidentService.getAll();
          setIncidents(unwrapList(incRes));
        } catch {
          setIncidents([]);
        }
      }
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        'Unable to load Partner Organisation data. Ensure you are signed in with Coordinator, Admin, or LogisticsManager permissions.'
      );
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, canAccessIncidents]);

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshPortalData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, refreshPortalData]);

  const selectedPartner = useMemo(() => {
    return partners.find((p) => p.id === selectedPartnerId) || partners[0] || null;
  }, [partners, selectedPartnerId]);

  const partnerCommitments = useMemo(() => {
    if (!selectedPartner) return commitments;
    return commitments.filter((c) => c.partnerOrganisationId === selectedPartner.id);
  }, [commitments, selectedPartner]);

  // Genuine dynamic notifications from real backend records
  const notifications = useMemo(() => {
    const items = [];

    partnerCommitments
      .filter((c) => getCommitmentStatusMeta(c.status).isDelayed)
      .forEach((c) => {
        items.push({
          id: `notif-delay-${c.id}`,
          title: `${formatShortCode(c.id, 'COM')} delayed`,
          detail: `${c.item} (${c.destinationZone})`,
          time: formatDateTime(c.updatedAt || c.createdAt),
          severity: 'critical',
          onOpen: () => {
            setSelectedCommitmentId(c.id);
            setActiveTab('tracking');
          }
        });
      });

    partnerCommitments
      .filter((c) => getCommitmentStatusMeta(c.status).isPending)
      .forEach((c) => {
        items.push({
          id: `notif-pend-${c.id}`,
          title: `${formatShortCode(c.id, 'COM')} awaiting confirmation`,
          detail: `${c.item} · ${Number(c.qty || 0).toLocaleString()} units`,
          time: formatDateTime(c.createdAt),
          severity: 'warning',
          onOpen: () => {
            setSelectedCommitmentId(c.id);
            setActiveTab('contributions');
          }
        });
      });

    requests
      .filter((r) => getRequestStatusLabel(r.status).toLowerCase() === 'submitted')
      .slice(0, 6)
      .forEach((r) => {
        items.push({
          id: `notif-req-${r.id}`,
          title: `New request ${formatShortCode(r.id, 'REQ')} (${getPriorityLabel(r.urgency)})`,
          detail: `${r.category} · ${r.address || 'Location unspecified'}`,
          time: formatDateTime(r.createdAt),
          severity: getPriorityLabel(r.urgency).toLowerCase() === 'critical' ? 'critical' : 'info',
          onOpen: () => {
            setSelectedRequestId(r.id);
            setActiveTab('requests');
          }
        });
      });

    alerts.slice(0, 3).forEach((a) => {
      items.push({
        id: `notif-alert-${a.id}`,
        title: a.title || 'Emergency Alert',
        detail: a.area || a.severity || 'Active operational bulletin',
        time: formatDateTime(a.publishedAt || a.createdAt),
        severity: 'warning',
        onOpen: () => setActiveTab('coordination')
      });
    });

    return items;
  }, [partnerCommitments, requests, alerts]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !readNotificationIds.has(n.id)).length,
    [notifications, readNotificationIds]
  );

  const pendingRequestsCount = useMemo(
    () => requests.filter((r) => getRequestStatusLabel(r.status).toLowerCase() === 'submitted').length,
    [requests]
  );

  const delayedCommitmentsCount = useMemo(
    () => partnerCommitments.filter((c) => getCommitmentStatusMeta(c.status).isDelayed).length,
    [partnerCommitments]
  );

  const menuItems = [
    { id: 'dashboard', label: 'Partner Dashboard', icon: LayoutGrid },
    { id: 'profile', label: 'Organisation Profile', icon: Building2 },
    { id: 'contributions', label: 'Resource Contributions', icon: Package },
    { id: 'requests', label: 'Assistance Requests', icon: GitPullRequest, badge: pendingRequestsCount },
    { id: 'coordination', label: 'Coordination Workspace', icon: Briefcase },
    { id: 'tracking', label: 'Delivery Tracking', icon: CheckCircle2, badge: delayedCommitmentsCount },
    { id: 'reports', label: 'Partner Reports', icon: BarChart2 }
  ];

  const getTabLabel = (tab) => {
    const found = menuItems.find((m) => m.id === tab);
    return found ? found.label : 'Partner Dashboard';
  };

  // =========================================================================
  // Backend-backed Mutation Handlers (all refresh live state after completion)
  // =========================================================================

  const handleSaveContribution = async (payload) => {
    setSubmitting(true);
    try {
      if (payload.id) {
        const res = await partnerService.updateCommitment(payload.id, {
          item: payload.item,
          qty: payload.qty,
          destinationZone: payload.destinationZone,
          estimatedValueLkr: payload.estimatedValueLkr,
          status: payload.status
        });
        const updated = res?.data || res;
        if (updated?.id) setSelectedCommitmentId(updated.id);
        triggerToast('Resource contribution updated.', 'success');
      } else {
        const res = await partnerService.logCommitment({
          partnerOrganisationId: payload.partnerOrganisationId,
          item: payload.item,
          qty: payload.qty,
          destinationZone: payload.destinationZone,
          estimatedValueLkr: payload.estimatedValueLkr,
          status: payload.status
        });
        const created = res?.data || res;
        if (created?.id) setSelectedCommitmentId(created.id);
        triggerToast('New resource contribution logged.', 'success');
      }
      setIsModalOpen(false);
      setEditingCommitment(null);
      setModalPrefill(null);
      await refreshPortalData();
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to save contribution.'), 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCommitmentStatus = async (commitmentId, nextStatus) => {
    setSubmitting(true);
    try {
      await partnerService.updateCommitmentStatus(commitmentId, nextStatus);
      triggerToast(`Commitment status updated to ${nextStatus}.`, 'success');
      await refreshPortalData();
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to update commitment status.'), 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePartner = async (partnerId, payload) => {
    setSubmitting(true);
    try {
      await partnerService.updatePartner(partnerId, payload);
      triggerToast('Organisation profile updated.', 'success');
      await refreshPortalData();
      return true;
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to update organisation profile.'), 'warning');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyRequest = async (requestId, note) => {
    setSubmitting(true);
    try {
      await requestService.verify(requestId, { notes: note });
      triggerToast('Assistance request verified.', 'success');
      await refreshPortalData();
      return true;
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to verify assistance request.'), 'warning');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, statusEnumVal) => {
    setSubmitting(true);
    try {
      await requestService.updateStatus(requestId, { status: statusEnumVal });
      triggerToast('Assistance request status updated.', 'success');
      await refreshPortalData();
      return true;
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to update request status.'), 'warning');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRequestNote = async (requestId, note) => {
    setSubmitting(true);
    try {
      await requestService.addNote(requestId, { note });
      triggerToast('Operational note logged on assistance request.', 'success');
      await refreshPortalData();
      return true;
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to add request note.'), 'warning');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalateRequest = async (requestId, reason) => {
    setSubmitting(true);
    try {
      await requestService.escalate(requestId, { reason });
      triggerToast('Assistance request escalated to Emergency Coordinator.', 'warning');
      await refreshPortalData();
      return true;
    } catch (err) {
      triggerToast(getApiErrorMessage(err, 'Failed to escalate assistance request.'), 'warning');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePledgeForRequest = (prefill) => {
    setEditingCommitment(null);
    setModalPrefill(prefill);
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const activeCrisisTitle = crises[0]?.title || selectedPartner?.assignedZones?.[0] || 'Active Operations';
  const officerName = user?.fullName || 'Authorised Officer';
  const officerInitials = user?.initials || 'PO';
  const officerRoleLabel = user?.role || 'Partner Officer';

  if (!isAuthenticated || !token) {
    const redirectTarget = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/partner-organisation-officer';

    return (
      <div className="po-portal-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="po-panel" style={{ maxWidth: '460px', width: '100%', padding: '32px', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#1e3d2c',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#162e20', margin: '0 0 8px 0' }}>
            Sign in required
          </h1>
          <p style={{ fontSize: '13.5px', color: '#405044', lineHeight: 1.55, margin: '0 0 22px 0' }}>
            The Partner Organisation Officer Portal loads live partner, contribution, and assistance request records from the RELIEFCORE API. Please sign in with an authorised account (Coordinator, Admin, or LogisticsManager) to continue.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="po-btn po-btn-secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button
              type="button"
              className="po-btn po-btn-primary"
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirectTarget)}`)}
            >
              <span>Sign In to Continue</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="po-portal-container">
      {/* 1. LEFT SIDEBAR (Solid Deep Pine Green #14291e) */}
      <aside className="po-sidebar">
        <div className="po-sidebar-header">
          <div className="po-brand-row">
            <div className="po-brand-logo-wrap">
              <Shield size={19} className="po-brand-shield-icon" />
            </div>
            <div className="po-brand-text">
              <span className="po-brand-title">HumanAid</span>
              <span className="po-brand-sub">Response coordination</span>
            </div>
          </div>
        </div>

        {/* Officer Card with Duty Toggle Switch */}
        <div className="po-officer-card">
          <div className="po-officer-info">
            <div className="po-officer-avatar">{officerInitials}</div>
            <div className="po-officer-meta">
              <span className="po-officer-pre">SIGNED IN AS</span>
              <span className="po-officer-role">{officerRoleLabel}</span>
              <span className="po-officer-name">{officerName}</span>
            </div>
          </div>

          <div
            className={`po-duty-toggle ${dutyActive ? 'active' : ''}`}
            onClick={() => setDutyActive(!dutyActive)}
            title={`Status: ${dutyActive ? 'On Duty' : 'Off Duty'}`}
          >
            <div className="po-duty-dot"></div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="po-nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`po-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="po-nav-item-left">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="po-nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="po-sidebar-footer">
          <div className="po-privacy-notice-box">
            <div className="po-privacy-notice-header">
              <ShieldCheck size={14} className="po-privacy-shield-icon" />
              <span className="po-privacy-title">Role access boundary</span>
            </div>
            <p className="po-privacy-text">
              Authorised partner coordination scope. Actions persist directly to the RELIEFCORE backend.
            </p>
          </div>

          <button type="button" className="po-signout-btn" onClick={handleSignOut}>
            <ChevronRight size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="po-main-content">
        <div className="po-header-container">
          <header className="po-header">
            <div className="po-header-left">
              <div className="po-breadcrumb">
                <span className="po-breadcrumb-root">PARTNER ORGANISATION OFFICER PORTAL</span>
                <span className="po-breadcrumb-current">{getTabLabel(activeTab)}</span>
              </div>

              <div className="po-search-wrapper">
                <Search size={14} className="po-search-icon" />
                <input
                  type="text"
                  placeholder="Search contributions, requests..."
                  className="po-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="po-header-right" style={{ position: 'relative' }}>
              <div
                className="po-operation-box"
                onClick={() => setNotificationsOpen((o) => !o)}
                title="View operational notifications"
              >
                <div className="po-op-info">
                  <span className="po-op-label">Active operation</span>
                  <span className="po-op-value">{activeCrisisTitle}</span>
                </div>
                <div className="po-op-bell">
                  <Bell size={15} />
                  {unreadNotificationsCount > 0 && (
                    <span className="po-bell-badge">{unreadNotificationsCount}</span>
                  )}
                </div>
              </div>

              {/* Real Notifications Dropdown */}
              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '54px',
                    right: '0',
                    width: '340px',
                    maxHeight: '420px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dfe5d8',
                    borderRadius: '12px',
                    boxShadow: '0 14px 32px rgba(22, 46, 32, 0.16)',
                    zIndex: 200,
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#162e20' }}>
                      Notifications ({unreadNotificationsCount} unread)
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setReadNotificationIds(new Set(notifications.map((n) => n.id)))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1e3d2c',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '12.5px', color: '#657367' }}>
                      No active notifications.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.map((n) => {
                        const isUnread = !readNotificationIds.has(n.id);
                        return (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              setReadNotificationIds((prev) => new Set([...prev, n.id]));
                              setNotificationsOpen(false);
                              n.onOpen();
                            }}
                            style={{
                              textAlign: 'left',
                              padding: '10px',
                              borderRadius: '8px',
                              border: '1px solid #edf1eb',
                              backgroundColor: isUnread ? '#f4f8f1' : '#ffffff',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            <div style={{ fontSize: '12.5px', fontWeight: isUnread ? 700 : 600, color: '#162e20' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#405044', marginTop: '2px' }}>
                              {n.detail}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#738075', marginTop: '4px' }}>
                              {n.time}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="po-header-user">
                <div className="po-officer-avatar">{officerInitials}</div>
                <div className="po-user-text">
                  <span className="po-user-name">{officerName}</span>
                  <span className="po-user-role">{officerRoleLabel}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Error Banner if backend fetch failed */}
          {loadError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 24px',
                backgroundColor: '#fee2e2',
                borderBottom: '1px solid #fecaca',
                color: '#991b1b',
                fontSize: '13px'
              }}
            >
              <span>{loadError}</span>
              <button
                type="button"
                className="po-btn po-btn-secondary"
                onClick={refreshPortalData}
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <PartnerOfficerDashboard
            partner={selectedPartner}
            commitments={commitments}
            requests={requests}
            zones={zones}
            alerts={alerts}
            onNavigateTab={setActiveTab}
            onSelectCommitment={setSelectedCommitmentId}
            onSelectRequest={setSelectedRequestId}
            loading={loading}
          />
        )}

        {activeTab === 'profile' && (
          <OrganisationProfileView
            partner={selectedPartner}
            allPartners={partners}
            selectedPartnerId={selectedPartnerId}
            onSelectPartner={setSelectedPartnerId}
            zones={zones}
            commitments={commitments}
            officer={{ fullName: officerName, role: officerRoleLabel }}
            canEdit={isCoordinatorOrAdmin}
            onUpdatePartner={handleUpdatePartner}
            loading={loading}
          />
        )}

        {activeTab === 'contributions' && (
          <ResourceContributionsView
            partner={selectedPartner}
            commitments={commitments}
            zones={zones}
            selectedCommitmentId={selectedCommitmentId}
            setSelectedCommitmentId={setSelectedCommitmentId}
            onOpenCreateModal={() => {
              setEditingCommitment(null);
              setModalPrefill(null);
              setIsModalOpen(true);
            }}
            onOpenEditModal={(item) => {
              setEditingCommitment(item);
              setModalPrefill(null);
              setIsModalOpen(true);
            }}
            onUpdateCommitmentStatus={handleUpdateCommitmentStatus}
            onNavigateToTracking={(commitmentId) => {
              setSelectedCommitmentId(commitmentId);
              setActiveTab('tracking');
            }}
            globalSearch={searchQuery}
            loading={loading}
            submitting={submitting}
          />
        )}

        {activeTab === 'requests' && (
          <AssistanceRequestsView
            requests={requests}
            selectedRequestId={selectedRequestId}
            setSelectedRequestId={setSelectedRequestId}
            canManageRequests={isCoordinatorOrAdmin}
            onVerifyRequest={handleVerifyRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onAddRequestNote={handleAddRequestNote}
            onEscalateRequest={handleEscalateRequest}
            onPledgeForRequest={handlePledgeForRequest}
            globalSearch={searchQuery}
            loading={loading}
            submitting={submitting}
          />
        )}

        {activeTab === 'coordination' && (
          <CoordinationWorkspaceView
            partner={selectedPartner}
            incidents={incidents}
            requests={requests}
            zones={zones}
            canAccessIncidents={canAccessIncidents}
            canManageRequests={isCoordinatorOrAdmin}
            onAddRequestNote={handleAddRequestNote}
            onNotify={triggerToast}
          />
        )}

        {activeTab === 'tracking' && (
          <DeliveryTrackingView
            partner={selectedPartner}
            commitments={commitments}
            selectedCommitmentId={selectedCommitmentId}
            setSelectedCommitmentId={setSelectedCommitmentId}
            onUpdateCommitmentStatus={handleUpdateCommitmentStatus}
            globalSearch={searchQuery}
            loading={loading}
            submitting={submitting}
          />
        )}

        {activeTab === 'reports' && (
          <PartnerReportsView
            partner={selectedPartner}
            commitments={commitments}
            requests={requests}
            zones={zones}
            loading={loading}
          />
        )}
      </main>

      {/* Create / Edit Resource Contribution Modal */}
      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCommitment(null);
          setModalPrefill(null);
        }}
        onSave={handleSaveContribution}
        partner={selectedPartner}
        zones={zones}
        initialData={editingCommitment}
        prefill={modalPrefill}
        submitting={submitting}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="po-toast">
          {toast.type === 'success' && <CheckCircle size={16} color="#15803d" />}
          {toast.type === 'warning' && <AlertCircle size={16} color="#b45309" />}
          {toast.type === 'info' && <Info size={16} color="#1d4ed8" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default PartnerOrganisationOfficerPage;
