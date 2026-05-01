'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Header } from '@/src/components/layout/Header';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { ToastContainer } from '@/src/components/ui/Toast/Container';
import { useToast } from '@/src/hooks/useToast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Top Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={32} className="animate-spin text-emerald-400" />
                  <p className="text-sm text-slate-400">Loading...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}
