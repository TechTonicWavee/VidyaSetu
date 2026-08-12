'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GraduationCap, ChevronLeft, LogOut, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthProvider';
import getInitials from '@/lib/getInitials';

export interface StudentNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badgeKey?: 'notifications';
}

export interface StudentNavGroup {
  heading: string;
  items: StudentNavItem[];
}

const COLLAPSE_KEY = 'vs_student_sidebar_collapsed';

export default function StudentSidebar({
  groups,
  unreadCount = 0,
  mobileOpen,
  onCloseMobile,
}: {
  groups: StudentNavGroup[];
  unreadCount?: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { student, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
  }, []);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === '/student') return pathname === '/student';
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const go = (path: string) => {
    router.push(path);
    onCloseMobile();
  };

  // On mobile the drawer is always full-width (never collapsed).
  const isCollapsed = collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'z-50 flex flex-col h-screen text-white shrink-0',
          'transition-all duration-300',
          'fixed inset-y-0 left-0 lg:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{
          width: isCollapsed ? 76 : 260,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-4 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg">
            <GraduationCap size={20} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-bold text-[15px] leading-none tracking-tight">VidyaSetu</p>
              <p className="text-[11px] text-white/50 mt-1">Student Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-4">
          {groups.map((group) => (
            <div key={group.heading}>
              {!isCollapsed && (
                <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  {group.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  const badge = item.badgeKey === 'notifications' && unreadCount > 0 ? unreadCount : 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.path)}
                      title={isCollapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                        active ? 'bg-white/10 text-white' : 'text-white/65 hover:text-white hover:bg-white/5',
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-brand" />
                      )}
                      <span className="relative flex-shrink-0">
                        <Icon size={18} className={active ? 'text-brand' : ''} />
                        {isCollapsed && badge > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-danger" />
                        )}
                      </span>
                      {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                      {!isCollapsed && badge > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger text-white">
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: user + collapse */}
        <div className="border-t p-2.5 space-y-1" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className={cn('flex items-center gap-3 rounded-xl px-2 py-2', !isCollapsed && 'bg-white/5')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {getInitials(student?.name ?? 'Student')}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold truncate">{student?.name ?? 'Student'}</p>
                <p className="text-[11px] text-white/45 truncate">{student?.universityId ?? ''}</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            title={isCollapsed ? 'Log out' : undefined}
            aria-label="Log out"
            className="w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>

          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft size={18} className={cn('flex-shrink-0 transition-transform', isCollapsed && 'rotate-180')} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
