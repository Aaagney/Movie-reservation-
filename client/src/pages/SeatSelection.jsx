import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, showtime } = location.state || {};

  // State
  const [reservedSeats, setReservedSeats] = useState([]); // Locked seats from DB
  const [selectedSeats, setSelectedSeats] = useState([]); // Currently picked by user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const cols = Array.from({ length: 12 }, (_, i) => i + 1);

  const movieTitle = movie?.title || 'Neon Frontier';
  const showtimeLabel = showtime?.time_label || '2:30 PM';
  const pricePerSeat = showtime?.price || 16;
  const totalPrice = selectedSeats.length * pricePerSeat;

  // Color Definitions for consistent rendering
  const SEAT_COLORS = {
    available: {
      bg: '#1e293b',
      border: '1px solid #475569',
      color: '#ffffff'
    },
    selected: {
      bg: 'var(--accent-gold, #f59e0b)',
      border: '1px solid #fbbf24',
      color: '#000000'
    },
    reserved: {
      bg: '#ef4444', // Crimson Red for booked seats
      border: '1px solid #dc2626',
      color: '#ffffff'
    }
  };

  // 1. Fetch reserved seats from database on mount or when movie/showtime changes
  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/bookings/reserved`, {
          params: {
            movie_title: movieTitle,
            showtime_label: showtimeLabel
          }
        });

        if (response.data && response.data.reservedSeats) {
          setReservedSeats(response.data.reservedSeats);
        }
      } catch (err) {
        console.error('Failed to fetch reserved seats from DB:', err);
        setError('Could not sync reserved seats. Showing local availability.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservedSeats();
  }, [movieTitle, showtimeLabel]);

  // 2. Toggle seat selection (Prevents picking already-booked seats)
  const toggleSeat = (seatId) => {
    if (reservedSeats.includes(seatId)) return; // Block reserved seats

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // Helper function to get exact seat style based on status
  const getSeatStyle = (isReserved, isSelected) => {
    if (isReserved) {
      return {
        background: SEAT_COLORS.reserved.bg,
        border: SEAT_COLORS.reserved.border,
        opacity: 0.65,
        cursor: 'not-allowed'
      };
    }
    if (isSelected) {
      return {
        background: SEAT_COLORS.selected.bg,
        border: SEAT_COLORS.selected.border,
        boxShadow: '0 0 10px var(--accent-gold, #f59e0b)',
        cursor: 'pointer'
      };
    }
    return {
      background: SEAT_COLORS.available.bg,
      border: SEAT_COLORS.available.border,
      cursor: 'pointer'
    };
  };

  return (
    <div className="catalog-container" style={{ textAlign: 'center', paddingBottom: '100px' }}>
      <h1 className="cine-font">{movieTitle}</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        {showtime?.hall_name || 'Grand Hall'} · Mon, Jul 27 · {showtimeLabel} ·{' '}
        <span style={{ color: 'var(--accent-gold)' }}>${pricePerSeat} / seat</span>
      </p>

      {/* Screen Bar */}
      <div
        style={{
          margin: '2rem auto 1rem',
          width: '60%',
          height: '4px',
          background: 'var(--accent-gold)',
          borderRadius: '2px',
          boxShadow: '0 0 15px var(--accent-gold)'
        }}
      ></div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>SCREEN</p>

      {/* Legend with matching seat colors */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '1rem 0', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: SEAT_COLORS.available.bg, border: SEAT_COLORS.available.border, display: 'inline-block' }}></span> Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: SEAT_COLORS.selected.bg, border: SEAT_COLORS.selected.border, display: 'inline-block' }}></span> Selected
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: SEAT_COLORS.reserved.bg, border: SEAT_COLORS.reserved.border, opacity: 0.65, display: 'inline-block' }}></span> Reserved
        </div>
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', margin: '3rem 0' }}>Syncing seat availability with database...</p>
      ) : (
        <div style={{ display: 'inline-block', margin: '1.5rem 0' }}>
          {rows.map((row) => (
            <div key={row} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
              <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{row}</span>
              {cols.map((col) => {
                const seatId = `${row}${col}`;
                const isReserved = reservedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                const seatStyle = getSeatStyle(isReserved, isSelected);

                return (
                  <button
                    key={seatId}
                    disabled={isReserved}
                    title={isReserved ? `Seat ${seatId} is already booked` : `Seat ${seatId}`}
                    className={`seat-btn ${isSelected ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
                    onClick={() => toggleSeat(seatId)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      ...seatStyle
                    }}
                  />
                );
              })}
              <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{row}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0F172A',
          borderTop: '1px solid var(--border-dark)',
          padding: '1rem 4rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {selectedSeats.length} seats:{' '}
            <span style={{ color: 'var(--accent-gold)' }}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total: <strong style={{ color: 'var(--accent-gold)' }}>${totalPrice}</strong>
          </div>
        </div>
        <button
          className="btn-gold"
          disabled={selectedSeats.length === 0}
          style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1, cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer' }}
          onClick={() => navigate('/summary', { state: { movie, showtime, selectedSeats, totalPrice } })}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;





// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// export const SeatSelection = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { movie, showtime } = location.state || {};
//   const [selectedSeats, setSelectedSeats] = useState(['G8', 'G9']); // Matches screenshot

//   const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
//   const cols = Array.from({ length: 12 }, (_, i) => i + 1);

//   const toggleSeat = (seatId) => {
//     setSelectedSeats(prev => 
//       prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
//     );
//   };

//   const pricePerSeat = showtime?.price || 16;
//   const totalPrice = selectedSeats.length * pricePerSeat;

//   return (
//     <div className="catalog-container" style={{ textAlign: 'center' }}>
//       <h1 className="cine-font">{movie?.title || 'Neon Frontier'}</h1>
//       <p style={{ color: 'var(--text-muted)' }}>{showtime?.hall_name || 'Grand Hall'} · Mon, Jul 27 · {showtime?.time_label || '2:30 PM'} · <span style={{ color: 'var(--accent-gold)' }}>${pricePerSeat} / seat</span></p>

//       <div style={{ margin: '2rem auto 1rem', width: '60%', height: '4px', background: 'var(--accent-gold)', borderRadius: '2px', boxShadow: '0 0 15px var(--accent-gold)' }}></div>
//       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>SCREEN</p>

//       <div style={{ display: 'inline-block', margin: '2rem 0' }}>
//         {rows.map(row => (
//           <div key={row} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
//             <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{row}</span>
//             {cols.map(col => {
//               const seatId = `${row}${col}`;
//               const isSelected = selectedSeats.includes(seatId);
//               return (
//                 <button 
//                   key={seatId} 
//                   className={`seat-btn ${isSelected ? 'selected' : ''}`}
//                   onClick={() => toggleSeat(seatId)}
//                 />
//               );
//             })}
//             <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{row}</span>
//           </div>
//         ))}
//       </div>

//       {/* Sticky Bottom Bar */}
//       <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0F172A', borderTop: '1px solid var(--border-dark)', padding: '1rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <div style={{ textAlign: 'left' }}>
//           <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{selectedSeats.length} seats: <span style={{ color: 'var(--accent-gold)' }}>{selectedSeats.join(', ')}</span></div>
//           <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total: <strong style={{ color: 'var(--accent-gold)' }}>${totalPrice}</strong></div>
//         </div>
//         <button 
//           className="btn-gold"
//           onClick={() => navigate('/summary', { state: { movie, showtime, selectedSeats, totalPrice } })}
//         >
//           Continue →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SeatSelection;