import type { Student, Teacher, Batch, DashboardStats, Fee, Attendance } from '../types/index';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    parentName: 'Mr. Sharma',
    parentPhone: '9876543211',
    class: '10th',
    batch: 'Math-A',
    feeStatus: 'paid',
    attendancePercentage: 92,
    enrolledDate: '2024-01-15',
    address: 'Mumbai, Maharashtra',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '9876543212',
    parentName: 'Mrs. Patel',
    parentPhone: '9876543213',
    class: '12th',
    batch: 'Physics-B',
    feeStatus: 'pending',
    attendancePercentage: 88,
    enrolledDate: '2024-02-01',
    address: 'Delhi, India',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '9876543214',
    parentName: 'Mr. Kumar',
    parentPhone: '9876543215',
    class: '11th',
    batch: 'Chemistry-A',
    feeStatus: 'overdue',
    attendancePercentage: 75,
    enrolledDate: '2024-01-20',
    address: 'Bangalore, Karnataka',
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Anjali Verma',
    email: 'anjali@example.com',
    phone: '9876543220',
    subjects: ['Mathematics', 'Statistics'],
    batches: ['Math-A', 'Math-B'],
    salary: 50000,
    joinedDate: '2023-06-01',
  },
  {
    id: '2',
    name: 'Prof. Rajesh Singh',
    email: 'rajesh@example.com',
    phone: '9876543221',
    subjects: ['Physics'],
    batches: ['Physics-A', 'Physics-B'],
    salary: 45000,
    joinedDate: '2023-07-15',
  },
];

export const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'Math-A',
    subject: 'Mathematics',
    teacher: 'Dr. Anjali Verma',
    teacherId: '1',
    students: 25,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
  {
    id: '2',
    name: 'Physics-B',
    subject: 'Physics',
    teacher: 'Prof. Rajesh Singh',
    teacherId: '2',
    students: 20,
    schedule: 'Tue, Thu, Sat - 2:00 PM',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 156,
  totalTeachers: 12,
  todayAttendance: 142,
  pendingFees: 45000,
  monthlyRevenue: 450000,
  upcomingClasses: 8,
};

export const mockFees: Fee[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Rahul Sharma',
    amount: 5000,
    dueDate: '2024-03-01',
    paidDate: '2024-02-28',
    status: 'paid',
    month: 'March 2024',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Priya Patel',
    amount: 5000,
    dueDate: '2024-03-01',
    status: 'pending',
    month: 'March 2024',
  },
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Rahul Sharma',
    batchId: '1',
    date: '2024-03-12',
    status: 'present',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Priya Patel',
    batchId: '2',
    date: '2024-03-12',
    status: 'absent',
  },
];
