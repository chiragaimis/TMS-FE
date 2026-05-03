import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { classApi } from '../services/api';

interface Class {
  id: string;
  name: string;
  description: string;
  subjects: string;
  totalStudents: number;
}

const empty = { name: '', description: '', subjects: '' };

export function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [form, setForm] = useState(empty);

  const load = (p = page) =>
    classApi.getAll(p).then((r) => {
      setClasses(r.data.results ?? r.data);
      setCount(r.data.count ?? 0);
    });

  useEffect(() => { load(1); setPage(1); }, []);
  useEffect(() => { if (page !== 1) load(page); }, [page]);

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => { setEditingClass(null); setForm(empty); setIsModalOpen(true); };
  const openEdit = (c: Class) => { setEditingClass(c); setForm({ name: c.name, description: c.description, subjects: c.subjects }); setIsModalOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this class?')) return;
    await classApi.delete(id);
    load(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) await classApi.update(editingClass.id, form);
    else await classApi.create(form);
    setIsModalOpen(false);
    load(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage all classes</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search classes..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell><p className="font-medium">{cls.name}</p></TableCell>
                <TableCell>{cls.description}</TableCell>
                <TableCell>{cls.subjects}</TableCell>
                <TableCell>{cls.totalStudents}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(cls)} className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(cls.id)} className="p-1 hover:bg-gray-100 rounded">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? 'Edit Class' : 'Add New Class'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Class Name" placeholder="Enter class name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Description" placeholder="Enter description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <Input label="Subjects" placeholder="Math, Science, English" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} required />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingClass ? 'Update Class' : 'Add Class'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
