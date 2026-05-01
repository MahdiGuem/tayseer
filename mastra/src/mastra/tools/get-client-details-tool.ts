import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const getClientDetailsTool = createTool({
  id: "get-client-details",
  description: "Get detailed information about a specific client including their contact info and all projects they're associated with.",
  inputSchema: z.object({
    client_id: z.string().describe("The client ID to fetch details for"),
  }),
  outputSchema: z.object({
    client: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().nullable(),
      platform: z.string().nullable(),
      projects: z.array(z.object({
        projectId: z.string(),
        projectTitle: z.string(),
        status: z.string(),
        clientToken: z.string(),
      })),
    }),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getProjects" }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get client details: ${error}`)
    }

    const data = await response.json()
    
    let clientData: {
      id: string;
      name: string;
      email: string | null;
      platform: string | null;
      projects: Array<{
        projectId: string;
        projectTitle: string;
        status: string;
        clientToken: string;
      }>;
    } | null = null
    
    for (const project of data.projects || []) {
      for (const pc of project.projectClients || []) {
        if (pc.client.id === input.client_id) {
          if (!clientData) {
            clientData = {
              id: pc.client.id,
              name: pc.client.name,
              email: pc.client.email,
              platform: pc.client.platform,
              projects: []
            }
          }
          clientData.projects.push({
            projectId: project.id,
            projectTitle: project.title,
            status: project.status,
            clientToken: pc.clientToken,
          })
        }
      }
    }
    
    if (!clientData) {
      return { client: { id: input.client_id, name: "", email: null, platform: null, projects: [] } }
    }
    
    return { client: clientData }
  },
})