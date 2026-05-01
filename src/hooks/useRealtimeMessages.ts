'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface RealtimeMessage {
  id: string
  projectId: string
  senderRole: 'DEV' | 'CLIENT'
  senderName: string
  content: string
  createdAt: string
}

interface UseRealtimeMessagesOptions {
  projectId: string | null
  onNewMessage?: (message: RealtimeMessage) => void
}

export function useRealtimeMessages({ projectId, onNewMessage }: UseRealtimeMessagesOptions) {
  const onNewMessageRef = useRef(onNewMessage)
  const subscriptionRef = useRef<any>(null)
  
  onNewMessageRef.current = onNewMessage

  useEffect(() => {
    if (!projectId) {
      console.log('[useRealtimeMessages] No projectId, skipping subscription')
      return
    }

    let isStale = false

    // Subscribe to realtime updates on the messages table
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
          
          console.log('[useRealtimeMessages] New message received:', payload.new)
          
          const newMessage = payload.new
          if (onNewMessageRef.current) {
            onNewMessageRef.current({
              id: newMessage.id,
              projectId: newMessage.projectId,
              senderRole: newMessage.senderRole,
              senderName: newMessage.senderName,
              content: newMessage.content,
              createdAt: newMessage.createdAt instanceof Date 
                ? newMessage.createdAt.toISOString() 
                : newMessage.createdAt
            })
          }
        }
      )
      .subscribe((status) => {
        console.log(`[useRealtimeMessages] Subscription status: ${status}`)
      })

    subscriptionRef.current = channel

    return () => {
      isStale = true
      console.log('[useRealtimeMessages] Cleaning up subscription for projectId:', projectId)
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [projectId])
}