const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const db = require('../database');
const { generateToken } = require('../utils/jwtHelper');
const authenticate = require('../middlewares/authenticate');
const moment = require('moment'); // Moment.js for easy date manipulation

const router = express.Router();

// Register a new user.
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
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    db.run('INSERT INTO users (username, password, date_of_birth) VALUES (?, ?, ?)', [
      username, hashedPassword, dateOfBirth
    ], function(err) {
      if (err) {
        res.status(400).send({ error: 'Username is already taken.' });
      } else {
        // Here we use `this.lastID` to get the ID of the newly created user
        res.status(201).json({ message: 'User registered. Please complete your profile.', userId: this.lastID });
      }
    });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});


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
    db.run('UPDATE users SET bio = ?, fitness_goals = ? WHERE id = ?', [bio, fitnessGoals, userId]);
    res.status(200).json({ message: 'Profile completed successfully'});
  } catch (err) {
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});




/**
 * Login a user.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await db.get('SELECT id, username, password FROM users WHERE username = ?', [username]);
      if (!user) {
          return res.status(401).send({ error: 'Login failed! Incorrect Username' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).send({ error: 'Login failed! Incorrect Password.' });
      }

      const token = generateToken(user.id);

      res.status(200).json({
          userId: user.id,
          username: user.username,
          token: token
      });
  } catch (error) {
      res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});


/**
 * Get authenticated user profile.
 */
router.get('/profile', authenticate, (req, res) => {
  const userId = req.user.id;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve user profile. Please try again later.' });
    }
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
});

/**
 * Change user password.
 */
router.put('/changePassword', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err) {
      return res.status(500).send({ error: 'Internal server error. Please try again later.' });
    }
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    try {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: 'Incorrect old password.' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 8);
      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
        if (err) {
          return res.status(500).send({ error: 'Failed to change password. Please try again later.' });
        }
        res.status(200).send({ message: 'Password changed successfully.' });
      });
    } catch (error) {
      res.status(500).send({ error: 'Internal server error. Please try again later.' });
    }
  });
});

/**
 * Delete a user.
 */
router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== parseInt(id)) {
    return res.status(403).send({ error: 'Unauthorized to perform this action.' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Failed to delete user. Please try again later.' });
    }
    if (this.changes === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }
    res.status(200).send({ message: 'User deleted successfully.' });
  });
});

/**
 * Get all users.
 */
router.get('/', async (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve users. Please try again later.' });
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
