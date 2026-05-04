import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const setInvoiceStatusTool = createTool({
  id: "set-invoice-status",
  description: "Update an invoice's status/stage. Use this when the user wants to mark an invoice as sent, paid, or change its stage.",
  inputSchema: z.object({
    id: z.string().describe("Invoice ID to update"),
    stage: z.number().min(1).max(4).describe("Invoice stage: 1=DRAFT, 2=SENT, 3=VIEWED, 4=PAID"),
  }),
  outputSchema: z.object({
    invoice: z.object({
      id: z.string(),
      invoiceNumber: z.string(),
      stage: z.number(),
      amount: z.number(),
    }),
    success: z.boolean(),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateInvoiceStage",
        id: input.id,
        stage: input.stage,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update invoice: ${error}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return { invoice: data.invoice, success: true }
  },
})