'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { BusinessPulse } from '@/src/features/overview/components/BusinessPulse';
import { AIChat } from '@/src/features/overview/components/AIChat';
import { useToast } from '@/src/hooks/useToast';

export default function OverviewPage() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Your autonomous financial command center</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast('New transfer initiated', 'info')}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus size={16} />
            New Transfer
          </button>
        </div>
      </div>

      {/* Business Pulse */}
      <BusinessPulse />

      {/* AI Chat Interface */}
      <AIChat />
    </motion.div>
  );
}
