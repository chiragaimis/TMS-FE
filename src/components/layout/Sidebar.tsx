import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Library,
  ClipboardCheck,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils/helpers';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: GraduationCap, label: 'Teachers', path: '/teachers' },
  { icon: Library, label: 'Classes', path: '/classes' },
  { icon: BookOpen, label: 'Batches', path: '/batches' },
  { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
  { icon: DollarSign, label: 'Fees', path: '/fees' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Bell, label: 'Announcements', path: '/announcements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 hidden md:block"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {sidebarOpen && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-primary-600"
              >
                TMS
              </motion.h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft
                className={cn(
                  'w-5 h-5 transition-transform',
                  !sidebarOpen && 'rotate-180'
                )}
              />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
