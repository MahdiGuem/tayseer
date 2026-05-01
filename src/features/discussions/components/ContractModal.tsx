'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Loader2, Send } from 'lucide-react'
import { getProjectWithContract, saveContract, sendContract } from '@/app/actions/contract'
import { useToast } from '@/src/hooks/useToast'

interface ContractMilestone {
  label: string
  amount: number
  dueDate: string
}

interface ContractData {
  description: string
  milestones: ContractMilestone[]
  clientNames: string[]
  devName: string
  createdAt: string
  status: 'draft' | 'sent' | 'confirmed'
}

interface ContractModalProps {
  projectId: string
  onClose: () => void
}

export function ContractModal({ projectId, onClose }: ContractModalProps) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [project, setProject] = useState<any>(null)
  
  const [description, setDescription] = useState('')
  const [milestones, setMilestones] = useState<ContractMilestone[]>([
    { label: '', amount: 0, dueDate: '' }
  ])

  useEffect(() => {
    getProjectWithContract(projectId).then(p => {
      if (p) {
        setProject(p)
        const contract = p.contract as ContractData | null
        
        if (contract) {
          setDescription(contract.description || '')
          if (contract.milestones && contract.milestones.length > 0) {
            setMilestones(contract.milestones.map((m: any) => ({
              label: m.label || '',
              amount: m.amount || 0,
              dueDate: m.dueDate || ''
            })))
          }
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

  const updateMilestone = (index: number, field: keyof ContractMilestone, value: string | number) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const handleSave = async () => {
    if (!description.trim() && milestones.every(m => !m.label)) {
      addToast('Add a description or at least one milestone', 'error')
      return
    }

    const clientNames = project?.projectClients?.map((pc: any) => pc.client?.name).filter(Boolean) || []
    
    const contractData = {
      description: description.trim(),
      milestones: milestones.filter(m => m.label.trim()),
      clientNames,
      devName: 'Mahdi'
    }

    setSaving(true)
    try {
      await saveContract(projectId, contractData)
      addToast('Contract saved', 'success')
    } catch (e) {
      addToast('Failed to save contract', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAndSend = async () => {
    if (!description.trim() && milestones.every(m => !m.label)) {
      addToast('Add a description or at least one milestone', 'error')
      return
    }

    const clientNames = project?.projectClients?.map((pc: any) => pc.client?.name).filter(Boolean) || []
    
    const contractData = {
      description: description.trim(),
      milestones: milestones.filter(m => m.label.trim()),
      clientNames,
      devName: 'Mahdi'
    }

    setSending(true)
    try {
      await saveContract(projectId, contractData)
      await sendContract(projectId)
      addToast('Contract sent to client', 'success')
      onClose()
    } catch (e: any) {
      addToast(e.message || 'Failed to send contract', 'error')
    } finally {
      setSending(false)
    }
  }

  const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  const contract = project?.contract as ContractData | null
  const isSent = contract?.status === 'sent' || contract?.status === 'confirmed'
  const isConfirmed = contract?.status === 'confirmed'

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
            {isSent ? 'View Contract' : 'Edit Contract'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {isSent && (
          <div className={`mb-4 p-3 rounded-lg border ${
            isConfirmed 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <p className={isConfirmed ? 'text-emerald-400' : 'text-yellow-400'} style={{fontSize: '14px', fontWeight: '500'}}>
              {isConfirmed ? 'Confirmed' : 'Waiting for confirmation'}
            </p>
          </div>
        )}

        {/* Client Names (read-only) */}
        {project?.projectClients && (
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">Clients</label>
            <div className="bg-white/5 rounded-lg px-4 py-2 text-white text-sm">
              {project.projectClients.map((pc: any) => pc.client?.name).join(', ')}
            </div>
          </div>
        )}

        {/* Dev Name */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Developer</label>
          <div className="bg-white/5 rounded-lg px-4 py-2 text-white text-sm">Mahdi</div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSent}
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
                    disabled={isSent}
                    placeholder="Milestone name"
                    className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500/50"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={milestone.amount || ''}
                      onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
                      disabled={isSent}
                      placeholder="Amount"
                      className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500/50 w-28"
                    />
                    <input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                      disabled={isSent}
                      className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
                {!isSent && milestones.length > 1 && (
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

          {!isSent && (
            <button
              onClick={addMilestone}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
            >
              <Plus size={14} />
              Add milestone
            </button>
          )}
        </div>

        {/* Actions */}
        {!isSent ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : null}
              Save
            </button>
            <button
              onClick={handleSaveAndSend}
              disabled={sending}
              className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Save & Send
            </button>
          </div>
        ) : (
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