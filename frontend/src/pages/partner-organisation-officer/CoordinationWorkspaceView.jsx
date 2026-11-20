import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Send, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import { incidentService } from '../../services/incidentService';
import { useRealtimeRefresh } from '../../hooks/useRealtimeRefresh';
import { formatShortCode, formatDateTime, getApiErrorMessage } from './partnerOfficerUtils';

export const CoordinationWorkspaceView = ({
  partner = null,
  incidents = [],
  requests = [],
  zones = [],
  canAccessIncidents = false,
  canManageRequests = false,
  onAddRequestNote,
  onNotify
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [communications, setCommunications] = useState([]);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [threadError, setThreadError] = useState('');

  const [recipient, setRecipient] = useState('Resource & Logistics Manager');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fallback request note target when incident endpoints aren't permitted
  const [selectedRequestId, setSelectedRequestId] = useState('');

  useEffect(() => {
    if (incidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(incidents[0].backendId || incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  useEffect(() => {
    if (requests.length > 0 && !selectedRequestId) {
      setSelectedRequestId(requests[0].id);
    }
  }, [requests, selectedRequestId]);

  const loadIncidentThread = useCallback(async (incId) => {
    if (!incId || !canAccessIncidents) return;
    setLoadingThread(true);
    setThreadError('');
    try {
      const [commRes, histRes] = await Promise.all([
        incidentService.getCommunications(incId),
        incidentService.getHistory(incId)
      ]);
      const comms = commRes?.data || (Array.isArray(commRes) ? commRes : []);
      const histData = histRes?.data || histRes || {};
      const statusLogs = Array.isArray(histData.statusHistory) ? histData.statusHistory : [];
      const auditLogs = Array.isArray(histData.auditLogs) ? histData.auditLogs : [];

      setCommunications(Array.isArray(comms) ? comms : []);
      setHistoryEntries([...statusLogs, ...auditLogs]);
    } catch (err) {
      setThreadError(getApiErrorMessage(err, 'Unable to load coordination timeline for this incident.'));
      setCommunications([]);
      setHistoryEntries([]);
    } finally {
      setLoadingThread(false);
    }
  }, [canAccessIncidents]);

  useEffect(() => {
    if (selectedIncidentId && canAccessIncidents) {
      loadIncidentThread(selectedIncidentId);
    }
  }, [selectedIncidentId, canAccessIncidents, loadIncidentThread]);

  useRealtimeRefresh(
    ['incidents'],
    () => loadIncidentThread(selectedIncidentId),
    { enabled: Boolean(selectedIncidentId && canAccessIncidents) }
  );

  const selectedIncident = incidents.find((i) => (i.backendId || i.id) === selectedIncidentId) || null;
  const selectedRequest = requests.find((r) => r.id === selectedRequestId) || null;

  // Build unified chronological timeline
  const timelineItems = React.useMemo(() => {
    if (canAccessIncidents && selectedIncidentId) {
      const commItems = communications.map((c) => ({
        id: `comm-${c.id}`,
        timestamp: c.sentAt || c.createdAt,
        title: c.title || `Update to ${c.recipient || 'Coordination Team'}`,
        body: c.message,
        author: c.senderName || c.senderRole || 'Authorised Staff',
        scope: `${selectedIncident?.caseNumber || formatShortCode(selectedIncidentId, 'INC')} · ${c.isInternal ? 'Internal coordination' : 'Shared update'}`
      }));

      const histItems = historyEntries.map((h, idx) => ({
        id: `hist-${h.id || idx}`,
        timestamp: h.changedAt || h.timestamp || h.createdAt,
        title: h.action || (h.toStatus ? `Status changed to ${h.toStatus}` : 'Workflow event'),
        body: h.note || h.details || h.reason || '',
        author: h.changedByName || h.performedByName || 'System',
        scope: `${selectedIncident?.caseNumber || formatShortCode(selectedIncidentId, 'INC')} · Audit trail`
      }));

      return [...commItems, ...histItems].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    }

    // Sector zone & partner handoff timeline when incident endpoints are restricted
    return zones
      .filter((z) => !partner || (z.assignedPartners || []).some((ap) => ap.partnerId === partner.id))
      .map((z) => ({
        id: `zone-${z.id}`,
        timestamp: null,
        title: `${z.zoneCode} · ${z.priorityStatus}`,
        body: `Lead agency: ${z.leadAgency}. Coverage: ${z.coveragePercent}%. ${z.description || ''}`,
        author: z.leadAgency,
        scope: 'Sector coordination handoff'
      }));
  }, [canAccessIncidents, selectedIncidentId, communications, historyEntries, selectedIncident, zones, partner]);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      if (canAccessIncidents && selectedIncidentId) {
        await incidentService.addCommunication(selectedIncidentId, {
          recipient,
          message: message.trim(),
          title: `Partner coordination note → ${recipient}`,
          isInternal: true,
          isVisibleToCitizen: false
        });
        setMessage('');
        await loadIncidentThread(selectedIncidentId);
        onNotify && onNotify('Coordination update logged to incident audit trail.', 'success');
      } else if (canManageRequests && selectedRequestId && onAddRequestNote) {
        const ok = await onAddRequestNote(selectedRequestId, `[To ${recipient}] ${message.trim()}`);
        if (ok) {
          setMessage('');
        }
      }
    } catch (err) {
      onNotify && onNotify(getApiErrorMessage(err, 'Failed to record coordination update.'), 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const canPost = (canAccessIncidents && Boolean(selectedIncidentId)) || (canManageRequests && Boolean(selectedRequestId));

  return (
    <div className="po-workspace">
      {/* Header */}
      <div className="po-title-block">
        <div>
          <div className="po-eyebrow">
            <span>ACCESS-CONTROLLED INTER-AGENCY COORDINATION</span>
          </div>
          <h1 className="po-title">Coordination Workspace</h1>
          <p className="po-subtitle">
            Review scoped incident handoffs, operational decisions, and internal coordination logs with authorised roles.
          </p>
        </div>

        {canAccessIncidents && incidents.length > 0 && (
          <div className="po-title-actions">
            <select
              className="po-select"
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              aria-label="Select incident for coordination"
            >
              {incidents.map((inc) => {
                const val = inc.backendId || inc.id;
                return (
                  <option key={val} value={val}>
                    {inc.caseNumber || formatShortCode(val, 'INC')} · {inc.title} ({inc.status})
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              className="po-btn po-btn-secondary"
              onClick={() => loadIncidentThread(selectedIncidentId)}
              disabled={loadingThread}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="po-split-layout">
        {/* Left: Coordination Timeline */}
        <div className="po-panel" style={{ padding: '24px', flex: '1 1 56%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#1e3d2c" />
              <span>Coordination Timeline</span>
            </h3>
            <span className="po-badge-pill-cream">● {timelineItems.length} entries</span>
          </div>

          {threadError && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12.5px', marginBottom: '16px' }}>
              {threadError}
            </div>
          )}

          {loadingThread ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#657367', fontSize: '13px' }}>
              Loading coordination history...
            </div>
          ) : timelineItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#f8faf7', borderRadius: '10px', color: '#657367', fontSize: '13px' }}>
              <MessageSquare size={24} color="#8d9a8f" style={{ marginBottom: '8px' }} />
              <div>No coordination updates recorded for this record yet.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {timelineItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #edf1eb'
                  }}
                >
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#657367', minWidth: '115px', paddingTop: '2px' }}>
                    {item.timestamp ? formatDateTime(item.timestamp) : 'Active Zone'}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1e3d2c', flexShrink: 0 }} />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#162e20' }}>
                        {item.title}
                      </span>
                    </div>
                    {item.body && (
                      <div style={{ fontSize: '12.5px', color: '#243328', paddingLeft: '14px', lineHeight: 1.45 }}>
                        {item.body}
                      </div>
                    )}
                    <div style={{ fontSize: '11.5px', color: '#738075', paddingLeft: '14px' }}>
                      {item.author} · {item.scope}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Record Scoped Update Form */}
        <div className="po-panel" style={{ padding: '24px', flex: '1 1 40%' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#162e20', marginBottom: '16px' }}>
            Log Internal Coordination Update
          </h3>

          {!canAccessIncidents && requests.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                LINKED ASSISTANCE REQUEST
              </label>
              <select
                className="po-select"
                style={{ width: '100%' }}
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {formatShortCode(r.id, 'REQ')} · {r.category} ({r.address || 'General'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handlePostUpdate}>
            <div style={{ marginBottom: '16px' }}>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                RECIPIENT ROLE / WORKFLOW
              </label>
              <select
                className="po-select"
                style={{ width: '100%' }}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Resource & Logistics Manager">Resource &amp; Logistics Manager</option>
                <option value="Emergency Coordinator">Emergency Coordinator</option>
                <option value="Incident / Case Manager">Incident / Case Manager</option>
                <option value="Shelter Supervisor">Shelter Supervisor</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                OPERATIONAL MESSAGE *
              </label>
              <textarea
                className="po-note-textarea"
                style={{ width: '100%', minHeight: '120px', boxSizing: 'border-box' }}
                placeholder="Record a scoped handoff note or operational update (avoid unnecessary personal data)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#edf2e8',
                border: '1px solid #dbe4c6',
                color: '#3d4d40',
                fontSize: '11.5px',
                lineHeight: 1.45,
                marginBottom: '16px'
              }}
            >
              <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                Updates are stored directly in the platform&apos;s internal coordination audit log for{' '}
                <strong>
                  {canAccessIncidents && selectedIncident
                    ? (selectedIncident.caseNumber || formatShortCode(selectedIncident.id, 'INC'))
                    : (selectedRequest ? formatShortCode(selectedRequest.id, 'REQ') : 'active operations')}
                </strong>
                . External emails or SMS messages are not dispatched from this form.
              </span>
            </div>

            <button
              type="submit"
              className="po-btn po-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting || !canPost || !message.trim()}
            >
              <Send size={14} />
              <span>{submitting ? 'Logging Update...' : 'Log Coordination Update'}</span>
            </button>

            {!canPost && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#657367', textAlign: 'center' }}>
                Your current role does not have write access to incident or request coordination logs.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoordinationWorkspaceView;
