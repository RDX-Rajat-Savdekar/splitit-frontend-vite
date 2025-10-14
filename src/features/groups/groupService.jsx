import axios from 'axios';

const API_URL = '/api/groups/';

// Get user groups
const getGroups = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get a single group
const getGroup = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + groupId, config);
  return response.data;
};

// Create a new group
const createGroup = async (groupData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, groupData, config);
  return response.data;
};

const groupService = {
  getGroups,
  getGroup,
  createGroup, // Add this
};
export default groupService;