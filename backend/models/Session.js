import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    auditorName: {
      type: String,
      required: [true, 'Auditor name is required'],
      trim: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ward: {
      type: String,
      required: [true, 'Ward is required'],
      enum: [
        'ICU',
        'NICU',
        'PICU',
        'OT',
        'General Ward',
        'Private Ward',
        'Emergency',
        'Dialysis',
        'OPD',
      ],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
    totalObservations: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for session's observations
sessionSchema.virtual('observations', {
  ref: 'Observation',
  localField: '_id',
  foreignField: 'session',
  justOne: false,
});

// Calculate duration when ending session
sessionSchema.pre('save', function (next) {
  if (this.endTime && this.startTime) {
    const start = new Date(`2000-01-01 ${this.startTime}`);
    const end = new Date(`2000-01-01 ${this.endTime}`);
    this.duration = Math.round((end - start) / (1000 * 60)); // minutes
  }
  next();
});

export default mongoose.model('Session', sessionSchema);