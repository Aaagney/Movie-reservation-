import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getTheatres, createTheatre, updateTheatre, deleteTheatre } from '../../api/theatres';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Modal from '../../components/Modal.jsx';
import { TextField, SelectField, CheckboxField } from '../../components/FormFields.jsx';

const emptyForm = {
  name: '', location: '', city: '', address: '', phone: '', email: '', status: 'active',
  has_parking: false, has_food_court: false, has_wheelchair_access: false, has_ac: true,
};

export default function AdminTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getTheatres().then(setTheatres).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ ...emptyForm, ...t, has_parking: !!t.has_parking, has_food_court: !!t.has_food_court, has_wheelchair_access: !!t.has_wheelchair_access, has_ac: !!t.has_ac });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateTheatre(editing.id, form);
      else await createTheatre(form);
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this theatre? All its screens and showtimes will be removed too.')) return;
    await deleteTheatre(id);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading theatres…" />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Theatres</h1>
        <button onClick={openCreate} className="btn-gold !px-5 !py-2 text-sm">
          <FiPlus /> Add Theatre
        </button>
      </div>

      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-white/5 text-cine-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                <td className="px-5 py-3 font-medium text-white">{t.name}</td>
                <td className="px-5 py-3 text-cine-muted">{t.city}</td>
                <td className="px-5 py-3 text-cine-muted">{t.phone}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${t.status === 'active' ? 'bg-cine-gold/10 text-cine-gold2' : 'bg-white/5 text-cine-muted'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(t)} className="mr-3 text-cine-gold2 hover:text-cine-gold"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Theatre' : 'Add Theatre'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <TextField label="Theatre Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <TextField label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <TextField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <SelectField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectField>
            <div className="mb-4 grid grid-cols-2 gap-1">
              <CheckboxField label="Parking" checked={form.has_parking} onChange={(e) => setForm({ ...form, has_parking: e.target.checked })} />
              <CheckboxField label="Food Court" checked={form.has_food_court} onChange={(e) => setForm({ ...form, has_food_court: e.target.checked })} />
              <CheckboxField label="Wheelchair Access" checked={form.has_wheelchair_access} onChange={(e) => setForm({ ...form, has_wheelchair_access: e.target.checked })} />
              <CheckboxField label="Air Conditioned" checked={form.has_ac} onChange={(e) => setForm({ ...form, has_ac: e.target.checked })} />
            </div>
            <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Theatre'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
