<<<<<<< HEAD
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
=======
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const username = user?.username || 'youname';

  const handleSignOut = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <nav style={{
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 3.5rem',
      backgroundColor: '#05070D',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* LEFT SIDE: Brand Logo & Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link 
          to="/" 
          style={{ 
            fontFamily: "'Cinzel', Georgia, serif", 
            fontSize: '1.35rem', 
            fontWeight: 700, 
            color: '#D97706', 
            textDecoration: 'none', 
            letterSpacing: '1px' 
          }}
        >
          CINÉVAULT
        </Link>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.92rem' }}>
          <Link 
            to="/" 
            style={{ 
              color: location.pathname === '/' ? '#D97706' : '#8B9BB4', 
              textDecoration: 'none', 
              fontWeight: location.pathname === '/' ? 600 : 400 
            }}
          >
            Films
          </Link>
          <Link 
            to="/my-bookings" 
            style={{ 
              color: location.pathname === '/my-bookings' ? '#D97706' : '#8B9BB4', 
              textDecoration: 'none', 
              fontWeight: location.pathname === '/my-bookings' ? 600 : 400 
            }}
          >
            My Bookings
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Profile & Sign Out (Pushed completely to the right end) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
            {username}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7A90', marginTop: '2px' }}>
            Member
          </div>
        </div>

        <button 
          onClick={handleSignOut} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#8B9BB4', 
            fontSize: '0.9rem', 
            cursor: 'pointer',
            padding: 0
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
