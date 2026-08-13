import React, { useState } from "react";
import Navbar from "../components/Navbar";

// Static placeholder data — real film data comes from the
// "Movie Management System (User Side)" module (Suhani's part).
// Poster images use a free placeholder service since real studio poster
// art is copyrighted and can't be hotlinked from random sites.
const poster = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/600`;

const FILMS = [
  { title: "Neon Frontier", genre: "Sci-Fi", duration: "142m", rating: "PG-13" },
  { title: "The Venetian Heist", genre: "Thriller", duration: "118m", rating: "R" },
  { title: "Ember & Ash", genre: "Drama", duration: "126m", rating: "PG-13" },
  { title: "Razorback", genre: "Action", duration: "108m", rating: "R" },
  { title: "The Laughing Fox", genre: "Comedy", duration: "95m", rating: "PG" },
  { title: "Whispers in the Deep", genre: "Horror", duration: "112m", rating: "R" },
  { title: "Stellar Drift", genre: "Sci-Fi", duration: "134m", rating: "PG-13" },
  { title: "Quantum Shadows", genre: "Sci-Fi", duration: "129m", rating: "PG-13" },
  { title: "Silent Witness", genre: "Thriller", duration: "121m", rating: "R" },
  { title: "The Last Alibi", genre: "Thriller", duration: "115m", rating: "PG-13" },
  { title: "Autumn Letters", genre: "Drama", duration: "132m", rating: "PG-13" },
  { title: "The Painter's Son", genre: "Drama", duration: "140m", rating: "PG" },
  { title: "Iron Vendetta", genre: "Action", duration: "119m", rating: "R" },
  { title: "Crimson Protocol", genre: "Action", duration: "125m", rating: "PG-13" },
  { title: "Awkward Family Dinner", genre: "Comedy", duration: "98m", rating: "PG" },
  { title: "The Wingman", genre: "Comedy", duration: "102m", rating: "PG-13" },
  { title: "The Hollow House", genre: "Horror", duration: "108m", rating: "R" },
  { title: "Midnight Static", genre: "Horror", duration: "97m", rating: "R" },
];

const GENRES = ["All", "Sci-Fi", "Thriller", "Drama", "Action", "Comedy", "Horror"];

export default function FilmsPage() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = FILMS.filter((f) => {
    const matchesGenre = activeGenre === "All" || f.genre === activeGenre;
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-vault-bg">
      <Navbar />

      <div className="px-8 pt-10 pb-16 max-w-7xl mx-auto">
        <p className="label-eyebrow text-vault-gold mb-2">Now Showing</p>
        <h1 className="font-serif text-5xl text-white mb-8">This Week's Films</h1>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or director..."
            className="w-full bg-vault-input border border-vault-border rounded-lg px-4 py-3 text-white placeholder-vault-muted focus:outline-none focus:border-vault-gold transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                activeGenre === genre
                  ? "bg-vault-gold text-black"
                  : "bg-vault-input border border-vault-border text-vault-muted hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {filtered.map((film) => (
            <div key={film.title} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-lg bg-vault-panel border border-vault-border overflow-hidden mb-3">
                <img
                  src={poster(film.title)}
                  alt={film.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 text-[10px] font-semibold bg-black/70 text-white px-1.5 py-0.5 rounded">
                  {film.rating}
                </span>
              </div>
              <p className="text-white font-semibold text-sm">{film.title}</p>
              <p className="text-vault-muted text-xs">
                {film.genre} · {film.duration}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-vault-muted text-sm mt-10">No films match your search.</p>
        )}
      </div>
    </div>
  );
}
