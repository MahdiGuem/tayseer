import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const generateInvoiceTool = createTool({
  id: "generate-invoice",
  description: "Create and send an invoice to a client for a milestone or work completed. Use this when the freelancer completes a milestone and needs to bill the client.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to create invoice for"),
    items: z
      .array(
        z.object({
          description: z.string(),
          amount: z.number(),
        })
      )
      .describe("Line items for the invoice"),
    due_date: z
      .string()
      .optional()
      .describe("Optional due date (ISO format string)"),
    currency: z
      .string()
      .optional()
      .describe("Currency code (default: USD)"),
  }),
  outputSchema: z.object({
    invoice: z.object({
      id: z.string(),
      projectId: z.string(),
      invoiceNumber: z.string(),
      amount: z.number(),
      currency: z.string(),
      stage: z.number(),
      dueDate: z.string().nullable(),
      createdAt: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          amount: z.number(),
        })
      ),
    }),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createInvoice",
        projectId: input.project_id,
        data: {
          items: input.items,
          dueDate: input.due_date,
          currency: input.currency,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create invoice: ${error}`)
    }

    const data = await response.json()

    return { invoice: data.invoice }
  },
})