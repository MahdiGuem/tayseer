'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader2, Download } from 'lucide-react'
import { getProject } from '@/app/actions/project'
import { savePlan, finalizePlan } from '@/app/actions/project'
import { useToast } from '@/src/hooks/useToast'
import { DownloadPlanPDF } from '@/src/components/PlanPDF'

interface PlanMilestone {
  label: string
  amount: number
  dueDate: string
}

interface PlanModalProps {
  projectId: string
  onClose: () => void
}

export function PlanModal({ projectId, onClose }: PlanModalProps) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [project, setProject] = useState<any>(null)
  
  const [description, setDescription] = useState('')
  const [milestones, setMilestones] = useState<PlanMilestone[]>([
    { label: '', amount: 0, dueDate: '' }
  ])

  useEffect(() => {
    getProject(projectId).then(p => {
      if (p) {
        setProject(p)
        if (p.planDescription) setDescription(p.planDescription)
        const milestones = p.planMilestones as any[]
        if (milestones && milestones.length > 0) {
          setMilestones(milestones.map((m: any) => ({
            label: m.label || '',
            amount: m.amount || 0,
            dueDate: m.dueDate || ''
          })))
        }
      }
      setLoading(false)
    })
  }, [projectId])

  const addMilestone = () => {
    setMilestones([...milestones, { label: '', amount: 0, dueDate: '' }])
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: keyof PlanMilestone, value: string | number) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const handleSave = async () => {
    if (!description.trim() && milestones.every(m => !m.label)) {
      addToast('Add a description or at least one milestone', 'error')
      return
    }

    setSaving(true)
    try {
      await savePlan(projectId, {
        description: description.trim(),
        milestones: milestones.filter(m => m.label.trim())
      })
      addToast('Plan saved', 'success')
      onClose()
    } catch (e) {
      addToast('Failed to save plan', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleFinalize = async () => {
    if (!description.trim() || milestones.every(m => !m.label)) {
      addToast('Add description and milestones before finalizing', 'error')
      return
    }

    if (project?.isPlanFinalized) {
      addToast('Plan already finalized', 'error')
      return
    }

    setFinalizing(true)
    try {
      // First save
      await savePlan(projectId, {
        description: description.trim(),
        milestones: milestones.filter(m => m.label.trim())
      })
      // Then finalize
      await finalizePlan(projectId)
      addToast('Plan finalized - Milestones created!', 'success')
      onClose()
    } catch (e: any) {
      addToast(e.message || 'Failed to finalize plan', 'error')
    } finally {
      setFinalizing(false)
    }
  }

  const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  const isFinalized = project?.isPlanFinalized

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-black border border-white/10 rounded-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isFinalized ? 'View Plan' : 'Generate Plan'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {isFinalized && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-emerald-400 text-sm font-medium">Plan Finalized</p>
            <p className="text-slate-400 text-xs mt-1">
              Milestones have been created and cannot be changed.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isFinalized}
            placeholder="Describe the project scope and deliverables..."
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 resize-none h-24"
          />
        </div>

        {/* Milestones */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-400">Milestones</label>
            <span className="text-sm text-emerald-400 font-medium">
              Total: ${totalAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    value={milestone.label}
                    onChange={(e) => updateMilestone(index, 'label', e.target.value)}
                    disabled={isFinalized}
                    placeholder="Milestone name"
                    className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500/50"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={milestone.amount || ''}
                      onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
                      disabled={isFinalized}
                      placeholder="Amount"
                      className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500/50 w-28"
                    />
                    <input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                      disabled={isFinalized}
                      className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                {!isFinalized && milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(index)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isFinalized && (
            <button
              onClick={addMilestone}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
            >
              <Plus size={14} />
              Add milestone
            </button>
          )}
        </div>

        {/* Existing Milestones (from finalized plan) */}
        {project?.milestones && project.milestones.length > 0 && (
          <div className="mb-6 p-3 bg-white/5 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Created Milestones</p>
            <div className="space-y-2">
              {project.milestones.map((m: any) => (
                <div key={m.id} className="flex justify-between text-sm">
                  <span className="text-white">{m.label}</span>
                  <span className="text-slate-400">${m.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {!isFinalized && (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Save Plan'}
            </button>
            <button
              onClick={handleFinalize}
              disabled={finalizing}
              className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              {finalizing ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Finalize'}
            </button>
          </div>
        )}

        {isFinalized && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all"
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}