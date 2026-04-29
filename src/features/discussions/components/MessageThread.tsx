"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { ChatHeader } from "./ChatHeader"
import type { Client } from "@/src/types"

interface MessageGroup {
  date: string
  messages: Array<{
    id: string
    discussionId: string
    senderRole: "DEV" | "CLIENT"
    senderName: string
    content: string
    status: "sent" | "delivered" | "read"
    createdAt: string
  }>
}

interface MessageThreadProps {
  client: Client | null
  projectCount: number
  groupedMessages: MessageGroup[]
  inputValue: string
  onInputChange: (value: string) => void
  onSend: () => void
}

export function MessageThread({
  client,
  projectCount,
  groupedMessages,
  inputValue,
  onInputChange,
  onSend,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="flex flex-col h-full w-full bg-black/20">
      <ChatHeader client={client} projectCount={projectCount} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {client ? (
          groupedMessages.length > 0 ? (
            groupedMessages.map((group) => (
              <div key={group.date} className="space-y-2">
                {/* Date Header */}
                <div className="flex justify-center">
                  <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-slate-500">
                    {formatDate(group.date)}
                  </span>
                </div>

                {/* Messages in group */}
                {group.messages.map((message, messageIndex) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isLastInGroup={messageIndex === group.messages.length - 1}
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

      {/* Input Area */}
      {client && (
        <MessageInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          disabled={!client}
        />
      )}
    </div>
  )
}