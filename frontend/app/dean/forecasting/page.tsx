"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
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
  TrendingUp,
  TrendingDown,
  MinusCircle,
  PieChart as PieIcon,
  Lightbulb,
  Users2,
  Building,
  AlertOctagon,
  Cpu,
  Download,
  ArrowUpRight,
  Zap,
  Target,
  User,
  Activity,
  Award,
  Grid,
  AlertCircle,
  Plug,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from "recharts";

const navLinks = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    badge: null,
    active: false,
    path: "/dean",
  },
  {
    id: "department",
    label: "Department Overview",
    icon: Grid,
    badge: null,
    active: false,
    path: "/dean/department",
  },
  {
    id: "faculty",
    label: "Faculty Performance",
    icon: Users,
    badge: null,
    active: false,
    path: "/dean/faculty-performance",
  },
  {
    id: "forecast",
    label: "Cohort Forecasting",
    icon: TrendingUp,
    badge: null,
    active: true,
    path: "/dean/forecasting",
  },
  {
    id: "curriculum",
    label: "Curriculum Analysis",
    icon: BookOpen,
    badge: null,
    active: false,
    path: "/dean/curriculum",
  },
  {
    id: "policy",
    label: "Policy Simulation",
    icon: Activity,
    badge: null,
    active: false,
    path: "/dean/policy-simulation",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    badge: null,
    active: false,
    path: "/dean/reports",
  },
  {
    id: "cross",
    label: "Year-wise Insights",
    icon: Target,
    badge: null,
    active: false,
    path: "/dean/cross-branch",
  },
  {
    id: "intelligence",
    label: "Student Intelligence",
    icon: Brain,
    badge: null,
    active: false,
    path: "/dean/student-intelligence",
  },
];

const pieData = [
  { name: "Tier 1 Ready", value: 43, color: "#166534", sub: "SPI 85+" },
  { name: "Tier 2 Ready", value: 189, color: "#3B82F6", sub: "SPI 75-84" },
  { name: "Tier 3 Ready", value: 96, color: "#F59E0B", sub: "SPI 65-74" },
  { name: "Not Ready", value: 32, color: "#EF4444", sub: "SPI below 65" },
];

const forecastChartData = [
  { range: "Below 45", current: 46, without: 71, with: 28 },
  { range: "45-54", current: 163, without: 198, with: 121 },
  { range: "55-64", current: 412, without: 387, with: 368 },
  { range: "65-74", current: 334, without: 318, with: 361 },
  { range: "75-84", current: 198, without: 187, with: 241 },
  { range: "85+", current: 87, without: 79, with: 121 },
];

