'use client';

import { cashflowTransactions } from '@/src/data/mocks';
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
  const vaults: VaultType[] = ['tax', 'expenses', 'profit'];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(filter === 'all' ? vaults : [filter]).map((vault) => {
        const vaultTxns = cashflowTransactions.filter((t) => t.vault === vault);
        const inflow = vaultTxns
          .filter((t) => t.type === 'inflow')
          .reduce((sum, t) => sum + t.amount, 0);
        const outflow = vaultTxns
          .filter((t) => t.type === 'outflow')
          .reduce((sum, t) => sum + t.amount, 0);
        const balance = inflow - outflow;

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
              <span>In: {formatCurrency(inflow, 'USD')}</span>
              <span>Out: {formatCurrency(outflow, 'USD')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
