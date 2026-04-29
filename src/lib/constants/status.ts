import type { ProjectStatus, MilestoneStatus, LogSeverity } from '@/src/types';

interface StatusConfig {
  class: string;
  label: string;
  dot: string;
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
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

export const MILESTONE_STATUS_CONFIG: Record<MilestoneStatus, StatusConfig> = {
  pending: {
    class: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Pending',
    dot: 'bg-amber-500',
  },
  in_review: {
    class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    label: 'In Review',
    dot: 'bg-blue-500',
  },
  completed: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Completed',
    dot: 'bg-emerald-500',
  },
  rejected: {
    class: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    label: 'Rejected',
    dot: 'bg-rose-500',
  },
};

export const INVOICE_STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: {
    class: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    label: 'Draft',
    dot: 'bg-slate-500',
  },
  sent: {
    class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    label: 'Sent',
    dot: 'bg-blue-500',
  },
  paid: {
    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Paid',
    dot: 'bg-emerald-500',
  },
  overdue: {
    class: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    label: 'Overdue',
    dot: 'bg-rose-500',
  },
};

export const LOG_SEVERITY_CONFIG: Record<LogSeverity, { class: string }> = {
  info: {
    class: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  success: {
    class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  warning: {
    class: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
};

export const LOG_ACTION_ICONS: Record<string, string> = {
  milestone: 'Bot',
  invoice: 'FileText',
  escrow: 'CheckCircle',
  payment: 'DollarSign',
  alert: 'AlertCircle',
  message: 'MessageSquare',
};
