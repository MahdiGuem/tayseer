import type {
  Project,
  Client,
  Milestone,
  Message,
  Expense,
  Contract,
  AgentLog,
  CashflowEntry,
  CashPoolConfig,
  PulseMetric,
  Discussion,
  DiscussionMessage,
} from '@/src/types';

export type {
  Project,
  Client,
  Milestone,
  Message,
  Expense,
  Contract,
  AgentLog,
  CashflowEntry,
  CashPoolConfig,
  PulseMetric,
  Discussion,
  DiscussionMessage,
};

// Mock Data
export const projects: Project[] = [
  {
    id: 'proj-001',
    title: 'Anima Refactor',
    taxRate: 20.00,
    status: 'ACTIVE',
    currency: 'USD',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    clients: [
      { id: 'client-002', projectId: 'proj-001', name: 'Hyperrise', email: 'contact@hyperrise.io', platform: 'Telegram', clientToken: 'token-hyp-001', createdAt: '2024-08-01T00:00:00Z', trustScore: 95, avgPaymentDays: 3 }
    ],
    milestones: [
      { id: 'ms-001', projectId: 'proj-001', label: 'Database Schema Design', amount: 1500.00, dueDate: '2024-08-15', isPaid: true, order: 0 },
      { id: 'ms-002', projectId: 'proj-001', label: 'API Endpoints Development', amount: 2000.00, dueDate: '2024-09-01', isPaid: true, order: 1 },
      { id: 'ms-003', projectId: 'proj-001', label: 'Authentication Layer', amount: 1200.00, dueDate: '2024-09-15', isPaid: false, order: 2 },
      { id: 'ms-004', projectId: 'proj-001', label: 'Performance Optimization', amount: 1000.00, dueDate: '2024-10-01', isPaid: false, order: 3 },
    ],
    messages: [
      { id: 'msg-001', projectId: 'proj-001', senderRole: 'DEV', senderName: 'You', content: 'Hey! Just completed the database schema design. Check it out.', createdAt: '2024-08-15T10:00:00Z' },
      { id: 'msg-002', projectId: 'proj-001', senderRole: 'CLIENT', senderName: 'Hyperrise', content: 'Looks great! Moving to next phase.', createdAt: '2024-08-15T14:00:00Z' },
      { id: 'msg-003', projectId: 'proj-001', senderRole: 'DEV', senderName: 'You', content: 'API endpoints are ready for review.', createdAt: '2024-09-01T09:00:00Z' },
    ],
    expenses: [
      { id: 'exp-001', projectId: 'proj-001', description: 'AWS Database Hosting', amount: 150.00, category: 'Infrastructure', date: '2024-08-15' },
      { id: 'exp-002', projectId: 'proj-001', description: 'API Documentation Tools', amount: 79.00, category: 'Software', date: '2024-09-01' },
    ],
    contracts: [
      { id: 'contract-001', projectId: 'proj-001', content: 'Backend Migration Contract v1.0', version: 1, createdAt: '2024-08-01T00:00:00Z' },
    ]
  },
  {
    id: 'proj-002',
    title: 'API Gateway Setup',
    taxRate: 15.00,
    status: 'ACTIVE',
    currency: 'USD',
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
    clients: [
      { id: 'client-003', projectId: 'proj-002', name: 'Acrocraft', email: 'hello@acrocraft.com', platform: 'WhatsApp', clientToken: 'token-acr-001', createdAt: '2024-09-15T00:00:00Z', trustScore: 92, avgPaymentDays: 5 }
    ],
    milestones: [
      { id: 'ms-005', projectId: 'proj-002', label: 'Component Library Setup', amount: 800.00, dueDate: '2024-09-30', isPaid: true, order: 0 },
      { id: 'ms-006', projectId: 'proj-002', label: 'Token System Design', amount: 700.00, dueDate: '2024-10-15', isPaid: false, order: 1 },
      { id: 'ms-007', projectId: 'proj-002', label: 'Documentation', amount: 600.00, dueDate: '2024-11-01', isPaid: false, order: 2 },
    ],
    messages: [
      { id: 'msg-004', projectId: 'proj-002', senderRole: 'DEV', senderName: 'You', content: 'Component library is ready. Check the Storybook.', createdAt: '2024-09-30T11:00:00Z' },
      { id: 'msg-005', projectId: 'proj-002', senderRole: 'CLIENT', senderName: 'Acrocraft', content: 'The components look fantastic! Great work.', createdAt: '2024-09-30T16:00:00Z' },
    ],
    expenses: [
      { id: 'exp-003', projectId: 'proj-002', description: 'Figma Pro Plan', amount: 45.00, category: 'Software', date: '2024-09-15' },
    ],
    contracts: [
      { id: 'contract-002', projectId: 'proj-002', content: 'Design System Contract', version: 1, createdAt: '2024-09-15T00:00:00Z' },
    ]
  },
  {
    id: 'proj-003',
    title: 'Mobile App Development',
    taxRate: 20.00,
    status: 'COMPLETED',
    currency: 'SAR',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-10-20T00:00:00Z',
    clients: [
      { id: 'client-001', projectId: 'proj-003', name: 'Tech-Sprint', email: 'ceo@techsprint.sa', platform: 'Telegram', clientToken: 'token-ts-001', createdAt: '2024-06-01T00:00:00Z', trustScore: 98, avgPaymentDays: 2 }
    ],
    milestones: [
      { id: 'ms-008', projectId: 'proj-003', label: 'Requirements Gathering', amount: 5000.00, dueDate: '2024-06-15', isPaid: true, order: 0 },
      { id: 'ms-009', projectId: 'proj-003', label: 'UI/UX Design', amount: 4000.00, dueDate: '2024-07-15', isPaid: true, order: 1 },
      { id: 'ms-010', projectId: 'proj-003', label: 'App Development', amount: 5000.00, dueDate: '2024-09-15', isPaid: true, order: 2 },
      { id: 'ms-011', projectId: 'proj-003', label: 'Testing & Launch', amount: 2000.00, dueDate: '2024-10-15', isPaid: true, order: 3 },
    ],
    messages: [
      { id: 'msg-006', projectId: 'proj-003', senderRole: 'DEV', senderName: 'You', content: 'App is live on App Store and Play Store!', createdAt: '2024-10-20T09:00:00Z' },
      { id: 'msg-007', projectId: 'proj-003', senderRole: 'CLIENT', senderName: 'Tech-Sprint', content: 'Amazing work! Already getting great feedback.', createdAt: '2024-10-20T12:00:00Z' },
    ],
    expenses: [
      { id: 'exp-004', projectId: 'proj-003', description: 'Apple Developer License', amount: 99.00, category: 'Software', date: '2024-06-01' },
      { id: 'exp-005', projectId: 'proj-003', description: 'Firebase', amount: 120.00, category: 'Infrastructure', date: '2024-10-01' },
    ],
    contracts: [
      { id: 'contract-003', projectId: 'proj-003', content: 'Mobile App Contract v1.0', version: 1, createdAt: '2024-06-01T00:00:00Z' },
    ]
  },
  {
    id: 'proj-004',
    title: 'Infrastructure Scaling',
    taxRate: 25.00,
    status: 'ACTIVE',
    currency: 'USD',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    clients: [
      { id: 'client-004', projectId: 'proj-004', name: 'Cyberdyne', email: 'ops@cyberdyne.ai', platform: 'Telegram', clientToken: 'token-cy-001', createdAt: '2024-08-01T00:00:00Z', trustScore: 88, avgPaymentDays: 7 }
    ],
    milestones: [
      { id: 'ms-012', projectId: 'proj-004', label: 'Load Testing', amount: 1500.00, dueDate: '2024-08-15', isPaid: true, order: 0 },
      { id: 'ms-013', projectId: 'proj-004', label: 'Auto-scaling Config', amount: 2000.00, dueDate: '2024-09-01', isPaid: true, order: 1 },
      { id: 'ms-014', projectId: 'proj-004', label: 'Monitoring Setup', amount: 1200.00, dueDate: '2024-09-15', isPaid: false, order: 2 },
      { id: 'ms-015', projectId: 'proj-004', label: 'Documentation', amount: 700.00, dueDate: '2024-09-30', isPaid: false, order: 3 },
    ],
    messages: [
      { id: 'msg-008', projectId: 'proj-004', senderRole: 'CLIENT', senderName: 'Cyberdyne', content: 'Can we add more instances for peak hours?', createdAt: '2024-09-10T08:00:00Z' },
      { id: 'msg-009', projectId: 'proj-004', senderRole: 'DEV', senderName: 'You', content: 'Yes, auto-scaling is configured. I will set up alerts.', createdAt: '2024-09-10T09:00:00Z' },
    ],
    expenses: [
      { id: 'exp-006', projectId: 'proj-004', description: 'AWS EC2 Instances', amount: 450.00, category: 'Infrastructure', date: '2024-10-01' },
    ],
    contracts: [
      { id: 'contract-004', projectId: 'proj-004', content: 'Infrastructure Contract', version: 1, createdAt: '2024-08-01T00:00:00Z' },
    ]
  },
  {
    id: 'proj-005',
    title: 'Payment Integration',
    taxRate: 15.00,
    status: 'DRAFT',
    currency: 'EGP',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
    clients: [
      { id: 'client-008', projectId: 'proj-005', name: 'Nile Solutions', email: 'info@nilesolutions.com', platform: 'WhatsApp', clientToken: 'token-ns-001', createdAt: '2024-11-01T00:00:00Z', trustScore: 90, avgPaymentDays: 4 }
    ],
    milestones: [
      { id: 'ms-016', projectId: 'proj-005', label: 'Fawry API Integration', amount: 1500.00, dueDate: '2024-11-10', isPaid: false, order: 0 },
      { id: 'ms-017', projectId: 'proj-005', label: 'Stripe Connect Setup', amount: 1200.00, dueDate: '2024-11-20', isPaid: false, order: 1 },
      { id: 'ms-018', projectId: 'proj-005', label: 'Testing & QA', amount: 500.00, dueDate: '2024-12-05', isPaid: false, order: 2 },
    ],
    messages: [
      { id: 'msg-010', projectId: 'proj-005', senderRole: 'DEV', senderName: 'You', content: 'Ready to start on the Fawry integration. Any specific requirements?', createdAt: '2024-11-02T10:00:00Z' },
    ],
    expenses: [],
    contracts: [
      { id: 'contract-005', projectId: 'proj-005', content: 'Payment Integration Contract', version: 1, createdAt: '2024-11-01T00:00:00Z' },
    ]
  },
];

