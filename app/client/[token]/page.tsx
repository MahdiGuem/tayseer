'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'
import { supabase } from '@/lib/supabase'

interface ClientData {
  client: {
    id: string
    name: string
    platform: string | null
  }
  project: {
    id: string
    title: string
    currency: string
    status: string
  }
  messages: Array<{
    id: string
    senderRole: 'DEV' | 'CLIENT'
    senderName: string
    content: string
    createdAt: string
  }>
}

interface RealtimeMessage {
  id: string
  projectId: string
  senderRole: 'DEV' | 'CLIENT'
  senderName: string
  content: string
  createdAt: string
}

export default function ClientChatPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>('')
  const [data, setData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(p => setToken(p.token))
  }, [params])

  // Fetch initial data
  useEffect(() => {
    if (!token) return

    fetch(`/api/client/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Invalid link')
        return res.json()
      })
      .then(setData)
      .catch(() => setError('Invalid or expired link'))
      .finally(() => setLoading(false))
  }, [token])

  // Handle new messages from realtime
  const handleNewMessage = useCallback((newMsg: RealtimeMessage) => {
    setData(prev => {
      if (!prev) return prev
      // Avoid duplicates
      if (prev.messages.some(m => m.id === newMsg.id)) return prev
      return {
        ...prev,
        messages: [...prev.messages, {
          id: newMsg.id,
          senderRole: newMsg.senderRole,
          senderName: newMsg.senderName,
          content: newMsg.content,
          createdAt: newMsg.createdAt
        }]
      }
    })
  }, [])

  // Subscribe to realtime
  useEffect(() => {
    if (!data?.project.id) return

    const channel = supabase
      .channel(`client-chat:${data.project.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `projectId=eq.${data.project.id}`,
        },
        (payload) => {
          const newMsg = payload.new as RealtimeMessage
          handleNewMessage({
            ...newMsg,
            createdAt: typeof newMsg.createdAt === 'string' 
              ? newMsg.createdAt 
              : new Date().toISOString()
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [data?.project.id, handleNewMessage])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.messages])

  const sendMessage = async () => {
    if (!message.trim() || !data) return

    setSending(true)
    try {
      const res = await fetch(`/api/client/${token}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
      })
      if (!res.ok) throw new Error('Failed to send')

      const newMsg = await res.json()
      // Add to local state (realtime will also trigger but we add optimistically)
      setData(prev => prev ? {
        ...prev,
        messages: [...prev.messages, {
          id: newMsg.id,
          senderRole: 'CLIENT',
          senderName: data.client.name,
          content: message,
          createdAt: new Date().toISOString()
        }]
      } : null)
      setMessage('')
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-2">Unable to connect</p>
          <p className="text-slate-500 text-sm">{error || 'Please check your link and try again'}</p>
        </div>
      </div>
    )
  }

  const isClient = (role: 'DEV' | 'CLIENT') => role === 'CLIENT'

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-white">
            {data.client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-white font-medium">{data.client.name}</h1>
            <p className="text-slate-500 text-xs">{data.project.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400">Connected</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {data.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          data.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                isClient(msg.senderRole) ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs',
                  isClient(msg.senderRole)
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-700 text-white'
                )}
              >
                {isClient(msg.senderRole) ? data.client.name.charAt(0) : 'D'}
              </div>
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-3',
                  isClient(msg.senderRole)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-slate-200'
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={cn(
                  'text-[10px] mt-1',
                  isClient(msg.senderRole) ? 'text-emerald-200' : 'text-slate-500'
                )}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || sending}
            className="p-3 bg-emerald-500 text-black rounded-full hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          >
            {sending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}