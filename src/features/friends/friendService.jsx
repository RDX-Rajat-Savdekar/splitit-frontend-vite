import axios from 'axios';

const API_URL = '/api/friends/';

// Get user friends
const getFriends = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Add a new friend
const addFriend = async (friendData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, friendData, config);
  return response.data;
};

const friendService = {
  getFriends,
  addFriend, // Add this
};


export default friendService;