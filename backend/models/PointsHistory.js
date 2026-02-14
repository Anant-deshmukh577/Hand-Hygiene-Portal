import mongoose from 'mongoose';

const pointsHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['earned', 'spent', 'bonus', 'deduction'],
      required: true,
    },
    source: {
      type: String,
      enum: ['observation', 'reward', 'badge', 'admin', 'other'],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'sourceModel',
    },
    sourceModel: {
      type: String,
      enum: ['Observation', 'UserReward', 'UserBadge'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
pointsHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('PointsHistory', pointsHistorySchema);