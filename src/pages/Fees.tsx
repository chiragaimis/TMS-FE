import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { feeApi, studentApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import type { Fee } from '../types/index';

interface StudentItem { id: string; name: string; }
const emptyForm = { studentId: '', amount: '', dueDate: '', month: '' };

export function Fees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [collecting, setCollecting] = useState(false);

  const load = (p = page) =>
    feeApi.getAll(p).then((r) => {
      setFees(r.data.results ?? r.data);
      setCount(r.data.count ?? 0);
    });

  useEffect(() => { load(1); setPage(1); }, []);
  useEffect(() => { if (page !== 1) load(page); }, [page]);
  useEffect(() => { studentApi.getAll().then((r) => setStudents(r.data.results ?? r.data)); }, []);

  const totalCollected = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending   = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);
  const totalOverdue   = fees.filter((f) => f.status === 'overdue').reduce((s, f) => s + Number(f.amount), 0);

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollecting(true);
    try {
      await feeApi.collect({ ...form, amount: Number(form.amount) });
      setIsModalOpen(false);
      setForm(emptyForm);
      load(page);
    } finally {
      setCollecting(false);
    }
  };

  const feeVariants = { paid: 'success', pending: 'warning', overdue: 'error' } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-600 mt-1">Track and collect student fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50"><TrendingUp className="w-6 h-6 text-green-600" /></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Fees</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{formatCurrency(totalPending)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50"><DollarSign className="w-6 h-6 text-yellow-600" /></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(totalOverdue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50"><AlertCircle className="w-6 h-6 text-red-600" /></div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Fee Records</h3>
          <Button onClick={() => setIsModalOpen(true)}>Collect Fee</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">{fee.studentName}</TableCell>
                <TableCell>{fee.month}</TableCell>
                <TableCell>{formatCurrency(Number(fee.amount))}</TableCell>
                <TableCell>{formatDate(fee.dueDate)}</TableCell>
                <TableCell>{fee.paidDate ? formatDate(fee.paidDate) : '-'}</TableCell>
                <TableCell>
                  <Badge variant={feeVariants[fee.status]}>{fee.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination page={page} count={count} onChange={(p) => setPage(p)} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Collect Fee" size="md">
        <form onSubmit={handleCollect} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select className="input w-full" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
              <option value="">Select student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <Input label="Amount" type="number" placeholder="Enter amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <Input label="Month" placeholder="e.g. January 2024" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={collecting}>{collecting ? 'Processing...' : 'Collect Fee'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
