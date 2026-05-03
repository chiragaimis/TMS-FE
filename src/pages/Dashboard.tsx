import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { dashboardApi } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import type { DashboardStats } from '../types/index';

interface Activity {
  type: string;
  message: string;
  date: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    dashboardApi.getStats().then((r) => setStats(r.data));
    dashboardApi.getActivity().then((r) => setActivity(r.data));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: "Today's Attendance", value: stats.todayAttendance, icon: ClipboardCheck, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'Pending Fees', value: stats.pendingFees, icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
        { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
        { label: 'Upcoming Classes', value: stats.upcomingClasses, icon: Calendar, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to TMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <p className="text-sm font-medium text-gray-900">{item.message}</p>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
