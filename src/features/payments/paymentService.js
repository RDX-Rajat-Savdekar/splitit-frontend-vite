import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/payments/';

// Record a new payment (Settle Up)
const addPayment = async (paymentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, paymentData, config);
  return response.data;
};

const paymentService = {
  addPayment,
};

export default paymentService;