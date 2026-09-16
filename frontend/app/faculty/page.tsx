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
  const [attentionStudents, setAttentionStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, anData, attentionData] = await Promise.all([
          apiGet<any>('/api/faculty/profile'),
          apiGet<any>('/api/faculty/reports/analytics'),
          apiGet<any[]>('/api/faculty/attention')
        ]);
        setProfile(profData);
        setAnalytics(anData);
        setAttentionStudents(attentionData);
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
  const activeAlerts = attentionStudents.length;

  const studentsNeedingAttention = attentionStudents.slice(0, 5);

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

      {/* Students Needing Attention */}
      <Card className="p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-content text-lg">Students Needing Attention</h3>
            <p className="text-sm text-muted mt-0.5">Students flagged for low performance or attendance</p>
          </div>
          {activeAlerts > 0 && (
             <Badge tone="red" className="shadow-sm font-bold px-3 py-1 text-xs">
               {activeAlerts} Flagged {activeAlerts === 1 ? 'Student' : 'Students'}
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
                className="group flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-surface-2 transition-colors border border-transparent hover:border-line"
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
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}



