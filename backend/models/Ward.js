import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ward name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    department: {
      type: String,
    },
    floor: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

// Generate code before saving if not provided
wardSchema.pre('save', function (next) {
  if (!this.code) {
    this.code = this.name.substring(0, 3).toUpperCase().replace(/\s/g, '');
  }
  next();
});

export default mongoose.model('Ward', wardSchema);