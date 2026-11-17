import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

import './PartnerOfficerStyles.css';
import { 
  initialPartnerOfficer,
  initialPartnerMetrics,
  initialPriorityAttention,
  initialWorkflowSteps,
  initialRecords, 
  initialTimeline, 
  initialActivity 
} from './mockData';

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

  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [officer, setOfficer] = useState(initialPartnerOfficer);
  const [metrics, setMetrics] = useState(initialPartnerMetrics);
  const [priorityItems, setPriorityItems] = useState(initialPriorityAttention);
  const [workflowSteps, setWorkflowSteps] = useState(initialWorkflowSteps);
  const [records, setRecords] = useState(initialRecords);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [activity, setActivity] = useState(initialActivity);
  const [selectedRecordId, setSelectedRecordId] = useState('COM-118');
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyActive, setDutyActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Partner Dashboard', icon: LayoutGrid },
    { id: 'profile', label: 'Organisation Profile', icon: Building2, badge: 5 },
    { id: 'contributions', label: 'Resource Contributions', icon: Package },
    { id: 'requests', label: 'Assistance Requests', icon: GitPullRequest },
    { id: 'coordination', label: 'Coordination Workspace', icon: Briefcase },
    { id: 'tracking', label: 'Delivery Tracking', icon: CheckCircle2 },
    { id: 'reports', label: 'Partner Reports', icon: BarChart2 }
  ];

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Partner Dashboard';
      case 'profile': return 'Organisation Profile';
      case 'contributions': return 'Resource Contributions';
      case 'requests': return 'Assistance Requests';
      case 'coordination': return 'Coordination Workspace';
      case 'tracking': return 'Delivery Tracking';
      case 'reports': return 'Partner Reports';
      default: return 'Partner Dashboard';
    }
  };

  const handleCreateRecord = (newRec) => {
    setRecords([newRec, ...records]);
    setSelectedRecordId(newRec.id);
    triggerToast(`Record ${newRec.id} registered into organisation directory!`, 'success');
  };

  const handleAddTimelineEntry = (entry) => {
    setTimeline([entry, ...timeline]);
    triggerToast('Operational coordination update recorded.', 'info');
  };

  const handleConfirmCommitment = (record, note) => {
    setRecords(records.map(r => r.id === record.id ? { ...r, status: 'Confirmed', statusBadge: 'confirmed', notes: note || r.notes } : r));
    triggerToast(`Commitment ${record.id} confirmed and verified.`, 'success');
  };

  const handleClarifyRecord = (record) => {
    triggerToast(`Clarification request dispatched to ${record.responsibleOrg}.`, 'info');
  };

  const handleEscalateRecord = (record) => {
    triggerToast(`Record ${record.id} escalated to Emergency Coordinator.`, 'warning');
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Commitment,SharedIncident,Contribution,Quantity,ResponsibleOrg,Deadline,Status",
         ...records.map(r => `"${r.id}","${r.sharedIncident}","${r.contribution}","${r.quantity}","${r.responsibleOrg}","${r.deadline}","${r.status}"`)
        ].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Partner_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Demo audit report exported as CSV!', 'success');
  };

  const handleSignOut = () => {
    triggerToast('Signing out of Partner Officer session...', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  return (
    <div className="po-portal-container">
      {/* 1. LEFT SIDEBAR (Solid Deep Pine Green #14291e) */}
      <aside className="po-sidebar">
        {/* Brand Header */}
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
            <div className="po-officer-avatar">
              {officer.shortName || 'RP'}
            </div>
            <div className="po-officer-meta">
              <span className="po-officer-pre">SIGNED IN AS</span>
              <span className="po-officer-role">{officer.role || 'Partner Organisation Officer'}</span>
              <span className="po-officer-name">{officer.fullName || 'Ravindu Perera'}</span>
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
                className={`po-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="po-nav-item-left">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="po-nav-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Role Access Boundary & Sign Out */}
        <div className="po-sidebar-footer">
          <div className="po-privacy-notice-box">
            <div className="po-privacy-notice-header">
              <ShieldCheck size={14} className="po-privacy-shield-icon" />
              <span className="po-privacy-title">Role access boundary</span>
            </div>
            <p className="po-privacy-text">
              Your organisation's shared incidents and commitments only. Other partners' private records are hidden.
            </p>
          </div>

          <button className="po-signout-btn" onClick={handleSignOut}>
            <ChevronRight size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="po-main-content">
        {/* Top Header Container */}
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
                  placeholder="Search authorised records..."
                  className="po-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="po-header-right">
              <div className="po-operation-box" onClick={() => setActiveTab('coordination')}>
                <div className="po-op-info">
                  <span className="po-op-label">Active operation</span>
                  <span className="po-op-value">Western Province Flood</span>
                </div>
                <div className="po-op-bell">
                  <Bell size={15} />
                  <span className="po-bell-badge">5</span>
                </div>
              </div>

              <div className="po-header-user">
                <div className="po-officer-avatar">
                  {officer.shortName || 'RP'}
                </div>
                <div className="po-user-text">
                  <span className="po-user-name">{officer.fullName || 'Ravindu Perera'}</span>
                  <span className="po-user-role">Partner Officer</span>
                </div>
              </div>
            </div>
          </header>

          {/* Prototype Notice Banner */}
          <div className="po-prototype-banner">
            <ShieldCheck size={14} className="po-banner-shield" />
            <span>
              <strong>Coursework prototype</strong> &nbsp;All records, AI results and transactions are fictional demonstration data. Actions are local UI simulations.
            </span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <PartnerOfficerDashboard
            metrics={metrics}
            priorityItems={priorityItems}
            workflowSteps={workflowSteps}
            activity={activity}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <OrganisationProfileView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            onOpenCreateRecordModal={() => setIsModalOpen(true)}
            onExportReport={handleExportReport}
            onConfirmCommitment={handleConfirmCommitment}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {activeTab === 'contributions' && (
          <ResourceContributionsView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            onOpenCreateRecordModal={() => setIsModalOpen(true)}
            onExportReport={handleExportReport}
            onConfirmCommitment={handleConfirmCommitment}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {activeTab === 'requests' && (
          <AssistanceRequestsView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            onOpenCreateRecordModal={() => setIsModalOpen(true)}
            onExportReport={handleExportReport}
            onConfirmCommitment={handleConfirmCommitment}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
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
            timeline={timeline}
            onAddTimelineEntry={handleAddTimelineEntry}
          />
        )}

        {activeTab === 'reports' && (
          <PartnerReportsView
            onExportReport={handleExportReport}
          />
        )}
      </main>

      {/* Create Prototype Record Modal */}
      <CreateRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateRecord}
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