// Global expenses (not tied to projects)
export const expenses: Expense[] = [
  { id: 'exp-g001', description: 'Office Rent', amount: 1200.00, category: 'Office', date: '2024-11-01' },
  { id: 'exp-g002', description: 'Internet & Utilities', amount: 150.00, category: 'Office', date: '2024-11-05' },
  { id: 'exp-g003', description: 'GitHub Pro', amount: 19.00, category: 'Software', date: '2024-11-10' },
];

// Chat messages for AI interface
export const chatMessages: Message[] = [
  { id: 'chat-001', projectId: '', senderRole: 'CLIENT', senderName: 'Tayseer', content: 'Hi! I\'m Tayseer, your autonomous financial agent. How can I help you today?', createdAt: '2024-11-15T00:00:00Z' },
  { id: 'chat-002', projectId: '', senderRole: 'DEV', senderName: 'You', content: 'What\'s my total outstanding revenue?', createdAt: '2024-11-15T00:01:00Z' },
  { id: 'chat-003', projectId: '', senderRole: 'CLIENT', senderName: 'Tayseer', content: 'You have $2,700 in outstanding invoices: $1,200 from Acrocraft and $1,500 from GlobalTech.', createdAt: '2024-11-15T00:01:30Z' },
];

// Agent Logs
export const agentLogs: AgentLog[] = [
  { id: 'log-001', timestamp: '2 min ago', action: 'milestone', message: 'Detected milestone completion in Telegram chat with Hyperrise', projectId: 'proj-001', clientName: 'Hyperrise', severity: 'success' },
  { id: 'log-002', timestamp: '5 min ago', action: 'invoice', message: 'Invoice #882 generated and sent to Acrocraft via email', invoiceId: 'inv-882', clientName: 'Acrocraft', severity: 'info' },
  { id: 'log-003', timestamp: '12 min ago', action: 'escrow', message: 'Escrow funds released for Project Alpha ($3,852.32)', projectId: 'proj-001', severity: 'success' },
  { id: 'log-004', timestamp: '18 min ago', action: 'payment', message: 'Payment received from Cyberdyne ($5,400.00) - Auto-saved 20% to Tax Vault', clientName: 'Cyberdyne', severity: 'success' },
  { id: 'log-005', timestamp: '32 min ago', action: 'invoice', message: 'Draft invoice created for GlobalTech - Awaiting milestone evidence', invoiceId: 'inv-883', clientName: 'GlobalTech', severity: 'warning' },
  { id: 'log-006', timestamp: '1 hour ago', action: 'alert', message: 'Client Nahda Software payment is 3 days overdue - Sent gentle reminder', clientName: 'Nahda Software', severity: 'warning' },
  { id: 'log-007', timestamp: '2 hours ago', action: 'milestone', message: 'Backend API milestone verified via GitHub commit - Ready for approval', projectId: 'proj-001', severity: 'info' },
  { id: 'log-008', timestamp: '3 hours ago', action: 'escrow', message: 'Auto-funded Tax Vault: $770.46 (20% of Hyperrise payment)', severity: 'success' },
  { id: 'log-009', timestamp: '4 hours ago', action: 'payment', message: 'Scheduled monthly expense payout: $1,240.00 to Operations', severity: 'info' },
  { id: 'log-010', timestamp: '5 hours ago', action: 'invoice', message: 'Invoice #881 marked as paid - Funds split: Tax 20%, Expense 30%, Profit 50%', invoiceId: 'inv-881', severity: 'success' },
  { id: 'log-011', timestamp: '6 hours ago', action: 'alert', message: 'Low liquidity alert: Expense Vault below target (68%)', severity: 'warning' },
  { id: 'log-012', timestamp: '8 hours ago', action: 'milestone', message: 'Design System milestone evidence uploaded - Awaiting client approval', projectId: 'proj-002', clientName: 'Acrocraft', severity: 'info' },
  { id: 'log-013', timestamp: '12 hours ago', action: 'payment', message: 'Cross-border payment processed: EUR €12,907 via SEPA', severity: 'success' },
  { id: 'log-014', timestamp: '1 day ago', action: 'invoice', message: 'Recurring invoice generated for Cyberdyne (Infrastructure Scaling)', invoiceId: 'inv-880', clientName: 'Cyberdyne', severity: 'info' },
  { id: 'log-015', timestamp: '2 days ago', action: 'escrow', message: 'Smart contract executed: Released $850.00 for completed Frontend Audit', projectId: 'proj-004', severity: 'success' },
];

