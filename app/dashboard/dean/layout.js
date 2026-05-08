'use client';

import { DeanProvider } from './_context/DeanContext';
import DeanSidebar from '@/components/dean/DeanSidebar';

export default function DeanLayout({ children }) {
  return (
    <DeanProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Unified Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-sm">
          {/* Profile Card */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)' }}>
                VS
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">Dr. Vineet Sharma</p>
                <p className="text-xs text-gray-500 mt-0.5">Dean of Academics</p>
                <p className="text-xs text-gray-400 mt-1">CSE Department</p>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Dean Portal</p>
            
            {/* Dean Navigation */}
            <div className="space-y-1">
              <a href="/dashboard/dean" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-lg group-hover:scale-110 transition">📊</span>
                <span className="font-medium">Overview</span>
              </a>
              <a href="/dashboard/dean/meetings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-lg group-hover:scale-110 transition">📅</span>
                <span className="font-medium">Meetings</span>
              </a>
              <a href="/dashboard/dean/schedule" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-lg group-hover:scale-110 transition">🗓️</span>
                <span className="font-medium">Schedule</span>
              </a>
              <a href="/dashboard/dean/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group relative">
                <span className="text-lg group-hover:scale-110 transition">🔔</span>
                <span className="font-medium">Notifications</span>
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </a>
              <a href="/dashboard/dean/agent" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition group">
                <span className="text-lg group-hover:scale-110 transition">🤖</span>
                <span className="font-medium">AI Agent</span>
              </a>
            </div>

            {/* Secondary Navigation */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="px-3 pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Department</p>
              <div className="space-y-1">
                <a href="/dashboard/dean/department" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>📋</span>
                  <span>Department Overview</span>
                </a>
                <a href="/dashboard/dean/faculty-performance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>👥</span>
                  <span>Faculty Performance</span>
                </a>
                <a href="/dashboard/dean/forecasting" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>📈</span>
                  <span>Cohort Forecasting</span>
                </a>
                <a href="/dashboard/dean/curriculum" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>📚</span>
                  <span>Curriculum Analysis</span>
                </a>
                <a href="/dashboard/dean/policy-simulation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>⚙️</span>
                  <span>Policy Simulation</span>
                </a>
                <a href="/dashboard/dean/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>📄</span>
                  <span>Reports</span>
                </a>
                <a href="/dashboard/dean/cross-branch" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>🎯</span>
                  <span>Year-wise Insights</span>
                </a>
                <a href="/dashboard/dean/student-intelligence" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition">
                  <span>🧠</span>
                  <span>Student Intelligence</span>
                </a>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-gray-100">
            <a href="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium">
              <span>🚪</span>
              <span>Switch Role</span>
            </a>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {children}
          </div>
        </main>
      </div>
    </DeanProvider>
  );
}
