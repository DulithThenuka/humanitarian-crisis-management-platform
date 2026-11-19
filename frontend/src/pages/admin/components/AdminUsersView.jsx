import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Unlock,
  Key,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { adminService } from '../../../services/adminService';

const SYSTEM_ROLES = [
  'Admin',
  'Coordinator',
  'LogisticsManager',
  'Volunteer',
  'Citizen',
  'CaseManager',
  'ShelterManager'
];

export const AdminUsersView = ({
  users = [],
  setUsers,
  loadData,
  loading = false,
  showToast,
  currentUser,
  onUserCountChange
}) => {
  // Self-managed state when props are not provided or empty
  const [internalUsers, setInternalUsers] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [roleModal, setRoleModal] = useState({ isOpen: false, user: null, newRole: 'Coordinator' });
  const [resetModal, setResetModal] = useState({ isOpen: false, user: null, newPassword: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: '', title: '' });

  // Form state for Create
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    assignedDistrict: 'Western Province / Colombo',
    role: 'Coordinator'
  });
  const [createError, setCreateError] = useState('');

  // Form state for Edit
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    assignedDistrict: '',
    role: 'Coordinator',
    isActive: true
  });
  const [editError, setEditError] = useState('');

  // Fetch users directly if parent didn't supply them or if reload is triggered
  const fetchUsers = async () => {
    setInternalLoading(true);
    setFetchError(null);
    try {
      const res = await adminService.getUsers({
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        search: searchQuery?.trim() || undefined
      });
      let list = [];
      if (res?.succeeded && Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res)) {
        list = res;
      }
      setInternalUsers(list);
      if (typeof setUsers === 'function') {
        setUsers(list);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setFetchError('Failed to load user accounts from the authentication server.');
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    // If external users array is empty or not passed, fetch directly
    if (!Array.isArray(users) || users.length === 0) {
      fetchUsers();
    }
  }, [roleFilter]);

  // Safe updater that updates both parent (if available) and internal state
  const updateUsersList = (updater) => {
    if (typeof setUsers === 'function') {
      setUsers(updater);
    }
    setInternalUsers((prev) => {
      const base = Array.isArray(users) && users.length > 0 ? users : prev;
      const next = typeof updater === 'function' ? updater(base) : updater;
      return Array.isArray(next) ? next : base;
    });
  };

  // Safe effective user array and loading state
  const rawUsers = Array.isArray(users) && users.length > 0 ? users : internalUsers;
  const safeUsers = Array.isArray(rawUsers) ? rawUsers : [];
  const isLoading = Boolean(loading || internalLoading);

  // Filter users safely
  const filteredUsers = safeUsers.filter((u) => {
    if (!u) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.assignedDistrict && u.assignedDistrict.toLowerCase().includes(q));

    const roleStr = (u.role || '').toString();
    const matchesRole = roleFilter === 'ALL' || roleStr === roleFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && Boolean(u.isActive)) ||
      (statusFilter === 'INACTIVE' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // KPI statistics safely calculated
  const totalCount = safeUsers.length;
  const activeCount = safeUsers.filter((u) => u && u.isActive).length;
  const adminCount = safeUsers.filter((u) => u && u.role && u.role.toString().toLowerCase().includes('admin')).length;
  const coordinatorCount = safeUsers.filter((u) => u && u.role && u.role.toString().toLowerCase().includes('coordinator')).length;

  const handleReload = () => {
    if (typeof loadData === 'function') {
      loadData();
    } else {
      fetchUsers();
    }
  };

  // Actions
  const handleToggleStatus = (user) => {
    setConfirmModal({
      isOpen: true,
      title: user.isActive ? 'Deactivate Account' : 'Activate Account',
      message: `Are you sure you want to ${user.isActive ? 'lock and deactivate' : 'unlock and activate'} the account for ${user.fullName}?`,
      action: async () => {
        try {
          const res = await adminService.updateUserStatus(user.id, !user.isActive);
          if (res?.succeeded !== false) {
            updateUsersList((prev) =>
              (Array.isArray(prev) ? prev : []).map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
            );
            if (showToast) showToast(`Account for ${user.fullName} ${!user.isActive ? 'activated' : 'deactivated'}.`);
          } else {
            if (showToast) showToast(res?.errors?.[0] || 'Failed to update account status.', 'error');
          }
        } catch {
          if (showToast) showToast('Failed to communicate with authentication service.', 'error');
        }
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password) {
      setCreateError('Full Name, Email and Password are required.');
      return;
    }
    try {
      const res = await adminService.createUser({
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        phoneNumber: createForm.phoneNumber?.trim() || null,
        assignedDistrict: createForm.assignedDistrict?.trim() || null,
        role: createForm.role
      });
      if (res?.succeeded && res.data) {
        updateUsersList((prev) => [res.data, ...(Array.isArray(prev) ? prev : [])]);
        if (typeof onUserCountChange === 'function') {
          onUserCountChange(1);
        }
        if (showToast) showToast(`User ${res.data.fullName} registered successfully.`);
        setIsCreateModalOpen(false);
        setCreateForm({
          fullName: '',
          email: '',
          password: '',
          phoneNumber: '',
          assignedDistrict: 'Western Province / Colombo',
          role: 'Coordinator'
        });
      } else {
        setCreateError(res?.errors?.[0] || 'Unable to register user.');
      }
    } catch (err) {
      setCreateError(err?.message || 'Error occurred while saving new account.');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      assignedDistrict: user.assignedDistrict || '',
      role: user.role?.toString() || 'Coordinator',
      isActive: Boolean(user.isActive)
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    if (!selectedUser) return;
    try {
      const res = await adminService.updateUser(selectedUser.id, editForm);
      if (res?.succeeded && res.data) {
        updateUsersList((prev) =>
          (Array.isArray(prev) ? prev : []).map((u) => (u.id === selectedUser.id ? { ...u, ...res.data } : u))
        );
        if (showToast) showToast(`User ${editForm.fullName} updated successfully.`);
        setIsEditModalOpen(false);
        setSelectedUser(null);
      } else {
        setEditError(res?.errors?.[0] || 'Failed to update user.');
      }
    } catch (err) {
      setEditError(err?.message || 'Error updating user.');
    }
  };

  const handleRoleChangeSubmit = async () => {
    if (!roleModal.user) return;
    try {
      const res = await adminService.updateUserRole(roleModal.user.id, roleModal.newRole);
      if (res?.succeeded !== false) {
        updateUsersList((prev) =>
          (Array.isArray(prev) ? prev : []).map((u) => (u.id === roleModal.user.id ? { ...u, role: roleModal.newRole } : u))
        );
        if (showToast) showToast(`Role for ${roleModal.user.fullName} changed to ${roleModal.newRole}.`);
        setRoleModal({ isOpen: false, user: null, newRole: 'Coordinator' });
      } else {
        if (showToast) showToast(res?.errors?.[0] || 'Failed to change role.', 'error');
      }
    } catch {
      if (showToast) showToast('Error changing user role.', 'error');
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!resetModal.user || !resetModal.newPassword) return;
    try {
      const res = await adminService.resetPassword(resetModal.user.id, resetModal.newPassword);
      if (res?.succeeded !== false) {
        if (showToast) showToast(`Password for ${resetModal.user.fullName} reset successfully.`);
        setResetModal({ isOpen: false, user: null, newPassword: '' });
      } else {
        if (showToast) showToast(res?.errors?.[0] || 'Failed to reset password.', 'error');
      }
    } catch {
      if (showToast) showToast('Error resetting password.', 'error');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetModal((prev) => ({ ...prev, newPassword: pwd }));
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Row for Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-blue-50 text-blue-600">
            <Users size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Total System Accounts</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{totalCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-green-600 font-medium text-[11px]">
              {activeCount} Active / {totalCount - activeCount} Locked
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-purple-50 text-purple-600">
            <Shield size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">National Command Admins</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{adminCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-purple-600 font-medium text-[11px]">
              Full System Clearance
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-card">
          <div className="adm-ss-kpi-icon-box bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div className="adm-ss-kpi-content">
            <span className="adm-ss-kpi-label">Field Coordinators</span>
            <div className="adm-ss-kpi-val-row">
              <span className="adm-ss-kpi-number">{coordinatorCount}</span>
            </div>
            <span className="adm-ss-kpi-trend text-emerald-600 font-medium text-[11px]">
              District Emergency Hubs
            </span>
          </div>
        </div>

        <div className="adm-ss-kpi-action-col flex items-center justify-center p-4 adm-ss-card bg-[#0e7490]/5 border border-[#0e7490]/20">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#0e7490] hover:bg-[#0b5f75] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Plus size={16} />
            <span>Register New Operational User</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="adm-ss-card p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, district..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              {SYSTEM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              className="py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="INACTIVE">Deactivated Accounts</option>
            </select>
          </div>

          <button
            onClick={handleReload}
            disabled={isLoading}
            className="adm-ss-btn-reset flex items-center gap-1.5 self-end md:self-auto cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Reload Accounts</span>
          </button>
        </div>
      </div>

      {/* 3. User Accounts Table */}
      <div className="adm-ss-card overflow-hidden">
        <div className="adm-ss-card-header">
          <div>
            <h3 className="adm-ss-card-title">User Accounts & Role Permissions Matrix</h3>
            <p className="adm-ss-card-subtitle">
              Authorized credentials, operational district allocations, and system access boundaries
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredUsers.length} of {totalCount} Users
          </span>
        </div>

        {fetchError && (
          <div className="mx-5 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={handleReload}
              className="px-2.5 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold border-0 cursor-pointer transition text-xs"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="adm-ss-table w-full">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Email Address</th>
                <th>Security Role</th>
                <th>Assigned District</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && safeUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#0e7490]" />
                      <span className="font-semibold text-slate-700">Loading authenticated user directory...</span>
                      <span className="text-slate-400">Querying platform security identity store</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const roleStr = u.role?.toString() || 'Citizen';
                  const isCurrent = currentUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                            {u.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">
                              {u.fullName} {isCurrent && <span className="text-[#0e7490] font-normal">(You)</span>}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {u.phoneNumber || 'No phone recorded'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-slate-700 font-mono">{u.email}</td>
                      <td>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            roleStr.includes('Admin')
                              ? 'bg-purple-100 text-purple-700'
                              : roleStr.includes('Coordinator')
                              ? 'bg-blue-100 text-blue-700'
                              : roleStr.includes('Logistics')
                              ? 'bg-amber-100 text-amber-700'
                              : roleStr.includes('Volunteer')
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {roleStr}
                        </span>
                      </td>
                      <td className="text-xs text-slate-600">
                        {u.assignedDistrict || 'Unassigned / HQ'}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          {u.isActive ? 'Active' : 'Locked'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                            title="Edit Profile"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => setRoleModal({ isOpen: true, user: u, newRole: roleStr })}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-purple-600 hover:text-purple-800 transition"
                            title="Assign Role"
                          >
                            <Shield size={14} />
                          </button>

                          <button
                            onClick={() => setResetModal({ isOpen: true, user: u, newPassword: '' })}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-amber-600 hover:text-amber-800 transition"
                            title="Reset Password"
                          >
                            <Key size={14} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-md transition ${
                              isCurrent
                                ? 'opacity-30 cursor-not-allowed text-slate-400'
                                : u.isActive
                                ? 'hover:bg-rose-50 text-rose-600'
                                : 'hover:bg-emerald-50 text-emerald-600'
                            }`}
                            title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {u.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={24} className="text-slate-300" />
                      <span className="font-semibold text-slate-700">No user accounts found</span>
                      <span className="text-slate-400 text-[11px]">
                        {searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL'
                          ? 'No users match your active filter criteria.'
                          : 'No user accounts recorded in the database.'}
                      </span>
                      {(searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('ALL');
                            setStatusFilter('ALL');
                          }}
                          className="mt-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs border-0 cursor-pointer transition"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-scale">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e7490]/10 text-[#0e7490] flex items-center justify-center font-bold">
                  <Plus size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Register New User</h4>
                  <span className="text-[11px] text-slate-500">Provide official details and assign operational role</span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              {createError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Wickramasinghe"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ruwan.w@reliefcore.lk"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Temporary Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={createForm.phoneNumber}
                    onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned District</label>
                  <input
                    type="text"
                    placeholder="e.g. Western Province / Colombo"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={createForm.assignedDistrict}
                    onChange={(e) => setCreateForm({ ...createForm, assignedDistrict: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Operational Role *</label>
                  <select
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white text-slate-700"
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                  >
                    {SYSTEM_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0e7490] hover:bg-[#0b5f75] text-white font-semibold flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-scale">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e7490]/10 text-[#0e7490] flex items-center justify-center font-bold">
                  <Edit size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Edit User Details</h4>
                  <span className="text-[11px] text-slate-500">{selectedUser.fullName}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              {editError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned District</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490]"
                    value={editForm.assignedDistrict}
                    onChange={(e) => setEditForm({ ...editForm, assignedDistrict: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0e7490] hover:bg-[#0b5f75] text-white font-semibold flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Assign Role Modal */}
      {roleModal.isOpen && roleModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 animate-fade-scale text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Change Security Role</h4>
              <button
                onClick={() => setRoleModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-slate-600">
              Select new role and access level for <strong>{roleModal.user.fullName}</strong>:
            </p>

            <select
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] bg-white font-medium"
              value={roleModal.newRole}
              onChange={(e) => setRoleModal({ ...roleModal, newRole: e.target.value })}
            >
              {SYSTEM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setRoleModal({ isOpen: false, user: null, newRole: 'Coordinator' })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeSubmit}
                className="px-4 py-1.5 rounded-lg bg-[#0e7490] text-white font-semibold"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Reset Password Modal */}
      {resetModal.isOpen && resetModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 animate-fade-scale text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Reset User Password</h4>
              <button
                onClick={() => setResetModal({ isOpen: false, user: null, newPassword: '' })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-slate-600">
              Set new password for <strong>{resetModal.user.fullName}</strong> ({resetModal.user.email}):
            </p>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">New Password</label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-[#0e7490] hover:underline text-[11px] font-medium"
                >
                  Generate Strong
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter or generate password"
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0e7490] font-mono text-xs"
                value={resetModal.newPassword}
                onChange={(e) => setResetModal({ ...resetModal, newPassword: e.target.value })}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setResetModal({ isOpen: false, user: null, newPassword: '' })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPasswordSubmit}
                disabled={!resetModal.newPassword}
                className="px-4 py-1.5 rounded-lg bg-[#0e7490] text-white font-semibold disabled:opacity-50"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 animate-fade-scale text-xs">
            <h4 className="font-bold text-sm text-slate-900">{confirmModal.title}</h4>
            <p className="text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmModal({ isOpen: false, action: null, message: '', title: '' })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.action) confirmModal.action();
                  setConfirmModal({ isOpen: false, action: null, message: '', title: '' });
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersView;
