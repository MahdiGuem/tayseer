'use client'

import { cn } from '@/src/lib/utils/cn'

interface MessageBubbleProps {
  senderRole: 'DEV' | 'CLIENT'
  senderName: string
  content: string
  createdAt: string
  clientName: string
}

export function MessageBubble({ 
  senderRole, 
  senderName, 
  content, 
  createdAt,
  clientName 
}: MessageBubbleProps) {
  const isDev = senderRole === 'DEV'
  const time = new Date(createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className={cn('flex gap-3', isDev ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
          isDev
            ? 'bg-emerald-500 text-black'
            : 'bg-slate-700 text-white'
        )}
      >
        {isDev ? 'D' : clientName.charAt(0)}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
          isDev
            ? 'bg-emerald-500 text-white'
            : 'bg-white/10 text-slate-200'
        )}
      >
        <p className="leading-relaxed">{content}</p>
        
        <div className={cn('flex items-center gap-1 mt-1', isDev ? 'justify-end' : 'justify-start')}>
          <span className="text-[10px] text-slate-400">{time}</span>
        </div>
      </div>
    </div>
  )
}