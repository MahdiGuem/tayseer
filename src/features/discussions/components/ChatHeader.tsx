'use client';

import { MoreVertical } from 'lucide-react';
import { TrustScore } from '@/src/components/ui/TrustScore';
import { cn } from '@/src/lib/utils/cn';
import type { Client } from '@/src/types';

interface ChatHeaderProps {
  client: Client | null;
  projectCount: number;
  isOnline?: boolean;
}

export function ChatHeader({ client, projectCount, isOnline = true }: ChatHeaderProps) {
  if (!client) {
    return (
      <div className="h-16 border-b border-white/5 flex items-center justify-center px-4 bg-white/[0.02]">
        <p className="text-slate-500 text-sm">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
      {/* Left: Client Info */}
      <div className="flex items-center gap-3">
        {/* Avatar with status */}
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-200">
            {client.name.charAt(0)}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-black" />
          )}
        </div>

        {/* Name and Info */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-slate-200">{client.name}</h3>
            <TrustScore score={client.trustScore || 80} />
          </div>
          <p className="text-xs text-slate-500">
            {isOnline ? 'Online' : 'Offline'} • {projectCount} project{projectCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          className={cn(
            'p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="More options (coming soon)"
          disabled
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
