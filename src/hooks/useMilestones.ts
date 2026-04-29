'use client'

import { useState } from 'react'
import { createMilestone, updateMilestone, deleteMilestone, markMilestonePaid } from '@/app/actions/milestone'

export function useCreateMilestone() {
  const [loading, setLoading] = useState(false)
  
  const create = async (projectId: string, data: { label: string; amount: number; dueDate?: string }) => {
    setLoading(true)
    try {
      const milestone = await createMilestone(projectId, data)
      return milestone
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading }
}

export function useUpdateMilestone() {
  const [loading, setLoading] = useState(false)
  
  const update = async (id: string, data: { label?: string; amount?: number; dueDate?: string; isPaid?: boolean; order?: number }) => {
    setLoading(true)
    try {
      const milestone = await updateMilestone(id, data)
      return milestone
    } finally {
      setLoading(false)
    }
  }
  
  return { update, loading }
}

export function useDeleteMilestone() {
  const [loading, setLoading] = useState(false)
  
  const remove = async (id: string) => {
    setLoading(true)
    try {
      await deleteMilestone(id)
    } finally {
      setLoading(false)
    }
  }
  
  return { remove, loading }
}

export function useMarkMilestonePaid() {
  const [loading, setLoading] = useState(false)
  
  const markPaid = async (id: string, isPaid: boolean) => {
    setLoading(true)
    try {
      const milestone = await markMilestonePaid(id, isPaid)
      return milestone
    } finally {
      setLoading(false)
    }
  }
  
  return { markPaid, loading }
}