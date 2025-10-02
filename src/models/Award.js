import mongoose from 'mongoose';

const AwardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  awardedBy: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Professional', 'Technical', 'Leadership', 'Innovation', 'Community Service', 'Competition', 'Recognition', 'Other'],
    required: true
  },
  level: {
    type: String,
    enum: ['International', 'National', 'Regional', 'State', 'Local', 'Institutional'],
    default: 'Institutional'
  },
  image: {
    type: String,
    default: ''
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: '' // e.g., "1st Place", "Winner", "Finalist"
  },
  prizeValue: {
    type: String,
    default: ''
  },
  criteria: {
    type: String,
    default: ''
  },
  tags: [{
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
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better performance
AwardSchema.index({ order: 1 });
AwardSchema.index({ date: -1 });
AwardSchema.index({ category: 1 });
AwardSchema.index({ level: 1 });
AwardSchema.index({ isActive: 1 });
AwardSchema.index({ isFeatured: 1 });

// Prevent re-compilation of the model
export default mongoose.models.Award || mongoose.model('Award', AwardSchema);