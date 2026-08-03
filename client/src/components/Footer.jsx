import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-cine-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-cine-muted md:flex-row">
        <div className="font-display text-lg">
          <span className="gold-text">CINÉ</span>VAULT
        </div>
        <p>© {new Date().getFullYear()} CinéVault. A college project — Theatre &amp; Showtime Management module.</p>
      </div>
    </footer>
  );
}
