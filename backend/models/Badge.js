import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Badge level is required'],
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      unique: true,
    },
    pointsRequired: {
      type: Number,
      required: [true, 'Points required is required'],
      min: [1, 'Points must be at least 1'],
    },
    icon: {
      type: String,
      default: '🏅',
    },
    color: {
      type: String,
      default: '#6c757d',
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Badge', badgeSchema);