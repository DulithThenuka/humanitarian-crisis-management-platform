import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

// Data
import {
  COORDINATOR_USER,
  INITIAL_METRICS,
  INITIAL_RECENT_ACTIVITY,
  PRIORITY_CASES,
  ASSISTANCE_REQUESTS_LIST,
  CRISIS_INCIDENTS_DATA,
  AI_DECISION_SUPPORT_DATA
} from './data/coordinatorPortalData';

// Shared Components
import { CoordinatorSidebar } from './components/CoordinatorSidebar';
import { CoordinatorHeader } from './components/CoordinatorHeader';

// Modals
import { VerifyRequestModal } from './components/modals/VerifyRequestModal';
import { DuplicateInspectModal } from './components/modals/DuplicateInspectModal';
import { CreateIncidentModal } from './components/modals/CreateIncidentModal';
import { CreateAlertModal } from './components/modals/CreateAlertModal';
import { AttachmentPreviewModal } from './components/modals/AttachmentPreviewModal';

// Dedicated Views by Folder
import { CoordinatorOverviewView } from './overview/CoordinatorOverviewView';
import { AssistanceRequestsView } from './assistance-requests/AssistanceRequestsView';
import { RequestReviewView } from './request-review/RequestReviewView';
import { AIDecisionSupportView } from './ai-decision-support/AIDecisionSupportView';
import { CrisisManagementView } from './crisis-management/CrisisManagementView';
import { ResourceCoordinationView } from './resource-coordination/ResourceCoordinationView';
import { ShelterVolunteerCoordinationView } from './shelter-volunteer/ShelterVolunteerCoordinationView';
import { EmergencyAlertsView } from './emergency-alerts/EmergencyAlertsView';
import { ReportsResponseAnalyticsView } from './reports/ReportsResponseAnalyticsView';
import { DecisionHistoryView } from './decision-history/DecisionHistoryView';
import { NotificationsRemindersView } from './notifications/NotificationsRemindersView';
import { ProfileSettingsView } from './profile-settings/ProfileSettingsView';

import './EmergencyCoordinatorPortal.css';

