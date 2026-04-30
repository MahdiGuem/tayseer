'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { getProjects } from '@/app/actions/project'

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

export function useDiscussions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then((projects: any[]) => {
        const convs: Conversation[] = projects.flatMap((p) => 
          p.clients?.map((c: any) => ({
            id: c.id,
            clientId: c.id,
            clientName: c.name || 'Unknown',
            lastMessageAt: p.messages?.[p.messages.length - 1]?.createdAt || c.createdAt,
            unreadCount: 0,
            projectTitle: p.title || 'Untitled',
            projectId: p.id
          })) || []
        )
        // Sort by last message time
        convs.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        )
        setConversations(convs)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter((conv) =>
      conv.clientName.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedDiscussionId) || null
  }, [conversations, selectedDiscussionId])

  const selectDiscussion = useCallback((id: string) => {
    setSelectedDiscussionId(id || null)
  }, [])

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectedDiscussionId,
    searchQuery,
    setSearchQuery,
    selectDiscussion,
    totalUnreadCount: 0,
    loading
  }
}