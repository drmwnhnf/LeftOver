import axios from "axios";

const API_URL = "http://localhost:5173/api"; // Update to your backend URL

// Login
export const login = async (credentials) => {
  return axios.post(`${API_URL}/account/login`, credentials);
};

// Register
export const register = async (userData) => {
  return axios.post(`${API_URL}/account/register`, userData);
};

// Fetch all items (Example for "Read")
export const fetchItems = async () => {
  return axios.get(`${API_URL}/items`);
};

// Create item
export const createItem = async (data) => {
  return axios.post(`${API_URL}/items`, data);
};

// Update item
export const updateItem = async (id, data) => {
  return axios.put(`${API_URL}/items/${id}`, data);
};

// Delete item
export const deleteItem = async (id) => {
  return axios.delete(`${API_URL}/items/${id}`);
};