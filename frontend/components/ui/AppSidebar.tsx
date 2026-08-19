'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, LogOut } from 'lucide-react';
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
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/student' || path === '/faculty' || path === '/admin' || path === '/dean' || path === '/parent') {
      return pathname === path;
    }
    return pathname === path || pathname?.startsWith(path + '/');
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
        style={{ width: 270 }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-line shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-sm text-white">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[16px] leading-none tracking-tight">VidyaSetu</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col">
              {group.heading && (
                <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">
                  {group.heading}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        'group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200',
                        active 
                          ? 'bg-brand-soft text-brand font-semibold shadow-sm' 
                          : 'text-content-2 hover:bg-surface-2 hover:text-content hover:translate-x-1',
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-brand shadow-sm" />
                      )}
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
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-line p-4 space-y-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-muted hover:text-danger hover:bg-danger-soft transition-all duration-200"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
