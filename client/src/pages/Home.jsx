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