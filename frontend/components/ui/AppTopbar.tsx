'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import getInitials from '@/lib/getInitials';

export function AppTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { student, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
        
        <Link href="/" className="group hidden lg:flex items-center gap-2">
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-content to-content-2 group-hover:to-brand transition-all duration-300">
            VidyaSetu
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative z-10">
        {/* Advanced Search */}
        <div className={cn(
          "hidden md:flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 mr-2",
          isSearchFocused 
            ? "bg-surface border-brand/40 shadow-[0_0_0_2px_rgba(var(--color-brand),0.1)] w-64" 
            : "bg-surface-2 border-transparent hover:bg-surface-3 w-56"
        )}>
          <Search size={16} className={cn("transition-colors", isSearchFocused ? "text-brand" : "text-muted")} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full text-content placeholder:text-muted"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-content-2 hover:text-brand hover:bg-brand/5 transition-all duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} className="stroke-[1.5]" /> : <Moon size={20} className="stroke-[1.5]" />}
          </button>

          <button className="relative p-2.5 rounded-full text-content-2 hover:text-brand hover:bg-brand/5 transition-all duration-200 group">
            <Bell size={20} className="stroke-[1.5] group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-surface animate-pulse" />
          </button>
        </div>

        <div className="h-6 w-px bg-line/50 mx-1 hidden sm:block" />

        {/* Profile menu */}
        <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface-2 border border-transparent hover:border-line transition-all duration-300 group">
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
