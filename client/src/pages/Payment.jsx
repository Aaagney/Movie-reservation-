import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, grandTotal } = location.state || {};

  // Form State
  const [cardNumber, setCardNumber] = useState('1234 5678 9012 3456');
  const [cardHolder, setCardHolder] = useState('youname');
  const [expiry, setExpiry] = useState('08/27');
  const [cvv, setCvv] = useState('•••');
  const [loading, setLoading] = useState(false);

  // Countdown timer: 08:28 -> 508 seconds
  const [timeLeft, setTimeLeft] = useState(508);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format seats list safely
    const seatsFormatted = Array.isArray(selectedSeats)
      ? selectedSeats.join(', ')
      : selectedSeats || 'Unassigned';

    const bookingCode = 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate dynamic live date/time fallback if showtime object is incomplete
    const now = new Date();
    const liveDate = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const liveTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Flexible extraction of real showtime string
    let resolvedShowtime = `${liveDate} · ${liveTime}`;
    if (typeof showtime === 'string' && showtime.trim() !== '') {
      resolvedShowtime = showtime;
    } else if (showtime?.showtime_label) {
      resolvedShowtime = showtime.showtime_label;
    } else if (showtime?.time_label) {
      resolvedShowtime = `${showtime.date_label || liveDate} · ${showtime.time_label}`;
    } else if (showtime?.time) {
      resolvedShowtime = `${showtime.date || liveDate} · ${showtime.time}`;
    } else if (showtime?.show_time) {
      resolvedShowtime = showtime.show_time;
    }

    const payload = {
      booking_code: bookingCode,
      user_name: cardHolder || 'youname',
      movie_title: movie?.title || 'Selected Movie',
      hall_name: showtime?.hall_name || 'Grand Hall',
      showtime_label: resolvedShowtime,
      seats: seatsFormatted,
      total_amount: grandTotal || 0.0,
      poster_url: movie?.poster_url || ''
    };

    try {
      await axios.post('http://localhost:5000/api/bookings', payload);
      setLoading(false);
      navigate('/confirmation', { state: { booking: payload } });
    } catch (err) {
      setLoading(false);
      console.error('Payment Error:', err);
      alert('Payment execution failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const totalDisplay = grandTotal ? Number(grandTotal).toFixed(2) : '0.00';

  return (
    <div style={{ backgroundColor: '#080C14', minHeight: '100vh', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Main Container */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        
        {/* Back Link */}
        <Link to="/summary" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Order Summary
        </Link>

        {/* Title Header with Countdown Timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', margin: 0, fontWeight: 700 }}>Payment</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#171B26', border: '1px solid #D4982B', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#E5A93C', fontSize: '0.85rem', fontWeight: 600 }}>
            <span>⏱</span>
            <span>Seats held for {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Visual Payment Card Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #1C2738 0%, #0F172A 100%)',
          border: '1px solid #2A364F',
          borderRadius: '16px',
          padding: '1.8rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '1.5px', color: '#94A3B8', fontWeight: 600, marginBottom: '1.5rem' }}>
            PAYMENT CARD
          </div>
          <div style={{ fontSize: '1.3rem', letterSpacing: '3px', fontFamily: 'monospace', color: '#F8FAFC', marginBottom: '2rem' }}>
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.7rem', marginBottom: '0.2rem' }}>Card Holder</div>
              <div style={{ color: '#FFF', fontWeight: 700, textTransform: 'uppercase' }}>{cardHolder || 'YOUNAME'}</div>
            </div>
            <div>
              <div style={{ color: '#64748B', fontSize: '0.7rem', marginBottom: '0.2rem' }}>Expires</div>
              <div style={{ color: '#FFF', fontWeight: 700 }}>{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Card Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '1px', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem' }}>
              CARD NUMBER
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{
                width: '100%',
                background: '#0B111E',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: '#FFF',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '1px', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem' }}>
              CARDHOLDER NAME
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              style={{
                width: '100%',
                background: '#0B111E',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: '#FFF',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Expiry & CVV Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '1px', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem' }}>
                EXPIRY (MM/YY)
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0B111E',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '1px', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem' }}>
                CVV
              </label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
                style={{
                  width: '100%',
                  background: '#0B111E',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: '#FFF',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Security Banner */}
          <div style={{
            background: 'rgba(6, 78, 59, 0.2)',
            border: '1px solid #059669',
            borderRadius: '8px',
            padding: '0.8rem 1rem',
            color: '#10B981',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: '0.5rem'
          }}>
            <span>🔒</span>
            <span>Payments are end-to-end encrypted and processed securely. (Demo — no real charge.)</span>
          </div>

          {/* Submit Gold Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#D4982B',
              color: '#000',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : `Pay $${totalDisplay} & Confirm`}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Payment;