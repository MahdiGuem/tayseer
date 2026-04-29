'use client'

import { Pin } from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'
import type { Client } from '@/src/types'

interface ConversationItemProps {
  client: Client
  lastMessageAt: string
  unreadCount: number
  isPinned?: boolean
  isSelected: boolean
  onClick: () => void
}

export function ConversationItem({
  client,
  lastMessageAt,
  unreadCount,
  isPinned,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-2 py-2 flex items-center gap-2 transition-all',
        'hover:bg-white/[0.04]',
        isSelected && 'bg-emerald-500/10 border-l-2 border-emerald-500'
      )}
    >
      {/* Avatar - Smaller */}
      <div className="relative flex-shrink-0">
        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-200">
          {client.name.charAt(0)}
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] font-medium text-black">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Info - Compact */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-1">
          <h4
            className={cn(
              'text-sm truncate',
              unreadCount > 0 ? 'text-white' : 'text-slate-300'
            )}
          >
            {client.name}
          </h4>
          <span className="text-[10px] text-slate-500 flex-shrink-0">
            {timeAgo(lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-0.5">
          <p
            className={cn(
              'text-xs truncate',
              unreadCount > 0 ? 'text-slate-300' : 'text-slate-500'
            )}
          >
            {unreadCount > 0 ? `${unreadCount} new` : 'No messages'}
          </p>

          {isPinned && (
            <Pin size={10} className="text-emerald-400 flex-shrink-0" />
          )}
        </div>
      </div>
    </button>
  )
}