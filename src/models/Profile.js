import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  profilePicture: {
    type: String,
    required: false,
    default: '/gaurav.jpg' // Default profile picture
  },
  bio: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  website: {
    type: String,
    required: false,
    trim: true
  },
  github: {
    type: String,
    required: false,
    trim: true
  },
  linkedin: {
    type: String,
    required: false,
    trim: true
  },
  portfolio: {
    type: String,
    required: false,
    trim: true
  },
  resumeType: {
    type: String,
    enum: ['fullstack', 'ai', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

export default Profile;