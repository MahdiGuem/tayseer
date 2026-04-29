'use client';

import { useState } from 'react';

type SortOption = 'trust' | 'payment' | 'revenue';

export function useClientSort() {
  const [sortBy, setSortBy] = useState<SortOption>('trust');

  return {
    sortBy,
    setSortBy,
    sortOptions: [
      { value: 'trust' as const, label: 'Trust Score' },
      { value: 'payment' as const, label: 'Payment Speed' },
      { value: 'revenue' as const, label: 'Revenue' },
    ],
  };
}
