import React, { useEffect, useState } from 'react';
import { FiHome, FiMonitor, FiClock, FiFilm, FiBookOpen, FiDollarSign } from 'react-icons/fi';
import { getDashboardStats } from '../../api/dashboard';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const cardConfig = [
  { key: 'totalTheatres', label: 'Total Theatres', icon: FiHome },
  { key: 'totalScreens', label: 'Total Screens', icon: FiMonitor },
  { key: 'todaysShows', label: "Today's Shows", icon: FiClock },
  { key: 'activeMovies', label: 'Active Movies', icon: FiFilm },
  { key: 'bookingsToday', label: 'Bookings Today', icon: FiBookOpen },
  { key: 'totalRevenue', label: 'Total Revenue', icon: FiDollarSign, isCurrency: true },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard…" />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-cine-muted">Overview of theatres, screens and today's activity.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cardConfig.map(({ key, label, icon: Icon, isCurrency }) => (
          <div key={key} className="card flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-cine-muted">{label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-white">
                {isCurrency ? `$${Number(stats[key]).toFixed(2)}` : stats[key]}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-cine-gold/10 text-2xl text-cine-gold2">
              <Icon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
