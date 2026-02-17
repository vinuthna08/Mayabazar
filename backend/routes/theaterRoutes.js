const express = require('express');
const router = express.Router();
const {
  getAllTheaters,
  getNearbyTheaters,
  getTheaterById
} = require('../controllers/theaterController');

router.get('/', getAllTheaters);
router.get('/nearby', getNearbyTheaters);
router.get('/:id', getTheaterById);

module.exports = router;