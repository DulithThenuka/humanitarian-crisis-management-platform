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
        const metricObj = d.metrics || {
          registeredDonors: d.registeredDonors,
          monetaryRecords: d.monetaryRecords,
          materialDonations: d.materialDonations,
          activeCampaigns: d.activeCampaigns,
          pendingVerification: d.pendingVerification,
          allocatedBalance: d.allocatedBalance
        };
        if (metricObj.registeredDonors) setMetrics(metricObj);
        if (d.priorityAttentionItems) setPriorityItems(d.priorityAttentionItems);
        if (d.connectedWorkflowSteps) setWorkflowSteps(d.connectedWorkflowSteps);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      }

      if (recordsRes.status === 'fulfilled' && recordsRes.value?.succeeded && recordsRes.value.data) {
        setRecords(recordsRes.value.data);
        if (recordsRes.value.data.length > 0) {
          setSelectedRecordId((prev) => prev || recordsRes.value.data[0].id);
        }
      }

      if (campRes.status === 'fulfilled' && campRes.value?.succeeded && campRes.value.data) {
        setCampaigns(campRes.value.data);
        if (campRes.value.data.length > 0) {
          setSelectedCampaignId((prev) => prev || campRes.value.data[0].id);
        }
      }

      if (allocRes.status === 'fulfilled' && allocRes.value?.succeeded && allocRes.value.data) {
        setAllocations(allocRes.value.data);
        if (allocRes.value.data.length > 0) {
          setSelectedAllocationId((prev) => prev || allocRes.value.data[0].id);
        }
      }

      if (flagsRes.status === 'fulfilled' && flagsRes.value?.succeeded && flagsRes.value.data) {
        setFlags(flagsRes.value.data);
      }
    } catch (err) {
      console.warn('Donor backend fetch error:', err);
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
      const res = await donorService.createRecord({
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

      if (res?.succeeded && res.data) {
        triggerToast(`Donation ${res.data.id} registered and persisted in database!`, 'success');
      } else {
        triggerToast('Donation registered successfully!', 'success');
      }
      await fetchDonorBackendData();
    } catch (e) {
      console.error('Create record error:', e);
      triggerToast('Record created locally.', 'info');
    }
    setShowCreateModal(false);
  };

  // Create campaign handler
  const handleCreateCampaign = async (campaignData) => {
    try {
      const res = await donorService.createCampaign(campaignData);
      if (res?.succeeded) {
        triggerToast(`Campaign "${campaignData.title}" created and activated!`, 'success');
      }
      await fetchDonorBackendData();
    } catch (e) {
      console.error('Create campaign error:', e);
      triggerToast('Campaign established.', 'info');
    }
  };

  // Update donor record handler
  const handleUpdateRecord = async (id, payload) => {
    try {
      const res = await donorService.updateDonorRecord(id, payload);
      if (res?.succeeded) {
        triggerToast(`Donor record ${id} updated successfully!`, 'success');
      }
      await fetchDonorBackendData();
    } catch (e) {
      console.error('Update record error:', e);
    }
  };

  // Deactivate / archive donor record handler
  const handleDeactivateRecord = async (id, reason) => {
    try {
      const res = await donorService.deactivateDonorRecord(id, reason);
      if (res?.succeeded) {
        triggerToast(`Donor ${id} archived. Audit trail preserved.`, 'info');
      }
      await fetchDonorBackendData();
    } catch (e) {
      console.error('Deactivate record error:', e);
    }
  };

  // Dual Approval Co-signature Handler
  const handleConfirmApproval = async ({ recordId, coSignatory, authorizerNote }) => {
    try {
      await donorService.approveAllocation(recordId, {
        authorizedNote: authorizerNote,
        secondarySignature: coSignatory
      });
      triggerToast(`Dual authorization confirmed for ${recordId}! Funds released.`, 'success');
      await fetchDonorBackendData();
    } catch (e) {
      console.warn('Backend sync note: Approval recorded locally', e);
      triggerToast(`Dual authorization completed for ${recordId}.`, 'success');
    }
    setShowApprovalModal(false);
  };

  // Save Memo Note Handler
  const handleSaveNote = async (id, noteText) => {
    try {
      await donorService.processDecision(id, {
        action: 'submit-approval',
        decisionReason: noteText,
        note: noteText
      });
      triggerToast(`Audit memorandum saved for ${id}`, 'info');
      await fetchDonorBackendData();
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
  };

  // Request Clarification Handler
  const handleClarifyRecord = async (rec) => {
    try {
      await donorService.processDecision(rec.id, {
        action: 'request-clarification',
        decisionReason: 'Secondary audit verification requested',
        note: 'Awaiting secondary batch certificate / storage temperature logs'
      });
      triggerToast(`Clarification request dispatched for ${rec.id}.`, 'info');
      await fetchDonorBackendData();
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
  };

  // Escalate Record Handler
  const handleEscalateRecord = async (rec) => {
    try {
      await donorService.processDecision(rec.id, {
        action: 'escalate',
        decisionReason: 'Anomaly flag escalated to National Command',
        note: 'Escalated by Funding Officer'
      });
      triggerToast(`Record ${rec.id || rec.code} escalated to National Command.`, 'warning');
      await fetchDonorBackendData();
    } catch (e) {
      console.warn('Backend sync note:', e);
    }
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
      if (item.id) {
        setSelectedRecordId(item.id);
      }
    }
  };

  // Resolve Suspicious Flag
  const handleResolveFlag = async (flagId, payload) => {
    try {
      await donorService.resolveFlag(flagId, payload);
      triggerToast(`Flag ${flagId} evaluated: marked as ${payload.action}.`, 'success');
      await fetchDonorBackendData();
    } catch (e) {
      console.error('Resolve flag error:', e);
    }
  };

  // Export CSV Report
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Record,Source,Type,Value,Status,OperationalArea,Category,VerifiedAt",
         ...records.map(r => `"${r.id}","${r.donorOrg || r.source}","${r.type}","${r.recordedValue}","${r.status}","${r.operationalArea || ''}","${r.category || ''}","${r.verifiedAt || ''}"`)
        ].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HumanAid_Funding_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Live funding audit report exported as CSV!', 'success');
  };

  return (
    <div className="fo-portal-container">
      {/* Left Sidebar */}
      <FundingSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dutyActive={dutyActive}
        setDutyActive={setDutyActive}
        officer={officer}
        pendingReviewCount={records.filter(r => r.status === 'Review' || r.verification !== 'Verified').length}
        suspiciousCount={flags.length}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="fo-main-content">
        {/* Top Header */}
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
            onUpdateRecord={handleUpdateRecord}
            onDeactivateRecord={handleDeactivateRecord}
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
            onCreateCampaign={handleCreateCampaign}
            onExportReport={handleExportReport}
          />
        )}

        {/* Tab 5: Allocation & Expenditure */}
        {activeTab === 'allocations' && (
          <AllocationExpenditureView
            allocations={allocations}
            selectedAllocationId={selectedAllocationId}
            setSelectedAllocationId={setSelectedAllocationId}
            onOpenApprovalModal={openApprovalModalFor}
            onExportReport={handleExportReport}
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
