const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/users', userRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mayabazar API Running 🎬' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected '))
  .catch((err) => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mayabazar Server running on port ${PORT} `);
});