import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getScreens, createScreen, updateScreen, deleteScreen, getScreenTypes } from '../../api/screens';
import { getTheatres } from '../../api/theatres';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Modal from '../../components/Modal.jsx';
import { TextField, SelectField } from '../../components/FormFields.jsx';

const emptyForm = {
  theatre_id: '', screen_name: '', screen_number: 1, rows_count: 10, columns_count: 12, screen_type_id: '',
};

export default function AdminScreens() {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getScreens().then(setScreens).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getTheatres().then(setTheatres);
    getScreenTypes().then(setTypes);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, theatre_id: theatres[0]?.id || '', screen_type_id: types[0]?.id || '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateScreen(editing.id, form);
      } else {
        await createScreen(form);
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this screen? All its seats and showtimes will be removed too.')) return;
    await deleteScreen(id);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading screens…" />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Screens</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2 text-sm">
          <FiPlus /> Add Screen
        </button>
      </div>

      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-white/5 text-cine-muted">
            <tr>
              <th className="px-5 py-3">Screen</th>
              <th className="px-5 py-3">Theatre</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Capacity</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {screens.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                <td className="px-5 py-3 font-medium text-white">{s.screen_name} (#{s.screen_number})</td>
                <td className="px-5 py-3 text-cine-muted">{s.theatre_name}</td>
                <td className="px-5 py-3"><span className="rounded-full bg-cine-gold/10 px-3 py-1 text-xs text-cine-gold2">{s.screen_type}</span></td>
                <td className="px-5 py-3 text-cine-muted">{s.capacity} seats</td>
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
        <Modal title={editing ? 'Edit Screen' : 'Add Screen'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <SelectField label="Theatre" required disabled={!!editing} value={form.theatre_id} onChange={(e) => setForm({ ...form, theatre_id: e.target.value })}>
              {theatres.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </SelectField>
            <TextField label="Screen Name" required value={form.screen_name} onChange={(e) => setForm({ ...form, screen_name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Screen Number" type="number" required value={form.screen_number} onChange={(e) => setForm({ ...form, screen_number: e.target.value })} />
              <SelectField label="Screen Type" value={form.screen_type_id} onChange={(e) => setForm({ ...form, screen_type_id: e.target.value })}>
                {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </SelectField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Rows" type="number" disabled={!!editing} required value={form.rows_count} onChange={(e) => setForm({ ...form, rows_count: e.target.value })} />
              <TextField label="Columns" type="number" disabled={!!editing} required value={form.columns_count} onChange={(e) => setForm({ ...form, columns_count: e.target.value })} />
            </div>
            {!editing && <p className="mb-4 text-xs text-cine-muted">Seats are generated automatically from rows × columns.</p>}
            <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Screen'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
