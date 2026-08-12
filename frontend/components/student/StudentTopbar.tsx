'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, Settings, LogOut, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useNotifications } from '@/lib/notifications/NotificationsProvider';
import { formatRelativeTime } from '@/lib/format/relativeTime';
import getInitials from '@/lib/getInitials';

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  return ref;
}

export default function StudentTopbar({ title, onOpenMobile }: { title: string; onOpenMobile: () => void }) {
  const router = useRouter();
  const { student, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, recent, markAllRead } = useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifRef = useOutsideClose(() => setNotifOpen(false));
  const menuRef = useOutsideClose(() => setMenuOpen(false));

  const role = [student?.branch || 'CSE', student?.year ? `Year ${student.year}` : null, student?.section ? `Sec ${student.section}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-surface/80 backdrop-blur-md border-b border-line">
      <button
        onClick={onOpenMobile}
        className="lg:hidden p-2 -ml-2 rounded-lg text-content-2 hover:bg-surface-2"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-bold text-content tracking-tight truncate">{title}</h1>

      {/* Search (stub for now) */}
      <div className="hidden md:flex items-center ml-4 flex-1 max-w-sm">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            className="w-full bg-surface-2 border border-line rounded-xl pl-9 pr-3 py-2 text-sm text-content placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-content-2 hover:bg-surface-2 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-lg text-content-2 hover:bg-surface-2 transition-colors"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-line rounded-2xl shadow-card-hover overflow-hidden animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                <p className="font-semibold text-content text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1">
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {recent.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-muted">You&apos;re all caught up.</p>
                ) : (
                  recent.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className={cn('px-4 py-3 border-b border-line last:border-0 hover:bg-surface-2 transition-colors', !n.read && 'bg-brand-soft/40')}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-brand flex-shrink-0" />}
                        <div className={cn('min-w-0', n.read && 'pl-4')}>
                          <p className="text-sm font-medium text-content truncate">{n.title}</p>
                          {n.body && <p className="text-xs text-muted line-clamp-2">{n.body}</p>}
                          <p className="text-[11px] text-muted mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setNotifOpen(false);
                  router.push('/student/notifications');
                }}
                className="w-full px-4 py-3 text-sm font-medium text-brand hover:bg-surface-2 border-t border-line"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl hover:bg-surface-2 transition-colors"
            aria-label="Account menu"
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-700 text-white flex items-center justify-center text-xs font-bold">
              {getInitials(student?.name ?? 'S')}
            </span>
            <ChevronDown size={15} className="text-muted hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-line rounded-2xl shadow-card-hover overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-line">
                <p className="text-sm font-semibold text-content truncate">{student?.name}</p>
                <p className="text-xs text-muted truncate">{role}</p>
              </div>
              <div className="py-1">
                <MenuItem icon={User} label="My Profile" onClick={() => { setMenuOpen(false); router.push('/student/profile'); }} />
                <MenuItem icon={Settings} label="Edit Profile" onClick={() => { setMenuOpen(false); router.push('/student/profile/edit'); }} />
              </div>
              <div className="py-1 border-t border-line">
                <MenuItem icon={LogOut} label="Log out" danger onClick={logout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: typeof User; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors',
        danger ? 'text-danger hover:bg-danger-soft' : 'text-content-2 hover:bg-surface-2',
      )}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
