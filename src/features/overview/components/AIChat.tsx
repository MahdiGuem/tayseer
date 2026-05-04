"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/src/hooks/useToast";

interface MessagePart {
  type: "text" | "tool-call" | "tool-result" | "reasoning";
  text?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  reasoning?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
}

type ChatStatus = "ready" | "submitted" | "streaming";

const quickPrompts = [
  "Show my projects",
  "Show active projects",
  "Any draft projects?",
  "Show invoices",
  "Show clients",
];

const MASTRA_API_URL =
  process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4111";

function parseMarkdown(text: string): Array<{ type: string; content: string }> {
  if (!text.trim()) return [];

  const blocks: Array<{ type: string; content: string }> = [];
  
  // Split by double newlines to find paragraphs/sections
  const paragraphs = text.split(/\n\n+/);
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Check for code block
    if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
      const code = trimmed.slice(3, -3).trim();
      blocks.push({ type: "code", content: code });
      continue;
    }
    
    // Check for heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", content: headingMatch[2] });
      continue;
    }
    
    // Check for list items
    if (trimmed.match(/^[-*]\s/m) || trimmed.match(/^\d+\.\s/m)) {
      const items = trimmed.split(/\n/).filter(i => i.trim());
      if (items.length > 0) {
        blocks.push({ type: "list", content: items.join("\n") });
      }
      continue;
    }
    
    // Regular paragraph
    blocks.push({ type: "text", content: trimmed });
  }
  
  return blocks;
}

const MemoizedMarkdown = memo(function MemoizedMarkdown({
  content,
}: {
  content: string;
}) {
  const blocks = parseMarkdown(content);

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <div key={i} className="text-sm font-semibold text-white mt-3 mb-1">
              {block.content}
            </div>
          );
        }
        if (block.type === "code") {
          return (
            <pre
              key={i}
              className="text-xs bg-black/40 p-2 rounded my-1 overflow-x-auto whitespace-pre-wrap font-mono text-slate-300"
            >
              {block.content}
            </pre>
          );
        }
        if (block.type === "list") {
          const items = block.content.split("\n").filter(item => item.trim());
          return (
            <ul key={i} className="list-disc list-inside text-xs space-y-0.5 my-1">
              {items.map((item, j) => (
                <li key={j} className="text-slate-300">{item.replace(/^[-*\d.]\s*/, "")}</li>
              ))}
            </ul>
          );
        }
        // Simple text - just render with preserved whitespace
        return (
          <div key={i} className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {block.content}
          </div>
        );
      })}
    </>
  );
});

MemoizedMarkdown.displayName = "MemoizedMarkdown";

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

