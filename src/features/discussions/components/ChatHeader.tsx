"use client"

import { MoreHorizontal } from "lucide-react"
import type { Client } from "@/src/types"

interface ChatHeaderProps {
  client: Client | null
  projectCount: number
}

export function ChatHeader({ client, projectCount }: ChatHeaderProps) {
  if (!client) {
    return (
      <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
        <span className="text-sm text-slate-400">No conversation selected</span>
      </div>
    )
  }

  return (
    <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-200">
          {client.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{client.name}</h3>
          <p className="text-[10px] text-slate-500">
            {projectCount} project{projectCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}