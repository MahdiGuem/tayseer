"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Home,
  Wallet,
  FileText,
  Bell,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Bot,
  Users,
  BarChart3,
  Download,
  Filter,
  ChevronRight,
  Plus,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Cpu,
  RefreshCw,
  MessageSquare,
  Globe,
  X,
  Check,
  Loader2,
  LayoutGrid,
  List,
  MessageCircle,
  Percent,
  Target,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Chart from "chart.js/auto";
import {
  agentLogs,
  projects,
  clients,
  invoices,
  defaultCashPool,
  strategicAdvice,
  pulseMetrics,
  cashflowTransactions,
  AgentLog,
  Project,
  Client,
  Invoice,
  CashPoolConfig,
  Advice,
  PulseMetric,
  CashflowEntry,
  getStageLabel,
  getStageLabelArabic,
  formatCurrency,
} from "./mockData";

// --- Types ---
type ViewType = "overview" | "projects" | "clients" | "invoices" | "cashpool";
type BreadcrumbItem = { label: string; view?: ViewType; id?: string };

// --- Breadcrumb Component ---
const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <ChevronRight size={12} className="text-slate-600" />}
        <span
          className={
            item.view
              ? "text-emerald-400 hover:text-emerald-300 cursor-pointer"
              : ""
          }
        >
          {item.label}
        </span>
      </React.Fragment>
    ))}
  </div>
);

// --- Toast System ---
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={`px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-2 min-w-[300px] ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : toast.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : "bg-blue-500/10 border-blue-500/30 text-blue-500"
          }`}
        >
          {toast.type === "success" ? (
            <Check size={16} />
          ) : toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <Loader2 size={16} className="animate-spin" />
          )}
          <span
            className="text-sm flex-1"
            style={{ color: "var(--text-primary)" }}
          >
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: "var(--text-muted)" }}
            className="hover:text-emerald-400 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- UI Components ---

const StatusBadge: React.FC<{ status: string; showDot?: boolean }> = ({
  status,
  showDot = true,
}) => {
  const configs: Record<string, { class: string; label: string; dot: string }> =
    {
      settled: {
        class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        label: "Settled",
        dot: "bg-emerald-500",
      },
      processing: {
        class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "Processing",
        dot: "bg-amber-500",
      },
      failed: {
        class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        label: "Failed",
        dot: "bg-rose-500",
      },
      active: {
        class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        label: "Active",
        dot: "bg-emerald-500",
      },
      completed: {
        class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        label: "Complete",
        dot: "bg-emerald-500",
      },
      pending: {
        class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "Pending",
        dot: "bg-amber-500",
      },
      draft: {
        class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        label: "Draft",
        dot: "bg-slate-500",
      },
      on_hold: {
        class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        label: "On Hold",
        dot: "bg-slate-500",
      },
      pending_approval: {
        class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "Approval",
        dot: "bg-amber-500",
      },
    };
  const config = configs[status] || configs.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.class}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dot} ${status === "processing" ? "animate-pulse" : ""}`}
        />
      )}
      {config.label}
    </span>
  );
};

const TrustScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color =
    score >= 95
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 85
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : score >= 75
          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
          : "text-rose-400 bg-rose-500/10 border-rose-500/20";
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${color}`}
    >
      <Shield size={12} />
      <span>{score}</span>
    </div>
  );
};

