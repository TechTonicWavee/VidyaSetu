'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Activity, BookOpen, Upload, Building, Building2, Database, BarChart, CheckCircle2, ChevronDown, Search, Plus, Edit2, Trash2, Calendar, Check, X, Bell, Home, User, TrendingUp, Users, Award, Grid, FileText, LogOut, Target, CheckCircle, Zap, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/admin' },
  { id: 'config',     label: 'Configuration',    icon: Settings,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
  { id: 'spi-config', label: 'SPI Weight Config',icon: Target,     badge: null,  active: false, path: '/dashboard/admin/spi-config' },
  { id: 'institution',label: 'Institution Settings',icon: Grid,    badge: null,  active: false, path: '/dashboard/admin/institution' },
  { id: 'logs',       label: 'System Logs',      icon: Activity,   badge: null,  active: false, path: '/dashboard/admin/configuration' },
]

const initialDates = [
  { id: 1, event: 'Internal Assessment 1', date: '20 Feb 2026', type: 'Exam' },
  { id: 2, event: 'Internal Assessment 2', date: '20 Mar 2026', type: 'Exam' },
  { id: 3, event: 'Internal Assessment 3', date: '20 Apr 2026', type: 'Exam' },
  { id: 4, event: 'Last Teaching Day', date: '31 May 2026', type: 'Academic' },
  { id: 5, event: 'End Semester Exam Start', date: '1 Jun 2026', type: 'Exam' },
  { id: 6, event: 'End Semester Exam End', date: '20 Jun 2026', type: 'Exam' },
  { id: 7, event: 'Result Declaration', date: '5 Jul 2026', type: 'Result' },
  { id: 8, event: 'Placement Season Start', date: '1 Oct 2026', type: 'Placement' },
]

const initialHolidays = [
  { id: 1, name: 'Republic Day', date: '26 Jan 2026', type: 'National Holiday' },
  { id: 2, name: 'Holi', date: '14 Mar 2026', type: 'Festival Holiday' },
  { id: 3, name: 'Ram Navami', date: '6 Apr 2026', type: 'Festival Holiday' },
  { id: 4, name: 'Ambedkar Jayanti', date: '14 Apr 2026', type: 'National Holiday' },
  { id: 5, name: 'Labour Day', date: '1 May 2026', type: 'National Holiday' },
]

const initialGrades = [
  { id: 1, grade: 'O (Outstanding)', range: '91-100', points: '10', active: true },
  { id: 2, grade: 'A+ (Excellent)', range: '81-90', points: '9', active: true },
  { id: 3, grade: 'A (Very Good)', range: '71-80', points: '8', active: true },
  { id: 4, grade: 'B+ (Good)', range: '61-70', points: '7', active: true },
  { id: 5, grade: 'B (Above Average)', range: '56-60', points: '6', active: true },
  { id: 6, grade: 'C (Average)', range: '50-55', points: '5', active: true },
  { id: 7, grade: 'P (Pass)', range: '45-49', points: '4', active: true },
  { id: 8, grade: 'F (Fail)', range: 'Below 45', points: '0', active: true },
]

