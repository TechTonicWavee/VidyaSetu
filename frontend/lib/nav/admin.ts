import { Home, Settings, Target, Grid, Activity, ShieldCheck, Database, Terminal, Users } from 'lucide-react';

export const ADMIN_NAV = [
  { id: 'dashboard',   label: 'Dashboard',          icon: Home,      href: '/admin' },
  { id: 'config',      label: 'Configuration',      icon: Settings,  href: '/admin/configuration' },
  { id: 'spi-config',  label: 'SPI Weight Config',  icon: Target,    href: '/admin/spi-config' },
  { id: 'institution', label: 'Institution Settings',icon: Grid,    href: '/admin/institution' },
  { id: 'users',       label: 'User Management',    icon: Users,     href: '/admin/users' },
  { id: 'health',      label: 'System Health',      icon: ShieldCheck,href: '/admin/health' },
  { id: 'logs',        label: 'System Logs',        icon: Activity,  href: '/admin/logs' },
  { id: 'db',          label: 'Database',           icon: Database,  href: '/admin/database' },
  { id: 'terminal',    label: 'Diagnostics',        icon: Terminal,  href: '/admin/diagnostics' },
];
