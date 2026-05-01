// src/tools/searchMessages.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getGeminiEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
  const model = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_QUERY", // use RETRIEVAL_QUERY for search queries
        outputDimensionality: 768,
      }),
    },
  );

  if (!resp.ok) throw new Error(`Gemini embed failed: ${await resp.text()}`);

  const data = await resp.json();
  const embedding = data?.embedding?.values;

  if (!Array.isArray(embedding)) throw new Error("No embedding returned");
  return embedding.map(Number);
}

export const searchMessagesTool = createTool({
  id: "search-messages",
  description:
    "Semantically search for relevant messages in a project by meaning",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    project_id: z
      .string()
      .optional()
      .describe("The project ID to search within"),
    match_threshold: z
      .number()
      .default(0.5)
      .describe("Minimum similarity score 0-1"),
    match_count: z.number().default(10).describe("Max number of results"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        message_id: z.string(),
        content: z.string(),
        similarity: z.number(),
        created_at: z.string(),
      }),
    ),
  }),
  execute: async (input) => {
    const { query, project_id, match_threshold, match_count } = input;

    // 1. Embed the query
    const embedding = await getGeminiEmbedding(query);

    // 2. Call the Supabase RPC function
    const { data, error } = await supabase.rpc(
      "search_messages_by_query_embedding",
      {
        p_project_id: project_id,
        p_query_embedding: `[${embedding.join(",")}]`,
        p_match_threshold: match_threshold,
        p_match_count: match_count,
      },
    );

    if (error) throw new Error(`Search failed: ${error.message}`);

    return { results: data ?? [] };
  },
});
