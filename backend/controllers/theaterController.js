const Theater = require('../models/Theater');

// Get all theaters
exports.getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get theaters by location
exports.getNearbyTheaters = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10 } = req.query;

    const theaters = await Theater.find();

    // Calculate distance for each theater
    const theatersWithDistance = theaters.map(theater => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        theater.location.coordinates.lat,
        theater.location.coordinates.lng
      );
      return { ...theater._doc, distance: distance.toFixed(1) };
    });

    // Filter by max distance and sort
    const nearby = theatersWithDistance
      .filter(t => t.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get theater by ID
exports.getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Distance calculation helper (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}