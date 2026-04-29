"use client"

import { useEffect } from "react"
import { ConversationList } from "./ConversationList"
import { MessageThread } from "./MessageThread"
import { useDiscussions } from "../hooks/useDiscussions"
import { useMessages } from "../hooks/useMessages"
import { cn } from "@/src/lib/utils/cn"

interface ChatLayoutProps {
  onToast?: (message: string) => void
}

export function ChatLayout({ onToast }: ChatLayoutProps) {
  const {
    conversations,
    selectedConversation,
    selectedDiscussionId,
    searchQuery,
    setSearchQuery,
    selectDiscussion,
  } = useDiscussions()

  const {
    groupedMessages,
    inputValue,
    setInputValue,
    sendMessage,
    markAsRead,
  } = useMessages(selectedDiscussionId)

  useEffect(() => {
    if (selectedDiscussionId) {
      markAsRead()
    }
  }, [selectedDiscussionId, markAsRead])

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage()
    onToast?.("Message sent")
  }

  return (
    <div
      className={cn(
        "flex h-full w-full border border-white/5 bg-white/[0.02] overflow-hidden",
      )}
    >
      {/* Conversation List - Left Sidebar */}
      <div className="w-72 flex-shrink-0 hidden md:flex border-r border-white/5">
        <ConversationList
          conversations={conversations}
          selectedDiscussionId={selectedDiscussionId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={selectDiscussion}
        />
      </div>

      {/* Mobile: Show conversation list or thread */}
      <div className="md:hidden w-full flex">
        {!selectedDiscussionId ? (
          <ConversationList
            conversations={conversations}
            selectedDiscussionId={selectedDiscussionId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={selectDiscussion}
          />
        ) : (
          <div className="w-full flex flex-col">
            {/* Mobile back button */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
              <button
                onClick={() => selectDiscussion("")}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
            <div className="flex-1">
              <MessageThread
                client={selectedConversation?.client || null}
                projectCount={selectedConversation?.projectCount || 0}
                groupedMessages={groupedMessages}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSend={handleSend}
              />
            </div>
          </div>
        )}
      </div>

      {/* Message Thread - Right Area (Desktop) */}
      <div className="hidden md:flex flex-1">
        <MessageThread
          client={selectedConversation?.client || null}
          projectCount={selectedConversation?.projectCount || 0}
          groupedMessages={groupedMessages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}