'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { pulseMetrics } from '@/src/data/mocks';
import { cn } from '@/src/lib/utils/cn';

export function BusinessPulse() {
  return (
    <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
      <h2 className="text-lg font-semibold text-white mb-4">Business Pulse</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pulseMetrics.map((metric) => (
          <div
            key={metric.id}
            className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <span
                className={cn(
                  'text-xs flex items-center gap-1',
                  metric.trend === 'up' && 'text-emerald-400',
                  metric.trend === 'down' && 'text-rose-400',
                  metric.trend === 'neutral' && 'text-slate-400'
                )}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp size={12} />
                ) : metric.trend === 'down' ? (
                  <TrendingDown size={12} />
                ) : (
                  '→'
                )}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {metric.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{metric.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
