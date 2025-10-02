import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Professional', 'Technical', 'Leadership', 'Community', 'Sports', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  impact: {
    type: String,
    default: ''
  },
  metrics: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better performance
AchievementSchema.index({ order: 1 });
AchievementSchema.index({ date: -1 });
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ isActive: 1 });
AchievementSchema.index({ isFeatured: 1 });

// Prevent re-compilation of the model
export default mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);