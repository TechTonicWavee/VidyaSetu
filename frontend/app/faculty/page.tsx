"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from '@/lib/shared/api/client';
import { PageHeader, StatCard, Card, Badge } from '@/components/shared/ui';
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle, MessageCircle,
  FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle,
  TrendingUp, Target, ExternalLink, MoreHorizontal, ChevronRight,
  User, Activity, Award, Grid, Zap, AlertCircle, Plug, Menu, Brain, Calendar
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
    return (
      <div className="p-8 w-full h-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-muted">Loading your dashboard...</p>
      </div>
    );
  }

  // Derive stats
  const totalStudents = analytics?.totalStudents || 0;
  const activeAlerts = mentees.reduce((acc, m) => acc + (m.alerts?.length || 0), 0);
  const avgClassSpi = mentees.length ? Math.round(mentees.reduce((acc, m) => acc + (m.spi || 0), 0) / mentees.length) : 0;

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

  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Good morning, ${profile?.fullName || 'Professor'}`}
        description="Here's an overview of your classes and mentees for today."
        actions={
          <Badge tone="gray" className="px-3 py-1.5 font-mono uppercase tracking-widest text-[10px] bg-surface-2 border border-line text-muted shadow-sm hidden sm:inline-flex">
            {date}
          </Badge>
        }
      />

      {/* Metrics Section - Matches Student Layout (1/4 left col, 3/4 right col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column (Stacked Stats) */}
        <div className="flex flex-col gap-6">
          <StatCard
            label="My Students"
            value={totalStudents.toString()}
            hint={`Across ${analytics?.totalClasses || 0} subjects`}
            icon={Users}
            tone="brand"
            className="flex-1"
          />
          <StatCard
            label="Avg Mentee SPI"
            value={avgClassSpi.toString()}
            hint="Across all assigned mentees"
            icon={TrendingUp}
            tone="blue"
            className="flex-1"
          />
        </div>

        {/* Right Column (Wide Visual - Subject Performance) */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-content text-lg flex items-center gap-2">
                  <Activity className="text-brand w-5 h-5" />
                  Subject Performance
                </h3>
                <p className="text-sm text-muted mt-0.5">Average scores and CO attainment across your classes</p>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 content-start">
              {subjectHealth.length > 0 ? subjectHealth.map((sub, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer group p-4 rounded-2xl bg-surface-2 border border-transparent hover:border-line transition-colors"
                  onClick={() => router.push("/faculty/analytics")}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-content group-hover:text-brand transition-colors">
                      {sub.name}
                    </span>
                    <span className="text-xs font-bold text-content">
                      {sub.avg}% Avg
                    </span>
                  </div>
                  <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden shadow-inner mb-3">
                    <div
                      className={`h-2 rounded-full ${sub.avg >= 75 ? "bg-success" : sub.avg >= 60 ? "bg-warning" : sub.avg >= 45 ? "bg-info" : "bg-danger"}`}
                      style={{ width: `${sub.avg}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-tight bg-surface px-2 py-0.5 rounded border border-line">
                      CO Attainment: <span className="text-content ml-1">{sub.co}%</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 ${sub.risk > 10 ? "text-danger" : "text-muted"}`}
                    >
                      {sub.risk > 10 && <AlertTriangle size={10} />}
                      {sub.risk} at Risk
                    </span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-8 text-center text-muted text-sm">
                  No subject data available.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Students Needing Attention (Matches Student "Recent Activity") */}
      <Card className="p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-content text-lg">Students Needing Attention</h3>
            <p className="text-sm text-muted mt-0.5">Mentees flagged for low performance or attendance</p>
          </div>
          {activeAlerts > 0 && (
             <Badge tone="red" className="shadow-sm font-bold px-3 py-1 text-xs">
               {activeAlerts} Active {activeAlerts === 1 ? 'Alert' : 'Alerts'}
             </Badge>
          )}
        </div>
        
        {studentsNeedingAttention.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No students currently flagged for attention.</p>
        ) : (
          <div className="space-y-4">
            {studentsNeedingAttention.map((s, idx) => (
              <div 
                key={idx} 
                className="group flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-surface-2 transition-colors border border-transparent hover:border-line cursor-pointer"
                onClick={() => router.push("/faculty/student/profile")}
              >
                <div className={`w-11 h-11 rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-line-strong transition-colors ${s.severity === "HIGH" ? "bg-danger-soft text-danger group-hover:border-danger/20" : "bg-warning-soft text-warning group-hover:border-warning/20"}`}>
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-content mb-0.5">
                    {s.name} <span className="text-muted font-normal text-xs ml-1">({s.roll})</span>
                  </p>
                  <p className="text-xs text-muted font-medium">
                     {s.subject} · {s.issue}
                  </p>
                </div>
                <div className="text-xs font-bold text-muted group-hover:text-brand transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  View Profile <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Moodle & Cyber Vidya Sync Section */}
      <Card className="p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-content text-lg">
            Integrations Sync
          </h3>
          <Badge tone="green" className="shadow-sm">Systems Live</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moodle Column */}
          <div className="group flex flex-col gap-4 py-4 px-5 rounded-2xl bg-surface hover:bg-surface-2 transition-colors border border-line relative overflow-hidden">
             {/* Subtle accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-warning opacity-70"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-soft text-warning flex items-center justify-center rounded-xl font-black text-lg border border-warning/20">
                  M
                </div>
                <div>
                   <h4 className="font-bold text-content text-sm">Moodle LMS</h4>
                   <p className="text-xs text-success font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Connected</p>
                </div>
              </div>
              <Badge tone="orange" className="text-[9px]">SYNCING</Badge>
            </div>
            
            <ul className="space-y-2 mt-2 flex-1">
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-warning"><CheckCircle size={14} /></div> 11 assignments across 4 subjects
              </li>
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-warning"><CheckCircle size={14} /></div> 2 pending submissions flagged
              </li>
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-warning"><CheckCircle size={14} /></div> 3 new grades posted today
              </li>
            </ul>
            
            <button onClick={() => window.open('http://lms.kiet.edu/moodle/', '_blank')} className="mt-2 text-xs font-bold text-warning hover:text-warning-hover flex items-center gap-1 transition-colors w-fit">
              Open Moodle <ChevronRight size={14} />
            </button>
          </div>

          {/* Cyber Vidya Column */}
          <div className="group flex flex-col gap-4 py-4 px-5 rounded-2xl bg-surface hover:bg-surface-2 transition-colors border border-line relative overflow-hidden">
             {/* Subtle accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-info opacity-70"></div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-info-soft text-info flex items-center justify-center rounded-xl font-black text-lg border border-info/20">
                  CV
                </div>
                <div>
                   <h4 className="font-bold text-content text-sm">Cyber Vidya</h4>
                   <p className="text-xs text-success font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Connected</p>
                </div>
              </div>
              <Badge tone="blue" className="text-[9px]">SYNCING</Badge>
            </div>
            
            <ul className="space-y-2 mt-2 flex-1">
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-info"><CheckCircle size={14} /></div> 4 subjects tracked
              </li>
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-info"><CheckCircle size={14} /></div> 1 student below 75% attendance
              </li>
              <li className="text-xs text-muted font-medium flex items-start gap-2">
                <div className="mt-0.5 text-info"><CheckCircle size={14} /></div> Today's classes: 2 marked, 1 pending
              </li>
            </ul>
            
            <button onClick={() => window.open('https://kiet.cybervidya.net', '_blank')} className="mt-2 text-xs font-bold text-info hover:text-info-hover flex items-center gap-1 transition-colors w-fit">
              Open Cyber Vidya <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}



