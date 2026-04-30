'use client'

import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { createDevMessage } from '@/app/actions/message'

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
  useEffect(() => {
    if (!projectId) return

    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `projectId=eq.${projectId}`,
        },
        (payload) => {
          const newMessage = payload.new as RealtimeMessage
          // Convert Date to string if needed
          const message: RealtimeMessage = {
            ...newMessage,
            createdAt: typeof newMessage.createdAt === 'string' 
              ? newMessage.createdAt 
              : new Date().toISOString()
          }
          onNewMessage?.(message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, onNewMessage])
}

// For client-side realtime - subscribes to all messages for a project via client token
export function useClientRealtime(clientToken: string, onNewMessage: (message: RealtimeMessage) => void) {
  useEffect(() => {
    if (!clientToken) return

    const channel = supabase
      .channel(`client-messages:${clientToken}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        (payload) => {
          const newMessage = payload.new as RealtimeMessage
          const message: RealtimeMessage = {
            ...newMessage,
            createdAt: typeof newMessage.createdAt === 'string' 
              ? newMessage.createdAt 
              : new Date().toISOString()
          }
          onNewMessage(message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientToken, onNewMessage])
}