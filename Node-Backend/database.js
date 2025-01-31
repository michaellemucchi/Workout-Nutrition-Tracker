const { Pool } = require('pg');
require('dotenv').config();

// Create a new PostgreSQL pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database.');
});

// Async function to initialize the database tables
async function initializeDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password TEXT,
        bio TEXT,
        fitness_goals TEXT,
        calorie_goal INTEGER,
        fitness_goal TEXT,
        date_of_birth DATE,
        profilePicture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists.');

    // Meals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        meal_name VARCHAR(255) NOT NULL,
        meal_type VARCHAR(50) NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fats INTEGER NOT NULL,
        date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    console.log('Meals table created or already exists.');

    // Workouts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    console.log('Workouts table created or already exists.');

    // Exercises table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        workout_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight DECIMAL,
        FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
      )
    `);
    console.log('Exercises table created or already exists.');

  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  }
}

// Export the pool and helper functions
module.exports = {
  pool,          // Allow routes to use `pool.query` directly
  initializeDB,  // Initialize tables when needed
};
