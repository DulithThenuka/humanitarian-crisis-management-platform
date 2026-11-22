/**
 * ============================================================================
 * RELIEFCORE Citizen Portal Data Normalization & Type Safety Utilities
 * Handles all edge cases for API responses: numbers, enums, strings, null, undefined, objects
 * ============================================================================
 */

/**
 * Safely converts any input into a trimmed string, returning fallback if null/undefined/empty
 */
export const safeString = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    if (val.name !== undefined) return safeString(val.name, fallback);
    if (val.label !== undefined) return safeString(val.label, fallback);
    if (val.title !== undefined) return safeString(val.title, fallback);
    if (val.value !== undefined) return safeString(val.value, fallback);
  }
  return fallback;
};

/**
 * Safely converts any input to lower case string
 */
export const safeLower = (val, fallback = '') => {
  return safeString(val, fallback).toLowerCase();
};

/**
 * Safely converts any input to upper case string
 */
export const safeUpper = (val, fallback = '') => {
  return safeString(val, fallback).toUpperCase();
};

/**
 * Normalizes Urgency / PriorityLevel (C# enum 0=Low, 1=Medium, 2=High, 3=Critical)
 * Safely handles numbers, strings, objects, null, undefined.
 */
export const normalizeUrgency = (val, fallback = 'Medium') => {
  if (val === null || val === undefined) return fallback;

  if (typeof val === 'number') {
    switch (val) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      case 3: return 'Critical';
      default: return val >= 3 ? 'Critical' : val === 2 ? 'High' : val === 1 ? 'Medium' : 'Low';
    }
  }

  if (typeof val === 'object') {
    if (val.name !== undefined) return normalizeUrgency(val.name, fallback);
    if (val.value !== undefined) return normalizeUrgency(val.value, fallback);
    if (val.level !== undefined) return normalizeUrgency(val.level, fallback);
  }

  const str = safeLower(val);
  if (!str) return fallback;

  if (str === '0' || str === 'low') return 'Low';
  if (str === '1' || str === 'medium' || str === 'normal' || str === 'standard') return 'Medium';
  if (str === '2' || str === 'high' || str === 'urgent') return 'High';
  if (str === '3' || str === 'critical' || str === 'emergency') return 'Critical';

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns safe CSS modifier class for urgency pills/badges ('low' | 'medium' | 'high' | 'critical')
 */
export const getUrgencyCssClass = (val) => {
  const norm = normalizeUrgency(val, 'medium').toLowerCase();
  if (norm === 'critical' || norm === 'emergency') return 'critical';
  if (norm === 'high' || norm === 'urgent') return 'high';
  if (norm === 'medium' || norm === 'normal') return 'medium';
  if (norm === 'low') return 'low';
  return 'normal';
};

/**
 * Normalizes RequestStatus (C# enum 0=Submitted, 1=Verified, 2=InProgress, 3=Resolved, 4=Rejected, 5=Closed)
 */
export const normalizeRequestStatus = (val, fallback = 'Submitted') => {
  if (val === null || val === undefined) return fallback;

  if (typeof val === 'number') {
    switch (val) {
      case 0: return 'Submitted';
      case 1: return 'Verified';
      case 2: return 'InProgress';
      case 3: return 'Resolved';
      case 4: return 'Rejected';
      case 5: return 'Closed';
      default: return fallback;
    }
  }

  if (typeof val === 'object') {
    if (val.name !== undefined) return normalizeRequestStatus(val.name, fallback);
    if (val.status !== undefined) return normalizeRequestStatus(val.status, fallback);
    if (val.value !== undefined) return normalizeRequestStatus(val.value, fallback);
  }

  const str = safeLower(val);
  if (!str) return fallback;

  if (str === '0' || str === 'submitted' || str === 'pending' || str.includes('review')) return 'Submitted';
  if (str === '1' || str === 'verified' || str === 'approved') return 'Verified';
  if (str === '2' || str === 'inprogress' || str === 'in progress' || str === 'active') return 'InProgress';
  if (str === '3' || str === 'resolved' || str === 'completed' || str === 'fulfilled') return 'Resolved';
  if (str === '4' || str === 'rejected' || str === 'cancelled') return 'Rejected';
  if (str === '5' || str === 'closed') return 'Closed';

  return fallback;
};

/**
 * Returns comprehensive visual styling and status details for a given status
 */
export const getRequestStatusDetails = (val) => {
  const norm = normalizeRequestStatus(val);
  switch (norm) {
    case 'Resolved':
    case 'Closed':
      return {
        step: 4,
        label: 'Completed',
        statusPillClass: 'cp-status-completed',
        badgeBg: '#ecfdf5',
        badgeColor: '#047857',
        isCompleted: true
      };
    case 'InProgress':
      return {
        step: 3,
        label: 'In Progress',
        statusPillClass: 'cp-status-in-progress',
        badgeBg: '#eff6ff',
        badgeColor: '#1d4ed8',
        isInProgress: true
      };
    case 'Verified':
      return {
        step: 2,
        label: 'Verified',
        statusPillClass: 'cp-status-in-progress',
        badgeBg: '#eff6ff',
        badgeColor: '#1d4ed8',
        isVerified: true
      };
    case 'Submitted':
    default:
      return {
        step: 1,
        label: 'Under Review',
        statusPillClass: 'cp-status-under-review',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e',
        isUnderReview: true
      };
  }
};

/**
 * Safely formats any ID into REQ-XXXXXXXX
 */
export const formatRequestId = (id, fallback = 'REQ-000') => {
  if (!id) return fallback;
  const s = safeString(id);
  const clean = s.replace(/[^a-zA-Z0-9]/g, '');
  if (!clean) return fallback;
  return `REQ-${clean.slice(0, 8).toUpperCase()}`;
};
