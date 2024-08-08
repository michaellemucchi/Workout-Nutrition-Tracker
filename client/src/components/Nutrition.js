import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useUser } from '../context/UserContext';
import GoalSetter from './GoalSetter';
import CaloriesChart from './CaloriesChart';
import NutrientChart from './NutrientChart';
import ConsistencyCounter from './ConsistencyCounter';
import "./Nutrition.css";

const Nutrition = () => {
    const { user } = useUser();
    const [meals, setMeals] = useState([]);
    const [todayMeals, setTodayMeals] = useState([]);
    const [showAddMealModal, setShowAddMealModal] = useState(false);
    const [showJournalModal, setShowJournalModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [mealType, setMealType] = useState('');
    const [formData, setFormData] = useState({
        meal_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });
    const [goalCalories, setGoalCalories] = useState(2000); // Dynamically set based on user goals

    const fetchMeals = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/meals/AllMeals', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch meals');
            const data = await response.json();
            setMeals(data.map(meal => ({
                ...meal,
                date_logged: new Date(meal.date_logged).toLocaleDateString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })
            })));
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    }, [user.token]);

    const fetchTodayMeals = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/meals/MealsToday', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch today\'s meals');
            const data = await response.json();
            setTodayMeals(data);
        } catch (error) {
            console.error('Error fetching today\'s meals:', error);
        }
    }, [user.token]);

    useEffect(() => {
        fetchMeals();
        fetchTodayMeals();
    }, [fetchMeals, fetchTodayMeals]);

    const fetchGoalCalories = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/GetCalorieGoal', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch calorie goal');
            const data = await response.json();
            setGoalCalories(data.calorieGoal);
        } catch (error) {
            console.error('Error fetching calorie goal:', error);
        }
    }, [user.token]);

    useEffect(() => {
        fetchGoalCalories();
    }, [fetchGoalCalories]);

    const handleAddMealChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddMealSubmit = async (e) => {
        e.preventDefault();
        const mealData = { ...formData, meal_type: mealType };

        try {
            const response = await fetch('http://localhost:3000/api/meals/AddMeal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(mealData)
            });
            if (!response.ok) throw new Error('Failed to add meal');
            await response.json();
            setShowAddMealModal(false);
            fetchMeals();
            fetchTodayMeals();
        } catch (error) {
            console.error('Error adding meal:', error);
        }

        setMealType('');
        setFormData({
            meal_name: '',
            calories: '',
            protein: '',
            carbs: '',
            fats: ''
        });
    };

    const handleDeleteMeal = async (mealId) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/meals/DeleteMeal/${mealId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                if (!response.ok) throw new Error('Failed to delete meal');
                fetchMeals();
                fetchTodayMeals();
            } catch (error) {
                console.error('Error deleting meal:', error);
            }
        }
    };

    const toggleDetails = (date) => {
        setSelectedDate(date === selectedDate ? null : date);
    };

    const renderTodayMeals = () => {
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
        return mealTypes.map(type => {
            const meal = todayMeals.find(meal => meal.meal_type === type);
            return (
                <div key={type} className="meal-box">
                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    {meal ? (
                        <>
                            <p>{meal.meal_name}</p>
                            <p>{meal.calories} cal</p>
                        </>
                    ) : (
                        <p>No meal logged</p>
                    )}
                </div>
            );
        });
    };

    const totalCalories = todayMeals.reduce((total, meal) => total + meal.calories, 0);
    const totalProtein = todayMeals.reduce((total, meal) => total + meal.protein, 0);
    const totalCarbs = todayMeals.reduce((total, meal) => total + meal.carbs, 0);
    const totalFats = todayMeals.reduce((total, meal) => total + meal.fats, 0);

    return (
        <div className="nutrition-container">
            <div className="main-content">
                <div className="goal-setter-container">
                    <GoalSetter />
                </div>
                <div className="log-meal-container">
                    <button onClick={() => setShowAddMealModal(true)} className="log-meal-button">Log Meal</button>
                    <p>Click to log your meal and track your nutrition.</p>
                </div>
                <div className="meal-journal-container">
                    <button onClick={() => setShowJournalModal(true)} className="meal-journal-button">Meal Journal</button>
                    <p>Look through your database of meals</p>
                </div>
            </div>
            <div className="today-meals-container">
                {renderTodayMeals()}
            </div>
            <div className="charts-container">
                <div className="calories-chart-container">
                    <CaloriesChart totalCalories={totalCalories} goalCalories={goalCalories} />
                </div>
                <div className="nutrient-chart-container">
                    <NutrientChart protein={totalProtein} carbs={totalCarbs} fats={totalFats} />
                </div>
            </div>
            <div className="consistency-counter-container">
                <ConsistencyCounter meals={todayMeals} />
            </div>
            {showAddMealModal && (
                <Modal onClose={() => setShowAddMealModal(false)}>
                    <form onSubmit={handleAddMealSubmit} className="add-meal-form">
                        <select value={mealType} onChange={(e) => setMealType(e.target.value)} required>
                            <option value="">Select Meal Type</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="snack">Snack</option>
                            <option value="dinner">Dinner</option>
                            <option value="dessert">Dessert</option>
                        </select>
                        {mealType && (
                            <>
                                <input name="meal_name" value={formData.meal_name} onChange={handleAddMealChange} placeholder="Meal Name" required />
                                <input type="number" name="calories" value={formData.calories} onChange={handleAddMealChange} placeholder="Calories" required />
                                <input type="number" name="protein" value={formData.protein} onChange={handleAddMealChange} placeholder="Protein (grams)" required />
                                <input type="number" name="carbs" value={formData.carbs} onChange={handleAddMealChange} placeholder="Carbs (grams)" required />
                                <input type="number" name="fats" value={formData.fats} onChange={handleAddMealChange} placeholder="Fats (grams)" required />
                                <button type="submit" className="submit-meal-button">Submit Meal</button>
                            </>
                        )}
                    </form>
                </Modal>
            )}
            {showJournalModal && (
                <Modal onClose={() => setShowJournalModal(false)} size="large">
                    <div className="meal-entries modal-content">
                        {meals.map((meal, index) => (
                            <div key={index} className="meal-entry">
                                <h3>{meal.date_logged} - Total Calories: {meal.total_calories}</h3>
                                <button className="view-details-button" onClick={() => toggleDetails(meal.date_logged)}>
                                    {selectedDate === meal.date_logged ? 'Hide Details' : 'View Details'}
                                </button>
                                {selectedDate === meal.date_logged && (
                                    <div className="meal-details">
                                        <div>
                                            {meal.details.split(';').map((detail, idx) => {
                                                const [mealId, mealDetail] = detail.split(',', 2);
                                                return (
                                                    <p key={idx}>
                                                        {mealDetail}
                                                        <button
                                                            className="delete-meal-button"
                                                            onClick={() => handleDeleteMeal(mealId)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </p>
                                                );
                                            })}
                                        </div>
                                        <div className="meal-details-total">
                                            <p>Total Protein: {meal.total_protein}g</p>
                                            <p>Total Carbs: {meal.total_carbs}g</p>
                                            <p>Total Fats: {meal.total_fats}g</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Nutrition;
