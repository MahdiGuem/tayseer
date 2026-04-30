'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { getMessages, createDevMessage } from '@/app/actions/message'
import { useRealtimeMessages } from '@/src/hooks/useRealtimeMessages'

interface Message {
  id: string
  projectId: string
  senderRole: 'DEV' | 'CLIENT'
  senderName: string
  content: string
  createdAt: string
}

interface MessageGroup {
  date: string
  messages: Message[]
}

export function useMessages(projectId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // Fetch initial messages
  useEffect(() => {
    if (!projectId) {
      setMessages([])
      return
    }
    
    setLoading(true)
    getMessages(projectId)
      .then((data: any[]) => {
        setMessages(data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [projectId])

  // Handle new incoming messages via realtime
  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === newMessage.id)) return prev
      return [...prev, newMessage]
    })
  }, [])

  // Subscribe to realtime updates
  useRealtimeMessages({
    projectId,
    onNewMessage: handleNewMessage
  })

  const groupedMessages = useMemo<MessageGroup[]>(() => {
    const groups: MessageGroup[] = []
    let currentGroup: MessageGroup | null = null

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      if (!currentGroup || currentGroup.date !== date) {
        currentGroup = { date, messages: [] }
        groups.push(currentGroup)
      }
      currentGroup.messages.push(message)
    })

    return groups
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || !projectId) return

    try {
      const newMessage = await createDevMessage(projectId, inputValue.trim())
      // Note: Real-time will also trigger, but we add optimistically
      const createdAt = typeof newMessage.createdAt === 'string' 
        ? newMessage.createdAt 
        : new Date(newMessage.createdAt).toISOString()
      setMessages(prev => [...prev, {
        id: newMessage.id,
        projectId: newMessage.projectId,
        senderRole: newMessage.senderRole,
        senderName: newMessage.senderName,
        content: newMessage.content,
        createdAt
      }])
      setInputValue('')
    } catch (e) {
      console.error('Failed to send message:', e)
    }
  }, [inputValue, projectId])

  const markAsRead = useCallback(() => {
    // Mark all client messages as read - for future implementation
  }, [])

  return {
    messages,
    groupedMessages,
    loading,
    inputValue,
    setInputValue,
    sendMessage,
    markAsRead,
  }
}