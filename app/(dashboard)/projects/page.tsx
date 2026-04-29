'use client';

import { Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectTable } from '@/src/features/projects/components/ProjectTable';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { useProjectFilter } from '@/src/features/projects/hooks/useProjectFilter';
import { useToast } from '@/src/hooks/useToast';
import type { ProjectStatus } from '@/src/types';

export default function ProjectsPage() {
  const { filter, setFilter, filteredProjects } = useProjectFilter();
  const { addToast } = useToast();

  const filterOptions: { value: ProjectStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Breadcrumb items={[{ label: 'Home' }, { label: 'Projects' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
            onClick={() => addToast('New project created', 'success')}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <ProjectTable filter={filter} onToast={(msg) => addToast(msg, 'success')} />
    </motion.div>
  );
}
