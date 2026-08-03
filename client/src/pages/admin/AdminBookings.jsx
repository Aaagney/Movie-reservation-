import React, { useEffect, useState } from 'react';
import { getBookings } from '../../api/bookings';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading bookings…" />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Bookings</h1>
      <p className="mt-1 text-cine-muted">{bookings.length} total bookings</p>

      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-white/5 text-cine-muted">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Movie</th>
              <th className="px-5 py-3">Theatre</th>
              <th className="px-5 py-3">Show</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                <td className="px-5 py-3 text-cine-muted">#{b.id}</td>
                <td className="px-5 py-3 text-white">{b.user_name}</td>
                <td className="px-5 py-3 text-white">{b.movie_title}</td>
                <td className="px-5 py-3 text-cine-muted">{b.theatre_name}</td>
                <td className="px-5 py-3 text-cine-muted">{b.show_date} · {b.start_time?.slice(0, 5)}</td>
                <td className="px-5 py-3 text-cine-gold2">${Number(b.total_amount).toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${b.booking_status === 'confirmed' ? 'bg-cine-gold/10 text-cine-gold2' : 'bg-red-500/10 text-red-400'}`}>
                    {b.booking_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
