import React, { useEffect, useState } from 'react';
import { getTheatres } from '../api/theatres';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FiMapPin, FiPhone } from 'react-icons/fi';

export default function Theatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTheatres().then(setTheatres).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading theatres…" />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Our Theatres</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {theatres.map((t) => (
          <div key={t.id} className="card p-6">
            <h3 className="font-display text-xl font-semibold text-white">{t.name}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-cine-muted">
              <FiMapPin className="text-cine-gold2" /> {t.address}, {t.city}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-cine-muted">
              <FiPhone className="text-cine-gold2" /> {t.phone}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {t.has_parking ? <span className="rounded-full bg-cine-panel2 px-3 py-1">Parking</span> : null}
              {t.has_food_court ? <span className="rounded-full bg-cine-panel2 px-3 py-1">Food Court</span> : null}
              {t.has_wheelchair_access ? <span className="rounded-full bg-cine-panel2 px-3 py-1">Wheelchair Access</span> : null}
              {t.has_ac ? <span className="rounded-full bg-cine-panel2 px-3 py-1">Air Conditioned</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
