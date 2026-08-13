<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="card group relative block overflow-hidden fade-in hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
          {movie.rating}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-lg font-semibold leading-tight text-white">{movie.title}</h3>
          {movie.genres?.length > 0 && (
            <p className="mt-1 text-xs text-cine-muted">{movie.genres.join(' • ')}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none'
      }}
    >
      <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
        <img 
          src={movie.poster_url} 
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {movie.rating}
        </div>

        {/* Hover Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11, 12, 16, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease'
        }}>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1rem' }}>
            View Showtimes →
          </span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 className="serif-title" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{movie.title}</h3>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>{movie.category}</span>
          <span>{movie.duration} MIN</span>
        </div>
      </div>
    </div>
  );
};
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
