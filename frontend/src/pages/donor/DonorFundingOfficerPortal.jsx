import React, { useState, useEffect, useCallback } from 'react';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { donorService } from '../../services/donorService';

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

  // Load live data from Donor Backend API
  const fetchDonorBackendData = useCallback(async () => {
    try {
      const [dashRes, recordsRes, campRes, allocRes, flagsRes] = await Promise.allSettled([
        donorService.getDashboard(),
        donorService.getDonorRecords(),
        donorService.getCampaigns(),
        donorService.getAllocations(),
        donorService.getSuspiciousFlags()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.succeeded && dashRes.value.data) {
        const d = dashRes.value.data;
        if (d.metrics) setMetrics(d.metrics);
        if (d.priorityAttentionItems?.length) setPriorityItems(d.priorityAttentionItems);
        if (d.connectedWorkflowSteps?.length) setWorkflowSteps(d.connectedWorkflowSteps);
        if (d.recentActivity?.length) setRecentActivity(d.recentActivity);
      }

      if (recordsRes.status === 'fulfilled' && recordsRes.value?.succeeded && recordsRes.value.data?.length) {
        setRecords(recordsRes.value.data);
        setSelectedRecordId((prev) => prev || recordsRes.value.data[0].id);
      }

      if (campRes.status === 'fulfilled' && campRes.value?.succeeded && campRes.value.data?.length) {
        setCampaigns(campRes.value.data);
      }

      if (allocRes.status === 'fulfilled' && allocRes.value?.succeeded && allocRes.value.data?.length) {
        setAllocations(allocRes.value.data);
      }

      if (flagsRes.status === 'fulfilled' && flagsRes.value?.succeeded && flagsRes.value.data?.length) {
        setFlags(flagsRes.value.data);
      }
    } catch (err) {
      console.warn('Donor backend fetch note: Running in resilient demo mode', err);
    }
  }, []);

  useEffect(() => {
    fetchDonorBackendData();
  }, [fetchDonorBackendData]);

  useRealtimeRefresh(['donations'], fetchDonorBackendData);

  // Sign out handler
  const handleSignOut = () => {
    triggerToast('Signing out of Funding Officer session...', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  // Create new record handler
  const handleCreateRecord = async (newRecord) => {
    try {
      await donorService.createRecord({
        donorOrg: newRecord.donorOrg || newRecord.source,
        source: newRecord.source,
        contactPerson: newRecord.contactPerson,
        email: newRecord.email,
        phone: newRecord.phone,
        type: newRecord.type,
        amount: newRecord.rawValue || 0,
        currency: newRecord.currency || 'LKR',
        category: newRecord.category || 'General Relief',
        operationalArea: newRecord.operationalArea || 'Western Province',
        notes: newRecord.notes || '',
        allocationTarget: newRecord.allocationTarget || 'Unallocated'
      });
    } catch (e) {
      console.warn('Backend sync note: Record saved locally', e);
    }

    setRecords([newRecord, ...records]);
    setSelectedRecordId(newRecord.id);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      registeredDonors: {
        ...prev.registeredDonors,
        value: (prev.registeredDonors?.value || 0) + 1
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
  const handleConfirmApproval = async ({ recordId, coSignatory, authorizerNote }) => {
    try {
      await donorService.approveAllocation(recordId, {
        authorizedNote: authorizerNote,
        secondarySignature: coSignatory
      });
    } catch (e) {
      console.warn('Backend sync note: Approval recorded locally', e);
    }

    // Update matching record
    setRecords(records.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'Allocated',
          statusColor: '#3d6b4f',
          statusBg: '#edf2e6',
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
  const handleSaveNote = async (id, noteText) => {
    try {
      await donorService.processDecision(id, {
        action: 'memo-note',
        decisionReason: noteText,
        note: noteText
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
    setRecords(records.map(r => r.id === id ? { ...r, notes: noteText } : r));
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, description: noteText } : c));
    setAllocations(allocations.map(a => a.id === id ? { ...a, auditReference: noteText } : a));
    triggerToast(`Authorised memorandum saved for ${id}`, 'info');
  };

  // Request Clarification Handler
  const handleClarifyRecord = async (rec) => {
    try {
      await donorService.processDecision(rec.id, {
        action: 'request-clarification',
        decisionReason: 'Secondary audit verification requested',
        note: 'Awaiting secondary batch certificate / storage temperature logs'
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
    triggerToast(`Clarification request dispatched to ${rec.source || rec.id} contact point.`, 'info');
  };

  // Escalate Record Handler
  const handleEscalateRecord = async (rec) => {
    try {
      await donorService.processDecision(rec.id, {
        action: 'escalate',
        decisionReason: 'Anomaly flag escalated to National Command',
        note: 'Escalated by Funding Officer'
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
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
  const handleResolveFlag = async (flagId, note) => {
    try {
      await donorService.resolveFlag(flagId, {
        action: 'clear',
        resolutionNotes: note || 'Resolved by Funding Officer verification'
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
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
    link.setAttribute("download", `HumanAid_Funding_Report_${new Date().toISOString().slice(0, 10)}.csv`);
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

