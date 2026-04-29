'use client'

import { Search } from 'lucide-react'
import { ConversationItem } from './ConversationItem'
import { cn } from '@/src/lib/utils/cn'
import type { Client } from '@/src/types'

interface Conversation {
  id: string
  clientId: string
  lastMessageAt: string
  unreadCount: number
  isPinned?: boolean
  client: Client
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedDiscussionId: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelect: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedDiscussionId,
  searchQuery,
  onSearchChange,
  onSelect,
}: ConversationListProps) {
  const pinnedConversations = conversations.filter((c) => c.isPinned)
  const regularConversations = conversations.filter((c) => !c.isPinned)

  return (
    <div className="flex flex-col h-full w-full bg-white/[0.02]">
      {/* Compact Header */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-3">
        <h2 className="font-medium text-white text-sm">Chats</h2>
        <span className="text-xs text-slate-500">
          {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        </span>
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
              No conversations
            </p>
          </div>
        ) : (
          <>
            {pinnedConversations.length > 0 && (
              <div className="px-2 py-1">
                <div className="px-2 py-1 text-[10px] font-medium text-slate-500 uppercase">
                  Pinned
                </div>
                {pinnedConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    client={conv.client}
                    lastMessageAt={conv.lastMessageAt}
                    unreadCount={conv.unreadCount}
                    isPinned={conv.isPinned}
                    isSelected={selectedDiscussionId === conv.id}
                    onClick={() => onSelect(conv.id)}
                  />
                ))}
              </div>
            )}

            {regularConversations.length > 0 && (
              <div className="px-2 py-1">
                {pinnedConversations.length > 0 && (
                  <div className="px-2 py-1 text-[10px] font-medium text-slate-500 uppercase">
                    All
                  </div>
                )}
                {regularConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    client={conv.client}
                    lastMessageAt={conv.lastMessageAt}
                    unreadCount={conv.unreadCount}
                    isPinned={conv.isPinned}
                    isSelected={selectedDiscussionId === conv.id}
                    onClick={() => onSelect(conv.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}