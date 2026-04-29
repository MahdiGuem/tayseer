'use client';

import { useState, useMemo, useCallback } from 'react';
import { discussions } from '@/src/data/mocks';
import { projects } from '@/src/data/mocks';
import type { Discussion, Client } from '@/src/types';

interface ConversationWithClient extends Discussion {
  client: Client;
  projectCount: number;
}

export function useDiscussions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);

  const conversations = useMemo<ConversationWithClient[]>(() => {
    // Get all clients from projects (flatten and deduplicate by clientId)
    const allClients = projects.flatMap((p) => p.clients);
    const uniqueClients = new Map<string, Client>();
    allClients.forEach((c) => uniqueClients.set(c.id, c));

    // Map discussions to clients with project counts
    return discussions
      .map((disc) => {
        const client = uniqueClients.get(disc.clientId);
        if (!client) return null;
        
        const projectCount = projects.filter((p) =>
          p.clients.some((c) => c.id === disc.clientId)
        ).length;
        
        return {
          ...disc,
          client,
          projectCount,
        };
      })
      .filter((item): item is ConversationWithClient => item !== null)
      .sort((a, b) => {
        // Pinned first, then by last message time
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      });
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) =>
      conv.client.name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedDiscussionId) || null;
  }, [conversations, selectedDiscussionId]);

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }, [conversations]);

  const selectDiscussion = useCallback((id: string) => {
    setSelectedDiscussionId(id);
  }, []);

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectedDiscussionId,
    searchQuery,
    setSearchQuery,
    selectDiscussion,
    totalUnreadCount,
  };
}
