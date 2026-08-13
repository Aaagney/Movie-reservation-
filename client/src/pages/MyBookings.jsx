import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../services/api';

export const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = user?.username || 'youname';

  const fetchBookings = () => {
    if (!username) {
      setLoading(false);
      return;
    }

    getUserBookings(username)
      .then(res => {
        setBookings(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch bookings:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [username]);

  const handleCancel = async (bookingId) => {
    if (!bookingId) return;

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        setBookings(prev =>
          prev.map(item =>
            (item.id === bookingId || item.booking_code === bookingId)
              ? { ...item, status: 'CANCELLED' }
              : item
          )
        );
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        alert('Could not cancel booking.');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#05080E', color: '#8A99AD', padding: '3rem', textAlign: 'center' }}>
        Loading your bookings...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#05080E', minHeight: '100vh', color: '#FFFFFF', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.4rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', color: '#FFFFFF' }}>
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div style={{ color: '#8A99AD', textAlign: 'center', padding: '3rem' }}>
            You have no active movie bookings.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map((b) => {
              const targetId = b.id || b.booking_code;

              // Extract saved date/time or format DB timestamp
              let displayShowtime = b.showtime_label;
              if (!displayShowtime && b.created_at) {
                const dateObj = new Date(b.created_at);
                displayShowtime = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + 
                                  ' · ' + 
                                  dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              }

              return (
                <div 
                  key={targetId}
                  style={{
                    background: '#0D131F',
                    border: '1px solid #1E293B',
                    borderRadius: '16px',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <img 
                      src={b.poster_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300"} 
                      alt={b.movie_title || 'Movie Poster'} 
                      style={{ width: '70px', height: '100px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#FFFFFF' }}>
                        {b.movie_title || 'Untitled Movie'}
                      </h2>

                      {/* Displaying Saved Date & Time */}
                      <div style={{ fontSize: '0.88rem', color: '#8A99AD', marginBottom: '0.2rem', fontWeight: 500 }}>
                        {b.hall_name || 'Grand Hall'} · <span style={{ color: '#EAB308' }}>{displayShowtime || 'Time Not Available'}</span>
                      </div>

                      <div style={{ fontSize: '0.88rem', color: '#8A99AD', marginBottom: '0.75rem' }}>
                        Seats: {b.seats || 'Unassigned'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          background: b.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: b.status === 'CANCELLED' ? '#EF4444' : '#22C55E',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          letterSpacing: '0.5px'
                        }}>
                          {b.status || 'CONFIRMED'}
                        </span>

                        <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>
                          Code: <strong style={{ color: '#FFF' }}>{b.booking_code || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#EAB308' }}>
                      ${parseFloat(b.total_amount || 0).toFixed(2)}
                    </div>

                    {b.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => handleCancel(targetId)}
                        style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;