import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

export interface NavGroup {
  heading?: string;
  items: {
    id: string;
    href: string;
    label: string;
    icon?: React.ElementType;
    badge?: number | string;
  }[];
}

export function AppShell({
  children,
  navGroups,
  showSidebar = false,
}: {
  children: React.ReactNode;
  navGroups: NavGroup[];
  showSidebar?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans text-content">
      {showSidebar && (
        <AppSidebar
          navGroups={navGroups}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AppTopbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-bg">
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
