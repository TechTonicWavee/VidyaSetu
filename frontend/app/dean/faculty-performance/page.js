"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  LineChart,
  BarChart2,
  Users,
  BookOpen,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Download,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  XCircle,
  Calendar,
  Clock,
  UserCheck,
  Cpu,
  Home,
  User,
  Activity,
  Award,
  Grid,
  LogOut,
  Target,
  CheckCircle,
  Zap,
  AlertCircle,
  Plug,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart as RechartsLineChart,
  Line,
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
    active: true,
    path: "/dean/faculty-performance",
  },
  {
    id: "forecast",
    label: "Cohort Forecasting",
    icon: TrendingUp,
    badge: null,
    active: false,
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

const facultyData = [
  {
    id: 1,
    rank: 1,
    name: "Dr. Anita Sharma",
    branch: "CSE",
    subjects: "Algorithms, DSA",
    students: 120,
    improvement: 14.2,
    co: 82,
    alerts: 4,
    score: 91,
    category: "Exceptional",
    avgSubjectScore: 84,
    avgAttendance: 92,
    teachingStyle: "Practical & Visualization-oriented",
    studentReviews: [
      { text: "Her visualizations make complex trees and graphs so easy to understand.", rating: 4.8 },
      { text: "Great energy, encourages asking questions. Assignments are tough but fair.", rating: 4.7 }
    ],
    aiInsights: [
      "Consistent 15% increase in practical lab scores compared to previous semesters.",
      "High engagement in classes. No immediate interventions required."
    ]
  },
  {
    id: 2,
    rank: 2,
    name: "Prof. Priya Kapoor",
    branch: "CSE",
    subjects: "DBMS, OS",
    students: 118,
    improvement: 11.8,
    co: 74,
    alerts: 9,
    score: 87,
    category: "High Performer",
    avgSubjectScore: 78,
    avgAttendance: 88,
    teachingStyle: "Project-based Learning",
    studentReviews: [
      { text: "Database projects were very close to real-world scenarios.", rating: 4.5 },
      { text: "Explains OS concepts well but classes can be a bit fast-paced.", rating: 4.2 }
    ],
    aiInsights: [
      "Project completion rates are up by 12%.",
      "Minor drop in attendance during the mid-semester weeks."
    ]
  },
  {
    id: 3,
    rank: 3,
    name: "Dr. Suresh Iyer",
    branch: "CSE",
    subjects: "TOC, Computer Networks",
    students: 122,
    improvement: 10.3,
    co: 79,
    alerts: 7,
    score: 84,
    category: "High Performer",
    avgSubjectScore: 75,
    avgAttendance: 85,
    teachingStyle: "Theoretical Deep-dive",
    studentReviews: [
      { text: "Extremely knowledgeable. Makes automata theory interesting.", rating: 4.6 },
      { text: "Strict grading, but you learn a lot.", rating: 4.4 }
    ],
    aiInsights: [
      "Strong theoretical foundation built, but practical networking labs need more focus.",
      "Alerts mostly related to assignment submission delays."
    ]
  },
  {
    id: 4,
    rank: 4,
    name: "Prof. Kavya Nair",
    branch: "CSE",
    subjects: "Python Programming, AI",
    students: 115,
    improvement: 7.9,
    co: 69,
    alerts: 13,
    score: 73,
    category: "Average",
    avgSubjectScore: 68,
    avgAttendance: 76,
    teachingStyle: "Interactive & Collaborative",
    studentReviews: [
      { text: "AI concepts are fun, but coding sessions are a bit unorganized.", rating: 3.8 },
      { text: "Friendly and approachable, but we need more structured materials.", rating: 3.9 }
    ],
    aiInsights: [
      "Students struggle with advanced Python implementation in AI algorithms.",
      "Recommend standardizing the lab curriculum for better structure."
    ]
  },
  {
    id: 5,
    rank: 5,
    name: "Dr. Ravi Sharma",
    branch: "CSE",
    subjects: "Computer Architecture",
    students: 116,
    improvement: 2.9,
    co: 57,
    alerts: 22,
    score: 51,
    category: "Critical Attention",
    avgSubjectScore: 54,
    avgAttendance: 62,
    teachingStyle: "Traditional Lecture-heavy",
    studentReviews: [
      { text: "Classes are monotonous. Hard to keep track of the architecture diagrams.", rating: 2.5 },
      { text: "Needs to use more modern tools or simulators instead of just slides.", rating: 2.8 }
    ],
    aiInsights: [
      "Significant drop in attendance observed in the last 4 weeks.",
      "High number of academic alerts triggered for mid-term failures. Immediate intervention needed."
    ]
  },
  {
    id: 6,
    rank: 6,
    name: "Prof. Arjun Mehta",
    branch: "CSE",
    subjects: "Software Engineering, Cloud",
    students: 110,
    improvement: 5.4,
    co: 65,
    alerts: 14,
    score: 67,
    category: "Average",
    avgSubjectScore: 65,
    avgAttendance: 72,
    teachingStyle: "Case-study Oriented",
    studentReviews: [
      { text: "Good industry examples, but lacks hands-on cloud deployment practice.", rating: 3.5 },
      { text: "Software engineering lectures are informative but too theoretical.", rating: 3.7 }
    ],
    aiInsights: [
      "Need to integrate AWS/Azure labs to improve the Cloud curriculum engagement.",
      "Student feedback indicates a desire for more practical assignments."
    ]
  },
  {
    id: 7,
    rank: 7,
    name: "Dr. Neha Gupta",
    branch: "CSE",
    subjects: "Data Structures, C Programming",
    students: 119,
    improvement: 8.1,
    co: 72,
    alerts: 10,
    score: 80,
    category: "High Performer",
    avgSubjectScore: 72,
    avgAttendance: 89,
    teachingStyle: "Fundamentals-focused",
    studentReviews: [
      { text: "Really clears up the basics of pointers and memory allocation.", rating: 4.4 },
      { text: "Lots of coding practice. Good for placements.", rating: 4.5 }
    ],
    aiInsights: [
      "Solid improvement in base programming skills among first-year students.",
      "High attendance maintained throughout the semester."
    ]
  },
];

const pieData = [
  { name: "Exceptional (85+)", value: 8, fill: "#065F46" }, // dark green
  { name: "High Performer (75-84)", value: 23, fill: "#10B981" }, // green
  { name: "Average (60-74)", value: 11, fill: "#F59E0B" }, // amber
  { name: "Needs Support (<60)", value: 6, fill: "#EF4444" }, // red
];

const areaTrendData = [
  { term: "S1 2024", CSE: 71 },
  { term: "S2 2024", CSE: 73 },
  { term: "S1 2025", CSE: 75 },
  { term: "S2 2025", CSE: 77 },
  { term: "S1 2026", CSE: 79 },
];

const facultyImprovementChartData = [
  { unit: "Unit 1", score: 71 },
  { unit: "Unit 2", score: 76 },
  { unit: "Unit 3", score: 82 },
];

export default function FacultyPerformanceDeepDive() {
  const router = useRouter();
  const [activeNav] = useState("faculty");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("CSE");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const filteredFaculty = facultyData.filter((f) => f.branch === "CSE");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openFacultyDetails = (faculty) => {
    // Force demo to use Dr. Anita Sharma's detailed view structure for the prototype
    setSelectedFaculty(faculty);
    setActiveTab("Overview");
    setIsPanelOpen(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast(`Knowledge Share Session Scheduled for ${selectedFaculty?.name}`);
  };

  const getScoreBadge = (score, category) => {
    if (score >= 85)
      return (
        <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded text-xs font-bold">
          {score}/100 — {category}
        </span>
      );
    if (score >= 75)
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">
          {score}/100 — {category}
        </span>
      );
    if (score >= 60)
      return (
        <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">
          {score}/100 — {category}
        </span>
      );
    if (score >= 50)
      return (
        <span className="bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs font-bold">
          {score}/100 — {category}
        </span>
      );
    return (
      <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-xs font-bold">
        {score}/100 — {category}
      </span>
    );
  };

  return (
    <>
    <main className="dean-page px-8 py-8">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">
                  Faculty Performance Analytics
                </h1>
                <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                  Ranked by student outcome improvement — not ratings. Every
                  score is based on how much students actually improved under
                  each faculty member.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-sm border border-blue-200 rounded-lg shadow-sm">
                  Semester: Even 2026
                </span>
                <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                  <Download size={16} /> Export Report
                </button>
              </div>
            </div>

            {/* TOP - Department Faculty Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Total Faculty
                  </p>
                  <p className="font-bold text-blue-600 text-4xl mb-1">48</p>
                  <p className="text-xs text-gray-500">CSE Department</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Above Target
                  </p>
                  <p className="font-bold text-green-600 text-4xl mb-1">31</p>
                  <p className="text-xs text-gray-500">
                    Effectiveness score above 75
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Need Support
                  </p>
                  <p className="font-bold text-amber-500 text-4xl mb-1">11</p>
                  <p className="text-xs text-gray-500">
                    Effectiveness score 60-74
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <UserCheck size={24} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Critical Attention
                  </p>
                  <p className="font-bold text-red-500 text-4xl mb-1">6</p>
                  <p className="text-xs text-gray-500">
                    Effectiveness below 60
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>

            {/* MAIN - Faculty Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-navy mb-1">
                    Faculty Effectiveness Rankings
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ranked by student improvement rate — updated every semester
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value)}
                  >
                    <option value="CSE">CSE Only</option>
                  </select>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer">
                    <option>Dept: CSE</option>
                    <option>Core CS</option>
                    <option>Mathematics</option>
                    <option>Humanities</option>
                  </select>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer">
                    <option>Sort: By Effectiveness</option>
                    <option>Sort: By Students</option>
                    <option>Sort: By CO Attainment</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 pl-6 w-16">Rank</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">Subjects</th>
                      <th className="p-4 text-center">Students</th>
                      <th className="p-4 text-center">Improvement</th>
                      <th className="p-4 text-center">CO Attainment</th>
                      <th className="p-4 text-center">Alerts</th>
                      <th className="p-4">Effectiveness Score</th>
                      <th className="p-4 pr-6"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredFaculty.map((f, i) => (
                      <tr
                        key={f.id}
                        className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="p-4 pl-6 font-bold text-gray-400">
                          #{f.rank}
                        </td>
                        <td className="p-4 font-bold text-navy flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {f.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .replace("D", "")
                              .replace("P", "")
                              .substring(0, 2)}
                          </div>
                          {f.name}
                        </td>
                        <td className="p-4 font-medium text-gray-600">
                          {f.branch}
                        </td>
                        <td className="p-4 text-gray-600 truncate max-w-[150px]">
                          {f.subjects}
                        </td>
                        <td className="p-4 text-center text-gray-600 font-medium">
                          {f.students}
                        </td>
                        <td className="p-4 text-center font-bold text-green-600">
                          +{f.improvement}%
                        </td>
                        <td className="p-4 text-center font-bold text-gray-700">
                          {f.co}%
                        </td>
                        <td className="p-4 text-center text-gray-600">
                          {f.alerts}
                        </td>
                        <td className="p-4">
                          {getScoreBadge(f.score, f.category)}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => openFacultyDetails(f)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 justify-end w-full"
                          >
                            View Details <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredFaculty.length === 0 && (
                  <div className="p-8 text-center text-gray-500 font-medium">
                    No faculty found for the selected filters.
                  </div>
                )}
              </div>
            </div>

            {/* SECTION B - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Effectiveness Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-navy mb-6">
                  Effectiveness Distribution
                </h2>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                  <div className="w-[200px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col gap-3">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <div>
                          <p className="text-sm font-bold text-navy">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.value} faculty —{" "}
                            {Math.round((item.value / 48) * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-auto">
                  <p className="text-gray-700 text-sm font-medium">
                    79% of faculty are performing above target. 6 faculty need
                    structured support programs.
                  </p>
                </div>
              </div>

              {/* Improvement Rate Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-navy mb-6">
                  Department Average Faculty Effectiveness — 4 Semesters
                </h2>

                <div className="h-[200px] w-full mb-6 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaTrendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCSE"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        dataKey="term"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        domain={[50, 85]}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="CSE"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCSE)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-auto">
                  <p className="text-green-800 text-sm font-medium leading-relaxed">
                    CSE department shows consistent faculty effectiveness
                    improvement across all semesters. The upward trend follows
                    the peer observation sessions and structured CO attainment
                    reviews introduced from 2025.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

      {/* ══════════════════════════════════
          SLIDE-IN PANEL (FACULTY DETAIL)
      ══════════════════════════════════ */}
      {isPanelOpen && selectedFaculty && (
        <>
          <div
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsPanelOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-[600px] bg-bg-base shadow-2xl z-50 flex flex-col transform transition-transform duration-300 animate-slide-left border-l border-gray-200">
            {/* Panel Header */}
            <div className="bg-white p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-xl font-bold text-white">
                    {selectedFaculty.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .replace("D", "")
                      .replace("P", "")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-1">
                      {selectedFaculty.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedFaculty.branch} · {selectedFaculty.subjects} · 7
                      years exp.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded-lg text-sm font-black">
                  {selectedFaculty.score}/100 — {selectedFaculty.category}
                </span>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="bg-white px-6 border-b border-gray-200 flex gap-6 flex-shrink-0">
              {["Overview", "Students", "CO Attainment", "Recommendations"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            {/* Panel Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "Overview" && (
                <div className="animate-fade-in space-y-6">
                  {/* 6 Mini Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Students
                      </p>
                      <p className="font-black text-xl text-navy">
                        {selectedFaculty.students}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Improvement
                      </p>
                      <p className="font-black text-xl text-green-600">
                        +{selectedFaculty.improvement}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Avg Attendance
                      </p>
                      <p className={`font-black text-xl ${selectedFaculty.avgAttendance >= 75 ? 'text-navy' : 'text-red-500'}`}>
                        {selectedFaculty.avgAttendance}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Avg Subject Score
                      </p>
                      <p className={`font-black text-xl ${selectedFaculty.avgSubjectScore >= 60 ? 'text-navy' : 'text-amber-500'}`}>
                        {selectedFaculty.avgSubjectScore}/100
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        CO Avg
                      </p>
                      <p className="font-black text-xl text-navy">
                        {selectedFaculty.co}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center relative">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Alerts
                      </p>
                      <p className={`font-black text-xl ${selectedFaculty.alerts > 15 ? 'text-red-500' : 'text-navy'}`}>
                        {selectedFaculty.alerts}
                      </p>
                    </div>
                  </div>

                  {/* AI Insights & Dean Notices */}
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain size={18} className="text-indigo-600" />
                      <h3 className="font-bold text-indigo-900 text-base">
                        AI Insights for Dean
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedFaculty.aiInsights?.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-indigo-500 mt-0.5">
                            <Zap size={16} />
                          </span>
                          <span className="text-sm text-indigo-900 font-medium leading-relaxed">
                            {insight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Student Reviews & Voice */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-navy text-base flex items-center gap-2">
                        <UserCheck size={18} className="text-blue-500" /> Student Voice
                      </h3>
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                        Style: {selectedFaculty.teachingStyle}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedFaculty.studentReviews?.map((review, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-500 ml-2 font-bold">{review.rating}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Anonymous</span>
                          </div>
                          <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why This Score */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-navy text-base mb-4">
                      Why This Score
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">
                          <CheckCircle2 size={18} />
                        </span>
                        <span className="text-sm text-gray-700">
                          Highest student improvement rate in department — 14.2%
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">
                          <CheckCircle2 size={18} />
                        </span>
                        <span className="text-sm text-gray-700">
                          CO1 and CO2 attainment both exceed 80% — above NBA
                          target
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">
                          <CheckCircle2 size={18} />
                        </span>
                        <span className="text-sm text-gray-700">
                          Only 4 alerts generated — lowest in CSE faculty
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">
                          <CheckCircle2 size={18} />
                        </span>
                        <span className="text-sm text-gray-700">
                          Students show consistent growth across all 3 units
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Teaching Approach Analysis */}
                  <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 shadow-sm">
                    <h3 className="font-bold text-teal-900 text-base mb-3">
                      Teaching Approach Analysis
                    </h3>
                    <p className="text-sm text-teal-800 leading-relaxed mb-6">
                      Based on student performance patterns,{" "}
                      {selectedFaculty.name.split(" ")[0]}'s teaching approach
                      appears to be strongly practical-oriented. Her DSA
                      students show 23% higher practical scores vs theory
                      compared to department average. Her algorithm
                      visualization methodology appears particularly effective —
                      Unit 2 scores jumped 11 points after she introduced
                      diagram-based problem solving.
                    </p>

                    <div className="h-[150px] w-full bg-white rounded-lg p-3 border border-teal-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={facultyImprovementChartData}
                          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f3f4f6"
                          />
                          <XAxis
                            dataKey="unit"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            dy={5}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            domain={[60, 90]}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Department Recommendation */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="font-bold text-blue-900 text-base mb-2">
                      Department Recommendation
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed mb-5">
                      {selectedFaculty.name.split(" ")[0]}'s practical
                      visualization methodology should be documented and shared
                      as a best practice with other DSA faculty. Recommend
                      organizing a 2-hour knowledge sharing session for all CS
                      faculty this semester.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-teal-600 text-white font-bold text-sm rounded-lg hover:bg-teal-700 transition shadow-sm"
                      >
                        Schedule Knowledge Share
                      </button>
                      <button
                        onClick={() => setIsPanelOpen(false)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab !== "Overview" && (
                <div className="p-8 text-center text-gray-500 font-medium">
                  This tab content is available in the full version.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* MODAL: Schedule Knowledge Share */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-teal-50/50">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <Calendar size={20} className="text-teal-600" /> Schedule
                Session
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6">
              <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">
                  Topic: <strong>Practical Visualization Methodology</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Speaker: <strong>{selectedFaculty?.name}</strong>
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-gray-700"
                      required
                      defaultValue="14:00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Participants
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-gray-700"
                    required
                  >
                    <option value="">Select Audience...</option>
                    <option value="all_cs">All CSE Faculty</option>
                    <option value="all_faculty">All CSE Department Faculty</option>
                    <option value="dsa_faculty">
                      DSA & Algorithms Faculty
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition shadow-sm"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          {toastMessage}
        </div>
      )}
    </>
  );
}

