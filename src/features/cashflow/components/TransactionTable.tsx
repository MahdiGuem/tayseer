'use client';

import { useMemo } from 'react';
import { useProjects } from '@/src/hooks/useProjects'
import { useExpenses } from '@/src/hooks/useActivity'
import { formatCurrency } from '@/src/lib/utils/currency';
import { cn } from '@/src/lib/utils/cn';
import type { VaultType, TransactionType } from '@/src/types';

interface TransactionTableProps {
  vaultFilter: 'all' | VaultType;
  typeFilter: 'all' | TransactionType;
}

const VAULT_BADGES: Record<VaultType, string> = {
  tax: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  expenses: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  profit: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export function TransactionTable({ vaultFilter, typeFilter }: TransactionTableProps) {
  const { projects } = useProjects()
  const { expenses } = useExpenses()

  const transactions = useMemo(() => {
    const txns: Array<{
      id: string
      date: string
      description: string
      category: string
      vault: VaultType
      type: TransactionType
      amount: number
    }> = []

    // Add milestones as inflows
    projects?.forEach(p => {
      p.milestones?.filter(m => m.isPaid).forEach(m => {
        txns.push({
          id: m.id,
          date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          description: `Milestone: ${m.label}`,
          category: 'Milestone',
          vault: 'profit' as VaultType,
          type: 'inflow' as TransactionType,
          amount: m.amount || 0
        })
      })
    })

    // Add expenses
    expenses?.forEach(e => {
      txns.push({
        id: e.id,
        date: e.date ? new Date(e.date).toLocaleDateString() : new Date().toLocaleDateString(),
        description: e.description,
        category: e.category || 'Expense',
        vault: 'expenses' as VaultType,
        type: 'outflow' as TransactionType,
        amount: e.amount || 0
      })
    })

    return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [projects, expenses])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const vaultMatch = vaultFilter === 'all' || t.vault === vaultFilter
      const typeMatch = typeFilter === 'all' || t.type === typeFilter
      return vaultMatch && typeMatch
    })
  }, [transactions, vaultFilter, typeFilter])

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Vault</th>
              <th className="px-6 py-3">Inflow</th>
              <th className="px-6 py-3">Outflow</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const isInflow = txn.type === 'inflow'
                return (
                  <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{txn.date}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white">{txn.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{txn.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', VAULT_BADGES[txn.vault])}>
                        {txn.vault}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isInflow ? <span className="text-emerald-400 text-sm">{formatCurrency(txn.amount, 'USD')}</span> : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {!isInflow ? <span className="text-red-400 text-sm">{formatCurrency(txn.amount, 'USD')}</span> : <span className="text-slate-600">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn('font-medium', isInflow ? 'text-emerald-400' : 'text-red-400')}>
                        {isInflow ? '+' : '-'}{formatCurrency(txn.amount, 'USD')}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}