import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

// Data
import {
  FUNDING_OFFICER_USER,
  INITIAL_METRICS,
  PRIORITY_ATTENTION_ITEMS,
  CONNECTED_WORKFLOW_STEPS,
  INITIAL_RECENT_ACTIVITY,
  DONOR_MANAGEMENT_RECORDS,
  CAMPAIGNS_DATA,
  ALLOCATIONS_EXPENDITURE_DATA,
  SUSPICIOUS_FLAGS_DATA,
  TRANSPARENCY_REPORTS_DATA
} from './data/fundingOfficerData';

// Layout & Navigation Components
import { FundingSidebar } from './components/FundingSidebar';
import { FundingHeader } from './components/FundingHeader';

// Modals
import { CreateRecordModal } from './components/modals/CreateRecordModal';
import { DualApprovalModal } from './components/modals/DualApprovalModal';
import { ReceiptPreviewModal } from './components/modals/ReceiptPreviewModal';

// Dedicated Views
import { FundingDashboardView } from './views/FundingDashboardView';
import { DonorManagementView } from './views/DonorManagementView';
import { DonationRecordsView } from './views/DonationRecordsView';
import { CampaignsView } from './views/CampaignsView';
import { AllocationExpenditureView } from './views/AllocationExpenditureView';
import { SuspiciousFlagReviewView } from './views/SuspiciousFlagReviewView';
import { TransparencyReportsView } from './views/TransparencyReportsView';

// Styles
import './DonorFundingOfficer.css';

