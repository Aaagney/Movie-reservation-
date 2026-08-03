import React, { useEffect, useState } from 'react';
import { getMovies, getGenres } from '../api/movies';
import MovieCard from '../components/MovieCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeGenre !== 'All') params.genre = activeGenre;
    getMovies(params)
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [search, activeGenre]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cine-gold2">Now Showing</p>
          <h1 className="max-w-2xl font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            This Week&apos;s Films
          </h1>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-sm">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cine-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or director…"
              className="w-full rounded-full border border-white/10 bg-cine-panel py-3 pl-11 pr-4 text-sm text-white placeholder:text-cine-muted focus:border-cine-gold/50 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', ...genres.map((g) => g.name)].map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeGenre === g
                    ? 'bg-cine-gold text-cine-black'
                    : 'bg-cine-panel text-cine-muted hover:bg-cine-panel2'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <LoadingSpinner label="Fetching films…" />
        ) : movies.length === 0 ? (
          <p className="py-20 text-center text-cine-muted">No films match your search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
