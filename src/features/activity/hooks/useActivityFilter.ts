'use client';

import { useState } from 'react';
import type { LogAction } from '@/src/types';

export function useActivityFilter() {
  const [filter, setFilter] = useState<LogAction | 'all'>('all');

  const filterOptions: { value: LogAction | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'escrow', label: 'Escrow' },
    { value: 'payment', label: 'Payment' },
    { value: 'alert', label: 'Alert' },
    { value: 'message', label: 'Message' },
  ];

  return {
    filter,
    setFilter,
    filterOptions,
  };
}
