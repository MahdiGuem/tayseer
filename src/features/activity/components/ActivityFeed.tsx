'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  FileText,
  CheckCircle,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { agentLogs } from '@/src/data/mocks';
import { cn } from '@/src/lib/utils/cn';
import type { AgentLog, LogAction, LogSeverity } from '@/src/types';

interface ActivityFeedProps {
  filter: LogAction | 'all';
  onToast?: (message: string) => void;
}

const ACTION_ICONS: Record<LogAction, typeof Bot> = {
  milestone: Bot,
  invoice: FileText,
  escrow: CheckCircle,
  payment: DollarSign,
  alert: AlertCircle,
  message: MessageSquare,
};

const SEVERITY_COLORS: Record<LogSeverity, string> = {
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export function ActivityFeed({ filter, onToast }: ActivityFeedProps) {
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const filteredLogs =
    filter === 'all' ? agentLogs : agentLogs.filter((log) => log.action === filter);

  const handleLogClick = (log: AgentLog) => {
    setSelectedLog(log.id);
    setTimeout(() => {
      setSelectedLog(null);
      if (log.projectId) {
        onToast?.(`Navigating to project ${log.projectId}...`);
      } else if (log.invoiceId) {
        onToast?.(`Opening invoice ${log.invoiceId}...`);
      }
    }, 800);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {filteredLogs.map((log, index) => {
          const Icon = ACTION_ICONS[log.action];
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleLogClick(log)}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all',
                selectedLog === log.id
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'h-9 w-9 rounded-lg flex items-center justify-center border',
                    SEVERITY_COLORS[log.severity]
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{log.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{log.timestamp}</span>
                    {log.clientName && (
                      <span className="text-xs text-emerald-400">{log.clientName}</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedLog === log.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-xs text-emerald-400 flex items-center gap-1"
                >
                  <Loader2 size={12} className="animate-spin" />
                  Opening...
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
