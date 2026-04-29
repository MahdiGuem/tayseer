'use client';

import { cn } from '@/src/lib/utils/cn';

interface BadgeProps {
  status: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<string, { class: string; label: string; dot: string }> = {
  settled: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Settled',
    dot: 'bg-emerald-500',
  },
  processing: {
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Processing',
    dot: 'bg-amber-500',
  },
  failed: {
    class: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    label: 'Failed',
    dot: 'bg-rose-500',
  },
  active: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Active',
    dot: 'bg-emerald-500',
  },
  completed: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Complete',
    dot: 'bg-emerald-500',
  },
  pending: {
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Pending',
    dot: 'bg-amber-500',
  },
  draft: {
    class: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    label: 'Draft',
    dot: 'bg-slate-500',
  },
  on_hold: {
    class: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    label: 'On Hold',
    dot: 'bg-slate-500',
  },
  pending_approval: {
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Approval',
    dot: 'bg-amber-500',
  },
  DRAFT: {
    class: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    label: 'Draft',
    dot: 'bg-slate-500',
  },
  ACTIVE: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Active',
    dot: 'bg-emerald-500',
  },
  COMPLETED: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Completed',
    dot: 'bg-emerald-500',
  },
  ARCHIVED: {
    class: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    label: 'Archived',
    dot: 'bg-slate-500',
  },
};

export function Badge({ status, showDot = true, size = 'md', className }: BadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium border',
        size === 'sm' ? 'text-[10px]' : 'text-xs',
        config.class,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            config.dot,
            status === 'processing' && 'animate-pulse'
          )}
        />
      )}
      {config.label}
    </span>
  );
}
