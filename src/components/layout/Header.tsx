'use client';

import { Search, Bell, LayoutGrid, Zap } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/80 border-b border-white/5 backdrop-blur-xl h-14 flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          <LayoutGrid size={20} />
        </button>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gradient-to-br from-emerald-400 to-emerald-600 w-6 h-6 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] items-center justify-center">
            <Zap size={14} className="text-black fill-black" />
          </div>
          <span className="text-sm font-semibold text-slate-100">Tayseer</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
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
  );
}
