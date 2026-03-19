import { Card } from '../components/ui/Card';

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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <Card>
        <p className="text-gray-600">Analytics and reports will be displayed here.</p>
      </Card>
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
