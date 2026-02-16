import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const GiftIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
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

const StarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TagIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

const EmojiIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

// Common emoji options for rewards
const emojiOptions = ['🎁', '🏆', '⭐', '🎖️', '🥇', '🎯', '💎', '👑', '🌟', '🎉', '🏅', '💫'];

const RewardManagement = ({ rewards = [], onAdd, onEdit, onDelete, loading = false }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    pointsRequired: '',
    icon: '🎁',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newReward.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!newReward.pointsRequired || parseInt(newReward.pointsRequired) <= 0) {
      newErrors.pointsRequired = 'Valid points required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      onAdd({
        ...newReward,
        pointsRequired: parseInt(newReward.pointsRequired),
      });
      setNewReward({ title: '', description: '', pointsRequired: '', icon: '🎁' });
      setIsAddingNew(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setNewReward({ title: '', description: '', pointsRequired: '', icon: '🎁' });
    setErrors({});
  };

  const handleEditClick = (reward) => {
    setEditingReward({
      id: reward.id || reward._id,
      title: reward.title,
      description: reward.description || '',
      pointsRequired: reward.pointsRequired,
      icon: reward.icon || '🎁',
    });
    setIsEditing(true);
    setErrors({});
  };

  const handleUpdate = () => {
    if (validateEditForm()) {
      onEdit({
        ...editingReward,
        pointsRequired: parseInt(editingReward.pointsRequired),
      });
      setIsEditing(false);
      setEditingReward(null);
      setErrors({});
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReward(null);
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editingReward.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!editingReward.pointsRequired || parseInt(editingReward.pointsRequired) <= 0) {
      newErrors.pointsRequired = 'Valid points required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      
      {/* ==================== HEADER SECTION ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reward Management</h2>
          <p className="text-gray-500 mt-1">Create and manage rewards for staff members</p>
        </div>
        
        {!isAddingNew && !isEditing && (
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
            Add New Reward
          </button>
        )}
      </div>

      {/* ==================== ADD NEW REWARD FORM ==================== */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
          
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <SparklesIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Reward</h3>
                <p className="text-sm text-gray-500">Create a new reward for staff to claim</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Choose Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewReward(prev => ({ ...prev, icon: emoji }))}
                    className={`
                      w-12 h-12 rounded-xl text-2xl
                      flex items-center justify-center
                      border-2 transition-all duration-200
                      ${newReward.icon === emoji
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20 scale-110'
                        : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/50'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reward Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <TagIcon />
                </div>
                <input
                  type="text"
                  placeholder="e.g., Coffee Voucher, Extra Break Time"
                  value={newReward.title}
                  onChange={(e) => {
                    setNewReward(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`
                    w-full pl-12 pr-4 py-3
                    bg-white border rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-all duration-200
                    ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                />
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XIcon className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the reward and how to redeem it..."
                value={newReward.description}
                onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
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

            {/* Points Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Points Required <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <StarIcon />
                </div>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  min="1"
                  value={newReward.pointsRequired}
                  onChange={(e) => {
                    setNewReward(prev => ({ ...prev, pointsRequired: e.target.value }));
                    if (errors.pointsRequired) setErrors(prev => ({ ...prev, pointsRequired: '' }));
                  }}
                  className={`
                    w-full pl-12 pr-4 py-3
                    bg-white border rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                    transition-all duration-200
                    ${errors.pointsRequired ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">points</span>
                </div>
              </div>
              {errors.pointsRequired && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XIcon className="h-4 w-4" />
                  {errors.pointsRequired}
                </p>
              )}
            </div>

            {/* Preview Card */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
                  {newReward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {newReward.title || 'Reward Title'}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {newReward.description || 'Reward description will appear here'}
                  </p>
                  <p className="text-amber-600 font-bold mt-1">
                    {newReward.pointsRequired || '0'} points
                  </p>
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
                Add Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT REWARD FORM ==================== */}
      {isEditing && editingReward && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
          
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <PencilIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Reward</h3>
                <p className="text-sm text-gray-500">Update reward details</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Choose Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setEditingReward(prev => ({ ...prev, icon: emoji }))}
                    className={`
                      w-12 h-12 rounded-xl text-2xl
                      flex items-center justify-center
                      border-2 transition-all duration-200
                      ${editingReward.icon === emoji
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 scale-110'
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reward Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <TagIcon />
                </div>
                <input
                  type="text"
                  placeholder="e.g., Coffee Voucher, Extra Break Time"
                  value={editingReward.title}
                  onChange={(e) => {
                    setEditingReward(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`
                    w-full pl-12 pr-4 py-3
                    bg-white border rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                    ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                />
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XIcon className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the reward and how to redeem it..."
                value={editingReward.description}
                onChange={(e) => setEditingReward(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="
                  w-full px-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                  resize-none
                "
              />
            </div>

            {/* Points Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Points Required <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <StarIcon />
                </div>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  min="1"
                  value={editingReward.pointsRequired}
                  onChange={(e) => {
                    setEditingReward(prev => ({ ...prev, pointsRequired: e.target.value }));
                    if (errors.pointsRequired) setErrors(prev => ({ ...prev, pointsRequired: '' }));
                  }}
                  className={`
                    w-full pl-12 pr-4 py-3
                    bg-white border rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                    ${errors.pointsRequired ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">points</span>
                </div>
              </div>
              {errors.pointsRequired && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XIcon className="h-4 w-4" />
                  {errors.pointsRequired}
                </p>
              )}
            </div>

            {/* Preview Card */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
                  {editingReward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {editingReward.title || 'Reward Title'}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {editingReward.description || 'Reward description will appear here'}
                  </p>
                  <p className="text-amber-600 font-bold mt-1">
                    {editingReward.pointsRequired || '0'} points
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleCancelEdit}
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
                onClick={handleUpdate}
                disabled={loading}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-3
                  bg-blue-600 hover:bg-blue-700
                  text-white font-semibold
                  rounded-xl
                  shadow-lg shadow-blue-600/25
                  hover:shadow-xl hover:shadow-blue-600/30
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <CheckIcon />
                Update Reward
              </button>
            </div>
          </div>
        </div>
      )}
      {rewards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id || reward._id}
              className="
                group bg-white rounded-2xl border border-gray-100
                shadow-lg shadow-black/5
                hover:shadow-xl hover:shadow-black/10
                hover:border-teal-200 hover:-translate-y-1
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* Card Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-5xl shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                    {reward.icon || '🎁'}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2 line-clamp-1">
                  {reward.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2 min-h-[40px]">
                  {reward.description || 'No description available'}
                </p>

                {/* Points Badge */}
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
                    <StarIcon className="h-4 w-4 text-amber-600" />
                    <span className="text-lg font-bold text-amber-600">
                      {reward.pointsRequired}
                    </span>
                    <span className="text-sm text-amber-600/70">points</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <UsersIcon />
                  <span>Claimed {reward.claimedCount || 0} times</span>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-4">
                  <Badge 
                    variant={reward.isActive !== false ? 'success' : 'secondary'} 
                    size="small"
                  >
                    {reward.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(reward)}
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
                    onClick={() => onDelete(reward.id || reward._id)}
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

              {/* Hover Gradient Line */}
              <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== EMPTY STATE ==================== */}
      {rewards.length === 0 && !isAddingNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
              <InboxIcon className="text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Rewards Available
            </h3>

            {/* Description */}
            <p className="text-gray-500 max-w-md mb-6">
              Create your first reward to motivate staff members. Rewards can be claimed using points earned through hand hygiene compliance.
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
              Create First Reward
            </button>
          </div>
        </div>
      )}

      {/* ==================== STATS SUMMARY (Optional) ==================== */}
      {rewards.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">Rewards Summary</h4>
            <Badge variant="primary">{rewards.length} Total</Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-teal-600 mb-1">
                {rewards.length}
              </p>
              <p className="text-sm text-gray-500">Total Rewards</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">
                {rewards.filter(r => r.isActive !== false).length}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-amber-600 mb-1">
                {rewards.reduce((sum, r) => sum + (r.claimedCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Claims</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {rewards.length > 0 
                  ? Math.round(rewards.reduce((sum, r) => sum + r.pointsRequired, 0) / rewards.length)
                  : 0
                }
              </p>
              <p className="text-sm text-gray-500">Avg. Points</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardManagement;