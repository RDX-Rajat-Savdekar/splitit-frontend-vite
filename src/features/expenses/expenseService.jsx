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
  // The expenseData object will now contain paidBy, splitType, shares, etc.
  const response = await axios.post(API_URL, expenseData, config);
  return response.data;
};

// Update an expense
const updateExpense = async (expenseId, expenseData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + expenseId, expenseData, config);
  return response.data;
};

// Delete an expense
const deleteExpense = async (expenseId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + expenseId, config);
  return response.data;
};

const expenseService = {
  getExpensesForGroup,
  addExpense,
  updateExpense, // Add this
  deleteExpense, // Add this
};
export default expenseService;