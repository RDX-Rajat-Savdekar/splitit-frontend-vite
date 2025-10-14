import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/expenses/';

// Get expenses for a specific group
const getExpensesForGroup = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'group/' + groupId, config);
  return response.data;
};

// Add a new expense
const addExpense = async (expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, expenseData, config);
  return response.data;
};

const expenseService = {
  getExpensesForGroup,
  addExpense, // Add this
};

export default expenseService;