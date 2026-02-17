const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  screens: [{
    screenNumber: Number,
    screenType: {
      type: String,
      enum: ['IMAX', '4DX', 'Dolby', 'Standard', '4K'],
    },
    totalSeats: Number,
    rows: Number,
    seatsPerRow: Number,
    pricing: {
      classic: Number,
      premium: Number,
      recliner: Number
    }
  }],
  facilities: [String],
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);