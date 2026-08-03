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
        </button>
      </div>
    </div>
  );
}
