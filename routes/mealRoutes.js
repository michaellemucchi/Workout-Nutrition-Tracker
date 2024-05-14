const express = require('express');
const db = require('../models/database');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

/**
 * Add a meal to the nutrition tracker.
 * 
 * Uses the authenticate middleware to ensure the user is authenticated.
 * Adds a meal to the database with the user's ID.
 */
router.post('/AddMeal', authenticate, (req, res) => {
  const { meal_name, meal_type, calories, protein } = req.body;
  const user_id = req.user.id;

  db.run(`INSERT INTO meals (user_id, meal_name, meal_type, calories, protein) VALUES (?, ?, ?, ?, ?)`, 
  [user_id, meal_name, meal_type, calories, protein], function(err) {
    if (err) {
      return res.status(500).send({ error: 'Failed to add meal. Please try again later.' });
    }
    res.status(201).send({ id: this.lastID, message: 'Meal added successfully.' });
  });
});

/**
 * Get all meals logged by the authenticated user.
 * 
 * Uses the authenticate middleware to ensure the user is authenticated.
 * Fetches all meals from the database for the authenticated user.
 */
router.get('/AllMeals', authenticate, (req, res) => {
  const user_id = req.user.id;
  
  db.all(`SELECT * FROM meals WHERE user_id = ?`, [user_id], (err, meals) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve meals. Please try again later.' });
    }
    res.status(200).json(meals);
  });
});

/**
 * Get a specific meal by its ID.
 * 
 * Uses the authenticate middleware to ensure the user is authenticated.
 * Fetches a specific meal from the database for the authenticated user.
 */
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM meals WHERE id = ? AND user_id = ?', [id, userId], (err, meal) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve meal. Please try again later.' });
    }
    if (!meal) {
      return res.status(404).send({ error: 'Meal not found.' });
    }
    res.status(200).json(meal);
  });
});

/**
 * Delete a meal.
 * 
 * Uses the authenticate middleware to ensure the user is authenticated.
 * Deletes a meal from the database if the authenticated user is the owner of the meal.
 */
router.delete('/DeleteMeal/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get('SELECT * FROM meals WHERE id = ?', [id], (err, meal) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve meal. Please try again later.' });
    }
    if (!meal) {
      return res.status(404).send({ error: 'Meal not found.' });
    }
    if (meal.user_id !== userId) {
      return res.status(403).send({ error: 'Unauthorized to delete this meal.' });
    }

    db.run('DELETE FROM meals WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).send({ error: 'Failed to delete meal. Please try again later.' });
      }
      if (this.changes === 0) {
        return res.status(404).send({ error: 'Meal not found.' });
      }
      res.status(200).send({ message: 'Meal deleted successfully.' });
    });
  });
});

module.exports = router;
