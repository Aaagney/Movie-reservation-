import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, totalPrice } = location.state || {};

  const serviceFee = Number((totalPrice * 0.05).toFixed(1));
  const grandTotal = totalPrice + serviceFee;

  return (
    <div className="catalog-container" style={{ maxWidth: '500px' }}>
      <h1 className="cine-font" style={{ textAlign: 'center' }}>Order Summary</h1>

      <div style={{ background: '#0F172A', border: '1px solid var(--border-dark)', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <img src={movie?.poster_url} alt="" style={{ width: '70px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <h3 style={{ margin: 0 }}>{movie?.title || 'Neon Frontier'}</h3>
            <p style={{ margin: '0.3rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{showtime?.hall_name || 'Grand Hall'}</p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mon, Jul 27 · 2:30 PM</p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-dark)', margin: '1.5rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'var(--text-muted)' }}>
          <span>Seats</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{selectedSeats?.join(', ') || 'G8, G9'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'var(--text-muted)' }}>
          <span>2 × $16</span>
          <span style={{ color: '#fff' }}>${totalPrice || 32}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'var(--text-muted)' }}>
          <span>Service fee (5%)</span>
          <span style={{ color: '#fff' }}>${serviceFee}</span>
        </div>

        <hr style={{ borderColor: 'var(--border-dark)', margin: '1rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent-gold)' }}>${grandTotal}</span>
        </div>
      </div>

      <button 
        className="btn-gold" 
        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
        onClick={() => navigate('/payment', { state: { movie, showtime, selectedSeats, grandTotal } })}
      >
        Proceed to Payment →
      </button>
    </div>
  );
};

export default OrderSummary;