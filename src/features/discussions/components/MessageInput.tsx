'use client'

import { Send } from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="p-3 border-t border-white/5 bg-black/20 shrink-0">
      <div className="flex items-end gap-2">
        {/* Input Field - Compact */}
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Select a conversation...' : 'Type a message...'}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full bg-black/50 border border-white/10 rounded-md text-sm text-slate-200 px-3 py-2 pr-10 outline-none resize-none',
              'focus:border-emerald-500/50 placeholder:text-slate-600',
              'min-h-[36px] max-h-[100px]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 100)}px`
            }}
          />
        </div>

        {/* Send Button - Compact */}
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={cn(
            'p-2 rounded-md bg-emerald-500 text-black transition-all',
            'hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center'
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}