export function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || status !== "ready") return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      parts: [{ type: "text", text }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatus("submitted");
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `${MASTRA_API_URL}/api/agents/tayseer-agent/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: text }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const assistantMessageId = `msg-${Date.now()}-assistant`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        parts: [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      const reader = response.body.getReader();
      let buffer = "";

      setStatus("streaming");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
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
              setMessages((prev) =>
                prev.map((msg) => {
                  if (msg.id !== assistantMessageId) return msg;
                  
                  // Find existing text part or create new one
                  const existingTextPart = msg.parts.find(p => p.type === "text");
                  if (existingTextPart) {
                    // Update existing text part
                    return {
                      ...msg,
                      parts: msg.parts.map(p =>
                        p.type === "text"
                          ? { ...p, text: (p.text || "") + data.payload.text }
                          : p
                      ),
                    };
                  }
                  // Add new text part
                  return {
                    ...msg,
                    parts: [...msg.parts, { type: "text", text: data.payload.text }],
                  };
                })
              );
            } else if (data.type === "reasoning-delta" && data.payload?.content) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        parts: [
                          ...msg.parts,
                          { type: "reasoning", reasoning: data.payload.content },
                        ],
                      }
                    : msg
                )
              );
            } else if (data.type === "tool-call-start" && data.payload) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        parts: [
                          ...msg.parts,
                          {
                            type: "tool-call",
                            toolName: data.payload.name,
                            args: data.payload.input || {},
                          },
                        ],
                      }
                    : msg
                )
              );
            } else if (data.type === "tool-result" && data.payload) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        parts: [
                          ...msg.parts,
                          { type: "tool-result", result: data.payload },
                        ],
                      }
                    : msg
                )
              );
            }
          } catch {
            // Skip parse errors
          }
        }
      }

      setStatus("ready");

      // Show toast based on tool used
      setMessages((prev) => {
        const assistantMsg = prev.find(m => m.id === assistantMessageId);
        if (assistantMsg) {
          const toolCall = assistantMsg.parts.find(p => p.type === "tool-call");
          const toolResult = assistantMsg.parts.find(p => p.type === "tool-result");
          
          if (toolCall && toolResult) {
            const toolName = toolCall.toolName;
            const result = toolResult.result as { success?: boolean; error?: string };
            
            if (result?.success === false) {
              addToast(`${toolName} failed: ${result.error || "Unknown error"}`, "error");
            } else if (toolName === "generateInvoice") {
              addToast("Invoice created successfully", "success");
            } else if (toolName === "sendClientMessage") {
              addToast("Message sent to client", "success");
            } else if (toolName === "createProject" || toolName === "createMilestone") {
              addToast(`${toolName} created successfully`, "success");
            } else if (toolName === "updateProject" || toolName === "updateMilestone") {
              addToast(`${toolName} updated successfully`, "success");
            } else if (toolName === "deleteProject" || toolName === "deleteMilestone") {
              addToast(`${toolName} deleted successfully`, "success");
            }
          }
        }
        return prev;
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        const errorMsg = err.message;
        setError(errorMsg);
        addToast(errorMsg, "error");
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-error`,
            role: "assistant",
            parts: [{ type: "text", text: `Error: ${errorMsg}` }],
          },
        ]);
      }
      setStatus("ready");
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setStatus("ready");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b border-white/5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Bot size={16} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Tayseer AI</h2>
          <p className="text-[10px] text-slate-500">Ask me anything</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "streaming"
                ? "bg-amber-500 animate-pulse"
                : "bg-emerald-500 animate-pulse"
            }`}
          />
          <span className="text-[10px] font-medium text-emerald-400">
            {status === "streaming" ? "Thinking..." : "Online"}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                message.role === "user"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {message.role === "user" ? "Y" : <Bot size={10} />}
            </div>
            <div
              className={`max-w-[85%] rounded-md px-3 py-2 ${
                message.role === "user"
                  ? "bg-emerald-500/10 text-slate-200"
                  : "bg-white/5 text-slate-200"
              }`}
            >
              {message.parts.length === 0 && message.role === "assistant" && isLoading ? (
                <LoadingDots />
              ) : (
                message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <MemoizedMarkdown key={index} content={part.text || ""} />
                      );
                    case "tool-call":
                      return (
                        <div
                          key={index}
                          className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20"
                        >
                          <div className="text-[10px] text-blue-400 font-medium">
                            Using {part.toolName}...
                          </div>
                          <pre className="text-[9px] text-slate-500 mt-1 overflow-x-auto">
                            {JSON.stringify(part.args, null, 2)}
                          </pre>
                        </div>
                      );
                    case "tool-result":
                      return (
                        <div
                          key={index}
                          className="mt-2 p-2 bg-green-500/10 rounded border border-green-500/20"
                        >
                          <div className="text-[10px] text-green-400 font-medium">
                            Result:
                          </div>
                          <pre className="text-[9px] text-slate-500 mt-1 overflow-x-auto whitespace-pre-wrap">
                            {typeof part.result === "string"
                              ? part.result
                              : JSON.stringify(part.result, null, 2)}
                          </pre>
                        </div>
                      );
                    case "reasoning":
                      return (
                        <div
                          key={index}
                          className="mt-2 p-2 bg-purple-500/10 rounded border border-purple-500/20"
                        >
                          <div className="text-[10px] text-purple-400 italic">
                            {part.reasoning}
                          </div>
                        </div>
                      );
                    default:
                      return null;
                  }
                })
              )}
            </div>
          </div>
        ))}

        {status === "streaming" && (
          <button
            onClick={handleStop}
            className="ml-8 text-[10px] text-red-400 hover:text-red-300"
          >
            Stop
          </button>
        )}

        {error && (
          <div className="text-xs text-red-400 p-2 bg-red-500/10 rounded">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="px-2 py-1 rounded-full text-[10px] bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-all whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit(e)}
            placeholder="Ask..."
            disabled={isLoading}
            className="flex-1 bg-black/50 border border-white/10 rounded-md text-xs text-slate-200 px-3 py-2 outline-none focus:border-emerald-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}