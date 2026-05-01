import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const sendClientMessageTool = createTool({
  id: "send-client-message",
  description: "Send a message to the client through the project chat. Use this to communicate with clients about project progress, invoices, contracts, or any project-related updates. Tayseer sends messages on behalf of the freelancer.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to send message to"),
    content: z
      .string()
      .describe("The message content to send to the client"),
  }),
  outputSchema: z.object({
    message: z.object({
      id: z.string(),
      projectId: z.string(),
      senderRole: z.string(),
      senderName: z.string(),
      content: z.string(),
      createdAt: z.string(),
    }),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createMessage",
        projectId: input.project_id,
        data: {
          senderRole: "DEV",
          senderName: "Tayseer",
          content: input.content,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send message: ${error}`)
    }

    const data = await response.json()

    return { message: data.message }
  },
})