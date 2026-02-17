const Booking = require('../models/Booking');
const User = require('../models/User');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { movie, theater, showtime, seats } = req.body;

    // Calculate total
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Points earned (1 point per 10 rupees)
    const pointsEarned = Math.floor(totalAmount / 10);

    const booking = await Booking.create({
      user: req.user.id,
      movie,
      theater,
      showtime,
      seats,
      totalAmount,
      pointsEarned
    });

    // Update user points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: pointsEarned }
    });

    res.status(201).json({
      message: 'Booking confirmed 🎬',
      booking,
      pointsEarned
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled ' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};