const LifecycleStepper: React.FC<{
  stage: 1 | 2 | 3 | 4;
  onAdvance?: () => void;
  canAdvance?: boolean;
}> = ({ stage, onAdvance, canAdvance = true }) => {
  const stages = [
    { id: 1, label: "Generated", labelAr: "تم إنشاؤها" },
    { id: 2, label: "Received", labelAr: "تم الاستلام" },
    { id: 3, label: "Funded", labelAr: "تم التمويل" },
    { id: 4, label: "Released", labelAr: "تم الصرف" },
  ];

  return (
    <div className="flex items-center gap-1">
      {stages.map((s, idx) => {
        const isCompleted = s.id < stage;
        const isCurrent = s.id === stage;
        const isLast = idx === stages.length - 1;

        return (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => isCurrent && canAdvance && onAdvance?.()}
              disabled={!isCurrent || !canAdvance}
              className={`relative h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                isCompleted
                  ? "bg-emerald-500 text-black"
                  : isCurrent
                    ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer"
                    : "bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed"
              }`}
            >
              {isCompleted ? (
                <Check size={14} />
              ) : isCurrent ? (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ) : null}
            </button>
            {!isLast && (
              <div
                className={`h-0.5 w-8 mx-1 transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-white/10"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- View Components ---

const OverviewView: React.FC<{
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}> = ({ addToast }) => {
  const [filter, setFilter] = useState<
    "all" | "milestone" | "invoice" | "escrow" | "payment"
  >("all");
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logData, setLogData] = useState(agentLogs);

  const filteredLogs =
    filter === "all" ? logData : logData.filter((log) => log.action === filter);

  const handleLogClick = (log: AgentLog) => {
    setSelectedLog(log.id);
    setTimeout(() => {
      setSelectedLog(null);
      if (log.projectId) {
        addToast(`Navigating to project ${log.projectId}...`, "info");
      } else if (log.invoiceId) {
        addToast(`Opening invoice ${log.invoiceId}...`, "info");
      }
    }, 800);
  };

  const getIcon = (action: string) => {
    switch (action) {
      case "milestone":
        return Bot;
      case "invoice":
        return FileText;
      case "escrow":
        return CheckCircle;
      case "payment":
        return DollarSign;
      default:
        return MessageSquare;
    }
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "warning":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home" }, { label: "Overview" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-wider text-emerald-400">
              Environment: Production
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your autonomous financial command center
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast("New transfer initiated", "info")}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Plus size={16} />
            New Transfer
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Agent Log - 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Bot size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Agent Activity
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tayseer working autonomously
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">
                  Live
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {["all", "milestone", "invoice", "escrow", "payment"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Log Feed */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredLogs.map((log, index) => {
                  const Icon = getIcon(log.action);
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleLogClick(log)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedLog === log.id
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center border ${getColor(log.severity)}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200">
                            {log.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500">
                              {log.timestamp}
                            </span>
                            {log.clientName && (
                              <span className="text-xs text-emerald-400">
                                {log.clientName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedLog === log.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-xs text-emerald-400 flex items-center gap-1"
                        >
                          <Loader2 size={12} className="animate-spin" />
                          Opening...
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Pulse Metrics - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-white mb-4">Business Pulse</h2>
            <div className="space-y-4">
              {pulseMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      {metric.label}
                    </span>
                    <span
                      className={`text-xs flex items-center gap-1 ${
                        metric.trend === "up"
                          ? "text-emerald-400"
                          : metric.trend === "down"
                            ? "text-rose-400"
                            : "text-slate-400"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp size={12} />
                      ) : metric.trend === "down" ? (
                        <TrendingDown size={12} />
                      ) : (
                        "→"
                      )}
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {metric.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
<h3 className="text-sm font-medium text-slate-200 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => addToast("Invoice creation started", "info")}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center gap-3"
              >
                <FileText size={16} className="text-emerald-400" />
<span className="text-sm text-slate-200">Create Invoice</span>
              </button>
              <button
                onClick={() => addToast("New project created", "success")}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center gap-3"
              >
                <Plus size={16} className="text-blue-400" />
<span className="text-sm text-slate-200">New Project</span>
              </button>
              <button
                onClick={() => addToast("Telegram message sent", "success")}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center gap-3"
              >
                <MessageSquare size={16} className="text-amber-400" />
<span className="text-sm text-slate-200">Send Update</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsView: React.FC<{
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}> = ({ addToast }) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "active" | "pending" | "completed"
  >("all");
  const [showEvidence, setShowEvidence] = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => {
          if (filter === "active") return p.status === "active";
          if (filter === "pending") return p.status === "pending_approval";
          if (filter === "completed") return p.status === "completed";
          return true;
        });

  const handleForceRelease = (projectId: string) => {
    setReleasing(projectId);
    setTimeout(() => {
      setReleasing(null);
      addToast("Funds released successfully!", "success");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home" }, { label: "Projects" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage milestones and approve deliverables
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-black border border-white/10 rounded-lg text-sm text-slate-300 px-3 py-2 outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => addToast("New project created", "success")}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredProjects.map((project) => (
                <React.Fragment key={project.id}>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-200">
                          {project.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium">
                          {project.client.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-slate-200">
                            {project.client}
                          </p>
                          <p className="text-xs text-slate-500">
                            {project.clientNameArabic}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(project.totalValue, project.currency)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.status === "active" && (
                          <button
                            onClick={() => handleForceRelease(project.id)}
                            disabled={releasing === project.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs font-medium flex items-center gap-1"
                          >
                            {releasing === project.id ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />{" "}
                                Releasing...
                              </>
                            ) : (
                              <>
                                <DollarSign size={12} /> Force Release
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setExpandedProject(
                              expandedProject === project.id
                                ? null
                                : project.id,
                            )
                          }
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ChevronRight
                            size={16}
                            className={`transform transition-transform ${expandedProject === project.id ? "rotate-90" : ""}`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Milestones */}
                  <AnimatePresence>
                    {expandedProject === project.id && (
                      <motion.tr
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <td colSpan={6} className="px-6 py-4 bg-white/[0.01]">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-300 mb-3">
                              Milestones / معالم المشروع
                            </h4>
                            {project.milestones.map((milestone) => (
                              <div
                                key={milestone.id}
                                className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                        milestone.status === "completed"
                                          ? "bg-emerald-500/10 text-emerald-400"
                                          : milestone.status === "in_review"
                                            ? "bg-amber-500/10 text-amber-400"
                                            : "bg-white/5 text-slate-400"
                                      }`}
                                    >
                                      {milestone.status === "completed" ? (
                                        <CheckCircle size={16} />
                                      ) : (
                                        <Clock size={16} />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-200">
                                        {milestone.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        Due: {milestone.targetDate}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <div className="h-1.5 w-20 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-emerald-500 rounded-full"
                                          style={{
                                            width: `${milestone.progress}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs text-slate-400">
                                        {milestone.progress}%
                                      </span>
                                    </div>
                                    {milestone.evidence && (
                                      <button
                                        onClick={() =>
                                          setShowEvidence(milestone.id)
                                        }
                                        className="px-2 py-1 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
                                      >
                                        View Proof
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Evidence Modal */}
                                <AnimatePresence>
                                  {showEvidence === milestone.id &&
                                    milestone.evidence && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10"
                                      >
                                        <div className="flex items-start gap-2">
                                          <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            {milestone.evidenceType ===
                                            "chat" ? (
                                              <MessageCircle size={14} />
                                            ) : milestone.evidenceType ===
                                              "commit" ? (
                                              <RefreshCw size={14} />
                                            ) : (
                                              <FileText size={14} />
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs text-slate-400">
                                              AI-Verified Evidence
                                            </p>
                                            <p className="text-sm text-slate-200">
                                              {milestone.evidence}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setShowEvidence(null)
                                            }
                                            className="text-slate-500 hover:text-white"
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      </motion.div>
                                    )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ClientsView: React.FC<{
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}> = ({ addToast }) => {
  const [clientData, setClientData] = useState(clients);
  const [sortBy, setSortBy] = useState<"trust" | "payment" | "revenue">(
    "trust",
  );

  const sortedClients = [...clientData].sort((a, b) => {
    if (sortBy === "trust") return b.trustScore - a.trustScore;
    if (sortBy === "payment") return a.avgPaymentDays - b.avgPaymentDays;
    return b.totalRevenue - a.totalRevenue;
  });

  const toggleAgentTracking = (clientId: string) => {
    setClientData((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, agentTracking: !c.agentTracking } : c,
      ),
    );
    const client = clientData.find((c) => c.id === clientId);
    if (client) {
      addToast(
        `Agent tracking ${client.agentTracking ? "paused" : "resumed"} for ${client.name}`,
        client.agentTracking ? "warning" : "success",
      );
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "telegram":
        return <MessageCircle size={14} className="text-blue-400" />;
      case "whatsapp":
        return <MessageCircle size={14} className="text-emerald-400" />;
      default:
        return <MessageSquare size={14} className="text-slate-400" />;
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "arabic":
        return "🇸🇦";
      case "english":
        return "🇬🇧";
      case "bilingual":
        return "🌐";
      default:
        return "🌐";
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home" }, { label: "Clients" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Clients
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Trust-based CRM with platform context
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-black border border-white/10 rounded-lg text-sm text-slate-300 px-3 py-2 outline-none focus:border-emerald-500/50"
          >
            <option value="trust">Sort by Trust Score</option>
            <option value="payment">Sort by Payment Speed</option>
            <option value="revenue">Sort by Revenue</option>
          </select>
          <button
            onClick={() => addToast("Client added successfully", "success")}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-200">
                  {client.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">
                    {client.name}
                  </h3>
                  <p className="text-xs text-slate-500">{client.nameArabic}</p>
                </div>
              </div>
              <TrustScoreBadge score={client.trustScore} />
            </div>

            {/* Platform & Language */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                {getPlatformIcon(client.platform)}
                <span className="text-xs text-slate-400 capitalize">
                  {client.platform}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                <span>{getLanguageFlag(client.language)}</span>
                <span className="text-xs text-slate-400 capitalize">
                  {client.language}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-500">Total Revenue</p>
                <p className="text-sm font-medium text-slate-200">
                  {formatCurrency(client.totalRevenue, client.currency)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-xs text-slate-500">Avg Payment</p>
                <p className="text-sm font-medium text-slate-200">
                  {client.avgPaymentDays} days
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InvoicesView: React.FC<{
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}> = ({ addToast }) => {
  const [invoiceData, setInvoiceData] = useState(invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<
    "all" | "draft" | "sent" | "paid" | "overdue"
  >("all");

  const stageToStatus = (
    stage: number,
  ): "draft" | "sent" | "paid" | "overdue" => {
    if (stage === 1) return "draft";
    if (stage === 2 || stage === 3) return "sent";
    if (stage === 4) return "paid";
    return "overdue";
  };

  const filteredInvoices =
    filter === "all"
      ? invoiceData
      : invoiceData.filter((inv) => stageToStatus(inv.stage) === filter);

  const getStatusBadge = (stage: number) => {
    const status = stageToStatus(stage);
    const configs = {
      draft: {
        class: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        label: "Draft",
      },
      sent: {
        class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        label: "Sent",
      },
      paid: {
        class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        label: "Paid",
      },
      overdue: {
        class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        label: "Overdue",
      },
    };
    const config = configs[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.class}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.class.includes("emerald") ? "bg-emerald-500" : config.class.includes("blue") ? "bg-blue-500" : config.class.includes("rose") ? "bg-rose-500" : "bg-slate-500"}`}
        />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home" }, { label: "Invoices" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Invoices
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your invoices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast("New invoice created", "success")}
            className="px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "draft", "sent", "paid", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
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
                    <p className="font-medium text-slate-200">
                      {invoice.invoiceNumber}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-200">{invoice.client}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {invoice.createdDate}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.stage)}</td>
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

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInvoice(null)}
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
                  <h2 className="text-xl font-semibold text-white">
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedInvoice.client}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-medium text-white">
                    {formatCurrency(
                      selectedInvoice.amount,
                      selectedInvoice.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-slate-400">Created</span>
                  <span className="text-white">
                    {selectedInvoice.createdDate}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-slate-400">Due Date</span>
                  <span className="text-white">{selectedInvoice.dueDate}</span>
                </div>
                <div className="py-3">
                  <span className="text-slate-400 block mb-2">Line Items</span>
                  <div className="bg-white/[0.02] rounded-md p-3 border border-white/5">
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-300">
                          {item.description}
                        </span>
                        <span className="text-white">
                          {formatCurrency(
                            item.amount,
                            selectedInvoice.currency,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    addToast("Invoice sent to client", "success");
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-400 transition-all"
                >
                  Send to Client
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-md border border-white/10 hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CashPoolView: React.FC<{
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}> = ({ addToast }) => {
  const [vaultFilter, setVaultFilter] = useState<
    "all" | "tax" | "expenses" | "profit"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "inflow" | "outflow">(
    "all",
  );

  const filteredTransactions = cashflowTransactions.filter((t) => {
    const vaultMatch = vaultFilter === "all" || t.vault === vaultFilter;
    const typeMatch = typeFilter === "all" || t.type === typeFilter;
    return vaultMatch && typeMatch;
  });

  const getVaultBadge = (vault: string) => {
    const colors = {
      tax: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      expenses: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      profit: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${colors[vault as keyof typeof colors]}`}
      >
        {vault.charAt(0).toUpperCase() + vault.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => (
    <span
      className={`text-xs font-medium ${type === "inflow" ? "text-emerald-400" : "text-rose-400"}`}
    >
      {type === "inflow" ? "+" : "-"}
      {type}
    </span>
  );

  const runningTotal = filteredTransactions.reduce((acc, t) => {
    const multiplier = t.type === "inflow" ? 1 : -1;
    return acc + t.amount * multiplier;
  }, 0);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home" }, { label: "Cash Pool" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Cash Flow
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your cashflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => addToast("Export started", "info")}
            className="px-4 py-2 bg-white/5 text-slate-200 font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Vault Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(["tax", "expenses", "profit"] as const).map((vault) => {
          const vaultTxns = cashflowTransactions.filter(
            (t) => t.vault === vault,
          );
          const inflow = vaultTxns
            .filter((t) => t.type === "inflow")
            .reduce((sum, t) => sum + t.amount, 0);
          const outflow = vaultTxns
            .filter((t) => t.type === "outflow")
            .reduce((sum, t) => sum + t.amount, 0);
          const balance = inflow - outflow;
          const colors = {
            tax: "text-emerald-400",
            expenses: "text-blue-400",
            profit: "text-violet-400",
          };

          return (
            <div
              key={vault}
              className="p-4 rounded-lg border border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300 capitalize">
                  {vault} Vault
                </span>
                {getVaultBadge(vault)}
              </div>
              <p className={`text-2xl font-semibold ${colors[vault]}`}>
                {formatCurrency(balance, "USD")}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-slate-500">
                <span>In: {formatCurrency(inflow, "USD")}</span>
                <span>Out: {formatCurrency(outflow, "USD")}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Vault:</span>
          {(["all", "tax", "expenses", "profit"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setVaultFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                vaultFilter === f
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-slate-400 border border-white/5"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Type:</span>
          {(["all", "inflow", "outflow"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                typeFilter === f
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-slate-400 border border-white/5"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cashflow Table */}
      <div className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-xs font-medium text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Vault</th>
                <th className="px-6 py-3">Inflow</th>
                <th className="px-6 py-3">Outflow</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredTransactions.map((txn) => {
                const isInflow = txn.type === "inflow";
                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {txn.date}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-200">
                        {txn.description}
                      </p>
                      {txn.reference && (
                        <p className="text-xs text-slate-500">
                          {txn.reference}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{txn.category}</td>
                    <td className="px-6 py-4">{getVaultBadge(txn.vault)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-400">
                      {isInflow
                        ? formatCurrency(txn.amount, txn.currency)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-rose-400">
                      {!isInflow
                        ? formatCurrency(txn.amount, txn.currency)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      <span
                        className={
                          isInflow ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {isInflow ? "+" : "-"}
                        {formatCurrency(txn.amount, txn.currency)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---
export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleViewChange = (view: ViewType) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsLoading(false);
      setSidebarOpen(false);
    }, 300);
  };

  const navItems = [
    { id: "overview" as ViewType, label: "Overview", icon: Home },
    { id: "projects" as ViewType, label: "Projects", icon: FileText },
    { id: "clients" as ViewType, label: "Clients", icon: Users },
    { id: "invoices" as ViewType, label: "Invoices", icon: Wallet },
    { id: "cashpool" as ViewType, label: "Cash Flow", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

  {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white lg:hidden"
            >
              <LayoutGrid size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex bg-gradient-to-br from-emerald-400 to-emerald-600 w-5 h-5 rounded-full items-center justify-center">
                <Zap size={12} className="text-black fill-black" />
              </div>
              <span className="text-sm font-semibold text-slate-100">Tayseer</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-black/50 border border-white/10 rounded-md text-sm text-slate-300 pl-8 pr-3 py-1.5 outline-none focus:border-emerald-500/50 w-48"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
              <Bell size={18} />
            </button>
            <div className="bg-emerald-900/20 w-8 h-8 border-emerald-500/30 border rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-xs font-medium text-emerald-300">JS</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside
            className={`fixed lg:static inset-y-14 lg:inset-y-0 left-0 z-30 w-60 bg-black border-r border-white/5 transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <nav className="p-3 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                    currentView === item.id
                      ? "text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-auto">
            {/* Loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader2
                      size={32}
                      className="animate-spin text-emerald-400"
                    />
                    <p className="text-sm text-slate-400">Loading...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-5xl"
              >
                {currentView === "overview" && (
                  <OverviewView addToast={addToast} />
                )}
                {currentView === "projects" && (
                  <ProjectsView addToast={addToast} />
                )}
                {currentView === "clients" && <ClientsView addToast={addToast} />}
                {currentView === "invoices" && (
                  <InvoicesView addToast={addToast} />
                )}
                {currentView === "cashpool" && (
                  <CashPoolView addToast={addToast} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
