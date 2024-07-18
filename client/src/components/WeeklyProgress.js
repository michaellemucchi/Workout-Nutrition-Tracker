import React from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isFuture } from 'date-fns';
import './WeeklyProgress.css';  // Ensure this CSS file is also created for specific styling

const WeeklyProgress = ({ workouts }) => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const end = endOfWeek(new Date(), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const dailyWorkouts = days.map(day => ({
        date: format(day, 'EEEE'),
        workouts: workouts.filter(w => new Date(w.date_logged).toDateString() === day.toDateString()),
        status: isFuture(day) ? 'future' : workouts.some(w => new Date(w.date_logged).toDateString() === day.toDateString()) ? 'done' : 'missed'
    }));

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
                    <span>{day.status === 'done' ? '✅' : day.status === 'missed' ? '❌' : ''}</span>
                </div>
            ))}
        </div>
    );
};

export default WeeklyProgress;
