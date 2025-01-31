import React, { useState, useEffect, useCallback } from "react";
import "./Workouts.css";
import { useUser } from '../context/UserContext';
import Modal from './Modal';  
import WorkoutForm from "./WorkoutForm";
import MonthlyProgress from "./MonthlyProgess";
import WeeklyProgress from './WeeklyProgress';

const Workouts = () => {
    const { user } = useUser();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showWorkoutsModal, setShowWorkoutsModal] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [visibleWorkoutId, setVisibleWorkoutId] = useState(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState(null);


    const fetchWorkouts = useCallback(async () => {
        const url = 'http://localhost:3000/api/workouts/allWorkouts';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setWorkouts(data);
            } else {
                throw new Error('Failed to fetch workouts');
            }
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    }, [user.token]); // include all variables that the function depends on
    

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => setShowAddModal(false);
    const openWorkoutsModal = () => setShowWorkoutsModal(true);
    const closeWorkoutsModal = () => setShowWorkoutsModal(false);

    const handleSaveWorkout = async (workoutData) => {
        const url = 'http://localhost:3000/api/workouts/AddWorkout';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ exercises: workoutData })
            });
            const result = await response.json();
            if (response.ok) {
                closeAddModal();
                fetchWorkouts();
            } else {
                console.error("Failed to add workout:", result.error);
            }
        } catch (error) {
            console.error("Failed to send data:", error);
        }
    };


    const deleteWorkout = async () => {
        const url = `http://localhost:3000/api/workouts/deleteWorkout/${workoutToDelete}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                setShowDeleteConfirmModal(false);
                fetchWorkouts();
            } else {
                throw new Error('Failed to delete workout');
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const confirmDelete = (workoutId) => {
        setWorkoutToDelete(workoutId);
        setShowDeleteConfirmModal(true);
    };

    return (
        <div className="workouts-container">
            <div className="control-panel">
                <button className="workouts-modify-btn" onClick={openAddModal}>Add Workout</button>
                <button className="workouts-modify-btn" onClick={openWorkoutsModal}>Query Workouts</button>
            </div>
            <div className="progress-container">
                <div className="monthly-progress">
                    <MonthlyProgress workouts={workouts} />
                </div>
                <div className="weekly-progress">
                    <WeeklyProgress workouts={workouts} />
                </div>
            </div>
            {showAddModal && (
                <Modal onClose={closeAddModal}>
                    <WorkoutForm onSave={handleSaveWorkout} />
                </Modal>
            )}
            {showWorkoutsModal && (
                <Modal onClose={closeWorkoutsModal}>
                    <div>
                        <h2>Your Workouts</h2>
                        <ul>
                            {workouts.map(workout => (
                                <li key={workout.id}>
                                    Date: {new Date(workout.date_logged).toLocaleDateString('en-US')} - Categories: {workout.categories.join(', ')}
                                    <button onClick={() => setVisibleWorkoutId(visibleWorkoutId === workout.id ? null : workout.id)}>
                                        {visibleWorkoutId === workout.id ? 'Hide Details' : 'Show Details'}
                                    </button>
                                    <button onClick={() => confirmDelete(workout.id)}>Delete</button>
                                    {visibleWorkoutId === workout.id && workout.exercises?.length > 0 && (
                                        <ul>
                                            {workout.exercises.map((exercise, index) => (
                                                <li key={index}>
                                                    {exercise.name} - {exercise.sets} sets x {exercise.reps} reps x {exercise.weight} lbs
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                    </div>
                </Modal>
            )}
            {showDeleteConfirmModal && (
                <Modal onClose={() => setShowDeleteConfirmModal(false)}>
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this workout?</p>
                    <button onClick={deleteWorkout}>Delete</button>
                    <button onClick={() => setShowDeleteConfirmModal(false)}>Cancel</button>
                </Modal>
            )}
        </div>
    );
    
    
};

export default Workouts;
