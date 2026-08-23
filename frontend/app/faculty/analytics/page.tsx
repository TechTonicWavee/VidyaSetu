'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader, Card, StatCard } from '@/components/shared/ui';
import { Users, AlertTriangle, TrendingUp, Target, Star, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { apiGet } from '@/lib/shared/api/client'

function SubjectAnalyticsContent() {
  const searchParams = useSearchParams();
  const [subjectsMap, setSubjectsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  const [subjectKey, setSubjectKey] = useState<string>(() => {
    return searchParams?.get('subject') || '';
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiGet<any>('/api/faculty/reports/analytics');
        if (data.subjects) {
          setSubjectsMap(data.subjects);
          if (!subjectKey || !data.subjects[subjectKey]) {
            const keys = Object.keys(data.subjects);
            if (keys.length > 0) setSubjectKey(keys[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [subjectKey]);

  if (!mounted || loading) return <div className="text-center py-10">Loading analytics...</div>;

  const s = subjectsMap[subjectKey];
  if (!s) return <div className="text-center py-10">No analytics data available for this class.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="Subject Analytics"
          description="Deep performance insights across all your subjects — identify gaps before they become failures"
        />
        
        <div className="relative min-w-[220px]">
          <select
            value={subjectKey}
            onChange={e => setSubjectKey(e.target.value)}
            className="w-full appearance-none bg-surface border border-line text-content font-semibold text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand shadow-sm cursor-pointer">
            {Object.values(subjectsMap).map((sub: any) => (
              <option key={sub.id} value={sub.id}>{sub.name} — {sub.code}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
      </div>

      {/* TOP STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Students" value={s.totalStudents.toString()} hint={`Enrolled in ${s.name} ${s.code}`} icon={Users} tone="blue" />
        <StatCard label="Class Average" value={`${s.avg}%`} hint="Unit 3 exam" icon={TrendingUp} tone={s.avg >= 70 ? 'success' : 'amber'} />
        <StatCard label="CO Attainment" value={`${s.co}%`} hint="Target: 75%" icon={Target} tone={s.co >= 75 ? 'success' : 'amber'} />
        <StatCard label="At-Risk" value={s.atRisk.toString()} hint="Score below 50%" icon={AlertTriangle} tone="danger" />
        <StatCard label="Top Scorer" value={s.topScorer} hint={`${s.topScore}%`} icon={Star} tone="success" />
      </div>

      {/* SECTION A - CLASS PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-content mb-6">
            Unit 3 Score Distribution — {s.name}
          </h3>
          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={s.scoreDistData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                    {s.scoreDistData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-line text-center">
            <p className="text-sm font-semibold text-content">
              Class average: {s.avg}% —{" "}
              <span className="text-danger font-bold">
                {s.belowSixty} students below 60%
              </span>
            </p>
          </div>
        </Card>

        {/* Unit-wise Trend */}
        <Card className="flex flex-col relative">
          <h3 className="text-lg font-bold text-content mb-6">
            Average Score Per Unit — {s.name}
          </h3>

          <div className="absolute top-1/4 right-[5%] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-500 text-[10px] font-bold p-2 rounded-lg max-w-[150px] shadow-sm z-10 hidden sm:block">
            Declining trend — Unit 3 was complex topics
          </div>

          <div className="h-64 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={s.unitTrendData}
                  margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="unit" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                  <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Line type="monotone" dataKey="score" stroke="#4338CA" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SubjectAnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading Analytics...</div>}>
      <SubjectAnalyticsContent />
    </Suspense>
  )
}
