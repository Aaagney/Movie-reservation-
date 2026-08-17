import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { showtime, seats, total } = location.state || {};

  if (!showtime) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center text-cine-muted">
        No booking in progress. <button className="text-cine-gold2 underline" onClick={() => navigate('/')}>Go to films</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await createBooking({
        user_id: user.id,
        showtime_id: showtime.id,
        seat_ids: seats.map((s) => s.id),
      });
      navigate(`/booking/success/${res.data.booking_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-white">Booking Summary</h1>

      <div className="card mt-8 space-y-4 p-6">
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Show Date</span>
          <span className="text-white">{showtime.show_date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Start Time</span>
          <span className="text-white">{showtime.start_time?.slice(0, 5)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Format</span>
          <span className="text-white">{showtime.format}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Seats</span>
          <span className="text-white">
            {seats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')}
          </span>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="font-display text-xl font-bold text-cine-gold2">${total.toFixed(2)}</span>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button onClick={handleConfirm} disabled={submitting} className="btn-gold mt-8 w-full disabled:opacity-50">
        {submitting ? 'Confirming…' : 'Confirm Booking'}
      </button>
    </div>
  );
}
