import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  MapPin,
  User,
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TaskProgressView = ({
  assignments,
  onCompleteTask,
  showToast
}) => {
  const activeTask =
    assignments.find((a) => a.status === 'Accepted') || assignments[0];

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm shift readiness & wear authorized HumanAid reflective vest', checked: true },
    { id: 2, text: 'Arrive at check-in location (Kelani Community Hall / Niyagama Desk)', checked: true },
    { id: 3, text: 'Report to On-Site Coordinator and receive morning operational briefing', checked: false },
    { id: 4, text: 'Execute designated relief distribution / desk registration duties', checked: false },
    { id: 5, text: 'Submit shift debrief and log total hours served', checked: false }
  ]);

  const [loggedHours, setLoggedHours] = useState('5.0');
  const [shiftNotes, setShiftNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleCheck = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (showToast) {
      showToast(`Shift log submitted for ${activeTask.taskTitle} (${loggedHours} hours). Sent to coordinator.`);
    }
  };

  return (
    <div>
      <div className="vol-page-header">
        <div>
          <div className="vol-page-eyebrow">Field execution & shift logging</div>
          <h1 className="vol-page-title">Task Progress & Operations</h1>
          <p className="vol-page-desc">
            Track your current field deployment, verify standard operating procedures, and log hours.
          </p>
        </div>
      </div>

      <div className="vol-schedule-grid-layout">
        {/* Left Column: Active Task Progress */}
        <div className="vol-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="vol-opp-priority-pill orange">Active Assignment</span>
            <span className="vol-task-id-mono">{activeTask.id}</span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#12281b', margin: '0 0 6px 0' }}>
            {activeTask.taskTitle}
          </h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> {activeTask.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} /> Coordinator: {activeTask.coordinator}
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8e0', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
              Operational Brief
            </div>
            <p style={{ fontSize: '12.5px', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              {activeTask.details || 'Coordinate with on-site staff for food ration pack deliveries and family allocations. Ensure all recipient IDs are recorded in field logs.'}
            </p>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: '#12281b', marginBottom: '10px' }}>
            Deployment Checklist (SOP)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {checklist.map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: item.checked ? '#f0fdf4' : '#ffffff',
                  border: `1px solid ${item.checked ? '#bbf7d0' : '#e2e8e0'}`,
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  color: item.checked ? '#166534' : '#1e293b'
                }}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  style={{ accentColor: '#183526', width: '16px', height: '16px' }}
                />
                <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Column: Shift Hours Submission */}
        <div className="vol-avail-settings-card">
          <h3 className="vol-card-title" style={{ marginBottom: '14px' }}>
            Log Shift & Verification
          </h3>

          <form onSubmit={handleSubmitReport}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Hours Worked
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                className="vol-select-field"
                value={loggedHours}
                onChange={(e) => setLoggedHours(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Shift Debrief & Notes
              </label>
              <textarea
                className="vol-select-field"
                rows="4"
                placeholder="Mention completed duties, relief kits distributed, or any safety issues encountered..."
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '14px', textAlign: 'center', marginBottom: '18px' }}>
              <Upload size={20} style={{ color: '#64748b', marginBottom: '4px' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                Attach sign-off sheet or photo (optional)
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>PNG, JPG up to 5MB</div>
            </div>

            <button
              type="submit"
              className="vol-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <CheckCircle2 size={16} />
              <span>Submit for Coordinator Approval</span>
            </button>
          </form>

          {isSubmitted && (
            <div style={{ marginTop: '14px', padding: '10px 12px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '12px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>Hours submitted. Status pending coordinator review.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