const allStudents = [
  {
    id: 1,
    risk: 94,
    name: "Sneha Patel",
    branch: "CSE",
    year: "2nd",
    spi: 48,
    pred: 41,
    factor: "Attendance + Score decline",
    faculty: "Prof. Priya Kapoor",
    severity: "CRITICAL",
  },
  {
    id: 2,
    risk: 91,
    name: "Vikas Joshi",
    branch: "CSE",
    year: "3rd",
    spi: 44,
    pred: 39,
    factor: "3 subjects below 50%",
    faculty: "Dr. Suresh Iyer",
    severity: "CRITICAL",
  },
  {
    id: 3,
    risk: 87,
    name: "Priti Desai",
    branch: "CSE",
    year: "2nd",
    spi: 51,
    pred: 46,
    factor: "Attendance critical — 2 subjects",
    faculty: "Prof. Priya Kapoor",
    severity: "CRITICAL",
  },
  {
    id: 4,
    risk: 83,
    name: "Rohit Sharma",
    branch: "CSE",
    year: "2nd",
    spi: 53,
    pred: 49,
    factor: "Score declining 3 units",
    faculty: "Prof. Priya Kapoor",
    severity: "HIGH",
  },
  {
    id: 5,
    risk: 79,
    name: "Arjun Mehta",
    branch: "CSE",
    year: "2nd",
    spi: 56,
    pred: 52,
    factor: "Assignments not submitted",
    faculty: "Dr. Suresh Iyer",
    severity: "HIGH",
  },
  {
    id: 6,
    risk: 74,
    name: "Kavitha Reddy",
    branch: "CSE",
    year: "1st",
    spi: 49,
    pred: 46,
    factor: "New student struggling to adapt",
    faculty: "Prof. Kavya Nair",
    severity: "HIGH",
  },
  {
    id: 7,
    risk: 68,
    name: "Rahul Teja",
    branch: "CSE",
    year: "3rd",
    spi: 58,
    pred: 55,
    factor: "Consistent below average",
    faculty: "Dr. Suresh Iyer",
    severity: "MEDIUM",
  },
  {
    id: 8,
    risk: 64,
    name: "Lakshmi Priya",
    branch: "CSE",
    year: "1st",
    spi: 55,
    pred: 53,
    factor: "Attendance borderline",
    faculty: "Prof. Kavya Nair",
    severity: "MEDIUM",
  },
  {
    id: 9,
    risk: 61,
    name: "Deepak Nair",
    branch: "CSE",
    year: "4th",
    spi: 62,
    pred: 60,
    factor: "Placement readiness low",
    faculty: "Dr. Anita Sharma",
    severity: "MEDIUM",
  },
  {
    id: 10,
    risk: 57,
    name: "Suman Gupta",
    branch: "CSE",
    year: "3rd",
    spi: 61,
    pred: 59,
    factor: "Project submissions missing",
    faculty: "Dr. Suresh Iyer",
    severity: "MEDIUM",
  },
];

