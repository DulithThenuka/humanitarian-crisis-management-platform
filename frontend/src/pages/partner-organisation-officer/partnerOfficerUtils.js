/**
 * Shared formatting, status lifecycle, category inference, and CSV export helpers
 * for the Partner Organisation Officer Portal.
 */

export const COMMITMENT_LIFECYCLE = [
  'Pledged',
  'Confirmed',
  'Staged',
  'Dispatched',
  'Delivered',
  'Completed'
];

export const formatShortCode = (id, prefix = 'COM') => {
  if (!id) return `${prefix}-0000`;
  const str = String(id);
  if (/^(COM|REQ|INC|CR|PART)-/i.test(str)) return str;
  return `${prefix}-${str.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateOnly = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const inferResourceCategory = (item = '') => {
  const lower = String(item).toLowerCase();
  if (/water|wash|purif|hygiene|sanit/.test(lower)) return 'Water & WASH';
  if (/food|ration|meal|biscuit|nutrition|kitchen/.test(lower)) return 'Food & Nutrition';
  if (/medic|ambul|first aid|triage|clinic|paramed|health/.test(lower)) return 'Medical & Health';
  if (/tent|shelter|blanket|kit|school|box/.test(lower)) return 'Shelter & NFI';
  if (/boat|truck|vehicle|fleet|transport|4x4/.test(lower)) return 'Logistics & Transport';
  if (/responder|team|crew|staff|volunteer/.test(lower)) return 'Personnel & Teams';
  return 'General Relief';
};

export const getCommitmentStatusMeta = (status = '') => {
  const raw = String(status || 'Pledged').trim();
  const s = raw.toLowerCase();

  if (s === 'withdrawn' || s === 'cancelled') {
    return {
      label: raw,
      badgeClass: 'delayed',
      progress: 0,
      stepIndex: -1,
      isPending: false,
      isActive: false,
      isInTransit: false,
      isCompleted: false,
      isDelayed: false,
      isWithdrawn: true
    };
  }
  if (s === 'delayed') {
    return {
      label: raw,
      badgeClass: 'delayed',
      progress: 55,
      stepIndex: 3,
      isPending: false,
      isActive: true,
      isInTransit: true,
      isCompleted: false,
      isDelayed: true,
      isWithdrawn: false
    };
  }
  if (s === 'completed' || s === 'received') {
    return {
      label: raw,
      badgeClass: 'confirmed',
      progress: 100,
      stepIndex: 5,
      isPending: false,
      isActive: false,
      isInTransit: false,
      isCompleted: true,
      isDelayed: false,
      isWithdrawn: false
    };
  }
  if (s === 'delivered') {
    return {
      label: raw,
      badgeClass: 'confirmed',
      progress: 85,
      stepIndex: 4,
      isPending: false,
      isActive: false,
      isInTransit: false,
      isCompleted: true,
      isDelayed: false,
      isWithdrawn: false
    };
  }
  if (s === 'dispatched' || s === 'in transit' || s === 'deployed' || s === 'distributing' || s === 'active' || s === 'daily') {
    return {
      label: raw,
      badgeClass: 'dispatched',
      progress: 68,
      stepIndex: 3,
      isPending: false,
      isActive: true,
      isInTransit: true,
      isCompleted: false,
      isDelayed: false,
      isWithdrawn: false
    };
  }
  if (s === 'staged') {
    return {
      label: raw,
      badgeClass: 'awaiting',
      progress: 45,
      stepIndex: 2,
      isPending: false,
      isActive: true,
      isInTransit: false,
      isCompleted: false,
      isDelayed: false,
      isWithdrawn: false
    };
  }
  if (s === 'confirmed') {
    return {
      label: raw,
      badgeClass: 'confirmed',
      progress: 30,
      stepIndex: 1,
      isPending: false,
      isActive: true,
      isInTransit: false,
      isCompleted: false,
      isDelayed: false,
      isWithdrawn: false
    };
  }
  return {
    label: raw || 'Pledged',
    badgeClass: 'awaiting',
    progress: 15,
    stepIndex: 0,
    isPending: true,
    isActive: true,
    isInTransit: false,
    isCompleted: false,
    isDelayed: false,
    isWithdrawn: false
  };
};

export const getAllowedNextDeliveryStatuses = (currentStatus = '') => {
  const s = String(currentStatus || '').trim().toLowerCase();
  if (s === 'pledged' || s === 'pending') return ['Confirmed', 'Withdrawn'];
  if (s === 'confirmed') return ['Staged', 'Dispatched', 'Withdrawn'];
  if (s === 'staged') return ['Dispatched', 'In Transit', 'Delayed'];
  if (s === 'dispatched' || s === 'in transit' || s === 'deployed' || s === 'distributing' || s === 'active' || s === 'daily') {
    return ['Delivered', 'Delayed'];
  }
  if (s === 'delayed') return ['Dispatched', 'In Transit', 'Delivered'];
  if (s === 'delivered') return ['Completed'];
  return [];
};

const REQUEST_STATUS_MAP = {
  0: 'Submitted',
  1: 'Verified',
  2: 'InProgress',
  3: 'Resolved',
  4: 'Closed'
};

const PRIORITY_MAP = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical'
};

export const getRequestStatusLabel = (status) => {
  if (typeof status === 'number') return REQUEST_STATUS_MAP[status] || 'Submitted';
  return String(status || 'Submitted');
};

export const getPriorityLabel = (urgency) => {
  if (typeof urgency === 'number') return PRIORITY_MAP[urgency] || 'Medium';
  return String(urgency || 'Medium');
};

export const getRequestStatusBadgeClass = (statusLabel) => {
  const s = String(statusLabel || '').toLowerCase();
  if (s === 'resolved' || s === 'closed' || s === 'verified') return 'confirmed';
  if (s === 'inprogress' || s === 'in progress') return 'dispatched';
  return 'awaiting';
};

export const getPriorityBadgeClass = (priorityLabel) => {
  const p = String(priorityLabel || '').toLowerCase();
  if (p === 'critical' || p === 'high') return 'delayed';
  if (p === 'medium') return 'awaiting';
  return 'confirmed';
};

export const getApiErrorMessage = (err, fallback = 'An unexpected error occurred.') => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (Array.isArray(err.errors) && err.errors.length > 0) return err.errors[0];
  if (err.message) return err.message;
  if (err.title) return err.title;
  return fallback;
};

export const exportToCsv = (filename, headers, rows) => {
  const escapeCell = (val) => {
    const str = val === null || val === undefined ? '' : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
