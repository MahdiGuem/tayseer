"use client";
import { ChatLayout } from "@/src/features/discussions/components/ChatLayout";
import { useToast } from "@/src/hooks/useToast";

export default function DiscussionsPage() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <ChatLayout onToast={(msg) => addToast(msg, "success")} />
    </div>
  );
}
