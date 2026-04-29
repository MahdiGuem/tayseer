'use client'

import { useState } from 'react'
import { createInvoice, updateInvoiceStage, deleteInvoice } from '@/app/actions/invoice'

export function useCreateInvoice() {
  const [loading, setLoading] = useState(false)
  
  const create = async (projectId: string, data: {
    items: { description: string; amount: number }[]
    dueDate?: string
    currency?: string
  }) => {
    setLoading(true)
    try {
      const invoice = await createInvoice(projectId, data)
      return invoice
    } finally {
      setLoading(false)
    }
  }
  
  return { create, loading }
}

export function useUpdateInvoiceStage() {
  const [loading, setLoading] = useState(false)
  
  const updateStage = async (id: string, stage: number) => {
    setLoading(true)
    try {
      const invoice = await updateInvoiceStage(id, stage)
      return invoice
    } finally {
      setLoading(false)
    }
  }
  
  return { updateStage, loading }
}

export function useDeleteInvoice() {
  const [loading, setLoading] = useState(false)
  
  const remove = async (id: string) => {
    setLoading(true)
    try {
      await deleteInvoice(id)
    } finally {
      setLoading(false)
    }
  }
  
  return { remove, loading }
}

export function getInvoiceStatus(stage: number): 'draft' | 'sent' | 'paid' | 'overdue' {
  switch (stage) {
    case 1: return 'draft'
    case 2: return 'sent'
    case 3: return 'sent'
    case 4: return 'paid'
    default: return 'draft'
  }
}

export function getInvoiceStatusFromStage(stage: number, dueDate?: string | null): 'draft' | 'sent' | 'paid' | 'overdue' {
  if (stage === 4) return 'paid'
  if (dueDate && new Date(dueDate) < new Date()) return 'overdue'
  return stage >= 2 ? 'sent' : 'draft'
}