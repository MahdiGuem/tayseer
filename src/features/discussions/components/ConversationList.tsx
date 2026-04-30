'use client'

import { Search, Loader2 } from 'lucide-react'
import { ConversationItem } from './ConversationItem'
import { cn } from '@/src/lib/utils/cn'

interface Conversation {
  id: string
  clientId: string
  clientName: string
  lastMessageAt: string
  unreadCount: number
  isPinned?: boolean
  projectTitle: string
  projectId: string
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedDiscussionId: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelect: (id: string) => void
  loading?: boolean
}

export function ConversationList({
  conversations,
  selectedDiscussionId,
  searchQuery,
  onSearchChange,
  onSelect,
  loading
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full w-full bg-white/[0.02]">
      {/* Compact Header */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-3">
        <h2 className="font-medium text-white text-sm">Chats</h2>
        {loading && <Loader2 className="animate-spin text-slate-500" size={14} />}
      </div>

      {/* Search */}
      <div className="p-2 border-b border-white/5">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className={cn(
              'w-full bg-black/50 border border-white/10 rounded-md text-xs text-slate-300',
              'pl-8 pr-2 py-1.5 outline-none focus:border-emerald-500/50 placeholder:text-slate-600'
            )}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto py-1">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-slate-500 text-xs text-center">
              {loading ? 'Loading...' : 'No conversations'}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              clientName={conv.clientName}
              projectTitle={conv.projectTitle}
              lastMessageAt={conv.lastMessageAt}
              unreadCount={conv.unreadCount}
              isPinned={conv.isPinned}
              isSelected={selectedDiscussionId === conv.id}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}