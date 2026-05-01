"use client"

import { useEffect } from "react"
import { ConversationList } from "./ConversationList"
import { MessageThread } from "./MessageThread"
import { useDiscussions } from "../hooks/useDiscussions"
import { useMessages } from "../hooks/useMessages"

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
    loading
  } = useDiscussions()

  const {
    groupedMessages,
    loading: messagesLoading,
    inputValue,
    setInputValue,
    sendMessage,
    markAsRead,
  } = useMessages(selectedConversation?.projectId || null)

  useEffect(() => {
    if (selectedDiscussionId) {
      markAsRead()
    }
  }, [selectedDiscussionId, markAsRead])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    await sendMessage()
    onToast?.("Message sent")
  }

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden">
      {/* Conversation List - Left Sidebar */}
      <div className="w-72 shrink-0 hidden md:flex border-r border-white/5 overflow-hidden">
        <ConversationList
          conversations={conversations as any}
          selectedDiscussionId={selectedDiscussionId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={selectDiscussion}
          loading={loading}
        />
      </div>

      {/* Mobile: Show conversation list or thread */}
      <div className="md:hidden w-full flex min-h-0 overflow-hidden">
        {!selectedDiscussionId ? (
          <ConversationList
            conversations={conversations as any}
            selectedDiscussionId={selectedDiscussionId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={selectDiscussion}
            loading={loading}
          />
        ) : (
          <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="h-12 shrink-0 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
              <button
                onClick={() => selectDiscussion("")}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <MessageThread
                clientName={selectedConversation?.clientName || ''}
                projectTitle={selectedConversation?.projectTitle || ''}
                projectId={selectedConversation?.projectId || ''}
                loading={messagesLoading}
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
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <MessageThread
          clientName={selectedConversation?.clientName || ''}
          projectTitle={selectedConversation?.projectTitle || ''}
          projectId={selectedConversation?.projectId || ''}
          loading={messagesLoading}
          groupedMessages={groupedMessages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}