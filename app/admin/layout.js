'use client';

import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import { Home, Settings, Target, Grid, Activity, ShieldCheck, Database, Terminal, Users } from 'lucide-react';

const ADMIN_NAV = [
  { id: 'dashboard',   label: 'Dashboard',             icon: Home,        path: '/admin' },
  { id: 'config',      label: 'Configuration',         icon: Settings,    path: '/admin/configuration' },
  { id: 'spi-config',  label: 'SPI Weight Config',     icon: Target,      path: '/admin/spi-config' },
  { id: 'institution', label: 'Institution Settings',  icon: Grid,        path: '/admin/institution' },
  { id: 'users',       label: 'User Management',       icon: Users,       path: '/admin/configuration' },
  { id: 'health',      label: 'System Health',         icon: ShieldCheck, path: '/admin/configuration' },
  { id: 'logs',        label: 'System Logs',           icon: Activity,    path: '/admin/configuration' },
  { id: 'db',          label: 'Database',              icon: Database,    path: '/admin/configuration' },
  { id: 'terminal',    label: 'Diagnostics',           icon: Terminal,    path: '/admin/configuration' },
];

const ADMIN_THEME = {
  bg: '#000000',
  borderColor: 'rgba(255,255,255,0.07)',
  activeBg: 'rgba(255,255,255,0.1)',
  activeText: '#f1f5f9',
  activeIcon: '#e2e8f0',
  iconColor: 'rgba(226,232,240,0.45)',
  textColor: 'rgba(226,232,240,0.7)',
  hoverBg: 'rgba(255,255,255,0.06)',
  accentGradient: 'linear-gradient(135deg,#475569,#1e293b)',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CollapsibleSidebar
        navLinks={ADMIN_NAV}
        userInfo={{ initials: 'AD', name: 'Admin · System', role: 'Educator Analytics OS' }}
        theme={ADMIN_THEME}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}

