'use client'

import { useState } from 'react'

// Server Action Imports
import { getProjects, createProject, getProject, updateProject } from '../actions/project'
import { createClient } from '../actions/client'
import { createMilestone, getMilestones } from '../actions/milestone'
import { createInvoice, getInvoices } from '../actions/invoice'
import { createMessage, getMessages } from '../actions/message'
import { createContract } from '../actions/contract'
import { createExpense } from '../actions/expense'

type LogEntry = { time: string; action: string; result: string; error?: string }

export default function TestPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [projectId, setProjectId] = useState('')
  const [clientToken, setClientToken] = useState('')

  const addLog = (action: string, result: string, error?: string) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), action, result, error }, ...prev])
  }

  // Project Tests
  const testCreateProject = async () => {
    try {
      const project = await createProject({
        title: `Test Project ${Date.now()}`,
        taxRate: 20,
        currency: 'USD'
      })
      setProjectId(project.id)
      addLog('createProject', `Created: ${project.id}`)
    } catch (e: unknown) {
      addLog('createProject', '', String(e))
    }
  }

  const testGetProjects = async () => {
    try {
      const projects = await getProjects()
      addLog('getProjects', `Found ${projects.length} projects`)
    } catch (e: unknown) {
      addLog('getProjects', '', String(e))
    }
  }

  const testGetProject = async () => {
    if (!projectId) {
      addLog('getProject', '', 'No project ID')
      return
    }
    try {
      const project = await getProject(projectId)
      addLog('getProject', project ? `Found: ${project.title}` : 'Not found')
    } catch (e: unknown) {
      addLog('getProject', '', String(e))
    }
  }

  const testUpdateProject = async () => {
    if (!projectId) {
      addLog('updateProject', '', 'No project ID')
      return
    }
    try {
      const project = await updateProject(projectId, { title: 'Updated Title' })
      addLog('updateProject', `Updated: ${project.title}`)
    } catch (e: unknown) {
      addLog('updateProject', '', String(e))
    }
  }

  // Client Tests
  const testCreateClient = async () => {
    if (!projectId) {
      addLog('createClient', '', 'No project ID')
      return
    }
    try {
      const client = await createClient(projectId, {
        name: 'Test Client',
        email: 'test@example.com',
        platform: 'Telegram'
      })
      setClientToken(client.clientToken)
      addLog('createClient', `Created with token: ${client.clientToken.slice(0, 10)}...`)
    } catch (e: unknown) {
      addLog('createClient', '', String(e))
    }
  }

  // Milestone Tests
  const testCreateMilestone = async () => {
    if (!projectId) {
      addLog('createMilestone', '', 'No project ID')
      return
    }
    try {
      const milestone = await createMilestone(projectId, {
        label: 'Phase 1 - Setup',
        amount: 1000,
        dueDate: '2025-06-01'
      })
      addLog('createMilestone', `Created: ${milestone.id}`)
    } catch (e: unknown) {
      addLog('createMilestone', '', String(e))
    }
  }

  // Invoice Tests
  const testCreateInvoice = async () => {
    if (!projectId) {
      addLog('createInvoice', '', 'No project ID')
      return
    }
    try {
      const invoice = await createInvoice(projectId, {
        items: [
          { description: 'Development Services', amount: 5000 },
          { description: 'Consulting', amount: 1500 }
        ],
        dueDate: '2025-06-15',
        currency: 'USD'
      })
      addLog('createInvoice', `Created: ${invoice.invoiceNumber}`)
    } catch (e: unknown) {
      addLog('createInvoice', '', String(e))
    }
  }

  // Message Tests
  const testCreateMessage = async () => {
    if (!projectId) {
      addLog('createMessage', '', 'No project ID')
      return
    }
    try {
      const message = await createMessage(projectId, {
        senderRole: 'DEV',
        senderName: 'Developer',
        content: 'Hello from test!'
      })
      addLog('createMessage', `Created: ${message.id}`)
    } catch (e: unknown) {
      addLog('createMessage', '', String(e))
    }
  }

  // Contract Tests
  const testCreateContract = async () => {
    if (!projectId) {
      addLog('createContract', '', 'No project ID')
      return
    }
    try {
      const contract = await createContract(projectId, 'This is a test contract.')
      addLog('createContract', `Created version: ${contract.version}`)
    } catch (e: unknown) {
      addLog('createContract', '', String(e))
    }
  }

  // Expense Tests
  const testCreateExpense = async () => {
    try {
      const expense = await createExpense({
        description: 'AWS Hosting',
        amount: 250,
        category: 'Infrastructure'
      })
      addLog('createExpense', `Created: ${expense.id}`)
    } catch (e: unknown) {
      addLog('createExpense', '', String(e))
    }
  }

  // API Endpoint Tests
  const testClientAPI = async () => {
    if (!clientToken) {
      addLog('Client API', '', 'No client token')
      return
    }
    try {
      const res = await fetch(`/api/client/${clientToken}`)
      const data = await res.json()
      addLog('GET /api/client/[token]', `Status: ${res.status}, Project: ${data.project?.title || 'none'}`)
    } catch (e: unknown) {
      addLog('GET /api/client/[token]', '', String(e))
    }
  }

  const testClientMessageAPI = async () => {
    if (!clientToken) {
      addLog('Client Message API', '', 'No client token')
      return
    }
    try {
      const res = await fetch(`/api/client/${clientToken}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test message from client API' })
      })
      const data = await res.json()
      addLog('POST /api/client/[token]/message', `Status: ${res.status}, ID: ${data.id || 'none'}`)
    } catch (e: unknown) {
      addLog('POST /api/client/[token]/message', '', String(e))
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Server Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Server Actions</h2>
          <div className="space-y-2 flex flex-wrap gap-2">
            <button onClick={testCreateProject} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              createProject
            </button>
            <button onClick={testGetProjects} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              getProjects
            </button>
            <button onClick={testGetProject} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              getProject
            </button>
            <button onClick={testUpdateProject} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              updateProject
            </button>
            <button onClick={testCreateClient} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
              createClient
            </button>
            <button onClick={testCreateMilestone} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
              createMilestone
            </button>
            <button onClick={testCreateInvoice} className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700">
              createInvoice
            </button>
            <button onClick={testCreateMessage} className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700">
              createMessage
            </button>
            <button onClick={testCreateContract} className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700">
              createContract
            </button>
            <button onClick={testCreateExpense} className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700">
              createExpense
            </button>
          </div>
        </div>

        {/* API Endpoints */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">API Endpoints</h2>
          <div className="space-y-2 flex flex-wrap gap-2">
            <button onClick={testClientAPI} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">
              GET /api/client/[token]
            </button>
            <button onClick={testClientMessageAPI} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">
              POST /api/client/[token]/message
            </button>
          </div>
        </div>
      </div>

      {/* Current State */}
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="font-semibold mb-2">Current State:</h3>
        <p>Project ID: <span className="text-yellow-400">{projectId || 'none'}</span></p>
        <p>Client Token: <span className="text-yellow-400">{clientToken ? clientToken.slice(0, 20) + '...' : 'none'}</span></p>
      </div>

      {/* Logs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Logs</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className={`p-3 rounded ${log.error ? 'bg-red-900' : 'bg-gray-800'}`}>
              <span className="text-gray-400">[{log.time}]</span>{' '}
              <span className="font-semibold">{log.action}</span>:{' '}
              <span className={log.error ? 'text-red-400' : 'text-green-400'}>{log.result || log.error}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-gray-500">No logs yet</p>}
        </div>
      </div>
    </div>
  )
}