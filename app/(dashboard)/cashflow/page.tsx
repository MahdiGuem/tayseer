'use client'

import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { VaultCards } from '@/src/features/cashflow/components/VaultCards'
import { TransactionTable } from '@/src/features/cashflow/components/TransactionTable'
import { useCashflowFilter } from '@/src/features/cashflow/hooks/useCashflowFilter'
import { useToast } from '@/src/hooks/useToast'
import { cn } from '@/src/lib/utils/cn'

export default function CashflowPage() {
  const {
    vaultFilter,
    setVaultFilter,
    typeFilter,
    setTypeFilter,
    vaultOptions,
    typeOptions,
  } = useCashflowFilter()
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
          <h1 className="text-3xl font-semibold tracking-tight text-white">Cash Flow</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage your cashflow</p>
        </div>
        <button
          onClick={() => addToast('Export started', 'info')}
          className="px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Vault Summary Cards */}
      <div className="mb-4">
        <VaultCards filter={vaultFilter} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Vault:</span>
          {vaultOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setVaultFilter(f.value)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all border',
                vaultFilter === f.value
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/5'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Type:</span>
          {typeOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all border',
                typeFilter === f.value
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/5'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cashflow Table - Fill Page */}
      <div className="h-[calc(100vh-380px)] min-h-[400px]">
        <TransactionTable vaultFilter={vaultFilter} typeFilter={typeFilter} />
      </div>
    </motion.div>
  )
}