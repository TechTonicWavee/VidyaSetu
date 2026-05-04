'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, LineChart, BarChart2, Users, BookOpen, FileText, Settings, Bell, Search,
  ChevronDown, Download, Share2, CheckCircle2, TrendingUp, AlertTriangle, MessageSquare, Target, XCircle, Cpu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart as RechartsLineChart, Line
} from 'recharts'

const navLinks = [
  { id: 'department',  label: 'Department Overview',  icon: LayoutDashboard, path: '/dashboard/dean/department' },
  { id: 'forecasting', label: 'Cohort Forecasting',   icon: LineChart,       path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',label: 'Cross-Branch Insights',icon: BarChart2,       path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',     label: 'Faculty Analytics',    icon: Users,           path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',  label: 'Curriculum Gaps',      icon: BookOpen,        path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation', icon: Cpu,             path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',     label: 'Reports',              icon: FileText,        path: '/dashboard/dean/reports' },
]

const headToHeadData = [
  { metric: 'Health Score', CSE: 76, IT: 71, ECE: 69 },
  { metric: 'SPI Average', CSE: 67, IT: 64, ECE: 63 },
  { metric: 'Placement Ready', CSE: 64, IT: 59, ECE: 57 },
  { metric: 'CO Attainment', CSE: 71, IT: 68, ECE: 65 },
  { metric: 'Faculty Effectiveness', CSE: 79, IT: 74, ECE: 71 },
  { metric: 'Student Satisfaction', CSE: 74, IT: 71, ECE: 68 },
]

const spiDistributionData = [
  { range: 'Below 45', CSE: 3, IT: 5, ECE: 7 },
  { range: '45-54', CSE: 11, IT: 14, ECE: 16 },
  { range: '55-64', CSE: 28, IT: 31, ECE: 33 },
  { range: '65-74', CSE: 31, IT: 29, ECE: 27 },
  { range: '75-84', CSE: 20, IT: 17, ECE: 14 },
  { range: '85+', CSE: 7, IT: 4, ECE: 3 },
]

const healthTrendData = [
  { term: 'S1 2025', CSE: 71, IT: 66, ECE: 63 },
  { term: 'S2 2025', CSE: 73, IT: 68, ECE: 65 },
  { term: 'S1 2026', CSE: 76, IT: 71, ECE: 69 },
  { term: 'S2 2026', CSE: 79, IT: 73, ECE: 71, predicted: true },
]

export default function CrossBranchInsights() {
  const router = useRouter()
  const [activeNav] = useState('cross-branch')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState('all') // 'all', 'CSE', 'IT', 'ECE'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const openRecommendationModal = (to) => {
    setModalTitle(`Send best practice recommendation to ${to}?`)
    setModalMessage("I strongly recommend reviewing this best practice and exploring ways to adapt it for your branch.")
    setIsModalOpen(true)
  }

  const sendRecommendation = (e) => {
    e.preventDefault()
    setIsModalOpen(false)
    showToast(`Recommendation sent`)
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-navy flex flex-col transition-all duration-300 shadow-xl z-20`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-navy font-bold text-sm flex-shrink-0 bg-white">DR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-white truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-blue-200 truncate">Dean of Academics</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4F46E5' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search branches, insights..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-navy font-bold text-xs bg-gray-200">DR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-8 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Cross-Branch Insights</h1>
                <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">Compare CSE, IT and ECE across every performance dimension — identify which branches need support and which practices to replicate</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                  <Share2 size={16} /> Share with Faculty Heads
                </button>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                  <Download size={16} /> Export Comparison Report
                </button>
              </div>
            </div>

            {/* TOP - Branch Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CSE Card */}
              <div 
                onClick={() => setSelectedBranch(selectedBranch === 'CSE' ? 'all' : 'CSE')}
                className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-300 relative ${selectedBranch === 'CSE' || selectedBranch === 'all' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
              >
                <div className="h-1.5 w-full bg-blue-500"></div>
                <div className="p-5">
                  {(selectedBranch === 'CSE' || selectedBranch === 'all') && <div className="absolute top-4 right-4 text-blue-500"><CheckCircle2 size={20} /></div>}
                  <h3 className="font-bold text-navy text-lg pr-8 mb-4">Computer Science & Engineering</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6">
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-500" /> 480 Students</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-blue-500" /> 18 Faculty</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Health Score</p>
                      <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-lg font-black text-xl">
                        76
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">SPI Average</p>
                      <p className="font-bold text-navy text-xl">67.4</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Placement Ready</p>
                      <p className="font-bold text-navy text-xl">64%</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Alerts</p>
                      <p className="font-bold text-navy text-xl">18</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IT Card */}
              <div 
                onClick={() => setSelectedBranch(selectedBranch === 'IT' ? 'all' : 'IT')}
                className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-300 relative ${selectedBranch === 'IT' || selectedBranch === 'all' ? 'border-teal-500 ring-4 ring-teal-500/10' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
              >
                <div className="h-1.5 w-full bg-teal-500"></div>
                <div className="p-5">
                  {(selectedBranch === 'IT' || selectedBranch === 'all') && <div className="absolute top-4 right-4 text-teal-500"><CheckCircle2 size={20} /></div>}
                  <h3 className="font-bold text-navy text-lg pr-8 mb-4">Information Technology</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6">
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-teal-500" /> 420 Students</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-teal-500" /> 16 Faculty</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Health Score</p>
                      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-black text-xl">
                        71
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">SPI Average</p>
                      <p className="font-bold text-navy text-xl">64.1</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Placement Ready</p>
                      <p className="font-bold text-navy text-xl">59%</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Alerts</p>
                      <p className="font-bold text-navy text-xl">16</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ECE Card */}
              <div 
                onClick={() => setSelectedBranch(selectedBranch === 'ECE' ? 'all' : 'ECE')}
                className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-300 relative ${selectedBranch === 'ECE' || selectedBranch === 'all' ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
              >
                <div className="h-1.5 w-full bg-purple-500"></div>
                <div className="p-5">
                  {(selectedBranch === 'ECE' || selectedBranch === 'all') && <div className="absolute top-4 right-4 text-purple-500"><CheckCircle2 size={20} /></div>}
                  <h3 className="font-bold text-navy text-lg pr-8 mb-4">Electronics & Communication</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6">
                    <span className="flex items-center gap-1.5"><Users size={16} className="text-purple-500" /> 340 Students</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-purple-500" /> 14 Faculty</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Health Score</p>
                      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-black text-xl">
                        69
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">SPI Average</p>
                      <p className="font-bold text-navy text-xl">62.8</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Placement Ready</p>
                      <p className="font-bold text-navy text-xl">57%</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Alerts</p>
                      <p className="font-bold text-navy text-xl">13</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION A - Head to Head Comparison */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
              <h2 className="text-xl font-bold text-navy mb-6">Branch Performance Comparison — All Key Metrics</h2>
              
              <div className="h-[350px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={headToHeadData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />

                    {/* Only show selected bars, or all if 'all' is selected */}
                    {(selectedBranch === 'all' || selectedBranch === 'CSE') && <Bar dataKey="CSE" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />}
                    {(selectedBranch === 'all' || selectedBranch === 'IT') && <Bar dataKey="IT" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={20} />}
                    {(selectedBranch === 'all' || selectedBranch === 'ECE') && <Bar dataKey="ECE" fill="#A855F7" radius={[4, 4, 0, 0]} barSize={20} />}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="text-blue-600 mt-0.5"><TrendingUp size={20} /></div>
                <p className="text-blue-900 text-sm font-medium leading-relaxed">
                  CSE leads in all 6 metrics. The gap between CSE and ECE in Placement Readiness (7 points) and CO Attainment (6 points) is the most significant divergence and warrants targeted intervention in ECE. IT's Faculty Effectiveness score has improved the most this semester — up 8 points.
                </p>
              </div>
            </div>

            {/* SECTION B - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SPI Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-navy mb-6">SPI Distribution Comparison</h2>
                
                <div className="h-[250px] w-full mb-6 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={spiDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(val) => `${val}%`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value}%`, undefined]} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                      
                      {(selectedBranch === 'all' || selectedBranch === 'CSE') && <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                      {(selectedBranch === 'all' || selectedBranch === 'IT') && <Line type="monotone" dataKey="IT" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                      {(selectedBranch === 'all' || selectedBranch === 'ECE') && <Line type="monotone" dataKey="ECE" stroke="#A855F7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mt-auto">
                  <p className="text-purple-900 text-sm font-medium leading-relaxed">
                    ECE has 7% of students below SPI 45 vs CSE's 3%. Early intervention in ECE 1st and 2nd year could significantly close this gap.
                  </p>
                </div>
              </div>

              {/* Semester Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-navy mb-6">Department Health Trend — 4 Semesters</h2>
                
                <div className="h-[250px] w-full mb-6 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={healthTrendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} domain={[50, 85]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                      
                      {(selectedBranch === 'all' || selectedBranch === 'CSE') && <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} strokeDasharray={(d) => d.predicted ? "5 5" : ""} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                      {(selectedBranch === 'all' || selectedBranch === 'IT') && <Line type="monotone" dataKey="IT" stroke="#14B8A6" strokeWidth={3} strokeDasharray={(d) => d.predicted ? "5 5" : ""} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                      {(selectedBranch === 'all' || selectedBranch === 'ECE') && <Line type="monotone" dataKey="ECE" stroke="#A855F7" strokeWidth={3} strokeDasharray={(d) => d.predicted ? "5 5" : ""} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-auto">
                  <p className="text-green-800 text-sm font-medium leading-relaxed">
                    All 3 branches are on an upward trajectory. CSE is improving fastest at +2.5 points per semester. If current trends hold, all 3 branches will exceed 70 health score by S2 2026.
                  </p>
                </div>
              </div>

            </div>

            {/* SECTION C - Placement Comparison Deep Dive */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
              <h2 className="text-xl font-bold text-navy mb-6">Placement Readiness — Final Year Batch Comparison</h2>
              
              <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 pl-6">Metric</th>
                      <th className={`p-4 text-center transition-colors ${selectedBranch === 'CSE' ? 'bg-blue-50/50 text-blue-800' : ''}`}>CSE 2022</th>
                      <th className={`p-4 text-center transition-colors ${selectedBranch === 'IT' ? 'bg-teal-50/50 text-teal-800' : ''}`}>IT 2022</th>
                      <th className={`p-4 text-center pr-6 transition-colors ${selectedBranch === 'ECE' ? 'bg-purple-50/50 text-purple-800' : ''}`}>ECE 2022</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium">
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50 text-navy">
                      <td className="p-4 pl-6 font-bold">Total final year students</td>
                      <td className={`p-4 text-center ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>360</td>
                      <td className={`p-4 text-center ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>310</td>
                      <td className={`p-4 text-center pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>260</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 pl-6 text-gray-700">Tier 1 ready (SPI 85+)</td>
                      <td className={`p-4 text-center text-green-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>43 (12%)</td>
                      <td className={`p-4 text-center text-teal-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>28 (9%)</td>
                      <td className={`p-4 text-center text-amber-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>18 (7%)</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 pl-6 text-gray-700">Tier 2 ready (SPI 75-84)</td>
                      <td className={`p-4 text-center text-green-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>189 (52%)</td>
                      <td className={`p-4 text-center text-teal-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>148 (48%)</td>
                      <td className={`p-4 text-center text-amber-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>112 (43%)</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 pl-6 text-gray-700">Tier 3 ready (SPI 65-74)</td>
                      <td className={`p-4 text-center text-blue-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>96 (27%)</td>
                      <td className={`p-4 text-center text-blue-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>95 (31%)</td>
                      <td className={`p-4 text-center text-blue-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>84 (32%)</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50 bg-gray-50/50">
                      <td className="p-4 pl-6 text-gray-700 font-bold">Not ready (below SPI 65)</td>
                      <td className={`p-4 text-center text-red-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/50' : ''}`}>32 (9%)</td>
                      <td className={`p-4 text-center text-red-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/50' : ''}`}>39 (12%)</td>
                      <td className={`p-4 text-center text-red-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/50' : ''}`}>46 (18%)</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 pl-6 text-navy font-bold">Predicted placement rate</td>
                      <td className={`p-4 text-center text-amber-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>61%</td>
                      <td className={`p-4 text-center text-amber-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>54%</td>
                      <td className={`p-4 text-center text-red-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>49%</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50 text-gray-500">
                      <td className="p-4 pl-6">Last year placement rate</td>
                      <td className={`p-4 text-center ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>54%</td>
                      <td className={`p-4 text-center ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>48%</td>
                      <td className={`p-4 text-center pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>43%</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-4 pl-6 font-bold">Year over year change</td>
                      <td className={`p-4 text-center text-green-600 font-bold ${selectedBranch === 'CSE' ? 'bg-blue-50/30' : ''}`}>+7%</td>
                      <td className={`p-4 text-center text-green-600 font-bold ${selectedBranch === 'IT' ? 'bg-teal-50/30' : ''}`}>+6%</td>
                      <td className={`p-4 text-center text-green-600 font-bold pr-6 ${selectedBranch === 'ECE' ? 'bg-purple-50/30' : ''}`}>+6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-5 rounded-xl border border-blue-200 bg-blue-50/50 transition-opacity ${selectedBranch === 'IT' || selectedBranch === 'ECE' ? 'opacity-40' : 'opacity-100'}`}>
                  <p className="text-sm text-blue-900 font-medium"><span className="font-bold text-blue-700 block mb-1">CSE Focus:</span> Move 32 'Not Ready' students to Tier 3 readiness. Potential to reach 71% placement rate.</p>
                </div>
                <div className={`p-5 rounded-xl border border-teal-200 bg-teal-50/50 transition-opacity ${selectedBranch === 'CSE' || selectedBranch === 'ECE' ? 'opacity-40' : 'opacity-100'}`}>
                  <p className="text-sm text-teal-900 font-medium"><span className="font-bold text-teal-700 block mb-1">IT Focus:</span> 39 'Not Ready' students need targeted DSA and communication intervention in next 3 months.</p>
                </div>
                <div className={`p-5 rounded-xl border border-purple-200 bg-purple-50/50 transition-opacity ${selectedBranch === 'CSE' || selectedBranch === 'IT' ? 'opacity-40' : 'opacity-100'}`}>
                  <p className="text-sm text-purple-900 font-medium"><span className="font-bold text-purple-700 block mb-1">ECE Focus:</span> ECE has highest 'Not Ready' percentage at 18% — circuit design and embedded systems skills gap is primary driver.</p>
                </div>
              </div>
            </div>

            {/* SECTION D - Best Practices Exchange */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-navy mb-1">What's Working — Cross-Branch Best Practices</h2>
                <p className="text-sm text-gray-500">Practices from high-performing branches that can be replicated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Practice 1 */}
                <div className="border-2 border-green-200 rounded-xl p-5 flex flex-col bg-white">
                  <div className="mb-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200 inline-block mb-3">From: CSE Branch</span>
                    <h4 className="font-bold text-navy text-base mb-2">Project-based assessment at 40% weightage in core subjects</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-1">
                    <p className="text-sm font-bold text-gray-700 mb-1">Impact:</p>
                    <p className="text-sm text-gray-600 mb-3">CSE project scores are 14% higher than IT and ECE for the same subject material.</p>
                    
                    <p className="text-sm font-bold text-gray-700 mb-1">Replication:</p>
                    <p className="text-sm text-gray-600">Applicable to IT — recommend adopting in 2026-27.</p>
                  </div>
                  
                  <button onClick={() => openRecommendationModal('Prof. Meena Rao (IT HOD)')} className="w-full py-2 bg-white border border-blue-200 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition">
                    Recommend to IT HOD
                  </button>
                </div>

                {/* Practice 2 */}
                <div className="border-2 border-green-200 rounded-xl p-5 flex flex-col bg-white">
                  <div className="mb-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200 inline-block mb-3">From: CSE Branch</span>
                    <h4 className="font-bold text-navy text-base mb-2">Mandatory hackathon participation once per year</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-1">
                    <p className="text-sm font-bold text-gray-700 mb-1">Impact:</p>
                    <p className="text-sm text-gray-600 mb-3">CSE extracurricular SPI dimension is 9 points higher than ECE average.</p>
                    
                    <p className="text-sm font-bold text-gray-700 mb-1">Replication:</p>
                    <p className="text-sm text-gray-600">Applicable to all branches immediately.</p>
                  </div>
                  
                  <button onClick={() => openRecommendationModal('All HODs')} className="w-full py-2 bg-white border border-blue-200 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition">
                    Recommend to All HODs
                  </button>
                </div>

                {/* Practice 3 */}
                <div className="border-2 border-teal-200 rounded-xl p-5 flex flex-col bg-white">
                  <div className="mb-4">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-700 font-bold text-[10px] uppercase rounded border border-teal-200 inline-block mb-3">From: IT Branch</span>
                    <h4 className="font-bold text-navy text-base mb-2">Industry guest lectures monthly — IT has 8 this semester</h4>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-1">
                    <p className="text-sm font-bold text-gray-700 mb-1">Impact:</p>
                    <p className="text-sm text-gray-600 mb-3">IT interpersonal SPI dimension improved 7 points this semester — highest of 3 branches.</p>
                    
                    <p className="text-sm font-bold text-gray-700 mb-1">Replication:</p>
                    <p className="text-sm text-gray-600">CSE and ECE have only 2 guest lectures each.</p>
                  </div>
                  
                  <button onClick={() => openRecommendationModal('CSE + ECE HODs')} className="w-full py-2 bg-white border border-blue-200 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition">
                    Recommend to CSE + ECE
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* MODAL: Recommend Best Practice */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-blue-50/50">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <Target size={20} className="text-blue-600" /> Send Recommendation
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={sendRecommendation} className="p-6">
              
              <div className="mb-4">
                <p className="font-bold text-navy text-sm mb-1">{modalTitle}</p>
                <p className="text-xs text-gray-500">This will be sent via email and in-app notification.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700 min-h-[100px] resize-y" 
                  required 
                  defaultValue={modalMessage}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                  <Share2 size={16} /> Send Now
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
  )
}
