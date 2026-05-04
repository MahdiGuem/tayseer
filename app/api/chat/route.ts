import { NextRequest, NextResponse } from "next/server";

const MASTRA_API_URL = process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4111";

interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const userMessage = body.messages.filter((m) => m.role === "user").pop();
    const prompt = userMessage?.content ?? "";

    const response = await fetch(`${MASTRA_API_URL}/api/agents/tayseer-agent/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: prompt }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Mastra API error: ${response.status}` },
        { status: response.status }
      );
    }

    const responseBody = response.body;
    if (!responseBody) {
      return NextResponse.json(
        { error: "No response body from Mastra" },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = responseBody.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const dataStr = line.slice(6).trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);
                if (data.type === "text-delta" && data.payload?.text) {
                  const textDelta = JSON.stringify({
                    type: "text-delta",
                    delta: { text: data.payload.text },
                  });
                  controller.enqueue(encoder.encode(`data: ${textDelta}\n\n`));
                } else if (data.type === "reasoning-delta" && data.payload?.content) {
                  const reasoningDelta = JSON.stringify({
                    type: "reasoning-delta",
                    id: "reasoning",
                    delta: data.payload.content,
                  });
                  controller.enqueue(encoder.encode(`data: ${reasoningDelta}\n\n`));
                } else if (data.type === "tool-call-start") {
                  const toolCallStart = JSON.stringify({
                    type: "tool-call",
                    id: `call-${Date.now()}`,
                    toolName: data.payload?.name || "tool",
                    args: data.payload?.input || {},
                  });
                  controller.enqueue(encoder.encode(`data: ${toolCallStart}\n\n`));
                } else if (data.type === "tool-result") {
                  const toolResult = JSON.stringify({
                    type: "tool-result",
                    result: data.payload?.result || data.payload,
                  });
                  controller.enqueue(encoder.encode(`data: ${toolResult}\n\n`));
                } else if (data.type === "finish" || data.type === "done") {
                  const finish = JSON.stringify({ type: "finish" });
                  controller.enqueue(encoder.encode(`data: ${finish}\n\n`));
                }
              } catch {
                // Skip parse errors
              }
            }
          }

          // Send finish event
          const finish = JSON.stringify({ type: "finish" });
          controller.enqueue(encoder.encode(`data: ${finish}\n\n`));
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}