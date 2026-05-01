// src/agents/yourAgent.ts
import { Agent } from "@mastra/core/agent";
import { searchMessagesTool } from "../tools/searchMessages-tool";
import { Memory } from "@mastra/memory";

export const tayseerAgent = new Agent({
  id: "tayseer-agent",
  name: "tayseer-agent",
  instructions: `You are a helpful assistant. When asked about past messages or context,
    use the search-messages tool to find relevant messages from the project.`,
  model: "ollama-cloud/cogito-2.1:671b",
  tools: {
    searchMessages: searchMessagesTool,
  },
  memory: new Memory(),
});
