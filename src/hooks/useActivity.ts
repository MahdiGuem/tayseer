'use client'

import { useState, useEffect } from 'react'
import { getAgentLogs } from '@/app/actions/agentLog'
import { getExpenses, createExpense } from '@/app/actions/expense'

export function useAgentLogs(projectId?: string, limit = 50) {
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof getAgentLogs>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const data = await getAgentLogs(projectId, limit)
      setLogs(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [projectId, limit])

  return { logs, loading, error, refetch: fetchLogs }
}

export function useExpenses(projectId?: string) {
  const [expenses, setExpenses] = useState<Awaited<ReturnType<typeof getExpenses>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const data = await getExpenses(projectId)
      setExpenses(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [projectId])

  return { expenses, loading, error, refetch: fetchExpenses }
}

export function useCreateExpense() {
  const [loading, setLoading] = useState(false)
  
  const create = async (data: {
    projectId?: string
    description: string
    amount: number
    category?: string
    date?: string
  }) => {
    setLoading(true)
    try {
      const expense = await createExpense(data)
      return expense
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading }
}