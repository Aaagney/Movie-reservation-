import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export const createPayment = async (paymentData) => {
  const response = await axios.post(API_URL, paymentData);

  return response.data;
};

export const getPaymentByBookingId = async (bookingId) => {
  const response = await axios.get(
    `${API_URL}/booking/${bookingId}`
  );

  return response.data;
};