const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const { pool, initializeDB } = require('./database');
require('dotenv').config();
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']  // Explicitly allow Authorization header
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json()); 


// Routes
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);

// Static file serving
app.use('/uploads', express.static('uploads', {
  setHeaders: function (res, path, stat) {
    res.set('Cache-Control', 'no-store');
  }
}));

// Initialize tables before starting the server
initializeDB().then(() => {
  console.log('Database tables initialized.');

  // Start the server after DB is ready
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);  // Exit if table creation fails
});