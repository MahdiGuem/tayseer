'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatLayout } from '@/src/features/discussions/components/ChatLayout';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { useToast } from '@/src/hooks/useToast';

export default function DiscussionsPage() {
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Breadcrumb items={[{ label: 'Home' }, { label: 'Discussions' }]} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <MessageCircle size={20} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Discussions</h1>
          <p className="text-sm text-slate-400 mt-1">Secure messaging with your clients</p>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatLayout onToast={(msg) => addToast(msg, 'success')} />
    </motion.div>
  );
}
