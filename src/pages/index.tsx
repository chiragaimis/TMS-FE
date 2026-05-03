import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Download } from 'lucide-react';
import { reportApi, batchApi } from '../services/api';

interface BatchItem { id: string; name: string; subject: string; }

export function Payments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
      <Card>
        <p className="text-gray-600">Payment history and transactions will be displayed here.</p>
      </Card>
    </div>
  );
}

export function Schedule() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
      <Card>
        <p className="text-gray-600">Class schedule and calendar will be displayed here.</p>
      </Card>
    </div>
  );
}

export function Reports() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [attendanceParams, setAttendanceParams] = useState({ batch_id: '', date: '', from_date: '', to_date: '' });
  const [feeParams, setFeeParams] = useState({ status: '', month: '' });
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    batchApi.getAll().then((r) => setBatches(r.data.results ?? r.data));
  }, []);

  const download = async (key: string, fn: () => Promise<void>) => {
    setLoading(key);
    try { await fn(); } finally { setLoading(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Download PDF reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Student Report</h3>
              <p className="text-sm text-gray-500 mt-1">All students with fee status &amp; attendance</p>
              <Button size="sm" className="mt-4" disabled={loading === 'students'}
                onClick={() => download('students', reportApi.students)}>
                <Download className="w-4 h-4 mr-2" />
                {loading === 'students' ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg"><FileText className="w-6 h-6 text-indigo-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">TMS Summary Report</h3>
              <p className="text-sm text-gray-500 mt-1">Full system overview — students, teachers, fees, batches</p>
              <Button size="sm" className="mt-4" disabled={loading === 'summary'}
                onClick={() => download('summary', reportApi.summary)}>
                <Download className="w-4 h-4 mr-2" />
                {loading === 'summary' ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg"><FileText className="w-6 h-6 text-green-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Attendance Report</h3>
              <p className="text-sm text-gray-500 mt-1">Filter by batch and/or date range</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <label className="text-xs text-gray-600">Batch</label>
                  <select className="input w-full mt-1 text-sm" value={attendanceParams.batch_id}
                    onChange={(e) => setAttendanceParams({ ...attendanceParams, batch_id: e.target.value })}>
                    <option value="">All batches</option>
                    {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Exact Date</label>
                  <input type="date" className="input w-full mt-1 text-sm" value={attendanceParams.date}
                    onChange={(e) => setAttendanceParams({ ...attendanceParams, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-600">From Date</label>
                  <input type="date" className="input w-full mt-1 text-sm" value={attendanceParams.from_date}
                    onChange={(e) => setAttendanceParams({ ...attendanceParams, from_date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-600">To Date</label>
                  <input type="date" className="input w-full mt-1 text-sm" value={attendanceParams.to_date}
                    onChange={(e) => setAttendanceParams({ ...attendanceParams, to_date: e.target.value })} />
                </div>
              </div>
              <Button size="sm" className="mt-4" disabled={loading === 'attendance'}
                onClick={() => {
                  const p = Object.fromEntries(Object.entries(attendanceParams).filter(([, v]) => v));
                  download('attendance', () => reportApi.attendance(p));
                }}>
                <Download className="w-4 h-4 mr-2" />
                {loading === 'attendance' ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Fee Report</h3>
              <p className="text-sm text-gray-500 mt-1">Filter by status and/or month</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <label className="text-xs text-gray-600">Status</label>
                  <select className="input w-full mt-1 text-sm" value={feeParams.status}
                    onChange={(e) => setFeeParams({ ...feeParams, status: e.target.value })}>
                    <option value="">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Month</label>
                  <input type="text" className="input w-full mt-1 text-sm" placeholder="e.g. January 2024"
                    value={feeParams.month}
                    onChange={(e) => setFeeParams({ ...feeParams, month: e.target.value })} />
                </div>
              </div>
              <Button size="sm" className="mt-4" disabled={loading === 'fees'}
                onClick={() => {
                  const p = Object.fromEntries(Object.entries(feeParams).filter(([, v]) => v));
                  download('fees', () => reportApi.fees(p));
                }}>
                <Download className="w-4 h-4 mr-2" />
                {loading === 'fees' ? 'Downloading...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

export function Announcements() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      <Card>
        <p className="text-gray-600">Create and manage announcements here.</p>
      </Card>
    </div>
  );
}

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <Card>
        <p className="text-gray-600">Application settings will be displayed here.</p>
      </Card>
    </div>
  );
}
