declare module "ai" {
  export type UIMessage = {
    id: string;
    role: string;
    parts: Array<{
      type: string;
      text?: string;
      toolName?: string;
      args?: Record<string, unknown>;
      result?: unknown;
      reasoning?: string;
    }>;
  };

  export class DefaultChatTransport {
    constructor(config: { api: string });
  }
}