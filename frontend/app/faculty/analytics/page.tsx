'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader, Card, StatCard } from "@/components/ui";
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

const SUBJECTS = {
  cls_dbms_a: {
    name: 'DBMS', fullName: 'Database Management Systems', section: 'A', code: 'CSE 2B',
    totalStudents: 62, avg: 64, co: 71, atRisk: 8, topScorer: 'Siddharth Rao', topScore: 94,
    belowSixty: 19,
    scoreDistData: [
      { range: '90-100', students: 4, color: '#10B981' },
      { range: '80-89', students: 9, color: '#4338CA' },
      { range: '70-79', students: 14, color: '#3B82F6' },
      { range: '60-69', students: 16, color: '#F59E0B' },
      { range: '50-59', students: 11, color: '#F97316' },
      { range: 'Below 50', students: 8, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 71 }, { unit: 'Unit 2', score: 68 }, { unit: 'Unit 3', score: 64 }, { unit: 'Unit 4', score: null }],
  },
  cls_os_b: {
    name: 'OS', fullName: 'Operating Systems', section: 'B', code: 'CSE 2A',
    totalStudents: 58, avg: 58, co: 67, atRisk: 11, topScorer: 'Ananya Verma', topScore: 91,
    belowSixty: 22,
    scoreDistData: [
      { range: '90-100', students: 3, color: '#10B981' },
      { range: '80-89', students: 6, color: '#4338CA' },
      { range: '70-79', students: 11, color: '#3B82F6' },
      { range: '60-69', students: 14, color: '#F59E0B' },
      { range: '50-59', students: 13, color: '#F97316' },
      { range: 'Below 50', students: 11, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 63 }, { unit: 'Unit 2', score: 60 }, { unit: 'Unit 3', score: 58 }, { unit: 'Unit 4', score: null }],
  },
  cls_toc_a: {
    name: 'TOC', fullName: 'Theory of Computation', section: 'A', code: 'CSE 2C',
    totalStudents: 60, avg: 61, co: 69, atRisk: 7, topScorer: 'Priyanshu Raj', topScore: 88,
    belowSixty: 16,
    scoreDistData: [
      { range: '90-100', students: 2, color: '#10B981' },
      { range: '80-89', students: 8, color: '#4338CA' },
      { range: '70-79', students: 16, color: '#3B82F6' },
      { range: '60-69', students: 17, color: '#F59E0B' },
      { range: '50-59', students: 10, color: '#F97316' },
      { range: 'Below 50', students: 7, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 67 }, { unit: 'Unit 2', score: 63 }, { unit: 'Unit 3', score: 61 }, { unit: 'Unit 4', score: null }],
  },
  cls_dsa_c: {
    name: 'Data Structures', fullName: 'Data Structures', section: 'C', code: 'CSE 1A',
    totalStudents: 63, avg: 72, co: 81, atRisk: 3, topScorer: 'Aryan Mehta', topScore: 96,
    belowSixty: 8,
    scoreDistData: [
      { range: '90-100', students: 9, color: '#10B981' },
      { range: '80-89', students: 16, color: '#4338CA' },
      { range: '70-79', students: 19, color: '#3B82F6' },
      { range: '60-69', students: 11, color: '#F59E0B' },
      { range: '50-59', students: 5, color: '#F97316' },
      { range: 'Below 50', students: 3, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 76 }, { unit: 'Unit 2', score: 73 }, { unit: 'Unit 3', score: 72 }, { unit: 'Unit 4', score: null }],
  },
};

function SubjectAnalyticsContent() {
  const searchParams = useSearchParams();
  const [subjectKey, setSubjectKey] = useState<keyof typeof SUBJECTS>(() => {
    const p = searchParams?.get('subject');
    return p && SUBJECTS[p as keyof typeof SUBJECTS] ? (p as keyof typeof SUBJECTS) : 'cls_dbms_a';
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const s = SUBJECTS[subjectKey];

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
            onChange={e => setSubjectKey(e.target.value as keyof typeof SUBJECTS)}
            className="w-full appearance-none bg-surface border border-line text-content font-semibold text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand shadow-sm cursor-pointer">
            <option value="cls_dbms_a">DBMS — CSE 2B</option>
            <option value="cls_os_b">Operating Systems — CSE 2A</option>
            <option value="cls_toc_a">Theory of Computation — CSE 2C</option>
            <option value="cls_dsa_c">Data Structures — CSE 1A</option>
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
                    {s.scoreDistData.map((entry, index) => (
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
