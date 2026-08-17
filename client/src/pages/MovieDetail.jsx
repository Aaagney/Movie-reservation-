import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../api/movies';
import { getShowtimesByMovie } from '../api/showtimes';
import { getCities } from '../api/theatres';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function formatTime(t) {
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${suffix}`;
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [grouped, setGrouped] = useState({});
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getMovieById(id), getShowtimesByMovie(id, city ? { city } : {})])
      .then(([m, shows]) => {
        setMovie(m);
        setGrouped(shows);
      })
      .finally(() => setLoading(false));
  }, [id, city]);

  const handlePickShowtime = (showtimeId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/showtimes/${showtimeId}/seats`);
  };

  if (loading) return <LoadingSpinner label="Loading film details…" />;
  if (!movie) return <p className="py-24 text-center text-cine-muted">Film not found.</p>;

  const dates = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-xl2 border border-white/5 shadow-card">
          <img src={movie.poster_url} alt={movie.title} className="h-full w-full object-cover" />
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{movie.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-cine-panel px-3 py-1 text-xs font-semibold ring-1 ring-white/10">
              {movie.rating}
            </span>
            <span className="text-sm text-cine-muted">{movie.duration_minutes} min</span>
            {movie.genres?.map((g) => (
              <span key={g} className="text-sm text-cine-gold2">{g}</span>
            ))}
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-cine-muted">{movie.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="uppercase tracking-wider text-cine-gold2">Director</p>
              <p className="mt-1 text-white">{movie.director}</p>
            </div>
            <div>
              <p className="uppercase tracking-wider text-cine-gold2">Cast</p>
              <p className="mt-1 text-white">{movie.cast_list}</p>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-white">Available Showtimes</h2>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-full border border-white/10 bg-cine-panel px-4 py-2 text-sm text-white focus:border-cine-gold/50 focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {dates.length === 0 ? (
              <p className="text-cine-muted">No upcoming showtimes for this film yet.</p>
            ) : (
              <div className="space-y-8">
                {dates.map((date) => (
                  <div key={date}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cine-gold2">
                      {formatDateLabel(date)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {grouped[date].map((show) => (
                        <button
                          key={show.id}
                          onClick={() => handlePickShowtime(show.id)}
                          disabled={show.available_seats === 0}
                          className="glass min-w-[140px] rounded-xl2 px-5 py-3 text-left transition-colors hover:border-cine-gold/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <p className="font-semibold text-white">{formatTime(show.start_time)}</p>
                          <p className="mt-1 text-xs text-cine-muted">
                            {show.theatre_name} · {show.screen_name}
                          </p>
                          <p className="mt-1 text-xs text-cine-gold2">
                            {show.format} · ${Number(show.ticket_price).toFixed(2)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
