import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  description: string;
  subjects: string;
  totalStudents: number;
}

const mockClasses: Class[] = [
  { id: '1', name: 'Class 10', description: 'Secondary Education', subjects: 'Math, Science, English', totalStudents: 45 },
  { id: '2', name: 'Class 12', description: 'Senior Secondary', subjects: 'Physics, Chemistry, Math', totalStudents: 38 },
];

export function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>(mockClasses);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClass: Class = {
      id: editingClass?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      subjects: formData.get('subjects') as string,
      totalStudents: editingClass?.totalStudents || 0,
    };

    if (editingClass) {
      setClasses(classes.map(cls => cls.id === editingClass.id ? newClass : cls));
    } else {
      setClasses([...classes, newClass]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage all classes</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
            {filteredClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>
                  <p className="font-medium">{cls.name}</p>
                </TableCell>
                <TableCell>{cls.description}</TableCell>
                <TableCell>{cls.subjects}</TableCell>
                <TableCell>{cls.totalStudents}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class' : 'Add New Class'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Class Name"
              placeholder="Enter class name"
              defaultValue={editingClass?.name}
              required
            />
            <Input
              name="description"
              label="Description"
              placeholder="Enter description"
              defaultValue={editingClass?.description}
              required
            />
          </div>
          <Input
            name="subjects"
            label="Subjects"
            placeholder="Enter subjects (comma separated)"
            defaultValue={editingClass?.subjects}
            required
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingClass ? 'Update Class' : 'Add Class'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
