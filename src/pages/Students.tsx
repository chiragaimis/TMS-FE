import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { studentApi, classApi, batchApi } from '../services/api';
import type { Student } from '../types/index';

interface ClassItem { id: string; name: string; }
interface BatchItem { id: string; name: string; }

const empty = { name: '', email: '', phone: '', parentName: '', parentPhone: '', classId: '', batchId: '', feeStatus: 'pending', attendancePercentage: 0, enrolledDate: '', address: '' };

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);

  const load = (p = page) =>
    studentApi.getAll(p).then((r) => {
      setStudents(r.data.results ?? r.data);
      setCount(r.data.count ?? 0);
    });

  useEffect(() => { load(1); setPage(1); }, []);
  useEffect(() => { if (page !== 1) load(page); }, [page]);

  useEffect(() => {
    classApi.getAll().then((r) => setClasses(r.data.results ?? r.data));
    batchApi.getAll().then((r) => setBatches(r.data.results ?? r.data));
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  const openAdd = () => { setEditingStudent(null); setForm(empty); setIsModalOpen(true); };
  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, parentName: s.parentName, parentPhone: s.parentPhone, classId: '', batchId: '', feeStatus: s.feeStatus, attendancePercentage: s.attendancePercentage, enrolledDate: s.enrolledDate, address: s.address });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return;
    await studentApi.delete(id);
    load(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) await studentApi.update(editingStudent.id, form);
    else await studentApi.create(form);
    setIsModalOpen(false);
    load(page);
  };

  const feeVariants = { paid: 'success', pending: 'warning', overdue: 'error' } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all student records</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Fee Status</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.class_name ?? student.class}</TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>
                  <Badge variant={feeVariants[student.feeStatus]}>{student.feeStatus}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${student.attendancePercentage}%` }} />
                    </div>
                    <span className="text-sm">{student.attendancePercentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedStudent(student)} className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => openEdit(student)} className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="p-1 hover:bg-gray-100 rounded">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add New Student'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter student name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input label="Parent Name" placeholder="Enter parent name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required />
            <Input label="Parent Phone" placeholder="Enter parent phone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select className="input w-full" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required>
                <option value="">Select class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select className="input w-full" value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required>
                <option value="">Select batch</option>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Status</label>
              <select className="input w-full" value={form.feeStatus} onChange={(e) => setForm({ ...form, feeStatus: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <Input label="Enrolled Date" type="date" value={form.enrolledDate} onChange={(e) => setForm({ ...form, enrolledDate: e.target.value })} required />
          </div>
          <Input label="Address" placeholder="Enter address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">{editingStudent ? 'Update Student' : 'Add Student'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {selectedStudent && (
        <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details" size="lg">
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Name', selectedStudent.name], ['Email', selectedStudent.email],
              ['Phone', selectedStudent.phone], ['Class', selectedStudent.class_name ?? selectedStudent.class],
              ['Batch', selectedStudent.batch], ['Parent Name', selectedStudent.parentName],
              ['Parent Phone', selectedStudent.parentPhone], ['Fee Status', selectedStudent.feeStatus],
              ['Attendance', `${selectedStudent.attendancePercentage}%`], ['Address', selectedStudent.address],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
