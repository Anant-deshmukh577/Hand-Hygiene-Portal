import { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';

/* --- SVG Icons --- */
const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GiftIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const RefundIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const PendingRewardsApproval = ({ pendingRewards = [], onApprove, onReject, loading }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleOpenModal = (reward, type) => {
    setSelectedReward(reward);
    setModalType(type);
    setNotes('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReward(null);
    setNotes('');
    setModalType('');
  };

  const handleConfirm = async () => {
    if (!selectedReward) return;

    setProcessing(true);
    try {
      if (modalType === 'approve') {
        await onApprove(selectedReward._id, notes);
      } else {
        await onReject(selectedReward._id, notes);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error processing reward:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-teal-600 mb-4">
            <LoaderIcon />
          </div>
          <p className="text-gray-500 font-medium">Loading pending rewards...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (pendingRewards.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
            <CheckCircleIcon className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 max-w-sm">
            No pending reward approvals at the moment. Check back later for new requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==================== HEADER BADGE ==================== */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl shadow-md shadow-amber-500/10">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-amber-700 font-semibold text-sm">
            {pendingRewards.length} Pending Approval{pendingRewards.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ==================== REWARDS LIST ==================== */}
      <div className="space-y-4">
        {pendingRewards.map((userReward) => (
          <div 
            key={userReward._id}
            className="group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 hover:border-teal-200 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                
                {/* Reward Details Section */}
                <div className="flex-1">
                  
                  {/* Reward Header */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* Reward Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 flex-shrink-0">
                      {userReward.reward?.icon || '🎁'}
                    </div>
                    
                    {/* Reward Title & Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {userReward.reward?.title || 'Reward'}
                        </h3>
                        <Badge variant="warning" size="small">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {userReward.reward?.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                    
                    {/* Staff Member */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                          <UserIcon className="h-3.5 w-3.5 text-teal-600" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Staff Member
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate">
                        {userReward.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userReward.user?.email || ''}
                      </p>
                    </div>

                    {/* Department */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BuildingIcon className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Department
                        </span>
                      </div>
                      <p className="font-medium text-gray-900">
                        {userReward.user?.department || 'N/A'}
                      </p>
                    </div>

                    {/* Points Spent */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                          <StarIcon className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Points
                        </span>
                      </div>
                      <p className="text-xl font-bold text-amber-600">
                        {userReward.pointsSpent}
                        <span className="text-sm font-medium text-gray-400 ml-1">pts</span>
                      </p>
                    </div>

                    {/* Claimed On */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                          <CalendarIcon className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Claimed
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(userReward.claimedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col gap-3 lg:min-w-[140px]">
                  <button
                    onClick={() => handleOpenModal(userReward, 'approve')}
                    className="
                      flex-1 lg:flex-none
                      inline-flex items-center justify-center gap-2
                      px-5 py-3
                      bg-green-600 hover:bg-green-700
                      text-white font-semibold
                      rounded-xl
                      shadow-lg shadow-green-600/25
                      hover:shadow-xl hover:shadow-green-600/30
                      transition-all duration-300
                    "
                  >
                    <CheckIcon />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleOpenModal(userReward, 'reject')}
                    className="
                      flex-1 lg:flex-none
                      inline-flex items-center justify-center gap-2
                      px-5 py-3
                      bg-white hover:bg-red-50
                      text-red-600 font-semibold
                      rounded-xl
                      border-2 border-red-200 hover:border-red-300
                      shadow-md shadow-black/5
                      hover:shadow-lg hover:shadow-red-500/10
                      transition-all duration-300
                    "
                  >
                    <XIcon />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Time Indicator Bar */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
          </div>
        ))}
      </div>

      {/* ==================== CONFIRMATION MODAL ==================== */}
      {showModal && selectedReward && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={modalType === 'approve' ? 'Approve Reward' : 'Reject Reward'}
          icon={modalType === 'approve' ? <CheckIcon /> : <XIcon />}
          iconColor={modalType === 'approve' ? 'green' : 'red'}
          size="medium"
        >
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className={`
              p-5 rounded-2xl border
              ${modalType === 'approve' 
                ? 'bg-gradient-to-br from-green-50 to-white border-green-100' 
                : 'bg-gradient-to-br from-red-50 to-white border-red-100'
              }
            `}>
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  shadow-lg
                  ${modalType === 'approve' 
                    ? 'bg-green-100 text-green-600 shadow-green-500/20' 
                    : 'bg-red-100 text-red-600 shadow-red-500/20'
                  }
                `}>
                  {modalType === 'approve' ? <CheckIcon /> : <XIcon />}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold mb-1 ${modalType === 'approve' ? 'text-green-900' : 'text-red-900'}`}>
                    {modalType === 'approve' ? 'Approving Reward' : 'Rejecting Reward'}
                  </h4>
                  <p className="text-sm text-gray-900 font-semibold">
                    {selectedReward.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedReward.reward?.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold
                      ${modalType === 'approve' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }
                    `}>
                      <StarIcon className="h-4 w-4" />
                      {selectedReward.pointsSpent} points
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Warning (for rejection) */}
            {modalType === 'reject' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <RefundIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-900 mb-0.5">Points Will Be Refunded</h5>
                    <p className="text-sm text-amber-700">
                      {selectedReward.pointsSpent} points will be returned to the user's account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Notes {modalType === 'reject' ? <span className="text-red-500">*</span> : <span className="text-gray-400">(Optional)</span>}
              </label>
              <textarea
                className="
                  w-full px-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-200
                  resize-none
                "
                placeholder={`Enter ${modalType === 'approve' ? 'approval' : 'rejection'} notes...`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              {modalType === 'reject' && !notes.trim() && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <ExclamationIcon className="h-3.5 w-3.5" />
                  Please provide a reason for rejection
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                disabled={processing}
                className="
                  flex-1
                  inline-flex items-center justify-center gap-2
                  px-6 py-3
                  bg-white hover:bg-gray-50
                  text-gray-700 font-semibold
                  rounded-xl
                  border border-gray-200
                  shadow-md shadow-black/5
                  hover:shadow-lg hover:shadow-black/10
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing || (modalType === 'reject' && !notes.trim())}
                className={`
                  flex-1
                  inline-flex items-center justify-center gap-2
                  px-6 py-3
                  font-semibold
                  rounded-xl
                  shadow-lg
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${modalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30'
                  }
                `}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {modalType === 'approve' ? <CheckIcon /> : <XIcon />}
                    Confirm {modalType === 'approve' ? 'Approval' : 'Rejection'}
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PendingRewardsApproval;