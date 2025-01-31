const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {pool} = require('../database');  // PostgreSQL pool
const router = express.Router();

// Add a workout
router.post('/AddWorkout', authenticate, async (req, res) => {
  const { exercises } = req.body;
  const userId = req.user.id;
  const dateLogged = new Date().toLocaleDateString('en-CA');  // Store only the date (no time)

  try {
    // Insert the workout and get the workout ID
    const workoutResult = await pool.query(
      `INSERT INTO workouts (user_id, date_logged) VALUES ($1, $2) RETURNING id`,
      [userId, dateLogged]
    );
    const workout_id = workoutResult.rows[0].id;

    // Insert exercises associated with this workout
    for (const exercise of exercises) {
      await pool.query(
        `INSERT INTO exercises (workout_id, name, category, sets, reps, weight) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [workout_id, exercise.exercise, exercise.category, exercise.sets, exercise.reps, exercise.weight]
      );
    }

    res.status(201).send({ message: "Workout and exercises added successfully." });

  } catch (error) {
    res.status(500).send({ error: "Failed to log workout and exercises. Please try again later.", details: error.message });
  }
});

// Get today's workouts
router.get('/WorkoutsToday', authenticate, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toLocaleDateString('en-CA');  // 'YYYY-MM-DD'

  try {
    const result = await pool.query(
      `SELECT * FROM workouts WHERE user_id = $1 AND date(date_logged) = $2`,
      [userId, today]
    );
    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve today's workouts. Please try again later.", details: error.message });
  }
});

// Get all workouts
router.get('/allWorkouts', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
        workouts.id,
        workouts.date_logged,
        ARRAY(
          SELECT DISTINCT category 
          FROM exercises 
          WHERE exercises.workout_id = workouts.id
        ) AS categories,
        COALESCE(JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', exercises.name,
            'category', exercises.category,
            'sets', exercises.sets,
            'reps', exercises.reps,
            'weight', exercises.weight
          )
        ) FILTER (WHERE exercises.id IS NOT NULL), '[]') AS exercises
      FROM workouts
      LEFT JOIN exercises ON workouts.id = exercises.workout_id
      WHERE workouts.user_id = $1
      GROUP BY workouts.id
      ORDER BY workouts.date_logged DESC`,
      [userId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).send({ error: "Failed to retrieve workouts. Please try again later.", details: err.message });
  }
});


// Delete a workout and associated exercises
router.delete('/deleteWorkout/:id', authenticate, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.user.id;

  try {
    // Verify that the workout belongs to the user
    const workoutCheck = await pool.query(
      `SELECT * FROM workouts WHERE id = $1 AND user_id = $2`,
      [workoutId, userId]
    );

    if (workoutCheck.rowCount === 0) {
      return res.status(404).send({ error: "Workout not found or you are not authorized to delete it." });
    }

    // Delete exercises associated with the workout
    await pool.query(`DELETE FROM exercises WHERE workout_id = $1`, [workoutId]);

    // Delete the workout
    await pool.query(`DELETE FROM workouts WHERE id = $1 AND user_id = $2`, [workoutId, userId]);

    res.status(200).send({ message: "Workout deleted successfully." });

  } catch (error) {
    res.status(500).send({ error: "Failed to delete workout. Please try again later.", details: error.message });
  }
});

// Backend route to get the consistency streak
router.get('/consistency', authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
      const result = await pool.query(`
          SELECT day_date AS date, 
                 COUNT(DISTINCT meals.id) AS meals_count,
                 COUNT(DISTINCT workouts.id) AS workouts_count
          FROM generate_series(
              now()::date - INTERVAL '7 days', 
              now()::date, 
              INTERVAL '1 day'
          ) AS days(day_date)
          LEFT JOIN meals ON meals.date_logged::date = days.day_date AND meals.user_id = $1
          LEFT JOIN workouts ON workouts.date_logged::date = days.day_date AND workouts.user_id = $1
          GROUP BY day_date
          ORDER BY day_date DESC;
      `, [userId]);

      let consistencyStreak = 0;

      for (const row of result.rows) {
          if (row.meals_count > 0 && row.workouts_count > 0) {
              consistencyStreak++;
          } else {
              break;
          }
      }

      res.status(200).json({ consistencyStreak });
  } catch (error) {
      console.error("Error calculating consistency streak:", error);
      res.status(500).json({ error: "Failed to calculate consistency streak" });
  }
});



module.exports = router;
