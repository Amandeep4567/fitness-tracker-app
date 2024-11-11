import axios from "axios";

// API URL (Update with your backend's URL)
const API_URL = "http://localhost:5000/api";

// Activity API Calls
export const createActivity = (activity) =>
  axios.post(`${API_URL}/activities`, activity);
export const getActivities = () => axios.get(`${API_URL}/activities`);
export const updateActivity = (id, activity) =>
  axios.put(`${API_URL}/activities/${id}`, activity);
export const deleteActivity = (id) =>
  axios.delete(`${API_URL}/activities/${id}`);

// Goal API Calls
export const createGoal = (goal) => axios.post(`${API_URL}/goals`, goal);
export const getGoals = () => axios.get(`${API_URL}/goals`);
export const updateGoal = (id, goal) =>
  axios.put(`${API_URL}/goals/${id}`, goal);
export const deleteGoal = (id) => axios.delete(`${API_URL}/goals/${id}`);
