import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const SuspiciousFlagReviewView = ({
  flags,
  onResolveFlag,
  onEscalateFlag
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState(flags[0]?.id || 'FLG-801');
  const [resolutionNote, setResolutionNote] = useState('');

  const selectedFlag = flags.find(f => f.id === selectedFlagId) || flags[0];

  return (
    <div className="fo-workspace">
      {/* Title & Action Block */}
      <div className="fo-title-block">
        <div>
          <div className="fo-eyebrow">
            <Layers size={13} />
            <span>AI FRAUD & VALUE ESCALATION MONITORING</span>
          </div>
          <h1 className="fo-title">Suspicious Flag Review</h1>
          <p className="fo-subtitle">
            Heuristic rules and AI variance detection on intake values, suspicious remittances, and unauthorized discrepancies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px 14px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldAlert size={14} />
            <span>{flags.length} Flagged Discrepancies</span>
          </span>
        </div>
      </div>

      {/* Split Grid */}
      <div className="fo-split-layout">
        {/* Left Flags List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {flags.map((flag) => {
            const isSelected = flag.id === selectedFlag?.id;
            return (
              <div 
                key={flag.id}
                className="fo-panel"
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? '#0284c7' : 'var(--fo-border)',
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                  boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.12)' : 'var(--fo-shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setSelectedFlagId(flag.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: flag.severity === 'High' ? '#fef2f2' : '#fffbeb',
                      color: flag.severityColor,
                      border: `1px solid ${flag.severity === 'High' ? '#fecaca' : '#fde68a'}`
                    }}>
                      {flag.severity} Severity
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{flag.id}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>{flag.recordId}</span>
                  </div>

                  <span style={{ fontSize: '11px', color: '#64748b' }}>{flag.detectedAt}</span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {flag.flagType}
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '12px', lineHeight: 1.5 }}>
                  {flag.triggerReason}
                </div>

                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px dashed var(--fo-border)',
                  fontSize: '11.5px',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <strong style={{ color: '#0284c7' }}>Action:</strong>
                  <span>{flag.recommendedAction}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Card */}
        {selectedFlag && (
          <div className="fo-detail-card">
            <div className="fo-detail-header-row">
              <span className="fo-detail-id">{selectedFlag.id}</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca'
              }}>
                ● {selectedFlag.status}
              </span>
            </div>

            <div className="fo-detail-source">{selectedFlag.source}</div>
            <div className="fo-detail-subtag">Target: {selectedFlag.recordId} · Detected: {selectedFlag.detectedAt}</div>

            <div className="fo-detail-fields-grid">
              <div className="fo-field-group">
                <span className="fo-field-label">Flag Type</span>
                <span className="fo-field-value">{selectedFlag.flagType}</span>
              </div>
              <div className="fo-field-group">
                <span className="fo-field-label">Assigned Officer</span>
                <span className="fo-field-value" style={{ color: '#0284c7' }}>
                  {selectedFlag.assignedOfficer}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                AUDIT HISTORY & DETECTION LOG
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedFlag.auditTrail?.map((trail, i) => (
                  <div key={i} style={{ fontSize: '11.5px', color: '#475569', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>{trail.time}</span>
                    <span>{trail.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fo-note-section">
              <label className="fo-note-label">RESOLUTION JUSTIFICATION / CLEARANCE NOTE</label>
              <textarea
                className="fo-note-textarea"
                placeholder="Document physical re-verification or warehouse manifest match..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              ></textarea>
            </div>

            <div className="fo-detail-actions">
              <button 
                className="fo-action-btn-primary"
                onClick={() => onResolveFlag(selectedFlag.id, resolutionNote || 'Verified with field dispatcher.')}
              >
                Mark Verified & Clear Flag
              </button>

              <button 
                className="fo-action-btn-danger"
                onClick={() => onEscalateFlag(selectedFlag.id)}
              >
                Escalate to DMC Audit Committee
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
