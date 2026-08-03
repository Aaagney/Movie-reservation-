import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getBookingById } from '../api/bookings';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingById(bookingId).then(setBooking).finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <LoadingSpinner label="Confirming your booking…" />;
  if (!booking) return <p className="py-24 text-center text-cine-muted">Booking not found.</p>;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <FiCheckCircle className="mx-auto text-6xl text-cine-gold" />
      <h1 className="mt-6 font-display text-3xl font-bold text-white">Booking Confirmed!</h1>
      <p className="mt-2 text-cine-muted">Your tickets for {booking.movie_title} are ready.</p>

      <div className="card mt-8 space-y-3 p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Booking ID</span>
          <span className="text-white">#{booking.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Theatre</span>
          <span className="text-white">{booking.theatre_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Screen</span>
          <span className="text-white">{booking.screen_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Date / Time</span>
          <span className="text-white">{booking.show_date} · {booking.start_time?.slice(0, 5)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cine-muted">Seats</span>
          <span className="text-white">{booking.seats.map((s) => `${s.seat_row}${s.seat_number}`).join(', ')}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between">
          <span className="font-semibold text-white">Total Paid</span>
          <span className="font-display text-xl font-bold text-cine-gold2">${Number(booking.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="btn-gold mt-8 inline-flex">Back to Films</Link>
    </div>
  );
}
