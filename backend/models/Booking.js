const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  showtime: {
    date: Date,
    time: String
  },
  seats: [{
    row: String,
    seatNumber: Number,
    seatType: {
      type: String,
      enum: ['classic', 'premium', 'recliner']
    },
    price: Number
  }],
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  pointsEarned: Number
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);