'use client'

import { useState, useEffect } from 'react'
import { getClients, createClient, getClientByToken, assignClientToProject, getClientByName } from '@/app/actions/client'

export type ClientWithRelations = Awaited<ReturnType<typeof getClients>>[number]
export type ClientWithProject = Awaited<ReturnType<typeof getClientByToken>>

export function useClients() {
  const [clients, setClients] = useState<ClientWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await getClients()
      setClients(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return { clients, loading, error, refetch: fetchClients }
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false)
  
  const create = async (data: { name: string; email?: string; platform?: string }) => {
    setLoading(true)
    try {
      const client = await createClient(data)
      return client
    } finally {
      setLoading(false)
    }
  }

  const findByName = async (name: string) => {
    setLoading(true)
    try {
      const client = await getClientByName(name)
      return client
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading, findByName }
}

export function useAssignClient() {
  const [loading, setLoading] = useState(false)
  
  const assign = async (projectId: string, clientId: string) => {
    setLoading(true)
    try {
      const projectClient = await assignClientToProject(projectId, clientId)
      return projectClient
    } finally {
      setLoading(false)
    }
  }
  
  return { assign, loading }
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