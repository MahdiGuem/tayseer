'use client';

import { useMemo } from 'react';
import { useProjects } from '@/src/hooks/useProjects'
import { useExpenses } from '@/src/hooks/useActivity'
import { formatCurrency } from '@/src/lib/utils/currency';
import { cn } from '@/src/lib/utils/cn';
import type { VaultType } from '@/src/types';

const VAULT_COLORS: Record<VaultType, string> = {
  tax: 'text-emerald-400',
  expenses: 'text-blue-400',
  profit: 'text-violet-400',
};

const VAULT_BADGES: Record<VaultType, string> = {
  tax: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  expenses: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  profit: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

interface VaultCardsProps {
  filter: 'all' | VaultType;
}

export function VaultCards({ filter }: VaultCardsProps) {
  const { projects } = useProjects()
  const { expenses } = useExpenses()
  const vaults: VaultType[] = ['tax', 'expenses', 'profit'];

  const vaultData = useMemo(() => {
    if (!projects) return { tax: 0, expenses: 0, profit: 0 }

    let totalRevenue = 0
    projects.forEach(p => {
      p.milestones?.filter(m => m.isPaid).forEach(m => {
        totalRevenue += m.amount || 0
      })
    })

    let totalExpenses = 0
    expenses?.forEach(e => {
      totalExpenses += e.amount || 0
    })

    const taxRate = 20 // Default tax rate
    const tax = totalRevenue * (taxRate / 100)
    const profit = totalRevenue - tax - totalExpenses

    return {
      tax,
      expenses: totalExpenses,
      profit: Math.max(0, profit)
    }
  }, [projects, expenses])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(filter === 'all' ? vaults : [filter]).map((vault) => {
        const balance = vaultData[vault]

        return (
          <div key={vault} className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300 capitalize">{vault} Vault</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border',
                  VAULT_BADGES[vault]
                )}
              >
                {vault.charAt(0).toUpperCase() + vault.slice(1)}
              </span>
            </div>
            <p className={cn('text-2xl font-semibold', VAULT_COLORS[vault])}>
              {formatCurrency(balance, 'USD')}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-slate-500">
              <span>Balance</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}