// Cash Pool Configuration
export const defaultCashPool = {
  tax: 20,
  expenses: 30,
  profit: 50,
  balances: {
    tax: 4250.00,
    expenses: 3200.00,
    profit: 8900.00,
  },
  targets: {
    tax: 5000.00,
    expenses: 4000.00,
    profit: 10000.00,
  },
};

export const cashflowTransactions: CashflowEntry[] = [
  { id: 'cf-001', date: '2024-11-15', description: 'Payment from Tech-Sprint', type: 'inflow', amount: 16000.00, currency: 'SAR', vault: 'profit', category: 'Client Payment', reference: 'proj-003' },
  { id: 'cf-002', date: '2024-11-14', description: 'AWS Hosting Fee', type: 'outflow', amount: 450.00, currency: 'USD', vault: 'expenses', category: 'Infrastructure', reference: '-' },
  { id: 'cf-003', date: '2024-11-13', description: 'Payment from Cyberdyne', type: 'inflow', amount: 5400.00, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'proj-004' },
  { id: 'cf-004', date: '2024-11-12', description: 'Tax Auto-Allocation', type: 'outflow', amount: 1080.00, currency: 'USD', vault: 'tax', category: 'Tax Reserve', reference: '-' },
  { id: 'cf-005', date: '2024-11-11', description: 'Payment from Hyperrise', type: 'inflow', amount: 3852.32, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'proj-001' },
  { id: 'cf-006', date: '2024-11-10', description: 'Software Subscription', type: 'outflow', amount: 79.00, currency: 'USD', vault: 'expenses', category: 'Software', reference: '-' },
  { id: 'cf-007', date: '2024-11-09', description: 'Payment from Acrocraft', type: 'inflow', amount: 2100.00, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'proj-002' },
  { id: 'cf-008', date: '2024-11-08', description: 'Expense Auto-Allocation', type: 'outflow', amount: 1155.70, currency: 'USD', vault: 'expenses', category: 'Expense Reserve', reference: '-' },
  { id: 'cf-009', date: '2024-11-07', description: 'Profit Withdrawal', type: 'outflow', amount: 2500.00, currency: 'USD', vault: 'profit', category: 'Withdrawal', reference: '-' },
  { id: 'cf-010', date: '2024-11-06', description: 'Office Rent', type: 'outflow', amount: 1200.00, currency: 'USD', vault: 'expenses', category: 'Office', reference: '-' },
  { id: 'cf-011', date: '2024-11-05', description: 'AWS EC2', type: 'outflow', amount: 450.00, currency: 'USD', vault: 'expenses', category: 'Infrastructure', reference: '-' },
  { id: 'cf-012', date: '2024-11-04', description: 'Payment from Nile Solutions', type: 'inflow', amount: 3200.00, currency: 'EGP', vault: 'profit', category: 'Client Payment', reference: 'proj-005' },
];

