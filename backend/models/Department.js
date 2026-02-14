import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalStaff: {
      type: Number,
      default: 0,
    },
    totalObservations: {
      type: Number,
      default: 0,
    },
    complianceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    averagePoints: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate code before saving if not provided
departmentSchema.pre('save', function (next) {
  if (!this.code) {
    this.code = this.name.substring(0, 3).toUpperCase().replace(/\s/g, '');
  }
  next();
});

export default mongoose.model('Department', departmentSchema);