export default function DeanForecastingPage() {
  const router = useRouter();
  const [activeNav] = useState("forecasting");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filterBranch, setFilterBranch] = useState("CSE");
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterRisk, setFilterRisk] = useState("All");

  const [interveneModalOpen, setInterveneModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<(typeof allStudents)[number] | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const handleIntervene = (student: (typeof allStudents)[number]) => {
    setSelectedStudent(student);
    setSelectedAction(null);
    setInterveneModalOpen(true);
  };

  const filteredStudents = allStudents.filter((s) => {
    if (s.branch !== "CSE") return false;
    if (filterYear !== "All Years" && s.year !== filterYear) return false;
    if (filterRisk !== "All" && s.severity !== filterRisk.toUpperCase())
      return false;
    return true;
  });

  // Custom legend payload for PieChart
  const renderCustomLegend = (props: { payload?: { color: string; value: string; payload: { value: number } }[] }) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap gap-4 mt-6">
        {(payload ?? []).map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <div>
              <span className="text-sm font-bold text-navy">{entry.value}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({entry.payload.value})
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-content mb-1">
                  Cohort Forecasting
                </h1>
                <p className="text-muted text-sm">
                  AI-predicted outcomes for current batches — act now, change
                  outcomes before semester end
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider rounded-full border border-purple-500/20 flex items-center gap-1">
                  <Cpu size={12} /> Powered by AI
                </span>
                <p className="text-[10px] text-muted font-medium">
                  Predictions updated: 1 April 2026
                </p>
              </div>
            </div>

            {/* TOP SUMMARY STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-line">
                <p className="text-4xl font-black text-teal-600 mb-2">61%</p>
                <p className="text-xs font-bold text-content mb-1 leading-tight">
                  Predicted placement rate —<br />
                  CSE 4th year 2026
                </p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-3">
                  <ArrowUpRight size={12} /> Was 54% same time last year
                </p>
              </div>
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-line">
                <p className="text-4xl font-black text-red-600 mb-2">209</p>
                <p className="text-xs font-bold text-content mb-1 leading-tight">
                  Predicted to need intervention
                  <br />
                  before end semester
                </p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-wider mt-3">
                  Across CSE cohorts and years
                </p>
              </div>
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-line">
                <p className="text-4xl font-black text-green-600 mb-2">43</p>
                <p className="text-xs font-bold text-content mb-1 leading-tight">
                  Students predicted to achieve
                  <br />
                  SPI above 85 by semester end
                </p>
                <p className="text-[10px] text-muted font-medium uppercase tracking-wider mt-3">
                  Based on current trajectory
                </p>
              </div>
              <div className="bg-surface rounded-xl p-5 shadow-sm border border-line">
                <p className="text-4xl font-black text-orange-500 mb-2">28</p>
                <p className="text-xs font-bold text-content mb-1 leading-tight">
                  Students showing early
                  <br />
                  dropout risk signals
                </p>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-3">
                  Immediate attention recommended
                </p>
              </div>
            </div>

            {/* SECTION A - PLACEMENT FORECAST */}
            <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
              <div className="p-6 border-b border-line">
                <h3 className="text-lg font-bold text-content">
                  Final Year Placement Forecast — CSE Batch 2022
                </h3>
              </div>

              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-line">
                {/* Pie Chart */}
                <div className="p-6 lg:w-1/2 flex flex-col justify-center items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid var(--line)",
                            background: "var(--surface)",
                            color: "var(--content)",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend content={renderCustomLegend as any} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Scenarios */}
                <div className="p-6 lg:w-1/2 bg-surface-2/30 flex flex-col justify-center">
                  <h4 className="font-bold text-content mb-4">
                    Placement Outcome Prediction
                  </h4>

                  <div className="space-y-4">
                    {/* Optimistic */}
                    <div className="p-4 rounded-xl border border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/10 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                        <TrendingUp size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 dark:text-green-300 font-bold mb-0.5">
                          Optimistic Scenario
                        </p>
                        <p className="text-xs text-green-700/80 dark:text-green-400/80 mb-2">
                          If intervention plan is followed
                        </p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-green-900 dark:text-green-100">
                          <span>Placement rate: 74%</span>
                          <span>Avg package: 9.2 LPA</span>
                          <span>Tier 1 placements: 43 students</span>
                        </div>
                      </div>
                    </div>

                    {/* Base */}
                    <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                        <MinusCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 dark:text-blue-300 font-bold mb-0.5">
                          Base Scenario
                        </p>
                        <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mb-2">
                          At current trajectory
                        </p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-blue-900 dark:text-blue-100">
                          <span>Placement rate: 61%</span>
                          <span>Avg package: 7.8 LPA</span>
                          <span>Tier 1 placements: 31 students</span>
                        </div>
                      </div>
                    </div>

                    {/* Conservative */}
                    <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                        <TrendingDown size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-amber-800 dark:text-amber-300 font-bold mb-0.5">
                          Conservative Scenario
                        </p>
                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mb-2">
                          If no intervention is taken
                        </p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-amber-900 dark:text-amber-100">
                          <span>Placement rate: 48%</span>
                          <span>Avg package: 6.4 LPA</span>
                          <span>Tier 1 placements: 18 students</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-xs font-bold text-red-700 dark:text-red-400 text-center uppercase tracking-wide">
                    Gap between optimistic and conservative scenario: 94
                    students — every intervention matters
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C - OUTCOME FORECAST CHART */}
            <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
              <div className="p-6 border-b border-line">
                <h3 className="text-lg font-bold text-content mb-1">
                  Predicted SPI Distribution at Semester End
                </h3>
                <p className="text-sm text-muted">
                  Current distribution vs predicted distribution with and
                  without intervention
                </p>
              </div>

              <div className="p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                  <BarChart
                    data={forecastChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--line)"
                    />
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted)" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted)" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "var(--surface-2)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: "var(--surface)",
                        color: "var(--content)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", paddingBottom: "20px" }}
                    />
                    <Bar
                      dataKey="current"
                      name="Current"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="without"
                      name="Without Intervention"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="with"
                      name="With Intervention"
                      fill="#22C55E"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-surface-2 border-t border-line">
                <div className="bg-success-soft border border-success/20 rounded-xl p-5 shadow-sm">
                  <p className="text-content font-medium leading-relaxed text-sm">
                    With targeted intervention on the top 209 at-risk students,
                    the department can move{" "}
                    <span className="font-bold text-success">
                      88 additional students from below-average to average SPI
                      range
                    </span>{" "}
                    by semester end. This would improve the department health
                    score from 73 to approximately 81.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION B - AT-RISK STUDENTS */}
            <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
              <div className="p-6 border-b border-line">
                <h3 className="text-lg font-bold text-content mb-1">
                  Students Predicted to Fail Without Intervention
                </h3>
                <p className="text-sm text-muted">
                  Ranked by risk score — highest risk at top
                </p>
              </div>

              <div className="p-4 border-b border-line bg-surface-2 flex flex-col sm:flex-row gap-3">
                <select
                  className="appearance-none bg-surface border border-line text-content text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <option>CSE</option>
                </select>
                <select
                  className="appearance-none bg-surface border border-line text-content text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option>All Years</option>
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
                <select
                  className="appearance-none bg-surface border border-line text-content text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option>All</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                      <th className="px-6 py-4">Risk Score</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Branch</th>
                      <th className="px-4 py-4">Year</th>
                      <th className="px-4 py-4 text-center">Current SPI</th>
                      <th className="px-4 py-4 text-center">
                        Predicted End-Sem SPI
                      </th>
                      <th className="px-4 py-4">Primary Risk Factor</th>
                      <th className="px-4 py-4">Assigned Faculty</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm font-medium">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="p-8 text-center text-muted italic"
                        >
                          No students match current filters
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((row) => (
                        <tr key={row.id} className="hover:bg-surface-2/50 transition-colors">
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${row.severity === "CRITICAL" ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" : row.severity === "HIGH" ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400" : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"}`}
                            >
                              {row.risk}% Risk
                            </span>
                          </td>
                          <td className="px-4 py-4 text-content font-bold">
                            {row.name}
                          </td>
                          <td className="px-4 py-4 text-muted">
                            {row.branch}
                          </td>
                          <td className="px-4 py-4 text-muted">
                            {row.year}
                          </td>
                          <td className="px-4 py-4 text-center text-content-2">
                            {row.spi}
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-red-500">
                            {row.pred}
                          </td>
                          <td
                            className="px-4 py-4 text-content max-w-[200px] truncate"
                            title={row.factor}
                          >
                            {row.factor}
                          </td>
                          <td className="px-4 py-4 text-content-2">
                            {row.faculty}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleIntervene(row)}
                              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${row.severity === "CRITICAL" ? "bg-red-600 text-white hover:bg-red-700 shadow-sm" : row.severity === "HIGH" ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm" : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/30"}`}
                            >
                              {row.severity === "CRITICAL"
                                ? "Intervene Now"
                                : row.severity === "HIGH"
                                  ? "Schedule Meeting"
                                  : "Monitor"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-2 border-t border-line flex flex-col sm:flex-row gap-3 justify-end">
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
                  Assign All Critical Students to Counselor
                </button>
                <button className="px-5 py-2.5 border border-line bg-surface text-content font-bold text-sm rounded-xl hover:bg-surface-2 transition whitespace-nowrap">
                  Export At-Risk List
                </button>
              </div>
            </div>

            {/* SECTION D - POLICY SIMULATION */}
            <div className="bg-purple-50 dark:bg-purple-500/10 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-500/20 overflow-hidden">
              <div className="p-6 border-b border-purple-100 dark:border-purple-500/10">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-2">
                  <Lightbulb size={20} /> Quick Policy Simulation
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Ask the AI what would happen if you changed a policy — full
                  simulation available in Policy Simulation page
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-purple-900 dark:text-purple-200 mb-2">
                    What policy change do you want to simulate?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="What would happen if we added a mandatory communication skills lab in 2nd semester for CSE?"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-purple-300 dark:border-purple-500/30 bg-surface text-purple-900 dark:text-purple-200 font-medium shadow-sm focus:outline-none"
                    />
                    <Zap
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400"
                    />
                  </div>
                </div>

                <div className="bg-surface rounded-xl border border-line shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full" />
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
                    <h4 className="font-bold text-content">
                      AI Simulation Result
                    </h4>
                  </div>
                  <p className="text-sm text-content-2 mb-3 font-medium">
                    Based on historical data from 3 batches where communication
                    intervention was introduced mid-year:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-content-2 mb-4">
                    <li>
                      Average placement readiness improves by{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">8-12%</span>{" "}
                      over 2 semesters
                    </li>
                    <li>
                      Linguistic dimension SPI scores improve by average{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">
                        11 points
                      </span>
                    </li>
                    <li>
                      Interpersonal dimension improves by average{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">8 points</span>
                    </li>
                    <li>
                      Communication-heavy roles (PM, consulting, management)
                      placement increases by{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">23%</span>
                    </li>
                  </ul>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 rounded text-xs font-bold text-muted uppercase tracking-widest">
                    <Target size={12} /> Confidence: 74% based on 3 historical
                    cohorts
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-5 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition shadow-sm whitespace-nowrap">
                    Run Full Policy Simulation
                  </button>
                  <button className="px-5 py-2.5 border border-purple-300 dark:border-purple-500/30 text-purple-800 dark:text-purple-300 font-bold text-sm rounded-xl hover:bg-purple-500/10 transition whitespace-nowrap bg-surface">
                    View Full Simulation Page
                  </button>
                </div>
              </div>
            </div>

      {/* INTERVENE MODAL */}
      {interveneModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-line flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-content">
                  Intervention Workflow
                </h2>
                <p className="text-sm text-muted mt-1">
                  Initiating intervention process for {selectedStudent.name}
                </p>
              </div>
              <button
                onClick={() => setInterveneModalOpen(false)}
                className="p-1 hover:bg-surface-2 rounded text-muted hover:text-content"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl p-4 flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-bold text-content text-lg leading-tight">
                    {selectedStudent.name}
                  </p>
                  <p className="text-xs text-muted font-medium">
                    {selectedStudent.branch} · {selectedStudent.year} Year ·
                    Assigned: {selectedStudent.faculty}
                  </p>
                  <div className="mt-2 text-sm text-red-800 dark:text-red-300 font-medium">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-red-600 dark:text-red-400 block mb-0.5">
                      Risk Factor
                    </span>
                    {selectedStudent.factor}
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">
                Recommended Intervention Options
              </h4>
              <div className="space-y-3 mb-8">
                {[
                  "Assign student directly to Department Counselor",
                  "Escalate to HOD for formal disciplinary/academic warning",
                  "Create customized academic recovery plan with faculty",
                ].map((action, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction === i ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30" : "bg-surface border-line hover:bg-surface-2"}`}
                  >
                    <input
                      type="radio"
                      name="intervene_action"
                      className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-line bg-surface"
                      checked={selectedAction === i}
                      onChange={() => setSelectedAction(i)}
                    />
                    <span
                      className={`text-sm font-medium ${selectedAction === i ? "text-indigo-900 dark:text-indigo-200 font-bold" : "text-content"}`}
                    >
                      {action}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-line">
                <button
                  onClick={() => setInterveneModalOpen(false)}
                  className="flex-1 py-2.5 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 font-bold text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition shadow-sm"
                >
                  Notify Parent
                </button>
                <button
                  onClick={() => setInterveneModalOpen(false)}
                  disabled={selectedAction === null}
                  className="flex-1 py-2.5 bg-blue-600 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                  Assign to Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

