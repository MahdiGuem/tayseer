'use client';

import { motion } from 'framer-motion';
import { ActivityFeed } from '@/src/features/activity/components/ActivityFeed';
import { useActivityFilter } from '@/src/features/activity/hooks/useActivityFilter';
import { useToast } from '@/src/hooks/useToast';
import { cn } from '@/src/lib/utils/cn';

export default function ActivityPage() {
  const { filter, setFilter, filterOptions } = useActivityFilter();
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
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Activity</h1>
        <p className="text-sm text-slate-400 mt-1">Agent activity logs</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              filter === f.value
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/5'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <ActivityFeed filter={filter} onToast={(msg) => addToast(msg, 'info')} />
    </motion.div>
  );
}
