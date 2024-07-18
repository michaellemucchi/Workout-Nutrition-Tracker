import React, { useState } from 'react';

const exercisesByCategory = {
    chest: ["Bench Press", "Incline Bench Press", "Chest Flies"],
    back: ["Pull Ups", "Lat Pull Down", "Deadlift"],
    shoulders: ["Shoulder Press", "Lateral Raises"],
    biceps: ["Bicep Curl", "Hammer Curl"],
    triceps: ["Tricep Extension", "Tricep Dip"],
    legs: ["Squats", "Leg Press"],
    core: ["Planks", "Sit Ups"],
    cardio: ["Running", "Cycling"]
};

const WorkoutForm = ({ onSave }) => {
    const [exercises, setExercises] = useState([{ category: '', exercise: '', sets: '', reps: '', weight: '' }]);

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const addExercise = () => {
        setExercises([...exercises, { category: '', exercise: '', sets: '', reps: '', weight: '' }]);
    };

    const removeLastExercise = () => {
        setExercises(exercises.slice(0, -1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(exercises);
    };

    return (
        <form onSubmit={handleSubmit} className="workout-form">
            {exercises.map((exercise, index) => (
                <div key={index} className="exercise-entry">
                    <select
                        value={exercise.category}
                        onChange={(e) => handleExerciseChange(index, 'category', e.target.value)}
                        required>
                        <option value="">Select Category</option>
                        {Object.keys(exercisesByCategory).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {exercise.category && (
                        <>
                            <select
                                value={exercise.exercise}
                                onChange={(e) => handleExerciseChange(index, 'exercise', e.target.value)}
                                required>
                                <option value="">Select Exercise</option>
                                {exercisesByCategory[exercise.category].map(exercise => (
                                    <option key={exercise} value={exercise}>{exercise}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                placeholder="Sets"
                                required
                            />
                            <input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                                placeholder="Reps"
                                required
                            />
                            <input
                                type="number"
                                value={exercise.weight}
                                onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                                placeholder="Weight"
                                required
                            />
                        </>
                    )}
                </div>
            ))}
            <button type="button" onClick={addExercise}>Add Another Exercise</button>
            <button type="button" onClick={removeLastExercise}>Remove Last Exercise</button>
            <button type="submit">Save Workout</button>
        </form>
    );
};

export default WorkoutForm;
