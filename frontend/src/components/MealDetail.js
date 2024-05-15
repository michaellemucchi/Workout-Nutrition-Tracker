import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMealById } from '../apiService';

function MealDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    fetchMealById(id).then(response => {
      setMeal(response.data);
    });
  }, [id]);

  if (!meal) return <div>Loading...</div>;

  return (
    <div>
      <h1>{meal.name}</h1>
      <p>{meal.description}</p>
      {/* Add more meal details here */}
    </div>
  );
}

export default MealDetail;
