import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isToday, isPast, format } from 'date-fns';
import './MonthlyProgress.css';  // Make sure to create a CSS file for specific styling

const MonthlyProgress = ({ workouts }) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        const daysInterval = eachDayOfInterval({ start, end });
        setDays(daysInterval.map(day => ({
            date: day,
            workoutStatus: workouts.find(w => new Date(w.date_logged).toDateString() === day.toDateString()) ? 'done' : isPast(day) && !isToday(day) ? 'missed' : 'upcoming'
        })));
    }, [workouts]);

    return (
        <div className="calendar">
            <h2>{format(new Date(), 'MMMM yyyy')}</h2>
            <div className="calendar-grid">
                {days.map(day => (
                    <div key={day.date} className={`day ${day.workoutStatus}`}>
                        {day.date.getDate()}
                        <span>{day.workoutStatus === 'done' ? '✅' : day.workoutStatus === 'missed' ? '❌' : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyProgress;