export const EmergencyCoordinatorPortal = ({
  initialActiveTab = 'overview',
  initialCaseId = 'HMR-1042'
}) => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);

  // Core Data States
  const [cases, setCases] = useState(PRIORITY_CASES);
  const [requestsList, setRequestsList] = useState(ASSISTANCE_REQUESTS_LIST);
  const [incidents, setIncidents] = useState(CRISIS_INCIDENTS_DATA);
  const [selectedIncidentId, setSelectedIncidentId] = useState('CR-2026-014');
  const [recentActivity, setRecentActivity] = useState(INITIAL_RECENT_ACTIVITY);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  // Controls & HUD
  const [dutyActive, setDutyActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [aiReviewed, setAiReviewed] = useState(false);

  // Modals States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyReason, setVerifyReason] = useState('');
  const [verifyConfirmedCheck, setVerifyConfirmedCheck] = useState(false);

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(null);

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showCreateIncidentModal, setShowCreateIncidentModal] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);

  const [newNoteText, setNewNoteText] = useState('');
  const [newIncidentForm, setNewIncidentForm] = useState({
    title: '',
    severity: 'High',
    area: '',
    stats: ''
  });
  const [newAlertForm, setNewAlertForm] = useState({
    title: '',
    severity: 'Critical',
    area: 'Kelani East - Zone 03'
  });

  // Selected Objects
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const currentIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3600);
  };

  // Open Request Review
  const handleOpenCaseReview = (caseId) => {
    setSelectedCaseId(caseId);
    setActiveTab('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Checklist Item
  const handleToggleChecklist = (checkId) => {
    setCases(prevCases =>
      prevCases.map(item => {
        if (item.id === currentCase.id) {
          const updatedChecklist = item.checklist.map(chk =>
            chk.id === checkId ? { ...chk, checked: !chk.checked } : chk
          );
          return { ...item, checklist: updatedChecklist };
        }
        return item;
      })
    );
  };

  // Add Internal Coordinator Note
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    const newNoteObj = {
      id: `n-${Date.now()}`,
      author: COORDINATOR_USER.fullName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim()
    };

    setCases(prevCases =>
      prevCases.map(item => {
        if (item.id === currentCase.id) {
          return { ...item, notes: [...item.notes, newNoteObj] };
        }
        return item;
      })
    );

    setNewNoteText('');
    showToast(`Note logged for request ${currentCase.id}`);
  };

  // Confirm Verification
  const handleConfirmVerification = () => {
    if (!verifyReason.trim() || !verifyConfirmedCheck) return;

    setCases(prevCases =>
      prevCases.map(item => {
        if (item.id === currentCase.id) {
          return {
            ...item,
            status: 'Verified',
            checklist: item.checklist.map(chk => ({ ...chk, checked: true }))
          };
        }
        return item;
      })
    );

    setRequestsList(prevList =>
      prevList.map(req =>
        req.id === currentCase.id
          ? { ...req, verification: 'Verified', status: 'Verified', statusClass: 'status-verified' }
          : req
      )
    );

    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Verified request',
      detail: `${currentCase.id} - ${verifyReason.trim().slice(0, 32)}...`,
      type: 'verified'
    };
    setRecentActivity(prev => [newActivity, ...prev]);

    setMetrics(prev => ({
      ...prev,
      pendingReviews: Math.max(0, prev.pendingReviews - 1)
    }));

    setShowVerifyModal(false);
    setVerifyReason('');
    setVerifyConfirmedCheck(false);
    showToast(`Request ${currentCase.id} verified and scheduled for dispatch!`, 'success');
  };

  // Accept AI Recommendation
  const handleAcceptAIRecommendation = (finalPriority, reason) => {
    setAiReviewed(true);
    showToast(`Accepted AI recommendation (${finalPriority}) for ${AI_DECISION_SUPPORT_DATA.assessmentId}`, 'success');

    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'AI priority accepted',
      detail: `AID-2051 for ${AI_DECISION_SUPPORT_DATA.relatedCaseId}`,
      type: 'approved'
    };
    setRecentActivity(prev => [newActivity, ...prev]);
  };

  // Create Incident
  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (!newIncidentForm.title.trim()) return;

    const newId = `CR-2026-0${incidents.length + 15}`;
    const newInc = {
      id: newId,
      title: newIncidentForm.title.trim(),
      leadTeam: 'National Relief Unit',
      severity: newIncidentForm.severity,
      severityPillClass: newIncidentForm.severity === 'Critical' ? 'pill-critical' : 'pill-high',
      area: newIncidentForm.area || 'Western Province Sector',
      stats: '0 requests · Team pending · Initializing',
      affectedEstimate: 'Under assessment',
      relatedRequests: '0 open',
      assignedCoordinator: COORDINATOR_USER.fullName,
      currentStatus: 'Active response',
      unresolvedIssues: [],
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: 'Incident record created',
          actor: `Recorded by ${COORDINATOR_USER.fullName}`
        }
      ]
    };

    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncidentId(newId);
    setShowCreateIncidentModal(false);
    setNewIncidentForm({ title: '', severity: 'High', area: '', stats: '' });
    showToast(`Incident ${newId} logged successfully!`, 'success');
  };

  // Create Alert
  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!newAlertForm.title.trim()) return;

    setShowCreateAlertModal(false);
    setNewAlertForm({ title: '', severity: 'Critical', area: 'Kelani East - Zone 03' });
    showToast('Emergency broadcast alert queued for dispatch!', 'success');
  };

  return (
    <div className="ec-portal-wrapper">
      {/* Toast Alert HUD */}
      {toast && (
        <div className="ec-toast-hud">
          <CheckCircle2 size={16} color="#38bdf8" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <CoordinatorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dutyActive={dutyActive}
        setDutyActive={setDutyActive}
        onShowAlertModal={() => setShowCreateAlertModal(true)}
        showToast={showToast}
      />

      {/* 2. Main Layout Area */}
      <main className="ec-main-content">
        <CoordinatorHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showToast={showToast}
        />

        {/* 3. Dynamic Views */}
        {activeTab === 'requests' && (
          <AssistanceRequestsView
            requestsList={requestsList}
            onOpenCaseReview={handleOpenCaseReview}
            showToast={showToast}
          />
        )}

        {activeTab === 'ai-support' && (
          <AIDecisionSupportView
            onOpenCaseReview={handleOpenCaseReview}
            onInspectDuplicate={() => setShowDuplicateModal(true)}
            onAcceptRecommendation={handleAcceptAIRecommendation}
            aiReviewed={aiReviewed}
            showToast={showToast}
          />
        )}

        {activeTab === 'crisis' && (
          <CrisisManagementView
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            setSelectedIncidentId={setSelectedIncidentId}
            currentIncident={currentIncident}
            onOpenCreateIncidentModal={() => setShowCreateIncidentModal(true)}
            onNavigateTab={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'review' && (
          <RequestReviewView
            currentCase={currentCase}
            onBackToRequests={() => setActiveTab('requests')}
            onToggleChecklist={handleToggleChecklist}
            newNoteText={newNoteText}
            setNewNoteText={setNewNoteText}
            onAddNote={handleAddNote}
            onOpenVerifyModal={() => setShowVerifyModal(true)}
            onPreviewAttachment={(url) => {
              setPreviewImageSrc(url);
              setShowImagePreview(true);
            }}
            onReviewAIRecommendation={() => setActiveTab('ai-support')}
            showToast={showToast}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceCoordinationView
            showToast={showToast}
          />
        )}

        {activeTab === 'shelters' && (
          <ShelterVolunteerCoordinationView
            showToast={showToast}
          />
        )}

        {activeTab === 'alerts' && (
          <EmergencyAlertsView
            showToast={showToast}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsResponseAnalyticsView
            showToast={showToast}
          />
        )}

        {activeTab === 'history' && (
          <DecisionHistoryView
            showToast={showToast}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsRemindersView
            onOpenCaseReview={handleOpenCaseReview}
            onNavigateTab={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <ProfileSettingsView
            showToast={showToast}
          />
        )}

        {activeTab === 'overview' && (
          <CoordinatorOverviewView
            metrics={metrics}
            cases={cases}
            recentActivity={recentActivity}
            onOpenCaseReview={handleOpenCaseReview}
            onNavigateTab={setActiveTab}
            onOpenAlertModal={() => setShowCreateAlertModal(true)}
            showToast={showToast}
          />
        )}
      </main>

      {/* 4. Modals */}
      <VerifyRequestModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        verifyReason={verifyReason}
        setVerifyReason={setVerifyReason}
        verifyConfirmedCheck={verifyConfirmedCheck}
        setVerifyConfirmedCheck={setVerifyConfirmedCheck}
        onConfirm={handleConfirmVerification}
      />

      <DuplicateInspectModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onMarkDistinct={() => {
          setShowDuplicateModal(false);
          showToast('Marked as verified distinct case (non-duplicate)');
        }}
      />

      <CreateIncidentModal
        isOpen={showCreateIncidentModal}
        onClose={() => setShowCreateIncidentModal(false)}
        newIncidentForm={newIncidentForm}
        setNewIncidentForm={setNewIncidentForm}
        onSubmit={handleCreateIncident}
      />

      <CreateAlertModal
        isOpen={showCreateAlertModal}
        onClose={() => setShowCreateAlertModal(false)}
        newAlertForm={newAlertForm}
        setNewAlertForm={setNewAlertForm}
        onSubmit={handleCreateAlert}
      />

      <AttachmentPreviewModal
        isOpen={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        attachment={currentCase?.attachment}
        previewImageSrc={previewImageSrc}
      />
    </div>
  );
};

export default EmergencyCoordinatorPortal;
