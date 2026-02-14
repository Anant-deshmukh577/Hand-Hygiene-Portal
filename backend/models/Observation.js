import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    observedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    ward: {
      type: String,
      required: [true, 'Ward is required'],
    },
    whoMoment: {
      type: String,
      required: [true, 'WHO Moment is required'],
      enum: [
        'before_patient',
        'before_aseptic',
        'after_body_fluid',
        'after_patient',
        'after_surroundings',
      ],
    },
    adherence: {
      type: String,
      required: [true, 'Adherence status is required'],
      enum: ['adherence', 'partial', 'missed'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['rub', 'wash'],
    },
    glove: {
      type: String,
      enum: ['on', 'off'],
      default: 'off',
    },
    hygieneSteps: {
      rub_palm_to_palm: {
        type: Boolean,
        default: false,
      },
      rub_right_dorsum_left_palm: {
        type: Boolean,
        default: false,
      },
      rub_palm_to_palm_interlaced: {
        type: Boolean,
        default: false,
      },
      rub_backs_fingers: {
        type: Boolean,
        default: false,
      },
      rub_thumb_rotation: {
        type: Boolean,
        default: false,
      },
      rub_fingers_rotation: {
        type: Boolean,
        default: false,
      },
    },
    duration: {
      type: Number,
      default: 0,
    },
    riskFactors: {
      jewellery: {
        type: Boolean,
        default: false,
      },
      watch: {
        type: Boolean,
        default: false,
      },
      ring: {
        type: Boolean,
        default: false,
      },
      long_nails: {
        type: Boolean,
        default: false,
      },
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate points before saving observation
// Points = (count of hygiene steps checked) + (1 if time compliant) - (count of risk factors)
// Minimum 0, Maximum 7
observationSchema.pre('save', function (next) {
  // 1. Steps: +1 per step checked (max 6)
  const steps = this.hygieneSteps || {};
  const stepKeys = [
    'rub_palm_to_palm',
    'rub_right_dorsum_left_palm',
    'rub_palm_to_palm_interlaced',
    'rub_backs_fingers',
    'rub_thumb_rotation',
    'rub_fingers_rotation',
  ];
  const stepsPoints = stepKeys.filter(key => steps[key] === true).length;

  // 2. Time compliance: +1 if duration meets the threshold
  let timePoint = 0;
  const duration = this.duration || 0;
  if (this.action === 'rub' && duration > 20) {
    timePoint = 1;
  } else if (this.action === 'wash' && duration > 40) {
    timePoint = 1;
  }

  // 3. Risk factors: -1 per risk factor present
  const risks = this.riskFactors || {};
  const riskKeys = ['jewellery', 'watch', 'ring', 'long_nails'];
  const riskDeduction = riskKeys.filter(key => risks[key] === true).length;

  // Final score (floored at 0)
  this.points = Math.max(0, stepsPoints + timePoint - riskDeduction);
  next();
});

// Index for faster queries
observationSchema.index({ session: 1, createdAt: -1 });
observationSchema.index({ auditor: 1, createdAt: -1 });
observationSchema.index({ observedStaff: 1, createdAt: -1 });
observationSchema.index({ department: 1, ward: 1 });

export default mongoose.model('Observation', observationSchema);
