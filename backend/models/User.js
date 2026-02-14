import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
    },
    department: {
      type: String,
      enum: [
        'Medicine',
        'Surgery',
        'Pediatrics',
        'Obstetrics & Gynecology',
        'Orthopedics',
        'ENT',
        'Ophthalmology',
        'Psychiatry',
        'Anesthesia',
        'Radiology',
        'Pathology',
        'Emergency',
        'Housekeeping',
        'Administration',
      ],
    },
    designation: {
      type: String,
      enum: [
        'Senior Resident',
        'Junior Resident',
        'Staff Nurse',
        'Nursing Supervisor',
        'Consultant',
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Technician',
        'Paramedic',
        'Housekeeping Staff',
      ],
    },
    role: {
      type: String,
      enum: ['staff', 'auditor', 'admin'],
      default: 'staff',
    },
    avatar: {
      type: String,
      default: '',
    },
    totalPoints: {
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
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    facebookId: {
      type: String,
      sparse: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      badgeAlerts: {
        type: Boolean,
        default: true,
      },
      leaderboardUpdates: {
        type: Boolean,
        default: false,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for user's badges
userSchema.virtual('badges', {
  ref: 'UserBadge',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Virtual for user's rewards
userSchema.virtual('rewards', {
  ref: 'UserReward',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

export default mongoose.model('User', userSchema);