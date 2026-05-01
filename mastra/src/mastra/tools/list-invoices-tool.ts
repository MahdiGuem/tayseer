import { createTool } from "@mastra/core/tools"
import { z } from "zod"

const TAYSEER_API_URL = process.env.TAYSEER_API_URL || "http://localhost:3000"

export const listInvoicesTool = createTool({
  id: "list-invoices",
  description: "List all invoices for a project. Use this to track payments, see pending invoices, and monitor project income. Filter by unpaid to find outstanding payments.",
  inputSchema: z.object({
    project_id: z
      .string()
      .describe("The project ID to list invoices for"),
    only_unpaid: z
      .boolean()
      .optional()
      .describe("Filter to show only unpaid invoices (stage < 4)"),
  }),
  outputSchema: z.object({
    invoices: z.array(
      z.object({
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
      })
    ),
  }),
  execute: async (input) => {
    const response = await fetch(`${TAYSEER_API_URL}/api/tayseer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getInvoices",
        projectId: input.project_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to list invoices: ${error}`)
    }

    const data = await response.json()

    let invoices = data.invoices || []

    // Filter by paid status (stage 4 = Released/Paid)
    if (input.only_unpaid === true) {
      invoices = invoices.filter((inv: any) => inv.stage < 4)
    } else if (input.only_unpaid === false) {
      invoices = invoices.filter((inv: any) => inv.stage >= 4)
    }

    return { invoices }
  },
})