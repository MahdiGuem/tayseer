'use client';

import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '@/src/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (view: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && <ChevronRight size={12} className="text-slate-600" />}
          <span
            className={item.view ? 'text-emerald-400 hover:text-emerald-300 cursor-pointer' : ''}
            onClick={() => item.view && onNavigate?.(item.view)}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
