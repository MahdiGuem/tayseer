// Agent Log - Autonomous AI Actions
export interface AgentLog {
  id: string;
  timestamp: string;
  action: 'milestone' | 'invoice' | 'escrow' | 'payment' | 'alert';
  message: string;
  projectId?: string;
  invoiceId?: string;
  clientName?: string;
  severity: 'info' | 'success' | 'warning';
}

export const agentLogs: AgentLog[] = [
  {
    id: 'log-001',
    timestamp: '2 min ago',
    action: 'milestone',
    message: 'Detected milestone completion in Telegram chat with Hyperrise',
    projectId: 'proj-001',
    clientName: 'Hyperrise',
    severity: 'success',
  },
  {
    id: 'log-002',
    timestamp: '5 min ago',
    action: 'invoice',
    message: 'Invoice #882 generated and sent to Acrocraft via email',
    invoiceId: 'inv-882',
    clientName: 'Acrocraft',
    severity: 'info',
  },
  {
    id: 'log-003',
    timestamp: '12 min ago',
    action: 'escrow',
    message: 'Escrow funds released for Project Alpha ($3,852.32)',
    projectId: 'proj-001',
    severity: 'success',
  },
  {
    id: 'log-004',
    timestamp: '18 min ago',
    action: 'payment',
    message: 'Payment received from Cyberdyne ($5,400.00) - Auto-saved 20% to Tax Vault',
    clientName: 'Cyberdyne',
    severity: 'success',
  },
  {
    id: 'log-005',
    timestamp: '32 min ago',
    action: 'invoice',
    message: 'Draft invoice created for GlobalTech - Awaiting milestone evidence',
    invoiceId: 'inv-883',
    clientName: 'GlobalTech',
    severity: 'warning',
  },
  {
    id: 'log-006',
    timestamp: '1 hour ago',
    action: 'alert',
    message: 'Client Nahda Software payment is 3 days overdue - Sent gentle reminder',
    clientName: 'Nahda Software',
    severity: 'warning',
  },
  {
    id: 'log-007',
    timestamp: '2 hours ago',
    action: 'milestone',
    message: 'Backend API milestone verified via GitHub commit - Ready for approval',
    projectId: 'proj-002',
    severity: 'info',
  },
  {
    id: 'log-008',
    timestamp: '3 hours ago',
    action: 'escrow',
    message: 'Auto-funded Tax Vault: $770.46 (20% of Hyperrise payment)',
    severity: 'success',
  },
  {
    id: 'log-009',
    timestamp: '4 hours ago',
    action: 'payment',
    message: 'Scheduled monthly expense payout: $1,240.00 to Operations',
    severity: 'info',
  },
  {
    id: 'log-010',
    timestamp: '5 hours ago',
    action: 'invoice',
    message: 'Invoice #881 marked as paid - Funds split: Tax 20%, Expense 30%, Profit 50%',
    invoiceId: 'inv-881',
    severity: 'success',
  },
  {
    id: 'log-011',
    timestamp: '6 hours ago',
    action: 'alert',
    message: 'Low liquidity alert: Expense Vault below target (68%)',
    severity: 'warning',
  },
  {
    id: 'log-012',
    timestamp: '8 hours ago',
    action: 'milestone',
    message: 'Design System milestone evidence uploaded - Awaiting client approval',
    projectId: 'proj-003',
    clientName: 'Acrocraft',
    severity: 'info',
  },
  {
    id: 'log-013',
    timestamp: '12 hours ago',
    action: 'payment',
    message: 'Cross-border payment processed: EUR €12,907 via SEPA',
    severity: 'success',
  },
  {
    id: 'log-014',
    timestamp: '1 day ago',
    action: 'invoice',
    message: 'Recurring invoice generated for Cyberdyne (Infrastructure Scaling)',
    invoiceId: 'inv-880',
    clientName: 'Cyberdyne',
    severity: 'info',
  },
  {
    id: 'log-015',
    timestamp: '2 days ago',
    action: 'escrow',
    message: 'Smart contract executed: Released $850.00 for completed Frontend Audit',
    projectId: 'proj-004',
    severity: 'success',
  },
];

