'use client';

import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils/cn';
import type { DiscussionMessage } from '@/src/types';

interface MessageBubbleProps {
  message: DiscussionMessage;
  isLastInGroup: boolean;
}

export function MessageBubble({ message, isLastInGroup }: MessageBubbleProps) {
  const isFreelancer = message.senderRole === 'DEV';
  const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div
      className={cn(
        'flex gap-3',
        isFreelancer ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
          isFreelancer
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-blue-500/20 text-blue-400'
        )}
      >
        {isFreelancer ? 'You' : message.senderName.charAt(0)}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
          isFreelancer
            ? 'bg-emerald-500/10 text-slate-200 rounded-tr-sm'
            : 'bg-white/5 text-slate-200 rounded-tl-sm'
        )}
      >
        {/* Sender name for client messages */}
        {!isFreelancer && (
          <p className="text-xs text-blue-400 font-medium mb-1">{message.senderName}</p>
        )}
        
        <p className="leading-relaxed">{message.content}</p>

        {/* Time and Status */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isFreelancer ? 'justify-end' : 'justify-start'
          )}
        >
          <span className="text-[10px] text-slate-500">{time}</span>
          
          {/* Read receipts for freelancer messages */}
          {isFreelancer && (
            <span className="text-slate-500">
              {message.status === 'read' ? (
                <CheckCheck size={12} className="text-blue-400" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
