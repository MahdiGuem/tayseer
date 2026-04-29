'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  DollarSign,
  Loader2,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  MessageCircle,
  X,
} from 'lucide-react';
import { projects } from '@/src/data/mocks';
import { Badge } from '@/src/components/ui/Badge';
import { formatCurrency } from '@/src/lib/utils/currency';
import { cn } from '@/src/lib/utils/cn';
import type { Project, ProjectStatus } from '@/src/types';

interface ProjectTableProps {
  filter: ProjectStatus | 'all';
  onToast?: (message: string) => void;
}

export function ProjectTable({ filter, onToast }: ProjectTableProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null);

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  const handleForceRelease = (projectId: string) => {
    setReleasing(projectId);
    setTimeout(() => {
      setReleasing(null);
      onToast?.('Funds released successfully!');
    }, 2000);
  };

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isExpanded={expandedProject === project.id}
                showEvidence={showEvidence}
                isReleasing={releasing === project.id}
                onToggle={() =>
                  setExpandedProject(
                    expandedProject === project.id ? null : project.id
                  )
                }
                onForceRelease={handleForceRelease}
                onShowEvidence={setShowEvidence}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ProjectRowProps {
  project: Project;
  isExpanded: boolean;
  showEvidence: string | null;
  isReleasing: boolean;
  onToggle: () => void;
  onForceRelease: (id: string) => void;
  onShowEvidence: (id: string | null) => void;
}

function ProjectRow({
  project,
  isExpanded,
  showEvidence,
  isReleasing,
  onToggle,
  onForceRelease,
  onShowEvidence,
}: ProjectRowProps) {
  const paidMilestones = project.milestones.filter((m) => m.isPaid).length;
  const totalMilestones = project.milestones.length;
  const progress = totalMilestones > 0 ? Math.round((paidMilestones / totalMilestones) * 100) : 0;
  const totalValue = project.milestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors">
        <td className="px-6 py-4">
          <div>
            <p className="font-medium text-slate-200">{project.title}</p>
            <p className="text-xs text-slate-500">
              {project.contracts[0]?.content.substring(0, 50)}...
            </p>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium">
              {project.clients[0]?.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-sm text-slate-200">{project.clients[0]?.name || 'Unknown'}</p>
              <p className="text-xs text-slate-500">{project.clients[0]?.email || ''}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge status={project.status.toLowerCase()} />
        </td>
        <td className="px-6 py-4 font-medium">{formatCurrency(totalValue, project.currency)}</td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {project.status === 'ACTIVE' && (
              <button
                onClick={() => onForceRelease(project.id)}
                disabled={isReleasing}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs font-medium flex items-center gap-1"
              >
                {isReleasing ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Releasing...
                  </>
                ) : (
                  <>
                    <DollarSign size={12} /> Force Release
                  </>
                )}
              </button>
            )}
            <button
              onClick={onToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronRight
                size={16}
                className={cn('transform transition-transform', isExpanded && 'rotate-90')}
              />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <td colSpan={6} className="px-6 py-4 bg-white/[0.01]">
              <MilestoneList
                milestones={project.milestones}
                showEvidence={showEvidence}
                onShowEvidence={onShowEvidence}
              />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

interface MilestoneListProps {
  milestones: Project['milestones'];
  showEvidence: string | null;
  onShowEvidence: (id: string | null) => void;
}

function MilestoneList({ milestones, showEvidence, onShowEvidence }: MilestoneListProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-300 mb-3">Milestones / معالم المشروع</h4>
      {milestones.map((milestone) => (
        <MilestoneItem
          key={milestone.id}
          milestone={milestone}
          showEvidence={showEvidence === milestone.id}
          onToggleEvidence={() =>
            onShowEvidence(showEvidence === milestone.id ? null : milestone.id)
          }
        />
      ))}
    </div>
  );
}

interface MilestoneItemProps {
  milestone: Project['milestones'][0];
  showEvidence: boolean;
  onToggleEvidence: () => void;
}

function MilestoneItem({ milestone, showEvidence, onToggleEvidence }: MilestoneItemProps) {
  const status = milestone.status || (milestone.isPaid ? 'completed' : 'pending');

  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center',
              status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400'
                : status === 'in_review'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-white/5 text-slate-400'
            )}
          >
            {status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
          </div>
          <div>
            <p className="text-sm text-slate-200">{milestone.label}</p>
            <p className="text-xs text-slate-500">Due: {milestone.targetDate || milestone.dueDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${milestone.progress || 0}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{milestone.progress || 0}%</span>
          </div>
          {milestone.evidence && (
            <button
              onClick={onToggleEvidence}
              className="px-2 py-1 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
            >
              View Proof
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showEvidence && milestone.evidence && (
          <EvidencePanel evidence={milestone.evidence} type={milestone.evidenceType} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface EvidencePanelProps {
  evidence: string;
  type?: 'chat' | 'commit' | 'file';
}

function EvidencePanel({ evidence, type }: EvidencePanelProps) {
  const Icon = type === 'chat' ? MessageCircle : type === 'commit' ? RefreshCw : FileText;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10"
    >
      <div className="flex items-start gap-2">
        <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Icon size={14} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-400">AI-Verified Evidence</p>
          <p className="text-sm text-slate-200">{evidence}</p>
        </div>
      </div>
    </motion.div>
  );
}
