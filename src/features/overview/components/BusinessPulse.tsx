'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/src/lib/utils/cn'
import { useProjects } from '@/src/hooks/useProjects'
import { useExpenses } from '@/src/hooks/useActivity'
import { formatCurrency } from '@/src/lib/utils/currency'

export function BusinessPulse() {
  const { projects, loading } = useProjects()
  const { expenses } = useExpenses()

  const metrics = useMemo(() => {
    const totalRevenue = projects.reduce((sum, p) => {
      const paidMilestones = p.milestones.filter(m => m.isPaid).reduce((s, m) => s + m.amount, 0)
      return sum + paidMilestones
    }, 0)

    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length
    const pendingInvoices = projects.reduce((sum, p) => {
      return sum + p.invoices.filter(i => i.stage < 4).length
    }, 0)

    // Calculate burn rate (last 30 days expenses)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentExpenses = expenses
      .filter(e => new Date(e.date) > thirtyDaysAgo)
      .reduce((sum, e) => sum + e.amount, 0)

    return [
      {
        id: 'revenue',
        label: 'Revenue',
        value: formatCurrency(totalRevenue, 'USD'),
        change: '+12.5%',
        trend: 'up' as const,
        sublabel: 'All time'
      },
      {
        id: 'expenses',
        label: 'Burn Rate',
        value: formatCurrency(recentExpenses, 'USD'),
        change: '~30 days',
        trend: 'neutral' as const,
        sublabel: 'Last 30 days'
      },
      {
        id: 'projects',
        label: 'Projects',
        value: activeProjects.toString(),
        change: projects.length > 0 ? `${projects.length} total` : '0',
        trend: activeProjects > 0 ? 'up' as const : 'neutral' as const,
        sublabel: 'Active'
      },
      {
        id: 'invoices',
        label: 'Invoices',
        value: pendingInvoices.toString(),
        change: pendingInvoices > 0 ? 'Pending' : 'Clear',
        trend: pendingInvoices > 0 ? 'down' as const : 'up' as const,
        sublabel: 'Awaiting'
      }
    ]
  }, [projects, expenses])

  if (loading) {
    return (
      <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 animate-pulse">
              <div className="h-2 w-16 bg-slate-800 rounded mb-2" />
              <div className="h-5 w-12 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <span
                className={cn(
                  'text-[10px] flex items-center gap-0.5',
                  metric.trend === 'up' && 'text-emerald-400',
                  metric.trend === 'down' && 'text-rose-400',
                  metric.trend === 'neutral' && 'text-slate-400'
                )}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp size={10} />
                ) : metric.trend === 'down' ? (
                  <TrendingDown size={10} />
                ) : (
                  '→'
                )}
                {metric.change}
              </span>
            </div>
            <p className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}