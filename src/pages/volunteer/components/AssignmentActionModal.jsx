import React from 'react';
import { X, CheckCircle2, Clock, AlertCircle, MapPin, User, FileText, Check } from 'lucide-react';

export const AssignmentActionModal = ({
  assignment,
  onClose,
  onRespondAction,
  onOpenTaskProgress
}) => {
  if (!assignment) return null;

  return (
    <div className="vol-modal-backdrop" onClick={onClose}>
      <div className="vol-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="vol-modal-header">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              Assignment Action: {assignment.id}
            </div>
            <h3 className="vol-modal-title">{assignment.taskTitle}</h3>
          </div>
          <button className="vol-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="vol-modal-body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <span
              className={`vol-status-badge ${
                assignment.status === 'Offered'
                  ? 'warning'
                  : assignment.status === 'Accepted'
                  ? 'info'
                  : 'success'
              }`}
            >
              Status: {assignment.status}
            </span>
            <span className="vol-pill tag-neutral">Priority: {assignment.priority}</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8e0', marginBottom: '16px' }}>
            <div style={{ fontSize: '12.5px', color: '#1e293b', marginBottom: '8px' }}>
              <strong>Operational Details:</strong> {assignment.details}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <strong>Assigned Date:</strong> {assignment.assigned}</div>
              <div>• <strong>Reporting Deadline:</strong> {assignment.deadline}</div>
              <div>• <strong>Location:</strong> {assignment.location}</div>
              <div>• <strong>Coordinator:</strong> {assignment.coordinator}</div>
            </div>
          </div>

          {assignment.status === 'Offered' && (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#b45309' }}>
              This assignment has been offered to you by Coordinator {assignment.coordinator}. Please accept or decline before the reporting deadline.
            </div>
          )}

          {assignment.status === 'Completed' && (
            <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>Shift finished and approved. 3.0 service hours credited to your volunteer profile.</span>
            </div>
          )}
        </div>

        <div className="vol-modal-footer">
          {assignment.status === 'Offered' ? (
            <>
              <button
                className="vol-btn-outline"
                style={{ color: '#b91c1c' }}
                onClick={() => {
                  onRespondAction(assignment.id, 'Decline');
                  onClose();
                }}
              >
                Decline
              </button>
              <button
                className="vol-btn-primary"
                onClick={() => {
                  onRespondAction(assignment.id, 'Accept');
                  onClose();
                }}
              >
                <Check size={15} />
                <span>Accept Assignment</span>
              </button>
            </>
          ) : assignment.status === 'Accepted' ? (
            <>
              <button className="vol-btn-outline" onClick={onClose}>
                Close
              </button>
              <button
                className="vol-btn-primary"
                onClick={() => {
                  onOpenTaskProgress(assignment);
                  onClose();
                }}
              >
                Go to Task Progress
              </button>
            </>
          ) : (
            <button className="vol-btn-primary" onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