export default function InstitutionSettings() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Institution Profile')
  const [themeColor, setThemeColor] = useState('#0D1B2A') // default navy
  const [toastMsg, setToastMsg] = useState(null)
  
  const [dates, setDates] = useState(initialDates)
  const [grades, setGrades] = useState(initialGrades)
  const [editingGradeId, setEditingGradeId] = useState(null)
  const [dateModalOpen, setDateModalOpen] = useState(false)
  
  // Toggles
  const [toggles, setToggles] = useState({
    nba: true,
    inApp: true,
    whatsapp: true,
    email: true,
    sms: false
  })

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const tabs = ['Institution Profile', 'Academic Calendar', 'Grading System', 'Notifications & Alerts', 'Multi-Tenancy']

  const colors = [
    { name: 'Navy', hex: '#0D1B2A' },
    { name: 'Blue', hex: '#1A56DB' },
    { name: 'Teal', hex: '#0F766E' },
    { name: 'Purple', hex: '#5B21B6' },
    { name: 'Custom', hex: '#374151' }, // placeholder for custom
  ]

  const toggleSwitch = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

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
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${link.id === 'institution' ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
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
        {/* TOP NAV - dynamic background color based on themeColor */}
        <header className="border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10 transition-colors duration-300" style={{ backgroundColor: themeColor, borderColor: 'rgba(255,255,255,0.1)' }}>
          <button onClick={() => setSidebarOpen(v => !v)} className="text-white/70 hover:text-white transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs bg-white/20">EA</div>
            <span className="font-bold text-white text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input type="text" placeholder="Search settings..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-navy font-bold text-xs bg-white">AD</div>
            <ChevronDown size={14} className="text-white/70 group-hover:text-white transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-6 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Institution Settings</h1>
                <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                  Configure your institution's profile, academic structure, grading system and platform preferences.
                </p>
              </div>
              <button onClick={() => showToast("Institution settings saved")} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                Save All Changes
              </button>
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
            
            {/* TAB 1 - Profile */}
            {activeTab === 'Institution Profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                
                {/* Left Column - Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
                  <h2 className="text-xl font-bold text-navy border-b border-gray-100 pb-3">Institution Details</h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Institution Name</label>
                    <input type="text" defaultValue="College of Engineering, Delhi" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Institution Type</label>
                      <select defaultValue="Engineering College" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                        <option>Engineering College</option><option>Medical</option><option>Arts & Science</option><option>Polytechnic</option><option>University</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Established Year</label>
                      <input type="text" defaultValue="1998" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Affiliation</label>
                    <input type="text" defaultValue="Guru Gobind Singh Indraprastha University" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">NAAC Grade</label>
                      <select defaultValue="A+" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                        <option>A++</option><option>A+</option><option>A</option><option>B++</option><option>B+</option><option>B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">NBA Accredited</label>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div onClick={() => toggleSwitch('nba')} className={`w-10 h-5 rounded-full relative cursor-pointer ${toggles.nba ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${toggles.nba ? 'left-6' : 'left-1'}`} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Valid until 31 Mar 2027</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Address</label>
                    <textarea defaultValue="Sector 16C, Dwarka, New Delhi — 110078" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Contact Email</label>
                      <input type="email" defaultValue="admin@coe-delhi.ac.in" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                      <input type="text" defaultValue="+91 11 2590 8800" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                      <input type="text" defaultValue="www.coe-delhi.ac.in" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Intake Capacity</label>
                      <input type="text" defaultValue="1,320 students per year" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                </div>

                {/* Right Column - Branding */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-navy border-b border-gray-100 pb-3 mb-5">Platform Branding</h2>
                    
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Institution Logo</label>
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-navy text-white flex items-center justify-center font-bold text-2xl rounded-xl shadow-inner shrink-0">
                          COE
                        </div>
                        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                          <Upload className="text-gray-400 mb-1" size={20} />
                          <p className="text-sm font-bold text-gray-600">Upload your institution logo</p>
                          <p className="text-xs text-gray-400">PNG or JPG · Max 2MB</p>
                          <button className="mt-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-lg shadow-sm hover:bg-gray-50">Upload Logo</button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Platform Color Theme</label>
                      <div className="flex items-center gap-3">
                        {colors.map(color => (
                          <div 
                            key={color.hex}
                            onClick={() => setThemeColor(color.hex)}
                            className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center shadow-inner transition-transform hover:scale-110"
                            style={{ backgroundColor: color.hex, border: themeColor === color.hex ? '3px solid white' : 'none', boxShadow: themeColor === color.hex ? '0 0 0 2px ' + color.hex : 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}
                          >
                            {themeColor === color.hex && <Check size={16} className="text-white" />}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Changes the admin navigation bar accent color.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Platform Name displayed to users</label>
                        <input type="text" defaultValue="Educator Analytics OS · COE Delhi" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer text on reports</label>
                        <input type="text" defaultValue="College of Engineering, Delhi · Powered by Educator Analytics OS" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-navy border-b border-gray-100 pb-3 mb-5">Localization</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Default Language</label>
                        <select defaultValue="English" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                          <option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Timezone</label>
                        <select defaultValue="IST" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                          <option value="IST">IST — UTC+5:30</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Date Format</label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="datefmt" defaultChecked className="accent-blue-600" />
                            <span className="text-sm text-gray-700 font-medium">DD/MM/YYYY</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="datefmt" className="accent-blue-600" />
                            <span className="text-sm text-gray-700 font-medium">MM/DD/YYYY</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2 - Academic Calendar */}
            {activeTab === 'Academic Calendar' && (
              <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-navy">Academic Year 2025-26</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Odd Sem */}
                  <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                    <h3 className="text-lg font-bold text-navy mb-4">Odd Semester 2025</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Start Date</span>
                        <input type="text" defaultValue="1 August 2025" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">End Date</span>
                        <input type="text" defaultValue="30 November 2025" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Exam Period</span>
                        <input type="text" defaultValue="1 Dec — 20 Dec 2025" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Result Date</span>
                        <input type="text" defaultValue="5 January 2026" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Even Sem */}
                  <div className="bg-white rounded-xl shadow-sm border-2 border-teal-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-teal-600" />
                    <h3 className="text-lg font-bold text-navy mb-4">Even Semester 2026</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Start Date</span>
                        <input type="text" defaultValue="6 January 2026" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">End Date</span>
                        <input type="text" defaultValue="31 May 2026" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Exam Period</span>
                        <input type="text" defaultValue="1 Jun — 20 Jun 2026" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600">Result Date</span>
                        <input type="text" defaultValue="5 July 2026" className="text-right text-sm font-bold text-navy w-48 p-1 border border-transparent hover:border-gray-300 focus:border-blue-400 rounded outline-none bg-transparent focus:bg-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-navy text-lg">Key Academic Dates</h3>
                    <button onClick={() => setDateModalOpen(true)} className="px-4 py-1.5 border border-blue-200 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-50 transition bg-white flex items-center gap-2">
                      <Plus size={16} /> Add Date
                    </button>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                        <th className="p-4 pl-6">Event</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Type</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dates.map(d => (
                        <tr key={d.id} className="hover:bg-gray-50/50">
                          <td className="p-4 pl-6 font-bold text-navy">{d.event}</td>
                          <td className="p-4 text-gray-600">{d.date}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 rounded-md">{d.type}</span>
                          </td>
                          <td className="p-4 pr-6 text-right font-bold text-xs text-blue-600">
                            <span className="cursor-pointer hover:underline mr-3">Edit</span>
                            <span className="cursor-pointer text-red-500 hover:underline">Delete</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-navy text-lg">Holidays — Even Semester 2026</h3>
                    <button className="px-4 py-1.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition bg-white flex items-center gap-2">
                      <Plus size={16} /> Add Holiday
                    </button>
                  </div>
                  <div className="p-2">
                    {initialHolidays.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><Calendar size={18} /></div>
                          <div>
                            <p className="font-bold text-navy">{h.name}</p>
                            <p className="text-xs text-gray-500">{h.type}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-700 text-sm">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3 - Grading System */}
            {activeTab === 'Grading System' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                
                {/* Left - Grade Scale */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-navy mb-1">Grade Scale</h2>
                    <p className="text-sm text-gray-500 mb-5">Define the grading scale for your institution</p>
                    
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="scale" defaultChecked className="accent-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">10-point CGPA</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="scale" className="accent-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">7-point CGPA</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="scale" className="accent-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">Percentage</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="scale" className="accent-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">Letter Grade Only</span>
                      </label>
                    </div>
                  </div>
                  
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                        <th className="p-3 pl-6">Grade</th>
                        <th className="p-3">Marks Range</th>
                        <th className="p-3">Grade Points</th>
                        <th className="p-3 pr-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {grades.map(g => (
                        <tr key={g.id} className={`hover:bg-gray-50 transition group ${editingGradeId === g.id ? 'bg-blue-50/50' : ''}`}>
                          <td className="p-3 pl-6 font-bold text-navy">{g.grade}</td>
                          <td className="p-3">
                            {editingGradeId === g.id ? (
                              <input type="text" defaultValue={g.range} autoFocus onBlur={() => setEditingGradeId(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingGradeId(null)} className="w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            ) : (
                              <span className="cursor-pointer border-b border-dashed border-gray-300 hover:border-blue-500 text-gray-700" onClick={() => setEditingGradeId(g.id)}>{g.range}</span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-blue-600">{g.points}</td>
                          <td className="p-3 pr-6 flex justify-end">
                            <div onClick={() => setGrades(prev => prev.map(item => item.id === g.id ? {...item, active: !item.active} : item))} className={`w-8 h-4 rounded-full relative cursor-pointer mt-0.5 ${g.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                              <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-[3px] transition-all ${g.active ? 'left-[18px]' : 'left-1'}`} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button className="w-full py-2 border border-blue-200 bg-white text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-50 transition">
                      Add Grade
                    </button>
                  </div>
                </div>

                {/* Right - Pass Req & Assessment */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-navy border-b border-gray-100 pb-3 mb-5">Pass Requirements</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700 text-sm">Minimum pass marks in theory</span>
                        <input type="text" defaultValue="45%" className="w-20 text-center font-bold text-navy py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700 text-sm">Minimum pass marks in practical</span>
                        <input type="text" defaultValue="50%" className="w-20 text-center font-bold text-navy py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700 text-sm">Min. attendance for exam eligibility</span>
                        <input type="text" defaultValue="75%" className="w-20 text-center font-bold text-navy py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700 text-sm">Min. CGPA for good standing</span>
                        <input type="text" defaultValue="6.0" className="w-20 text-center font-bold text-navy py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-700 text-sm">Min. CGPA for scholarship</span>
                        <input type="text" defaultValue="8.0" className="w-20 text-center font-bold text-navy py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-navy mb-1">Assessment Weightage</h2>
                    <p className="text-sm text-gray-500 border-b border-gray-100 pb-3 mb-5">How final marks are calculated</p>
                    
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-700 text-sm">Internal Assessment</p>
                          <p className="text-xs text-gray-500">Unit exams + assignments</p>
                        </div>
                        <input type="text" defaultValue="30%" className="w-20 text-center font-bold text-navy py-1.5 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-700 text-sm">End Semester Exam</p>
                          <p className="text-xs text-gray-500">University exam</p>
                        </div>
                        <input type="text" defaultValue="70%" className="w-20 text-center font-bold text-navy py-1.5 px-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-navy">Total</span>
                      <span className="font-bold text-green-600 text-xl">100%</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4 - Notifications */}
            {activeTab === 'Notifications & Alerts' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-navy">Alert Threshold Configuration</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3 mb-4">Attendance Alert Settings</h2>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Warning alert threshold</p>
                        <p className="text-xs text-amber-600 font-medium">Below X% — amber alert triggered</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">Below</span>
                        <input type="number" defaultValue={80} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 transition">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Critical alert threshold</p>
                        <p className="text-xs text-red-600 font-medium">Below X% — red alert triggered</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">Below</span>
                        <input type="number" defaultValue={75} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Exam eligibility threshold</p>
                        <p className="text-xs text-gray-500 font-medium">Below X% — block from exam</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">Below</span>
                        <input type="number" defaultValue={75} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Parent notification threshold</p>
                        <p className="text-xs text-gray-500 font-medium">Below X% — WhatsApp to parent</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">Below</span>
                        <input type="number" defaultValue={78} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">%</span>
                      </div>
                    </div>

                  </div>

                  {/* Right */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-navy border-b border-gray-100 pb-3 mb-4">Performance Alert Settings</h2>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div className="max-w-[220px]">
                        <p className="font-bold text-gray-800 text-sm">Score drop trigger</p>
                        <p className="text-xs text-gray-500 font-medium">Alert if score drops more than X% from student's personal average</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" defaultValue={20} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div className="max-w-[220px]">
                        <p className="font-bold text-gray-800 text-sm">Consecutive below-average trigger</p>
                        <p className="text-xs text-gray-500 font-medium">Alert if student scores below class average for X consecutive units</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" defaultValue={3} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">units</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div className="max-w-[220px]">
                        <p className="font-bold text-gray-800 text-sm">Assignment miss trigger</p>
                        <p className="text-xs text-gray-500 font-medium">Alert if student misses X consecutive assignments</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" defaultValue={2} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">assigns</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition">
                      <div className="max-w-[220px]">
                        <p className="font-bold text-gray-800 text-sm">SPI drop trigger</p>
                        <p className="text-xs text-gray-500 font-medium">Alert if SPI drops by X points in one month</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input type="number" defaultValue={5} className="w-16 text-center font-bold text-navy py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" />
                        <span className="text-sm font-bold text-gray-500">points</span>
                      </div>
                    </div>

                  </div>

                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-navy border-b border-gray-100 pb-3 mb-5">Active Notification Channels</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center relative hover:shadow-md transition">
                      <div className="absolute top-4 right-4" onClick={() => toggleSwitch('inApp')}>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${toggles.inApp ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${toggles.inApp ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Bell size={24} />
                      </div>
                      <h4 className="font-bold text-navy">In-App Notifications</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-4">All users</p>
                      <button className="text-xs font-bold text-blue-600 hover:underline">Notification settings</button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center relative hover:shadow-md transition">
                      <div className="absolute top-4 right-4" onClick={() => toggleSwitch('whatsapp')}>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${toggles.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${toggles.whatsapp ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                        {/* Placeholder for WhatsApp icon, using a generic message icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      </div>
                      <h4 className="font-bold text-navy">WhatsApp (via Twilio)</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-4">Parents only</p>
                      <button className="text-xs font-bold text-blue-600 hover:underline">Configure Twilio</button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center relative hover:shadow-md transition">
                      <div className="absolute top-4 right-4" onClick={() => toggleSwitch('email')}>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${toggles.email ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${toggles.email ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <h4 className="font-bold text-navy">Email Notifications</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-4">Faculty and Dean</p>
                      <button className="text-xs font-bold text-blue-600 hover:underline">Email settings</button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-center relative hover:shadow-md transition">
                      <div className="absolute top-4 right-4" onClick={() => toggleSwitch('sms')}>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer ${toggles.sms ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${toggles.sms ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </div>
                      <h4 className="font-bold text-navy">SMS Alerts</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-4">Not configured</p>
                      <button className="text-xs px-3 py-1 bg-white border border-blue-200 text-blue-600 font-bold rounded-lg shadow-sm">Setup SMS</button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 5 - Multi-Tenancy */}
            {activeTab === 'Multi-Tenancy' && (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 mb-8 text-center flex flex-col items-center relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
                  
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-sm border border-white">
                    <Building size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-navy mb-3 relative z-10">Multi-Institution Mode</h2>
                  <p className="text-gray-600 max-w-lg mb-8 relative z-10">
                    Your platform is currently configured to serve a single institution. Upgrade to Multi-Institution mode to deploy this platform across multiple colleges from one centralized dashboard.
                  </p>
                  <button className="px-8 py-3 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200 relative z-10">
                    Upgrade to Multi-Institution
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-md mb-2">Active Institution</span>
                    <h3 className="text-xl font-bold text-navy">College of Engineering Delhi</h3>
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Plan</p>
                      <p className="font-bold text-navy">Single Institution</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Users</p>
                      <p className="font-bold text-navy">1,498 active</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Storage</p>
                      <p className="font-bold text-navy">2.4 GB of 50 GB</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Status</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <p className="font-bold text-navy text-sm">Healthy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-navy mb-4">What Multi-Institution Enables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Buildings size={20} /></div>
                    <p className="font-medium text-gray-700 text-sm mt-1">Manage 100+ institutions from one central admin panel</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><Database size={20} /></div>
                    <p className="font-medium text-gray-700 text-sm mt-1">Complete data isolation — each college securely sees only their data</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Settings size={20} /></div>
                    <p className="font-medium text-gray-700 text-sm mt-1">Each institution has their own admin, SPI config and unique branding</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><BarChart size={20} /></div>
                    <p className="font-medium text-gray-700 text-sm mt-1">Cross-institution benchmarking — see how colleges compare (anonymized)</p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDateModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden relative z-10 animate-fade-in">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-navy text-lg">Add Academic Date</h3>
              <button onClick={() => setDateModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Event Name</label>
                <input type="text" placeholder="e.g. Midterm Exams" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Event Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white">
                  <option>Exam</option><option>Academic</option><option>Result</option><option>Placement</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
              <button onClick={() => setDateModalOpen(false)} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Save Event</button>
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
