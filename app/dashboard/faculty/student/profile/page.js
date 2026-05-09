/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Activity,
  BookOpen,
  Bell,
  FileText,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  AlertTriangle,
  MessageSquare,
  ArrowLeft,
  Plus,
  Target,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  Filter,
  Star,
  Users,
  Award,
  Grid,
  CheckCircle,
  Zap,
  AlertCircle,
  Plug,
  ExternalLink,
  Brain,
} from "lucide-react";
import { FACULTY_PROFILE } from '../../../../../lib/faculty/mock-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageSquare, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
];

const dbmsTrend = [
  { unit: "Unit 1", score: 78 },
  { unit: "Unit 2", score: 74 },
  { unit: "Unit 3", score: 71 },
];

const osTrend = [
  { unit: "Unit 1", score: 71 },
  { unit: "Unit 2", score: 68 },
  { unit: "Unit 3", score: 63 },
];

const radarData = [
  { subject: "Logical", A: 65, fullMark: 100 },
  { subject: "Linguistic", A: 58, fullMark: 100 },
  { subject: "Spatial", A: 72, fullMark: 100 },
  { subject: "Kinesthetic", A: 84, fullMark: 100 },
  { subject: "Interpersonal", A: 71, fullMark: 100 },
  { subject: "Intrapersonal", A: 63, fullMark: 100 },
  { subject: "Technical", A: 78, fullMark: 100 },
];

