// src/tools/searchMessages.ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/*
//google
async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
  const model = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-002";

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
*/

//google colab nomic-embed-text-v1.5
async function getEmbedding(text: string): Promise<number[]> {
  const resp = await fetch(
    `https://8b70-34-125-188-94.ngrok-free.app/v1/embeddings`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text,
        dimensions: 768,
      }),
    },
  );

  if (!resp.ok) throw new Error(`Embed failed: ${await resp.text()}`);

  const data = await resp.json();
  const embedding = data?.data?.[0]?.embedding;

  if (!Array.isArray(embedding)) throw new Error("No embedding returned");

  return embedding.map(Number);
}

/*
//hf
async function getEmbedding(text: string): Promise<number[]> {
  const resp = await fetch(
    "https://router.huggingface.co/scaleway/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "qwen3-embedding-8b",
        dimensions: 768,
      }),
    },
  );

  if (!resp.ok) throw new Error(`Embed failed: ${await resp.text()}`);

  const data = await resp.json();
  const embedding = data?.data?.[0]?.embedding;

  if (!Array.isArray(embedding)) throw new Error("No embedding returned");

  return embedding.map(Number);
}
*/

export const searchMessagesTool = createTool({
  id: "search-messages",
  description:
    "Semantically search for relevant messages in a project by meaning",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    project_id: z
      .string()
      .optional()
      .describe("Optional project ID to scope the search"),
    sender_name: z
      .string()
      .optional()
      .describe("Optional sender name to filter by"),
    match_threshold: z.number().default(0.3),
    match_count: z.number().default(10),
  }),

  outputSchema: z.object({
    results: z.array(
      z.object({
        message_id: z.string(),
        project_id: z.string(),
        sender_name: z.string(),
        sender_role: z.string(),
        content: z.string(),
        similarity: z.number(),
        created_at: z.string(),
      }),
    ),
  }),
  execute: async (input) => {
    const { query, project_id, sender_name, match_threshold, match_count } =
      input;

    // 1. Embed the query
    const embedding = await getEmbedding(query);

    // 2. Call the Supabase RPC function
    const { data, error } = await supabase.rpc(
      "search_messages_by_query_embedding",
      {
        p_query_embedding: `[${embedding.join(",")}]`,
        p_match_threshold: match_threshold,
        p_match_count: match_count,
        ...(project_id ? { p_project_id: project_id } : {}),
        ...(sender_name ? { p_sender_name: sender_name } : {}),
      },
    );

    if (error) throw new Error(`Search failed: ${error.message}`);

    return { results: data ?? [] };
  },
});
