const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const {runAsync, getAsync, allAsync} = require('../database');
const { generateToken } = require('../utils/jwtHelper');
const authenticate = require('../middlewares/authenticate');
const moment = require('moment'); // Moment.js for easy date manipulation
const multer = require('multer');

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
    const result = await runAsync('INSERT INTO users (username, password, date_of_birth) VALUES (?, ?, ?)', [username, hashedPassword, dateOfBirth]);
    res.status(201).json({ message: 'User registered. Please complete your profile.', userId: result.lastID });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(409).send({ error: 'Username is already taken.' });
    } else {
      console.error(err); // Log full error
      res.status(500).send({ error: 'Internal server error. Please try again later.' });
    }
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
    await runAsync('UPDATE users SET bio = ?, fitness_goals = ? WHERE id = ?', [bio, fitnessGoals, userId]);
    res.status(200).json({ message: 'Profile completed successfully'});
  } catch (err) {
    console.error('Update error:', err.message); // Logging the specific error can help in debugging
    res.status(500).send({ error: 'Internal server error. Please try again later.' });
  }
});



// Login a user.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required.' });
  }

  try {
      const user = await getAsync('SELECT id, username, password FROM users WHERE username = ?', [username]);
  
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



// Get authenticated user profile.
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await getAsync('SELECT id, username, bio, fitness_goals, date_of_birth, profile_picture, datetime(created_at, "localtime") as created_at FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    // Fetch additional stats
    const mealCount = await getAsync('SELECT COUNT(*) AS count FROM meals WHERE user_id = ?', [userId]);
    const workoutCount = await getAsync('SELECT COUNT(*) AS count FROM workouts WHERE user_id = ?', [userId]);
    const creationDate = new Date(user.created_at);
    const currentDate = new Date();
    const accountDurationDays = Math.round((currentDate - creationDate) / (1000 * 3600 * 24));

    // Append additional data
    user.mealsLogged = mealCount.count;
    user.workoutsLogged = workoutCount.count;
    user.accountAge = accountDurationDays;

    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).send({ error: 'Failed to retrieve user profile. Please try again later.' });
  }
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');  // Make sure this uploads directory is publicly accessible
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 52428800 // 50MB max file size
  },
  fileFilter: fileFilter
});


router.post('/profile/upload', authenticate, upload.single('profilePic'), async (req, res) => {
    const userId = req.user.id;  // Ensure you have middleware that populates req.user
    const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
  
    try {
      const result = await runAsync('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePictureUrl, userId]);
      if (result.changes > 0) {
          res.status(200).json({ message: 'Profile picture updated successfully', profile_picture: profilePictureUrl });
      } else {
          throw new Error('User not found');
      }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* Change user password.
 
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
*/

/*  Delete a user.
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
*/

// Get all users 
router.get('/', async (req, res) => {
  try {
    const rows = await allAsync(`SELECT * FROM users`);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve users. Please try again later.', details: err.message });
  }
});


module.exports = router;
