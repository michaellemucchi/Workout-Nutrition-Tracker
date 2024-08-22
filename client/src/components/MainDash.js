import React, { useState, useEffect } from 'react';
import ConsistencyCounter from './ConsistencyCounter';
import CaloriesChart from './CaloriesChart';
import WeeklyProgress from './WeeklyProgress';
import Achievements from './Achievements';
import { useUser } from '../context/UserContext';
import person from '../images/person.png';
import './MainDash.css';

const MainDash = () => {
    const { user } = useUser();
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [goalCalories, setGoalCalories] = useState(2000);
    const [profilePhoto, setProfilePhoto] = useState(person);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                const data = await response.json();
                if (data.profilePicture) {
                    setProfilePhoto(data.profilePicture);
                }
            } catch (error) {
                console.error('Failed to fetch profile photo:', error);
            }
        };

        const fetchWorkouts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/workouts/allWorkouts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                const data = await response.json();
                setWorkouts(data);
            } catch (error) {
                console.error('Failed to fetch workouts:', error);
            }
        };

        const fetchMeals = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/meals/MealsToday', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                const data = await response.json();
                setMeals(data);
            } catch (error) {
                console.error('Failed to fetch meals:', error);
            }
        };

        const fetchGoalCalories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/GetCalorieGoal', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                const data = await response.json();
                setGoalCalories(data.calorieGoal);
            } catch (error) {
                console.error('Failed to fetch calorie goal:', error);
            }
        };

        fetchProfile();
        fetchWorkouts();
        fetchMeals();
        fetchGoalCalories();
    }, [user.token]);

    const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);

    return (
        <div className="dashboard">
            <h2>Welcome to your dashboard!</h2>

            <div className="dashboard-grid">
                {/* Profile Photo */}
                <div className="dashboard-item profile-item">
                    <img 
                        src={profilePhoto || person} 
                        alt="Profile" 
                        className="profile-photo" 
                    />
                    <h4>{user.name}</h4>
                </div>

                {/* Consistency Counter */}
                <div className="dashboard-item consistency-item">
                    <ConsistencyCounter meals={meals} />
                </div>

                {/* Calorie Chart */}
                <div className="dashboard-item calorie-item">
                    <CaloriesChart totalCalories={totalCalories} goalCalories={goalCalories} />
                </div>

                {/* Workouts of the Week */}
                <div className="dashboard-item weekly-item">
                    <h4>Workouts of the Week</h4>
                    <WeeklyProgress workouts={workouts} />
                </div>

                {/* Achievements */}
                <div className="dashboard-item achievements-item">
                    <Achievements workouts={workouts} meals={meals} />
                </div>

                {/* Add Friend Section */}
                <div className="dashboard-item add-friend-item">
                    <h4>Add a Friend</h4>
                    <form>
                        <input type="text" placeholder="Friend's Username" />
                        <button type="submit">Add Friend</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MainDash;
