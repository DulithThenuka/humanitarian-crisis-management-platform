import React, { useState, useEffect, useCallback } from 'react';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { donorService } from '../../services/donorService';

import { FUNDING_OFFICER_USER } from './data/fundingOfficerData';

// Layout & Navigation Components
import { FundingSidebar } from './components/FundingSidebar';
import { FundingHeader } from './components/FundingHeader';

// Modals
import { CreateRecordModal } from './components/modals/CreateRecordModal';
import { DualApprovalModal } from './components/modals/DualApprovalModal';
import { ReceiptPreviewModal } from './components/modals/ReceiptPreviewModal';

// Dedicated Views (Distinct per module)
import { FundingDashboardView } from './views/FundingDashboardView';
import { DonorManagementView } from './views/DonorManagementView';
import { DonationRecordsView } from './views/DonationRecordsView';
import { CampaignsView } from './views/CampaignsView';
import { AllocationExpenditureView } from './views/AllocationExpenditureView';
import { SuspiciousFlagReviewView } from './views/SuspiciousFlagReviewView';
import { TransparencyReportsView } from './views/TransparencyReportsView';

import './DonorFundingOfficer.css';

export const DonorFundingOfficerPortal = ({ initialActiveTab = 'dashboard' }) => {
  const navigate = useNavigate();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyActive, setDutyActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Logged-in / Officer State
  const [officer] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored?.fullName) {
        const initials = stored.fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
        return { ...FUNDING_OFFICER_USER, fullName: stored.fullName, shortName: initials, role: stored.role || 'Funding Officer' };
      }
    } catch {
      // ignore parse error
    }
    return FUNDING_OFFICER_USER;
  });

  // Live Backend State
  const [metrics, setMetrics] = useState(null);
  const [priorityItems, setPriorityItems] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [openFlagsCount, setOpenFlagsCount] = useState(0);

  const [donorProfiles, setDonorProfiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [allocationOverview, setAllocationOverview] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [flags, setFlags] = useState([]);
  const [reportData, setReportData] = useState(null);

  // Selected item IDs
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedAllocationId, setSelectedAllocationId] = useState(null);

  // Modals & Feedback State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [targetApprovalRecord, setTargetApprovalRecord] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [targetReceiptRecord, setTargetReceiptRecord] = useState(null);
  const [toast, setToast] = useState(null);

  const triggerToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const extractError = (err, fallback) => {
    if (err?.errors?.length) return err.errors.join(' ');
    if (err?.message) return err.message;
    return fallback;
  };

  // Single-source-of-truth refresh across all 7 modules
  const refreshAllData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setApiError(null);
    try {
      const [dashRes, donorsRes, recordsRes, campRes, allocRes, flagsRes, reportRes] = await Promise.all([
        donorService.getDashboard(),
        donorService.getDonorProfiles(),
        donorService.getDonorRecords(),
        donorService.getCampaigns(),
        donorService.getAllocationOverview(),
        donorService.getSuspiciousFlags(),
        donorService.getTransparencyReport()
      ]);

      if (dashRes?.succeeded && dashRes.data) {
        const d = dashRes.data;
        setMetrics({
          registeredDonors: d.registeredDonors,
          monetaryRecords: d.monetaryRecords,
          materialDonations: d.materialDonations,
          activeCampaigns: d.activeCampaigns,
          pendingVerification: d.pendingVerification,
          allocatedBalance: d.allocatedBalance,
          availableUnallocated: d.availableUnallocated
        });
        setPriorityItems(d.priorityAttentionItems || []);
        setWorkflowSteps(d.connectedWorkflowSteps || []);
        setRecentActivity(d.recentActivity || []);
        setOpenFlagsCount(d.openSuspiciousFlagsCount || 0);
      }

      if (donorsRes?.succeeded) {
        setDonorProfiles(donorsRes.data || []);
      }

      if (recordsRes?.succeeded) {
        const list = recordsRes.data || [];
        setRecords(list);
        setSelectedRecordId(prev => prev && list.some(r => r.id === prev) ? prev : (list[0]?.id || null));
      }

      if (campRes?.succeeded) {
        const list = campRes.data || [];
        setCampaigns(list);
        setSelectedCampaignId(prev => prev && list.some(c => c.id === prev) ? prev : (list[0]?.id || null));
      }

      if (allocRes?.succeeded && allocRes.data) {
        setAllocationOverview(allocRes.data);
        const list = allocRes.data.allocations || [];
        setAllocations(list);
        setSelectedAllocationId(prev => prev && list.some(a => a.id === prev) ? prev : (list[0]?.id || null));
      }

      if (flagsRes?.succeeded) {
        setFlags(flagsRes.data || []);
      }

      if (reportRes?.succeeded && reportRes.data) {
        setReportData(reportRes.data);
      }
    } catch (err) {
      const msg = extractError(err, 'Unable to load live Funding Officer data from backend.');
      setApiError(msg);
      triggerToast(msg, 'warning');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [triggerToast]);

  useEffect(() => {
    refreshAllData(true);
  }, [refreshAllData]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    triggerToast('Signed out of Funding Officer session.', 'info');
    setTimeout(() => navigate('/login'), 400);
  };

  // Create Donation Record
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
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to create donation record.'), 'warning');
        return;
      }
      await refreshAllData(false);
      if (res.data?.id) setSelectedRecordId(res.data.id);
      triggerToast(res.message || 'Donation record created and queued for verification.', 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to create donation record (check login/permissions).'), 'warning');
    }
  };

  // Update Donor Profile Verification
  const handleUpdateDonorVerification = async (donorId, status, auditNote) => {
    try {
      const res = await donorService.updateDonorVerification(donorId, { status, auditNote });
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to update donor verification.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || 'Donor verification updated.', 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to update donor verification.'), 'warning');
    }
  };

  // Process Donation Record Decision
  const handleProcessDecision = async (id, payload) => {
    try {
      const res = await donorService.processDecision(id, payload);
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to record decision.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || `Decision recorded for ${id}.`, 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to record decision.'), 'warning');
    }
  };

  // Create Campaign
  const handleCreateCampaign = async (payload) => {
    try {
      const res = await donorService.createCampaign(payload);
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to create campaign.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || 'Campaign created.', 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to create campaign.'), 'warning');
    }
  };

  // Update Campaign Status
  const handleUpdateCampaignStatus = async (id, status) => {
    try {
      const res = await donorService.updateCampaignStatus(id, status);
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to update campaign status.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || `Campaign status updated to ${status}.`, 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to update campaign status.'), 'warning');
    }
  };

  // Create Allocation
  const handleCreateAllocation = async (payload) => {
    try {
      const res = await donorService.createAllocation(payload);
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to create allocation.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || 'Allocation approved.', 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to create allocation.'), 'warning');
    }
  };

  // Dual Approval Co-signature Handler
  const handleConfirmApproval = async ({ recordId, coSignatory, authorizerNote }) => {
    try {
      const res = await donorService.approveAllocation(recordId, {
        authorizedNote: authorizerNote,
        secondarySignature: coSignatory
      });
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to approve allocation.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || `Dual authorization completed for ${recordId}.`, 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to approve allocation.'), 'warning');
    }
  };

  // Resolve Suspicious Flag
  const handleResolveFlag = async (flagId, action, decisionReason) => {
    try {
      const res = await donorService.resolveFlag(flagId, {
        action,
        resolutionNotes: decisionReason
      });
      if (!res?.succeeded) {
        triggerToast(extractError(res, 'Failed to record compliance decision.'), 'warning');
        return;
      }
      await refreshAllData(false);
      triggerToast(res.message || `Compliance decision recorded for ${flagId}.`, 'success');
    } catch (err) {
      triggerToast(extractError(err, 'Failed to record compliance decision.'), 'warning');
    }
  };

  // Real Filtered CSV Export
  const handleExportCsv = (rowsToExport, prefix = 'HumanAid_Funding_Report') => {
    const dataset = rowsToExport && rowsToExport.length ? rowsToExport : records;
    if (!dataset.length) {
      triggerToast('No records available to export.', 'warning');
      return;
    }
    const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const header = ['ID', 'Donor', 'CampaignOrSource', 'Type', 'Value', 'Verification', 'Allocation', 'Status', 'CreatedAt'].join(',');
    const lines = dataset.map(r => [
      escape(r.id),
      escape(r.donorOrg),
      escape(r.source),
      escape(r.type),
      escape(r.recordedValue),
      escape(r.verification),
      escape(r.allocationTarget),
      escape(r.status),
      escape(r.createdAt)
    ].join(','));

    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${prefix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${dataset.length} filtered records to CSV.`, 'success');
  };

  const handlePriorityClick = (item) => {
    if (item.relatedTab) setActiveTab(item.relatedTab);
    if (item.id) setSelectedRecordId(item.id);
  };

  const pendingVerificationCount = records.filter(r => r.status === 'Pending' || r.status === 'Flagged').length;
  const totalUnreadAlerts = openFlagsCount + pendingVerificationCount;

  return (
    <div className="fo-portal-container">
      <FundingSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dutyActive={dutyActive}
        setDutyActive={setDutyActive}
        officer={officer}
        pendingReviewCount={pendingVerificationCount}
        suspiciousCount={openFlagsCount}
        onSignOut={handleSignOut}
      />

      <main className="fo-main-content">
        <FundingHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          officer={officer}
          unreadCount={totalUnreadAlerts}
          onOpenNotifications={() => setActiveTab(openFlagsCount > 0 ? 'suspicious' : 'donations')}
        />

        {apiError && (
          <div style={{ margin: '12px 24px 0 24px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{apiError}</span>
            <button className="fo-btn fo-btn-secondary" onClick={() => refreshAllData(true)}>Retry</button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <FundingDashboardView
            metrics={metrics}
            priorityItems={priorityItems}
            workflowSteps={workflowSteps}
            recentActivity={recentActivity}
            loading={loading}
            onNavigateTab={setActiveTab}
            onOpenPriorityItem={handlePriorityClick}
          />
        )}

        {activeTab === 'donors' && (
          <DonorManagementView
            donorProfiles={donorProfiles}
            loading={loading}
            globalSearch={searchQuery}
            onUpdateDonorVerification={handleUpdateDonorVerification}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
          />
        )}

        {activeTab === 'donations' && (
          <DonationRecordsView
            records={records}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            loading={loading}
            globalSearch={searchQuery}
            onOpenCreateRecordModal={() => setShowCreateModal(true)}
            onOpenReceiptModal={(rec) => { setTargetReceiptRecord(rec); setShowReceiptModal(true); }}
            onProcessDecision={handleProcessDecision}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignsView
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
            loading={loading}
            globalSearch={searchQuery}
            onCreateCampaign={handleCreateCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
          />
        )}

        {activeTab === 'allocations' && (
          <AllocationExpenditureView
            allocationOverview={allocationOverview}
            allocations={allocations}
            verifiedPendingRecords={records.filter(r => r.status === 'Verified')}
            selectedAllocationId={selectedAllocationId}
            setSelectedAllocationId={setSelectedAllocationId}
            loading={loading}
            globalSearch={searchQuery}
            onCreateAllocation={handleCreateAllocation}
            onOpenApprovalModal={(alloc) => { setTargetApprovalRecord(alloc); setShowApprovalModal(true); }}
          />
        )}

        {activeTab === 'suspicious' && (
          <SuspiciousFlagReviewView
            flags={flags}
            loading={loading}
            onResolveFlag={handleResolveFlag}
          />
        )}

        {activeTab === 'reports' && (
          <TransparencyReportsView
            reportData={reportData}
            campaigns={campaigns}
            loading={loading}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

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
