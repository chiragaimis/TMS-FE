import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarOpen ? 256 : 80,
        }}
        className="pt-16 transition-all hidden md:block"
      >
        <div className="p-6">{children}</div>
      </motion.main>
      <main className="pt-16 md:hidden">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
