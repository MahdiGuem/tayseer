'use client';

import { useState } from 'react';

export type InvoiceFilter = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

export function useInvoiceFilter() {
  const [filter, setFilter] = useState<InvoiceFilter>('all');

  const filterOptions: { value: InvoiceFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return {
    filter,
    setFilter,
    filterOptions,
  };
}
