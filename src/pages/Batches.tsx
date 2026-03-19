import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockBatches } from '../utils/mockData';
import { Users, Calendar, Plus } from 'lucide-react';

export function Batches() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-1">Manage class batches and schedules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBatches.map((batch) => (
          <Card key={batch.id} hover>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-600">{batch.subject}</p>
                </div>
                <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded font-medium">
                  Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{batch.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{batch.schedule}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Teacher</p>
                <p className="font-medium text-gray-900">{batch.teacher}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button size="sm" variant="secondary">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
