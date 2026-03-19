import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { mockStudents } from '../utils/mockData';
import type { Student } from '../types/index';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  const getFeeStatusBadge = (status: string) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      overdue: 'error',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage all student records</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="secondary">Filter</Button>
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
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>{getFeeStatusBadge(student.feeStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${student.attendancePercentage}%` }}
                      />
                    </div>
                    <span className="text-sm">{student.attendancePercentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student" size="xl">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter student name" />
            <Input label="Email" type="email" placeholder="Enter email" />
            <Input label="Phone" placeholder="Enter phone number" />
            <Input label="Parent Name" placeholder="Enter parent name" />
            <Input label="Parent Phone" placeholder="Enter parent phone" />
            <Input label="Class" placeholder="Enter class" />
          </div>
          <Input label="Address" placeholder="Enter address" />
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Add Student</Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedStudent.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedStudent.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{selectedStudent.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium">{selectedStudent.class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parent Name</p>
                <p className="font-medium">{selectedStudent.parentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parent Phone</p>
                <p className="font-medium">{selectedStudent.parentPhone}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
