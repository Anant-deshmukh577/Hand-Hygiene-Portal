import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { userService } from '../../services/userService';
import UserManagement from '../../components/admin/UserManagement';
import AddUserForm from '../../components/admin/AddUserForm';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader, { PageLoader } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ManageUsers = () => {
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await userService.getAllUsers({ limit: 100 });
      const fetchedUsers = (response.users || []).map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department || 'Not Assigned',
        designation: user.designation || 'Staff',
        role: user.role,
        isActive: user.isActive !== false,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      showError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchUsers(true);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    setProcessing(true);
    try {
      await userService.updateUserRole(selectedUser.id, newRole);
      
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      showSuccess(`User role updated to ${newRole} successfully!`);
      handleCloseModal();
    } catch (error) {
      showError(error.message || 'Failed to update user role');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const action = user.isActive ? 'deactivate' : 'activate';
    const confirmToggle = window.confirm(
      `Are you sure you want to ${action} ${user.name}? ${
        user.isActive ? 'They will not be able to login.' : 'They will be able to login again.'
      }`
    );

    if (confirmToggle) {
      try {
        await userService.toggleUserStatus(userId);
        
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
        
        showSuccess(`User ${action}d successfully!`);
      } catch (error) {
        showError(error.message || `Failed to ${action} user`);
      }
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find(u => u.id === userId);
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${user?.name}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        showSuccess('User deleted successfully');
      } catch (error) {
        showError(error.message || 'Failed to delete user');
      }
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers([
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department || 'Not Assigned',
        designation: newUser.designation || 'Staff',
        role: newUser.role,
        isActive: newUser.isActive !== false,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      },
      ...users,
    ]);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    auditors: users.filter(u => u.role === 'auditor').length,
    staff: users.filter(u => u.role === 'staff').length,
  };

  const roleOptions = [
    { value: 'staff', label: 'Staff' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'admin', label: 'Admin' },
  ];

  const getRoleConfig = (role) => {
    const configs = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👑' },
      auditor: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '👁️' },
      staff: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '👤' },
    };
    return configs[role] || configs.staff;
  };

  if (loading) {
    return <PageLoader text="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <UsersIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Users
                  </h1>
                </div>
                <p className="text-gray-500">
                  Add, edit, and manage user accounts
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5
                  bg-white border border-gray-200 rounded-xl
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Add User</span>
              </button>

              {/* Admin Badge */}
              <Badge variant="primary" size="medium">
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                <p className="text-xs text-gray-500">Inactive</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <ShieldIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
                <p className="text-xs text-gray-500">Admins</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.auditors}</p>
                <p className="text-xs text-gray-500">Auditors</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{stats.staff}</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="auditor">Auditors</option>
                  <option value="staff">Staff</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filteredUsers.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{users.length}</span> users
              </p>
              {(searchQuery || filterRole !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRole('all');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* User Management Component */}
          <div className="p-6">
            <UserManagement
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>

        {/* Add User Modal */}
        <AddUserForm
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={handleUserAdded}
        />

        {/* Edit Role Modal */}
        {showEditModal && selectedUser && (
          <Modal
            isOpen={showEditModal}
            onClose={handleCloseModal}
            title="Change User Role"
          >
            <div className="p-6">
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-md overflow-hidden">
                    {selectedUser.avatar ? (
                      <img 
                        src={selectedUser.avatar} 
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate" title={selectedUser.name}>
                      {selectedUser.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
                      <MailIcon className="flex-shrink-0" />
                      <span className="truncate" title={selectedUser.email}>{selectedUser.email}</span>
                    </div>
                  </div>

                  {/* Current Role Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleConfig(selectedUser.role).bg} ${getRoleConfig(selectedUser.role).text}`}>
                    {getRoleConfig(selectedUser.role).icon} {selectedUser.role}
                  </div>
                </div>
              </div>

              {/* Role Select */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <div className="relative">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Role Description */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    {newRole === 'admin' && '👑 Full access to all features including user management and system settings.'}
                    {newRole === 'auditor' && '👁️ Can record observations and view reports for assigned wards.'}
                    {newRole === 'staff' && '👤 Basic access to view personal stats and compliance data.'}
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <ExclamationIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Important Notice</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Role changes take effect immediately. The user will have access to features based on their new role.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={processing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleRoleChange}
                  disabled={processing || newRole === selectedUser.role}
                  className={`
                    flex-1 inline-flex items-center justify-center gap-2
                    px-6 py-3 
                    bg-blue-600 hover:bg-blue-700 
                    text-white font-semibold rounded-xl
                    shadow-lg shadow-blue-600/25 
                    hover:shadow-xl hover:shadow-blue-600/30
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
                  `}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon />
                      Update Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Help Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">User Management Guide</h3>
                <p className="text-sm text-blue-700">
                  <strong>Admins</strong> have full system access. <strong>Auditors</strong> can record and manage observations. <strong>Staff</strong> can view their own compliance data and participate in gamification.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 transition-colors">
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageUsers;