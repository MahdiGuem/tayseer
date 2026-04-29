'use client';

import { useMemo } from 'react';
import { projects } from '@/src/data/mocks';
import { TrustScore } from '@/src/components/ui/TrustScore';
import { formatCurrency } from '@/src/lib/utils/currency';
import type { Client } from '@/src/types';

interface ClientGridProps {
  sortBy: 'trust' | 'payment' | 'revenue';
}

interface ClientWithStats extends Client {
  projectTitle: string;
  totalRevenue: number;
}

export function ClientGrid({ sortBy }: ClientGridProps) {
  const clients = useMemo(() => {
    const allClients: ClientWithStats[] = projects.flatMap((p) =>
      p.clients.map((c) => ({
        ...c,
        projectTitle: p.title,
        totalRevenue: p.milestones
          .filter((m) => m.isPaid)
          .reduce((sum, m) => sum + m.amount, 0),
      }))
    );

    return [...allClients].sort((a, b) => {
      if (sortBy === 'trust') return (b.trustScore || 0) - (a.trustScore || 0);
      if (sortBy === 'payment') return (a.avgPaymentDays || 0) - (b.avgPaymentDays || 0);
      return (b.totalRevenue || 0) - (a.totalRevenue || 0);
    });
  }, [sortBy]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}

interface ClientCardProps {
  client: ClientWithStats;
}

function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-200">
            {client.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{client.name}</h3>
            <p className="text-xs text-slate-500">{client.email}</p>
          </div>
        </div>
        <TrustScore score={client.trustScore || 80} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-sm font-medium text-slate-200">
            {formatCurrency(client.totalRevenue || 0, 'USD')}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-xs text-slate-500">Avg Payment</p>
          <p className="text-sm font-medium text-slate-200">
            {client.avgPaymentDays || 7} days
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs text-slate-500">{client.projectTitle}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Agent Tracking</span>
          <div className="w-8 h-4 rounded-full bg-emerald-500 relative">
            <div className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
