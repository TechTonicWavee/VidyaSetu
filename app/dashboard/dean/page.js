"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Grid,
  Users,
  TrendingUp,
  BookOpen,
  Activity,
  FileText,
  Target,
  Brain,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  AlertTriangle,
  Briefcase,
  ArrowUpRight,
  ExternalLink,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart2,
  CheckCircle2,
  ShieldAlert,
  Zap,
} from "lucide-react";

const navLinks = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard/dean" },
  {
    id: "department",
    label: "Department Overview",
    icon: Grid,
    path: "/dashboard/dean/department",
  },
  {
    id: "faculty",
    label: "Faculty Performance",
    icon: Users,
    path: "/dashboard/dean/faculty-performance",
  },
  {
    id: "forecast",
    label: "Cohort Forecasting",
    icon: TrendingUp,
    path: "/dashboard/dean/forecasting",
  },
  {
    id: "curriculum",
    label: "Curriculum Analysis",
    icon: BookOpen,
    path: "/dashboard/dean/curriculum",
  },
  {
    id: "policy",
    label: "Policy Simulation",
    icon: Activity,
    path: "/dashboard/dean/policy-simulation",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    path: "/dashboard/dean/reports",
  },
  {
    id: "cross",
    label: "Year-wise Insights",
    icon: Target,
    path: "/dashboard/dean/cross-branch",
  },
  {
    id: "intelligence",
    label: "Student Intelligence",
    icon: Brain,
    path: "/dashboard/dean/student-intelligence",
  },
];

const statCards = [
  {
    label: "Total Students",
    value: "480",
    sub: "CSE Department",
    trend: null,
    trendLabel: null,
    icon: Users,
    accent: "#1A56DB",
    bg: "stat-blue",
    progress: null,
  },
  {
    label: "Dept Health Score",
    value: "73",
    sub: "+4 pts from last semester",
    trend: "up",
    trendLabel: "+5.8%",
    icon: Activity,
    accent: "#0F766E",
    bg: "stat-teal",
    progress: 73,
  },
  {
    label: "Placement Readiness",
    value: "61%",
    sub: "Final year batch 2026",
    trend: "up",
    trendLabel: "+8% this quarter",
    icon: Briefcase,
    accent: "#5B21B6",
    bg: "stat-purple",
    progress: 61,
  },
  {
    label: "Active Alerts",
    value: "47",
    sub: "12 critical · 35 medium",
    trend: "down",
    trendLabel: "Needs attention",
    icon: AlertTriangle,
    accent: "#DC2626",
    bg: "stat-red",
    progress: null,
  },
];

const yearData = [
  {
    name: "1st Year",
    code: "CSE-1",
    students: 120,
    health: 81,
    ready: "—",
    alerts: 0,
    healthColor: "#0F766E",
    readyDim: true,
  },
  {
    name: "2nd Year",
    code: "CSE-2",
    students: 120,
    health: 78,
    ready: "62%",
    alerts: 6,
    healthColor: "#0F766E",
    readyDim: false,
  },
  {
    name: "3rd Year",
    code: "CSE-3",
    students: 122,
    health: 74,
    ready: "63%",
    alerts: 7,
    healthColor: "#D97706",
    readyDim: false,
  },
  {
    name: "4th Year",
    code: "CSE-4",
    students: 118,
    health: 72,
    ready: "64%",
    alerts: 5,
    healthColor: "#DC2626",
    readyDim: false,
  },
];

const insights = [
  {
    icon: ShieldAlert,
    category: "At-Risk",
    catCls: "badge-red",
    text: "11 students in OS (2nd Year) are at critical risk — exam scheduled in 3 weeks.",
  },
  {
    icon: BarChart2,
    category: "Attainment",
    catCls: "badge-amber",
    text: "DBMS CO attainment at 71% — below the 75% target across all 3 sections.",
  },
  {
    icon: TrendingUp,
    category: "Placement",
    catCls: "badge-blue",
    text: "4th year placement readiness improved by 8% after the communication workshop.",
  },
  {
    icon: Zap,
    category: "Academic",
    catCls: "badge-green",
    text: "Data Structures shows highest improvement this semester — class avg up 11 points.",
  },
];

function HealthBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar" style={{ width: 64 }}>
        <div
          className="progress-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function TrendPill({ trend, label }) {
  if (!trend) return null;
  const cfg = {
    up: { Icon: ArrowUp, cls: "badge-green" },
    down: { Icon: ArrowDown, cls: "badge-red" },
  }[trend];
  if (!cfg) return null;
  return (
    <span className={`badge ${cfg.cls} mt-2 inline-flex`}>
      <cfg.Icon size={10} />
      {label}
    </span>
  );
}

