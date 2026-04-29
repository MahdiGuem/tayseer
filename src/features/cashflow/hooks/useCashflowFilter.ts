'use client';

import { useState } from 'react';
import type { VaultType, TransactionType } from '@/src/types';

export function useCashflowFilter() {
  const [vaultFilter, setVaultFilter] = useState<'all' | VaultType>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');

  const vaultOptions: { value: 'all' | VaultType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'tax', label: 'Tax' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'profit', label: 'Profit' },
  ];

  const typeOptions: { value: 'all' | TransactionType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'inflow', label: 'Inflow' },
    { value: 'outflow', label: 'Outflow' },
  ];

  return {
    vaultFilter,
    setVaultFilter,
    typeFilter,
    setTypeFilter,
    vaultOptions,
    typeOptions,
  };
}
