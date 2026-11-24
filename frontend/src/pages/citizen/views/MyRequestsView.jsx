import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  Home,
  Droplet,
  HeartPulse,
  Eye,
  RefreshCw,
  X,
  MapPin,
  Phone,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { requestService } from '../../../services/requestService';
import { useRealtimeRefresh } from '../../../hooks/useRealtimeRefresh';
import {
  safeString,
  safeLower,
  safeUpper,
  normalizeUrgency,
  normalizeRequestStatus,
  formatRequestId
} from '../utils/citizenDataUtils';

export const MyRequestsView = ({ onSelectTab, showToast }) => {
  const [requestsList, setRequestsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSubtab, setActiveSubtab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestService.getAll();
      const raw = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(raw)) {
        const mapped = raw.map((r, idx) => {
          const normStatus = normalizeRequestStatus(r?.status);
          const isCompleted = normStatus === 'Resolved' || normStatus === 'Closed';
          const isVerified = normStatus === 'Verified';
          const isInProgress = normStatus === 'InProgress';

          const statusLabel = isCompleted
            ? 'Completed & Resolved'
            : isInProgress
            ? 'Assistance In Progress'
            : isVerified
            ? 'Verified & Approved'
            : 'Submitted & In Review';

          const statusType = isCompleted ? 'completed' : isVerified || isInProgress ? 'active' : 'review';
          const urgencyLabel = normalizeUrgency(r?.urgency ?? r?.priority, 'Medium');

          const dateFormatted = r?.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Recent';

          return {
            id: formatRequestId(r?.id, `REQ-00${idx + 1}`),
            rawId: r?.id,
            category: safeString(r?.category, 'Emergency Assistance'),
            title: safeString(r?.category, 'Emergency Assistance'),
            date: dateFormatted,
            createdAt: r.createdAt,
            urgency: urgencyLabel,
            status: statusLabel,
            rawStatus: r.status,
            statusType,
            isCompleted,
            location: r.address || 'Western Province',
            contactPhone: r.contactPhone || '+94 77 123 4567',
            familyCount: r.numberOfPeople || 1,
            description: r.description || 'Emergency assistance requested via citizen portal.',
            aiScore: r.aiPriorityScore ?? 75,
            trackingSteps: [
              {
                title: 'Request Submitted',
                desc: 'Application received and stored in crisis dispatch repository.',
                date: r.createdAt ? new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Verified',
                done: true
              },
              {
                title: 'AI Triage & Urgency Classification',
                desc: `Automated assessment priority score: ${r.aiPriorityScore ?? 75}/100.`,
                date: 'Completed',
                done: true
              },
              {
                title: 'Coordinator Verification',
                desc: isVerified || isInProgress || isCompleted
                  ? 'Authorized coordinator verified need and validated household location.'
                  : 'Awaiting coordinator inspection.',
                date: isVerified || isInProgress || isCompleted ? 'Verified' : 'Pending',
                done: isVerified || isInProgress || isCompleted
              },
              {
                title: 'Logistics Resource Allocation',
                desc: isInProgress || isCompleted
                  ? 'Supplies matched and queued for transportation.'
                  : 'Pending resource assignment.',
                date: isInProgress || isCompleted ? 'Allocated' : 'Queued',
                done: isInProgress || isCompleted
              },
              {
                title: 'Field Relief Dispatch & Resolution',
                desc: isCompleted
                  ? 'Aid supplies delivered to recipient household.'
                  : 'Pending field delivery.',
                date: isCompleted ? 'Fulfilled' : 'Scheduled',
                done: isCompleted
              }
            ]
          };
        });
        setRequestsList(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch citizen requests:', err);
      setError('Unable to load your assistance history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  // Real-time synchronization
  useRealtimeRefresh(['assistancerequests', 'requests'], fetchMyRequests);

  const activeCount = requestsList.filter((r) => !r.isCompleted).length;
  const completedCount = requestsList.filter((r) => r.isCompleted).length;

  const filteredRequests = useMemo(() => {
    return requestsList.filter((req) => {
      if (activeSubtab === 'active' && req.isCompleted) return false;
      if (activeSubtab === 'completed' && !req.isCompleted) return false;

      if (categoryFilter !== 'All') {
        if (!safeLower(req.category).includes(safeLower(categoryFilter))) {
          return false;
        }
      }

      if (searchTerm) {
        const term = safeLower(searchTerm);
        const matchId = safeLower(req.id).includes(term);
        const matchCat = safeLower(req.category).includes(term);
        const matchDesc = safeLower(req.description).includes(term);
        const matchLoc = safeLower(req.location).includes(term);
        if (!matchId && !matchCat && !matchDesc && !matchLoc) return false;
      }

      return true;
    });
  }, [requestsList, activeSubtab, categoryFilter, searchTerm]);

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    if (showToast) {
      showToast(`Showing operational audit tracking for ${req.id}`);
    }
  };

  return (
    <div className="cp-view-container">
      {/* View Header */}
      <div className="cp-view-header">
        <div>
          <span className="cp-view-pretitle">YOUR ASSISTANCE HISTORY</span>
          <h1 className="cp-view-title">My Requests</h1>
          <p className="cp-view-subtitle">
            View, filter, and track all crisis relief applications submitted from your account.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchMyRequests}
            className="cp-btn-secondary"
            title="Refresh requests"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => onSelectTab('submit')} className="cp-btn-primary">
            <Plus size={16} />
            Submit Assistance Request
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #d4ded3',
          marginBottom: '20px'
        }}
      >
        <button
          onClick={() => setActiveSubtab('active')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'active' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'active' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Active Requests ({activeCount})
        </button>

        <button
          onClick={() => setActiveSubtab('completed')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'completed' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'completed' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          Completed Requests ({completedCount})
        </button>

        <button
          onClick={() => setActiveSubtab('all')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeSubtab === 'all' ? '#1e3d2c' : '#738075',
            borderBottom: activeSubtab === 'all' ? '2.5px solid #1e3d2c' : '2.5px solid transparent'
          }}
        >
          All Requests ({requestsList.length})
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8dd',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '22px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#738075'
            }}
          />
          <input
            type="text"
            className="cp-form-input"
            style={{ paddingLeft: '34px' }}
            placeholder="Search by ID, category, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="cp-form-select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food Rations</option>
            <option value="Water">Drinking Water</option>
            <option value="Shelter">Shelter & Accommodation</option>
            <option value="Med">Medical / Medicine</option>
          </select>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading && requestsList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#657367' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#1e3d2c' }} />
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Loading assistance records...</p>
        </div>
      )}

      {error && requestsList.length === 0 && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <AlertTriangle size={20} />
          <div>{error}</div>
        </div>
      )}

      {!loading && filteredRequests.length === 0 && (
        <div
          className="cp-card"
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: '#738075'
          }}
        >
          <Info size={32} style={{ margin: '0 auto 12px auto', color: '#9fa89e' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', marginBottom: '6px' }}>
            No requests found in this category
          </h3>
          <p style={{ fontSize: '12.5px', margin: '0 0 16px 0' }}>
            {activeSubtab === 'active'
              ? 'You do not have any open assistance requests requiring action.'
              : 'No completed assistance records are available.'}
          </p>
          <button onClick={() => onSelectTab('submit')} className="cp-btn-primary">
            <Plus size={15} />
            Submit New Assistance Request
          </button>
        </div>
      )}

      {/* Requests List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredRequests.map((req) => {
          const catLower = (req.category || '').toLowerCase();
          const icon = catLower.includes('water') ? (
            <Droplet size={18} />
          ) : catLower.includes('med') ? (
            <HeartPulse size={18} />
          ) : (
            <Home size={18} />
          );

          return (
            <div
              key={req.id}
              className="cp-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                transition: 'border-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f4ee',
                    color: '#1e3d2c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e3d2c' }}>
                      {req.id}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: req.isCompleted ? '#ecfdf5' : '#eff6ff',
                        color: req.isCompleted ? '#047857' : '#1d4ed8'
                      }}
                    >
                      ● {req.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#162e20', margin: '0 0 4px 0' }}>
                    {req.category}
                  </h3>

                  <div style={{ fontSize: '12px', color: '#657367', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span>Submitted {req.date}</span>
                    <span>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {req.familyCount} people
                    </span>
                    <span>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {req.location}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => handleViewDetails(req)}
                  className="cp-btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    padding: '8px 14px'
                  }}
                >
                  <Eye size={14} />
                  View Tracking Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="cp-card"
            style={{
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #edf1eb',
                marginBottom: '18px'
              }}
            >
              <div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: selectedRequest.isCompleted ? '#ecfdf5' : '#eff6ff',
                    color: selectedRequest.isCompleted ? '#047857' : '#1d4ed8'
                  }}
                >
                  ● {selectedRequest.status}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#162e20', margin: '8px 0 2px 0' }}>
                  {selectedRequest.id} · {selectedRequest.category}
                </h2>
                <div style={{ fontSize: '12px', color: '#657367' }}>
                  Submitted on {selectedRequest.date} · Urgency: {selectedRequest.urgency}
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#738075',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Location & Household Meta */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  backgroundColor: '#f8faf7',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #edf1eb'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Location Address</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedRequest.location}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Household Members</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedRequest.familyCount} individuals
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>Contact Number</div>
                  <div style={{ fontSize: '12.5px', color: '#1e3d2c', fontWeight: 700, marginTop: '2px' }}>
                    {selectedRequest.contactPhone}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#738075', fontWeight: 600 }}>AI Classification Score</div>
                  <div style={{ fontSize: '12.5px', color: '#162e20', fontWeight: 600, marginTop: '2px' }}>
                    {selectedRequest.aiScore} / 100
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#162e20', marginBottom: '4px' }}>
                  Situation & Description
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: '#243328',
                    backgroundColor: '#ffffff',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8dd',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {selectedRequest.description}
                </div>
              </div>

              {/* 5-Stage Operational Tracking Timeline */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#162e20', marginBottom: '12px' }}>
                  Operational Audit Timeline
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedRequest.trackingSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 12px',
                        backgroundColor: step.done ? '#f0f4ee' : '#fafafa',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: step.done ? '#d4ded3' : '#ebebeb'
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: step.done ? '#1e3d2c' : '#d4ded3',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        {step.done ? '✓' : sIdx + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#162e20' }}>
                            {step.title}
                          </span>
                          <span style={{ fontSize: '11px', color: step.done ? '#059669' : '#738075', fontWeight: 600 }}>
                            {step.date}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#657367', marginTop: '2px' }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="cp-btn-secondary"
                >
                  Close Tracking Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequestsView;
