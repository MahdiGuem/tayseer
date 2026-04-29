'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { chatMessages } from '@/src/data/mocks';
import { formatTime } from '@/src/lib/utils/date';
import type { Message } from '@/src/types';

const quickPrompts = [
  "What's my total revenue?",
  "Show me active projects",
  "Any pending invoices?",
  "How are my expenses?",
];

const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('revenue') || lower.includes('money')) {
    return 'Your total outstanding revenue is $2,700 across 2 invoices. Your tax vault is at 85% of target.';
  }
  if (lower.includes('project')) {
    return 'You have 4 active projects. Hyperrise has a milestone due in 3 days.';
  }
  if (lower.includes('invoice')) {
    return 'You have 2 pending invoices totaling $2,700. Would you like me to send reminders?';
  }
  if (lower.includes('expense')) {
    return 'Your expenses this month are $1,240, which is 12% under your average.';
  }
  return "I'm here to help you manage your freelance business. Ask me about projects, invoices, expenses, or anything else!";
};

interface AIChatProps {
  onToast?: (message: string) => void;
}

export function AIChat({ onToast }: AIChatProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(chatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: `chat-${Date.now()}`,
      projectId: '',
      senderRole: 'DEV',
      senderName: 'You',
      content: chatInput,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `chat-${Date.now() + 1}`,
        projectId: '',
        senderRole: 'CLIENT',
        senderName: 'Tayseer',
        content: getAIResponse(chatInput),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Bot size={20} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Tayseer AI</h2>
          <p className="text-xs text-slate-500">Ask me anything about your business</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.senderRole === 'DEV' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.senderRole === 'DEV'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {msg.senderRole === 'DEV' ? (
                <span className="text-xs font-medium">You</span>
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.senderRole === 'DEV' ? 'bg-emerald-500/10 text-slate-200' : 'bg-white/5 text-slate-200'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {formatTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div className="bg-white/5 rounded-lg p-3 flex items-center gap-1">
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setChatInput(prompt)}
            className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-all whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Tayseer anything..."
            className="flex-1 bg-black/50 border border-white/10 rounded-lg text-sm text-slate-200 px-4 py-2.5 outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
