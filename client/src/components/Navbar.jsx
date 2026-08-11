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