'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientGrid } from '@/src/features/clients/components/ClientGrid';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { useClientSort } from '@/src/features/clients/hooks/useClientSort';
import { useToast } from '@/src/hooks/useToast';

export default function ClientsPage() {
  const { sortBy, setSortBy, sortOptions } = useClientSort();
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Breadcrumb items={[{ label: 'Home' }, { label: 'Clients' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">Trust-based CRM</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-black border border-white/10 rounded-lg text-sm text-slate-300 px-3 py-2 outline-none focus:border-emerald-500/50"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => addToast('Client added successfully', 'success')}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <ClientGrid sortBy={sortBy} />
    </motion.div>
  );
}
