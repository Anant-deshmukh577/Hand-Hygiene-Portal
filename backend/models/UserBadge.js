import mongoose from 'mongoose';

const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    pointsAtEarning: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate badges
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export default mongoose.model('UserBadge', userBadgeSchema);