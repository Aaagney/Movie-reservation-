import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

// Get all successful payments
export const getMyBookings = async () => {
  const response = await axios.get(API_URL);

  const payments = response.data.data;

  return payments.map((payment) => ({
    bookingId: payment.booking_id,

    // Temporary until Booking API is connected
    movieTitle: "The Venetian Heist",
    screen: "Premiere Suite",
    seats: ["F11"],

    date: payment.paid_at
      ? new Date(payment.paid_at).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "—",

    time: payment.paid_at
      ? new Date(payment.paid_at).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "—",

    status: payment.payment_status,

    subtotal: Number(payment.amount),
    serviceFee: Number(payment.service_fee),
    totalAmount: Number(payment.total_amount),

    transactionId: payment.transaction_id,
    invoiceNumber: payment.invoice_number,
  }));
};