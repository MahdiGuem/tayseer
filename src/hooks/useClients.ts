'use client'

import { useState, useEffect } from 'react'
import { createClient, getClientByToken } from '@/app/actions/client'
import { useProjects, ProjectWithRelations } from './useProjects'

export type ClientWithProject = Awaited<ReturnType<typeof getClientByToken>>

export function useClients() {
  const { projects, loading, refetch } = useProjects()
  
  const clients = projects.flatMap(p => p.clients.map(c => ({
    ...c,
    projectTitle: p.title,
    projectCurrency: p.currency
  })))
  
  return { clients, loading, refetch }
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false)
  
  const create = async (projectId: string, data: { name: string; email?: string; platform?: string }) => {
    setLoading(true)
    try {
      const client = await createClient(projectId, data)
      return client
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading }
}

export function useGetClientByToken(token: string) {
  const [client, setClient] = useState<ClientWithProject>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    
    getClientByToken(token)
      .then(setClient)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token])

  return { client, loading, error }
}

export function getClientsFromProjects(projects: ProjectWithRelations[]) {
  return projects.flatMap(p => p.clients.map(c => ({
    ...c,
    projectTitle: p.title,
    projectCurrency: p.currency
  })))
}