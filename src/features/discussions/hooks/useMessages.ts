'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { getMessages, createDevMessage } from '@/app/actions/message'
import { supabase } from '@/lib/supabase'

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
  const messagesRef = useRef<Message[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Fetch initial messages
  useEffect(() => {
    if (!projectId) {
      setMessages([])
      return
    }
    
    console.log('[useMessages] Fetching initial messages for project:', projectId)
    setLoading(true)
    getMessages(projectId)
      .then((data: any[]) => {
        console.log('[useMessages] Initial messages loaded:', data?.length)
        setMessages(data || [])
      })
      .catch(e => {
        console.error('[useMessages] Error fetching messages:', e)
      })
      .finally(() => setLoading(false))
  }, [projectId])

  // Subscribe to realtime message updates + polling fallback
  useEffect(() => {
    if (!projectId) {
      console.log('[useMessages] No projectId, skipping subscription')
      return
    }

    let isStale = false

    console.log('[useMessages] Setting up realtime subscription for projectId:', projectId)
    
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message',
          filter: `projectId=eq.${projectId}`
        },
        (payload: any) => {
          if (isStale) return
          console.log('[useMessages] New message from realtime:', payload.new)
          const newMessage = payload.new
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) {
              console.log('[useMessages] Message already exists, skipping')
              return prev
            }
            return [...prev, {
              id: newMessage.id,
              projectId: newMessage.projectId,
              senderRole: newMessage.senderRole,
              senderName: newMessage.senderName,
              content: newMessage.content,
              createdAt: typeof newMessage.createdAt === 'string' 
                ? newMessage.createdAt 
                : new Date(newMessage.createdAt).toISOString()
            }]
          })
        }
      )
      .subscribe((status) => {
        console.log(`[useMessages] Subscription status for ${projectId}:`, status)
      })

    // Polling fallback - check for new messages every 2 seconds
    const poll = async () => {
      if (isStale) return
      
      try {
        const newData = await getMessages(projectId)
        if (newData && newData.length > 0) {
          const existingIds = new Set(messagesRef.current.map(m => m.id))
          const newMsgs = newData.filter((m: any) => !existingIds.has(m.id))
          
          if (newMsgs.length > 0) {
            console.log('[useMessages] Polling found', newMsgs.length, 'new messages')
            setMessages(prev => [...prev, ...newMsgs.map((msg: any) => ({
              id: msg.id,
              projectId: msg.projectId,
              senderRole: msg.senderRole,
              senderName: msg.senderName,
              content: msg.content,
              createdAt: typeof msg.createdAt === 'string' 
                ? msg.createdAt 
                : new Date(msg.createdAt).toISOString()
            }))])
          }
        }
      } catch (e) {
        console.error('[useMessages] Polling error:', e)
      }
    }

    const interval = setInterval(poll, 2000)

    return () => {
      isStale = true
      clearInterval(interval)
      console.log('[useMessages] Unsubscribing from messages:', projectId)
      supabase.removeChannel(channel)
    }
  }, [projectId])

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
      console.log('[useMessages] Sending message...')
      const newMessage = await createDevMessage(projectId, inputValue.trim())
      console.log('[useMessages] Dev message created:', newMessage.id)
      setInputValue('')
    } catch (e) {
      console.error('[useMessages] Failed to send message:', e)
    }
  }, [inputValue, projectId])

  const markAsRead = useCallback(() => {
    // Future: mark client messages as read
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