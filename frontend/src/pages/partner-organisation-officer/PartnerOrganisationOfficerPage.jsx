import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  Info
} from 'lucide-react';

import './PartnerOfficerStyles.css';
import reliefcoreLogoWhite from '../../assets/reliefcore-logo-white-text.png';
import { initialRecords, initialTimeline, initialActivity } from './mockData';
import { PartnerOfficerDashboard } from './PartnerOfficerDashboard';
import { OrganisationProfileView } from './OrganisationProfileView';
import { ResourceContributionsView } from './ResourceContributionsView';
import { AssistanceRequestsView } from './AssistanceRequestsView';
import { CoordinationWorkspaceView } from './CoordinationWorkspaceView';
import { DeliveryTrackingView } from './DeliveryTrackingView';
import { PartnerReportsView } from './PartnerReportsView';
import { CreateRecordModal } from './CreateRecordModal';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

export const PartnerOrganisationOfficerPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState(initialRecords);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [activity, setActivity] = useState(initialActivity);
  const [selectedRecordId, setSelectedRecordId] = useState('COM-110');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topSearch, setTopSearch] = useState('');
  const [dutyActive, setDutyActive] = useState(true);

  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Navigation Items matching the coursework prototype
  const menuItems = [
    { id: 'dashboard', label: 'Partner Dashboard', icon: LayoutGrid },
    { id: 'profile', label: 'Organisation Profile', icon: Building2, badgeRed: '1' },
    { id: 'contributions', label: 'Resource Contributions', icon: Package, badgeBlue: '4' },
    { id: 'requests', label: 'Assistance Requests', icon: GitPullRequest, badgeBlue: '2' },
    { id: 'coordination', label: 'Coordination Workspace', icon: Briefcase },
    { id: 'tracking', label: 'Delivery Tracking', icon: CheckCircle2 },
    { id: 'reports', label: 'Partner Reports', icon: BarChart2 }
  ];

  // Update record status & append to activity & timeline
  const handleUpdateStatus = (recordId, newStatus, note, actionLabel) => {
    setRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return { ...r, status: newStatus, notes: note || r.notes };
      }
      return r;
    }));

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const targetRecord = records.find(r => r.id === recordId);

    const newActivity = {
      id: `act-${Date.now()}`,
      time: timeStr,
      recordId: recordId,
      incidentId: targetRecord?.sharedIncident || 'CR-2026-014',
      text: `${actionLabel || 'Status updated'} by Partner Officer Ravindu Perera`
    };
    setActivity(prev => [newActivity, ...prev.slice(0, 9)]);

    const newTimelineItem = {
      id: `tl-${Date.now()}`,
      time: timeStr,
      actor: 'Partner Officer (Ravindu Perera)',
      role: 'Role 1542 - authorized participants only',
      action: `${actionLabel || 'Record updated'}: ${recordId}`,
      details: note || `Record status shifted to ${newStatus}. Logged in verification audit.`,
      tag: newStatus
    };
    setTimeline(prev => [newTimelineItem, ...prev]);

    if (showAlert) {
      showAlert(`${actionLabel || 'Updated'}: ${recordId} is now "${newStatus}"`, 'success');
    }
  };

  const handleCreateRecord = (newRec) => {
    setRecords(prev => [newRec, ...prev]);
    setSelectedRecordId(newRec.id);
    if (showAlert) {
      showAlert(`Prototype record ${newRec.id} created successfully.`, 'success');
    }
  };

  const handleAddTimelineEntry = (entry) => {
    setTimeline(prev => [entry, ...prev]);
    if (showAlert) {
      showAlert('Operational coordination message recorded.', 'success');
    }
  };

  const handleExportReport = () => {
    const headers = ['Commitment ID', 'Shared Incident', 'Contribution / Request', 'Quantity', 'Responsible Org', 'Deadline', 'Status'];
    const rows = records.map(r => [
      r.id,
      r.sharedIncident,
      `"${r.contribution}"`,
      `"${r.quantity}"`,
      `"${r.responsibleOrg}"`,
      `"${r.deadline}"`,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `partner-officer-audit-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showAlert) {
      showAlert('Demonstration audit report downloaded as CSV.', 'info');
    }
  };

  const handleSignOut = () => {
    if (logout) logout();
    navigate('/login');
  };

  const currentTabObj = menuItems.find(m => m.id === activeTab);

  return (
    <div className="po-portal-shell">
      {/* 1. TOP NAVBAR (MATCHING PROJECT BRANDING) */}
      <header className="po-top-navbar">
        <div className="po-navbar-brand-row">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={reliefcoreLogoWhite}
              alt="RELIEFCORE"
              className="po-navbar-logo-img"
            />
          </Link>
          <span className="po-navbar-live-pill">LIVE</span>
          <div className="po-navbar-divider"></div>
          <span className="po-navbar-portal-title">
            <ShieldCheck size={16} color="#60a5fa" />
            <span>Partner Organisation Officer Portal</span>
          </span>
        </div>

        <div className="po-navbar-right-tools">
          <div className="po-ops-session-chip">
            <span style={{ color: '#94a3b8' }}>Session:</span>
            <span>Western Province Flood</span>
            <span className="po-badge-count-red">5</span>
          </div>

          <div className="po-navbar-user-block">
            <div className="po-nav-avatar-circle">RP</div>
            <div className="po-nav-user-text">
              <span className="po-nav-user-name">Ravindu Perera</span>
              <span className="po-nav-user-role">Partner Officer</span>
            </div>
          </div>

          <Link to="/coordinator/dashboard" className="po-nav-exit-btn">
            <ArrowLeft size={13} />
            <span>Coordinator View</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN BODY (LEFT BLUE SIDEBAR + RIGHT CONTENT) */}
      <div className="po-body-container">
        {/* LEFT MENU (ONLY THIS BACKGROUND IS BLUE AS REQUESTED) */}
        <aside className="po-blue-sidebar-menu">
          <div>
            {/* Brand Header */}
            <div className="po-menu-brand-header">
              <div className="po-menu-brand-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="po-menu-brand-title">HumanAid</div>
                <div className="po-menu-brand-sub">Response coordination</div>
              </div>
            </div>

            {/* Officer Duty Card */}
            <div className="po-officer-duty-card">
              <div className="po-duty-left">
                <div className="po-duty-avatar">RP</div>
                <div className="po-duty-col">
                  <span className="po-duty-signed">Signed in as:</span>
                  <span className="po-duty-role">Partner Organisation Officer</span>
                  <span className="po-duty-name">Ravindu Perera</span>
                </div>
              </div>

              <div 
                className="po-duty-toggle"
                onClick={() => setDutyActive(!dutyActive)}
                style={{ backgroundColor: dutyActive ? '#22c55e' : 'rgba(255,255,255,0.3)' }}
                title="Toggle Duty Status"
              >
                <div 
                  className="po-duty-toggle-thumb" 
                  style={{ right: dutyActive ? '2px' : 'auto', left: dutyActive ? 'auto' : '2px' }}
                />
              </div>
            </div>

            {/* Menu List */}
            <nav className="po-menu-nav-list">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`po-menu-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="po-menu-btn-left">
                      <Icon size={17} className="po-menu-btn-icon" />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeRed && (
                      <span className="po-menu-badge-red">{item.badgeRed}</span>
                    )}
                    {item.badgeBlue && !isActive && (
                      <span className="po-menu-badge-blue">{item.badgeBlue}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar */}
          <div className="po-menu-footer">
            <div className="po-menu-boundary-box">
              <div className="po-menu-boundary-head">
                <Shield size={13} color="#93c5fd" />
                <span>Role access boundary</span>
              </div>
              <div className="po-menu-boundary-text">
                Your organisation's shared incidents and commitments only. Other partners' private records are hidden.
              </div>
            </div>

            <button type="button" className="po-menu-signout-btn" onClick={handleSignOut}>
              <ChevronRight size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN VIEWPORT (BLUE & WHITE ENTERPRISE DESIGN) */}
        <section className="po-main-viewport">
          {/* Sub-Header Banner */}
          <div className="po-content-sub-header">
            <div className="po-header-breadcrumbs">
              <span className="po-bc-portal-label">Partner Organisation Officer Portal</span>
              <h2 className="po-bc-page-title">{currentTabObj?.label || 'Partner Dashboard'}</h2>
            </div>

            <div className="po-header-filter-bar">
              <div className="po-search-input-wrap">
                <Search size={15} className="po-search-input-icon" />
                <input
                  type="text"
                  placeholder="Search authorised records..."
                  className="po-search-field"
                  value={topSearch}
                  onChange={(e) => setTopSearch(e.target.value)}
                />
              </div>

              {activeTab === 'profile' || activeTab === 'contributions' || activeTab === 'requests' ? (
                <button
                  type="button"
                  className="po-btn-white-secondary"
                  onClick={handleExportReport}
                >
                  Export demo report
                </button>
              ) : null}

              <button
                type="button"
                className="po-btn-blue-primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Create prototype record
              </button>
            </div>
          </div>

          {/* Coursework Disclaimer Strip */}
          <div className="po-disclaimer-banner">
            <Info size={15} color="#2563eb" />
            <span>
              <span className="bold">Coursework prototype:</span> All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.
            </span>
          </div>

          {/* Page Body Scroll */}
          <main className="po-viewport-body">
            {activeTab === 'dashboard' && (
              <PartnerOfficerDashboard
                records={records}
                activity={activity}
                onSelectRecord={(id) => setSelectedRecordId(id)}
                onNavigateTab={(tabId) => setActiveTab(tabId)}
              />
            )}

            {activeTab === 'profile' && (
              <OrganisationProfileView
                records={records}
                selectedRecordId={selectedRecordId}
                onSelectRecord={(id) => setSelectedRecordId(id)}
                onUpdateStatus={handleUpdateStatus}
                onCreateRecordClick={() => setIsModalOpen(true)}
                onExportReport={handleExportReport}
              />
            )}

            {activeTab === 'contributions' && (
              <ResourceContributionsView
                records={records}
                selectedRecordId={selectedRecordId}
                onSelectRecord={(id) => setSelectedRecordId(id)}
                onUpdateStatus={handleUpdateStatus}
                onCreateRecordClick={() => setIsModalOpen(true)}
                onExportReport={handleExportReport}
              />
            )}

            {activeTab === 'requests' && (
              <AssistanceRequestsView
                records={records}
                selectedRecordId={selectedRecordId}
                onSelectRecord={(id) => setSelectedRecordId(id)}
                onUpdateStatus={handleUpdateStatus}
                onCreateRecordClick={() => setIsModalOpen(true)}
                onExportReport={handleExportReport}
              />
            )}

            {activeTab === 'coordination' && (
              <CoordinationWorkspaceView
                timeline={timeline}
                onAddTimelineEntry={handleAddTimelineEntry}
              />
            )}

            {activeTab === 'tracking' && (
              <DeliveryTrackingView
                records={records}
              />
            )}

            {activeTab === 'reports' && (
              <PartnerReportsView
                records={records}
                onExportReport={handleExportReport}
              />
            )}
          </main>
        </section>
      </div>

      {/* Modal Dialog for Prototype Record */}
      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateRecord}
      />
    </div>
  );
};

export default PartnerOrganisationOfficerPage;

