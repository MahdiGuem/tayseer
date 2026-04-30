'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils/cn';
import { NAV_ITEMS } from '@/src/lib/constants/routes';
import { getProjects } from '@/app/actions/project';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    getProjects()
      .then((projects: any[]) => {
        const count = projects.reduce((sum, p) => {
          const unread = p.messages?.filter((m: any) => m.senderRole === 'CLIENT').length || 0
          return sum + unread
        }, 0)
        setTotalUnread(count)
      })
      .catch(() => {})
  }, [])

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <aside
      className={cn(
        'fixed lg:static inset-y-14 lg:inset-y-0 left-0 z-30 w-60 bg-black border-r border-white/5 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <nav className="p-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showBadge = item.id === 'discussions' && totalUnread > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all',
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </div>
              {showBadge && (
                <span className="h-5 min-w-[20px] px-1.5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}