'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils/cn';
import type { Toast } from '@/src/types';

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={cn(
              'px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-2 min-w-[300px]',
              toast.type === 'success' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
              toast.type === 'error' && 'bg-rose-500/10 border-rose-500/30 text-rose-500',
              toast.type === 'info' && 'bg-blue-500/10 border-blue-500/30 text-blue-500'
            )}
          >
            {toast.type === 'success' ? (
              <Check size={16} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <Loader2 size={16} className="animate-spin" />
            )}
            <span className="text-sm flex-1 text-slate-200">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
