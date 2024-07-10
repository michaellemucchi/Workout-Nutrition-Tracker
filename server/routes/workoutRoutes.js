const express = require('express');
const db = require('../database');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Add a workout 
router.post('/AddWorkout', authenticate, async (req, res) => {
  const { exercises } = req.body; // Assuming exercises is an array of { name, category, reps, weight }
  const user_id = req.user.id;
  
  // Begin database transaction
  db.run("BEGIN TRANSACTION;", async (err) => {
      if (err) {
          return res.status(500).send({ error: "Failed to start transaction. Please try again later." });
      }

      try {
          // Insert into workouts table
          const workoutResult = await db.runAsync(`INSERT INTO workouts (user_id) VALUES (?)`, [user_id]);
          const workout_id = workoutResult.lastID;

          // Insert each exercise associated with the workout
          for (const exercise of exercises) {
              await db.runAsync(`INSERT INTO exercises (workout_id, name, category, reps, weight) VALUES (?, ?, ?, ?, ?)`, 
                  [workout_id, exercise.name, exercise.category, exercise.reps, exercise.weight]);
          }

          // Commit transaction
          db.run("COMMIT;", () => {
              res.status(201).send({ message: "Workout and exercises added successfully." });
          });
      } catch (error) {
          // Rollback transaction on error
          db.run("ROLLBACK;", () => {
              res.status(500).send({ error: "Failed to log workout and exercises. Please try again later." });
          });
      }
  });
});

// get workout by date
router.get('/byDate', authenticate, async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  try {
      const workouts = await db.allAsync('SELECT * FROM workouts WHERE user_id = ? AND DATE(date_logged) = ?', [userId, date]);
      if (workouts.length === 0) {
          return res.status(404).send({ error: 'No workouts found for this date.' });
      }
      res.status(200).json(workouts);
  } catch (err) {
      return res.status(500).send({ error: 'Failed to retrieve workout. Please try again later.', details: err.message });
  }
});

//get all workouts
router.get('/allWorkouts', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
      const workouts = await db.allAsync('SELECT * FROM workouts WHERE user_id = ?', [userId]);
      res.status(200).json(workouts);
  } catch (err) {
      return res.status(500).send({ error: 'Failed to retrieve workouts. Please try again later.', details: err.message });
  }
});


// get this weeks workouts
router.get('/thisWeek', authenticate, async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))); // Adjust for start of week

  try {
      const workouts = await db.allAsync('SELECT * FROM workouts WHERE user_id = ? AND date_logged >= ?', [userId, startOfWeek.toISOString()]);
      res.status(200).json(workouts);
  } catch (err) {
      return res.status(500).send({ error: 'Failed to retrieve this week\'s workouts. Please try again later.', details: err.message });
  }
});



// Delete a workout log.
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
