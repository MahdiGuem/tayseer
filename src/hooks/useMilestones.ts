'use client'

import { useState } from 'react'
import { createMilestone, updateMilestone, deleteMilestone, markMilestonePaid } from '@/app/actions/milestone'
import { useToast } from '@/src/hooks/useToast'

export function useCreateMilestone() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const create = async (projectId: string, data: { label: string; amount: number; dueDate?: string }) => {
    setLoading(true)
    try {
      const milestone = await createMilestone(projectId, data)
      addToast(`Milestone "${data.label}" created`, "success")
      return milestone
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
   
  return { create, loading }
}

export function useUpdateMilestone() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const update = async (id: string, data: { label?: string; amount?: number; dueDate?: string; isPaid?: boolean; order?: number }) => {
    setLoading(true)
    try {
      const milestone = await updateMilestone(id, data)
      addToast("Milestone updated successfully", "success")
      return milestone
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
   
  return { update, loading }
}

export function useDeleteMilestone() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const remove = async (id: string) => {
    setLoading(true)
    try {
      await deleteMilestone(id)
      addToast("Milestone deleted successfully", "success")
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
   
  return { remove, loading }
}

export function useMarkMilestonePaid() {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  
  const markPaid = async (id: string, isPaid: boolean) => {
    setLoading(true)
    try {
      const milestone = await markMilestonePaid(id, isPaid)
      addToast(isPaid ? "Milestone marked as paid" : "Milestone marked as unpaid", "success")
      return milestone
    } catch (e) {
      addToast(String(e), "error")
      throw e
    } finally {
      setLoading(false)
    }
  }
   
  return { markPaid, loading }
}