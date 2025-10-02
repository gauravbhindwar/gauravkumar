import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    required: false,
    trim: true
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  isCurrentlyStudying: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    required: false, // Optional - can be GPA, percentage, or grade
    trim: true
  },
  gradeType: {
    type: String,
    enum: ['GPA', 'Percentage', 'Grade', 'Other'],
    required: false
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  coursework: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
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

// Add indexes for better query performance
EducationSchema.index({ institution: 1 });
EducationSchema.index({ degree: 1 });
EducationSchema.index({ endDate: -1 });
EducationSchema.index({ order: 1 });

const Education = mongoose.models.Education || mongoose.model('Education', EducationSchema);

export default Education;