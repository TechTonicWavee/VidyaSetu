"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FACULTY_PROFILE } from "../../../lib/faculty/mock-data";
import {
  Home,
  BookOpen,
  Bell,
  BarChart2,
  Users,
  CheckCircle,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Target,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
  User,
  Activity,
  Award,
  Grid,
  Zap,
  AlertCircle,
  Plug,
  Menu,
  Brain,
} from "lucide-react";

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageCircle, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
];

const statCards = [
  {
    label: "My Students",
    value: "243",
    sub: "Across 4 subjects",
    subColor: "text-indigo-600",
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "#4338CA",
    accent: "stat-indigo",
    border: "border-l-4 border-l-indigo-500",
  },
  {
    label: "Active Alerts",
    value: "5",
    sub: "3 high priority",
    subColor: "text-red-600",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "#DC2626",
    accent: "stat-amber", // Reusing amber style but keeping red icon
    border: "border-l-4 border-l-red-500",
  },
  {
    label: "Avg Class SPI",
    value: "67",
    sub: "+2 from last month",
    subColor: "text-indigo-600",
    icon: TrendingUp,
    iconBg: "bg-indigo-100",
    iconColor: "#4338CA",
    accent: "stat-indigo",
    border: "border-l-4 border-l-indigo-500",
  },
  {
    label: "CO Attainment",
    value: "74%",
    sub: "Target is 75%",
    subColor: "text-amber-600",
    icon: Target,
    iconBg: "bg-amber-100",
    iconColor: "#D97706",
    accent: "stat-amber",
    border: "border-l-4 border-l-amber-500",
  },
];

const studentsNeedingAttention = [
  {
    name: "Rohit Sharma",
    roll: "2CS47",
    subject: "DBMS",
    issue: "Score dropped 28%",
    severity: "HIGH",
  },
  {
    name: "Sneha Patel",
    roll: "2CS23",
    subject: "OS",
    issue: "Attendance 71%",
    severity: "HIGH",
  },
  {
    name: "Arjun Mehta",
    roll: "2CS09",
    subject: "TOC",
    issue: "3 assignments missed",
    severity: "HIGH",
  },
  {
    name: "Divya Nair",
    roll: "2CS31",
    subject: "DBMS",
    issue: "Consistent decline",
    severity: "MEDIUM",
  },
  {
    name: "Karan Joshi",
    roll: "2CS15",
    subject: "OS",
    issue: "Score dropped 15%",
    severity: "MEDIUM",
  },
];

const subjectHealth = [
  { name: "DBMS", avg: 64, co: 71, risk: 8 },
  { name: "Operating Systems", avg: 58, co: 67, risk: 11 },
  { name: "Theory of Computation", avg: 61, co: 69, risk: 7 },
  { name: "Data Structures", avg: 72, co: 81, risk: 3 },
];

export default function FacultyDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}
      >
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #4338CA, #7C3AED)",
              }}
            >
              {FACULTY_PROFILE.initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">
                {FACULTY_PROFILE.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.external) {
                  window.open(link.external, "_blank");
                  return;
                }
                if (link.path) {
                  router.push(link.path);
                } else {
                  if (typeof setActiveNav === "function") setActiveNav(link.id);
                }
              }}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id && !link.external ? "bg-indigo-50 text-indigo-700 font-semibold" : ""}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.badge === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-500 text-white'}`}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button
            onClick={() => router.push("/login")}
            className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "#4338CA" }}
            >
              EA
            </div>
            <span className="font-bold text-navy text-sm hidden sm:block">
              Educator Analytics OS
            </span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search students, subjects, features..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
            />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Bell size={19} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: "linear-gradient(135deg, #4338CA, #7C3AED)",
              }}
            >
              {FACULTY_PROFILE.initials}
            </div>
            <ChevronDown
              size={14}
              className="text-gray-400 group-hover:text-gray-600 transition"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">
              Good morning, {FACULTY_PROFILE.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Friday, 9 May 2026 — You have 2 classes today
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`card ${card.accent} ${card.border} animate-fade-in`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}
                  >
                    <card.icon size={16} color={card.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-navy mb-1">
                  {card.value}
                </p>
                <p className={`text-xs font-medium ${card.subColor}`}>
                  {card.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Students Needing Attention */}
            <div
              className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-navy text-base">
                  Students Needing Attention
                </h2>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Priority List
                </span>
              </div>
              <div className="space-y-3">
                {studentsNeedingAttention.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:border-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${s.severity === "HIGH" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`}
                      />
                      <div>
                        <p className="text-sm font-bold text-navy">
                          {s.name}{" "}
                          <span className="text-gray-400 font-normal text-xs">
                            · {s.roll}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {s.subject} · {s.issue}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        router.push("/dashboard/faculty/student/profile")
                      }
                      className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/dashboard/faculty/alerts")}
                className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-navy transition border-t border-gray-50 pt-4 uppercase tracking-widest"
              >
                View All Alerts
              </button>
            </div>

            {/* Subject Performance */}
            <div
              className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-navy text-base">
                  Subject Performance
                </h2>
                <TrendingUp size={16} className="text-indigo-500" />
              </div>
              <div className="space-y-5">
                {subjectHealth.map((sub, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer group"
                    onClick={() => router.push("/dashboard/faculty/analytics")}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-navy group-hover:text-indigo-600 transition-colors">
                        {sub.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {sub.avg}% Avg
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ${sub.avg >= 75 ? "bg-green-500" : sub.avg >= 60 ? "bg-yellow-400" : sub.avg >= 45 ? "bg-blue-500" : "bg-red-500"}`}
                        style={{ width: `${sub.avg}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex gap-3">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                          CO Attainment:{" "}
                          <span className="text-navy">{sub.co}%</span>
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-tight ${sub.risk > 10 ? "text-red-500" : "text-gray-400"}`}
                      >
                        {sub.risk} Students at Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Moodle & Cyber Vidya Sync Section */}
          <div
            className="mt-8 card rounded-2xl shadow-sm border border-gray-100 animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-navy text-base">
                Moodle & Cyber Vidya Sync
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                  Systems Live
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Moodle Column */}
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex gap-4">
                <div className="w-12 h-12 bg-[#f98012] flex items-center justify-center rounded-xl text-white font-black text-xl flex-shrink-0 shadow-sm">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-navy text-sm">
                      Moodle LMS — Connected
                    </h3>
                    <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-orange-200 text-orange-600 uppercase">
                      Syncing
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-orange-500" /> 11
                      assignments across 4 subjects
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-orange-500" /> 2
                      pending submissions flagged
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-orange-500" /> 3
                      new grades posted today
                    </li>
                  </ul>
                  <button onClick={() => window.open('http://lms.kiet.edu/moodle/', '_blank')} className="mt-4 text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    Open Moodle LMS <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Cyber Vidya Column */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                <div className="w-12 h-12 bg-indigo-600 flex items-center justify-center rounded-xl text-white font-black text-xl flex-shrink-0 shadow-sm">
                  CV
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-navy text-sm">
                      Cyber Vidya — Connected
                    </h3>
                    <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-600 uppercase">
                      Syncing
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-indigo-500" /> 4
                      subjects tracked
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-indigo-500" /> 1
                      student below 75% attendance
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle size={12} className="text-indigo-500" />{" "}
                      Today's classes: 2 marked, 1 pending
                    </li>
                  </ul>
                  <button onClick={() => window.open('https://kiet.cybervidya.net', '_blank')} className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    Open Cyber Vidya <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
