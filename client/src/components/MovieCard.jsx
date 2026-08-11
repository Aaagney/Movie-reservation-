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