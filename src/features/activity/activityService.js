import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL + '/api/activity/';

// Get overall activity feed
const getOverallActivity = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get activity feed for a specific group
const getGroupActivity = async (groupId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + groupId, config);
  return response.data;
};

const activityService = {
  getOverallActivity,
  getGroupActivity,
};

export default activityService;