// Projects with Milestones
export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  status: 'pending' | 'in_review' | 'approved' | 'completed';
  progress: number;
  evidence?: string;
  evidenceType?: 'chat' | 'file' | 'commit';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientNameArabic?: string;
  description: string;
  totalValue: number;
  currency: string;
  progress: number;
  status: 'active' | 'pending_approval' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export const projects: Project[] = [
  {
    id: 'proj-001',
    name: 'Anima Refactor',
    client: 'Hyperrise',
    clientNameArabic: 'هايبردايز',
    description: 'Backend Migration & API Setup',
    totalValue: 3852.32,
    currency: 'USD',
    progress: 80,
    status: 'active',
    startDate: '2024-08-01',
    endDate: 'Ongoing',
    milestones: [
      { id: 'ms-001', name: 'Database Schema Design', targetDate: '2024-08-15', status: 'completed', progress: 100, evidence: 'Schema approved via Telegram', evidenceType: 'chat' },
      { id: 'ms-002', name: 'API Endpoints Development', targetDate: '2024-09-01', status: 'completed', progress: 100, evidence: 'GitHub commit #a3f7d2', evidenceType: 'commit' },
      { id: 'ms-003', name: 'Authentication Layer', targetDate: '2024-09-15', status: 'in_review', progress: 85, evidence: 'Demo video uploaded', evidenceType: 'file' },
      { id: 'ms-004', name: 'Performance Optimization', targetDate: '2024-10-01', status: 'pending', progress: 40 },
    ],
  },
  {
    id: 'proj-002',
    name: 'API Gateway Setup',
    client: 'Acrocraft',
    clientNameArabic: 'أكروكرافت',
    description: 'Design System Implementation',
    totalValue: 2100.00,
    currency: 'USD',
    progress: 45,
    status: 'pending_approval',
    startDate: '2024-09-15',
    endDate: '2024-12-10',
    milestones: [
      { id: 'ms-005', name: 'Component Library Setup', targetDate: '2024-09-30', status: 'completed', progress: 100 },
      { id: 'ms-006', name: 'Token System Design', targetDate: '2024-10-15', status: 'in_review', progress: 90, evidence: 'Figma file shared', evidenceType: 'file' },
      { id: 'ms-007', name: 'Documentation', targetDate: '2024-11-01', status: 'pending', progress: 30 },
    ],
  },
  {
    id: 'proj-003',
    name: 'Mobile App Consulting',
    client: 'GlobalTech',
    clientNameArabic: 'جلوبالتك',
    description: 'Mobile App Consulting & Strategy',
    totalValue: 1250.00,
    currency: 'USD',
    progress: 0,
    status: 'on_hold',
    startDate: '2024-10-01',
    endDate: '2024-10-30',
    milestones: [
      { id: 'ms-008', name: 'Requirements Gathering', targetDate: '2024-10-05', status: 'pending', progress: 0 },
      { id: 'ms-009', name: 'Architecture Proposal', targetDate: '2024-10-15', status: 'pending', progress: 0 },
    ],
  },
  {
    id: 'proj-004',
    name: 'Frontend Audit',
    client: 'Hyperrise',
    clientNameArabic: 'هايبردايز',
    description: 'Performance & Accessibility Audit',
    totalValue: 850.00,
    currency: 'USD',
    progress: 100,
    status: 'completed',
    startDate: '2024-07-12',
    endDate: '2024-07-20',
    milestones: [
      { id: 'ms-010', name: 'Lighthouse Analysis', targetDate: '2024-07-14', status: 'completed', progress: 100, evidence: 'Report generated', evidenceType: 'file' },
      { id: 'ms-011', name: 'Recommendations', targetDate: '2024-07-18', status: 'completed', progress: 100 },
    ],
  },
  {
    id: 'proj-005',
    name: 'Infrastructure Scaling',
    client: 'Cyberdyne',
    clientNameArabic: 'سايبردين',
    description: 'Cloud Infrastructure Auto-scaling',
    totalValue: 5400.00,
    currency: 'USD',
    progress: 60,
    status: 'active',
    startDate: '2024-08-01',
    endDate: 'Ongoing',
    milestones: [
      { id: 'ms-012', name: 'Load Testing', targetDate: '2024-08-15', status: 'completed', progress: 100 },
      { id: 'ms-013', name: 'Auto-scaling Config', targetDate: '2024-09-01', status: 'in_review', progress: 75 },
      { id: 'ms-014', name: 'Monitoring Setup', targetDate: '2024-09-15', status: 'pending', progress: 35 },
      { id: 'ms-015', name: 'Documentation', targetDate: '2024-09-30', status: 'pending', progress: 10 },
    ],
  },
  {
    id: 'proj-006',
    name: 'Payment Gateway Integration',
    client: 'Nile Solutions',
    clientNameArabic: 'حلول النيل',
    description: 'Stripe & Local Payment Integration',
    totalValue: 3200.00,
    currency: 'EGP',
    progress: 30,
    status: 'active',
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    milestones: [
      { id: 'ms-016', name: 'Fawry API Integration', targetDate: '2024-11-10', status: 'in_review', progress: 80 },
      { id: 'ms-017', name: 'Stripe Connect Setup', targetDate: '2024-11-20', status: 'pending', progress: 20 },
      { id: 'ms-018', name: 'Testing & QA', targetDate: '2024-12-05', status: 'pending', progress: 0 },
    ],
  },
];

