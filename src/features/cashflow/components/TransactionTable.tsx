'use client';

import { useMemo } from 'react';
import { cashflowTransactions } from '@/src/data/mocks';
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
  const filteredTransactions = useMemo(() => {
    return cashflowTransactions.filter((t) => {
      const vaultMatch = vaultFilter === 'all' || t.vault === vaultFilter;
      const typeMatch = typeFilter === 'all' || t.type === typeFilter;
      return vaultMatch && typeMatch;
    });
  }, [vaultFilter, typeFilter]);

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
            {filteredTransactions.map((txn) => {
              const isInflow = txn.type === 'inflow';
              return (
                <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{txn.date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-200">{txn.description}</p>
                    {txn.reference && <p className="text-xs text-slate-500">{txn.reference}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm">{txn.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border',
                        VAULT_BADGES[txn.vault]
                      )}
                    >
                      {txn.vault.charAt(0).toUpperCase() + txn.vault.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-400">
                    {isInflow ? formatCurrency(txn.amount, txn.currency) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-rose-400">
                    {!isInflow ? formatCurrency(txn.amount, txn.currency) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <span className={isInflow ? 'text-emerald-400' : 'text-rose-400'}>
                      {isInflow ? '+' : '-'}
                      {formatCurrency(txn.amount, txn.currency)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
