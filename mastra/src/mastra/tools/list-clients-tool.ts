import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const listClientsTool = createTool({
  id: "list-clients",
  description: "List all clients across all projects. Use this to see every client you work with and their associated projects.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    clients: z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().nullable(),
      platform: z.string().nullable(),
      projects: z.array(z.object({
        projectId: z.string(),
        projectTitle: z.string(),
        clientToken: z.string(),
      })),
    })),
  }),
  execute: async () => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getProjects" }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list clients: ${error}`)
    }

    const data = await response.json()
    
    const clientsMap = new Map()
    
    for (const project of data.projects || []) {
      for (const pc of project.projectClients || []) {
        const clientId = pc.client.id
        if (!clientsMap.has(clientId)) {
          clientsMap.set(clientId, {
            id: clientId,
            name: pc.client.name,
            email: pc.client.email,
            platform: pc.client.platform,
            projects: []
          })
        }
        clientsMap.get(clientId).projects.push({
          projectId: project.id,
          projectTitle: project.title,
          clientToken: pc.clientToken,
        })
      }
    }
    
    return { clients: Array.from(clientsMap.values()) }
  },
})