import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const getContractTool = createTool({
  id: "get-contract",
  description: "Fetch the contract details for a project. Use this to check what was agreed upon with the client including milestones, pricing, and terms.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to fetch contract for"),
  }),
  outputSchema: z.object({
    contract: z
      .object({
        description: z.string().optional(),
        milestones: z.array(
          z.object({
            label: z.string(),
            amount: z.number(),
            dueDate: z.string().optional(),
          })
        ).optional(),
        clientNames: z.array(z.string()).optional(),
        devName: z.string().optional(),
        createdAt: z.string().optional(),
        status: z.string().optional(),
      })
      .nullable(),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getContract",
        projectId: input.project_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get contract: ${error}`)
    }

    const data = await response.json()

    return { contract: data.contract }
  },
})