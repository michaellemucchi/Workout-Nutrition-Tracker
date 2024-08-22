const express = require('express');
const {runAsync, getAsync, allAsync} = require('../database');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Add a workout
router.post('/AddWorkout', authenticate, async (req, res) => {
  const { exercises } = req.body;
  const userId = req.user.id;
  const dateLogged = new Date().toISOString(); // Ensuring date is in UTC in ISO format
  try {
    const workoutResult = await runAsync(`INSERT INTO workouts (user_id, date_logged) VALUES (?, ?)`, [userId, dateLogged]);
    const workout_id = workoutResult.lastID;

    for (const exercise of exercises) {
      await runAsync(`INSERT INTO exercises (workout_id, name, category, sets, reps, weight) VALUES (?, ?, ?, ?, ?, ?)`, 
        [workout_id, exercise.exercise, exercise.category, exercise.sets, exercise.reps, exercise.weight]);
    }
    
    res.status(201).send({ message: "Workout and exercises added successfully." });
  } catch (error) {
    res.status(500).send({ error: "Failed to log workout and exercises. Please try again later.", details: error.message });
  }
});

// Get today's workouts
router.get('/WorkoutsToday', authenticate, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

  try {
    const workoutsToday = await allAsync(`
      SELECT * 
      FROM workouts 
      WHERE user_id = ? 
      AND date_logged LIKE ?`, [userId, `${today}%`]);

    res.status(200).json(workoutsToday);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve today\'s workouts. Please try again later.', details: error.message });
  }
});


//get all workouts
router.get('/allWorkouts', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const workouts = await allAsync(`
      SELECT 
        workouts.id,
        workouts.date_logged,
        group_concat(exercises.category) as categories,
        group_concat(exercises.name) as exercises,
        group_concat(exercises.sets) as sets,
        group_concat(exercises.reps) as reps,
        group_concat(exercises.weight) as weights
      FROM workouts
      LEFT JOIN exercises ON workouts.id = exercises.workout_id
      WHERE workouts.user_id = ?
      GROUP BY workouts.id
    `, [userId]);

    const detailedWorkouts = workouts.map(workout => ({
      ...workout,
      categories: workout.categories ? workout.categories.split(',') : [],
      exercises: workout.exercises ? workout.exercises.split(',') : [],
      sets: workout.sets ? workout.sets.split(',') : [],
      reps: workout.reps ? workout.reps.split(',') : [],
      weights: workout.weights ? workout.weights.split(',') : [],
      date: new Date(workout.date_logged).toLocaleDateString()
    }));

    res.status(200).json(detailedWorkouts);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve workouts. Please try again later.', details: err.message });
  }
});



// Delete a workout log
router.delete('/deleteWorkout/:id', authenticate, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.user.id; // Ensure that the workout belongs to the user
  try {
      await runAsync('DELETE FROM exercises WHERE workout_id = ?', [workoutId]);
      const result = await runAsync('DELETE FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]);
      if (result.changes) {
          res.status(200).send({ message: 'Workout deleted successfully.' });
      } else {
          throw new Error('No workout found or you are not authorized to delete this workout.');
      }
  } catch (error) {
      res.status(500).send({ error: "Failed to delete workout. Please try again later.", details: error.message });
  }
});

module.exports = router;