const STUDENT_LIST = [
  { name: 'Siddharth Rao',    initials: 'SR', roll: '2CS38', section: 'B', spi: 94, att: 92, rank: 1,  subject: 'DBMS',  status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Ananya Verma',     initials: 'AV', roll: '2CS07', section: 'A', spi: 91, att: 95, rank: 2,  subject: 'OS',    status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Aryan Mehta',      initials: 'AM', roll: '2CS41', section: 'B', spi: 88, att: 90, rank: 3,  subject: 'DBMS',  status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Priya Sharma',     initials: 'PS', roll: '2CS18', section: 'A', spi: 85, att: 88, rank: 4,  subject: 'TOC',   status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Ritika Gupta',     initials: 'RG', roll: '2CS29', section: 'C', spi: 82, att: 91, rank: 5,  subject: 'DSA',   status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Aditya Kumar',     initials: 'AK', roll: '2CS03', section: 'A', spi: 80, att: 86, rank: 6,  subject: 'DBMS',  status: 'Strong',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Priyanshu Raj',    initials: 'PR', roll: '2CS04', section: 'C', spi: 78, att: 83, rank: 7,  subject: 'OS',    status: 'On Track', statusColor: 'bg-blue-100 text-blue-700'  },
  { name: 'Mahesh Singh',     initials: 'MS', roll: '2CS22', section: 'B', spi: 76, att: 79, rank: 8,  subject: 'DBMS',  status: 'On Track', statusColor: 'bg-blue-100 text-blue-700'  },
  { name: 'Tanvi Mishra',     initials: 'TM', roll: '2CS35', section: 'A', spi: 74, att: 84, rank: 9,  subject: 'TOC',   status: 'On Track', statusColor: 'bg-blue-100 text-blue-700'  },
  { name: 'Harsh Vardhan',    initials: 'HV', roll: '2CS16', section: 'B', spi: 72, att: 80, rank: 10, subject: 'DSA',   status: 'On Track', statusColor: 'bg-blue-100 text-blue-700'  },
  { name: 'Megha Tiwari',     initials: 'MT', roll: '2CS24', section: 'C', spi: 71, att: 77, rank: 11, subject: 'OS',    status: 'On Track', statusColor: 'bg-blue-100 text-blue-700'  },
  { name: 'Vikas Yadav',      initials: 'VY', roll: '2CS44', section: 'A', spi: 69, att: 82, rank: 12, subject: 'DBMS',  status: 'Watch',    statusColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Neha Joshi',       initials: 'NJ', roll: '2CS33', section: 'A', spi: 67, att: 80, rank: 13, subject: 'TOC',   status: 'Watch',    statusColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Divya Patel',      initials: 'DP', roll: '2CS14', section: 'C', spi: 65, att: 78, rank: 14, subject: 'DSA',   status: 'Watch',    statusColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Sumit Agarwal',    initials: 'SA', roll: '2CS31', section: 'B', spi: 63, att: 75, rank: 15, subject: 'OS',    status: 'Watch',    statusColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Pooja Rawat',      initials: 'PO', roll: '2CS27', section: 'A', spi: 61, att: 73, rank: 16, subject: 'DBMS',  status: 'Watch',    statusColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Nikhil Srivastava', initials: 'NS', roll: '2CS36', section: 'C', spi: 59, att: 70, rank: 17, subject: 'TOC',  status: 'At Risk',  statusColor: 'bg-red-100 text-red-700'    },
  { name: 'Karan Joshi',      initials: 'KJ', roll: '2CS15', section: 'B', spi: 56, att: 74, rank: 18, subject: 'DSA',   status: 'At Risk',  statusColor: 'bg-red-100 text-red-700'    },
  { name: 'Rohit Sharma',     initials: 'RS', roll: '2CS47', section: 'A', spi: 53, att: 71, rank: 19, subject: 'OS',    status: 'At Risk',  statusColor: 'bg-red-100 text-red-700'    },
  { name: 'Ankita Singh',     initials: 'AS', roll: '2CS09', section: 'C', spi: 51, att: 66, rank: 20, subject: 'DBMS',  status: 'At Risk',  statusColor: 'bg-red-100 text-red-700'    },
  { name: 'Deepak Verma',     initials: 'DV', roll: '2CS11', section: 'B', spi: 49, att: 65, rank: 21, subject: 'TOC',   status: 'At Risk',  statusColor: 'bg-red-100 text-red-700'    },
  { name: 'Sneha Patel',      initials: 'SP', roll: '2CS23', section: 'C', spi: 47, att: 68, rank: 22, subject: 'DSA',   status: 'Critical', statusColor: 'bg-red-500 text-white'      },
  { name: 'Ravi Shankar',     initials: 'RV', roll: '2CS43', section: 'A', spi: 43, att: 62, rank: 23, subject: 'OS',    status: 'Critical', statusColor: 'bg-red-500 text-white'      },
  { name: 'Pallavi Yadav',    initials: 'PY', roll: '2CS26', section: 'B', spi: 39, att: 59, rank: 24, subject: 'DBMS',  status: 'Critical', statusColor: 'bg-red-500 text-white'      },
  { name: 'Manish Gupta',     initials: 'MG', roll: '2CS21', section: 'C', spi: 35, att: 55, rank: 25, subject: 'TOC',   status: 'Critical', statusColor: 'bg-red-500 text-white'      },
];

export default function FacultyStudentProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeNav, setActiveNav] = useState("profiles");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Form states
  const [noteVisibility, setNoteVisibility] = useState("Shared with Dean");
  const [alertType, setAlertType] = useState("Attendance");
  const [alertSeverity, setAlertSeverity] = useState("High");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    setIsNoteModalOpen(false);
    showToast("Note added successfully");
  };

  const handleGenerateAlert = (e) => {
    e.preventDefault();
    setIsAlertModalOpen(false);
    showToast("Alert generated and sent to dean");
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
          SIDEBAR
      Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
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
                if (link.external) { window.open(link.external, '_blank'); return; }
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

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
          MAIN CONTENT
      Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Toggle sidebar"
          >
            <Settings size={20} />
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
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer group"
            aria-label="Profile menu"
          >
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

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-[#F3F4F6]">
          {!selectedStudent ? (
            <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in pb-20">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy">Student Profiles</h1>
                <p className="text-gray-500 text-sm mt-1">Select a student to view their detailed analytics and profile</p>
              </div>
              <div className="flex flex-col gap-2">
                {STUDENT_LIST.map((st, idx) => (
                  <button key={idx} onClick={() => setSelectedStudent(st)}
                    className="bg-white border border-gray-100 rounded-xl px-5 py-3.5 text-left hover:border-indigo-200 hover:shadow-sm transition-all group animate-fade-in flex items-center gap-4"
                    style={{ animationDelay: `${idx * 0.02}s` }}>
                    {/* Rank */}
                    <span className="text-xs font-bold text-gray-400 w-6 text-center flex-shrink-0">#{st.rank}</span>
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>
                      {st.initials}
                    </div>
                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy text-sm truncate">{st.name}</p>
                      <p className="text-xs text-gray-400">{st.roll} · Sec {st.section} · {st.subject}</p>
                    </div>
                    {/* SPI bar */}
                    <div className="hidden sm:flex flex-col items-end w-32">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${st.spi >= 75 ? 'bg-green-500' : st.spi >= 60 ? 'bg-yellow-400' : st.spi >= 45 ? 'bg-blue-500' : 'bg-red-500'}`}
                          style={{ width: `${st.spi}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">SPI {st.spi}</span>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-center hidden md:block">
                        <p className="text-base font-black text-navy">{st.spi}</p>
                        <p className="text-[10px] text-gray-400 uppercase">SPI</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-base font-black ${st.att < 75 ? 'text-red-600' : 'text-navy'}`}>{st.att}%</p>
                        <p className="text-[10px] text-gray-400 uppercase">Attend</p>
                      </div>
                    </div>
                    {/* Status badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${st.statusColor}`}>{st.status}</span>
                    <span className="text-xs font-bold text-indigo-600 group-hover:underline whitespace-nowrap">View →</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 font-medium text-sm flex items-center gap-2 hover:text-navy transition"
              >
                <ArrowLeft size={16} /> Back to Student List
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm flex items-center gap-2"
                >
                  <AlertTriangle size={16} /> Generate Alert
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Add Note
                </button>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #4338CA, #7C3AED)",
                    }}
                  >
                    AS
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-navy truncate">
                      {selectedStudent?.name ?? 'Mahesh Singh'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                      CSE · 2nd Year · Section B · Roll No: 2CS04
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider border border-indigo-100">
                        CSE 2nd Year
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100">
                        Web Development
                      </span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[10px] font-bold rounded uppercase tracking-wider border border-gray-100">
                        Team Player
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                      SPI
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-2xl font-black text-navy">72</span>
                    </div>
                    <p className="text-[10px] text-indigo-700 flex items-center justify-center gap-0.5 font-semibold">
                      <TrendingUp size={12} className="text-indigo-600" /> +3 this
                      month
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                      Attendance
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-2xl font-black text-navy">79%</span>
                    </div>
                    <p className="text-[10px] text-gray-600 flex items-center justify-center gap-0.5 font-semibold">
                      <CheckCircle2 size={12} className="text-indigo-600" /> Above
                      threshold
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                      Class Rank
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-2xl font-black text-navy">#34</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-semibold">
                      of 120 students
                    </p>
                  </div>
                  <button
                    type="button"
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-center hover:bg-gray-100/60 transition"
                    onClick={() => setActiveTab("Alert History")}
                  >
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                      Alerts
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-2xl font-black text-red-600">
                        2
                      </span>
                      <span className="text-sm font-bold text-gray-500">
                        active
                      </span>
                    </div>
                    <p className="text-[10px] text-red-600 font-bold">
                      1 high priority
                    </p>
                  </button>
                </div>

                <div className="w-full lg:w-auto flex flex-col gap-2">
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="w-full lg:w-56 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm text-left"
                  >
                    Add Behavioral Note
                  </button>
                  <button
                    onClick={() => setIsAlertModalOpen(true)}
                    className="w-full lg:w-56 px-4 py-2 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm text-left"
                  >
                    Generate Alert
                  </button>
                  <button
                    onClick={() =>
                      router.push("/dashboard/faculty/parent-communication")
                    }
                    className="w-full lg:w-56 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm text-left"
                  >
                    Send Parent Message
                  </button>
                  <button className="w-full lg:w-56 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm text-left">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
              {[
                "Overview",
                "Academic Details",
                "Skill Profile",
                "Faculty Notes",
                "Alert History",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-navy"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="animate-fade-in pt-2">
              {/* TAB 1 - OVERVIEW */}
              {activeTab === "Overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left Column */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-bold text-navy">
                        {(selectedStudent?.name ?? 'Mahesh').split(' ')[0]}'s Performance in {FACULTY_PROFILE.name}'s Subjects
                      </h3>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Subject 1 */}
                      <div className="border border-gray-100 rounded-xl p-4 pl-3 border-l-4 border-l-indigo-500 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-navy text-sm">
                              Database Management Systems
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Attendance:{" "}
                              <span className="font-bold text-green-600">
                                86%
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-navy leading-none">
                              71
                              <span className="text-sm font-bold text-gray-400">
                                /100
                              </span>
                            </span>
                            <div className="mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider inline-block">
                              Slight decline
                            </div>
                          </div>
                        </div>
                        <div className="h-[100px] w-full mt-4">
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart
                              data={dbmsTrend}
                              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
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
                                tick={{ fontSize: 10, fill: "#9ca3af" }}
                              />
                              <YAxis domain={[0, 100]} hide />
                              <Tooltip
                                cursor={{ stroke: "#f3f4f6" }}
                                contentStyle={{
                                  fontSize: "12px",
                                  borderRadius: "8px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                  fill: "#3B82F6",
                                  strokeWidth: 2,
                                  stroke: "#fff",
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded flex flex-wrap gap-3">
                          <span className="text-navy font-bold">
                            CO Contribution:
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO1:{" "}
                            <CheckCircle2 size={14} className="text-indigo-600" />
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO2:{" "}
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO3: <XCircle size={14} className="text-red-500" />
                          </span>
                        </div>
                      </div>

                      {/* Subject 2 */}
                      <div className="border border-gray-100 rounded-xl p-4 pl-3 border-l-4 border-l-blue-500 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-navy text-sm">
                              Operating Systems
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Attendance:{" "}
                              <span className="font-bold text-green-600">
                                80%
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-navy leading-none">
                              63
                              <span className="text-sm font-bold text-gray-400">
                                /100
                              </span>
                            </span>
                            <div className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider inline-block">
                              Declining
                            </div>
                          </div>
                        </div>
                        <div className="h-[100px] w-full mt-4">
                          <ResponsiveContainer width="100%" height={100}>
                            <LineChart
                              data={osTrend}
                              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
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
                                tick={{ fontSize: 10, fill: "#9ca3af" }}
                              />
                              <YAxis domain={[0, 100]} hide />
                              <Tooltip
                                cursor={{ stroke: "#f3f4f6" }}
                                contentStyle={{
                                  fontSize: "12px",
                                  borderRadius: "8px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#F59E0B"
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                  fill: "#F59E0B",
                                  strokeWidth: 2,
                                  stroke: "#fff",
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded flex flex-wrap gap-3">
                          <span className="text-navy font-bold">
                            CO Contribution:
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO1:{" "}
                            <CheckCircle2 size={14} className="text-indigo-600" />
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO2:{" "}
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                          </span>
                          <span className="inline-flex items-center gap-1">
                            CO3:{" "}
                            <AlertTriangle
                              size={14}
                              className="text-amber-500"
                            />
                          </span>
                        </div>
                      </div>

                      {/* Insight Box */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mt-4">
                        <AlertTriangle
                          className="text-amber-500 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <p className="text-sm text-amber-900 leading-relaxed font-medium">
                          Mahesh shows a consistent declining trend in both
                          subjects over 3 units. Theory exam performance is weak
                          but practical scores remain strong. Recommend targeted
                          theory revision support before Unit 4.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-navy">
                          Complete Academic Snapshot
                        </h3>
                      </div>
                      <div className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between group">
                            <div className="w-16 font-bold text-sm text-navy">
                              DBMS
                            </div>
                            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: "71%" }}
                              ></div>
                            </div>
                            <div className="w-24 flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">
                                71% <span className="text-gray-400">B+</span>
                              </span>
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="w-16 font-bold text-sm text-navy">
                              OS
                            </div>
                            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: "63%" }}
                              ></div>
                            </div>
                            <div className="w-24 flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">
                                63% <span className="text-gray-400">B</span>
                              </span>
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="w-16 font-bold text-sm text-navy">
                              TOC
                            </div>
                            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: "58%" }}
                              ></div>
                            </div>
                            <div className="w-24 flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">
                                58% <span className="text-gray-400">C+</span>
                              </span>
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="w-16 font-bold text-sm text-navy">
                              DSA
                            </div>
                            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: "79%" }}
                              ></div>
                            </div>
                            <div className="w-24 flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">
                                79% <span className="text-gray-400">A</span>
                              </span>
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-navy">
                          Skill Radar Preview
                        </h3>
                      </div>
                      <div className="p-5 flex flex-col items-center">
                        <div className="h-[200px] w-full max-w-[250px]">
                          <ResponsiveContainer width="100%" height={200}>
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="70%"
                              data={radarData}
                            >
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: "#6b7280", fontSize: 10 }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={false}
                                axisLine={false}
                              />
                              <Radar
                                name="Mahesh"
                                dataKey="A"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.5}
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full mt-4 space-y-2">
                          <div className="text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-100">
                            <span className="font-bold">Strongest:</span>{" "}
                            Kinesthetic (84) and Technical (78)
                          </div>
                          <div className="text-sm bg-red-50 text-red-800 px-3 py-2 rounded-lg border border-red-100">
                            <span className="font-bold">Weakest:</span>{" "}
                            Linguistic (58) — communication needs attention
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 - ACADEMIC DETAILS */}
              {activeTab === "Academic Details" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-navy text-lg">
                      All Assessments — Current Semester
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold rounded bg-gray-100 text-gray-700">
                        All Types
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-50 text-gray-500">
                        Exams
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-50 text-gray-500">
                        Assignments
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-50 text-gray-500">
                        Practicals
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="p-4 pl-6">Date</th>
                          <th className="p-4">Subject</th>
                          <th className="p-4">Assessment Type</th>
                          <th className="p-4 text-center">Max Marks</th>
                          <th className="p-4 text-center">Score</th>
                          <th className="p-4 text-center">Percentage</th>
                          <th className="p-4 pr-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            10 Apr 2026
                          </td>
                          <td className="p-4 font-bold text-navy">DBMS</td>
                          <td className="p-4 text-gray-700">Unit 3 Exam</td>
                          <td className="p-4 text-center text-gray-500">100</td>
                          <td className="p-4 text-center font-bold">71</td>
                          <td className="p-4 text-center font-bold">71%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                              On Track
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 bg-red-50/50 hover:bg-red-50">
                          <td className="p-4 pl-6 text-gray-500">8 Apr 2026</td>
                          <td className="p-4 font-bold text-navy">OS</td>
                          <td className="p-4 text-gray-700">Assignment 4</td>
                          <td className="p-4 text-center text-gray-500">25</td>
                          <td className="p-4 text-center text-red-600 font-bold text-xs uppercase tracking-wider">
                            Not submitted
                          </td>
                          <td className="p-4 text-center font-bold text-red-600">
                            0%
                          </td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                              Missing
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">1 Apr 2026</td>
                          <td className="p-4 font-bold text-navy">DSA</td>
                          <td className="p-4 text-gray-700">Unit 3 Exam</td>
                          <td className="p-4 text-center text-gray-500">100</td>
                          <td className="p-4 text-center font-bold">79</td>
                          <td className="p-4 text-center font-bold">79%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              Strong
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            28 Mar 2026
                          </td>
                          <td className="p-4 font-bold text-navy">DBMS</td>
                          <td className="p-4 text-gray-700">Assignment 3</td>
                          <td className="p-4 text-center text-gray-500">25</td>
                          <td className="p-4 text-center font-bold">23</td>
                          <td className="p-4 text-center font-bold">92%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              Excellent
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            25 Mar 2026
                          </td>
                          <td className="p-4 font-bold text-navy">OS</td>
                          <td className="p-4 text-gray-700">Unit 3 Exam</td>
                          <td className="p-4 text-center text-gray-500">100</td>
                          <td className="p-4 text-center font-bold">63</td>
                          <td className="p-4 text-center font-bold">63%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold">
                              Watch
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 bg-red-50/50 hover:bg-red-50">
                          <td className="p-4 pl-6 text-gray-500">
                            20 Mar 2026
                          </td>
                          <td className="p-4 font-bold text-navy">TOC</td>
                          <td className="p-4 text-gray-700">Assignment 2</td>
                          <td className="p-4 text-center text-gray-500">25</td>
                          <td className="p-4 text-center text-red-600 font-bold text-xs uppercase tracking-wider">
                            Not submitted
                          </td>
                          <td className="p-4 text-center font-bold text-red-600">
                            0%
                          </td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                              Missing
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            15 Mar 2026
                          </td>
                          <td className="p-4 font-bold text-navy">DBMS</td>
                          <td className="p-4 text-gray-700">Practical 3</td>
                          <td className="p-4 text-center text-gray-500">30</td>
                          <td className="p-4 text-center font-bold">27</td>
                          <td className="p-4 text-center font-bold">90%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              Excellent
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            10 Mar 2026
                          </td>
                          <td className="p-4 font-bold text-navy">OS</td>
                          <td className="p-4 text-gray-700">Practical 2</td>
                          <td className="p-4 text-center text-gray-500">30</td>
                          <td className="p-4 text-center font-bold">24</td>
                          <td className="p-4 text-center font-bold">80%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              Strong
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">5 Mar 2026</td>
                          <td className="p-4 font-bold text-navy">DSA</td>
                          <td className="p-4 text-gray-700">Assignment 2</td>
                          <td className="p-4 text-center text-gray-500">25</td>
                          <td className="p-4 text-center font-bold">22</td>
                          <td className="p-4 text-center font-bold">88%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                              Strong
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="p-4 pl-6 text-gray-500">
                            28 Feb 2026
                          </td>
                          <td className="p-4 font-bold text-navy">TOC</td>
                          <td className="p-4 text-gray-700">Unit 2 Exam</td>
                          <td className="p-4 text-center text-gray-500">100</td>
                          <td className="p-4 text-center font-bold">61</td>
                          <td className="p-4 text-center font-bold">61%</td>
                          <td className="p-4 pr-6">
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold">
                              Watch
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-5 bg-red-50 border-t border-red-100 flex gap-3">
                    <AlertTriangle
                      className="text-red-500 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-sm font-medium text-red-900">
                      2 missing assignment submissions detected. This is
                      affecting Mahesh's consistency score in SPI.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3 - SKILL PROFILE */}
              {activeTab === "Skill Profile" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-navy">
                          Comprehensive Skill Map
                        </h3>
                      </div>
                      <div className="p-5 flex justify-center">
                        <div className="h-[350px] w-full max-w-[400px]">
                          <ResponsiveContainer width="100%" height={350}>
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="70%"
                              data={radarData}
                            >
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                  fill: "#4b5563",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={false}
                                axisLine={false}
                              />
                              <Radar
                                name="Mahesh Singh"
                                dataKey="A"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fill="#3B82F6"
                                fillOpacity={0.6}
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl border border-blue-200 overflow-hidden">
                      <div className="p-4 border-b border-blue-200 bg-blue-100">
                        <h4 className="font-bold text-blue-900 text-sm">
                          Faculty Perspective — Mahesh Singh
                        </h4>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-blue-900 leading-relaxed font-medium">
                          Mahesh's Kinesthetic and Technical scores (84 and 78)
                          indicate a strong hands-on learner. His declining
                          theory exam scores are inconsistent with his practical
                          performance — suggesting exam anxiety or a theory
                          study gap rather than an actual knowledge gap.
                          Recommend practical-theory bridging exercises.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-navy">
                          Project Portfolio
                        </h3>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-navy text-lg">
                              Lung Cancer Detection using CNN
                            </h4>
                            <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded">
                              Completed
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            Python · TensorFlow · Keras · OpenCV
                          </p>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            A deep learning model to detect lung cancer nodules
                            from CT scan images with 94% accuracy. Deployed as a
                            web API.
                          </p>

                          {/* Faculty Section */}
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                              Faculty Rating by: Prof. Pushpendra Kumar
                            </p>
                            <div className="flex gap-1 mb-2 text-amber-500">
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} fill="currentColor" />
                              <Star size={14} className="text-gray-300" />
                            </div>
                            <p className="text-sm text-gray-700 italic">
                              "Excellent implementation of CNN model.
                              Documentation could be improved."
                            </p>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-navy text-lg">
                              Smart Attendance System
                            </h4>
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase rounded">
                              In Progress
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            React · Node.js · MongoDB
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Building an RFID and face-recognition based
                            attendance tracking system for the department.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-navy">
                          Skill Gap for Placement
                        </h3>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-navy text-sm">
                            Tier 3 Companies
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full">
                            89% Ready
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-navy text-sm">
                            Tier 2 Companies
                          </span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full">
                            68% Ready
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-navy text-sm">
                            Tier 1 Companies
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full">
                            31% Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4 - FACULTY NOTES */}
              {activeTab === "Faculty Notes" && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Add Note Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b border-blue-100">
                      <h3 className="font-bold text-navy flex items-center gap-2">
                        <Plus size={18} className="text-blue-600" /> Add New
                        Note
                      </h3>
                    </div>
                    <div className="p-5">
                      <textarea
                        className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px] resize-none"
                        placeholder="Add a behavioral observation, academic note, or any relevant comment about this student..."
                      ></textarea>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-700">
                            Note visibility:
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="vis"
                              id="vis1"
                              className="text-blue-600"
                            />
                            <label
                              htmlFor="vis1"
                              className="text-sm text-gray-600 cursor-pointer"
                            >
                              Private (only you)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="vis"
                              id="vis2"
                              defaultChecked
                              className="text-blue-600"
                            />
                            <label
                              htmlFor="vis2"
                              className="text-sm text-gray-600 cursor-pointer"
                            >
                              Shared with Dean
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="vis"
                              id="vis3"
                              className="text-blue-600"
                            />
                            <label
                              htmlFor="vis3"
                              className="text-sm text-gray-600 cursor-pointer"
                            >
                              Shared with Student
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast("Note added")}
                          className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  <div className="space-y-4">
                    {/* Note 1 */}
                    <div className="bg-blue-50/50 rounded-2xl border border-gray-200 border-l-4 border-l-indigo-500 p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy text-sm">
                            Prof. Pushpendra Kumar
                          </span>
                          <span className="text-xs text-gray-500">
                            · 5 Apr 2026
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded uppercase tracking-wider">
                          Shared with Dean
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Mahesh shows excellent understanding in lab sessions but
                        needs to focus more on theoretical concepts. His DBMS
                        practical work is outstanding — best in class for the
                        CNN lab. Theory exam preparation needs work.
                      </p>
                      <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <button className="hover:text-blue-600 transition">
                          Edit
                        </button>
                        <button className="hover:text-red-600 transition">
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Note 2 */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy text-sm">
                            Prof. Pushpendra Kumar
                          </span>
                          <span className="text-xs text-gray-500">
                            · 20 Mar 2026
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                          Private
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Noticed Mahesh helping classmates with React code during
                        lab session unprompted. Good interpersonal skills.
                        Consider recommending for TA role next semester.
                      </p>
                      <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <button className="hover:text-blue-600 transition">
                          Edit
                        </button>
                        <button className="hover:text-red-600 transition">
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Note 3 */}
                    <div className="bg-purple-50/30 rounded-2xl border border-gray-200 border-l-4 border-l-purple-500 p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy text-sm">
                            Prof. Suresh Iyer
                          </span>
                          <span className="text-xs text-gray-500">
                            · 15 Mar 2026
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded uppercase tracking-wider">
                          Shared with Dean
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Good participation in TOC class discussions. Attendance
                        needs improvement — has been late to class 3 times this
                        month. Spoke to him — commute issue cited.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5 - ALERT HISTORY */}
              {activeTab === "Alert History" && (
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Active Alerts */}
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      Active Alerts
                    </h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {/* Alert 1 */}
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-100 text-red-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2">
                          <AlertTriangle size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-red-200 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">
                              High
                            </span>
                            <span className="text-xs font-bold text-red-500">
                              Active
                            </span>
                          </div>
                          <h4 className="font-bold text-navy text-sm mb-1">
                            TOC Attendance Warning — 74%
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">
                            Generated: 13 April 2026 by AI
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                            <p className="text-xs font-bold text-gray-600 mb-1">
                              Faculty action:
                            </p>
                            <p className="text-sm text-gray-800">
                              Not yet taken
                            </p>
                          </div>
                          <button className="w-full py-2 bg-white border border-red-200 text-red-600 font-bold text-xs rounded-lg hover:bg-red-50 transition">
                            Log Intervention
                          </button>
                        </div>
                      </div>

                      {/* Alert 2 */}
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-amber-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2">
                          <TrendingDown size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-amber-200 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
                              Medium
                            </span>
                            <span className="text-xs font-bold text-amber-500">
                              Active
                            </span>
                          </div>
                          <h4 className="font-bold text-navy text-sm mb-1">
                            OS Score Decline — Unit 3 to 63%
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">
                            Generated: 10 April 2026 by AI
                          </p>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                            <p className="text-xs font-bold text-gray-600 mb-1">
                              Faculty action:
                            </p>
                            <p className="text-sm text-gray-800">
                              Noted — monitoring
                            </p>
                          </div>
                          <button className="w-full py-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-lg hover:bg-amber-100 transition">
                            Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resolved Alerts */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      Resolved Alerts
                    </h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                      {/* Alert 3 */}
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition opacity-75">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-500 font-bold">
                              Generated: 1 Mar 2026
                            </span>
                            <span className="text-xs font-bold text-green-600">
                              Resolved: 5 Mar
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-500 text-sm mb-3 line-through">
                            DBMS Assignment 2 Submitted Late
                          </h4>

                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                            <p className="text-xs font-bold text-gray-500 mb-1">
                              Action taken:
                            </p>
                            <p className="text-sm text-gray-700">
                              Student given 3-day extension — submitted
                            </p>
                          </div>
                          <div className="inline-block mt-1 px-2 py-1 bg-green-50 text-green-700 font-bold text-xs rounded border border-green-100">
                            Outcome: Positive
                          </div>
                        </div>
                      </div>

                      {/* Alert 4 */}
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-1/2">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition opacity-75">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-500 font-bold">
                              Generated: 15 Feb 2026
                            </span>
                            <span className="text-xs font-bold text-green-600">
                              Resolved: 28 Feb
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-500 text-sm mb-3 line-through">
                            Attendance Warning — OS 73%
                          </h4>

                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                            <p className="text-xs font-bold text-gray-500 mb-1">
                              Action taken:
                            </p>
                            <p className="text-sm text-gray-700">
                              Parent notified, student attended all classes
                            </p>
                          </div>
                          <div className="inline-block mt-1 px-2 py-1 bg-green-50 text-green-700 font-bold text-xs rounded border border-green-100">
                            Outcome: Positive — attendance recovered to 80%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD NOTE */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <Plus size={20} className="text-blue-600" /> Add Behavioral Note
              </h2>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Note for Mahesh Singh
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition min-h-[120px] resize-none"
                  placeholder="Type your observation here..."
                  autoFocus
                  required
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Note visibility:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${noteVisibility === "Private" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                    >
                      {noteVisibility === "Private" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      checked={noteVisibility === "Private"}
                      onChange={() => setNoteVisibility("Private")}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Private</p>
                      <p className="text-xs text-gray-500">
                        Only you can see this note
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${noteVisibility === "Shared with Dean" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                    >
                      {noteVisibility === "Shared with Dean" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      checked={noteVisibility === "Shared with Dean"}
                      onChange={() => setNoteVisibility("Shared with Dean")}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Shared with Dean
                      </p>
                      <p className="text-xs text-gray-500">
                        Visible to department head and counselors
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${noteVisibility === "Shared with Student" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                    >
                      {noteVisibility === "Shared with Student" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      checked={noteVisibility === "Shared with Student"}
                      onChange={() => setNoteVisibility("Shared with Student")}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Shared with Student
                      </p>
                      <p className="text-xs text-gray-500">
                        Student will see this on their profile
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GENERATE ALERT */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-red-50/30">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Generate
                Manual Alert
              </h2>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleGenerateAlert} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Alert Type
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                  >
                    <option value="Attendance">Attendance Issue</option>
                    <option value="Score Decline">Score Decline</option>
                    <option value="Missing Assignment">
                      Missing Assignment
                    </option>
                    <option value="Behavioral">Behavioral Concern</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Severity Level
                </label>
                <div className="flex gap-3">
                  {["High", "Medium", "Low"].map((sev) => (
                    <label
                      key={sev}
                      className={`flex-1 flex justify-center items-center py-2.5 rounded-lg border cursor-pointer transition-all ${alertSeverity === sev ? (sev === "High" ? "bg-red-50 border-red-500 text-red-700 font-bold shadow-sm" : sev === "Medium" ? "bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-sm" : "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm") : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        className="hidden"
                        checked={alertSeverity === sev}
                        onChange={() => setAlertSeverity(sev)}
                      />
                      {sev}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition min-h-[100px] resize-none"
                  placeholder="Provide context for the dean or counselor..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition shadow-sm"
                >
                  Generate Alert
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
    </div>
  );
}
