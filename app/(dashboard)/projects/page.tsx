'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProjectTable } from '@/src/features/projects/components/ProjectTable'
import { useProjectFilter } from '@/src/features/projects/hooks/useProjectFilter'
import { useToast } from '@/src/hooks/useToast'
import { useCreateProject, useProjects } from '@/src/hooks/useProjects'
import type { ProjectStatus } from '@/src/types'

export default function ProjectsPage() {
  const { filter, setFilter } = useProjectFilter()
  const { addToast } = useToast()
  const { refetch } = useProjects()
  const { create, loading: creating } = useCreateProject()
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const filterOptions: { value: ProjectStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ARCHIVED', label: 'Archived' },
  ]

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    
    try {
      await create({ title: newProjectName, taxRate: 20, currency: 'USD' })
      setNewProjectName('')
      setShowNewProject(false)
      refetch()
      addToast('Project created successfully', 'success')
    } catch (e) {
      addToast('Failed to create project', 'error')
    }
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
          <div className="w-full max-w-md bg-black border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateProject}
                disabled={creating || !newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creating...' : 'Create Project'}
              </button>
              <button
                onClick={() => { setShowNewProject(false); setNewProjectName('') }}
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