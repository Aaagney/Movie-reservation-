import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import { getShowtimes, createShowtime, updateShowtime, deleteShowtime } from '../../api/showtimes';
import { getMovies } from '../../api/movies';
import { getTheatres } from '../../api/theatres';
import { getScreens } from '../../api/screens';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Modal from '../../components/Modal.jsx';
import { TextField, SelectField } from '../../components/FormFields.jsx';

const emptyForm = {
  movie_id: '', theatre_id: '', screen_id: '', show_date: '', start_time: '', end_time: '',
  language: 'English', format: '2D', ticket_price: 12, status: 'scheduled',
};

export default function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ movie_id: '', theatre_id: '', date: '', status: '' });

  const load = (params = {}) => {
    setLoading(true);
    getShowtimes(params).then(setShowtimes).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getMovies().then(setMovies);
    getTheatres().then(setTheatres);
    getScreens().then(setScreens);
  }, []);

  const applyFilters = () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    load(params);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, movie_id: movies[0]?.id || '', theatre_id: theatres[0]?.id || '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s, start_time: s.start_time?.slice(0, 5), end_time: s.end_time?.slice(0, 5) });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateShowtime(editing.id, form);
      else await createShowtime(form);
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this showtime?')) return;
    await deleteShowtime(id);
    load();
  };

  const screensForTheatre = screens.filter((s) => String(s.theatre_id) === String(form.theatre_id));

  if (loading) return <LoadingSpinner label="Loading showtimes…" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-white">Showtimes</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2 text-sm">
          <FiPlus /> Add Showtime
        </button>
      </div>

      <div className="card mt-6 flex flex-wrap items-end gap-3 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cine-gold2">
          <FiFilter /> Filter
        </div>
        <select value={filters.movie_id} onChange={(e) => setFilters({ ...filters, movie_id: e.target.value })} className="rounded-xl2 border border-white/10 bg-cine-panel2 px-3 py-2 text-sm text-white">
          <option value="">All Movies</option>
          {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <select value={filters.theatre_id} onChange={(e) => setFilters({ ...filters, theatre_id: e.target.value })} className="rounded-xl2 border border-white/10 bg-cine-panel2 px-3 py-2 text-sm text-white">
          <option value="">All Theatres</option>
          {theatres.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="rounded-xl2 border border-white/10 bg-cine-panel2 px-3 py-2 text-sm text-white" />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded-xl2 border border-white/10 bg-cine-panel2 px-3 py-2 text-sm text-white">
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={applyFilters} className="btn-outline !px-4 !py-2 text-sm">Apply</button>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/5 text-cine-muted">
            <tr>
              <th className="px-5 py-3">Movie</th>
              <th className="px-5 py-3">Theatre / Screen</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Seats Left</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                <td className="px-5 py-3 font-medium text-white">{s.movie_title}</td>
                <td className="px-5 py-3 text-cine-muted">{s.theatre_name} · {s.screen_name}</td>
                <td className="px-5 py-3 text-cine-muted">{s.show_date}</td>
                <td className="px-5 py-3 text-cine-muted">{s.start_time?.slice(0, 5)}–{s.end_time?.slice(0, 5)}</td>
                <td className="px-5 py-3 text-cine-gold2">${Number(s.ticket_price).toFixed(2)}</td>
                <td className="px-5 py-3 text-cine-muted">{s.available_seats}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-cine-gold/10 px-3 py-1 text-xs text-cine-gold2">{s.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="mr-3 text-cine-gold2 hover:text-cine-gold"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Showtime' : 'Add Showtime'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <SelectField label="Movie" required value={form.movie_id} onChange={(e) => setForm({ ...form, movie_id: e.target.value })}>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </SelectField>
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Theatre" required value={form.theatre_id} onChange={(e) => setForm({ ...form, theatre_id: e.target.value, screen_id: '' })}>
                {theatres.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </SelectField>
              <SelectField label="Screen" required value={form.screen_id} onChange={(e) => setForm({ ...form, screen_id: e.target.value })}>
                <option value="">Select screen</option>
                {screensForTheatre.map((s) => <option key={s.id} value={s.id}>{s.screen_name} ({s.screen_type})</option>)}
              </SelectField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <TextField label="Date" type="date" required value={form.show_date} onChange={(e) => setForm({ ...form, show_date: e.target.value })} />
              <TextField label="Start Time" type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
              <TextField label="End Time" type="time" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
              <SelectField label="Format" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                {['2D', '3D', 'IMAX', '4DX', 'VIP'].map((f) => <option key={f} value={f}>{f}</option>)}
              </SelectField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Ticket Price" type="number" step="0.01" required value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: e.target.value })} />
              <SelectField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </SelectField>
            </div>
            <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Showtime'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
