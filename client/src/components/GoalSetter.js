import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useUser } from '../context/UserContext';
import "./GoalSetter.css";

const GoalSetter = () => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [calorieGoal, setCalorieGoal] = useState('Loading...');
    const [fitnessGoal, setFitnessGoal] = useState('Loading...');
    const [tempCalorieGoal, setTempCalorieGoal] = useState('');
    const [tempFitnessGoal, setTempFitnessGoal] = useState('');

    const fetchGoals = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/GetCalorieGoal', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch goals, status: ${response.status}`);
            }
            const data = await response.json();
            setCalorieGoal(data.calorieGoal);
            setFitnessGoal(data.fitnessGoal);
            setTempCalorieGoal(data.calorieGoal); 
            setTempFitnessGoal(data.fitnessGoal);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setCalorieGoal('Failed to fetch');
            setFitnessGoal('Failed to fetch');
        }
    }, [user.token]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const updateGoals = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/SetCalorieGoal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ calorieGoal: tempCalorieGoal, fitnessGoal: tempFitnessGoal })
            });
            if (!response.ok) {
                throw new Error('Failed to update goals');
            }
            alert('Goals updated successfully!');
            fetchGoals();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating goals:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to update your goals?')) {
            updateGoals();
        }
    };

    return (
        <div className="goal-setter-container">
            <button onClick={() => setShowModal(true)} className="set-goal-button">Edit Goals</button>
            <p>Calorie Goal: <strong>{calorieGoal}</strong></p>
            <p>Fitness Goal: <strong>{fitnessGoal}</strong></p>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit} className="goal-form">
                        <input
                            type="number"
                            value={tempCalorieGoal}
                            onChange={(e) => setTempCalorieGoal(e.target.value)}
                            placeholder="Set Calorie Goal"
                            required
                            min="1"
                        />
                        <select value={tempFitnessGoal} onChange={(e) => setTempFitnessGoal(e.target.value)} required>
                            <option value="" disabled>Select Fitness Goal</option>
                            <option value="gain">Gain Weight</option>
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                        </select>
                        <button type="submit" className="update-goal-button">Update Goals</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default GoalSetter;
