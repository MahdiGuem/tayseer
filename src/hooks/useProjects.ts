'use client'

import { useState, useEffect } from 'react'
import { getProjects, createProject, updateProject, deleteProject } from '@/app/actions/project'
import { useToast } from '@/src/hooks/useToast'

export type ProjectWithRelations = Awaited<ReturnType<typeof getProjects>>[number]

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, loading, error, refetch: fetchProjects }
}

export function useCreateProject() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const create = async (data: { title: string; clientIds: string[]; taxRate?: number; currency?: string }) => {
    setLoading(true)
    try {
      const project = await createProject(data)
      addToast(`Project "${data.title}" created`, "success")
      return project
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading }
}

export function useUpdateProject() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const update = async (id: string, data: { 
    title?: string
    taxRate?: number
    currency?: string
    status?: string
    planDescription?: string | null
    planMilestones?: unknown
    isPlanFinalized?: boolean
  }) => {
    setLoading(true)
    try {
      const project = await updateProject(id, data as any)
      addToast("Project updated successfully", "success")
      return project
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
  
  return { update, loading }
}

export function useDeleteProject() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const remove = async (id: string) => {
    setLoading(true)
    try {
      await deleteProject(id)
      addToast("Project deleted successfully", "success")
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
  
  return { remove, loading }
}