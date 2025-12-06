import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL + '/api/users/'; // Or /api/friends/, etc.

// Get user balance
const getBalance = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'balance', config);
  return response.data;
};

// Get user's detailed, person-to-person balance
const getDetailedBalance = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'detailed-balance', config);
  return response.data;
};

const userService = {
  getBalance,
  getDetailedBalance, // Add this
};

export default userService;