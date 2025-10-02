import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  lastLoginIP: {
    type: String,
    default: null
  },
  lastLoginUserAgent: {
    type: String,
    default: null
  },
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    success: {
      type: Boolean,
      default: true
    }
  }],
  securitySettings: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 24 // hours
    },
    passwordLastChanged: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Prevent re-compilation of the model
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
