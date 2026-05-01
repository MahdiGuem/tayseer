'use client'

import { useMemo, useState } from 'react'
import { TrustScore } from '@/src/components/ui/TrustScore'
import { formatCurrency } from '@/src/lib/utils/currency'
import { useProjects } from '@/src/hooks/useProjects'
import { Link2, Copy, Check } from 'lucide-react'

interface ClientGridProps {
  sortBy: 'trust' | 'payment' | 'revenue'
}

interface ClientWithStats {
  id: string
  name: string
  email: string | null
  platform: string | null
  createdAt: string
  projects: {
    title: string
    currency: string
    clientToken: string
    totalRevenue: number
  }[]
  trustScore: number
  avgPaymentDays: number
}

export function ClientGrid({ sortBy }: ClientGridProps) {
  const { projects, loading, refetch } = useProjects()

  const clients = useMemo(() => {
    const clientMap = new Map<string, ClientWithStats>()
    
    projects.forEach((p) => {
      p.projectClients?.forEach((pc) => {
        const totalRevenue = p.milestones
          .filter((m) => m.isPaid)
          .reduce((sum, m) => sum + m.amount, 0)
        
        if (!clientMap.has(pc.client.id)) {
          clientMap.set(pc.client.id, {
            ...pc.client,
            projects: [],
            trustScore: 80,
            avgPaymentDays: 7
          })
        }
        
        clientMap.get(pc.client.id)!.projects.push({
          title: p.title,
          currency: p.currency,
          clientToken: pc.clientToken,
          totalRevenue
        })
      })
    })

    return Array.from(clientMap.values()).sort((a, b) => {
      const totalRevenueA = a.projects.reduce((sum, p) => sum + p.totalRevenue, 0)
      const totalRevenueB = b.projects.reduce((sum, p) => sum + p.totalRevenue, 0)
      if (sortBy === 'trust') return b.trustScore - a.trustScore
      if (sortBy === 'payment') return a.avgPaymentDays - b.avgPaymentDays
      return totalRevenueB - totalRevenueA
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
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const totalRevenue = client.projects.reduce((sum, p) => sum + p.totalRevenue, 0)
  const currency = client.projects[0]?.currency || 'USD'

  const copyLink = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/client/${token}`)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

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
            {formatCurrency(totalRevenue, currency)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <p className="text-xs text-slate-500">Avg Payment</p>
          <p className="text-sm font-medium text-slate-200">
            {client.avgPaymentDays} days
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="border-t border-white/5 pt-3">
        <p className="text-xs text-slate-500 mb-2">Projects ({client.projects.length})</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {client.projects.map((project) => (
            <div key={project.clientToken} className="flex items-center justify-between text-xs">
              <span className="text-slate-300 truncate flex-1 mr-2">{project.title}</span>
              <button
                onClick={() => copyLink(project.clientToken)}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
              >
                {copiedToken === project.clientToken ? (
                  <>
                    <Check size={12} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}