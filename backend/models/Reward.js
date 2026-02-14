import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      default: '🎁',
    },
    pointsRequired: {
      type: Number,
      required: [true, 'Points required is required'],
      min: [1, 'Points must be at least 1'],
    },
    category: {
      type: String,
      enum: ['voucher', 'time_off', 'gift', 'training', 'parking', 'other'],
      default: 'other',
    },
    quantity: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    claimedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Check if reward is available
rewardSchema.methods.isAvailable = function () {
  if (!this.isActive) return false;
  if (this.quantity !== -1 && this.claimedCount >= this.quantity) return false;
  if (this.validUntil && new Date() > this.validUntil) return false;
  return true;
};

export default mongoose.model('Reward', rewardSchema);