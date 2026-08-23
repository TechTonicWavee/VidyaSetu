"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from '@/lib/shared/api/client';
import { PageHeader, StatCard, Card, Badge } from '@/components/shared/ui';
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle, MessageCircle,
  FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle,
  TrendingUp, Target, ExternalLink, MoreHorizontal, ChevronRight,
  User, Activity, Award, Grid, Zap, AlertCircle, Plug, Menu, Brain,
} from "lucide-react";

export default function FacultyDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [mentees, setMentees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, anData, menteesData] = await Promise.all([
          apiGet<any>('/api/faculty/profile'),
          apiGet<any>('/api/faculty/reports/analytics'),
          apiGet<any[]>('/api/faculty/mentees')
        ]);
        setProfile(profData);
        setAnalytics(anData);
        setMentees(menteesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading dashboard...</div>;
  }

  // Derive stats
  const totalStudents = analytics?.totalStudents || 0;
  const activeAlerts = mentees.reduce((acc, m) => acc + (m.alerts?.length || 0), 0);
  const avgClassSpi = mentees.length ? Math.round(mentees.reduce((acc, m) => acc + (m.spi || 0), 0) / mentees.length) : 0;
  
  const statCards = [
    { label: "My Students", value: totalStudents.toString(), sub: `Across ${analytics?.totalClasses || 0} subjects`, icon: Users, tone: 'brand' as const },
    { label: "Active Alerts", value: activeAlerts.toString(), sub: "Needs attention", icon: AlertTriangle, tone: 'danger' as const },
    { label: "Avg Mentee SPI", value: avgClassSpi.toString(), sub: "Across all mentees", icon: TrendingUp, tone: 'blue' as const },
  ];

  const studentsNeedingAttention = mentees
    .filter(m => m.status === 'Weak' || (m.alerts && m.alerts.length > 0))
    .map(m => ({
      name: m.name,
      roll: m.roll,
      subject: m.subject,
      issue: m.alerts?.length > 0 ? m.alerts[0].type : "Low SPI",
      severity: "HIGH",
    })).slice(0, 5);

  const subjectHealth = analytics?.subjects ? Object.values(analytics.subjects).map((sub: any) => ({
    name: sub.fullName,
    avg: sub.avg,
    co: sub.co,
    risk: sub.atRisk
  })) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${profile?.fullName || 'Professor'}`}
        description="Here is an overview of your classes and mentees"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
            {studentsNeedingAttention.length > 0 ? studentsNeedingAttention.map((s, idx) => (
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
            )) : <div className="text-sm text-muted">No students currently need attention.</div>}
          </div>
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


