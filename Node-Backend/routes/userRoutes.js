const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const {pool} = require('../database');  // PostgreSQL pool
const authenticate = require('../middlewares/authenticate');
const moment = require('moment');  // For date validation
const multer = require('multer');

const router = express.Router();

// Register a new user
router.post('/register/initiate', [
  check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  check('dateOfBirth').custom(value => {
    const date = moment(value, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      throw new Error('Date of Birth is not valid.');
    }
    if (moment().diff(date, 'years') < 13) {
      throw new Error('You must be at least 13 years old.');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, dateOfBirth } = req.body;
  const calorieGoal = 2000;
  const fitnessGoal = 'maintain';
  const lowerCaseUsername = username.toLowerCase();

  try {
    // Check if the username already exists
    const userCheck = await pool.query('SELECT id FROM users WHERE LOWER(username) = $1', [lowerCaseUsername]);
    if (userCheck.rowCount > 0) {
      return res.status(409).send({ error: 'Username is already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert user into the database
    const result = await pool.query(
      `INSERT INTO users (username, password, date_of_birth, calorie_goal, fitness_goal) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [lowerCaseUsername, hashedPassword, dateOfBirth, calorieGoal, fitnessGoal]
    );

    res.status(201).json({ message: 'User registered. Please complete your profile.', userId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});

// Complete user profile
router.post('/register/complete', [
  check('userId').notEmpty().withMessage('User ID is required'),
  check('bio').notEmpty().withMessage('Bio cannot be empty'),
  check('fitnessGoals').notEmpty().withMessage('Fitness goals cannot be empty')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, bio, fitnessGoals } = req.body;

  try {
    await pool.query('UPDATE users SET bio = $1, fitness_goals = $2 WHERE id = $3', [bio, fitnessGoals, userId]);
    res.status(200).json({ message: 'Profile completed successfully.' });

  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const lowerCaseUsername = username.toLowerCase();

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required.' });
  }

  try {
    // Fetch user from the database
    const result = await pool.query('SELECT id, username, password FROM users WHERE LOWER(username) = $1', [lowerCaseUsername]);

    if (result.rowCount === 0) {
      return res.status(401).send({ error: 'Login failed! Incorrect Username' });
    }

    const user = result.rows[0];

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Login failed! Incorrect Password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }  // Token expires in 24 hours
    );

    res.status(200).json({ userId: user.id, username: user.username, token });

  } catch (error) {
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});



// Get authenticated user profile.
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, username, bio, fitness_goals, calorie_goal, fitness_goal, date_of_birth, profilePicture, created_at 
       FROM users WHERE id = $1`, 
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const user = result.rows[0];

    // Fetch additional statistics
    const mealCount = await pool.query('SELECT COUNT(*) AS count FROM meals WHERE user_id = $1', [userId]);
    const workoutCount = await pool.query('SELECT COUNT(*) AS count FROM workouts WHERE user_id = $1', [userId]);

    const creationDate = new Date(user.created_at);
    const currentDate = new Date();
    const accountDurationDays = Math.round((currentDate - creationDate) / (1000 * 3600 * 24));

    // Attach additional info
    user.mealsLogged = mealCount.rows[0].count;
    user.workoutsLogged = workoutCount.rows[0].count;
    user.accountAge = accountDurationDays;

    res.status(200).json(user);

  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).send({ error: 'Failed to retrieve user profile. Please try again later.' });
  }
});


// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');  // Ensure this directory is accessible
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 52428800  // 50MB limit
  },
  fileFilter: fileFilter
});

// Route to upload profile picture
router.post('/profile/upload', authenticate, upload.single('profilePic'), async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded or invalid file type.' });
  }

  const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  if (req.fileValidationError) {
    return res.status(400).send({ error: req.fileValidationError });
  }

  try {
    // Update profile picture URL in the database
    const result = await pool.query('UPDATE users SET profilePicture = $1 WHERE id = $2', [profilePictureUrl, userId]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: profilePictureUrl });
    } else {
      res.status(404).send({ error: 'User not found.' });
    }

  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).send({ error: 'Failed to update profile picture. Please try again later.' });
  }
});


// Change user password.
router.put('/changePassword', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (oldPassword === newPassword) {
    return res.status(400).send({ error: 'New password must be different from the old password.' });
  }

  try {
    // Fetch the user from the database
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const user = userResult.rows[0];

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Incorrect old password.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update the password in the database
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    res.status(200).send({ message: 'Password changed successfully.' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send({ error: 'Failed to change password. Please try again later.' });
  }
});


// Get calorie goal
router.get('/GetCalorieGoal', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT calorie_goal, fitness_goal FROM users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.status(200).json({
      calorieGoal: result.rows[0].calorie_goal,
      fitnessGoal: result.rows[0].fitness_goal
    });

  } catch (error) {
    console.error('Error retrieving calorie goal:', error);
    res.status(500).send({ error: 'Internal server error.' });
  }
});



// Set calorie goal
router.post('/SetCalorieGoal', authenticate, async (req, res) => {
  const { calorieGoal, fitnessGoal } = req.body;
  const userId = req.user.id;

  try {
    await pool.query('UPDATE users SET calorie_goal = $1, fitness_goal = $2 WHERE id = $3', [calorieGoal, fitnessGoal, userId]);
    res.status(200).send({ message: 'Calorie and fitness goals updated successfully.' });

  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).send({ error: 'Failed to update goals. Please try again later.' });
  }
});






// Delete a user
/*
router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  // Ensure that the authenticated user is deleting their own account
  if (req.user.id !== parseInt(id)) {
    return res.status(403).send({ error: 'Unauthorized to perform this action.' });
  }

  try {
    // Delete all related data (e.g., meals, workouts) if needed
    await pool.query('DELETE FROM meals WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM workouts WHERE user_id = $1', [id]);

    // Delete the user
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.status(200).send({ message: 'User deleted successfully.' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user. Please try again later.' });
  }
});*/

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, date_of_birth, calorie_goal, fitness_goal, bio FROM users');
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).send({ error: 'Failed to retrieve users. Please try again later.', details: error.message });
  }
});


module.exports = router;
