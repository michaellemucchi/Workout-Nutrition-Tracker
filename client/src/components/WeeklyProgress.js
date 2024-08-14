import React from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isFuture, isToday, isPast } from 'date-fns';
import './WeeklyProgress.css'; 

const WeeklyProgress = ({ workouts = [] }) => {  // Added default value for workouts
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const dailyWorkouts = days.map(day => {
        const workoutsForDay = workouts.filter(w => new Date(w.date_logged).toDateString() === day.toDateString());
        return {
            date: format(day, 'EEEE'),
            workouts: workoutsForDay,
            status: isFuture(day) ? 'future' :
                    (workoutsForDay.length > 0 ? 'done' : 
                    (isPast(day) || isToday(day) ? 'missed' : ''))
        };
    });

    return (
        <div className="weekly-checker">
            {dailyWorkouts.map(day => (
                <div key={day.date} className={`day-status ${day.status}`}>
                    <div className="day-info">
                        <strong>{day.date}</strong>
                        {day.workouts.length > 0 && day.workouts.map((w, idx) => (
                            <p key={idx}>{w.categories.join(', ')}</p>
                        ))}
                    </div>
                    <span>{day.status === 'done' ? '✅' : (day.status === 'missed' ? '❌' : (day.status === 'future' ? '🔜' : ''))}</span>
                </div>
            ))}
        </div>
    );
};

export default WeeklyProgress;
