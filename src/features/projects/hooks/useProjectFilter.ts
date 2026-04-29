'use client';

import { useState, useMemo } from 'react';
import { projects } from '@/src/data/mocks';
import type { ProjectStatus } from '@/src/types';

export function useProjectFilter() {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter]);

  const projectStats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === 'ACTIVE').length,
      completed: projects.filter((p) => p.status === 'COMPLETED').length,
      draft: projects.filter((p) => p.status === 'DRAFT').length,
    };
  }, []);

  return {
    filter,
    setFilter,
    filteredProjects,
    projectStats,
  };
}
