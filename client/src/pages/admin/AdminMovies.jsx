import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../../api/movies';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Modal from '../../components/Modal.jsx';
import { TextField, TextAreaField, SelectField } from '../../components/FormFields.jsx';

const emptyForm = {
  title: '', description: '', poster_url: '', rating: 'PG-13', duration_minutes: 120,
  director: '', cast_list: '', release_date: '', status: 'now_showing',
};

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getMovies().then(setMovies).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (movie) => {
    setEditing(movie);
    setForm({ ...emptyForm, ...movie, release_date: movie.release_date?.slice(0, 10) || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateMovie(editing.id, form);
      } else {
        await createMovie(form);
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie? This cannot be undone.')) return;
    await deleteMovie(id);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading movies…" />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Movies</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2 text-sm">
          <FiPlus /> Add Movie
        </button>
      </div>

      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-white/5 text-cine-muted">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                <td className="px-5 py-3 font-medium text-white">{m.title}</td>
                <td className="px-5 py-3 text-cine-muted">{m.rating}</td>
                <td className="px-5 py-3 text-cine-muted">{m.duration_minutes} min</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-cine-gold/10 px-3 py-1 text-xs text-cine-gold2">{m.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="mr-3 text-cine-gold2 hover:text-cine-gold"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Movie' : 'Add Movie'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextAreaField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <TextField label="Poster URL" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                {['G', 'PG', 'PG-13', 'R'].map((r) => <option key={r} value={r}>{r}</option>)}
              </SelectField>
              <TextField label="Duration (min)" type="number" required value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
            </div>
            <TextField label="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} />
            <TextField label="Cast" value={form.cast_list} onChange={(e) => setForm({ ...form, cast_list: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Release Date" type="date" value={form.release_date} onChange={(e) => setForm({ ...form, release_date: e.target.value })} />
              <SelectField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="ended">Ended</option>
              </SelectField>
            </div>
            <button type="submit" disabled={saving} className="btn-gold mt-2 w-full disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Movie'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
