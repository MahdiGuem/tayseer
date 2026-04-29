'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { BusinessPulse } from '@/src/features/overview/components/BusinessPulse'
import { AIChat } from '@/src/features/overview/components/AIChat'
import { useToast } from '@/src/hooks/useToast'

export default function OverviewPage() {
  const { addToast } = useToast()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Your autonomous financial command center</p>
        </div>
        <button
          onClick={() => addToast('New transfer initiated', 'info')}
          className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Plus size={16} />
          New Transfer
        </button>
      </div>

      {/* Business Pulse - Full Width */}
      <div className="mb-6">
        <BusinessPulse />
      </div>

      {/* AI Chat - Fill remaining space */}
      <div className="h-[calc(100vh-320px)] min-h-[400px]">
        <AIChat />
      </div>
    </motion.div>
  )
}