// Clients with Trust Scores
export interface Client {
  id: string;
  name: string;
  nameArabic: string;
  logo: string;
  trustScore: number;
  platform: 'telegram' | 'whatsapp' | 'email';
  language: 'arabic' | 'english' | 'bilingual';
  avgPaymentDays: number;
  totalRevenue: number;
  currency: string;
  disputeCount: number;
  projectsCount: number;
  agentTracking: boolean;
  lastContact: string;
}

export const clients: Client[] = [
  {
    id: 'client-001',
    name: 'Tech-Sprint',
    nameArabic: 'التقنية السريعة',
    logo: 'TS',
    trustScore: 98,
    platform: 'telegram',
    language: 'bilingual',
    avgPaymentDays: 2,
    totalRevenue: 12450,
    currency: 'SAR',
    disputeCount: 0,
    projectsCount: 3,
    agentTracking: true,
    lastContact: '2 hours ago',
  },
  {
    id: 'client-002',
    name: 'Hyperrise',
    nameArabic: 'هايبردايز',
    logo: 'H',
    trustScore: 95,
    platform: 'telegram',
    language: 'english',
    avgPaymentDays: 3,
    totalRevenue: 4702.32,
    currency: 'USD',
    disputeCount: 0,
    projectsCount: 2,
    agentTracking: true,
    lastContact: '5 min ago',
  },
  {
    id: 'client-003',
    name: 'Acrocraft',
    nameArabic: 'أكروكرافت',
    logo: 'A',
    trustScore: 92,
    platform: 'whatsapp',
    language: 'english',
    avgPaymentDays: 5,
    totalRevenue: 2100.00,
    currency: 'USD',
    disputeCount: 1,
    projectsCount: 1,
    agentTracking: true,
    lastContact: '1 day ago',
  },
  {
    id: 'client-004',
    name: 'Cyberdyne',
    nameArabic: 'سايبردين',
    logo: 'C',
    trustScore: 88,
    platform: 'telegram',
    language: 'english',
    avgPaymentDays: 7,
    totalRevenue: 5400.00,
    currency: 'USD',
    disputeCount: 0,
    projectsCount: 1,
    agentTracking: true,
    lastContact: '3 hours ago',
  },
  {
    id: 'client-005',
    name: 'Nahda Software',
    nameArabic: 'برمجيات النهضة',
    logo: 'N',
    trustScore: 85,
    platform: 'whatsapp',
    language: 'arabic',
    avgPaymentDays: 12,
    totalRevenue: 8500.00,
    currency: 'EGP',
    disputeCount: 2,
    projectsCount: 2,
    agentTracking: false,
    lastContact: '3 days ago',
  },
  {
    id: 'client-006',
    name: 'Smart Group',
    nameArabic: 'المجموعة الذكية',
    logo: 'SG',
    trustScore: 97,
    platform: 'telegram',
    language: 'arabic',
    avgPaymentDays: 1,
    totalRevenue: 15800,
    currency: 'SAR',
    disputeCount: 0,
    projectsCount: 4,
    agentTracking: true,
    lastContact: '10 min ago',
  },
  {
    id: 'client-007',
    name: 'GlobalTech',
    nameArabic: 'جلوبالتك',
    logo: 'G',
    trustScore: 82,
    platform: 'email',
    language: 'english',
    avgPaymentDays: 15,
    totalRevenue: 0,
    currency: 'USD',
    disputeCount: 0,
    projectsCount: 1,
    agentTracking: true,
    lastContact: '1 week ago',
  },
  {
    id: 'client-008',
    name: 'Nile Solutions',
    nameArabic: 'حلول النيل',
    logo: 'NS',
    trustScore: 90,
    platform: 'whatsapp',
    language: 'bilingual',
    avgPaymentDays: 4,
    totalRevenue: 3200.00,
    currency: 'EGP',
    disputeCount: 0,
    projectsCount: 1,
    agentTracking: true,
    lastContact: '1 day ago',
  },
];

