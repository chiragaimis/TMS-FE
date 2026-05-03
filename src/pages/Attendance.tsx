import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Check, X } from 'lucide-react';
import { attendanceApi, batchApi, studentApi } from '../services/api';
import type { Batch, Student, Attendance } from '../types/index';

export function Attendance() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [existingRecords, setExistingRecords] = useState<Attendance[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    batchApi.getAll().then((r) => {
      const list = r.data.results ?? r.data;
      setBatches(list);
      setSelectedBatch(list.length > 0 ? list[0].id : '');
    });
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    studentApi.getAll().then((r) => {
      const all: Student[] = r.data.results ?? r.data;
      const batch = batches.find((b) => b.id === selectedBatch);
      setStudents(all.filter((s) => s.batch === batch?.name));
    });
    attendanceApi.getByBatch(selectedBatch, selectedDate).then((r) => {
      const records: Attendance[] = r.data;
      setExistingRecords(records);
      const map: Record<string, 'present' | 'absent' | 'late'> = {};
      records.forEach((rec) => { map[rec.studentId] = rec.status; });
      setAttendance(map);
    });
  }, [selectedBatch, selectedDate, batches]);

  const toggle = (id: string) =>
    setAttendance((prev) => ({ ...prev, [id]: prev[id] === 'present' ? 'absent' : 'present' }));

  const markAllPresent = () =>
    setAttendance(students.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {}));

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        students.map((s) => {
          const status = attendance[s.id] ?? 'absent';
          const existing = existingRecords.find((r) => r.studentId === s.id);
          if (existing) return attendanceApi.update(existing.id, { studentId: s.id, batchId: selectedBatch, date: selectedDate, status });
          return attendanceApi.create({ studentId: s.id, batchId: selectedBatch, date: selectedDate, status });
        })
      );
    } finally {
      setSaving(false);
    }
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
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="input w-full">
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name} - {b.subject}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input w-full" />
          </div>
          <div className="flex items-end">
            <Button onClick={markAllPresent} variant="secondary" className="w-full">Mark All Present</Button>
          </div>
        </div>

        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.class_name ?? student.class}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(student.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${attendance[student.id] === 'present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAttendance({ ...attendance, [student.id]: 'absent' })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${attendance[student.id] === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={() => setAttendance({})}>Reset</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Attendance'}</Button>
        </div>
      </Card>
    </div>
  );
}
