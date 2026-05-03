import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Users, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { batchApi, teacherApi } from '../services/api';
import type { Batch, Teacher } from '../types/index';

const empty = { name: '', subject: '', teacherId: '', schedule: '', startDate: '', endDate: '' };

export function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [form, setForm] = useState(empty);

  const load = (p = page) =>
    batchApi.getAll(p).then((r) => {
      setBatches(r.data.results ?? r.data);
      setCount(r.data.count ?? 0);
    });

  useEffect(() => { load(1); setPage(1); }, []);
  useEffect(() => { if (page !== 1) load(page); }, [page]);
  useEffect(() => { teacherApi.getAll().then((r) => setTeachers(r.data.results ?? r.data)); }, []);

  const openAdd = () => { setEditingBatch(null); setForm(empty); setIsModalOpen(true); };
  const openEdit = (b: Batch) => {
    setEditingBatch(b);
    setForm({ name: b.name, subject: b.subject, teacherId: b.teacherId, schedule: b.schedule, startDate: b.startDate, endDate: b.endDate });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this batch?')) return;
    await batchApi.delete(id);
    load(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch) await batchApi.update(editingBatch.id, form);
    else await batchApi.create(form);
    setIsModalOpen(false);
    load(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-1">Manage class batches and schedules</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} hover>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-600">{batch.subject}</p>
                </div>
                <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded font-medium">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{batch.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{batch.schedule}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Teacher</p>
                <p className="font-medium text-gray-900">{batch.teacher}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => openEdit(batch)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleDelete(batch.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination page={page} count={count} onChange={(p) => setPage(p)} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBatch ? 'Edit Batch' : 'Create Batch'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Batch Name" placeholder="e.g. Math-A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Subject" placeholder="e.g. Math" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select className="input w-full" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} required>
                <option value="">Select teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <Input label="Schedule" placeholder="Mon/Wed 9-10AM" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} required />
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingBatch ? 'Update Batch' : 'Create Batch'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
