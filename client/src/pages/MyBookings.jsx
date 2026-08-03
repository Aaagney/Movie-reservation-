import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getBookings } from '../api/bookings';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getBookings({ user_id: user.id }).then(setBookings).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <LoadingSpinner label="Loading your bookings…" />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-white">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="mt-10 text-cine-muted">
          No bookings yet. <Link to="/" className="text-cine-gold2 underline">Browse films</Link>
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="card flex items-center gap-4 p-4">
              <img src={b.poster_url} alt={b.movie_title} className="h-24 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-white">{b.movie_title}</p>
                <p className="text-sm text-cine-muted">{b.theatre_name} · {b.show_date} · {b.start_time?.slice(0, 5)}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-cine-gold2">{b.booking_status}</p>
              </div>
              <p className="font-display font-bold text-cine-gold2">${Number(b.total_amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
