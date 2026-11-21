import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';

// API Services
import coordinatorService from '../../services/coordinatorService';
import incidentService from '../../services/incidentService';

// Data
import {
  COORDINATOR_USER,
  INITIAL_METRICS,
  INITIAL_RECENT_ACTIVITY,
  PRIORITY_CASES,
  ASSISTANCE_REQUESTS_LIST,
  CRISIS_INCIDENTS_DATA,
  AI_DECISION_SUPPORT_DATA,
  EMERGENCY_ALERTS_LIST
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
import { AIOperationsContainer } from './ai-decision-support/operations/AIOperationsContainer';

import './EmergencyCoordinatorPortal.css';

export const EmergencyCoordinatorPortal = ({
  initialActiveTab = 'overview',
  initialCaseId = 'HMR-1042'
}) => {
  // Authentication & Logged-in User Identity
  const { user: authUser } = useAuth();
  const coordinatorUser = {
    fullName: authUser?.fullName || authUser?.name || COORDINATOR_USER.fullName,
    initials: authUser?.initials || (authUser?.fullName ? authUser.fullName.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase() : COORDINATOR_USER.initials),
    role: authUser?.role === 'Coordinator' ? 'Emergency Coordinator' : (authUser?.role || COORDINATOR_USER.role)
  };

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
  const [isLive, setIsLive] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Controls & HUD
  const [autoNextEnabled, setAutoNextEnabled] = useState(false);
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
    category: 'Flood warning',
    severity: 'Critical',
    area: 'Kelani East - Zone 03',
    relatedIncident: '',
    message: '',
    safetyInstructions: 'Move vital medicines, dry rations and identity documents to high ground.\nDo not attempt to walk or drive through flowing water.\nFollow instructions from authorized relief personnel.',
    scheduledDate: ''
  });

  // Selected Objects
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const currentIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  const loadPortalData = useCallback(async () => {
    try {
      const overview = await coordinatorService.getOverview();
      if (overview) {
        const payload = overview.metrics ? overview : (overview.data?.metrics ? overview.data : (overview.data || overview));
        const rawMetrics = payload.metrics || payload;

        if (rawMetrics && (rawMetrics.totalIncomingRequests !== undefined || rawMetrics.incomingRequests !== undefined)) {
          setIsLive(true);
          setApiError(null);
          setMetrics({
            incomingRequests: rawMetrics.totalIncomingRequests ?? rawMetrics.incomingRequests ?? 0,
            incomingTrend: `${rawMetrics.totalIncomingRequests ?? 0} in db`,
            pendingReviews: rawMetrics.pendingReviews ?? 0,
            pendingTrend: `${rawMetrics.pendingReviews ?? 0} pending action`,
            criticalPriority: rawMetrics.criticalRequests ?? rawMetrics.criticalPriority ?? 0,
            criticalTrend: `${rawMetrics.criticalRequests ?? 0} critical level`,
            moreInfoRequired: rawMetrics.needInformation ?? rawMetrics.moreInfoRequired ?? 0,
            moreInfoTrend: `${rawMetrics.needInformation ?? 0} unresolved`,
            activeEmergencies: rawMetrics.activeCrisisEvents ?? rawMetrics.activeIncidents ?? rawMetrics.activeEmergencies ?? 0,
            emergenciesTrend: `${rawMetrics.activeIncidents ?? 0} active ops`,
            volunteersAssigned: rawMetrics.availableVolunteers ?? rawMetrics.volunteersAssigned ?? 0,
            volunteersTrend: `${rawMetrics.availableVolunteers ?? 0} available`
          });

          const rawCases = payload.priorityCases || overview.priorityCases;
          if (rawCases && rawCases.length > 0) {
            setCases(rawCases);
            // Sync selectedCaseId if previous id is not in priorityCases
            if (!rawCases.some(c => c.id === selectedCaseId)) {
              setSelectedCaseId(rawCases[0].id);
            }

            // Also map live priority cases into requestsList for the requests view
            const mappedReqList = rawCases.map(c => {
              const isReqVerified = c.status === 'Verified' || c.verificationStatus === 'Verified';
              const isReqMoreInfo = c.status === 'Need information' ||
                                    c.verificationStatus === 'More Information Required' ||
                                    c.verificationStatus === 'Information Requested';
              const verificationLabel = isReqVerified ? 'Verified' : isReqMoreInfo ? 'Need information' : 'Pending review';
              const statusLabel = isReqVerified ? 'Verified & Scheduled' : isReqMoreInfo ? 'Need information' : (c.status || 'Awaiting Review');
              const statusClass = isReqVerified ? 'status-verified' : isReqMoreInfo ? 'status-info' : 'status-awaiting';

              return {
                id: c.id,
                category: c.category || 'Emergency Assistance',
                submitted: c.submittedAt || 'Today',
                location: c.location || 'Western Province',
                people: c.affectedPeople ?? (c.id === 'HMR-1042' ? 6 : 1),
                aiPriority: c.severity || 'High',
                aiScore: (c.aiPriorityScore || 85) / 100,
                verification: verificationLabel,
                coordinator: coordinatorUser.fullName,
                status: statusLabel,
                statusClass: statusClass
              };
            });
            setRequestsList(mappedReqList);
          }

          const rawActivity = payload.recentActivity || overview.recentActivity;
          if (rawActivity && rawActivity.length > 0) {
            setRecentActivity(rawActivity);
          }
        }
      }
    } catch (err) {
      console.warn('Coordinator overview API connection error, displaying offline state:', err.message || err);
      setIsLive(false);

      const status = err?.status || err?.response?.status || err?.statusCode;
      const isForbidden = status === 403 || String(err?.message || '').includes('403') || String(err || '').includes('403');
      const isUnauthorized = status === 401 || String(err?.message || '').includes('401') || String(err || '').includes('401');

      let errMsg;
      let trendLabel;
      if (isForbidden) {
        errMsg = 'Access Restricted (HTTP 403): Current account does not have Emergency Coordinator permissions.';
        trendLabel = 'Access restricted';
      } else if (isUnauthorized) {
        errMsg = 'Session Expired (HTTP 401): Please log in again with an authorized Coordinator account.';
        trendLabel = 'Auth required';
      } else {
        errMsg = err.message || (typeof err === 'string' ? err : 'Backend unreachable');
        trendLabel = 'Backend offline';
      }

      setApiError(errMsg);
      setMetrics({
        incomingRequests: '—',
        incomingTrend: trendLabel,
        pendingReviews: '—',
        pendingTrend: trendLabel,
        criticalPriority: '—',
        criticalTrend: trendLabel,
        moreInfoRequired: '—',
        moreInfoTrend: trendLabel,
        activeEmergencies: '—',
        emergenciesTrend: trendLabel,
        volunteersAssigned: '—',
        volunteersTrend: trendLabel
      });
    }

    try {
      const events = await coordinatorService.getCrisisEvents();
      if (events && events.length > 0) {
        const mappedEvents = events.map(ev => ({
          id: ev.incidentId || ev.id,
          title: ev.name || ev.title,
          leadTeam: 'National Relief Unit',
          severity: ev.severity || 'High',
          severityPillClass: (ev.severity || '').toLowerCase() === 'critical' ? 'pill-critical' : 'pill-high',
          area: ev.location || 'Western Province',
          stats: `${ev.affectedPopulation ? ev.affectedPopulation.toLocaleString() : '0'} affected`,
          affectedEstimate: ev.affectedPopulation ? `${ev.affectedPopulation.toLocaleString()} citizens` : 'Under assessment',
          relatedRequests: 'Open',
          assignedCoordinator: coordinatorUser.fullName,
          currentStatus: ev.status || 'Active response',
          unresolvedIssues: [],
          timeline: [
            {
              time: ev.startDate ? new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM',
              event: ev.description || 'Active crisis response',
              actor: 'System Record'
            }
          ]
        }));
        setIncidents(mappedEvents);
        if (mappedEvents[0]) {
          setSelectedIncidentId(mappedEvents[0].id);
        }
      }
    } catch (err) {
      console.warn('Crisis events API offline, keeping default seed data:', err.message);
    }

    try {
      const backendAlerts = await coordinatorService.getAlerts();
      const rawAlerts = Array.isArray(backendAlerts) ? backendAlerts : (backendAlerts?.data && Array.isArray(backendAlerts.data) ? backendAlerts.data : null);
      if (rawAlerts && rawAlerts.length > 0) {
        const mappedAlerts = rawAlerts.map(a => ({
          id: a.id,
          sourceCrisisEventId: a.sourceCrisisEventId,
          title: a.title,
          category: a.category || 'Flood warning',
          severity: a.severity || 'Critical',
          severityClass: (a.severity || '').toLowerCase() === 'critical' ? 'pill-critical' : (a.severity || '').toLowerCase() === 'high' ? 'pill-high' : 'pill-moderate',
          area: a.area || 'Western Province',
          relatedIncident: a.relatedIncident || '',
          publication: a.publication || 'Published',
          tab: a.tab || 'active',
          createdBy: a.createdBy || coordinatorUser.fullName,
          createdDate: a.createdDate || a.lastUpdated || 'Recently',
          lastUpdated: a.lastUpdated || 'Recently',
          startTime: a.startTime || 'Now',
          expiryTime: a.expiryTime || 'Until further notice',
          scheduledDate: a.scheduledDate || null,
          resolutionNotes: a.resolutionNotes || null,
          resolvedAt: a.resolvedAt || null,
          resolvedBy: a.resolvedBy || null,
          message: a.message || '',
          safetyInstructions: a.safetyInstructions && a.safetyInstructions.length > 0 ? a.safetyInstructions : ['Follow official evacuation route signage.']
        }));
        setAlerts(mappedAlerts);
      }
    } catch (err) {
      console.warn('Emergency alerts API offline:', err.message || err);
    }
  }, [coordinatorUser.fullName, selectedCaseId]);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  useRealtimeRefresh(
    ['assistancerequests', 'crises', 'resources', 'shelters', 'alerts', 'aireview', 'coordinator'],
    loadPortalData
  );

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
          const updatedChecklist = (item.checklist || []).map(chk =>
            chk.id === checkId ? { ...chk, checked: !chk.checked } : chk
          );
          return { ...item, checklist: updatedChecklist };
        }
        return item;
      })
    );
  };

  // Add Internal Coordinator Note
  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;

    const noteText = newNoteText.trim();
    const reqId = currentCase.id;
    const newNoteObj = {
      id: `n-${Date.now()}`,
      author: coordinatorUser.fullName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: noteText
    };

    setCases(prevCases =>
      prevCases.map(item => {
        if (item.id === reqId) {
          return { ...item, notes: [...(item.notes || []), newNoteObj] };
        }
        return item;
      })
    );

    setNewNoteText('');

    try {
      await coordinatorService.addNote(reqId, { text: noteText });
      showToast(`Note logged for request ${reqId}`);
    } catch (err) {
      console.warn('Backend note sync error (client state updated):', err.message);
      showToast(`Note logged locally for request ${reqId}`);
    }
  };

  // Auto-Next Advance Handler
  const advanceToNextActionableCase = useCallback((currentReqId, updatedList) => {
    const list = updatedList || cases;
    const priorityWeight = { Critical: 1, High: 2, Medium: 3, Low: 4 };

    const actionable = list.filter(c => {
      if (c.id === currentReqId) return false;
      const isVerified = c.status === 'Verified' || c.verificationStatus === 'Verified';
      const isNeedInfo = c.status === 'Need information' ||
                         c.verificationStatus === 'More Information Required' ||
                         c.verificationStatus === 'Information Requested';
      const isRejected = c.status === 'Rejected';
      return !isVerified && !isNeedInfo && !isRejected;
    });

    if (actionable.length > 0) {
      actionable.sort((a, b) => {
        const pA = priorityWeight[a.severity] || 3;
        const pB = priorityWeight[b.severity] || 3;
        return pA - pB;
      });
      const nextCase = actionable[0];
      setSelectedCaseId(nextCase.id);
      showToast(`Auto-Next: Advanced to ${nextCase.id} (${nextCase.severity || 'Pending'})`, 'info');
    } else {
      showToast('Auto-Next: All pending requests in review queue have been addressed!', 'success');
    }
  }, [cases, showToast]);

  // Confirm Verification
  const handleConfirmVerification = async () => {
    if (!verifyReason.trim() || !verifyConfirmedCheck) return;

    const reqId = currentCase.id;
    const reason = verifyReason.trim();

    const updatedCases = cases.map(item => {
      if (item.id === reqId) {
        return {
          ...item,
          status: 'Verified',
          verificationStatus: 'Verified',
          checklist: (item.checklist || []).map(chk => ({ ...chk, checked: true }))
        };
      }
      return item;
    });
    setCases(updatedCases);

    setRequestsList(prevList =>
      prevList.map(req =>
        req.id === reqId
          ? { ...req, verification: 'Verified', status: 'Verified', statusClass: 'status-verified' }
          : req
      )
    );

    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Verified request',
      detail: `${reqId} - ${reason.slice(0, 32)}...`,
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

    try {
      await coordinatorService.verifyRequest(reqId, {
        reason: reason,
        checklistConfirmed: true
      });
      showToast(`Request ${reqId} verified and scheduled for dispatch!`, 'success');
      if (autoNextEnabled) {
        advanceToNextActionableCase(reqId, updatedCases);
      }
    } catch (err) {
      console.warn('Backend verification sync warning (client state updated):', err.message);
      showToast(`Request ${reqId} verified locally!`, 'success');
    }
  };

  // Escalate Request
  const handleEscalateRequest = async (reqId, reason) => {
    try {
      await coordinatorService.escalateRequest(reqId, {
        urgency: 3,
        reason: reason || 'Escalated to Critical by Emergency Coordinator'
      });
      const updatedCases = cases.map(item =>
        item.id === reqId ? { ...item, severity: 'Critical' } : item
      );
      setCases(updatedCases);
      setRequestsList(prevList =>
        prevList.map(req =>
          req.id === reqId ? { ...req, aiPriority: 'Critical' } : req
        )
      );
      showToast(`Operational priority for ${reqId} escalated to Critical Emergency Command`, 'warning');
      if (autoNextEnabled) {
        advanceToNextActionableCase(reqId, updatedCases);
      }
    } catch (err) {
      console.warn('Backend escalation error:', err.message);
      showToast(`Operational priority for ${reqId} escalated to Critical`, 'warning');
    }
  };

  // Request Information
  const handleRequestInfo = async (reqId, reason) => {
    if (!reason || !reason.trim()) {
      showToast('Please provide an information request message', 'error');
      return;
    }
    const messageText = reason.trim();
    try {
      await coordinatorService.requestInfo(reqId, { message: messageText, reason: messageText });

      const newHistoryItem = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Additional information requested: ${messageText}`,
        actor: `Emergency Coordinator (${coordinatorUser.fullName})`
      };

      const newCommunication = {
        id: `comm-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Additional Information Requested',
        message: messageText,
        recipient: 'Citizen / Requestor',
        senderName: coordinatorUser.fullName,
        senderRole: 'Emergency Coordinator',
        sentAt: new Date().toISOString()
      };

      // 1. Update cases state
      const updatedCases = cases.map(item =>
        item.id === reqId
          ? {
              ...item,
              status: 'Need information',
              verificationStatus: 'More Information Required',
              verification: 'Need information',
              history: [...(item.history || []), newHistoryItem],
              communications: [newCommunication, ...(item.communications || [])]
            }
          : item
      );
      setCases(updatedCases);

      // 2. Update requestsList state
      setRequestsList(prevList =>
        prevList.map(req =>
          req.id === reqId
            ? {
                ...req,
                verification: 'Need information',
                status: 'Need information',
                statusClass: 'status-info'
              }
            : req
        )
      );

      // 3. Update metrics state immediately
      setMetrics(prev => ({
        ...prev,
        moreInfoRequired: (typeof prev.moreInfoRequired === 'number' ? prev.moreInfoRequired : 0) + 1,
        moreInfoTrend: `${(typeof prev.moreInfoRequired === 'number' ? prev.moreInfoRequired : 0) + 1} unresolved`
      }));

      // 4. Record recent activity
      const newActivity = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Information requested from citizen',
        detail: `${reqId}: ${messageText.length > 40 ? messageText.slice(0, 37) + '...' : messageText}`,
        type: 'general'
      };
      setRecentActivity(prev => [newActivity, ...prev]);

      showToast(`Additional information requested for ${reqId}. Status updated.`, 'success');
      if (autoNextEnabled) {
        advanceToNextActionableCase(reqId, updatedCases);
      }

      // 5. Reload from backend to confirm database sync
      await loadPortalData();
    } catch (err) {
      console.error('Backend info request error:', err);
      showToast(err.response?.data?.message || err.message || `Failed to request info for ${reqId}`, 'error');
    }
  };

  // Reject Request
  const handleRejectRequest = async (reqId, reason) => {
    const rejectText = `[REJECTED] ${reason || 'Operational rationale logged'}`;
    try {
      await coordinatorService.addNote(reqId, { text: rejectText });
      const updatedCases = cases.map(item =>
        item.id === reqId ? { ...item, status: 'Rejected' } : item
      );
      setCases(updatedCases);
      setRequestsList(prevList =>
        prevList.map(req =>
          req.id === reqId ? { ...req, status: 'Rejected', statusClass: 'status-rejected' } : req
        )
      );
      showToast(`Request ${reqId} rejected with logged operational rationale`, 'error');
      if (autoNextEnabled) {
        advanceToNextActionableCase(reqId, updatedCases);
      }
    } catch (err) {
      console.warn('Backend rejection error:', err.message);
      showToast(`Request ${reqId} rejected`, 'error');
    }
  };

  // Record Human Decision on AI Assessment (Accept, Adjust, Reject)
  const handleRecordAIDecision = async (caseId, decisionType, finalPriority, reason) => {
    const decLabel = decisionType === 'accept' ? 'Approved' : decisionType === 'adjust' ? 'Overridden' : 'Rejected';
    const targetCase = cases.find(c => c.id === caseId) || currentCase;
    const appliedPriority = decisionType === 'accept' ? (targetCase?.severity || 'High') : finalPriority;

    // 1. Attempt backend incident AI review endpoint
    try {
      await incidentService.recordAIReviewDecision(caseId, {
        decision: decLabel,
        reason: reason,
        overriddenPriority: decisionType === 'adjust' ? appliedPriority : null
      });
    } catch (err) {
      console.warn('Incident AI review endpoint note:', err.message);
    }

    // 2. Add audit note via coordinator service
    try {
      await coordinatorService.addNote(caseId, {
        text: `[AI REVIEW ${decLabel.toUpperCase()}] Priority: ${appliedPriority}. Reviewer: ${coordinatorUser.fullName}. Rationale: ${reason}`
      });
    } catch (err) {
      console.warn('Coordinator note sync fallback:', err.message);
    }

    // 3. If adjusted to Critical or escalate, call escalateRequest
    if (decisionType === 'adjust' && appliedPriority === 'Critical') {
      try {
        await coordinatorService.escalateRequest(caseId, {
          urgency: 3,
          reason: `Priority adjusted to Critical via AI Decision Review: ${reason}`
        });
      } catch (err) {
        console.warn('Coordinator escalate fallback:', err.message);
      }
    }

    // 4. Update local state
    setCases(prevCases =>
      prevCases.map(item =>
        item.id === caseId
          ? {
              ...item,
              severity: appliedPriority,
              status: decisionType === 'reject' ? item.status : 'Verified',
              verificationStatus: decisionType === 'reject' ? item.verificationStatus : 'Verified',
              aiReviewed: true,
              history: [
                ...(item.history || []),
                {
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  event: `AI Recommendation ${decLabel}: priority set to ${appliedPriority}`,
                  actor: `Emergency Coordinator (${coordinatorUser.fullName})`
                }
              ]
            }
          : item
      )
    );

    setRequestsList(prevList =>
      prevList.map(req =>
        req.id === caseId
          ? {
              ...req,
              aiPriority: appliedPriority,
              verification: decisionType === 'reject' ? req.verification : 'Verified',
              status: decisionType === 'reject' ? req.status : 'Verified',
              statusClass: decisionType === 'reject' ? req.statusClass : 'status-verified'
            }
          : req
      )
    );

    // 5. Update activity feed
    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `AI Review: ${decLabel}`,
      detail: `${caseId} priority set to ${appliedPriority}`,
      type: decisionType === 'reject' ? 'general' : 'approved'
    };
    setRecentActivity(prev => [newActivity, ...prev]);

    setAiReviewed(true);
    showToast(`Human decision (${decLabel}: ${appliedPriority}) recorded for ${caseId}`, 'success');

    // 6. Reload from backend to confirm database sync
    await loadPortalData();
  };

  // Backwards-compatible alias for existing handlers
  const handleAcceptAIRecommendation = async (finalPriority, reason) => {
    await handleRecordAIDecision(currentCase.id, 'accept', finalPriority, reason);
  };

  // Create Incident
  const handleCreateIncident = async (e) => {
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
      assignedCoordinator: coordinatorUser.fullName,
      currentStatus: 'Active response',
      unresolvedIssues: [],
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: 'Incident record created',
          actor: `Recorded by ${coordinatorUser.fullName}`
        }
      ]
    };

    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncidentId(newId);
    setShowCreateIncidentModal(false);
    const formCopy = { ...newIncidentForm };
    setNewIncidentForm({ title: '', severity: 'High', area: '', stats: '' });

    try {
      const created = await coordinatorService.createCrisisEvent({
        name: formCopy.title.trim(),
        disasterType: 'General Emergency',
        severity: formCopy.severity,
        location: formCopy.area || 'Western Province Sector',
        description: formCopy.stats || 'Emergency Incident logged via Coordinator Portal',
        affectedPopulation: 0
      });
      if (created && created.incidentId) {
        showToast(`Incident ${created.incidentId} logged successfully in database!`, 'success');
      } else {
        showToast(`Incident ${newId} logged successfully!`, 'success');
      }
    } catch (err) {
      console.warn('Backend incident creation sync warning:', err.message);
      showToast(`Incident ${newId} logged locally!`, 'success');
    }
  };

  // Create Alert (from Modal or Overview)
  const handleCreateAlert = async (formData) => {
    const data = formData && formData.title ? formData : newAlertForm;
    if (!data || !data.title?.trim()) {
      showToast('Please enter an alert title', 'error');
      return;
    }

    const action = data.publicationAction || 'publish';
    const isDraft = action === 'draft';
    const isScheduled = action === 'schedule';
    const publicationStatus = isDraft ? 'Draft' : isScheduled ? 'Scheduled' : 'Published';

    const instructionsArray = typeof data.safetyInstructions === 'string'
      ? data.safetyInstructions.split('\n').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(data.safetyInstructions) ? data.safetyInstructions : ['Follow official guidance.']);

    setShowCreateAlertModal(false);
    setNewAlertForm({
      title: '',
      category: 'Flood warning',
      severity: 'Critical',
      area: 'Kelani East - Zone 03',
      relatedIncident: '',
      message: '',
      safetyInstructions: 'Move vital medicines, dry rations and identity documents to high ground.\nDo not attempt to walk or drive through flowing water.\nFollow instructions from authorized relief personnel.',
      scheduledDate: ''
    });

    try {
      const payload = {
        title: data.title.trim(),
        category: data.category || 'Flood warning',
        severity: data.severity || 'Critical',
        area: data.area || 'Western Province',
        relatedIncident: data.relatedIncident || '',
        message: data.message || `Emergency broadcast alert: ${data.title.trim()}`,
        safetyInstructions: instructionsArray,
        isDraft,
        publicationStatus,
        scheduledDate: isScheduled ? data.scheduledDate : null
      };

      const created = await coordinatorService.createAlert(payload);
      await loadPortalData();

      const successMsg = isDraft
        ? `Alert ${created?.id || ''} saved to drafts queue.`
        : isScheduled
        ? `Alert ${created?.id || ''} scheduled for future broadcast.`
        : `Emergency Alert ${created?.id || ''} broadcast published successfully!`;
      showToast(successMsg, 'success');
    } catch (err) {
      console.error('Backend alert persist error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save emergency alert.';
      showToast(msg, 'error');
    }
  };

  if (activeTab === 'ai-ops') {
    return (
      <AIOperationsContainer
        initialSubView="overview"
        onBack={() => setActiveTab('overview')}
      />
    );
  }

  return (
    <div className="ec-portal-wrapper">
      {/* Toast Alert HUD */}
      {toast && (
        <div className="ec-toast-hud">
          <CheckCircle2 size={16} color="#7caa7e" />
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
        coordinator={coordinatorUser}
      />

      {/* 2. Main Layout Area */}
      <main className="ec-main-content">
        <CoordinatorHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showToast={showToast}
          isLive={isLive}
          apiError={apiError}
          onRetry={loadPortalData}
          coordinator={coordinatorUser}
        />

        {/* 3. Dynamic Views */}
        {activeTab === 'requests' && (
          <AssistanceRequestsView
            requestsList={requestsList}
            onOpenCaseReview={handleOpenCaseReview}
            showToast={showToast}
            metrics={metrics}
          />
        )}

        {activeTab === 'ai-support' && (
          <AIDecisionSupportView
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            currentCase={currentCase}
            onOpenCaseReview={handleOpenCaseReview}
            onInspectDuplicate={() => setShowDuplicateModal(true)}
            onAcceptRecommendation={handleAcceptAIRecommendation}
            onRecordAIDecision={handleRecordAIDecision}
            aiReviewed={aiReviewed}
            showToast={showToast}
            coordinatorUser={coordinatorUser}
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
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            currentCase={currentCase}
            metrics={metrics}
            autoNextEnabled={autoNextEnabled}
            setAutoNextEnabled={setAutoNextEnabled}
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
            onEscalateRequest={handleEscalateRequest}
            onRequestInfo={handleRequestInfo}
            onRejectRequest={handleRejectRequest}
            showToast={showToast}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceCoordinationView
            cases={cases}
            coordinatorUser={coordinatorUser}
            showToast={showToast}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'shelters' && (
          <ShelterVolunteerCoordinationView
            cases={cases}
            coordinatorUser={coordinatorUser}
            showToast={showToast}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'alerts' && (
          <EmergencyAlertsView
            showToast={showToast}
            alerts={alerts}
            setAlerts={setAlerts}
            onRefreshAlerts={loadPortalData}
            cases={cases}
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
            cases={cases}
            metrics={metrics}
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
            alerts={alerts}
            onOpenCaseReview={handleOpenCaseReview}
            onNavigateTab={setActiveTab}
            onOpenAlertModal={() => setShowCreateAlertModal(true)}
            showToast={showToast}
            coordinator={coordinatorUser}
            isLive={isLive}
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
        currentCase={currentCase}
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
        cases={cases}
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
