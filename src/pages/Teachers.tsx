import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { teacherApi } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import type { Teacher } from '../types/index';

const empty = { name: '', email: '', phone: '', subjects: '', salary: '', joinedDate: '' };

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState(empty);

  const load = (p = page) =>
    teacherApi.getAll(p).then((r) => {
      setTeachers(r.data.results ?? r.data);
      setCount(r.data.count ?? 0);
    });

  useEffect(() => { load(page); }, [page]);

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => { setEditingTeacher(null); setForm(empty); setIsModalOpen(true); };
  const openEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setForm({ name: t.name, email: t.email, phone: t.phone, subjects: t.subjects.join(', '), salary: String(t.salary), joinedDate: t.joinedDate });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this teacher?')) return;
    await teacherApi.delete(id);
    load(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, subjects: form.subjects.split(',').map((s) => s.trim()), salary: Number(form.salary) };
    if (editingTeacher) await teacherApi.update(editingTeacher.id, payload);
    else await teacherApi.create(payload);
    setIsModalOpen(false);
    load(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teaching staff</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search teachers..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Batches</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                  </div>
                </TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((s) => (
                      <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{teacher.batches.join(', ')}</TableCell>
                <TableCell>{formatCurrency(teacher.salary)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(teacher)} className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(teacher.id)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination page={page} count={count} onChange={(p) => setPage(p)} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" placeholder="Enter phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Salary" type="number" placeholder="Enter salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
            <Input label="Joined Date" type="date" value={form.joinedDate} onChange={(e) => setForm({ ...form, joinedDate: e.target.value })} required />
            <Input label="Subjects" placeholder="Math, Physics" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingTeacher ? 'Update Teacher' : 'Add Teacher'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
