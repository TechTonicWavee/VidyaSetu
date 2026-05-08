'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, Settings, Bell, Search, ChevronDown, Upload, UserPlus, X, Check, CheckCircle2, Clock, Database, Activity, UserCheck, AlertTriangle, ChevronRight, Home, User, TrendingUp, Award, Grid, FileText, LogOut, Target, CheckCircle, Zap, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/admin' },
  { id: 'config',     label: 'Configuration',    icon: Settings,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
  { id: 'spi-config', label: 'SPI Weight Config',icon: Target,     badge: null,  active: false, path: '/dashboard/admin/spi-config' },
  { id: 'institution',label: 'Institution Settings',icon: Grid,    badge: null,  active: false, path: '/dashboard/admin/institution' },
  { id: 'logs',       label: 'System Logs',      icon: Activity,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
]

const initialFaculty = [
  { id: 1, name: 'Dr. Anita Sharma', empId: 'EMP001', dept: 'CSE', subjects: ['Algorithms', 'DSA'], students: 120, status: 'Active', login: 'Today 9:41 AM', avatar: 'PR', color: 'bg-green-700' },
  { id: 2, name: 'Prof. Priya Kapoor', empId: 'EMP002', dept: 'CSE', subjects: ['DBMS', 'OS'], students: 243, status: 'Active', login: 'Today 8:52 AM', avatar: 'PK', color: 'bg-blue-600' },
  { id: 3, name: 'Dr. Suresh Iyer', empId: 'EMP003', dept: 'CSE', subjects: ['TOC', 'Networks'], students: 198, status: 'Active', login: 'Yesterday', avatar: 'SI', color: 'bg-teal-600' },
  { id: 4, name: 'Prof. Meena Rao', empId: 'EMP004', dept: 'IT', subjects: ['Web Tech', 'Soft Engg'], students: 210, status: 'Active', login: 'Today 10:15 AM', avatar: 'MR', color: 'bg-purple-600' },
  { id: 5, name: 'Dr. Ramesh Pillai', empId: 'EMP005', dept: 'ECE', subjects: ['Digital Electronics', 'VLSI'], students: 186, status: 'Active', login: 'Yesterday', avatar: 'RP', color: 'bg-amber-600' },
  { id: 6, name: 'Prof. Kavya Nair', empId: 'EMP006', dept: 'CSE', subjects: ['Python', 'AI'], students: 175, status: 'Active', login: 'Today 11:03 AM', avatar: 'KN', color: 'bg-rose-600' },
  { id: 7, name: 'Dr. Prakash Joshi', empId: 'EMP007', dept: 'IT', subjects: ['Database', 'Cloud'], students: 162, status: 'Active', login: '2 days ago', avatar: 'PJ', color: 'bg-gray-600' },
  { id: 8, name: 'Prof. Dinesh Kumar', empId: 'EMP008', dept: 'ECE', subjects: ['Signals', 'Communication'], students: 144, status: 'Inactive', login: '1 week ago', avatar: 'DK', color: 'bg-navy' },
  { id: 9, name: 'Dr. Lakshmi Priya', empId: 'EMP009', dept: 'IT', subjects: ['Mathematics', 'Stats'], students: 201, status: 'Active', login: 'Today 7:30 AM', avatar: 'LP', color: 'bg-pink-600' },
  { id: 10, name: 'Prof. Arun Nair', empId: 'EMP010', dept: 'ECE', subjects: ['Microprocessors', 'Embedded'], students: 133, status: 'Active', login: 'Yesterday', avatar: 'AN', color: 'bg-orange-600' },
]

const students = [
  { id: 1, name: 'Priyanshu Raj', roll: '2CS04', branch: 'CSE', year: '2nd', section: 'B', spi: 72, cgpa: 7.4, status: 'Active' },
  { id: 2, name: 'Siddharth Rao', roll: '2CS38', branch: 'CSE', year: '2nd', section: 'A', spi: 88, cgpa: 8.7, status: 'Active' },
  { id: 3, name: 'Priya Sharma', roll: '2CS18', branch: 'CSE', year: '2nd', section: 'B', spi: 78, cgpa: 7.9, status: 'Active' },
  { id: 4, name: 'Harsh Chaudhary', roll: '3CS12', branch: 'CSE', year: '3rd', section: 'A', spi: 81, cgpa: 8.1, status: 'Active' },
  { id: 5, name: 'Neha Joshi', roll: '2CS33', branch: 'CSE', year: '2nd', section: 'C', spi: 79, cgpa: 7.8, status: 'Active' },
  { id: 6, name: 'Ananya Verma', roll: '2CS07', branch: 'CSE', year: '2nd', section: 'A', spi: 76, cgpa: 7.6, status: 'Active' },
  { id: 7, name: 'Rohit Sharma', roll: '2CS47', branch: 'CSE', year: '2nd', section: 'B', spi: 53, cgpa: 5.9, status: 'Active' },
  { id: 8, name: 'Sneha Patel', roll: '2CS23', branch: 'CSE', year: '2nd', section: 'A', spi: 48, cgpa: 5.4, status: 'Active' },
  { id: 9, name: 'Arjun Mehta', roll: '2CS09', branch: 'CSE', year: '2nd', section: 'C', spi: 56, cgpa: 6.1, status: 'Active' },
  { id: 10, name: 'Divya Patel', roll: '2CS14', branch: 'CSE', year: '2nd', section: 'B', spi: 75, cgpa: 7.5, status: 'Active' },
]

const subjectsData = [
  { code: 'CS201', name: 'Database Management', branch: 'CSE', sem: '4th Sem', cred: 4, fac: 'Prof. Priya Kapoor', sec: '2A, 2B, 2C', co: 5 },
  { code: 'CS202', name: 'Operating Systems', branch: 'CSE', sem: '4th Sem', cred: 4, fac: 'Prof. Priya Kapoor', sec: '2A, 2B', co: 5 },
  { code: 'CS203', name: 'Theory of Computation', branch: 'CSE', sem: '4th Sem', cred: 3, fac: 'Dr. Suresh Iyer', sec: '2C', co: 5 },
  { code: 'CS204', name: 'Data Structures', branch: 'CSE', sem: '3rd Sem', cred: 4, fac: 'Dr. Anita Sharma', sec: 'All 2nd year', co: 5 },
  { code: 'CS205', name: 'Computer Networks', branch: 'CSE', sem: '5th Sem', cred: 4, fac: 'Dr. Suresh Iyer', sec: '3A', co: 5 },
  { code: 'CS206', name: 'Algorithms', branch: 'CSE', sem: '5th Sem', cred: 4, fac: 'Dr. Anita Sharma', sec: '3A, 3B', co: 5 },
  { code: 'IT301', name: 'Web Technologies', branch: 'IT', sem: '4th Sem', cred: 3, fac: 'Prof. Meena Rao', sec: 'IT 2A, 2B', co: 5 },
  { code: 'IT302', name: 'Software Engineering', branch: 'IT', sem: '4th Sem', cred: 4, fac: 'Prof. Meena Rao', sec: 'IT 2A', co: 5 },
]

const systemLogs = [
  { time: '15 Apr 2026 11:42 AM', user: 'Admin', type: 'Admin Action', desc: 'Faculty account created — Dr. Suresh Iyer', status: 'Success' },
  { time: '15 Apr 2026 11:08 AM', user: 'AI System', type: 'AI Agent', desc: 'Alert Agent generated 5 new alerts — at-risk students detected', status: 'Success' },
  { time: '15 Apr 2026 10:34 AM', user: 'Prof. Priya Kapoor', type: 'Data Change', desc: 'Parent Visit QR generated for Priyanshu Raj — 30 min session', status: 'Success' },
  { time: '15 Apr 2026 10:15 AM', user: 'Prof. Meena Rao', type: 'Login', desc: 'Faculty login — IT Department', status: 'Success' },
  { time: '15 Apr 2026 9:52 AM', user: 'AI System', type: 'AI Agent', desc: 'SPI recalculation completed — CSE 2nd year — 180 students updated', status: 'Success' },
  { time: '15 Apr 2026 9:31 AM', user: 'Dr. Rajesh Verma', type: 'Admin Action', desc: 'Accreditation report generated — NBA OBE Even Sem 2026', status: 'Success' },
  { time: '15 Apr 2026 9:14 AM', user: 'System', type: 'Data Change', desc: 'Bulk marks upload — OS Unit 3 — 240 student records updated', status: 'Success' },
  { time: '14 Apr 2026 6:43 PM', user: 'AI System', type: 'AI Agent', desc: 'Career Advisor Agent ran for 480 CSE students — batch analysis', status: 'Success' },
  { time: '14 Apr 2026 4:22 PM', user: 'Admin', type: 'Admin Action', desc: 'SPI weight configuration updated — Project Quality weight changed from 15% to 20%', status: 'Success' },
  { time: '14 Apr 2026 2:18 PM', user: 'Unknown', type: 'Login', desc: 'Failed login attempt — incorrect password — IP: 192.168.1.104', status: 'Failed' },
  { time: '14 Apr 2026 11:35 AM', user: 'Prof. Priya Kapoor', type: 'Data Change', desc: 'Faculty note added for Priyanshu Raj — DBMS', status: 'Success' },
  { time: '14 Apr 2026 9:07 AM', user: 'AI System', type: 'AI Agent', desc: 'WhatsApp digest sent to 243 parents — weekly summary', status: 'Success' },
]

export default function ConfigurationPanel() {
  const router = useRouter()
  const [activeNav] = useState('config')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Faculty Management')
  const [facultyData, setFacultyData] = useState(initialFaculty)
  
  // Modals / Panels
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [deactivateModal, setDeactivateModal] = useState({ open: false, id: null, name: '' })
  const [toastMsg, setToastMsg] = useState(null)

  // Branch expanded state
  const [expandedBranch, setExpandedBranch] = useState('CSE')

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleEditFaculty = (fac) => {
    setEditingFaculty(fac)
    setEditPanelOpen(true)
  }

  const handleDeactivateConfirm = () => {
    setFacultyData(prev => prev.map(f => f.id === deactivateModal.id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f))
    setDeactivateModal({ open: false, id: null, name: '' })
    showToast(`Status updated successfully`)
  }

  const getSpiColor = (spi) => {
    if (spi < 55) return 'text-red-600 font-bold'
    if (spi < 65) return 'text-amber-600 font-bold'
    if (spi < 75) return 'text-blue-600 font-bold'
    if (spi < 85) return 'text-teal-600 font-bold'
    return 'text-green-600 font-bold'
  }

  const tabs = ['Faculty Management', 'Student Records', 'Branch & Sections', 'Subject Mapping', 'System Logs']

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-navy flex flex-col transition-all duration-300 shadow-xl z-20`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-navy font-bold text-sm flex-shrink-0 bg-white">AD</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-white truncate">Admin</p>
              <p className="text-xs text-blue-200 truncate">System Manager</p>
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
            <input type="text" placeholder="Search config..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-navy font-bold text-xs bg-gray-200">AD</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-6 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Configuration Panel</h1>
                <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                  Manage faculty accounts, student records, branches, sections and system-wide settings
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-bold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Status: All Good
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><UserCheck size={20} /></div>
                <div>
                  <p className="text-3xl font-bold text-blue-600 leading-none mb-1">48</p>
                  <p className="text-xs font-bold text-navy">Total Faculty</p>
                  <p className="text-[10px] text-gray-500 mt-1">18 CSE · 16 IT · 14 ECE</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><Users size={20} /></div>
                <div>
                  <p className="text-3xl font-bold text-teal-600 leading-none mb-1">1,240</p>
                  <p className="text-xs font-bold text-navy">Total Students</p>
                  <p className="text-[10px] text-gray-500 mt-1">Across 3 branches</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><Activity size={20} /></div>
                <div>
                  <p className="text-3xl font-bold text-purple-600 leading-none mb-1">342</p>
                  <p className="text-xs font-bold text-navy">Active Sessions</p>
                  <p className="text-[10px] text-gray-500 mt-1">Right now on platform</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><Clock size={20} /></div>
                <div>
                  <p className="text-3xl font-bold text-amber-600 leading-none mb-1">7</p>
                  <p className="text-xs font-bold text-navy">Pending Actions</p>
                  <p className="text-[10px] text-gray-500 mt-1">Require admin attention</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"><Database size={20} /></div>
                <div>
                  <p className="text-3xl font-bold text-gray-600 leading-none mb-1">2.4 GB</p>
                  <p className="text-xs font-bold text-navy">Storage Used</p>
                  <p className="text-[10px] text-gray-500 mt-1">of 50 GB allocated</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* TAB 1 - Faculty */}
              {activeTab === 'Faculty Management' && (
                <div className="animate-fade-in">
                  <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-sm">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search faculty by name, department..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition flex-1 sm:flex-none">
                        <Upload size={16} /> Bulk Import CSV
                      </button>
                      <button onClick={() => handleEditFaculty(null)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition flex-1 sm:flex-none">
                        <UserPlus size={16} /> Add New Faculty
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                          <th className="p-4 pl-6 w-12"></th>
                          <th className="p-4">Name & ID</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Subjects</th>
                          <th className="p-4">Students</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Last Login</th>
                          <th className="p-4 pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100">
                        {facultyData.map(fac => (
                          <tr key={fac.id} className="hover:bg-gray-50/50 transition">
                            <td className="p-4 pl-6">
                              <div className={`w-8 h-8 rounded-full ${fac.color} text-white flex items-center justify-center text-xs font-bold`}>{fac.avatar}</div>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-navy">{fac.name}</p>
                              <p className="text-xs text-gray-500">{fac.empId}</p>
                            </td>
                            <td className="p-4 font-medium text-gray-700">{fac.dept}</td>
                            <td className="p-4 text-gray-600">{fac.subjects.join(', ')}</td>
                            <td className="p-4 text-gray-600">{fac.students} students</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${fac.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-600">{fac.status}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-500 text-xs">{fac.login}</td>
                            <td className="p-4 pr-6">
                              <div className="flex items-center gap-3">
                                <button onClick={() => handleEditFaculty(fac)} className="text-blue-600 font-bold hover:underline text-xs">Edit</button>
                                <button onClick={() => setDeactivateModal({ open: true, id: fac.id, name: fac.name, action: fac.status === 'Active' ? 'Deactivate' : 'Activate' })} className="text-gray-500 font-bold hover:text-red-600 transition text-xs">
                                  {fac.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Showing 1-10 of 48</span>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 hover:bg-gray-200 rounded">Previous</button>
                      <button className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
                      <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">2</button>
                      <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">3</button>
                      <span>...</span>
                      <button className="px-2 py-1 hover:bg-gray-200 rounded">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 - Students */}
              {activeTab === 'Student Records' && (
                <div className="animate-fade-in">
                  <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2 justify-between">
                      <div className="relative w-full max-w-sm">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name or roll number..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition">Export All</button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition">Bulk Import CSV</button>
                        <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition">Add Student</button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Branch: All</option><option>CSE</option><option>IT</option><option>ECE</option>
                      </select>
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Year: All</option><option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                      </select>
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Section: All</option><option>A</option><option>B</option><option>C</option>
                      </select>
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Status: All</option><option>Active</option><option>Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                          <th className="p-4 pl-6">Name</th>
                          <th className="p-4">Roll No</th>
                          <th className="p-4">Branch</th>
                          <th className="p-4">Year</th>
                          <th className="p-4">Section</th>
                          <th className="p-4">SPI</th>
                          <th className="p-4">CGPA</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100">
                        {students.map((st, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition">
                            <td className="p-4 pl-6 font-bold text-navy">{st.name}</td>
                            <td className="p-4 text-gray-600">{st.roll}</td>
                            <td className="p-4 text-gray-600">{st.branch}</td>
                            <td className="p-4 text-gray-600">{st.year}</td>
                            <td className="p-4 text-gray-600">{st.section}</td>
                            <td className={`p-4 ${getSpiColor(st.spi)}`}>{st.spi}</td>
                            <td className="p-4 text-gray-700 font-bold">{st.cgpa}</td>
                            <td className="p-4 text-xs text-gray-500">{st.status}</td>
                            <td className="p-4 pr-6 text-xs font-bold text-blue-600">
                              <span className="cursor-pointer hover:underline mr-3">View</span>
                              <span className="cursor-pointer hover:underline">Edit</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Showing 1-10 of 1,240</span>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 hover:bg-gray-200 rounded">Previous</button>
                      <button className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center">1</button>
                      <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">2</button>
                      <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">3</button>
                      <span>...</span>
                      <button className="px-2 py-1 hover:bg-gray-200 rounded">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 - Branch & Sections */}
              {activeTab === 'Branch & Sections' && (
                <div className="p-6 animate-fade-in bg-gray-50 min-h-[500px]">
                  <div className="flex justify-end mb-4">
                    <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition">Add Branch</button>
                  </div>
                  <div className="space-y-4">
                    
                    {['CSE', 'IT', 'ECE'].map((branch) => {
                      const isCSE = branch === 'CSE';
                      const students = isCSE ? '480' : branch === 'IT' ? '420' : '340';
                      const sections = isCSE ? '12' : branch === 'IT' ? '10' : '8';
                      const facCount = isCSE ? '18' : branch === 'IT' ? '16' : '14';
                      const title = isCSE ? 'Computer Science & Engineering' : branch === 'IT' ? 'Information Technology' : 'Electronics & Communication Engg';
                      
                      return (
                        <div key={branch} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div 
                            className={`p-4 border-l-4 ${isCSE ? 'border-l-blue-600' : branch==='IT' ? 'border-l-teal-600' : 'border-l-purple-600'} flex items-center justify-between cursor-pointer hover:bg-gray-50 transition`}
                            onClick={() => setExpandedBranch(expandedBranch === branch ? null : branch)}
                          >
                            <div className="flex items-center gap-4">
                              <ChevronRight className={`text-gray-400 transition-transform ${expandedBranch === branch ? 'rotate-90' : ''}`} size={20}/>
                              <div>
                                <h3 className="font-bold text-navy text-lg">{title}</h3>
                                <p className="text-xs text-gray-500 mt-1">Students: {students} · Sections: {sections} · Faculty: {facCount}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Active</span>
                              <div className="flex gap-2">
                                <button onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 border border-gray-300 text-gray-600 font-bold text-xs rounded hover:bg-gray-50">Edit Branch</button>
                                <button onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded hover:bg-gray-200">View Details</button>
                              </div>
                            </div>
                          </div>

                          {expandedBranch === branch && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                
                                {/* Year 1 */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                  <h4 className="font-bold text-navy border-b border-gray-100 pb-2 mb-3">Year 1</h4>
                                  <div className="space-y-3 mb-4">
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section A</p><p className="text-xs text-gray-500">80 students · CT: Dr. Anita Sharma</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section B</p><p className="text-xs text-gray-500">80 students · CT: Prof. Kavya Nair</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section C</p><p className="text-xs text-gray-500">80 students · CT: Dr. Ravi Sharma</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section D</p><p className="text-xs text-gray-500">80 students · CT: Prof. Priya Kapoor</p></div>
                                  </div>
                                  <button className="w-full py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded border border-blue-100 hover:bg-blue-100 transition">Add Section</button>
                                </div>

                                {/* Year 2 */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                  <h4 className="font-bold text-navy border-b border-gray-100 pb-2 mb-3">Year 2</h4>
                                  <div className="space-y-3 mb-4">
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section A</p><p className="text-xs text-gray-500">61 students · CT: Prof. Priya Kapoor</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section B</p><p className="text-xs text-gray-500">60 students · CT: Dr. Suresh Iyer</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section C</p><p className="text-xs text-gray-500">59 students · CT: Prof. Kavya Nair</p></div>
                                  </div>
                                  <button className="w-full py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded border border-blue-100 hover:bg-blue-100 transition">Add Section</button>
                                </div>

                                {/* Year 3 */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                  <h4 className="font-bold text-navy border-b border-gray-100 pb-2 mb-3">Year 3</h4>
                                  <div className="space-y-3 mb-4">
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section A</p><p className="text-xs text-gray-500">148 students (combined) · CT: Dr. Anita Sharma</p></div>
                                  </div>
                                  <button className="w-full py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded border border-blue-100 hover:bg-blue-100 transition">Add Section</button>
                                </div>

                                {/* Year 4 */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                  <h4 className="font-bold text-navy border-b border-gray-100 pb-2 mb-3">Year 4</h4>
                                  <div className="space-y-3 mb-4">
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section A</p><p className="text-xs text-gray-500">132 students (combined) · CT: Dr. Suresh Iyer</p></div>
                                    <div className="text-sm"><p className="font-bold text-gray-700">Section B</p><p className="text-xs text-gray-500">128 students (combined) · CT: Dr. Anita Sharma</p></div>
                                  </div>
                                  <button className="w-full py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded border border-blue-100 hover:bg-blue-100 transition">Add Section</button>
                                </div>

                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4 - Subject Mapping */}
              {activeTab === 'Subject Mapping' && (
                <div className="animate-fade-in">
                  <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <div className="flex gap-4">
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Branch: All</option><option>CSE</option><option>IT</option>
                      </select>
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Semester: All</option><option>3rd Sem</option><option>4th Sem</option><option>5th Sem</option>
                      </select>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition">Add Subject</button>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                        <th className="p-4 pl-6">Code & Name</th>
                        <th className="p-4">Branch / Sem</th>
                        <th className="p-4">Assigned Faculty</th>
                        <th className="p-4">Sections</th>
                        <th className="p-4">Credits & COs</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subjectsData.map((sub, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-navy">{sub.code}</span><br />
                            <span className="text-gray-600">{sub.name}</span>
                          </td>
                          <td className="p-4 text-gray-600">{sub.branch} · {sub.sem}</td>
                          <td className="p-4 font-bold text-navy">{sub.fac}</td>
                          <td className="p-4 text-gray-600">{sub.sec}</td>
                          <td className="p-4 text-gray-500">{sub.cred} cr · {sub.co} COs</td>
                          <td className="p-4 pr-6 text-right font-bold text-blue-600 text-xs">
                            <span className="cursor-pointer hover:underline mr-3">Edit</span>
                            <span className="cursor-pointer text-red-500 hover:underline">Remove</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 5 - System Logs */}
              {activeTab === 'System Logs' && (
                <div className="animate-fade-in">
                  <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-wrap gap-4 justify-between">
                    <div className="flex gap-4">
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Last 7 days</option><option>Last 30 days</option><option>All time</option>
                      </select>
                      <select className="text-sm border-gray-200 rounded-md bg-white text-gray-700 py-1.5 px-3 border outline-none">
                        <option>Type: All</option><option>Login</option><option>Data Change</option><option>AI Agent</option><option>Error</option><option>Admin Action</option>
                      </select>
                    </div>
                    <div className="relative max-w-xs w-full">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                        <th className="p-4 pl-6">Timestamp</th>
                        <th className="p-4">User</th>
                        <th className="p-4">Action Type</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {systemLogs.map((log, i) => (
                        <tr key={i} className={`hover:bg-gray-50/50 ${log.status === 'Failed' ? 'bg-red-50/30' : ''}`}>
                          <td className="p-4 pl-6 text-gray-500 text-xs">{log.time}</td>
                          <td className="p-4 font-bold text-navy">{log.user}</td>
                          <td className="p-4 text-gray-600">{log.type}</td>
                          <td className="p-4 text-gray-700">{log.desc}</td>
                          <td className={`p-4 pr-6 font-bold text-xs ${log.status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Slide-In Panel for Edit / Add Faculty */}
      {editPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setEditPanelOpen(false)} />
          <div className="relative w-[450px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-navy">{editingFaculty ? `Edit Faculty — ${editingFaculty.name}` : 'Add New Faculty'}</h2>
              <button onClick={() => setEditPanelOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20}/></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                <input type="text" defaultValue={editingFaculty?.name || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Employee ID</label>
                <input type="text" defaultValue={editingFaculty?.empId || ''} disabled={!!editingFaculty} className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Department</label>
                  <select defaultValue={editingFaculty?.dept || 'CSE'} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                    <option>CSE</option><option>IT</option><option>ECE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Experience</label>
                  <input type="text" defaultValue="6 years" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Subjects</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg mb-2">
                  {(editingFaculty?.subjects || []).map(s => (
                    <span key={s} className="px-2 py-1 bg-gray-100 border border-gray-200 text-xs font-bold text-navy rounded flex items-center gap-1">
                      {s} <X size={12} className="text-gray-400 cursor-pointer hover:text-red-500" />
                    </span>
                  ))}
                  {!editingFaculty && <span className="text-sm text-gray-400 italic py-1">No subjects assigned</span>}
                </div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-500 outline-none">
                  <option>Add Subject...</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                  <input type="email" placeholder="email@college.edu" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                  <input type="text" placeholder="+91 9876543210" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Qualification</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                  <option>PhD</option><option>MTech</option><option>BTech</option><option>Other</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700">Account Status</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Inactive</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer ${(!editingFaculty || editingFaculty.status === 'Active') ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${(!editingFaculty || editingFaculty.status === 'Active') ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button onClick={() => { showToast('Faculty details saved'); setEditPanelOpen(false); }} className="flex-1 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition">
                Save Changes
              </button>
              <button onClick={() => setEditPanelOpen(false)} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {deactivateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeactivateModal({ open: false, id: null, name: '' })} />
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden relative z-10 animate-fade-in p-6 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${deactivateModal.action === 'Activate' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">{deactivateModal.action} {deactivateModal.name}?</h3>
            <p className="text-gray-500 text-sm mb-6">
              {deactivateModal.action === 'Activate' 
                ? "This will restore their access to the platform."
                : "They will lose access to the platform immediately."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeactivateModal({ open: false, id: null, name: '' })} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDeactivateConfirm} className={`flex-1 py-2.5 text-white font-bold rounded-lg transition ${deactivateModal.action === 'Activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          {toastMsg}
        </div>
      )}

    </div>
  )
}
