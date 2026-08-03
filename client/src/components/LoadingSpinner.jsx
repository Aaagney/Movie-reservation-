import React from 'react';

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-cine-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cine-gold/20 border-t-cine-gold" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
