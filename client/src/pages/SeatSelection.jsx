<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeatMap } from '../api/seats';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getSeatMap(showtimeId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [showtimeId]);

  const rows = useMemo(() => {
    if (!data) return [];
    const byRow = {};
    data.seats.forEach((s) => {
      byRow[s.seat_row] = byRow[s.seat_row] || [];
      byRow[s.seat_row].push(s);
    });
    return Object.entries(byRow).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  const toggleSeat = (seat) => {
    if (seat.status === 'booked') return;
    setSelected((prev) =>
      prev.find((s) => s.id === seat.id) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
    );
  };

  const pricePerStandard = data ? parseFloat(data.showtime.ticket_price) : 0;
  const pricePerVip = pricePerStandard + 5;
  const total = selected.reduce((sum, s) => sum + (s.seat_type === 'vip' ? pricePerVip : pricePerStandard), 0);

  const seatClasses = (seat) => {
    const isSelected = selected.some((s) => s.id === seat.id);
    if (seat.status === 'booked') return 'bg-white/5 text-white/20 cursor-not-allowed';
    if (isSelected) return 'bg-cine-gold text-cine-black shadow-gold';
    if (seat.seat_type === 'vip') return 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 ring-1 ring-purple-400/30';
    return 'bg-cine-panel2 text-white hover:bg-white/10 ring-1 ring-white/10';
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    navigate('/booking/summary', {
      state: {
        showtime: data.showtime,
        seats: selected,
        total,
      },
    });
  };

  if (loading) return <LoadingSpinner label="Loading seat map…" />;
  if (!data) return <p className="py-24 text-center text-cine-muted">Showtime not found.</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Choose Your Seats</h1>
      <p className="mt-1 text-cine-muted">
        {data.showtime.show_date} · {data.showtime.start_time?.slice(0, 5)} · Screen {data.showtime.screen_id}
      </p>

      <div className="mt-10 rounded-xl2 border border-white/5 bg-cine-panel p-6 md:p-10">
        <div className="mb-10 flex justify-center">
          <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-cine-gold/60 to-transparent" />
        </div>
        <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-cine-muted">Screen</p>

        <div className="flex flex-col items-center gap-2 overflow-x-auto pb-4">
          {rows.map(([rowLetter, seats]) => (
            <div key={rowLetter} className="flex items-center gap-2">
              <span className="w-5 text-xs text-cine-muted">{rowLetter}</span>
              {seats
                .sort((a, b) => a.seat_number - b.seat_number)
                .map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    className={`h-7 w-7 rounded-md text-[10px] font-semibold transition-colors ${seatClasses(seat)}`}
                    title={`${rowLetter}${seat.seat_number}`}
                  >
                    {seat.seat_number}
                  </button>
                ))}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-cine-muted">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-cine-panel2 ring-1 ring-white/10" /> Available</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-purple-500/20 ring-1 ring-purple-400/30" /> VIP</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-cine-gold" /> Selected</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-white/5" /> Booked</span>
        </div>
      </div>

      <div className="glass sticky bottom-4 mt-8 flex flex-col items-center justify-between gap-4 rounded-xl2 p-5 md:flex-row">
        <div>
          <p className="text-sm text-cine-muted">{selected.length} seat(s) selected</p>
          <p className="font-display text-2xl font-bold text-cine-gold2">${total.toFixed(2)}</p>
        </div>
        <button onClick={handleContinue} disabled={selected.length === 0} className="btn-gold disabled:cursor-not-allowed disabled:opacity-40">
          Continue to Summary
=======
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
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
        </button>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
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
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
