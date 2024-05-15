import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchUserProfile = () => api.get('/users/profile');
export const changeUserPassword = (data) => api.put('/users/changePassword', data);
export const fetchMealById = (id) => api.get(`/meals/${id}`);