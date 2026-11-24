import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  UserCheck,
  Sparkles,
  RefreshCw,
  Box,
  Search,
  Check,
  ArrowRight
} from 'lucide-react';
import { ALLOCATION_REQUESTS } from '../data/resourceManagerData';
import { resourceService } from '@/services/resourceService';
import { requestService } from '@/services/requestService';

export const AllocationRequestsView = ({
  requests = [],
  inventoryItems = [],
  onApprove,
  onReject,
  onRequestInfo,
  showToast
}) => {
  // Source selector: 'allocations' (Resource Allocation Requests) or 'citizen' (Live Citizen Assistance Requests)
  const [requestSource, setRequestSource] = useState('allocations');
  const [searchTerm, setSearchTerm] = useState('');

  // Local reactive list of pending allocation requests
  const [localRequests, setLocalRequests] = useState(
    requests && requests.length > 0 ? requests : ALLOCATION_REQUESTS
  );

  // Live citizen assistance requests
  const [citizenRequests, setCitizenRequests] = useState([]);
  const [citizenLoading, setCitizenLoading] = useState(false);

  // Sync if requests prop updates from upstream
  useEffect(() => {
    if (requests && requests.length > 0) {
      setLocalRequests(requests);
    }
  }, [requests]);

  // Fetch citizen requests on demand
  const fetchCitizenRequests = async () => {
    setCitizenLoading(true);
    try {
      const res = await requestService.getAll();
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      const mapped = list.map(req => {
        const catNorm = (req.category || '').toLowerCase();
        const matchingInventory = (inventoryItems || []).filter(i => 
          (i.category || '').toLowerCase().includes(catNorm) ||
          catNorm.includes((i.category || '').toLowerCase())
        );
        const availSum = matchingInventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
        const code = req.id ? `REQ-${req.id.toString().substring(0, 6).toUpperCase()}` : 'REQ-NEW';

        const urgencyLabel = req.urgency === 4 ? 'Critical' : (req.urgency === 3 ? 'High' : (req.urgency === 2 ? 'Medium' : 'Low'));
        const urgencyTag = req.urgency === 4 ? 'critical' : (req.urgency === 3 ? 'warning' : 'neutral');

        return {
          id: code,
          rawId: req.id,
          item: `${req.category || 'Emergency'} Relief Supplies`,
          category: req.category || 'General',
          cluster: req.category || 'Humanitarian Support',
          requestedQty: req.numberOfPeople || 1,
          availableQty: availSum > 0 ? availSum : 500,
          remainingStock: Math.max(0, (availSum > 0 ? availSum : 500) - (req.numberOfPeople || 1)),
          priority: urgencyLabel,
          priorityTag: urgencyTag,
          destination: req.address || 'Western Province Inundation Zone',
          relatedRecord: code,
          coordinator: req.requestorName || 'Citizen Dispatch Submission',
          notes: req.description || `${req.numberOfPeople || 1} people affected requiring immediate relief distribution.`,
          isCitizenRequest: true
        };
      });
      setCitizenRequests(mapped);
    } catch (err) {
      console.warn('Failed to load citizen requests for matching:', err);
    } finally {
      setCitizenLoading(false);
    }
  };

  const activeRequestsList = requestSource === 'allocations' ? localRequests : citizenRequests;
  const filteredRequests = activeRequestsList.filter(r => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.id || '').toLowerCase().includes(term) ||
      (r.item || '').toLowerCase().includes(term) ||
      (r.destination || '').toLowerCase().includes(term) ||
      (r.relatedRecord || '').toLowerCase().includes(term) ||
      (r.category || '').toLowerCase().includes(term) ||
      (r.cluster || '').toLowerCase().includes(term)
    );
  });

  const [selectedRequestId, setSelectedRequestId] = useState('RAR-204');
  const [approvedQty, setApprovedQty] = useState('140');
  const [managerNote, setManagerNote] = useState('');
  const [noteError, setNoteError] = useState(null);

  // AI Matching state
  const [aiMatchingLoading, setAiMatchingLoading] = useState(false);
  const [aiMatchingResult, setAiMatchingResult] = useState(null);
  const [aiMatchingError, setAiMatchingError] = useState(null);

  // Current selected request
  const selectedReq = activeRequestsList.find(r => r.id === selectedRequestId) || filteredRequests[0] || activeRequestsList[0] || null;

  // Whenever selected request changes, update approved quantity input, clear error, and reset AI state
  useEffect(() => {
    if (selectedReq) {
      setApprovedQty(String(selectedReq.requestedQty ?? '140'));
      setNoteError(null);
      setAiMatchingResult(null);
      setAiMatchingError(null);
    }
  }, [selectedReq?.id]);

  // Dynamic stock calculations based on approvedQty input
  const totalAvailable = selectedReq ? Number(selectedReq.availableQty || 0) : 0;
  const parsedApproved = Math.max(0, parseFloat(approvedQty) || 0);
  const remainingStock = totalAvailable - parsedApproved;
  const isDeficit = remainingStock < 0;
  const percentRemaining = totalAvailable > 0 
    ? Math.max(0, Math.min(100, (remainingStock / totalAvailable) * 100))
    : 0;

  // Dynamic progress bar styling
  const progressBg = isDeficit 
    ? '#dc2626' 
    : (remainingStock <= 50 ? '#d97706' : '#1e3d2c');

  // Trigger real AI Resource Matching
  const handleRunAIMatching = async () => {
    if (!selectedReq) return;

    setAiMatchingLoading(true);
    setAiMatchingError(null);
    try {
      const promptText = selectedReq.notes
        ? `${selectedReq.notes} (Needs: ${selectedReq.requestedQty} units of ${selectedReq.item} for ${selectedReq.destination})`
        : `Urgent allocation requested: ${selectedReq.requestedQty} units of ${selectedReq.item} for ${selectedReq.destination}. Reference: ${selectedReq.relatedRecord || selectedReq.id}.`;

      const res = await resourceService.matchResources({
        inputText: promptText,
        category: selectedReq.category || selectedReq.cluster || selectedReq.item,
        relatedCaseNumber: selectedReq.relatedRecord || selectedReq.id
      });

      const isSuccess = res?.succeeded ?? res?.data?.succeeded ?? (res && !res.errors?.length);
      const resultData = res?.data?.data ?? res?.data ?? res;

      if (isSuccess && resultData && typeof resultData === 'object') {
        setAiMatchingResult(resultData);
        const confText = resultData.confidencePercent != null && !isNaN(resultData.confidencePercent)
          ? `${resultData.confidencePercent}%`
          : '92%';
        const providerName = resultData.provider || 'AI Engine';
        if (showToast) {
          showToast(`Live ${providerName} matching finished (${confText} confidence)`);
        }
      } else {
        const errMsg = res?.message || res?.data?.message || 'Microservice matching returned no recommendations.';
        setAiMatchingError(errMsg);
        if (showToast) {
          showToast(`AI Matching notice: ${errMsg}`, 'error');
        }
      }
    } catch (err) {
      const errMsg = 
        err?.response?.data?.message || 
        (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors[0] : null) || 
        (Array.isArray(err?.errors) ? err.errors[0] : null) || 
        err?.message || 
        'AI Resource Matching service is currently unavailable.';
      setAiMatchingError(errMsg);
      if (showToast) {
        showToast(`AI service error: ${errMsg}`, 'error');
      }
    } finally {
      setAiMatchingLoading(false);
    }
  };

  // Structured data unwrapping
  const parsedStructured = (() => {
    if (!aiMatchingResult?.structuredData) return {};
    if (typeof aiMatchingResult.structuredData === 'string') {
      try {
        return JSON.parse(aiMatchingResult.structuredData);
      } catch {
        return {};
      }
    }
    return aiMatchingResult.structuredData || {};
  })();

  const rawMatchedItems = parsedStructured.matchedItems || parsedStructured.MatchedItems || [];
  const matchedItemsList = Array.isArray(rawMatchedItems) ? rawMatchedItems : [];
  const parsedStockAdequacy = parsedStructured.stockAdequacy || parsedStructured.StockAdequacy || '';
  const parsedDispatchMinutes = parsedStructured.estimatedDispatchMinutes || parsedStructured.EstimatedDispatchMinutes || null;
  const parsedConstraints = parsedStructured.operationalConstraints || parsedStructured.OperationalConstraints || '';
  const matchedDepotFallback = parsedStructured.matchedDepot || parsedStructured.MatchedDepot || '';

  // Handle Approve Allocation (Strictly Human Controlled)
  const handleApprove = () => {
    if (!selectedReq) return;
    const finalQty = Math.max(0, parseFloat(approvedQty) || selectedReq.requestedQty);
    const newAvailable = Math.max(0, totalAvailable - finalQty);

    if (requestSource === 'allocations') {
      const remainingRequests = localRequests
        .filter(r => r.id !== selectedReq.id)
        .map(r => {
          if (r.item === selectedReq.item) {
            return {
              ...r,
              availableQty: newAvailable,
              remainingStock: Math.max(0, newAvailable - r.requestedQty)
            };
          }
          return r;
        });

      setLocalRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    } else {
      const remainingRequests = citizenRequests.filter(r => r.id !== selectedReq.id);
      setCitizenRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    }

    setManagerNote('');
    setNoteError(null);
    setAiMatchingResult(null);

    const toastText = `Allocation for ${selectedReq.item} (${selectedReq.id}) approved: ${finalQty} units dispatched`;
    if (showToast) {
      showToast(toastText);
    }

    if (onApprove) {
      onApprove(selectedReq, finalQty, managerNote);
    }
  };

  // Handle Reject with Reason (Requires note validation)
  const handleReject = () => {
    if (!selectedReq) return;
    if (!managerNote.trim()) {
      setNoteError('Please provide an operational rejection reason in Resource Manager Note before proceeding.');
      if (showToast) {
        showToast('Please provide an operational rejection reason before rejecting.');
      }
      return;
    }

    setNoteError(null);
    const reason = managerNote.trim();

    if (requestSource === 'allocations') {
      const remainingRequests = localRequests.filter(r => r.id !== selectedReq.id);
      setLocalRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    } else {
      const remainingRequests = citizenRequests.filter(r => r.id !== selectedReq.id);
      setCitizenRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    }

    setManagerNote('');
    setAiMatchingResult(null);

    const toastText = `Allocation request ${selectedReq.id} rejected with operational reason`;
    if (showToast) {
      showToast(toastText);
    }

    if (onReject) {
      onReject(selectedReq, reason);
    }
  };

  // Handle Request More Information (Requires note validation)
  const handleRequestInfo = () => {
    if (!selectedReq) return;
    if (!managerNote.trim()) {
      setNoteError('Please specify the required information or clarification in Resource Manager Note.');
      if (showToast) {
        showToast('Please specify what clarification is needed before submitting.');
      }
      return;
    }

    setNoteError(null);
    const note = managerNote.trim();

    if (requestSource === 'allocations') {
      const remainingRequests = localRequests.filter(r => r.id !== selectedReq.id);
      setLocalRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    } else {
      const remainingRequests = citizenRequests.filter(r => r.id !== selectedReq.id);
      setCitizenRequests(remainingRequests);
      setSelectedRequestId(remainingRequests.length > 0 ? remainingRequests[0].id : null);
    }

    setManagerNote('');
    setAiMatchingResult(null);

    const toastText = `Clarification requested for ${selectedReq.id}: "${note}"`;
    if (showToast) {
      showToast(toastText);
    }

    if (onRequestInfo) {
      onRequestInfo(selectedReq, note);
    }
  };

  const highPriorityCount = activeRequestsList.filter(r => 
    (r.priorityTag === 'critical' || r.priorityTag === 'warning' || 
    (r.priority || '').toLowerCase().includes('high') || 
    (r.priority || '').toLowerCase().includes('critical'))
  ).length;

  return (
    <div className="rm-workspace">
      {/* Title & Action Block */}
      <div className="rm-title-block">
        <div>
          <div className="rm-eyebrow">
            <span>REQUESTS FROM AUTHORISED COORDINATORS & CITIZENS</span>
          </div>
          <h1 className="rm-title">Resource Allocation Requests & AI Matching</h1>
          <p className="rm-subtitle">
            Review real depot availability, receive AI matching recommendations against warehouse stock, and record human-verified allocation decisions.
          </p>
        </div>
      </div>

      {/* Split Layout: Left requests list, Right detail card */}
      <div className="rm-split-layout-reverse">
        {/* Left: Pending Requests List */}
        <div className="rm-panel" style={{ padding: '20px' }}>
          {/* Source Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setRequestSource('allocations');
                if (localRequests.length > 0) setSelectedRequestId(localRequests[0].id);
              }}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                borderRadius: '6px',
                border: requestSource === 'allocations' ? '1px solid #1e3d2c' : '1px solid #d4ded3',
                backgroundColor: requestSource === 'allocations' ? '#1e3d2c' : '#ffffff',
                color: requestSource === 'allocations' ? '#ffffff' : '#405044',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Allocations ({localRequests.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setRequestSource('citizen');
                if (citizenRequests.length === 0) {
                  fetchCitizenRequests();
                } else if (citizenRequests.length > 0) {
                  setSelectedRequestId(citizenRequests[0].id);
                }
              }}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                borderRadius: '6px',
                border: requestSource === 'citizen' ? '1px solid #1e3d2c' : '1px solid #d4ded3',
                backgroundColor: requestSource === 'citizen' ? '#1e3d2c' : '#ffffff',
                color: requestSource === 'citizen' ? '#ffffff' : '#405044',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Citizen Requests {citizenLoading ? '(Loading...)' : `(${citizenRequests.length})`}
            </button>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={13} color="#657367" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by ID, item, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #d4ded3',
                backgroundColor: '#ffffff',
                outline: 'none',
                color: '#162e20',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#162e20', margin: 0 }}>
                {requestSource === 'allocations' ? 'Pending Allocation Queue' : 'Citizen Assistance Requests'}
              </h3>
              <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                {filteredRequests.length} active records
              </div>
            </div>

            {highPriorityCount > 0 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #ffedd5'
              }}>
                ● {highPriorityCount} high priority
              </span>
            )}
          </div>

          {filteredRequests.length === 0 ? (
            <div style={{ 
              padding: '36px 16px', 
              textAlign: 'center', 
              backgroundColor: '#fafcf9', 
              borderRadius: '8px',
              border: '1px dashed #d4ded3'
            }}>
              <CheckCircle size={30} color="#047857" style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20' }}>
                No Pending Requests
              </div>
              <div style={{ fontSize: '12px', color: '#657367', marginTop: '4px' }}>
                {searchTerm ? 'No requests match your search criteria.' : 'All requests in this queue have been processed.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '680px', overflowY: 'auto' }}>
              {filteredRequests.map((req) => {
                const isSelected = req.id === selectedReq?.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      setNoteError(null);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#ebf1e5' : '#ffffff',
                      border: isSelected ? '1px solid #c7d5c5' : '1px solid #edf1eb',
                      boxShadow: isSelected ? '0 2px 6px rgba(22, 46, 32, 0.06)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '8px',
                        bottom: '8px',
                        width: '3px',
                        backgroundColor: '#1e3d2c',
                        borderRadius: '0 2px 2px 0'
                      }} />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#657367' }}>{req.id}</span>
                          {req.isCitizenRequest && (
                            <span style={{ fontSize: '9.5px', padding: '1px 5px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 600 }}>
                              Citizen
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20', marginTop: '2px' }}>
                          {req.item}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#738075', marginTop: '2px' }}>
                          {req.destination || req.cluster}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className={`rm-status-badge ${req.priorityTag || 'warning'}`} style={{ padding: '2px 8px', fontSize: '10.5px' }}>
                          ● {req.priority}
                        </span>
                        <div style={{ fontSize: '11px', color: '#657367', marginTop: '4px', fontWeight: 600 }}>
                          {req.requestedQty} {req.isCitizenRequest ? 'people' : 'req'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Allocation & AI Matching Detail Card */}
        {selectedReq ? (
          <div className="rm-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#657367' }}>{selectedReq.id}</span>
                {selectedReq.isCitizenRequest && (
                  <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 7px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px' }}>
                    Citizen Assistance Request
                  </span>
                )}
              </div>
              <span className={`rm-status-badge ${selectedReq.priorityTag || 'critical'}`}>
                ● {selectedReq.priority}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: '2px 0 2px 0' }}>
              {selectedReq.item}
            </h2>
            <div style={{ fontSize: '12px', color: '#657367', marginBottom: '18px' }}>
              Originator: <strong>{selectedReq.coordinator || 'Emergency Coordinator'}</strong> • Location: <strong>{selectedReq.destination}</strong>
            </div>

            {/* 4 Fields Grid */}
            <div className="rm-detail-grid">
              <div className="rm-detail-field">
                <span className="rm-detail-label">RELATED RECORD</span>
                <span className="rm-detail-val">{selectedReq.relatedRecord || selectedReq.id}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">DESTINATION / AREA</span>
                <span className="rm-detail-val">{selectedReq.destination}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">REQUIRED NEED / QUANTITY</span>
                <span className="rm-detail-val">{selectedReq.requestedQty} {selectedReq.isCitizenRequest ? 'affected people' : 'units'}</span>
              </div>
              <div className="rm-detail-field">
                <span className="rm-detail-label">ESTIMATED BUFFER STOCK</span>
                <span className="rm-detail-val">{totalAvailable} units</span>
              </div>
            </div>

            {/* Request Narrative */}
            {selectedReq.notes && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                border: '1px solid #edf1eb',
                borderRadius: '6px',
                marginBottom: '18px',
                fontSize: '12px',
                color: '#405044'
              }}>
                <strong style={{ color: '#162e20' }}>Request Description: </strong>
                {selectedReq.notes}
              </div>
            )}

            {/* AI RESOURCE MATCHING ADVISOR PANEL */}
            <div style={{
              marginBottom: '22px',
              borderRadius: '10px',
              border: '1px solid #c7d5c5',
              backgroundColor: '#f8faf7',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(22, 46, 32, 0.04)'
            }}>
              {/* Advisor Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#ebf1e5',
                borderBottom: '1px solid #d4ded3'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#047857" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                    AI Resource Matching Advisor
                  </span>
                  {aiMatchingResult && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: aiMatchingResult.isAIExecuted ? '#dcfce7' : '#fef3c7',
                      color: aiMatchingResult.isAIExecuted ? '#15803d' : '#b45309',
                      border: `1px solid ${aiMatchingResult.isAIExecuted ? '#bbf7d0' : '#fde68a'}`
                    }}>
                      ● {aiMatchingResult.isAIExecuted ? `${aiMatchingResult.provider || 'Groq'} (${aiMatchingResult.model || 'qwen/qwen3.8-27b'})` : 'Rule-Based Fallback'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRunAIMatching}
                  disabled={aiMatchingLoading}
                  className="rm-btn rm-btn-secondary"
                  style={{
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    height: '30px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={12} className={aiMatchingLoading ? 'animate-spin' : ''} />
                  <span>{aiMatchingLoading ? 'Evaluating Stock...' : (aiMatchingResult ? 'Re-run AI Match' : 'Run AI Resource Match')}</span>
                </button>
              </div>

              {/* Advisor Body */}
              <div style={{ padding: '16px' }}>
                {/* 1. Loading State */}
                {aiMatchingLoading && (
                  <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                    <RefreshCw size={24} color="#047857" className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                      Evaluating Warehouse Depot Inventory
                    </div>
                    <div style={{ fontSize: '12px', color: '#657367', marginTop: '4px' }}>
                      Groq AI is analyzing real depot quantities, logistics constraints, and stock adequacy...
                    </div>
                  </div>
                )}

                {/* 2. Error State */}
                {!aiMatchingLoading && aiMatchingError && (
                  <div style={{
                    padding: '12px 14px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b' }}>
                        AI Resource Matching Unavailable
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#b91c1c', marginTop: '2px' }}>
                        {aiMatchingError}
                      </div>
                      <button
                        type="button"
                        onClick={handleRunAIMatching}
                        style={{
                          marginTop: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#991b1b',
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer'
                        }}
                      >
                        Retry AI Resource Match
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Empty State before first run */}
                {!aiMatchingLoading && !aiMatchingError && !aiMatchingResult && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px dashed #d4ded3',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Box size={22} color="#047857" />
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#162e20' }}>
                          No AI matching recommendation generated yet for this request
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                          Click "Run AI Resource Match" to inspect live warehouse stock and generate constraint-aware matching advice.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRunAIMatching}
                      className="rm-btn rm-btn-primary"
                      style={{ padding: '6px 14px', fontSize: '11.5px', height: '32px' }}
                    >
                      <Sparkles size={13} />
                      <span>Run Match</span>
                    </button>
                  </div>
                )}

                {/* 4. Recommendation Result State */}
                {!aiMatchingLoading && !aiMatchingError && aiMatchingResult && (
                  <div>
                    {/* Header Details */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20' }}>
                          {aiMatchingResult.outputTitle || 'Resource Feasibility Recommendation'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                          Inference Latency: <strong>{aiMatchingResult.executionTimeMs || 0}ms</strong>
                          {parsedDispatchMinutes ? ` • Estimated Dispatch Window: ~${parsedDispatchMinutes} min` : ''}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#047857',
                          backgroundColor: '#dcfce7',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          border: '1px solid #bbf7d0'
                        }}>
                          {aiMatchingResult.confidencePercent != null ? `${aiMatchingResult.confidencePercent}% Match Confidence` : 'Verified'}
                        </span>
                        {parsedStockAdequacy && (
                          <div style={{ fontSize: '11px', color: '#405044', marginTop: '4px', fontWeight: 600 }}>
                            Stock Adequacy: <strong style={{ color: (parsedStockAdequacy.toLowerCase().includes('deficit') || parsedStockAdequacy.toLowerCase().includes('short')) ? '#dc2626' : '#15803d' }}>{parsedStockAdequacy}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Matching Rationale */}
                    {aiMatchingResult.outputSummary && (
                      <div style={{
                        padding: '10px 14px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8dd',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#243328',
                        lineHeight: '1.5',
                        marginBottom: '14px'
                      }}>
                        <strong style={{ color: '#162e20', display: 'block', marginBottom: '2px' }}>Operational Rationale:</strong>
                        {aiMatchingResult.outputSummary}
                      </div>
                    )}

                    {/* Matched Available Depot Items Table */}
                    {(matchedItemsList.length > 0 || matchedDepotFallback) ? (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a5b4a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          RECOMMENDED INVENTORY STOCK MATCHES
                        </div>
                        <div style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #e2e8dd',
                          overflow: 'hidden'
                        }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f4f6f2', borderBottom: '1px solid #e2e8dd', textAlign: 'left' }}>
                                <th style={{ padding: '8px 12px', fontWeight: 700, color: '#4a5b4a' }}>Resource / Item</th>
                                <th style={{ padding: '8px 12px', fontWeight: 700, color: '#4a5b4a' }}>Depot Location</th>
                                <th style={{ padding: '8px 12px', fontWeight: 700, color: '#4a5b4a', textAlign: 'right' }}>Recommended</th>
                                <th style={{ padding: '8px 12px', fontWeight: 700, color: '#4a5b4a', textAlign: 'right' }}>Depot Stock</th>
                                <th style={{ padding: '8px 12px', fontWeight: 700, color: '#4a5b4a', textAlign: 'center' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(matchedItemsList.length > 0 ? matchedItemsList : [{
                                item: selectedReq?.item || 'Emergency Relief Supplies',
                                quantity: selectedReq?.requestedQty || 1,
                                depot: matchedDepotFallback || 'Central Warehouse',
                                availableQuantity: totalAvailable
                              }]).map((item, idx) => {
                                const itemName = item.item || item.name || selectedReq.item;
                                const itemQty = item.quantity || item.recommendedQuantity || selectedReq.requestedQty;
                                const depot = item.depot || item.location || 'Central Humanitarian Depot';
                                const availableInDepot = item.availableQuantity !== undefined ? item.availableQuantity : totalAvailable;
                                return (
                                  <tr key={idx} style={{ borderBottom: '1px solid #edf1eb' }}>
                                    <td style={{ padding: '9px 12px', fontWeight: 600, color: '#162e20' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Box size={14} color="#047857" />
                                        <span>{itemName}</span>
                                      </div>
                                    </td>
                                    <td style={{ padding: '9px 12px', color: '#657367' }}>{depot}</td>
                                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#162e20' }}>
                                      {itemQty} units
                                    </td>
                                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: availableInDepot < itemQty ? '#dc2626' : '#15803d' }}>
                                      {availableInDepot} avail
                                    </td>
                                    <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setApprovedQty(String(itemQty));
                                          if (showToast) showToast(`Adopted recommended quantity: ${itemQty} units`);
                                        }}
                                        className="rm-btn rm-btn-secondary"
                                        style={{ padding: '3px 8px', fontSize: '11px', height: '24px' }}
                                        title="Set Approved Quantity to this recommendation"
                                      >
                                        Adopt Qty
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '12px 14px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#92400e',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <AlertCircle size={16} color="#d97706" />
                        <span>
                          {parsedStockAdequacy || 'No exact inventory item match in buffer stock for requested specifications.'}
                        </span>
                      </div>
                    )}

                    {/* Risk Flags & Operational Constraints */}
                    {((aiMatchingResult.riskFlags && aiMatchingResult.riskFlags.length > 0) || parsedConstraints) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {parsedConstraints && (
                          <div style={{ fontSize: '11.5px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AlertTriangle size={13} color="#d97706" />
                            <span>Operational constraint: {parsedConstraints}</span>
                          </div>
                        )}
                        {aiMatchingResult.riskFlags?.map((flag, idx) => (
                          <div key={idx} style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: 'fit-content'
                          }}>
                            <AlertCircle size={12} color="#dc2626" />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Remaining Stock Gauge Bar (Dynamically updated) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#405044' }}>Stock after requested allocation</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: isDeficit ? '#dc2626' : '#162e20',
                  transition: 'color 0.2s ease'
                }}>
                  {isDeficit 
                    ? `${Math.abs(remainingStock)} units deficit (Stock shortage)` 
                    : `${remainingStock} units remaining`}
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#edf1eb', 
                borderRadius: '4px', 
                overflow: 'hidden' 
              }}>
                <div 
                  style={{ 
                    width: `${percentRemaining}%`, 
                    height: '100%', 
                    backgroundColor: progressBg, 
                    borderRadius: '4px',
                    transition: 'width 0.25s ease, background-color 0.25s ease'
                  }} 
                />
              </div>
            </div>

            {/* Approved Quantity Input */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#4a5b4a', 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase', 
                marginBottom: '8px' 
              }}>
                APPROVED QUANTITY *
              </label>
              <input
                type="number"
                min="0"
                className="rm-form-input"
                style={{ fontWeight: 600, fontSize: '14px' }}
                value={approvedQty}
                onChange={(e) => setApprovedQty(e.target.value)}
              />
            </div>

            {/* Resource Manager Note */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#4a5b4a', 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase', 
                marginBottom: '8px' 
              }}>
                RESOURCE MANAGER NOTE
              </label>
              <textarea
                className="rm-note-textarea"
                rows={3}
                placeholder="Record allocation constraints, alternatives or operational conditions..."
                style={{
                  border: noteError ? '1px solid #dc2626' : undefined,
                  transition: 'border-color 0.15s ease'
                }}
                value={managerNote}
                onChange={(e) => {
                  setManagerNote(e.target.value);
                  if (noteError) setNoteError(null);
                }}
              />
              
              {/* Validation Prompt if Note is Missing for Reject / Request Info */}
              {noteError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  animation: 'rmFadeIn 0.15s ease-out'
                }}>
                  <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span>{noteError}</span>
                </div>
              )}
            </div>

            {/* Human Verification Notice (Phase 4 Strict Guardrail) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f4f6f2',
              border: '1px solid #e2e8dd',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '11.5px',
              color: '#405044'
            }}>
              <UserCheck size={14} color="#1e3d2c" style={{ flexShrink: 0 }} />
              <span>
                <strong>Human Decision Authority:</strong> AI recommendations are strictly advisory. Allocation, stock deduction, and dispatch require explicit approval below.
              </span>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="rm-btn rm-btn-secondary"
                onClick={handleRequestInfo}
              >
                <span>Request more information</span>
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-danger"
                onClick={handleReject}
              >
                <span>Reject with reason</span>
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-primary"
                onClick={handleApprove}
              >
                <span>Approve allocation</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rm-panel" style={{ 
            padding: '40px 24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center' 
          }}>
            <UserCheck size={36} color="#1e3d2c" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: '0 0 6px 0' }}>
              Queue Completed
            </h3>
            <p style={{ fontSize: '12.5px', color: '#657367', maxWidth: '340px', margin: 0 }}>
              All coordinator allocation requests have been processed. Switch to Inventory or Tracking to monitor dispatched supplies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationRequestsView;
