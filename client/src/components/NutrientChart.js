import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './NutrientChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutrientChart = ({ protein, carbs, fats }) => {
    const total = protein + carbs + fats;
    const data = {
        labels: ['Protein', 'Carbs', 'Fats'],
        datasets: [
            {
                data: [protein, carbs, fats],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    generateLabels: (chart) => {
                        const { data } = chart;
                        return data.labels.map((label, index) => ({
                            text: `${label}: ${data.datasets[0].data[index]}g (${((data.datasets[0].data[index] / total) * 100).toFixed(2)}%)`,
                            fillStyle: data.datasets[0].backgroundColor[index],
                        }));
                    },
                },
            },
        },
    };

    return (
        <div className="nutrient-chart-container">
            <Pie data={data} options={options} />
        </div>
    );
};

export default NutrientChart;