// Pulse Metrics
export const pulseMetrics: PulseMetric[] = [
  { id: 'metric-001', label: 'Total Revenue', value: '$13,452.32', change: '+12.5%', trend: 'up', sublabel: 'Last 30 days' },
  { id: 'metric-002', label: 'Burn Rate', value: '$4,800/mo', change: '+3.2%', trend: 'up', sublabel: 'Avg monthly' },
  { id: 'metric-003', label: 'Agent Efficiency', value: '47 hours', change: '+23%', trend: 'up', sublabel: 'Time saved this month' },
  { id: 'metric-004', label: 'Active Projects', value: '4', change: '+1', trend: 'up', sublabel: '2 completed this month' },
];

// Discussions
export const discussions: Discussion[] = [
  { id: 'disc-001', clientId: 'client-002', lastMessageAt: '2024-11-15T14:30:00Z', unreadCount: 2, isPinned: true },
  { id: 'disc-002', clientId: 'client-003', lastMessageAt: '2024-11-14T09:15:00Z', unreadCount: 0, isPinned: false },
  { id: 'disc-003', clientId: 'client-001', lastMessageAt: '2024-11-13T16:45:00Z', unreadCount: 0, isPinned: false },
  { id: 'disc-004', clientId: 'client-004', lastMessageAt: '2024-11-12T11:20:00Z', unreadCount: 5, isPinned: false },
  { id: 'disc-005', clientId: 'client-008', lastMessageAt: '2024-11-10T08:00:00Z', unreadCount: 0, isPinned: false },
];

