import { useState } from 'react';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BedIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4m-7 4v4m10-4v4M5 21h14a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

const TagIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const HashtagIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const LocationIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WardManagement = ({ wards = [], onAdd, onEdit, onDelete, loading = false }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newWard, setNewWard] = useState({ 
    name: '', 
    capacity: '',
    floor: '',
    building: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newWard.name.trim()) {
      newErrors.name = 'Ward name is required';
    }
    if (!newWard.capacity || parseInt(newWard.capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      onAdd({
        ...newWard,
        capacity: parseInt(newWard.capacity),
      });
      setNewWard({ name: '', capacity: '', floor: '', building: '', description: '' });
      setIsAddingNew(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setNewWard({ name: '', capacity: '', floor: '', building: '', description: '' });
    setErrors({});
  };

  // Stats calculation
  const stats = {
    total: wards.length,
    totalBeds: wards.reduce((sum, w) => sum + (w.capacity || 0), 0),
    totalObservations: wards.reduce((sum, w) => sum + (w.totalObservations || 0), 0),
    activeWards: wards.filter(w => w.isActive !== false).length,
  };

  // Ward colors based on index
  const getWardColor = (index) => {
    const colors = [
      { bg: 'from-teal-500 to-teal-600', light: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', shadow: 'shadow-teal-500/20' },
      { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', shadow: 'shadow-blue-500/20' },
      { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', shadow: 'shadow-purple-500/20' },
      { bg: 'from-amber-500 to-amber-600', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', shadow: 'shadow-amber-500/20' },
      { bg: 'from-rose-500 to-rose-600', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', shadow: 'shadow-rose-500/20' },
      { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', shadow: 'shadow-indigo-500/20' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">

      {/* ==================== HEADER SECTION ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ward Management</h2>
          <p className="text-gray-500 mt-1">Manage hospital wards and their configurations</p>
        </div>
        
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="
              group inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-teal-600 hover:bg-teal-700
              text-white font-semibold
              rounded-xl
              shadow-lg shadow-teal-600/25
              hover:shadow-xl hover:shadow-teal-600/30
              transition-all duration-300
            "
          >
            <PlusIcon />
            Add New Ward
          </button>
        )}
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
              <BuildingIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Wards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <BedIcon />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBeds}</p>
              <p className="text-xs text-gray-500">Total Beds</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <ClipboardListIcon />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalObservations}</p>
              <p className="text-xs text-gray-500">Observations</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.activeWards}</p>
              <p className="text-xs text-gray-500">Active Wards</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ADD NEW WARD FORM ==================== */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
          
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <BuildingIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Ward</h3>
                <p className="text-sm text-gray-500">Create a new ward in the system</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Ward Name & Capacity Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ward Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ward Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <TagIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., ICU, General Ward A"
                    value={newWard.name}
                    onChange={(e) => {
                      setNewWard(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`
                      w-full pl-12 pr-4 py-3
                      bg-white border rounded-xl
                      text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                    `}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XIcon className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bed Capacity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <BedIcon />
                  </div>
                  <input
                    type="number"
                    placeholder="e.g., 20"
                    min="1"
                    value={newWard.capacity}
                    onChange={(e) => {
                      setNewWard(prev => ({ ...prev, capacity: e.target.value }));
                      if (errors.capacity) setErrors(prev => ({ ...prev, capacity: '' }));
                    }}
                    className={`
                      w-full pl-12 pr-4 py-3
                      bg-white border rounded-xl
                      text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      ${errors.capacity ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                    `}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">beds</span>
                  </div>
                </div>
                {errors.capacity && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <XIcon className="h-4 w-4" />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>

            {/* Floor & Building Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Floor */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Floor <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <HashtagIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., 3rd Floor"
                    value={newWard.floor}
                    onChange={(e) => setNewWard(prev => ({ ...prev, floor: e.target.value }))}
                    className="
                      w-full pl-12 pr-4 py-3
                      bg-white border border-gray-200 rounded-xl
                      text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                    "
                  />
                </div>
              </div>

              {/* Building */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Building <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <LocationIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Main Building"
                    value={newWard.building}
                    onChange={(e) => setNewWard(prev => ({ ...prev, building: e.target.value }))}
                    className="
                      w-full pl-12 pr-4 py-3
                      bg-white border border-gray-200 rounded-xl
                      text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                    "
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                placeholder="Add any additional notes about this ward..."
                value={newWard.description}
                onChange={(e) => setNewWard(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="
                  w-full px-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-200
                  resize-none
                "
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <BuildingIcon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {newWard.name || 'Ward Name'}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BedIcon className="h-4 w-4" />
                      {newWard.capacity || '0'} beds
                    </span>
                    {newWard.floor && (
                      <span className="flex items-center gap-1">
                        <HashtagIcon className="h-4 w-4" />
                        {newWard.floor}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleCancel}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3
                  bg-white hover:bg-gray-50
                  text-gray-700 font-semibold
                  rounded-xl
                  border border-gray-200
                  shadow-md shadow-black/5
                  hover:shadow-lg hover:shadow-black/10
                  transition-all duration-300
                "
              >
                <XIcon />
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={loading}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3
                  bg-teal-600 hover:bg-teal-700
                  text-white font-semibold
                  rounded-xl
                  shadow-lg shadow-teal-600/25
                  hover:shadow-xl hover:shadow-teal-600/30
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <CheckIcon />
                Add Ward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WARDS GRID ==================== */}
      {wards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wards.map((ward, index) => {
            const colors = getWardColor(index);
            return (
              <div
                key={ward.id || ward._id}
                className="
                  group bg-white rounded-2xl border border-gray-100
                  shadow-lg shadow-black/5
                  hover:shadow-xl hover:shadow-black/10
                  hover:border-teal-200 hover:-translate-y-1
                  transition-all duration-300
                  overflow-hidden
                "
              >
                {/* Card Header with Gradient */}
                <div className={`h-2 bg-gradient-to-r ${colors.bg}`}></div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`
                      w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} 
                      flex items-center justify-center 
                      shadow-lg ${colors.shadow}
                      group-hover:scale-110 transition-transform duration-300
                    `}>
                      <BuildingIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                        {ward.name}
                      </h3>
                      <Badge 
                        variant={ward.isActive !== false ? 'success' : 'secondary'} 
                        size="small"
                      >
                        {ward.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Capacity */}
                    <div className={`p-3 rounded-xl ${colors.light} border ${colors.border}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <BedIcon className={`h-4 w-4 ${colors.text}`} />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Beds</span>
                      </div>
                      <p className={`text-xl font-bold ${colors.text}`}>
                        {ward.capacity}
                      </p>
                    </div>

                    {/* Observations */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <ClipboardListIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Obs.</span>
                      </div>
                      <p className="text-xl font-bold text-gray-700">
                        {ward.totalObservations || 0}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(ward.floor || ward.building) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ward.floor && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                          <HashtagIcon className="h-3 w-3" />
                          {ward.floor}
                        </span>
                      )}
                      {ward.building && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                          <LocationIcon className="h-3 w-3" />
                          {ward.building}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {ward.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {ward.description}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(ward)}
                      className="
                        flex-1 inline-flex items-center justify-center gap-2
                        px-4 py-2.5
                        bg-white hover:bg-blue-50
                        text-blue-600 font-medium
                        rounded-xl
                        border border-blue-200 hover:border-blue-300
                        shadow-sm
                        transition-all duration-200
                      "
                    >
                      <PencilIcon />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(ward.id || ward._id)}
                      className="
                        flex-1 inline-flex items-center justify-center gap-2
                        px-4 py-2.5
                        bg-white hover:bg-red-50
                        text-red-600 font-medium
                        rounded-xl
                        border border-red-200 hover:border-red-300
                        shadow-sm
                        transition-all duration-200
                      "
                    >
                      <TrashIcon />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== EMPTY STATE ==================== */}
      {wards.length === 0 && !isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
              <InboxIcon className="text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Wards Available
            </h3>

            {/* Description */}
            <p className="text-gray-500 max-w-md mb-6">
              Start by adding your first ward. Wards help organize observations and track compliance across different hospital areas.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsAddingNew(true)}
              className="
                group inline-flex items-center justify-center gap-2
                px-6 py-3
                bg-teal-600 hover:bg-teal-700
                text-white font-semibold
                rounded-xl
                shadow-lg shadow-teal-600/25
                hover:shadow-xl hover:shadow-teal-600/30
                transition-all duration-300
              "
            >
              <PlusIcon />
              Create First Ward
            </button>
          </div>
        </div>
      )}

      {/* ==================== SUMMARY TABLE ==================== */}
      {wards.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                  <ChartBarIcon />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Wards Overview</h4>
                  <p className="text-sm text-gray-500">Quick summary of all wards</p>
                </div>
              </div>
              <Badge variant="primary">{wards.length} Wards</Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ward</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Observations</th>
                  <th className="px-6 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wards.map((ward, index) => {
                  const colors = getWardColor(index);
                  return (
                    <tr key={ward.id || ward._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow ${colors.shadow}`}>
                            <BuildingIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{ward.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${colors.light} ${colors.text} text-sm font-semibold rounded-lg`}>
                          <BedIcon className="h-4 w-4" />
                          {ward.capacity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700 font-medium">{ward.totalObservations || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={ward.isActive !== false ? 'success' : 'secondary'} size="small">
                          {ward.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardManagement;