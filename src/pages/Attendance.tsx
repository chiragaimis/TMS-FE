import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockStudents, mockBatches } from '../utils/mockData';
import { Check, X } from 'lucide-react';

export function Attendance() {
  const [selectedBatch, setSelectedBatch] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});

  const batchStudents = mockStudents.filter((s) => s.batch === mockBatches.find((b) => b.id === selectedBatch)?.name);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const markAllPresent = () => {
    const allPresent = batchStudents.reduce((acc, student) => {
      acc[student.id] = 'present';
      return acc;
    }, {} as Record<string, 'present' | 'absent'>);
    setAttendance(allPresent);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Mark daily attendance</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="input"
            >
              {mockBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} - {batch.subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={markAllPresent} variant="secondary" className="w-full">
              Mark All Present
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {batchStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.class}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    attendance[student.id] === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAttendance({ ...attendance, [student.id]: 'absent' })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    attendance[student.id] === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="secondary">Cancel</Button>
          <Button>Save Attendance</Button>
        </div>
      </Card>
    </div>
  );
}
