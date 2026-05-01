"use client"

import { MoreHorizontal } from "lucide-react"

interface ChatHeaderProps {
  clientName: string
  projectTitle: string
  hasClient: boolean
}

export function ChatHeader({ clientName, projectTitle, hasClient }: ChatHeaderProps) {
  if (!hasClient) {
    return (
      <div className="h-12 shrink-0 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
        <span className="text-sm text-slate-400">No conversation selected</span>
      </div>
    )
  }

  return (
    <div className="h-12 shrink-0 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-200">
          {clientName.charAt(0)}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{clientName}</h3>
          <p className="text-[10px] text-slate-500">
            {projectTitle}
          </p>
        </div>
      </div>
      <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}