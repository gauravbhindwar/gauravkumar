import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // null for current position
  },
  isCurrentPosition: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  companyLogo: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ExperienceSchema.index({ order: 1 });
ExperienceSchema.index({ startDate: -1 });
ExperienceSchema.index({ isActive: 1 });

// Prevent re-compilation of the model
export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);