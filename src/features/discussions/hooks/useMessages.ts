'use client';

import { useState, useMemo, useCallback } from 'react';
import { discussionMessages } from '@/src/data/mocks';
import type { DiscussionMessage, SenderRole } from '@/src/types';

interface MessageGroup {
  date: string;
  messages: DiscussionMessage[];
}

export function useMessages(discussionId: string | null) {
  const [messages, setMessages] = useState<DiscussionMessage[]>(discussionMessages);
  const [inputValue, setInputValue] = useState('');

  const discussionMessages_filtered = useMemo(() => {
    if (!discussionId) return [];
    return messages
      .filter((m) => m.discussionId === discussionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages, discussionId]);

  const groupedMessages = useMemo<MessageGroup[]>(() => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    discussionMessages_filtered.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (!currentGroup || currentGroup.date !== date) {
        currentGroup = { date, messages: [] };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(message);
    });

    return groups;
  }, [discussionMessages_filtered]);

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !discussionId) return;

    const newMessage: DiscussionMessage = {
      id: `dm-${Date.now()}`,
      discussionId,
      senderRole: 'DEV' as SenderRole,
      senderName: 'You',
      content: inputValue.trim(),
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  }, [inputValue, discussionId]);

  const markAsRead = useCallback(() => {
    if (!discussionId) return;
    
    setMessages((prev) =>
      prev.map((m) =>
        m.discussionId === discussionId && m.senderRole === 'CLIENT' && m.status !== 'read'
          ? { ...m, status: 'read' }
          : m
      )
    );
  }, [discussionId]);

  return {
    messages: discussionMessages_filtered,
    groupedMessages,
    inputValue,
    setInputValue,
    sendMessage,
    markAsRead,
  };
}
