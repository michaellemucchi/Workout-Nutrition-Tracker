import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './CaloriesChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CalorieChart = ({ totalCalories, goalCalories }) => {
    const percentage = Math.min((totalCalories / goalCalories) * 100, 100);
    const data = {
        labels: ['Consumed', 'Remaining'],
        datasets: [
            {
                data: [totalCalories, Math.max(goalCalories - totalCalories, 0)],
                backgroundColor: ['#4CAF50', '#E0E0E0'],
                hoverBackgroundColor: ['#45a049', '#D5D5D5'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="calorie-chart-container">
            <Doughnut data={data} options={options} />
            <div className="calorie-chart-text">
                <div className="calorie-percentage">{percentage.toFixed(2)}%</div>
                <div className="calorie-count">{totalCalories} / {goalCalories} cal</div>
            </div>
        </div>
    );
};

export default CalorieChart;
