const express = require('express');
const authenticate = require('../middlewares/authenticate');
const { pool } = require('../database');  // Correctly import the PostgreSQL pool
const router = express.Router();

// Add a meal
router.post('/AddMeal', authenticate, async (req, res) => {
  const { meal_name, meal_type, calories, protein, carbs, fats } = req.body;
  const user_id = req.user.id;

  // Validate required fields
  if (!meal_name || !meal_type || !calories || !protein || !carbs || !fats) {
    return res.status(400).send({ error: 'All meal details must be provided.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO meals (user_id, meal_name, meal_type, calories, protein, carbs, fats) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [user_id, meal_name, meal_type, calories, protein, carbs, fats]
    );
    res.status(201).send({ id: result.rows[0].id, message: 'Meal added successfully.' });
  } catch (error) {
    res.status(500).send({ error: "Failed to add meal. Please try again later.", details: error.message });
  }
});

// Get all meals for the authenticated user
router.get('/AllMeals', authenticate, async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT date(date_logged) AS date_logged,
              COALESCE(SUM(calories), 0) AS total_calories,
              COALESCE(SUM(protein), 0) AS total_protein,
              COALESCE(SUM(carbs), 0) AS total_carbs,
              COALESCE(SUM(fats), 0) AS total_fats,
              STRING_AGG(
                COALESCE(id::TEXT, '') || ',' || COALESCE(meal_name, '') || ' - ' || COALESCE(meal_type, '') || ': ' 
                || COALESCE(calories::TEXT, '0') || ' cal, Protein: ' || COALESCE(protein::TEXT, '0') 
                || 'g, Carbs: ' || COALESCE(carbs::TEXT, '0') || 'g, Fats: ' || COALESCE(fats::TEXT, '0') || 'g', '; '
              ) AS details
       FROM meals
       WHERE user_id = $1
       GROUP BY date(date_logged)`,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve meals. Please try again later.', details: err.message });
  }
});


// Get meals from today
router.get('/MealsToday', authenticate, async (req, res) => {
  const userId = req.user.id;
  
  // Get today's date in 'YYYY-MM-DD' format (local time)
  const today = new Date().toLocaleDateString('en-CA');  // Outputs: 'YYYY-MM-DD'

  try {
    const result = await pool.query(
      `SELECT * FROM meals WHERE user_id = $1 AND date(date_logged) = $2`,
      [userId, today]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send({ error: "Failed to retrieve today's meals.", details: err.message });
  }
});

 

// Delete a meal
router.delete('/DeleteMeal/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    // Check if the meal exists
    const mealResult = await pool.query(
      `SELECT * FROM meals WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (mealResult.rowCount === 0) {
      return res.status(404).send({ error: 'Meal not found.' });
    }

    // Delete the meal
    await pool.query(`DELETE FROM meals WHERE id = $1`, [id]);
    res.status(200).send({ message: 'Meal deleted successfully.' });

  } catch (error) {
    res.status(500).send({ error: "Failed to delete meal. Please try again later.", details: error.message });
  }
});

module.exports = router;
