'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import getInitials from '@/lib/getInitials';

export function AppTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { student, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const initials = student?.name ? getInitials(student.name) : 'S';

  return (
    <header 
      className={cn(
        "flex-shrink-0 sticky top-0 z-30 h-[72px] flex items-center justify-between px-4 sm:px-8 transition-all duration-300",
        scrolled 
          ? "bg-surface/70 backdrop-blur-xl border-b border-line/40 shadow-sm" 
          : "bg-surface/40 backdrop-blur-md border-b border-transparent"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-50" />

      <div className="flex items-center gap-4 lg:gap-6 relative z-10">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2.5 -ml-2 rounded-xl text-content-2 hover:text-brand hover:bg-brand/5 transition-all duration-200"
          aria-label="Open navigation menu"
        >
          <Menu size={22} className="stroke-[1.5]" />
        </button>
        
        <Link href="/" className="group flex lg:hidden items-center gap-2">
          <span className="text-xl font-serif font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-content to-content-2 group-hover:to-brand transition-all duration-300">
            VidyaSetu
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative z-10">

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-content-2 hover:text-brand hover:bg-brand/5 transition-all duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} className="stroke-[1.5]" /> : <Moon size={20} className="stroke-[1.5]" />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "relative p-2.5 rounded-full transition-all duration-200 group",
                showNotifications ? "bg-surface-2 text-brand" : "text-content-2 hover:text-brand hover:bg-brand/5"
              )}
            >
              <Bell size={20} className="stroke-[1.5] group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-surface animate-pulse" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-line rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-line flex items-center justify-between">
                    <h3 className="font-semibold text-content text-sm">Notifications</h3>
                    <span className="text-xs text-brand font-medium cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* Mock notification 1 */}
                    <div className="p-4 border-b border-line/50 hover:bg-surface-2 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content leading-tight">Your SPI score improved by 5% this week!</p>
                          <p className="text-xs text-muted mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    {/* Mock notification 2 */}
                    <div className="p-4 hover:bg-surface-2 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content leading-tight">New internship opportunity posted by Google.</p>
                          <p className="text-xs text-muted mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-line bg-surface-2 text-center">
                    <button className="text-xs font-semibold text-brand hover:text-brand-700 transition-colors">View all notifications</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="h-6 w-px bg-line/50 mx-1 hidden sm:block" />

        {/* Profile menu */}
        <button 
          onClick={() => window.location.href = '/student/profile'}
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface-2 border border-transparent hover:border-line transition-all duration-300 group"
        >
          <div className="relative">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-soft to-surface-3 border border-line text-brand flex items-center justify-center text-sm font-bold shadow-sm group-hover:shadow transition-all">
              {initials}
            </span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-surface" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-content leading-tight group-hover:text-brand transition-colors">{student?.name || 'Student'}</span>
            <span className="text-[11px] text-muted font-medium mt-0.5">View Profile</span>
          </div>
          <ChevronDown size={16} className="text-muted hidden sm:block group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}
