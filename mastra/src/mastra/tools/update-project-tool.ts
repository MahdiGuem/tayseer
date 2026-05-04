import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const updateProjectTool = createTool({
  id: "update-project",
  description: "Update an existing project's details. Use this to change project title, status, tax rate, or currency.",
  inputSchema: z.object({
    id: z.string().describe("Project ID to update"),
    title: z.string().optional().describe("New project title"),
    taxRate: z.number().optional().describe("New tax rate percentage"),
    currency: z.string().optional().describe("New currency code"),
    status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional().describe("New status"),
  }),
  outputSchema: z.object({
    project: z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      currency: z.string(),
    }),
    success: z.boolean(),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "updateProject",
        id: input.id,
        title: input.title,
        taxRate: input.taxRate,
        currency: input.currency,
        status: input.status,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update project: ${error}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return { project: data.project, success: true }
  },
})