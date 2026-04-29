'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { InvoiceTable } from '@/src/features/invoices/components/InvoiceTable';
import { useInvoiceFilter } from '@/src/features/invoices/hooks/useInvoiceFilter';
import { useToast } from '@/src/hooks/useToast';

export default function InvoicesPage() {
  const { filter, setFilter, filterOptions } = useInvoiceFilter();
  const { addToast } = useToast();

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
          <h1 className="text-3xl font-semibold tracking-tight text-white">Invoices</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage your invoices</p>
        </div>
        <button
          onClick={() => addToast('New invoice created', 'success')}
          className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          New Invoice
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f.value
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <InvoiceTable filter={filter} onToast={(msg) => addToast(msg, 'success')} />
    </motion.div>
  );
}
