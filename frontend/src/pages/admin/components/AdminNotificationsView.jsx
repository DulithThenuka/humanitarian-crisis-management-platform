import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  Search,
  Users,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

export const AdminNotificationsView = ({ showToast, onRefreshBadge }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'UNREAD', 'VOLUNTEER', 'CITIZEN'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration Details Modal state
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [verifyingVolunteer, setVerifyingVolunteer] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await adminService.getNotifications();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setNotifications(Array.isArray(list) ? list : []);
      if (typeof onRefreshBadge === 'function') onRefreshBadge();
    } catch (err) {
      console.warn('Error loading admin notifications:', err);
      showToast('Could not load administrative notifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await adminService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      if (typeof onRefreshBadge === 'function') onRefreshBadge();
      showToast('Notification marked as read.');
    } catch {
      showToast('Failed to mark notification as read.', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await adminService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      if (typeof onRefreshBadge === 'function') onRefreshBadge();
      showToast('All administrative notifications marked as read.');
    } catch {
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const handleOpenDetails = async (notif) => {
    setSelectedNotification(notif);
    setLoadingDetails(true);
    setRegistrationDetails(null);

    // Auto mark as read on inspect
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }

    try {
      const res = await adminService.getRegistrationDetails(notif.userId);
      const details = res?.data || res;
      setRegistrationDetails(details);
    } catch (err) {
      console.warn('Error fetching registration details:', err);
      showToast('Could not load detailed user credentials.', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleVerifyVolunteer = async (userId) => {
    setVerifyingVolunteer(true);
    try {
      const res = await adminService.verifyVolunteerRegistration(userId, 'Verified by Administrator via Notification Radar.');
      if (res?.succeeded || res?.data) {
        showToast('Volunteer credentials successfully verified and field deployment status activated!');
        if (registrationDetails) {
          setRegistrationDetails(prev => ({
            ...prev,
            verificationStatus: 'Verified & Ready'
          }));
        }
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
        if (typeof onRefreshBadge === 'function') onRefreshBadge();
      } else {
        showToast(res?.errors?.[0] || 'Verification failed.', 'error');
      }
    } catch (err) {
      showToast(err?.message || 'Error communicating with verification authority.', 'error');
    } finally {
      setVerifyingVolunteer(false);
    }
  };

  // Filtered list
  const safeList = Array.isArray(notifications) ? notifications : [];
  const filteredList = safeList.filter(n => {
    if (!n) return false;
    // Search query
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = !q ||
      (n.userName && n.userName.toLowerCase().includes(q)) ||
      (n.userEmail && n.userEmail.toLowerCase().includes(q)) ||
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.role && n.role.toLowerCase().includes(q));

    // Type filter
    if (filterType === 'UNREAD') return matchesSearch && !n.isRead;
    if (filterType === 'VOLUNTEER') return matchesSearch && (n.type === 'VolunteerRegistration' || n.role === 'Volunteer');
    if (filterType === 'CITIZEN') return matchesSearch && (n.type === 'CitizenRegistration' || n.role === 'Citizen');
    return matchesSearch;
  });

  const unreadCount = safeList.filter(n => !n.isRead).length;
  const volunteerCount = safeList.filter(n => n.type === 'VolunteerRegistration' || n.role === 'Volunteer').length;
  const citizenCount = safeList.filter(n => n.type === 'CitizenRegistration' || n.role === 'Citizen').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & KPI Metrics */}
      <div className="adm-ss-kpi-row">
        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-rose-soft">
            <Bell size={22} className="text-rose-600" />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Unread Notifications</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{unreadCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-red">Awaiting review</span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-purple-soft">
            <HeartHandshake size={22} className="text-purple-600" />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Volunteer Signups</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{volunteerCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-blue">Field personnel intake</span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-blue-soft">
            <Users size={22} className="text-blue-600" />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Citizen Registrations</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{citizenCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-green">Displaced beneficiaries</span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-green-soft">
            <ShieldCheck size={22} className="text-emerald-600" />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Total Activity Events</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{safeList.length}</span>
            </div>
            <span className="adm-ss-kpi-trend text-slate">Persisted across sessions</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({safeList.length})
          </button>
          <button
            onClick={() => setFilterType('UNREAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition ${
              filterType === 'UNREAD'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType('VOLUNTEER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition ${
              filterType === 'VOLUNTEER'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Volunteers ({volunteerCount})
          </button>
          <button
            onClick={() => setFilterType('CITIZEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition ${
              filterType === 'CITIZEN'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Citizens ({citizenCount})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition"
            >
              <CheckCheck size={14} className="text-emerald-600" />
              <span>Mark All Read</span>
            </button>
          )}
          <button
            onClick={loadNotifications}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 3. Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && filteredList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <RefreshCw size={24} className="animate-spin text-slate-400 mx-auto mb-2" />
            Loading persistent registration notifications...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            No registration notifications matching your current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((notif) => {
              const isVol = notif.type === 'VolunteerRegistration' || notif.role === 'Volunteer';
              return (
                <div
                  key={notif.id}
                  onClick={() => handleOpenDetails(notif)}
                  className={`p-4 transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 ${
                    !notif.isRead ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isVol
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {isVol ? <HeartHandshake size={20} /> : <Users size={20} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            UNREAD
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isVol
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isVol ? 'Field Volunteer' : 'Citizen / Displaced'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 mb-1 line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {notif.userEmail}
                        </span>
                        {notif.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {notif.phoneNumber}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-semibold border border-slate-200 flex items-center gap-1 cursor-pointer transition"
                        title="Mark as Read"
                      >
                        <Check size={13} />
                        <span>Read</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenDetails(notif)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                    >
                      <ShieldCheck size={13} />
                      <span>Inspect Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Registration Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedNotification.type === 'VolunteerRegistration' || selectedNotification.role === 'Volunteer'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {selectedNotification.type === 'VolunteerRegistration' || selectedNotification.role === 'Volunteer' ? (
                    <HeartHandshake size={22} />
                  ) : (
                    <Users size={22} />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 m-0">
                    User Registration Details
                  </h4>
                  <p className="text-xs text-slate-500 m-0 mt-0.5">
                    Live credential verification from authoritative database records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {loadingDetails ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-slate-400" />
                  Retrieving user profile from database...
                </div>
              ) : registrationDetails ? (
                <>
                  {/* Status Banner */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      registrationDetails.isVolunteer
                        ? 'bg-purple-50/50 border-purple-200 text-purple-900'
                        : 'bg-blue-50/50 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-slate-700" />
                      <span className="text-xs font-semibold">
                        Role: {registrationDetails.role} &bull; Account Status: {registrationDetails.accountStatus}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        registrationDetails.verificationStatus.includes('Verified')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {registrationDetails.verificationStatus}
                    </span>
                  </div>

                  {/* Core User Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Full Legal Name
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {registrationDetails.fullName}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address
                      </div>
                      <div className="text-sm font-semibold text-slate-800 break-all">
                        {registrationDetails.email}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Contact Phone
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {registrationDetails.phoneNumber || 'Not provided'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Registration Date
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {registrationDetails.registrationDate
                          ? new Date(registrationDetails.registrationDate).toLocaleString()
                          : 'Recent'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Assigned District / Area
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {registrationDetails.location || 'Western Province (Default)'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Unique System ID
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 break-all">
                        {registrationDetails.userId}
                      </div>
                    </div>
                  </div>

                  {/* FIELD VOLUNTEER SPECIFIC SECTION */}
                  {registrationDetails.isVolunteer && (
                    <div className="p-4 rounded-xl bg-purple-50/30 border border-purple-200 space-y-3">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                        <HeartHandshake size={16} />
                        <span>Field Volunteer Qualifications & Capacity</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white border border-purple-100">
                          <span className="text-[10px] font-semibold text-purple-600 uppercase block mb-0.5">
                            Skills & Capabilities
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {registrationDetails.skills || 'Emergency Response, First Aid'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-purple-100">
                          <span className="text-[10px] font-semibold text-purple-600 uppercase block mb-0.5">
                            Availability
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {registrationDetails.availability || 'Immediate / On-Call'}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-purple-100">
                          <span className="text-[10px] font-semibold text-purple-600 uppercase block mb-0.5">
                            Max Travel Distance
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {registrationDetails.maxTravelDistance ? `${registrationDetails.maxTravelDistance} km` : '25 km radius'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CITIZEN NOTICE (Notice: volunteer actions strictly hidden) */}
                  {!registrationDetails.isVolunteer && (
                    <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-blue-600" />
                      <span>
                        This citizen account has access to high-ground shelter directory, emergency ration vouchers, and relief request dispatch.
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  User registration details unavailable.
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {/* Volunteer Verification Action - strictly only shown for Field Volunteers */}
                {registrationDetails?.isVolunteer && !registrationDetails.verificationStatus.includes('Verified') && (
                  <button
                    onClick={() => handleVerifyVolunteer(registrationDetails.userId)}
                    disabled={verifyingVolunteer}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                  >
                    <ShieldCheck size={15} />
                    <span>{verifyingVolunteer ? 'Verifying...' : 'Verify Volunteer & Activate'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsView;
