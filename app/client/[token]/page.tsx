'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, FileText, Check, X } from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'
import { supabase } from '@/lib/supabase'
import { DownloadPlanPDF } from '@/src/components/PlanPDF'

interface ContractMilestone {
  label: string
  amount: number
  dueDate?: string
}

interface ContractJSON {
  description: string
  milestones: ContractMilestone[]
  clientNames: string[]
  devName: string
  createdAt: string
  status: string
}

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
    contract: ContractJSON | null
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

function ConfirmDialog({ 
  contract, 
  onConfirm, 
  onCancel,
  loading 
}: { 
  contract: ContractJSON
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Confirm Contract</h2>
        <p className="text-slate-400 text-sm mb-4">
          Please review the contract details below and confirm to proceed.
        </p>
        
        {contract.description && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Description</p>
            <p className="text-white text-sm">{contract.description}</p>
          </div>
        )}

        {contract.milestones && contract.milestones.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2">Milestones</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {contract.milestones.map((m, i) => (
                <div key={i} className="flex justify-between text-sm p-2 bg-white/5 rounded">
                  <span className="text-white">{m.label}</span>
                  <span className="text-slate-400">
                    ${m.amount.toLocaleString()} 
                    {m.dueDate && ` • ${new Date(m.dueDate).toLocaleDateString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-white/10 text-slate-300 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ClientChatPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>('')
  const [data, setData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(p => setToken(p.token))
  }, [params])

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

  const handleNewMessage = useCallback((newMsg: RealtimeMessage) => {
    setData(prev => {
      if (!prev) return prev
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

  const confirmContract = async () => {
    if (!data?.project.id) return
    
    setConfirming(true)
    try {
      const res = await fetch(`/api/client/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirmContract' })
      })
      if (!res.ok) throw new Error('Failed to confirm')
      
      setData(prev => prev ? {
        ...prev,
        project: {
          ...prev.project,
          contract: prev.project.contract ? {
            ...prev.project.contract,
            status: 'confirmed'
          } : null
        }
      } : null)
      setShowConfirm(false)
    } catch {
      setError('Failed to confirm contract')
    } finally {
      setConfirming(false)
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
  const contract = data.project.contract
  const hasContract = contract?.milestones?.length || contract?.description
  const isContractSent = contract?.status === 'sent'
  const isContractConfirmed = contract?.status === 'confirmed'

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {showConfirm && contract && (
        <ConfirmDialog
          contract={contract}
          onConfirm={confirmContract}
          onCancel={() => setShowConfirm(false)}
          loading={confirming}
        />
      )}

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
        <div className="flex items-center gap-3">
          {hasContract && (
            <button
              onClick={() => setShowContract(!showContract)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-slate-200 rounded-md hover:bg-white/10 text-sm transition-colors"
            >
              <FileText size={14} />
              {showContract ? 'Hide' : 'View'}
            </button>
          )}
          {isContractSent && !isContractConfirmed && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 text-sm transition-colors"
            >
              <Check size={14} />
              Confirm
            </button>
          )}
          {isContractConfirmed && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-md text-xs">
              <Check size={12} />
              Confirmed
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400">Connected</span>
          </div>
        </div>
      </div>

      {/* Contract Section */}
      {showContract && hasContract && (
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="bg-black border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">Contract</h3>
                {contract?.status && (
                  <span className={cn(
                    'text-xs',
                    contract.status === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'
                  )}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                )}
              </div>
              {isContractConfirmed && contract && (
                <DownloadPlanPDF
                  projectTitle={data.project.title}
                  description={contract.description}
                  milestones={contract.milestones || []}
                  currency={data.project.currency}
                />
              )}
            </div>
            
            {contract?.description && (
              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-1">Description</p>
                <p className="text-white text-sm">{contract.description}</p>
              </div>
            )}

            {contract?.milestones && contract.milestones.length > 0 && (
              <div>
                <p className="text-sm text-slate-400 mb-2">Milestones</p>
                <div className="space-y-2">
                  {contract.milestones.map((m, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white">{m.label}</span>
                      <span className="text-slate-400">
                        ${m.amount.toLocaleString()} {m.dueDate && `• ${new Date(m.dueDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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