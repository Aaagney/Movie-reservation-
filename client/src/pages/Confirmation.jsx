// Confirmation.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const b = state?.booking;

  return (
    <div className="catalog-container" style={{ maxWidth: '500px', textAlign: 'center' }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--status-green)', color: 'var(--status-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>✓</div>
      <h1 className="cine-font">Booking Confirmed</h1>

      <div style={{ background: '#0F172A', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1.5rem', margin: '2rem 0' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-muted)' }}>BOOKING REFERENCE</p>
        <h2 style={{ color: 'var(--accent-gold)', fontSize: '2rem', letterSpacing: '3px', margin: '0.5rem 0 1.5rem' }}>{b?.booking_code || 'BKSSUD66'}</h2>

        <div style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'grid', gap: '0.5rem' }}>
          <div>Film: <strong style={{ color: '#fff' }}>{b?.movie_title}</strong></div>
          <div>Seats: <strong style={{ color: '#fff' }}>{b?.seats}</strong></div>
          <div>Total Charged: <strong style={{ color: 'var(--accent-gold)' }}>${b?.total_amount}</strong></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/my-bookings')} style={{ flex: 1, padding: '0.8rem', background: '#1E293B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>My Bookings</button>
        <button onClick={() => navigate('/')} className="btn-gold" style={{ flex: 1 }}>Browse Films</button>
      </div>

      <div className="toast-msg">Booking confirmed! Enjoy the show.</div>
    </div>
  );
};

export default Confirmation;