// Discussion Messages
export const discussionMessages: DiscussionMessage[] = [
  // Hyperrise conversation
  { id: 'dm-001', discussionId: 'disc-001', senderRole: 'CLIENT', senderName: 'Hyperrise', content: 'Hey! Just reviewed the database schema. Looks solid!', status: 'read', createdAt: '2024-11-15T14:25:00Z' },
  { id: 'dm-002', discussionId: 'disc-001', senderRole: 'DEV', senderName: 'You', content: 'Thanks! Moving on to the API endpoints now.', status: 'read', createdAt: '2024-11-15T14:28:00Z' },
  { id: 'dm-003', discussionId: 'disc-001', senderRole: 'CLIENT', senderName: 'Hyperrise', content: 'Perfect. When do you think the milestone will be ready?', status: 'delivered', createdAt: '2024-11-15T14:30:00Z' },
  { id: 'dm-004', discussionId: 'disc-001', senderRole: 'CLIENT', senderName: 'Hyperrise', content: 'Also, can you add authentication for the admin panel?', status: 'delivered', createdAt: '2024-11-15T14:31:00Z' },
  
  // Acrocraft conversation
  { id: 'dm-005', discussionId: 'disc-002', senderRole: 'DEV', senderName: 'You', content: 'Component library is ready for review!', status: 'read', createdAt: '2024-11-14T09:10:00Z' },
  { id: 'dm-006', discussionId: 'disc-002', senderRole: 'CLIENT', senderName: 'Acrocraft', content: 'The components look fantastic! Great work.', status: 'read', createdAt: '2024-11-14T09:15:00Z' },
  
  // Tech-Sprint conversation
  { id: 'dm-007', discussionId: 'disc-003', senderRole: 'DEV', senderName: 'You', content: 'App is live on App Store and Play Store!', status: 'read', createdAt: '2024-11-13T16:40:00Z' },
  { id: 'dm-008', discussionId: 'disc-003', senderRole: 'CLIENT', senderName: 'Tech-Sprint', content: 'Amazing work! Already getting great feedback.', status: 'read', createdAt: '2024-11-13T16:45:00Z' },
  
  // Cyberdyne conversation
  { id: 'dm-009', discussionId: 'disc-004', senderRole: 'CLIENT', senderName: 'Cyberdyne', content: 'Can we add more instances for peak hours?', status: 'read', createdAt: '2024-11-12T11:15:00Z' },
  { id: 'dm-010', discussionId: 'disc-004', senderRole: 'DEV', senderName: 'You', content: 'Yes, auto-scaling is configured. I will set up alerts.', status: 'read', createdAt: '2024-11-12T11:18:00Z' },
  { id: 'dm-011', discussionId: 'disc-004', senderRole: 'CLIENT', senderName: 'Cyberdyne', content: 'Great! When can we test the monitoring?', status: 'delivered', createdAt: '2024-11-12T11:20:00Z' },
  { id: 'dm-012', discussionId: 'disc-004', senderRole: 'CLIENT', senderName: 'Cyberdyne', content: 'Also need the documentation updated.', status: 'delivered', createdAt: '2024-11-12T11:22:00Z' },
  { id: 'dm-013', discussionId: 'disc-004', senderRole: 'CLIENT', senderName: 'Cyberdyne', content: 'And let me know about the security audit.', status: 'delivered', createdAt: '2024-11-12T11:25:00Z' },
  
  // Nile Solutions conversation
  { id: 'dm-014', discussionId: 'disc-005', senderRole: 'DEV', senderName: 'You', content: 'Ready to start on the Fawry integration. Any specific requirements?', status: 'read', createdAt: '2024-11-10T08:00:00Z' },
];
