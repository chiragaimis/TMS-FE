import { Card } from '../components/ui/Card';
import { Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockDashboardStats } from '../utils/mockData';
import { formatCurrency } from '../utils/helpers';

const revenueData = [
  { month: 'Jan', revenue: 320000 },
  { month: 'Feb', revenue: 380000 },
  { month: 'Mar', revenue: 450000 },
  { month: 'Apr', revenue: 420000 },
  { month: 'May', revenue: 480000 },
  { month: 'Jun', revenue: 520000 },
];

const studentGrowthData = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 135 },
  { month: 'Mar', students: 156 },
  { month: 'Apr', students: 148 },
  { month: 'May', students: 162 },
  { month: 'Jun', students: 178 },
];

const stats = [
  {
    label: 'Total Students',
    value: mockDashboardStats.totalStudents,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    label: 'Total Teachers',
    value: mockDashboardStats.totalTeachers,
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    label: "Today's Attendance",
    value: mockDashboardStats.todayAttendance,
    icon: ClipboardCheck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    label: 'Pending Fees',
    value: formatCurrency(mockDashboardStats.pendingFees),
    icon: DollarSign,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    label: 'Monthly Revenue',
    value: formatCurrency(mockDashboardStats.monthlyRevenue),
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    label: 'Upcoming Classes',
    value: mockDashboardStats.upcomingClasses,
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New student enrolled', name: 'Rahul Sharma', time: '2 hours ago' },
            { action: 'Fee payment received', name: 'Priya Patel', time: '4 hours ago' },
            { action: 'Attendance marked', name: 'Math-A Batch', time: '5 hours ago' },
            { action: 'New announcement posted', name: 'Holiday Notice', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.name}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
