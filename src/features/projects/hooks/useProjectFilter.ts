'use client';

import { useState, useMemo } from 'react';
import { useProjects } from '@/src/hooks/useProjects';
import type { ProjectStatus } from '@/src/types';

export function useProjectFilter() {
  const { projects } = useProjects()
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = useMemo(() => {
    if (!projects) return []
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  }, [projects, filter]);

  const projectStats = useMemo(() => {
    if (!projects) return { total: 0, active: 0, completed: 0, draft: 0 }
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === 'ACTIVE').length,
      completed: projects.filter((p) => p.status === 'COMPLETED').length,
      draft: projects.filter((p) => p.status === 'DRAFT').length,
    };
  }, [projects]);

  return {
    filter,
    setFilter,
    filteredProjects,
    projectStats,
  };
}