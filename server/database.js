const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');


const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    // Exit the process if the database connection fails
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDB().catch(err => {
      console.error('Initialization failed:', err.message);
      process.exit(1); // Exit the process if table creation fails
    });
  }
});

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {  // 'function' keyword is crucial here
          if (err) {
              reject(err);
          } else {
              resolve(this);  // 'this' contains lastID and lastRow information
          }
      });
  });
}

const getAsync = promisify(db.get.bind(db)); 
const allAsync = promisify(db.all.bind(db));


async function initializeDB() {
  try {
    // Users table
    await createTable(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        bio TEXT,
        fitness_goals TEXT,
        date_of_birth DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists.');

    // nutrition table
    await createTable(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        meal_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        date_logged DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
    console.log('Meals table created or already exists.');

    // Workouts table
    await createTable(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        workout_type TEXT NOT NULL,
        duration INTEGER NOT NULL,
        description TEXT,
        date_logged DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
    console.log('Workouts table created or already exists.');
    
  } catch (err) {
    throw new Error('Error creating tables: ' + err.message);
  }
}

function createTable(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { runAsync, getAsync, allAsync, db};