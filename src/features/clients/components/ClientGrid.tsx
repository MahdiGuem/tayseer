'use client'

import { useMemo } from 'react'
import { TrustScore } from '@/src/components/ui/TrustScore'
import { formatCurrency } from '@/src/lib/utils/currency'
import { useProjects } from '@/src/hooks/useProjects'

interface ClientGridProps {
  sortBy: 'trust' | 'payment' | 'revenue'
}

interface ClientWithStats {
  id: string
  name: string
  email: string | null
  platform: string | null
  createdAt: string
  clientToken: string
  projectTitle: string
  projectCurrency: string
  totalRevenue: number
  trustScore: number
  avgPaymentDays: number
}

export function ClientGrid({ sortBy }: ClientGridProps) {
  const { projects, loading, refetch } = useProjects()

  const clients = useMemo(() => {
    const allClients: ClientWithStats[] = projects.flatMap((p) =>
      p.projectClients?.map((pc) => {
        const totalRevenue = p.milestones
          .filter((m) => m.isPaid)
          .reduce((sum, m) => sum + m.amount, 0)
        
        return {
          ...pc.client,
          clientToken: pc.clientToken,
          projectTitle: p.title,
          projectCurrency: p.currency,
          totalRevenue,
          // Default values for fields not in DB
          trustScore: 80,
          avgPaymentDays: 7
        }
      })
    )

    return [...allClients].sort((a, b) => {
      if (sortBy === 'trust') return b.trustScore - a.trustScore
      if (sortBy === 'payment') return a.avgPaymentDays - b.avgPaymentDays
      return b.totalRevenue - a.totalRevenue
    })
  }, [projects, sortBy])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-lg border border-white/5 bg-white/[0.02] animate-pulse">
            <div className="h-12 w-12 rounded-full bg-slate-800 mb-4" />
            <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
            <div className="h-3 w-24 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No clients found. Create a project and add clients to see them here.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}

interface ClientCardProps {
  client: ClientWithStats
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
            <p className="text-xs text-slate-500">{client.email || client.platform || 'No contact'}</p>
          </div>
        </div>
        <TrustScore score={client.trustScore} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-sm font-medium text-slate-200">
            {formatCurrency(client.totalRevenue, client.projectCurrency)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-xs text-slate-500">Avg Payment</p>
          <p className="text-sm font-medium text-slate-200">
            {client.avgPaymentDays} days
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs text-slate-500">{client.projectTitle}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Link</span>
          <button
            className="text-xs text-emerald-400 hover:text-emerald-300"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/client/${client.clientToken}`)
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}