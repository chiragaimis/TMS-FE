import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit, Trash2, GitBranch } from 'lucide-react';
import { branchApi } from '../services/api';

interface Branch { id: string; name: string; }
const empty = { name: '' };

export function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState(empty);

  const load = () => branchApi.getAll().then((r) => setBranches(r.data.results ?? r.data));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingBranch(null); setForm(empty); setIsModalOpen(true); };
  const openEdit = (b: Branch) => { setEditingBranch(b); setForm({ name: b.name }); setIsModalOpen(true); };

  const handleDelete = async (b: Branch) => {
    if (!confirm(`Delete branch "${b.name}"?`)) return;
    await branchApi.delete(b.id);
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) await branchApi.update(editingBranch.id, form);
    else await branchApi.create(form);
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your institute branches</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary-600" />
                    <p className="font-medium">{b.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(b)} className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBranch ? 'Edit Branch' : 'Add Branch'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Branch Name" placeholder="e.g. North Campus" value={form.name} onChange={(e) => setForm({ name: e.target.value })} required />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{editingBranch ? 'Update' : 'Add Branch'}</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
