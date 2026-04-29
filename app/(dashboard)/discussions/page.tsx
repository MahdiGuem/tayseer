"use client";

import { motion } from "framer-motion";
import { ChatLayout } from "@/src/features/discussions/components/ChatLayout";
import { useToast } from "@/src/hooks/useToast";

export default function DiscussionsPage() {
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <ChatLayout onToast={(msg) => addToast(msg, "success")} />
    </motion.div>
  );
}
