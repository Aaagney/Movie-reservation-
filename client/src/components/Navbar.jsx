import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-cine-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide">
          <span className="gold-text">CINÉ</span>
          <span className="text-white">VAULT</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-cine-muted md:flex">
          <Link to="/" className="transition-colors hover:text-cine-gold2">Films</Link>
          <Link to="/theatres" className="transition-colors hover:text-cine-gold2">Theatres</Link>
          {user && (
            <Link to="/my-bookings" className="transition-colors hover:text-cine-gold2">My Bookings</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="transition-colors hover:text-cine-gold2">Admin</Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-cine-muted">
                <FiUser className="text-cine-gold2" /> {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-sm">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-gold !px-6 !py-2 text-sm">Sign In</Link>
          )}
        </div>

        <button className="text-2xl text-cine-gold2 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-cine-black px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm text-cine-muted">
            <Link to="/" onClick={() => setOpen(false)}>Films</Link>
            <Link to="/theatres" onClick={() => setOpen(false)}>Theatres</Link>
            {user && <Link to="/my-bookings" onClick={() => setOpen(false)}>My Bookings</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
            {user ? (
              <button onClick={handleLogout} className="btn-outline w-full justify-center">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-gold w-full justify-center">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
