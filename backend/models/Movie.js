const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: [String],
  language: [String],
  duration: Number,
  rating: {
    imdb: Number,
    userScore: Number
  },
  poster: String,
  description: String,
  cast: [String],
  releaseDate: Date,
  isNowShowing: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);