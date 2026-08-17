<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Sci-Fi', 'Thriller', 'Drama', 'Action', 'Comedy', 'Horror'];

  // Fetch movies automatically whenever search or category changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/movies', {
          params: {
            search: searchTerm,
            category: selectedCategory
          }
        });
        setMovies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };

    // 300ms debounce so it doesn't query MySQL on every single keypress
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  return (
    <div style={{ backgroundColor: '#05070D', minHeight: '100vh', color: '#FFFFFF', padding: '2.5rem 4rem', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* Search Bar & Category Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
        
        {/* Search Input Field */}
        <input 
          type="text"
          placeholder="Search by title or director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '310px',
            padding: '0.65rem 1.25rem',
            backgroundColor: '#0B101D',
            border: '1px solid #1E293B',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />

        {/* Category Buttons */}
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#EAB308' : '#1E293B',
                backgroundColor: isActive ? '#EAB308' : '#0B101D',
                color: isActive ? '#05070D' : '#8A99AD',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Movie Results Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#8A99AD', padding: '3rem' }}>
          Loading films...
        </div>
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#8A99AD', padding: '3rem' }}>
          No movies found matching your search.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2rem'
        }}>
          {movies.map((movie) => (
            <Link 
              key={movie.id} 
              to={`/movie/${movie.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                backgroundColor: '#0D131F',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #1E293B',
                transition: 'transform 0.2s ease',
                height: '100%'
              }}>
                <img 
                  src={movie.poster_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400"} 
                  alt={movie.title}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem 0', fontWeight: 700 }}>{movie.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#8A99AD', margin: '0 0 0.6rem 0' }}>
                    {movie.director ? `Dir. ${movie.director}` : movie.category}
                  </p>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: 'rgba(234, 179, 8, 0.15)', 
                    color: '#EAB308', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {movie.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
