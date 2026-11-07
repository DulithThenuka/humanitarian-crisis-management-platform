import React, { useState } from 'react';
import { 
  Send, 
  Shield 
} from 'lucide-react';

export const CoordinationWorkspaceView = ({
  timeline,
  onAddTimelineEntry
}) => {
  const [recipient, setRecipient] = useState('Resource & Logistics Manager');
  const [message, setMessage] = useState('');
  const [priorityFlag, setPriorityFlag] = useState('Standard');

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onAddTimelineEntry({
      id: `tl-${Date.now()}`,
      time: timeStr,
      actor: `Partner Officer (Ravindu Perera) -> ${recipient}`,
      role: 'Role 1542 - authorized participants only',
      action: `Operational Update for ${recipient}`,
      details: message,
      tag: priorityFlag === 'High' ? 'Urgent Dispatch' : 'Field Bulletin'
    });

    setMessage('');
  };

  return (
    <div>
      {/* Top Header */}
      <div className="po-title-action-row">
        <div>
          <div className="po-workspace-label">Access-Controlled Coordination</div>
          <h1 className="po-page-heading">Coordination Workspace</h1>
          <p className="po-page-subtext">
            Only necessary operational information is shared. All messages are fictional demonstration records.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="po-dual-column-grid">
        {/* Left: Coordination Timeline */}
        <div className="po-white-panel-card">
          <div className="po-panel-top-row" style={{ marginBottom: '16px' }}>
            <h3 className="po-panel-heading">Coordination timeline</h3>
            <span className="po-tag-success" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              {timeline.length} Updates
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {timeline.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', minWidth: '40px', paddingTop: '2px' }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.action}</span>
                    <span style={{ fontSize: '10.5px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.role}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>{item.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Record Scoped Update Form */}
        <div className="po-white-panel-card">
          <div className="po-panel-top-row" style={{ marginBottom: '16px' }}>
            <h3 className="po-panel-heading">Record scoped update</h3>
          </div>

          <form onSubmit={handlePostUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                Recipient Workflow
              </label>
              <select
                className="po-dropdown-select"
                style={{ width: '100%' }}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="Resource & Logistics Manager">Resource & Logistics Manager</option>
                <option value="Emergency Shelter Lead">Emergency Shelter Lead</option>
                <option value="Medical Triage Coordinator">Medical Triage Coordinator</option>
                <option value="Field Volunteer Supervisor">Field Volunteer Supervisor</option>
              </select>
            </div>

            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                Priority Level
              </label>
              <select
                className="po-dropdown-select"
                style={{ width: '100%' }}
                value={priorityFlag}
                onChange={(e) => setPriorityFlag(e.target.value)}
              >
                <option value="Standard">Standard Bulletin</option>
                <option value="High">Urgent / Priority Alert</option>
              </select>
            </div>

            <div>
              <label className="po-attr-tag" style={{ display: 'block', marginBottom: '6px' }}>
                Operational Message
              </label>
              <textarea
                className="po-drawer-textarea-field"
                style={{ minHeight: '120px' }}
                placeholder="Do not include unrelated personal data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="po-privacy-box" style={{ padding: '10px 12px' }}>
              <Shield size={14} color="#1d4ed8" />
              <span style={{ fontSize: '11.5px', color: '#1e3a8a' }}>
                Formal audit DNS / verification will be sent.
              </span>
            </div>

            <button type="submit" className="po-btn-blue-primary" style={{ justifyContent: 'center', width: '100%' }}>
              <Send size={14} />
              <span>Record update</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

