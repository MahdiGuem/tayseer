'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, X } from 'lucide-react';
import { projects } from '@/src/data/mocks';
import { Badge } from '@/src/components/ui/Badge';
import { formatCurrency } from '@/src/lib/utils/currency';
import type { Invoice } from '@/src/types';

interface InvoiceTableProps {
  filter: 'all' | 'draft' | 'sent' | 'paid' | 'overdue';
  onToast?: (message: string) => void;
}

export function InvoiceTable({ filter, onToast }: InvoiceTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const invoiceData = useMemo<Invoice[]>(() => {
    return projects.flatMap((p) =>
      p.milestones
        .filter((m) => m.dueDate)
        .map((m) => {
          const status: Invoice['status'] = m.isPaid
            ? 'paid'
            : new Date(m.dueDate!) < new Date()
            ? 'overdue'
            : 'sent';
          return {
            id: m.id,
            invoiceNumber: `INV-${m.id.split('-')[1]}`,
            client: p.clients[0]?.name || 'Unknown',
            clientEmail: p.clients[0]?.email || '',
            amount: m.amount,
            currency: p.currency,
            status,
            createdDate: p.createdAt.split('T')[0],
            dueDate: m.dueDate || '',
            description: m.label,
          };
        })
    );
  }, []);

  const filteredInvoices = useMemo(() => {
    if (filter === 'all') return invoiceData;
    return invoiceData.filter((inv) => inv.status === filter);
  }, [invoiceData, filter]);

  const handleSendInvoice = () => {
    onToast?.('Invoice sent to client');
    setSelectedInvoice(null);
  };

  return (
    <>
      <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-200">{invoice.invoiceNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-200">{invoice.client}</p>
                    <p className="text-xs text-slate-500">{invoice.clientEmail}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <Badge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} onSend={handleSendInvoice} />
        )}
      </AnimatePresence>
    </>
  );
}

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSend: () => void;
}

function InvoiceModal({ invoice, onClose, onSend }: InvoiceModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-black border border-white/10 rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-slate-400 mt-1">{invoice.client}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400">Description</span>
            <span className="text-white">{invoice.description}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400">Amount</span>
            <span className="font-medium text-white">
              {formatCurrency(invoice.amount, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400">Due Date</span>
            <span className="text-white">{invoice.dueDate}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/5">
            <span className="text-slate-400">Status</span>
            <Badge status={invoice.status} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSend}
            className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all"
          >
            Send to Client
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
