'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils/cn';

interface TrustScoreProps {
  score: number;
  className?: string;
}

export function TrustScore({ score, className }: TrustScoreProps) {
  const color = score >= 95
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 85
    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    : score >= 75
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        color,
        className
      )}
    >
      <Shield size={12} />
      <span>{score}</span>
    </div>
  );
}
