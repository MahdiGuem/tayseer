"use client"
import { useEffect, useRef, useState } from "react"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { ChatHeader } from "./ChatHeader"
import { Loader2, FileText } from "lucide-react"
import { ContractModal } from "./ContractModal"
import { getProjectWithContract } from "@/app/actions/contract"

interface MessageGroup {
  date: string
  messages: Array<{
    id: string
    senderRole: "DEV" | "CLIENT"
    senderName: string
    content: string
    createdAt: string
  }>
}

interface MessageThreadProps {
  clientName: string
  projectTitle: string
  projectId: string
  loading?: boolean
  groupedMessages: MessageGroup[]
  inputValue: string
  onInputChange: (value: string) => void
  onSend: () => void
}

export function MessageThread({
  clientName,
  projectTitle,
  projectId,
  loading,
  groupedMessages,
  inputValue,
  onInputChange,
  onSend,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showContractModal, setShowContractModal] = useState(false)
  const [contractStatus, setContractStatus] = useState<string>('draft')

  useEffect(() => {
    if (projectId) {
      getProjectWithContract(projectId).then(p => {
        if (p?.contract) {
          setContractStatus(p.contract.status)
        }
      })
    }
  }, [projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [groupedMessages])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const hasClient = clientName.length > 0
  const isContractSent = contractStatus === 'sent' || contractStatus === 'confirmed'

  return (
    <div className="flex flex-col h-full w-full bg-black/20">
      <ChatHeader 
        clientName={clientName} 
        projectTitle={projectTitle} 
        hasClient={hasClient}
      />

      {hasClient && projectId && (
        <div className="shrink-0 px-4 py-2 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
          <button
            onClick={() => setShowContractModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 text-sm font-medium transition-colors"
          >
            <FileText size={14} />
            {isContractSent ? 'View Contract' : 'Edit Contract'}
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-slate-500" size={24} />
          </div>
        ) : hasClient ? (
          groupedMessages.length > 0 ? (
            groupedMessages.map((group) => (
              <div key={group.date} className="space-y-2">
                <div className="flex justify-center">
                  <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-slate-500">
                    {formatDate(group.date)}
                  </span>
                </div>
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    senderRole={message.senderRole}
                    senderName={message.senderName}
                    content={message.content}
                    createdAt={message.createdAt}
                    clientName={clientName}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-400 text-sm">No messages yet</p>
                <p className="text-slate-600 text-xs mt-1">
                  Start the conversation below
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Select a conversation
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Choose a client to start messaging
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {hasClient && (
        <MessageInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          disabled={!hasClient}
        />
      )}

      {showContractModal && projectId && (
        <ContractModal
          projectId={projectId}
          onClose={() => setShowContractModal(false)}
        />
      )}
    </div>
  )
}