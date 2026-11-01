import React, { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  CheckCheck,
  ChevronRight,
  AlertTriangle,
  Clock,
  X,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { NOTIFICATIONS_REMINDERS_DATA } from '../data/coordinatorPortalData';
import './NotificationsRemindersView.css';

export const NotificationsRemindersView = ({ onOpenCaseReview, onNavigateTab, showToast }) => {
  const [reminders, setReminders] = useState(NOTIFICATIONS_REMINDERS_DATA.records);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReminderModal, setSelectedReminderModal] = useState(null);

  const { summary } = NOTIFICATIONS_REMINDERS_DATA;

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reminder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedRecord.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [reminders, searchQuery, statusFilter]);

  const handleMarkAllRead = () => {
    showToast('All operational reminders marked as acknowledged.', 'success');
  };

  const handleActionReminder = (rem) => {
    if (rem.relatedRecord.startsWith('HMR-')) {
      onOpenCaseReview?.(rem.relatedRecord);
    } else if (rem.relatedRecord.startsWith('RES-')) {
      onNavigateTab?.('resources');
    } else if (rem.relatedRecord.startsWith('ALT-')) {
      onNavigateTab?.('alerts');
    } else if (rem.relatedRecord.startsWith('CR-')) {
      onNavigateTab?.('crisis');
    } else {
      setSelectedReminderModal(rem);
    }
  };

  return (
    <div className="ec-portal-canvas">
      {/* 1. Header Strip */}
      <div className="ec-case-heading-strip">
        <div>
          <span className="ec-breadcrumb-tiny">OPERATIONAL REMINDERS</span>
          <h2 className="ec-review-main-title">Notifications &amp; Reminders</h2>
          <p className="ec-review-sub-meta">
            Requests, alerts and unresolved issues requiring your attention.
          </p>
        </div>
        <button
          className="ec-btn-action-outline"
          onClick={handleMarkAllRead}
        >
          <CheckCheck size={15} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="ec-history-summary-grid">
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">Awaiting review</span>
          <span className="ec-hsum-val">{summary.awaitingReview}</span>
        </div>
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">Alerts requiring attention</span>
          <span className="ec-hsum-val" style={{ color: '#d97706' }}>{summary.alertsAttention}</span>
        </div>
        <div className="ec-hsum-card">
          <span className="ec-hsum-lbl">Overdue actions</span>
          <span className="ec-hsum-val" style={{ color: '#dc2626' }}>{summary.overdueActions}</span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="ec-rc-toolbar-container" style={{ padding: '12px 18px', marginBottom: '18px' }}>
        <div className="ec-rc-filter-bar">
          <div className="ec-rc-search-box">
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search reminders, record codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ec-rc-search-input"
            />
            {searchQuery && (
              <X size={14} className="ec-rc-search-clear" onClick={() => setSearchQuery('')} />
            )}
          </div>

          <div className="ec-rc-select-group">
            <select
              className="ec-rc-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Severity: All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="information">Information</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Reminders Table */}
      <div className="ec-table-container">
        <table className="ec-data-table">
          <thead>
            <tr>
              <th>REFERENCE</th>
              <th>REMINDER</th>
              <th>RELATED RECORD</th>
              <th>TIMING</th>
              <th>STATUS / RESULT</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredReminders.map((rem) => (
              <tr key={rem.id} onClick={() => handleActionReminder(rem)}>
                <td className="ec-table-req-id">{rem.id}</td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{rem.reminder}</td>
                <td style={{ color: '#0284c7', fontWeight: 600, fontFamily: 'monospace' }}>
                  {rem.relatedRecord}
                </td>
                <td style={{ color: '#475569', fontSize: '12px' }}>{rem.timing}</td>
                <td>
                  <span
                    className={`ec-svc-status-pill ${
                      rem.status === 'Critical'
                        ? 'pill-critical'
                        : rem.status === 'Warning'
                        ? 'pill-warning'
                        : 'pill-assignment'
                    }`}
                  >
                    <span className="ec-rc-status-dot"></span>
                    {rem.status}
                  </span>
                </td>
                <td>
                  <ChevronRight size={16} className="ec-rc-chevron" />
                </td>
              </tr>
            ))}
            {filteredReminders.length === 0 && (
              <tr>
                <td colSpan="6" className="ec-rc-empty-state">
                  No reminders matching current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReminderModal && (
        <div className="ec-modal-overlay" onClick={() => setSelectedReminderModal(null)}>
          <div className="ec-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-header">
              <div>
                <span className="ec-breadcrumb-tiny">ACTIONABLE REMINDER #{selectedReminderModal.id}</span>
                <h3 className="ec-modal-title">{selectedReminderModal.reminder}</h3>
              </div>
              <button className="ec-modal-close-btn" onClick={() => setSelectedReminderModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ec-modal-body-pad">
              <div className="ec-suitability-hud">
                <div className="ec-hud-pill">
                  <span>Linked Target:</span>
                  <strong>{selectedReminderModal.relatedRecord}</strong>
                </div>
                <div className="ec-hud-pill">
                  <span>Urgency:</span>
                  <strong>{selectedReminderModal.timing}</strong>
                </div>
              </div>
            </div>

            <div className="ec-modal-footer">
              <button
                type="button"
                className="ec-btn-modal-cancel"
                onClick={() => setSelectedReminderModal(null)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="ec-btn-action-primary"
                onClick={() => {
                  showToast(`Opened action link for ${selectedReminderModal.relatedRecord}`, 'info');
                  setSelectedReminderModal(null);
                }}
              >
                <span>Jump to Target Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