export default function DeanDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function navigate(link) {
    setActiveNav(link.id);
    router.push(link.path);
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-[232px]" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300`}
      >
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)",
              }}
            >
              VS
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-[13px] text-[#0D1B2A] truncate leading-tight">
                Dr. Vineet Sharma
              </p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">
                Head of Department · CSE
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>
          {navLinks.slice(0, 6).map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link)}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? "active" : ""}`}
            >
              <link.icon
                size={16}
                strokeWidth={activeNav === link.id ? 2.2 : 1.8}
              />
              <span className="flex-1 truncate">{link.label}</span>
            </button>
          ))}
          <p className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Intelligence
          </p>
          {navLinks.slice(6).map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link)}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? "active" : ""}`}
            >
              <link.icon
                size={16}
                strokeWidth={activeNav === link.id ? 2.2 : 1.8}
              />
              <span className="flex-1 truncate">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-gray-100">
          <button
            onClick={() => router.push("/login")}
            className="nav-link w-full text-left"
            style={{ color: "#ef4444" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEF2F2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-5 h-14 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <Settings size={18} strokeWidth={1.8} />
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shadow-sm"
              style={{ background: "#5B21B6" }}
            >
              EA
            </div>
            <span className="font-bold text-[#0D1B2A] text-[13px] tracking-tight hidden sm:block">
              Educator Analytics OS
            </span>
          </div>
          <div className="flex-1 max-w-sm relative ml-2">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search students, reports..."
              className="w-full pl-8 pr-4 py-[7px] text-[13px] rounded-lg border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition"
            />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
            <Bell size={18} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group px-1.5 py-1 rounded-lg hover:bg-gray-100 transition">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
              style={{
                background: "linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)",
              }}
            >
              VS
            </div>
            <ChevronDown
              size={13}
              className="text-gray-400 group-hover:text-gray-600 transition"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Title row */}
          <div className="mb-6 animate-fade-in flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#0D1B2A] tracking-tight">
                Good morning, Dr. Vineet Sharma
              </h1>
              <p className="text-[13px] text-gray-500 mt-0.5">
                CSE Department overview · April 2026
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11.5px] text-gray-500 font-medium shadow-sm">
              <span className="live-dot" />
              Live
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`card ${card.bg} animate-fade-in`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 leading-tight">
                    {card.label}
                  </p>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${card.accent}18` }}
                  >
                    <card.icon size={15} color={card.accent} strokeWidth={2} />
                  </div>
                </div>
                <p
                  className="text-2xl font-bold tracking-tight text-[#0D1B2A] tabular-nums"
                  style={{
                    animation: `countUp 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.06 + 0.1}s both`,
                  }}
                >
                  {card.value}
                </p>
                {card.progress !== null && (
                  <div className="progress-bar mt-2.5 mb-1.5">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${card.progress}%`,
                        background: card.accent,
                        animationDelay: `${i * 0.08 + 0.2}s`,
                      }}
                    />
                  </div>
                )}
                <p className="text-[11.5px] text-gray-500 mt-1.5 leading-snug">
                  {card.sub}
                </p>
                <TrendPill trend={card.trend} label={card.trendLabel} />
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
            {/* Year-wise table - 3/5 */}
            <div
              className="card xl:col-span-3 animate-fade-in"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="font-semibold text-[#0D1B2A] text-[14px]">
                    Year-wise Health — CSE
                  </h2>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">
                    Academic year 2025–26
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/dean/cross-branch")}
                  className="flex items-center gap-1 text-[12px] text-purple-600 font-semibold hover:text-purple-800 transition"
                >
                  Full View <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="divider-h my-4" />

              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="pb-3">Year</th>
                    <th className="pb-3 text-right">Students</th>
                    <th className="pb-3 pl-3">Health</th>
                    <th className="pb-3 text-center">Ready</th>
                    <th className="pb-3 text-right">Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {yearData.map((row, i) => (
                    <tr key={i} className="table-row-hover">
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-[13px] text-[#0D1B2A]">
                          {row.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{row.code}</p>
                      </td>
                      <td className="py-3 text-right text-[13px] text-gray-600 tabular-nums">
                        {row.students}
                      </td>
                      <td className="py-3 pl-3">
                        <HealthBar value={row.health} color={row.healthColor} />
                      </td>
                      <td className="py-3 text-center text-[12px] font-semibold text-gray-600">
                        {row.ready}
                      </td>
                      <td className="py-3 text-right">
                        {row.alerts > 0 ? (
                          <span className="badge badge-red">{row.alerts}</span>
                        ) : (
                          <span className="badge badge-green">
                            <CheckCircle2 size={10} /> None
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-5 text-[11.5px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />{" "}
                  Good ≥78
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />{" "}
                  Fair 72–77
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />{" "}
                  At-Risk &lt;72
                </span>
              </div>
            </div>

            {/* Insights - 2/5 */}
            <div
              className="card xl:col-span-2 animate-fade-in flex flex-col"
              style={{ animationDelay: "0.34s" }}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="font-semibold text-[#0D1B2A] text-[14px]">
                    Weekly Insights
                  </h2>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">
                    Week of Apr 14, 2026
                  </p>
                </div>
                <Star size={15} className="text-amber-400" />
              </div>

              <div className="divider-h my-4" />

              <div className="space-y-2.5 flex-1">
                {insights.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition animate-fade-in"
                    style={{ animationDelay: `${0.38 + i * 0.07}s` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#5B21B610" }}
                    >
                      <item.icon size={15} color="#5B21B6" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`badge ${item.catCls} mb-1.5`}>
                        {item.category}
                      </span>
                      <p className="text-[12.5px] text-gray-600 leading-snug">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => router.push("/dashboard/dean/reports")}
                  className="w-full text-center text-[12.5px] text-purple-600 font-semibold hover:text-purple-800 transition flex items-center justify-center gap-1.5"
                >
                  View Full Report <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
