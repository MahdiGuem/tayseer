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
    console.log('[useDiscussions] Fetching initial conversations')
    getProjects()
      .then((projects: any[]) => {
        console.log('[useDiscussions] Projects loaded:', projects.length)
        const convs: Conversation[] = projects.flatMap((p) => 
          p.projectClients?.map((pc: any) => ({
            id: pc.id,
            clientId: pc.client?.id,
            clientName: pc.client?.name || 'Unknown',
            lastMessageAt: p.messages?.[p.messages.length - 1]?.createdAt || pc.createdAt,
            unreadCount: 0,
            projectTitle: p.title || 'Untitled',
            projectId: p.id
          })) || []
        )
        // Sort by last message time
        convs.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        )
        console.log('[useDiscussions] Conversations prepared:', convs.length)
        setConversations(convs)
      })
      .catch(e => {
        console.error('[useDiscussions] Error fetching projects:', e)
      })
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
    console.log('[useDiscussions] Selected discussion:', id)
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