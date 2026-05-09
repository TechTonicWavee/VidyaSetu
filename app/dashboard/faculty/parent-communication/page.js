/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'
import { Home, User, Activity, BookOpen, Bell, Settings, LogOut, Search, ChevronDown, AlertTriangle, MessageSquare, Target, Calendar, QrCode, FileText, Send, Check, CheckCheck, Phone, Video, MoreVertical, Clock, CheckCircle2, ChevronUp, ChevronRight, TrendingUp, Users, Award, Grid, CheckCircle, Zap, AlertCircle, Plug, ExternalLink, Brain } from 'lucide-react'

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
]

export default function FacultyParentCommunication() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('parent')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [meetingsExpanded, setMeetingsExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleTemplateClick = (template) => {
    if (template === 'Attendance Warning') {
      setMessageInput("Dear Parent, I wanted to inform you that your child's attendance has fallen below the required 75% threshold in [Subject]. Please encourage them to attend all remaining classes.")
    } else if (template === 'Score Update') {
      setMessageInput("Dear Parent, this is an update regarding your child's recent performance. Their score in [Subject] has [improved/declined] to [Score]. Let's discuss this.")
    } else if (template === 'Meeting Request') {
      setMessageInput("Dear Parent, I would like to schedule a brief meeting to discuss your child's academic progress. Please let me know your availability for next week.")
    } else if (template === 'Positive Feedback') {
      setMessageInput("Dear Parent, I'm happy to report that your child is doing exceptionally well in [Subject] practicals. Their recent project was outstanding.")
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    showToast('Message sent')
    setMessageInput('')
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•
          SIDEBAR
      A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A• */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>
              {FACULTY_PROFILE.initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{FACULTY_PROFILE.name}</p>
              <p className="text-xs text-gray-500 truncate">{FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                if (link.external) { window.open(link.external, '_blank'); return; }
                if (link.path) {
                  router.push(link.path)
                } else {
                  if (typeof setActiveNav === 'function') setActiveNav(link.id)
                }
              }}
              className="nav-link w-full text-left mb-0.5"
              style={activeNav === link.id && !link.external ? { background: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : {}}
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
          <button onClick={() => router.push('/login')} className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•
          MAIN CONTENT
      A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A•A• */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4338CA' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search resources, alerts..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-[#F3F4F6]">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-6 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Parent Communication</h1>
                <p className="text-gray-500 text-sm max-w-2xl">Direct messaging with parents, meeting scheduling and automated WhatsApp digest management</p>
              </div>
              <button onClick={() => showToast('New message dialog opened')} className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                <MessageSquare size={16} /> New Message
              </button>
            </div>

            {/* TOP STATS STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-blue-600 leading-none mb-1">24</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">Conversations</p>
                  <p className="text-xs text-gray-500">Active parent conversations</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-red-600 leading-none mb-1">7</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">Unread</p>
                  <p className="text-xs text-gray-500">Messages awaiting reply</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-indigo-500 leading-none mb-1">3</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">Meetings This Week</p>
                  <p className="text-xs text-gray-500">Scheduled parent meetings</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-green-600 leading-none mb-1">243</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">WhatsApp Digests Sent</p>
                  <p className="text-xs text-gray-500">This month to all parents</p>
                </div>
              </div>
            </div>

            {/* MAIN COMMUNICATION AREA */}
            <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
              
              {/* LEFT COLUMN: Conversation List */}
              <div className="w-full lg:w-[35%] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search parent or student name..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100" />
                  </div>
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full whitespace-nowrap">All</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-full whitespace-nowrap">Unread</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-full whitespace-nowrap">Meetings</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-full whitespace-nowrap">Alerts</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Item 1 - Active */}
                  <div className="p-4 border-b border-gray-100 bg-blue-50 cursor-pointer relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy flex items-center gap-2">
                        Mr. Ramesh Singh
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </h4>
                      <span className="text-xs text-blue-600 font-medium whitespace-nowrap">2 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Mahesh Singh A· 2CS04</p>
                    <div className="flex justify-between items-end gap-4">
                      <p className="text-sm text-gray-700 truncate flex-1 font-medium text-navy">"Thank you for the update. We will make sure he..."</p>
                      <span className="flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full shrink-0">2</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy flex items-center gap-2">
                        Mrs. Kavya Sharma
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">5 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Rohit Sharma A· 2CS47</p>
                    <div className="flex justify-between items-end gap-4">
                      <p className="text-sm text-gray-600 truncate flex-1 font-medium text-navy">"Is there any way to improve his DBMS scores before..."</p>
                      <span className="flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full shrink-0">1</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mr. Anil Patel</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">Yesterday</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Sneha Patel A· 2CS23</p>
                    <p className="text-sm text-gray-500 truncate">"We have spoken to Sneha. She will attend all..."</p>
                  </div>

                  {/* Item 4 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mrs. Deepa Joshi</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">Yesterday</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Karan Joshi A· 2CS15</p>
                    <p className="text-sm text-gray-500 truncate">"Understood. We will monitor her attendance closely..."</p>
                  </div>

                  {/* Item 5 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mr. Sunil Mehta</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">2 days ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Arjun Mehta A· 2CS09</p>
                    <div className="flex justify-between items-end gap-4">
                      <p className="text-sm text-gray-500 truncate flex-1">"Can we schedule a meeting next week to discuss..."</p>
                      <Calendar size={16} className="text-indigo-500 shrink-0" />
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mrs. Priya Nair</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">3 days ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Divya Nair A· 2CS31</p>
                    <p className="text-sm text-gray-500 truncate">"Thank you for the report. Very helpful to understand..."</p>
                  </div>

                  {/* Item 7 */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mr. Ravi Gupta</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">4 days ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Ananya Verma A· 2CS07</p>
                    <p className="text-sm text-gray-500 truncate">"Ananya has been working very hard. We appreciate..."</p>
                  </div>

                  {/* Item 8 */}
                  <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-navy">Mrs. Sonal Kumar</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">5 days ago</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Krish Singhal A· 2CS22</p>
                    <p className="text-sm text-gray-500 truncate">"We received the WhatsApp digest. Had a question about..."</p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Active Conversation */}
              <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white z-10 shadow-sm relative">
                  <div>
                    <h2 className="text-xl font-bold text-navy mb-1">Mr. Ramesh Singh</h2>
                    <p className="text-xs text-gray-500 font-medium">Parent of Mahesh Singh A· 2CS04 A· CSE 2B</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition" title="View Student Profile" onClick={() => router.push('/dashboard/faculty/student/profile')}>
                      <User size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" title="Generate Visit QR">
                      <QrCode size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition" title="Schedule Meeting">
                      <Calendar size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Summary Strip */}
                <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex justify-between items-center text-sm z-10 relative">
                  <div className="flex gap-6">
                    <span className="text-blue-900"><span className="font-bold">SPI:</span> 72</span>
                    <span className="text-blue-900"><span className="font-bold">Attendance:</span> 79%</span>
                    <span className="text-blue-900"><span className="font-bold">Latest Score:</span> 71% DBMS</span>
                    <span className="text-red-700 font-bold flex items-center gap-1"><AlertTriangle size={14}/> 2 Active Alerts</span>
                  </div>
                  <button className="text-blue-700 font-bold hover:underline" onClick={() => router.push('/dashboard/faculty/student/profile')}>View Full Profile</button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
                  
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">April 13, 2026</span>
                  </div>

                  {/* Msg 1 - Faculty */}
                  <div className="flex flex-col items-end">
                    <div className="max-w-[75%] bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
                      <p className="text-sm leading-relaxed">
                        Dear Mr. Singh, I wanted to inform you that Mahesh's attendance in Theory of Computation has dropped to 74% A€” just below the 75% minimum threshold. He needs to attend all remaining classes to maintain eligibility.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                      <span>10:34 AM</span>
                      <CheckCheck size={14} className="text-blue-500" />
                    </div>
                  </div>

                  {/* Msg 2 - Parent */}
                  <div className="flex flex-col items-start">
                    <div className="max-w-[75%] bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                      <p className="text-sm leading-relaxed">
                        Thank you for letting us know, Prof. Kapoor. We will speak with Mahesh today. Is there anything specific we should ask him to focus on for TOC?
                      </p>
                    </div>
                    <div className="mt-1 text-[10px] text-gray-400 ml-1">
                      <span>11:02 AM</span>
                    </div>
                  </div>

                  {/* Msg 3 - Faculty */}
                  <div className="flex flex-col items-end">
                    <div className="max-w-[75%] bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
                      <p className="text-sm leading-relaxed">
                        Yes, please encourage him to focus on Regular Expressions and Automata Theory concepts A€” these are the specific weak areas from his Unit 2 exam. I can share some revision notes if helpful.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                      <span>11:15 AM</span>
                      <CheckCheck size={14} className="text-blue-500" />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">April 15, 2026</span>
                  </div>

                  {/* Msg 4 - Parent */}
                  <div className="flex flex-col items-start">
                    <div className="max-w-[75%] bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                      <p className="text-sm leading-relaxed">
                        That would be very helpful. Also, Mahesh mentioned his DBMS practical went well A€” we are glad to hear that at least. Please do share the notes.
                      </p>
                    </div>
                    <div className="mt-1 text-[10px] text-gray-400 ml-1">
                      <span>9:45 AM</span>
                    </div>
                  </div>

                  {/* Msg 5 - Parent UNREAD */}
                  <div className="flex flex-col items-start relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <div className="max-w-[75%] bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm relative">
                      <p className="text-sm leading-relaxed">
                        Thank you for the update. We will make sure he attends all remaining classes.
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2 ml-1">
                      <span className="text-[10px] text-gray-400">9:46 AM</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase tracking-wider">New</span>
                    </div>
                  </div>

                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  {/* Templates */}
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 pb-1">
                    <span className="text-xs text-gray-500 font-bold self-center mr-2 uppercase tracking-wider">Templates:</span>
                    <button onClick={() => handleTemplateClick('Attendance Warning')} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium rounded-full whitespace-nowrap transition border border-red-100">Attendance Warning</button>
                    <button onClick={() => handleTemplateClick('Score Update')} className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium rounded-full whitespace-nowrap transition border border-amber-100">Score Update</button>
                    <button onClick={() => handleTemplateClick('Meeting Request')} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-medium rounded-full whitespace-nowrap transition border border-indigo-100">Meeting Request</button>
                    <button onClick={() => handleTemplateClick('Positive Feedback')} className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium rounded-full whitespace-nowrap transition border border-green-100">Positive Feedback</button>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      className="w-full border border-gray-200 rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition min-h-[80px] resize-none bg-gray-50"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    ></textarea>
                    <button 
                      onClick={handleSendMessage}
                      className={`absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${messageInput.trim() ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-400'}`}
                      disabled={!messageInput.trim()}
                    >
                      <Send size={14} className={messageInput.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
                    <button onClick={() => showToast('WhatsApp digest dispatched to parent')} className="px-4 py-2 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-lg whitespace-nowrap transition">Send WhatsApp Digest Now</button>
                    <button onClick={() => showToast('Meeting scheduler opened')} className="px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-lg whitespace-nowrap transition">Schedule Parent-Teacher Meeting</button>
                    <button onClick={() => showToast('Summary PDF generated')} className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg whitespace-nowrap transition">Generate Student Summary PDF</button>
                  </div>
                </div>

              </div>
            </div>

            {/* MEETINGS SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setMeetingsExpanded(!meetingsExpanded)}
                className="w-full p-5 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-indigo-600" />
                  <h3 className="font-bold text-navy text-lg">Upcoming Parent-Teacher Meetings (3)</h3>
                </div>
                {meetingsExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
              </button>

              {meetingsExpanded && (
                <div className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Meeting 1 */}
                    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200">Confirmed</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><User size={14} /></div>
                      </div>
                      <h4 className="font-bold text-navy text-base">Mr. Sunil Mehta</h4>
                      <p className="text-xs text-gray-500 mb-4 font-medium">(Parent of Arjun Mehta)</p>
                      
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} className="text-gray-400" /> 18 April 2026
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock size={14} className="text-gray-400" /> 3:00 PM
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User size={14} className="text-gray-400" /> Faculty Room 204
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-5 border border-gray-100 text-sm text-gray-700">
                        <span className="font-bold text-navy block mb-1 text-xs uppercase tracking-wider">Agenda:</span>
                        Discuss 3 missed assignments and TOC performance
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-50 transition">Reschedule</button>
                        <button className="flex-1 py-2 bg-white border border-gray-200 text-red-600 font-bold text-xs rounded-lg hover:bg-red-50 transition">Cancel</button>
                      </div>
                    </div>

                    {/* Meeting 2 */}
                    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase rounded border border-amber-200">Pending Confirmation</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><User size={14} /></div>
                      </div>
                      <h4 className="font-bold text-navy text-base">Mrs. Kavya Sharma</h4>
                      <p className="text-xs text-gray-500 mb-4 font-medium">(Parent of Rohit Sharma)</p>
                      
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} className="text-gray-400" /> 19 April 2026
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock size={14} className="text-gray-400" /> 11:00 AM
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User size={14} className="text-gray-400" /> Faculty Room 204
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-5 border border-gray-100 text-sm text-gray-700">
                        <span className="font-bold text-navy block mb-1 text-xs uppercase tracking-wider">Agenda:</span>
                        DBMS score decline across 3 consecutive units
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition">Confirm</button>
                        <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-50 transition">Reschedule</button>
                      </div>
                    </div>

                    {/* Meeting 3 */}
                    <div className="border border-indigo-200 border-2 rounded-xl p-5 shadow-md bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200">Confirmed</span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Video size={14} /></div>
                      </div>
                      <h4 className="font-bold text-navy text-base">Mr. Anil Patel</h4>
                      <p className="text-xs text-gray-500 mb-4 font-medium">(Parent of Sneha Patel)</p>
                      
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} className="text-gray-400" /> 20 April 2026
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock size={14} className="text-gray-400" /> 2:30 PM
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                          <Video size={14} className="text-blue-500" /> Online A€” Google Meet
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded-lg mb-5 border border-red-100 text-sm text-gray-700">
                        <span className="font-bold text-red-800 block mb-1 text-xs uppercase tracking-wider">Agenda:</span>
                        <span className="text-red-900">Critical at attendance and multiple risk factors</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-[2] py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                          <Video size={14} /> Join Meet
                        </button>
                        <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-50 transition">Cancel</button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

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
