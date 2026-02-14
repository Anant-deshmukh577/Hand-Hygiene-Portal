import { useState } from 'react';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ToggleIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const MoreVerticalIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const UserManagement = ({ users = [], onEdit, onDelete, onToggleStatus, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const roleOptions = [
    { value: '', label: 'All Roles', icon: <UsersIcon className="h-4 w-4" /> },
    { value: 'admin', label: 'Admin', icon: <ShieldIcon /> },
    { value: 'auditor', label: 'Auditor', icon: <EyeIcon /> },
    { value: 'staff', label: 'Staff', icon: <UserIcon /> },
  ];

  const getRoleBadgeVariant = (role) => {
    const variants = {
      admin: 'purple',
      auditor: 'info',
      staff: 'primary',
    };
    return variants[role] || 'secondary';
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: <ShieldIcon />,
      auditor: <EyeIcon />,
      staff: <UserIcon />,
    };
    return icons[role] || <UserIcon />;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive !== false).length,
    admins: users.filter(u => u.role === 'admin').length,
    auditors: users.filter(u => u.role === 'auditor').length,
  };

  return (
    <div className="space-y-6">
      
      {/* ==================== HEADER & STATS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <ShieldIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <EyeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.auditors}</p>
              <p className="text-xs text-gray-500">Auditors</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FILTERS ==================== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Search Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3
                  bg-gray-50 border border-gray-200 rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                  transition-all duration-200
                "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div className="sm:w-56">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Filter by Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FilterIcon />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="
                  w-full pl-12 pr-10 py-3
                  bg-gray-50 border border-gray-200 rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                  transition-all duration-200
                  appearance-none cursor-pointer
                "
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filterRole) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-teal-900">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filterRole && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg">
                Role: {filterRole}
                <button onClick={() => setFilterRole('')} className="ml-1 hover:text-teal-900">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={() => { setSearchTerm(''); setFilterRole(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{users.length}</span> users
          </p>
        </div>
      </div>

      {/* ==================== USERS TABLE ==================== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <th 
                  className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    User
                    {sortBy === 'name' && (
                      <svg className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-2">
                    Department
                    {sortBy === 'department' && (
                      <svg className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-2">
                    Role
                    {sortBy === 'role' && (
                      <svg className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <InboxIcon className="text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">No users found</h4>
                      <p className="text-gray-500 max-w-sm">
                        {searchTerm || filterRole 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No users have been added yet'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id || user._id || index}
                    className="group hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`
                          w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold
                          shadow-lg overflow-hidden
                          ${user.role === 'admin' 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/30' 
                            : user.role === 'auditor'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30'
                              : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30'
                          }
                        `}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        
                        {/* Name & Email */}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <MailIcon />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <BuildingIcon />
                        </div>
                        <span className="text-gray-700 font-medium">{user.department || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                            user.role === 'auditor' ? 'bg-blue-100 text-blue-600' :
                            'bg-teal-100 text-teal-600'}
                        `}>
                          {getRoleIcon(user.role)}
                        </div>
                        <Badge variant={getRoleBadgeVariant(user.role)} size="small">
                          {user.role || 'staff'}
                        </Badge>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <Badge 
                        variant={user.isActive !== false ? 'success' : 'secondary'} 
                        size="small"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit(user)}
                          className="
                            inline-flex items-center gap-1.5 px-3 py-2
                            bg-white hover:bg-blue-50
                            text-blue-600 text-sm font-medium
                            rounded-lg border border-blue-200 hover:border-blue-300
                            shadow-sm
                            transition-all duration-200
                          "
                          title="Edit user"
                        >
                          <PencilIcon />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(user.id || user._id)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-2
                            bg-white text-sm font-medium
                            rounded-lg border shadow-sm
                            transition-all duration-200
                            ${user.isActive !== false
                              ? 'hover:bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-300'
                              : 'hover:bg-green-50 text-green-600 border-green-200 hover:border-green-300'
                            }
                          `}
                          title={user.isActive !== false ? 'Deactivate user' : 'Activate user'}
                        >
                          <ToggleIcon />
                          <span className="hidden sm:inline">
                            {user.isActive !== false ? 'Deactivate' : 'Activate'}
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(user.id || user._id)}
                          className="
                            inline-flex items-center gap-1.5 px-3 py-2
                            bg-white hover:bg-red-50
                            text-red-600 text-sm font-medium
                            rounded-lg border border-red-200 hover:border-red-300
                            shadow-sm
                            transition-all duration-200
                          "
                          title="Delete user"
                        >
                          <TrashIcon />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> users
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    px-3 py-1.5 text-sm
                    bg-white border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-teal-500
                    cursor-pointer
                  "
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="department">Department</option>
                  <option value="role">Role</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="
                    p-1.5 rounded-lg border border-gray-200
                    hover:bg-gray-50 transition-colors
                  "
                  title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
                >
                  <svg 
                    className={`h-4 w-4 text-gray-500 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;