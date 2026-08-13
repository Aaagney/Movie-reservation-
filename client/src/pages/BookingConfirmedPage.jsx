import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentByBookingId } from "../services/paymentService";
import "./BookingConfirmedPage.css";

function BookingConfirmedPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);

        const response = await getPaymentByBookingId(bookingId);

        setPayment(response.data);
      } catch (err) {
        console.error("Failed to load booking:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-state">
          Loading booking...
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-state confirmation-error">
          {error || "Booking details not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="confirmation-page">
      <div className="confirmation-container">

        {/* Success icon */}
        <div className="success-icon">
          ✓
        </div>

        {/* Heading */}
        <h1>Booking Confirmed</h1>

        <p className="confirmation-subtitle">
          Your seats are reserved. Enjoy the show!
        </p>

        {/* Booking reference */}
        <div className="booking-reference-box">
          <span>BOOKING REFERENCE</span>

          <strong>
            {payment.booking_id}
          </strong>
        </div>

        {/* Booking details */}
        <div className="confirmation-details">

          <div className="confirmation-row">
            <span>Film</span>
            <strong>Neon Horizon</strong>
          </div>

          <div className="confirmation-row">
            <span>Date</span>
            <strong>Saturday, August 8</strong>
          </div>

          <div className="confirmation-row">
            <span>Time</span>
            <strong>7:30 PM</strong>
          </div>

          <div className="confirmation-row">
            <span>Seats</span>
            <strong>F7, F8</strong>
          </div>

          <div className="confirmation-divider" />

          <div className="confirmation-row">
            <span>Tickets</span>

            <strong>
              ${Number(payment.amount).toFixed(2)}
            </strong>
          </div>

          <div className="confirmation-row">
            <span>Service fee</span>

            <strong>
              ${Number(payment.service_fee).toFixed(2)}
            </strong>
          </div>

          <div className="confirmation-divider" />

          <div className="confirmation-total">
            <span>Total</span>

            <strong>
              ${Number(payment.total_amount).toFixed(2)}
            </strong>
          </div>

        </div>

        {/* Invoice reference */}
        {payment.invoice_number && (
          <div className="invoice-reference">
            Invoice: {payment.invoice_number}
          </div>
        )}

        {/* Actions */}
        <div className="confirmation-actions">

          <button
            className="primary-confirmation-button"
            type="button"
            onClick={() => navigate("/bookings")}
          >
            View My Bookings
          </button>

          <button
            className="secondary-confirmation-button"
            type="button"
            onClick={() =>
              navigate(`/invoice/${payment.booking_id}`)
            }
          >
            Download Invoice
          </button>

          <button
            className="secondary-confirmation-button"
            type="button"
            onClick={() => navigate("/films")}
          >
            Browse More Films
          </button>

        </div>

      </div>
    </main>
  );
}

export default BookingConfirmedPage;