// Invoices with Lifecycle
export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  clientArabic: string;
  amount: number;
  currency: string;
  stage: 1 | 2 | 3 | 4;
  createdDate: string;
  dueDate: string;
  items: { description: string; amount: number }[];
}

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    client: 'Tech-Sprint',
    clientArabic: 'التقنية السريعة',
    amount: 12450.00,
    currency: 'SAR',
    stage: 4,
    createdDate: '2024-11-01',
    dueDate: '2024-11-15',
    items: [{ description: 'UI/UX Design Sprint', amount: 12450.00 }],
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-002',
    client: 'Nahda Software',
    clientArabic: 'برمجيات النهضة',
    amount: 8500.00,
    currency: 'EGP',
    stage: 3,
    createdDate: '2024-11-05',
    dueDate: '2024-11-20',
    items: [{ description: 'API Development', amount: 8500.00 }],
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-003',
    client: 'Hyperrise',
    clientArabic: 'هايبردايز',
    amount: 3852.32,
    currency: 'USD',
    stage: 4,
    createdDate: '2024-10-15',
    dueDate: '2024-10-30',
    items: [{ description: 'Backend Migration', amount: 3852.32 }],
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2024-004',
    client: 'Acrocraft',
    clientArabic: 'أكروكرافت',
    amount: 2100.00,
    currency: 'USD',
    stage: 2,
    createdDate: '2024-11-10',
    dueDate: '2024-11-25',
    items: [{ description: 'Design System', amount: 2100.00 }],
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2024-005',
    client: 'Cyberdyne',
    clientArabic: 'سايبردين',
    amount: 5400.00,
    currency: 'USD',
    stage: 3,
    createdDate: '2024-11-01',
    dueDate: '2024-11-30',
    items: [{ description: 'Infrastructure Scaling - Monthly', amount: 5400.00 }],
  },
  {
    id: 'inv-006',
    invoiceNumber: 'INV-2024-006',
    client: 'Smart Group',
    clientArabic: 'المجموعة الذكية',
    amount: 15800.00,
    currency: 'SAR',
    stage: 4,
    createdDate: '2024-10-20',
    dueDate: '2024-11-05',
    items: [{ description: 'Mobile App Development', amount: 15800.00 }],
  },
  {
    id: 'inv-007',
    invoiceNumber: 'INV-2024-007',
    client: 'GlobalTech',
    clientArabic: 'جلوبالتك',
    amount: 1250.00,
    currency: 'USD',
    stage: 1,
    createdDate: '2024-11-12',
    dueDate: '2024-11-30',
    items: [{ description: 'Consulting Services', amount: 1250.00 }],
  },
  {
    id: 'inv-008',
    invoiceNumber: 'INV-2024-008',
    client: 'Nile Solutions',
    clientArabic: 'حلول النيل',
    amount: 3200.00,
    currency: 'EGP',
    stage: 2,
    createdDate: '2024-11-08',
    dueDate: '2024-11-22',
    items: [{ description: 'Payment Integration', amount: 3200.00 }],
  },
  {
    id: 'inv-009',
    invoiceNumber: 'INV-2024-009',
    client: 'Tech-Sprint',
    clientArabic: 'التقنية السريعة',
    amount: 8900.00,
    currency: 'SAR',
    stage: 3,
    createdDate: '2024-11-15',
    dueDate: '2024-11-30',
    items: [{ description: 'Dashboard Development', amount: 8900.00 }],
  },
  {
    id: 'inv-010',
    invoiceNumber: 'INV-2024-010',
    client: 'Smart Group',
    clientArabic: 'المجموعة الذكية',
    amount: 6400.00,
    currency: 'SAR',
    stage: 2,
    createdDate: '2024-11-18',
    dueDate: '2024-12-02',
    items: [{ description: 'API Integration', amount: 6400.00 }],
  },
  {
    id: 'inv-882',
    invoiceNumber: 'INV-2024-882',
    client: 'Acrocraft',
    clientArabic: 'أكروكرافت',
    amount: 1500.00,
    currency: 'USD',
    stage: 1,
    createdDate: '2024-11-25',
    dueDate: '2024-12-10',
    items: [{ description: 'Additional Revisions', amount: 1500.00 }],
  },
  {
    id: 'inv-883',
    invoiceNumber: 'INV-2024-883',
    client: 'GlobalTech',
    clientArabic: 'جلوبالتك',
    amount: 800.00,
    currency: 'USD',
    stage: 1,
    createdDate: '2024-11-26',
    dueDate: '2024-12-15',
    items: [{ description: 'Milestone 1 - Planning', amount: 800.00 }],
  },
];

