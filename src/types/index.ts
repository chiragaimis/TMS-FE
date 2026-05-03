export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  class: string;
  class_name?: string;
  batch: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  attendancePercentage: number;
  enrolledDate: string;
  address: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  batches: string[];
  salary: number;
  joinedDate: string;
}

export interface Batch {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  teacherId: string;
  students: number;
  schedule: string;
  startDate: string;
  endDate: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'upi' | 'bank';
  receiptNo: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  targetAudience: 'all' | 'students' | 'teachers';
  batches?: string[];
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  todayAttendance: number;
  pendingFees: number;
  monthlyRevenue: number;
  upcomingClasses: number;
}
