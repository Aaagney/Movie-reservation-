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
