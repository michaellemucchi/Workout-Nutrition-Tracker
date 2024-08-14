import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import './CaloriesChart.css';

const CaloriesChart = ({ totalCalories, goalCalories }) => {
    const [chartData, setChartData] = useState([
        ['Calories', 'Amount'],
        ['Consumed', totalCalories],
        ['Remaining', Math.max(0, goalCalories - totalCalories)]
    ]);

    useEffect(() => {
        setChartData([
            ['Calories', 'Amount'],
            ['Consumed', totalCalories],
            ['Remaining', Math.max(0, goalCalories - totalCalories)]
        ]);
    }, [totalCalories, goalCalories]);

    return (
        <div className="calories-chart-container">
            <Chart
                chartType="PieChart"
                data={chartData}
                options={{
                    title: 'Calorie Consumption',
                    pieHole: 0.4,
                    slices: [
                        { color: '#8ad1c2' },
                        { color: '#e1e1e1' }
                    ],
                    chartArea: { width: '90%', height: '75%' },
                }}
                width="100%"
                height="200px"
            />
        </div>
    );
};

export default CaloriesChart;
