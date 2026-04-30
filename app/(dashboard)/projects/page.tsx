'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProjectTable } from '@/src/features/projects/components/ProjectTable'
import { useProjectFilter } from '@/src/features/projects/hooks/useProjectFilter'
import { useToast } from '@/src/hooks/useToast'
import { useCreateProject, useProjects } from '@/src/hooks/useProjects'
import { useClients, useCreateClient } from '@/src/hooks/useClients'
import type { ProjectStatus } from '@/src/types'

export default function ProjectsPage() {
  const { filter, setFilter } = useProjectFilter()
  const { addToast } = useToast()
  const { refetch } = useProjects()
  const { clients, refetch: refetchClients } = useClients()
  const { create, loading: creating } = useCreateProject()
  const { create: createClient, loading: creatingClient } = useCreateClient()
  
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([])
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClientName, setNewClientName] = useState('')

  const filterOptions: { value: ProjectStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ARCHIVED', label: 'Archived' },
  ]

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || selectedClientIds.length === 0) return
    
    try {
      await create({ 
        title: newProjectName, 
        clientIds: selectedClientIds,
        taxRate: 20, 
        currency: 'USD' 
      })
      setNewProjectName('')
      setSelectedClientIds([])
      setShowNewProject(false)
      refetch()
      addToast('Project created successfully', 'success')
    } catch (e) {
      addToast('Failed to create project', 'error')
    }
  }

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return
    
    try {
      const client = await createClient({ name: newClientName })
      setSelectedClientIds([...selectedClientIds, client.id])
      refetchClients()
      setNewClientName('')
      setShowNewClient(false)
      addToast('Client created', 'success')
    } catch (e) {
      addToast('Failed to create client', 'error')
    }
  }

  const toggleClient = (clientId: string) => {
    setSelectedClientIds(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Manage milestones and approve deliverables</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ProjectStatus | 'all')}
            className="bg-black border border-white/10 rounded-lg text-sm text-slate-300 px-3 py-2 outline-none focus:border-emerald-500/50"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowNewProject(true)}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Table - Fill Page */}
      <div className="h-[calc(100vh-240px)] min-h-[500px]">
        <ProjectTable filter={filter} onToast={(msg) => addToast(msg, 'success')} />
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-white/10 rounded-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Project</h2>
            
            {/* Project Name */}
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Project Name</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
                autoFocus
              />
            </div>

            {/* Client Selection */}
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">
                Clients <span className="text-red-400">*</span>
              </label>
              
              {clients.length > 0 && (
                <div className="space-y-2 mb-3">
                  {clients.map(client => (
                    <label
                      key={client.id}
                      className="flex items-center gap-3 p-2 rounded border border-white/5 hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClientIds.includes(client.id)}
                        onChange={() => toggleClient(client.id)}
                        className="rounded border-white/20 bg-black text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-white text-sm">{client.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {!showNewClient ? (
                <button
                  type="button"
                  onClick={() => setShowNewClient(true)}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  + Create new client
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Client name"
                    className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateClient()}
                  />
                  <button
                    onClick={handleCreateClient}
                    disabled={creatingClient || !newClientName.trim()}
                    className="px-3 py-2 bg-emerald-500 text-black text-sm font-medium rounded-md hover:bg-emerald-400 disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowNewClient(false); setNewClientName('') }}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {selectedClientIds.length === 0 && (
              <p className="text-xs text-red-400 mb-4">Select at least one client</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateProject}
                disabled={creating || !newProjectName.trim() || selectedClientIds.length === 0}
                className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creating...' : 'Create Project'}
              </button>
              <button
                onClick={() => { 
                  setShowNewProject(false); 
                  setNewProjectName(''); 
                  setSelectedClientIds([]);
                  setShowNewClient(false);
                  setNewClientName('');
                }}
                className="px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}