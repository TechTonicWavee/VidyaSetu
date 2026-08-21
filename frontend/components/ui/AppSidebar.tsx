'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthProvider';

import type { NavGroup } from './AppShell';

export function AppSidebar({
  navGroups,
  mobileOpen,
  onCloseMobile,
}: {
  navGroups: NavGroup[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const { logout, student } = useAuth();

  const isActive = (path: string) => {
    if (path === '/student' || path === '/faculty' || path === '/admin' || path === '/dean' || path === '/parent') {
      return pathname === path;
    }
    return pathname === path || pathname?.startsWith(path + '/');
  };

  // State to track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  // Initialize expanded state based on active path
  useEffect(() => {
    const initialState: Record<number, boolean> = {};
    navGroups.forEach((group, idx) => {
      const hasActive = group.items.some(item => isActive(item.href));
      initialState[idx] = hasActive || idx === 0; // expand if active or first item
    });
    setExpandedGroups(initialState);
  }, [navGroups, pathname]);

  const toggleGroup = (idx: number) => {
    setExpandedGroups(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'z-50 flex flex-col h-screen text-content shrink-0 bg-surface border-r border-line shadow-sm',
          'transition-transform duration-300 ease-in-out',
          'fixed inset-y-0 left-0 lg:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ width: 280 }}
      >
        {/* Brand Header */}
        <div className="flex flex-col gap-1.5 py-6 px-6 shrink-0 border-b border-transparent">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-serif font-bold text-content tracking-tight">Vidya</span>
            <span className="text-2xl font-serif font-bold text-brand tracking-tight">Setu</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 relative">
          {navGroups.map((group, idx) => {
            const isExpanded = expandedGroups[idx];
            
            return (
              <div key={idx} className="flex flex-col mb-1">
                {/* Group Heading (Accordion Trigger) */}
                {group.heading && (
                  <button 
                    onClick={() => toggleGroup(idx)}
                    className="flex items-center justify-between w-full px-3 py-2 text-left group"
                  >
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted group-hover:text-content transition-colors">
                      {group.heading}
                    </span>
                    <span className="text-muted group-hover:text-content transition-colors">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  </button>
                )}
                
                {/* Expandable Group Items */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-[1000px] opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"
                )}>
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onCloseMobile}
                        className={cn(
                          'group relative w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-medium transition-all duration-200',
                          active 
                            ? 'bg-brand/10 text-brand font-semibold shadow-sm ring-1 ring-brand/20' 
                            : 'text-content-2 hover:bg-surface-2 hover:text-content hover:translate-x-1',
                        )}
                      >
                        <span className={cn('relative shrink-0 transition-colors', active ? 'text-brand' : 'text-muted group-hover:text-content')}>
                          {Icon && <Icon size={18} strokeWidth={active ? 2.5 : 2} />}
                        </span>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand ring-1 ring-brand/20">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-line p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-muted hover:text-danger hover:bg-danger-soft transition-all duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
