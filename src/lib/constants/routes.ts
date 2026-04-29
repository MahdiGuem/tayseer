import type { ViewType } from '@/src/types';
import {
  Home,
  FileText,
  Users,
  Wallet,
  DollarSign,
  Clock,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Home, href: '/overview' },
  { id: 'projects', label: 'Projects', icon: FileText, href: '/projects' },
  { id: 'clients', label: 'Clients', icon: Users, href: '/clients' },
  { id: 'invoices', label: 'Invoices', icon: Wallet, href: '/invoices' },
  { id: 'cashflow', label: 'Cash Flow', icon: DollarSign, href: '/cashflow' },
  { id: 'activity', label: 'Activity', icon: Clock, href: '/activity' },
];
