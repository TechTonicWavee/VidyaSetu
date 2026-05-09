'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDeanContext } from '@/app/dashboard/dean/_context/DeanContext';
import { LayoutDashboard, Users, Calendar, Bell, Bot } from 'lucide-react';

export default function DeanSidebar() {
  const pathname = usePathname();
  const { unreadCount } = useDeanContext();

  const links = [
    { id: 'overview', label: 'Overview', href: '/dashboard/dean', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'meetings', label: 'Meetings', href: '/dashboard/dean/meetings', icon: <Users className="w-5 h-5" /> },
    { id: 'schedule', label: 'Schedule', href: '/dashboard/dean/schedule', icon: <Calendar className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', href: '/dashboard/dean/notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'agent', label: 'AI Agent', href: '/dashboard/dean/agent', icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen sticky top-0 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Dean</h2>
        <p className="text-xs text-gray-500 mt-1">Dashboard</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.id}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center">{link.icon}</span>
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
