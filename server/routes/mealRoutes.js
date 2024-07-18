const express = require('express');
const db = require('../database');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Add a meal
router.post('/AddMeal', authenticate, async (req, res) => {
  const { meal_name, meal_type, calories, protein, carbs, fats } = req.body;
  const user_id = req.user.id;
  try {
    const result = await db.runAsync(
      `INSERT INTO meals (user_id, meal_name, meal_type, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, meal_name, meal_type, calories, protein, carbs, fats]
    );
    res.status(201).send({ id: result.lastID, message: 'Meal added successfully.' });
  } catch (error) {
    res.status(500).send({ error: "Failed to add meal. Please try again later.", details: error.message });
  }
});

// Get all meals for the authenticated user
router.get('/AllMeals', authenticate, async (req, res) => {
  const user_id = req.user.id;
  try {
    const meals = await db.allAsync(
      `SELECT * FROM meals WHERE user_id = ?`,
      [user_id]
    );
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).send({ error: 'Failed to retrieve meals. Please try again later.', details: err.message });
  }
});

// Delete a meal
router.delete('/DeleteMeal/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const meal = await db.getAsync('SELECT * FROM meals WHERE id = ? AND user_id = ?', [id, userId]);
    if (!meal) {
      return res.status(404).send({ error: 'Meal not found.' });
    }

    const result = await db.runAsync('DELETE FROM meals WHERE id = ?', [id]);
    if (result.changes) {
      res.status(200).send({ message: 'Meal deleted successfully.' });
    } else {
      throw new Error('No meal found or you are not authorized to delete this meal.');
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to delete meal. Please try again later.", details: error.message });
  }
});

module.exports = router;
