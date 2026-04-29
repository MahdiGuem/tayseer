'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  FileText,
  CheckCircle,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'
import { useAgentLogs } from '@/src/hooks/useActivity'

interface ActivityFeedProps {
  filter: 'all' | 'milestone' | 'invoice' | 'escrow' | 'payment' | 'alert' | 'message'
  onToast?: (message: string) => void
}

const ACTION_ICONS: Record<string, typeof Bot> = {
  milestone: Bot,
  invoice: FileText,
  escrow: CheckCircle,
  payment: DollarSign,
  alert: AlertCircle,
  message: MessageSquare,
  expense: DollarSign,
  contract: FileText
}

const SEVERITY_COLORS: Record<string, string> = {
  success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
}

function formatTimeAgo(dateInput: string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export function ActivityFeed({ filter, onToast }: ActivityFeedProps) {
  const { logs, loading } = useAgentLogs()
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    if (filter === 'all') return logs
    return logs.filter((log) => log.action === filter)
  }, [logs, filter])

  const handleLogClick = (logId: string) => {
    setSelectedLog(logId)
    setTimeout(() => {
      setSelectedLog(null)
    }, 800)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.02] animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-800" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-1/4 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No activity logs found. Actions like creating invoices, milestones, or expenses will appear here.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {filteredLogs.map((log, index) => {
          const Icon = ACTION_ICONS[log.action] || Bot
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleLogClick(log.id)}
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
                    SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.info
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{log.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{formatTimeAgo(log.createdAt)}</span>
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
                  Processing...
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}