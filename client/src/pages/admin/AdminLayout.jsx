import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiFilm, FiHome, FiMonitor, FiClock, FiBookOpen, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/movies', label: 'Movies', icon: FiFilm },
  { to: '/admin/theatres', label: 'Theatres', icon: FiHome },
  { to: '/admin/screens', label: 'Screens', icon: FiMonitor },
  { to: '/admin/showtimes', label: 'Showtimes', icon: FiClock },
  { to: '/admin/bookings', label: 'Bookings', icon: FiBookOpen },
];

export default function AdminLayout() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-cine-black">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-cine-panel md:flex md:flex-col">
        <div className="px-6 py-6 font-display text-xl">
          <span className="gold-text">CINÉ</span>VAULT
          <p className="mt-0.5 text-xs font-normal tracking-wider text-cine-muted">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-cine-gold/15 text-cine-gold2' : 'text-cine-muted hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mx-3 mb-6 flex items-center gap-3 rounded-xl2 px-4 py-3 text-sm font-medium text-cine-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
