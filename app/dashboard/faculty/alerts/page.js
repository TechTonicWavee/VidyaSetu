'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle,
  MessageCircle, FileText, Settings, LogOut, Search, ChevronDown,
  AlertTriangle, AlertOctagon, Info, Cpu, X, ChevronRight
} from 'lucide-react'

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, path: '/dashboard/faculty' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, badge: null, path: '/dashboard/faculty' },
  { id: 'alerts', label: 'Student Alerts', icon: Bell, badge: '5', path: '/dashboard/faculty/alerts' },
  { id: 'analytics', label: 'Subject Analytics', icon: BarChart2, badge: null, path: '/dashboard/faculty/analytics' },
  { id: 'profiles', label: 'Student Profiles', icon: Users, badge: null, path: '/dashboard/faculty' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, badge: null, path: '/dashboard/faculty' },
  { id: 'parent', label: 'Parent Communication', icon: MessageCircle, badge: null, path: '/dashboard/faculty' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null, path: '/dashboard/faculty' },
]

export default function StudentAlertCenter() {
  const router = useRouter()
  const [activeNav] = useState('alerts')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const [activeFilter, setActiveFilter] = useState('All')
  const [showResolved, setShowResolved] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(true)
  
  const [selectedAction, setSelectedAction] = useState({
    alert1: null, alert2: null, alert3: null, alert4: null, alert5: null
  })

  const [alertsList, setAlertsList] = useState(['alert1', 'alert2', 'alert3', 'alert4', 'alert5'])
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const handleActionChange = (alertId, actionIndex) => {
    setSelectedAction(prev => ({ ...prev, [alertId]: actionIndex }))
  }

  const handleLogIntervention = (alertId) => {
    setAlertsList(alertsList.filter(id => id !== alertId))
    setToastMessage('Intervention logged successfully. Alert moved to resolved.')
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleNotifyParent = () => {
    setModalOpen(true)
  }

  const confirmNotify = () => {
    setModalOpen(false)
    setToastMessage('WhatsApp notification sent to parent successfully.')
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle size={18} />
          {toastMessage}
        </div>
      )}

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm z-20`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0F766E, #047857)' }}>PK</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Prof. Priya Kapoor</p>
              <p className="text-xs text-gray-500 truncate">CSE Department · 4 Subjects</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-teal-50 text-teal-700 font-semibold' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#0F766E' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{alertsList.length}</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #0F766E, #047857)' }}>PK</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Student Alert Center</h1>
                <p className="text-gray-500 text-sm">AI-generated alerts for students who need your attention — act early, change outcomes</p>
              </div>
              <span className="px-3 py-1.5 bg-red-100 text-red-700 font-bold text-sm rounded-full border border-red-200">
                {alertsList.length} Active Alerts
              </span>
            </div>

            {/* TOP SUMMARY STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><AlertOctagon size={14} className="text-red-500"/> Critical</div>
                <p className="text-3xl font-black text-red-600 mb-1">1</p>
                <p className="text-xs text-gray-500 font-medium">Requires immediate action</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><AlertTriangle size={14} className="text-orange-500"/> High Priority</div>
                <p className="text-3xl font-black text-orange-500 mb-1">3</p>
                <p className="text-xs text-gray-500 font-medium">Act within this week</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Info size={14} className="text-amber-500"/> Medium</div>
                <p className="text-3xl font-black text-amber-500 mb-1">6</p>
                <p className="text-xs text-gray-500 font-medium">Monitor closely</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><CheckCircle size={14} className="text-green-500"/> Resolved This Month</div>
                <p className="text-3xl font-black text-green-600 mb-1">12</p>
                <p className="text-xs text-gray-500 font-medium">Interventions completed</p>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'All', label: 'All (10)', c: 'blue' },
                  { id: 'Critical', label: 'Critical (1)', c: 'red' },
                  { id: 'High', label: 'High (3)', c: 'orange' },
                  { id: 'Medium', label: 'Medium (6)', c: 'amber' },
                  { id: 'Resolved', label: 'Resolved (12)', c: 'green' },
                ].map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${activeFilter === f.id ? `bg-${f.c}-100 text-${f.c}-800 border border-${f.c}-200` : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg px-4 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>All Subjects</option>
                  <option>DBMS</option>
                  <option>OS</option>
                  <option>TOC</option>
                  <option>DSA</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ALERTS LIST */}
            <div className="space-y-6">
              
              {/* ALERT 1 - CRITICAL */}
              {alertsList.includes('alert1') && (activeFilter === 'All' || activeFilter === 'Critical') && (
                <div className="bg-red-50/30 rounded-2xl shadow-sm border border-red-200 relative overflow-hidden flex flex-col animate-fade-in">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600" />
                  
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1"><AlertOctagon size={12}/> Critical</span>
                          <span className="text-xs font-semibold text-gray-500">Generated by AI — 6 hours ago</span>
                        </div>
                        <h2 className="text-xl font-bold text-red-900 leading-tight">Multiple Risk Factors — Immediate Intervention Required</h2>
                      </div>
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded font-bold text-xs uppercase">Operating Systems</span>
                    </div>

                    <div className="flex items-center gap-3 mb-5 p-3 bg-white rounded-xl border border-gray-100 w-fit">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-lg">SP</div>
                      <div>
                        <p className="font-bold text-navy">Sneha Patel</p>
                        <p className="text-xs text-gray-500 font-medium">2CS23 · CSE 2A</p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm mb-5 font-medium">
                      Sneha Patel is showing 3 simultaneous risk factors this week: <span className="font-bold text-navy">(1)</span> Attendance dropped to 68% in OS — below minimum threshold. <span className="font-bold text-navy">(2)</span> OS Unit 3 score was 41/100 — a 24% drop from Unit 2. <span className="font-bold text-navy">(3)</span> Last 2 assignments submitted after deadline. Historical pattern match: students with this combination of factors have a 73% probability of failing the end semester exam.
                    </p>

                    <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
                      <button onClick={() => setAiExpanded(!aiExpanded)} className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition">
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-700"><Cpu size={16} className="text-purple-600"/> AI Reasoning</span>
                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${aiExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {aiExpanded && (
                        <div className="p-4 bg-gray-50/50 border-t border-gray-200 text-sm text-gray-600 leading-relaxed italic">
                          Score decline + attendance drop + late submissions occurring simultaneously in weeks 7-9 of semester is a pattern seen in 23 previous at-risk students. 18 of those 23 failed the end sem exam without intervention.
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Actions</h4>
                      <div className="space-y-2">
                        {[
                          "Schedule one-on-one meeting this week to understand challenges",
                          "Send parent notification via WhatsApp immediately",
                          "Provide supplementary study material for OS weak topics"
                        ].map((action, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction.alert1 === i ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input type="radio" name="action_alert1" className="mt-0.5 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300" 
                                   checked={selectedAction.alert1 === i} onChange={() => handleActionChange('alert1', i)} />
                            <span className={`text-sm font-medium ${selectedAction.alert1 === i ? 'text-red-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 italic">Outcome tracker will check Sneha's progress in 30 days</p>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button onClick={handleNotifyParent} className="flex-1 sm:flex-none px-5 py-2.5 border-2 border-red-200 text-red-700 font-bold text-sm rounded-xl hover:bg-red-50 transition whitespace-nowrap">
                        Notify Parent
                      </button>
                      <button onClick={() => handleLogIntervention('alert1')} disabled={selectedAction.alert1 === null} className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition whitespace-nowrap">
                        Log Intervention Taken
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ALERT 2 - HIGH */}
              {alertsList.includes('alert2') && (activeFilter === 'All' || activeFilter === 'High') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col animate-fade-in">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={12}/> High Priority</span>
                          <span className="text-xs font-semibold text-gray-500">Generated 1 day ago</span>
                        </div>
                        <h2 className="text-lg font-bold text-navy leading-tight">Significant Score Decline — 3rd Consecutive Unit</h2>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded font-bold text-xs uppercase">DBMS</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">RS</div>
                      <p className="font-bold text-navy text-sm">Rohit Sharma <span className="font-normal text-gray-500">· 2CS47 · CSE 2B</span></p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm mb-5">
                      Rohit Sharma's DBMS scores have declined for 3 consecutive units: Unit 1: 78%, Unit 2: 67%, Unit 3: 54%. A consistent downward trend of this nature in weeks 6-10 suggests either a foundational gap in normalization concepts or an external factor affecting study time.
                    </p>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Actions</h4>
                      <div className="space-y-2 mb-5">
                        {[
                          "Review foundational SQL and normalization concepts in extra class",
                          "Check with student for external factors — personal or health issues",
                          "Assign additional practice problems on normalization"
                        ].map((action, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction.alert2 === i ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <input type="radio" name="action_alert2" className="mt-0.5 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" 
                                   checked={selectedAction.alert2 === i} onChange={() => handleActionChange('alert2', i)} />
                            <span className={`text-sm font-medium ${selectedAction.alert2 === i ? 'text-orange-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button className="px-5 py-2 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                          View Full Profile
                        </button>
                        <button onClick={() => handleLogIntervention('alert2')} disabled={selectedAction.alert2 === null} className="px-5 py-2 bg-orange-500 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition">
                          Log Intervention
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ALERT 3 - HIGH */}
              {alertsList.includes('alert3') && (activeFilter === 'All' || activeFilter === 'High') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col animate-fade-in">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={12}/> High Priority</span>
                          <span className="text-xs font-semibold text-gray-500">Generated 1 day ago</span>
                        </div>
                        <h2 className="text-lg font-bold text-navy leading-tight">3 Consecutive Assignments Not Submitted</h2>
                      </div>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded font-bold text-xs uppercase whitespace-nowrap">Theory of Computation</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">AM</div>
                      <p className="font-bold text-navy text-sm">Arjun Mehta <span className="font-normal text-gray-500">· 2CS09 · CSE 2C</span></p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm mb-5">
                      Arjun Mehta has not submitted TOC Assignments 2, 3 and 4. This is the first time this pattern has occurred for this student who previously had 100% submission rate. A sudden change in a previously consistent student is a strong signal requiring immediate attention.
                    </p>

                    <div>
                      <div className="space-y-2 mb-5">
                        {[
                          "Reach out to student directly — understand what changed",
                          "Check with class representative about student wellbeing",
                          "Provide deadline extension with counseling referral"
                        ].map((action, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction.alert3 === i ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <input type="radio" name="action_alert3" className="mt-0.5 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" 
                                   checked={selectedAction.alert3 === i} onChange={() => handleActionChange('alert3', i)} />
                            <span className={`text-sm font-medium ${selectedAction.alert3 === i ? 'text-orange-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button className="px-5 py-2 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                          View Full Profile
                        </button>
                        <button onClick={() => handleLogIntervention('alert3')} disabled={selectedAction.alert3 === null} className="px-5 py-2 bg-orange-500 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition">
                          Log Intervention
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ALERT 4 - HIGH */}
              {alertsList.includes('alert4') && (activeFilter === 'All' || activeFilter === 'High') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col animate-fade-in">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={12}/> High Priority</span>
                          <span className="text-xs font-semibold text-gray-500">Generated 2 days ago</span>
                        </div>
                        <h2 className="text-lg font-bold text-navy leading-tight">Attendance Below Threshold — DBMS and OS</h2>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded font-bold text-xs uppercase">DBMS</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">KJ</div>
                      <p className="font-bold text-navy text-sm">Karan Joshi <span className="font-normal text-gray-500">· 2CS15 · CSE 2B</span></p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm mb-5">
                      Karan Joshi's attendance has fallen below 75% in both DBMS (72%) and Operating Systems (71%). With 6 weeks remaining in the semester, maintaining perfect attendance will barely bring DBMS to 76%. Any further absence will make exam eligibility impossible in OS.
                    </p>

                    <div>
                      <div className="space-y-2 mb-5">
                        {[
                          "Notify parents immediately",
                          "Issue formal attendance warning letter",
                          "Investigate reason for absences — commute or health issue possible"
                        ].map((action, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction.alert4 === i ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <input type="radio" name="action_alert4" className="mt-0.5 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" 
                                   checked={selectedAction.alert4 === i} onChange={() => handleActionChange('alert4', i)} />
                            <span className={`text-sm font-medium ${selectedAction.alert4 === i ? 'text-orange-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button onClick={handleNotifyParent} className="px-5 py-2 border-2 border-red-200 text-red-700 font-bold text-sm rounded-xl hover:bg-red-50 transition">
                          Notify Parent
                        </button>
                        <button onClick={() => handleLogIntervention('alert4')} disabled={selectedAction.alert4 === null} className="px-5 py-2 bg-orange-500 disabled:bg-orange-300 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition">
                          Log Intervention
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ALERT 5 - MEDIUM */}
              {alertsList.includes('alert5') && (activeFilter === 'All' || activeFilter === 'Medium') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col animate-fade-in">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1"><Info size={12}/> Medium</span>
                          <span className="text-xs font-semibold text-gray-500">Generated 3 days ago</span>
                        </div>
                        <h2 className="text-lg font-bold text-navy leading-tight">Consistent Below-Average Performance — Needs Support</h2>
                      </div>
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded font-bold text-xs uppercase whitespace-nowrap">Operating Systems</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">DN</div>
                      <p className="font-bold text-navy text-sm">Divya Nair <span className="font-normal text-gray-500">· 2CS31 · CSE 2B</span></p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm mb-5">
                      Divya Nair has scored below class average in all 3 OS unit exams: Unit 1: 58%, Unit 2: 56%, Unit 3: 53%. While not a rapid decline, the consistent below-average pattern with a slight downward trend suggests she may need targeted support on OS fundamentals.
                    </p>

                    <div>
                      <div className="space-y-2 mb-5">
                        {[
                          "Add to next doubt-clearing session",
                          "Share curated OS concept notes",
                          "Pair with a strong student mentor"
                        ].map((action, i) => (
                          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction.alert5 === i ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <input type="radio" name="action_alert5" className="mt-0.5 w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300" 
                                   checked={selectedAction.alert5 === i} onChange={() => handleActionChange('alert5', i)} />
                            <span className={`text-sm font-medium ${selectedAction.alert5 === i ? 'text-amber-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button className="px-5 py-2 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                          View Full Profile
                        </button>
                        <button onClick={() => handleLogIntervention('alert5')} disabled={selectedAction.alert5 === null} className="px-5 py-2 bg-amber-500 disabled:bg-amber-300 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition">
                          Log Intervention
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESOLVED SECTION */}
              {(activeFilter === 'All' || activeFilter === 'Resolved') && (
                <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setShowResolved(!showResolved)} className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition">
                    <h3 className="font-bold text-navy text-lg">Resolved Alerts — This Month (12)</h3>
                    <ChevronDown size={20} className={`text-gray-500 transition-transform ${showResolved ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showResolved && (
                    <div className="p-6 space-y-4 bg-gray-50/50">
                      
                      <div className="bg-white rounded-xl border border-gray-200 relative overflow-hidden flex flex-col opacity-80">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                        <div className="p-4 pl-5">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-navy text-sm">Meera Sharma <span className="font-normal text-gray-500">· 2CS28</span></p>
                            <span className="text-xs text-gray-500">Resolved: 1 April 2026</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1"><span className="font-bold text-gray-500">Issue:</span> Attendance warning — DBMS</p>
                          <p className="text-sm text-gray-700 mb-3"><span className="font-bold text-gray-500">Action:</span> Parent notified, student attendance improved to 81%</p>
                          <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[10px] font-bold uppercase tracking-wider">
                            Positive — attendance recovered
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 relative overflow-hidden flex flex-col opacity-80">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                        <div className="p-4 pl-5">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-navy text-sm">Aditya Verma <span className="font-normal text-gray-500">· 2CS03</span></p>
                            <span className="text-xs text-gray-500">Resolved: 28 March 2026</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1"><span className="font-bold text-gray-500">Issue:</span> Score decline — DSA Unit 2</p>
                          <p className="text-sm text-gray-700 mb-3"><span className="font-bold text-gray-500">Action:</span> Extra coaching session provided, Unit 3 score improved</p>
                          <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[10px] font-bold uppercase tracking-wider">
                            Positive — score up 18%
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 relative overflow-hidden flex flex-col opacity-80">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                        <div className="p-4 pl-5">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-navy text-sm">Riya Kapoor <span className="font-normal text-gray-500">· 2CS35</span></p>
                            <span className="text-xs text-gray-500">Resolved: 25 March 2026</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1"><span className="font-bold text-gray-500">Issue:</span> 3 assignments missed — OS</p>
                          <p className="text-sm text-gray-700 mb-3"><span className="font-bold text-gray-500">Action:</span> Student had health issue, extensions granted, all submitted</p>
                          <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[10px] font-bold uppercase tracking-wider">
                            Resolved — no further issues
                          </span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* CONFIRMATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <MessageCircle size={32} />
              </div>
            </div>
            <h2 className="font-bold text-xl text-navy text-center mb-2">Notify Parent?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Send an automated WhatsApp notification to the registered parent contact regarding this alert?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={confirmNotify} className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition shadow-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
