const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const app = express();
require('dotenv').config();

// Middleware to parse JSON bodies
app.use(bodyParser.json()); 

// Routes
app.use('/users', userRoutes);
app.use('/meals', mealRoutes);
app.use('/workouts', workoutRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});