export const DonorFundingOfficerPortal = ({ initialActiveTab = 'dashboard' }) => {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyActive, setDutyActive] = useState(true);

  // Core Data State
  const [officer, setOfficer] = useState(FUNDING_OFFICER_USER);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [priorityItems, setPriorityItems] = useState(PRIORITY_ATTENTION_ITEMS);
  const [workflowSteps, setWorkflowSteps] = useState(CONNECTED_WORKFLOW_STEPS);
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [records, setRecords] = useState(DONOR_MANAGEMENT_RECORDS);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS_DATA);
  const [allocations, setAllocations] = useState(ALLOCATIONS_EXPENDITURE_DATA);
  const [flags, setFlags] = useState(SUSPICIOUS_FLAGS_DATA);
  const [reports, setReports] = useState(TRANSPARENCY_REPORTS_DATA);

  // Selected item IDs
  const [selectedRecordId, setSelectedRecordId] = useState('DON-2048');
  const [selectedCampaignId, setSelectedCampaignId] = useState('CMP-101');
  const [selectedAllocationId, setSelectedAllocationId] = useState('ALC-301');

  // Modals & Feedback State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [targetApprovalRecord, setTargetApprovalRecord] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [targetReceiptRecord, setTargetReceiptRecord] = useState(null);
  const [toast, setToast] = useState(null);

  // Helper Toast
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Sign out handler
  const handleSignOut = () => {
    triggerToast('Signing out of Funding Officer session...', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  // Create new record handler
  const handleCreateRecord = (newRecord) => {
    setRecords([newRecord, ...records]);
    setSelectedRecordId(newRecord.id);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      registeredDonors: {
        ...prev.registeredDonors,
        value: prev.registeredDonors.value + 1
      }
    }));

    // Add activity
    const newAct = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      recordId: newRecord.id,
      source: newRecord.source,
      action: `${newRecord.type} contribution registered into intake ledger`,
      officer: officer.fullName,
      amount: newRecord.recordedValue
    };
    setRecentActivity([newAct, ...recentActivity]);

    triggerToast(`Record ${newRecord.id} successfully created and registered!`, 'success');
  };

  // Dual Approval Co-signature Handler
  const handleConfirmApproval = ({ recordId, coSignatory, authorizerNote }) => {
    // Update matching record
    setRecords(records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'Allocated',
          statusColor: '#3b82f6',
          statusBg: 'rgba(59, 130, 246, 0.15)',
          notes: `${r.notes ? r.notes + ' ' : ''}[Dual Approved by ${officer.fullName} & ${coSignatory}]: ${authorizerNote}`
        };
      }
      return r;
    }));

    // Update matching allocation if applicable
    setAllocations(allocations.map(a => {
      if (a.id === recordId || a.voucherCode === recordId) {
        return {
          ...a,
          approvalStatus: 'Dual Approved',
          statusColor: '#10b981',
          approver2: coSignatory,
          disbursedAmount: a.allocatedAmount
        };
      }
      return a;
    }));

    // Remove from priority items if it was ALC-302
    setPriorityItems(priorityItems.filter(p => p.id !== recordId));

    // Add activity
    const newAct = {
      id: `ACT-${Date.now()}`,
      time: 'Just now',
      recordId,
      source: 'HumanAid Emergency Response',
      action: `Dual authorization completed with ${coSignatory}`,
      officer: officer.fullName,
      amount: 'Approved for Dispatch'
    };
    setRecentActivity([newAct, ...recentActivity]);

    triggerToast(`Dual authorization completed for ${recordId}! Funds released.`, 'success');
  };

  // Save Memo Note Handler
  const handleSaveNote = (id, noteText) => {
    setRecords(records.map(r => r.id === id ? { ...r, notes: noteText } : r));
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, description: noteText } : c));
    setAllocations(allocations.map(a => a.id === id ? { ...a, auditReference: noteText } : a));
    triggerToast(`Authorised memorandum saved for ${id}`, 'info');
  };

  // Request Clarification Handler
  const handleClarifyRecord = (rec) => {
    triggerToast(`Clarification request dispatched to ${rec.source || rec.id} contact point.`, 'info');
  };

  // Escalate Record Handler
  const handleEscalateRecord = (rec) => {
    triggerToast(`Record ${rec.id || rec.code} escalated to Emergency Coordinator (Amara Chen).`, 'warning');
  };

  // Open Approval Modal
  const openApprovalModalFor = (rec) => {
    setTargetApprovalRecord(rec);
    setShowApprovalModal(true);
  };

  // Open Receipt Modal
  const openReceiptModalFor = (rec) => {
    setTargetReceiptRecord(rec);
    setShowReceiptModal(true);
  };

  // Priority Attention item clicked
  const handlePriorityClick = (item) => {
    if (item.relatedTab) {
      setActiveTab(item.relatedTab);
      if (item.id === 'DON-2047') {
        setSelectedRecordId('DON-2047');
      } else if (item.id === 'CMP-104') {
        setSelectedCampaignId('CMP-104');
      }
    }
  };

  // Resolve Suspicious Flag
  const handleResolveFlag = (flagId, note) => {
    setFlags(flags.filter(f => f.id !== flagId));
    setPriorityItems(priorityItems.filter(p => p.id !== 'DON-2047'));
    triggerToast(`Flag ${flagId} cleared and resolved. Record verified.`, 'success');
  };

  // Export Demo Report
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Record,Source,Type,Value,Status,OperationalArea",
         ...records.map(r => `"${r.id}","${r.source}","${r.type}","${r.recordedValue}","${r.status}","${r.operationalArea}"`)
        ].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ReliefCore_Funding_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Demo audit report exported as CSV!', 'success');
  };

  return (
    <div className="fo-portal-container">
      {/* Left Sidebar (matching Figma) */}
      <FundingSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dutyActive={dutyActive}
        setDutyActive={setDutyActive}
        officer={officer}
        pendingReviewCount={records.filter(r => r.status === 'Review').length || 12}
        suspiciousCount={flags.length}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="fo-main-content">
        {/* Top Header (matching Figma) */}
        <FundingHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          officer={officer}
          unreadCount={flags.length}
          onOpenNotifications={() => setActiveTab('suspicious')}
        />

        {/* Tab 1: Funding Dashboard */}
        {activeTab === 'dashboard' && (
          <FundingDashboardView
            metrics={metrics}
            priorityItems={priorityItems}
            workflowSteps={workflowSteps}
            recentActivity={recentActivity}
            onNavigateTab={setActiveTab}
            onOpenPriorityItem={handlePriorityClick}
            onOpenApprovalModal={openApprovalModalFor}
          />
        )}

        {/* Tab 2: Donor Management */}
        {activeTab === 'donors' && (
          <DonorManagementView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
            onOpenApprovalModal={openApprovalModalFor}
            onOpenReceiptModal={openReceiptModalFor}
            onExportReport={handleExportReport}
            onSaveNote={handleSaveNote}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {/* Tab 3: Donation Records */}
        {activeTab === 'donations' && (
          <DonationRecordsView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
            onOpenApprovalModal={openApprovalModalFor}
            onOpenReceiptModal={openReceiptModalFor}
            onExportReport={handleExportReport}
            onSaveNote={handleSaveNote}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {/* Tab 4: Campaigns */}
        {activeTab === 'campaigns' && (
          <CampaignsView
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
            onOpenApprovalModal={openApprovalModalFor}
            onExportReport={handleExportReport}
            onSaveNote={handleSaveNote}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {/* Tab 5: Allocation & Expenditure */}
        {activeTab === 'allocations' && (
          <AllocationExpenditureView
            allocations={allocations}
            selectedAllocationId={selectedAllocationId}
            setSelectedAllocationId={setSelectedAllocationId}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
            onOpenApprovalModal={openApprovalModalFor}
            onExportReport={handleExportReport}
            onSaveNote={handleSaveNote}
            onClarifyRecord={handleClarifyRecord}
            onEscalateRecord={handleEscalateRecord}
          />
        )}

        {/* Tab 6: Suspicious Flag Review */}
        {activeTab === 'suspicious' && (
          <SuspiciousFlagReviewView
            flags={flags}
            onResolveFlag={handleResolveFlag}
            onEscalateFlag={handleEscalateRecord}
          />
        )}

        {/* Tab 7: Transparency Reports */}
        {activeTab === 'reports' && (
          <TransparencyReportsView
            reports={reports}
            onExportReport={handleExportReport}
          />
        )}
      </main>

      {/* Modals */}
      <CreateRecordModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRecord={handleCreateRecord}
      />

      <DualApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        record={targetApprovalRecord}
        onConfirmApproval={handleConfirmApproval}
      />

      <ReceiptPreviewModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        record={targetReceiptRecord}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fo-toast">
          {toast.type === 'success' && <CheckCircle2 size={16} color="#10b981" />}
          {toast.type === 'warning' && <AlertCircle size={16} color="#f59e0b" />}
          {toast.type === 'info' && <Info size={16} color="#3b82f6" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default DonorFundingOfficerPortal;