// Cash Pool Configuration
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

export const defaultCashPool: CashPoolConfig = {
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

// Cashflow Transactions
export interface CashflowEntry {
  id: string;
  date: string;
  description: string;
  type: 'inflow' | 'outflow';
  amount: number;
  currency: string;
  vault: 'tax' | 'expenses' | 'profit';
  category: string;
  reference?: string;
}

export const cashflowTransactions: CashflowEntry[] = [
  { id: 'cf-001', date: '2024-11-15', description: 'Payment from Tech-Sprint', type: 'inflow', amount: 12450.00, currency: 'SAR', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-001' },
  { id: 'cf-002', date: '2024-11-14', description: 'AWS Hosting Fee', type: 'outflow', amount: 450.00, currency: 'USD', vault: 'expenses', category: 'Infrastructure', reference: 'AWS-2024-11' },
  { id: 'cf-003', date: '2024-11-13', description: 'Payment from Cyberdyne', type: 'inflow', amount: 5400.00, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-005' },
  { id: 'cf-004', date: '2024-11-12', description: 'Tax Auto-Allocation', type: 'outflow', amount: 1080.00, currency: 'USD', vault: 'tax', category: 'Tax Reserve', reference: 'TAX-2024-11' },
  { id: 'cf-005', date: '2024-11-11', description: 'Payment from Acrocraft', type: 'inflow', amount: 2100.00, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-004' },
  { id: 'cf-006', date: '2024-11-10', description: 'Software Subscription', type: 'outflow', amount: 79.00, currency: 'USD', vault: 'expenses', category: 'Software', reference: 'SUB-001' },
  { id: 'cf-007', date: '2024-11-09', description: 'Payment from Hyperrise', type: 'inflow', amount: 3852.32, currency: 'USD', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-003' },
  { id: 'cf-008', date: '2024-11-08', description: 'Expense Auto-Allocation', type: 'outflow', amount: 1155.70, currency: 'USD', vault: 'expenses', category: 'Expense Reserve', reference: 'EXP-2024-11' },
  { id: 'cf-009', date: '2024-11-07', description: 'Profit Withdrawal', type: 'outflow', amount: 2500.00, currency: 'USD', vault: 'profit', category: 'Withdrawal', reference: 'WD-001' },
  { id: 'cf-010', date: '2024-11-06', description: 'Payment from Nahda Software', type: 'inflow', amount: 8500.00, currency: 'EGP', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-002' },
  { id: 'cf-011', date: '2024-11-05', description: 'Office Rent', type: 'outflow', amount: 1200.00, currency: 'USD', vault: 'expenses', category: 'Office', reference: 'RENT-2024-11' },
  { id: 'cf-012', date: '2024-11-04', description: 'Payment from Nile Solutions', type: 'inflow', amount: 3200.00, currency: 'EGP', vault: 'profit', category: 'Client Payment', reference: 'INV-2024-006' },
];

// Strategic Advice Feed
export interface Advice {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

export const strategicAdvice: Advice[] = [
  {
    id: 'adv-001',
    title: 'Tax Optimization',
    message: 'Based on your current 30-day burn rate, you should reserve an extra 5% this month for upcoming quarterly taxes.',
    type: 'warning',
    priority: 'high',
    timestamp: '2 hours ago',
  },
  {
    id: 'adv-002',
    title: 'Client Health Alert',
    message: 'Nahda Software payment is 3 days overdue. Tayseer will send a gentle reminder.',
    type: 'warning',
    priority: 'medium',
    timestamp: '5 hours ago',
  },
  {
    id: 'adv-003',
    title: 'Cash Flow Projection',
    message: 'Next 30 days: $18,200 expected. Expenses: $4,800. You\'re in great shape! Consider investing surplus.',
    type: 'success',
    priority: 'low',
    timestamp: '1 day ago',
  },
  {
    id: 'adv-004',
    title: 'Expense Vault Low',
    message: 'Your Expense Vault is at 80% of target. Consider transferring from Profit Vault before next payment cycle.',
    type: 'info',
    priority: 'medium',
    timestamp: '2 days ago',
  },
  {
    id: 'adv-005',
    title: 'Opportunity Detected',
    message: 'Tech-Sprint has a 98% trust score and pays within 2 days. Consider offering them priority pricing.',
    type: 'success',
    priority: 'low',
    timestamp: '3 days ago',
  },
  {
    id: 'adv-006',
    title: 'Currency Risk',
    message: 'EGP has depreciated 3% against USD this month. Consider invoicing Nahda Software in USD.',
    type: 'warning',
    priority: 'high',
    timestamp: '4 days ago',
  },
];

// Pulse Metrics
export interface PulseMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  sublabel: string;
}

export const pulseMetrics: PulseMetric[] = [
  {
    id: 'metric-001',
    label: 'Total Revenue',
    value: '$13,452.32',
    change: '+12.5%',
    trend: 'up',
    sublabel: 'Last 30 days',
  },
  {
    id: 'metric-002',
    label: 'Burn Rate',
    value: '$4,800/mo',
    change: '+3.2%',
    trend: 'up',
    sublabel: 'Avg monthly',
  },
  {
    id: 'metric-003',
    label: 'Agent Efficiency',
    value: '47 hours',
    change: '+23%',
    trend: 'up',
    sublabel: 'Time saved this month',
  },
];

// Helper Functions
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    SAR: 'SAR ',
    EGP: 'EGP ',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || currency + ' ';
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  return symbol + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getStageLabel = (stage: number): string => {
  const stages = ['Generated', 'Received', 'Funded', 'Released'];
  return stages[stage - 1] || 'Unknown';
};

export const getStageLabelArabic = (stage: number): string => {
  const stages = ['تم إنشاؤها', 'تم الاستلام', 'تم التمويل', 'تم الصرف'];
  return stages[stage - 1] || 'غير معروف';
};
