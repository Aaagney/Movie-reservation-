import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Loading Details...</div>;

  return (
    <div className="catalog-container">
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← All Films</Link>
      
      <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
        <img src={movie.poster_url} alt={movie.title} style={{ width: '280px', borderRadius: '12px', objectFit: 'cover' }} />
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{movie.release_year} · {movie.category.toUpperCase()} · {movie.duration}</span>
          <h1 className="cine-font" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{movie.title}</h1>
          <span className="rating-badge" style={{ position: 'static' }}>{movie.rating}</span>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: '1.5rem 0', maxWidth: '600px' }}>{movie.description}</p>

          <div style={{ display: 'flex', gap: '4rem', margin: '1.5rem 0' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '1px' }}>DIRECTOR</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>{movie.director}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '1px' }}>CAST</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>{movie.cast_members_members_members}</p>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Available Showtimes</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {movie.showtimes?.map(st => (
              <div 
                key={st.id} 
                onClick={() => navigate(`/seats/${st.id}`, { state: { movie, showtime: st } })}
                style={{ background: '#0F172A', border: '1px solid var(--border-dark)', padding: '1rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{st.time_label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.hall_name} · ${st.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;