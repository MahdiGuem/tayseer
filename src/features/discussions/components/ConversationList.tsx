'use client';

import { Search } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import { cn } from '@/src/lib/utils/cn';
import type { Client } from '@/src/types';

interface Conversation {
  id: string;
  clientId: string;
  lastMessageAt: string;
  unreadCount: number;
  isPinned?: boolean;
  client: Client;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedDiscussionId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedDiscussionId,
  searchQuery,
  onSearchChange,
  onSelect,
}: ConversationListProps) {
  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const regularConversations = conversations.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-full border-r border-white/5 bg-white/[0.02]">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-4">
        <h2 className="font-semibold text-white">Discussions</h2>
        <span className="text-xs text-slate-500">
          {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread
        </span>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clients..."
            className={cn(
              'w-full bg-black/50 border border-white/10 rounded-lg text-sm text-slate-300',
              'pl-9 pr-3 py-2 outline-none focus:border-emerald-500/50 placeholder:text-slate-600'
            )}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-slate-500 text-sm text-center">
              No conversations found
            </p>
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinnedConversations.length > 0 && (
              <div className="pb-2">
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
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

            {/* Regular */}
            {regularConversations.length > 0 && (
              <div>
                {pinnedConversations.length > 0 && (
                  <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    All Messages
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
  );
}
