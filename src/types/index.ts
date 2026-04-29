// Enums
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type SenderRole = 'DEV' | 'CLIENT';
export type MilestoneStatus = 'pending' | 'in_review' | 'completed' | 'rejected';
export type LogSeverity = 'info' | 'success' | 'warning';
export type LogAction = 'milestone' | 'invoice' | 'escrow' | 'payment' | 'alert' | 'message';
export type VaultType = 'tax' | 'expenses' | 'profit';
export type TransactionType = 'inflow' | 'outflow';

// Core Models
export interface Project {
  id: string;
  title: string;
  taxRate: number;
  status: ProjectStatus;
  currency: string;
  createdAt: string;
  updatedAt: string;
  clients: Client[];
  milestones: Milestone[];
  messages: Message[];
  expenses: Expense[];
  contracts: Contract[];
}

export interface Client {
  id: string;
  projectId: string;
  name: string;
  email?: string;
  platform?: string;
  clientToken: string;
  createdAt: string;
  trustScore?: number;
  avgPaymentDays?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  label: string;
  amount: number;
  dueDate?: string;
  targetDate?: string;
  isPaid: boolean;
  order: number;
  status?: MilestoneStatus;
  progress?: number;
  evidence?: string;
  evidenceType?: 'chat' | 'commit' | 'file';
}

export interface Message {
  id: string;
  projectId: string;
  senderRole: SenderRole;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  projectId?: string;
  description: string;
  amount: number;
  category?: string;
  date: string;
}

export interface Contract {
  id: string;
  projectId: string;
  content: string;
  version: number;
  createdAt: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  action: LogAction;
  message: string;
  projectId?: string;
  invoiceId?: string;
  clientName?: string;
  severity: LogSeverity;
}

export interface CashflowEntry {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  currency: string;
  vault: VaultType;
  category: string;
  reference?: string;
}

export interface CashPoolConfig {
  tax: number;
  expenses: number;
  profit: number;
  balances: {
    tax: number;
    expenses: number;
    profit: number;
  };
  targets: {
    tax: number;
    expenses: number;
    profit: number;
  };
}

// Discussion Types
export interface Discussion {
  id: string;
  clientId: string;
  lastMessageAt: string;
  unreadCount: number;
  isPinned?: boolean;
}

export interface DiscussionMessage {
  id: string;
  discussionId: string;
  senderRole: SenderRole;
  senderName: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface PulseMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  sublabel: string;
}

// View Types
export type ViewType = 'overview' | 'projects' | 'clients' | 'invoices' | 'cashflow' | 'activity' | 'discussions';

export interface BreadcrumbItem {
  label: string;
  view?: ViewType;
  id?: string;
}

// Toast Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdDate: string;
  dueDate: string;
  description: string;
}
