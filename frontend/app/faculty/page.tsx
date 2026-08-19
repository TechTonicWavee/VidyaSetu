"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FACULTY_PROFILE } from "../../lib/faculty/mock-data";
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
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageCircle, badge: null,  path: '/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
];

const statCards = [
  { label: "My Students", value: "243", sub: "Across 4 subjects", icon: Users, tone: 'brand' as const },
  { label: "Active Alerts", value: "5", sub: "3 high priority", icon: AlertTriangle, tone: 'danger' as const },
  { label: "Avg Class SPI", value: "67", sub: "+2 from last month", icon: TrendingUp, tone: 'blue' as const },
  { label: "CO Attainment", value: "74%", sub: "Target is 75%", icon: Target, tone: 'amber' as const },
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

import { PageHeader, StatCard, Card, Badge } from "@/components/ui";

export default function FacultyDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${FACULTY_PROFILE.name}`}
        description="Friday, 9 May 2026 — You have 2 classes today"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, i) => (
          <StatCard
            key={i}
            label={card.label}
            value={card.value}
            hint={card.sub}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Students Needing Attention */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-content">
              Students Needing Attention
            </h3>
            <Badge tone="red">Priority List</Badge>
          </div>
          <div className="space-y-3">
            {studentsNeedingAttention.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface-2 hover:border-brand-soft transition-colors group cursor-pointer"
                onClick={() => router.push("/faculty/student/profile")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${s.severity === "HIGH" ? "bg-danger" : "bg-warning"}`}
                  />
                  <div>
                    <p className="text-sm font-bold text-content">
                      {s.name}{" "}
                      <span className="text-muted font-normal text-xs">
                        · {s.roll}
                      </span>
                    </p>
                    <p className="text-xs text-muted">
                      {s.subject} · {s.issue}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/faculty/alerts")}
            className="w-full mt-4 py-2 text-xs font-bold text-muted hover:text-content transition border-t border-line pt-4 uppercase tracking-widest"
          >
            View All Alerts
          </button>
        </Card>

        {/* Subject Performance */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-content">
              Subject Performance
            </h3>
            <TrendingUp size={16} className="text-brand" />
          </div>
          <div className="space-y-5">
            {subjectHealth.map((sub, idx) => (
              <div
                key={idx}
                className="cursor-pointer group"
                onClick={() => router.push("/faculty/analytics")}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-content group-hover:text-brand transition-colors">
                    {sub.name}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {sub.avg}% Avg
                  </span>
                </div>
                <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${sub.avg >= 75 ? "bg-success" : sub.avg >= 60 ? "bg-warning" : sub.avg >= 45 ? "bg-info" : "bg-danger"}`}
                    style={{ width: `${sub.avg}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex gap-3">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-tight">
                      CO Attainment:{" "}
                      <span className="text-content">{sub.co}%</span>
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tight ${sub.risk > 10 ? "text-danger" : "text-muted"}`}
                  >
                    {sub.risk} Students at Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Moodle & Cyber Vidya Sync Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-content">
            Moodle & Cyber Vidya Sync
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-xs font-bold text-success uppercase tracking-widest">
              Systems Live
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moodle Column */}
          <div className="p-5 rounded-2xl bg-warning-soft border border-warning flex gap-4">
            <div className="w-12 h-12 bg-warning flex items-center justify-center rounded-xl text-white font-black text-xl flex-shrink-0 shadow-sm">
              M
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-content text-sm">
                  Moodle LMS — Connected
                </h4>
                <span className="text-[9px] font-black bg-surface px-1.5 py-0.5 rounded border border-warning text-warning uppercase">
                  Syncing
                </span>
              </div>
              <ul className="space-y-1.5">
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-warning" /> 11
                  assignments across 4 subjects
                </li>
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-warning" /> 2
                  pending submissions flagged
                </li>
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-warning" /> 3
                  new grades posted today
                </li>
              </ul>
              <button onClick={() => window.open('http://lms.kiet.edu/moodle/', '_blank')} className="mt-4 text-[10px] font-black text-warning uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Open Moodle LMS <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Cyber Vidya Column */}
          <div className="p-5 rounded-2xl bg-info-soft border border-info flex gap-4">
            <div className="w-12 h-12 bg-info flex items-center justify-center rounded-xl text-white font-black text-xl flex-shrink-0 shadow-sm">
              CV
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-content text-sm">
                  Cyber Vidya — Connected
                </h4>
                <span className="text-[9px] font-black bg-surface px-1.5 py-0.5 rounded border border-info text-info uppercase">
                  Syncing
                </span>
              </div>
              <ul className="space-y-1.5">
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-info" /> 4
                  subjects tracked
                </li>
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-info" /> 1
                  student below 75% attendance
                </li>
                <li className="text-xs text-content-2 flex items-center gap-2">
                  <CheckCircle size={12} className="text-info" />{" "}
                  Today's classes: 2 marked, 1 pending
                </li>
              </ul>
              <button onClick={() => window.open('https://kiet.cybervidya.net', '_blank')} className="mt-4 text-[10px] font-black text-info uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Open Cyber Vidya <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


