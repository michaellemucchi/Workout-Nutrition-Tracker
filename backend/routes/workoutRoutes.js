const express = require('express');
const db = require('../database');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

/**
 * Add a workout log.
 */
router.post('/AddWorkout', authenticate, (req, res) => {
  const { workout_type, duration, description } = req.body;
  const user_id = req.user.id;

  db.run(`INSERT INTO workouts (user_id, workout_type, duration, description) VALUES (?, ?, ?, ?)`, 
  [user_id, workout_type, duration, description], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Failed to add workout. Please try again later.' });
    }
    res.status(201).send({ id: this.lastID, message: 'Workout added successfully.' });
  });
});

/**
 * Get all workouts for the authenticated user.
 */
router.get('/AllWorkouts', authenticate, (req, res) => {
  const user_id = req.user.id;

  db.all(`SELECT * FROM workouts WHERE user_id = ?`, [user_id], (err, workouts) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve workouts. Please try again later.' });
    }
    res.status(200).json(workouts);
  });
});

/**
 * Get a specific workout by ID.
 */
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM workouts WHERE id = ? AND user_id = ?', [id, userId], (err, workout) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve workout. Please try again later.' });
    }
    if (!workout) {
      return res.status(404).send({ error: 'Workout not found.' });
    }
    res.status(200).json(workout);
  });
});

/**
 * Delete a workout log.
 */
router.delete('/DeleteWorkout/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM workouts WHERE id = ?', [id], (err, workout) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve workout. Please try again later.' });
    }
    if (!workout) {
      return res.status(404).send({ error: 'Workout not found.' });
    }
    if (workout.user_id !== userId) {
      return res.status(403).send({ error: 'Unauthorized to delete this workout.' });
    }

    db.run('DELETE FROM workouts WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).send({ error: 'Failed to delete workout. Please try again later.' });
      }
      if (this.changes === 0) {
        return res.status(404).send({ error: 'Workout not found.' });
      }
      res.status(200).send({ message: 'Workout deleted successfully.' });
    });
  });
});

module.exports = router;
