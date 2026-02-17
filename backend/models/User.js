const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    favoriteGenres: [String],
    preferredLanguage: String,
    budgetRange: {
      min: Number,
      max: Number
    }
  },
  points: {
    type: Number,
    default: 0
  },
  membership: {
    type: String,
    enum: ['basic', 'silver', 'gold'],
    default: 'basic'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);