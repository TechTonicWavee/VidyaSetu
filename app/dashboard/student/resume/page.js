'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Download, Edit2, CheckCircle2, GripVertical, AlertTriangle, Send, Link as LinkIcon, Target, CheckCircle, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: true, path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/dashboard/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/dashboard/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/dashboard/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/dashboard/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/dashboard/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/dashboard/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/dashboard/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/dashboard/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/dashboard/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/dashboard/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/dashboard/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]

const initialSections = [
  { id: 'personal', label: 'Personal Information', enabled: true, toggleable: true },
  { id: 'education', label: 'Education', enabled: true, toggleable: true },
  { id: 'skills', label: 'Technical Skills', enabled: true, toggleable: true },
  { id: 'projects', label: 'Projects', enabled: true, toggleable: true },
  { id: 'achievements', label: 'Achievements & Awards', enabled: true, toggleable: true },
  { id: 'certifications', label: 'Certifications', enabled: true, toggleable: true },
  { id: 'extra', label: 'Extracurriculars', enabled: true, toggleable: true },
  { id: 'comm', label: 'Communication Skills', enabled: true, toggleable: true },
  { id: 'research', label: 'Research Papers', enabled: false, toggleable: true },
  { id: 'work', label: 'Work Experience', enabled: false, toggleable: false, note: 'Add internship to enable' },
]

const templates = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
]

const colors = [
  { id: 'blue', value: '#2563EB' },
  { id: 'navy', value: '#1E3A8A' },
  { id: 'teal', value: '#0D9488' },
  { id: 'purple', value: '#7C3AED' },
  { id: 'black', value: '#111827' },
]

const fonts = ['Calibri', 'Arial', 'Times New Roman', 'Georgia']

export default function ResumeBuilderPage() {
  const router = useRouter()
  const [activeNav] = useState('resume')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const [sections, setSections] = useState(initialSections)
  const [template, setTemplate] = useState('classic')
  const [accentColor, setAccentColor] = useState('#2563EB')
  const [font, setFont] = useState('Calibri')

  const [toastMessage, setToastMessage] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const toggleSection = (id) => {
    setSections(sections.map(s => {
      if (s.id === id && s.toggleable) {
        return { ...s, enabled: !s.enabled }
      }
      return s
    }))
  }

  const isEnabled = (id) => sections.find(s => s.id === id)?.enabled

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm z-20`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
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
            <input type="text" placeholder="Search resources, students, domains..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 pb-20">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Resume Builder</h1>
                <p className="text-gray-500 text-sm max-w-2xl">Your resume is automatically built from your verified platform data — skills, projects, achievements and certifications all pulled in for you</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => showToast('Edit mode coming soon — resume auto-updates from your profile')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition">
                  <Edit2 size={16} /> Edit Resume
                </button>
                <button 
                  onClick={() => showToast('Preparing your resume for download...')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition shadow-sm">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>

            {/* Resume Completeness Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <h3 className="font-bold text-navy mb-3">Resume Completeness</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-3 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="font-black text-blue-700">78% Complete</span>
                </div>
                <p className="text-sm text-blue-800 font-medium">Your resume is strong. Add 2 more items to reach 100%.</p>
              </div>
              
              <div className="flex-1 w-full md:border-l md:border-blue-200 md:pl-6 space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/50 border border-amber-200 text-amber-800 rounded-lg text-sm font-bold w-fit">
                  <AlertTriangle size={16} className="text-amber-500" /> Add a LinkedIn profile URL
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-100/50 border border-amber-200 text-amber-800 rounded-lg text-sm font-bold w-fit">
                  <AlertTriangle size={16} className="text-amber-500" /> Add one more certification
                </div>
                <p className="text-xs text-blue-700 font-medium pt-1">Complete these to reach 100% and unlock Premium Resume template</p>
              </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* LEFT COLUMN: Controls */}
              <div className="w-full lg:w-[40%] space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                
                {/* Toggles */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Resume Sections</h3>
                  <div className="space-y-2">
                    {sections.map(section => (
                      <div key={section.id} className={`flex items-center justify-between p-2.5 rounded-lg border ${section.toggleable ? 'hover:bg-gray-50 border-transparent' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <GripVertical size={16} className="text-gray-400 cursor-grab" />
                          <span className={`text-sm font-semibold ${section.enabled ? 'text-navy' : 'text-gray-500'}`}>{section.label}</span>
                          {section.note && <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">{section.note}</span>}
                        </div>
                        <button 
                          onClick={() => toggleSection(section.id)}
                          disabled={!section.toggleable}
                          className={`w-10 h-5 rounded-full relative transition-colors ${section.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${section.enabled ? 'left-5.5 right-0.5' : 'left-0.5'}`} style={{ transform: section.enabled ? 'translateX(18px)' : 'translateX(0)' }}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Resume Template</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${template === t.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className={`w-full aspect-[3/4] rounded-md border shadow-sm flex overflow-hidden ${t.id === 'modern' ? 'bg-gray-100' : 'bg-white'}`}>
                          {t.id === 'classic' && (
                            <div className="w-full h-full flex flex-col">
                              <div className="h-4 bg-blue-500 w-full"></div>
                              <div className="flex-1 p-2 space-y-1">
                                <div className="h-1 bg-gray-200 w-1/2"></div>
                                <div className="h-0.5 bg-gray-200 w-full mt-2"></div>
                              </div>
                            </div>
                          )}
                          {t.id === 'modern' && (
                            <div className="w-full h-full flex">
                              <div className="w-1/3 bg-navy h-full"></div>
                              <div className="w-2/3 bg-white h-full"></div>
                            </div>
                          )}
                          {t.id === 'minimal' && (
                            <div className="w-full h-full flex flex-col p-2 space-y-1">
                              <div className="h-1 bg-gray-300 w-1/2 mx-auto"></div>
                              <div className="h-px bg-gray-200 w-full my-1"></div>
                              <div className="h-1 bg-gray-200 w-1/3"></div>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-bold ${template === t.id ? 'text-blue-700' : 'text-gray-500'}`}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font and Color */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Styling Options</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1.5">Font Family</label>
                      <select 
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        {colors.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setAccentColor(c.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${accentColor === c.value ? 'scale-110 border-gray-400 shadow-md' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Preview */}
              <div className="w-full lg:w-[60%] flex justify-center bg-gray-200/50 p-4 md:p-8 rounded-2xl border border-gray-200 overflow-x-auto">
                {/* A4 Paper Container */}
                <div 
                  className="bg-white shadow-lg w-[800px] min-h-[1131px] flex-shrink-0 transition-all duration-300 relative"
                  style={{ 
                    fontFamily: font === 'Arial' ? 'Arial, sans-serif' : font === 'Times New Roman' ? '"Times New Roman", serif' : font === 'Georgia' ? 'Georgia, serif' : 'Calibri, sans-serif' 
                  }}
                >
                  
                  {/* TEMPLATE: MODERN */}
                  {template === 'modern' ? (
                    <div className="flex w-full h-full min-h-[1131px]">
                      {/* Left Sidebar */}
                      <div className="w-[30%] p-8 text-white h-full" style={{ backgroundColor: accentColor }}>
                        {isEnabled('personal') && (
                          <div className="mb-10">
                            <h1 className="text-3xl font-bold mb-2 break-words leading-tight">PRIYANSHU RAJ</h1>
                            <div className="space-y-3 mt-6 text-sm text-white/90">
                              <p className="flex items-center gap-2"><Send size={14} className="opacity-70"/> arman.singh@college.edu</p>
                              <p className="flex items-center gap-2"><Send size={14} className="opacity-70"/> +91 98765 43210</p>
                              <p className="flex items-center gap-2"><LinkIcon size={14} className="opacity-70"/> github.com/armansingh</p>
                              <p className="flex items-center gap-2"><LinkIcon size={14} className="opacity-70"/> Delhi, India</p>
                            </div>
                          </div>
                        )}
                        
                        {isEnabled('skills') && (
                          <div className="mb-8">
                            <h2 className="text-lg font-bold border-b border-white/20 pb-2 mb-4 tracking-widest uppercase">Skills</h2>
                            <div className="space-y-4 text-sm">
                              <div>
                                <p className="font-bold text-white/90 mb-1">Languages</p>
                                <p className="text-white/80">Python, JavaScript, C++, Java</p>
                              </div>
                              <div>
                                <p className="font-bold text-white/90 mb-1">Frameworks</p>
                                <p className="text-white/80">React.js, Node.js, TensorFlow, Flask, Express.js</p>
                              </div>
                              <div>
                                <p className="font-bold text-white/90 mb-1">Databases & Cloud</p>
                                <p className="text-white/80">MongoDB, MySQL, Firebase, AWS, Vercel</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {isEnabled('certifications') && (
                          <div>
                            <h2 className="text-lg font-bold border-b border-white/20 pb-2 mb-4 tracking-widest uppercase">Certifications</h2>
                            <ul className="space-y-3 text-sm text-white/90 list-none pl-0">
                              <li><span className="font-bold block">Machine Learning</span> NPTEL · Score: 78%</li>
                              <li><span className="font-bold block">Python for Data Science</span> Coursera · IBM</li>
                              <li><span className="font-bold block">Responsive Web Design</span> freeCodeCamp</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Content */}
                      <div className="w-[70%] p-8 bg-white text-gray-800">
                        {isEnabled('education') && (
                          <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>Education</h2>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>B.Tech in Computer Science & Engineering</span>
                                  <span>2023 — 2027</span>
                                </div>
                                <p className="text-gray-600">College of Engineering, Delhi</p>
                                <p className="text-gray-600 font-medium mt-1">CGPA: 7.4 / 10.0</p>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>Class 12 — CBSE Board</span>
                                  <span>2023</span>
                                </div>
                                <p className="text-gray-600">Delhi Public School, Delhi</p>
                                <p className="text-gray-600 font-medium mt-1">Percentage: 87.4%</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {isEnabled('projects') && (
                          <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>Projects</h2>
                            <div className="space-y-5">
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>Crop Disease Detection using CNN</span>
                                </div>
                                <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Python · TensorFlow · Flask · OpenCV</p>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                  <li>Built a deep learning model using CNN architecture to detect diseases in crop leaf images</li>
                                  <li>Achieved 94% accuracy on test dataset of 5,000 images</li>
                                  <li>Deployed as a Flask web app with real-time image upload and prediction</li>
                                </ul>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>Student Attendance Portal</span>
                                </div>
                                <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>React.js · Node.js · MongoDB</p>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                  <li>Developed a full-stack web portal for digital attendance tracking with analytics dashboard</li>
                                  <li>Supports 500+ students, 20+ faculty across 4 departments</li>
                                  <li>Reduced manual attendance errors by 85% in pilot deployment</li>
                                </ul>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>E-Commerce Recommendation System</span>
                                </div>
                                <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Python · React · Firebase</p>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                  <li>Built collaborative filtering based product recommendation engine</li>
                                  <li>Implemented user behavior analysis with 73% recommendation accuracy</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {isEnabled('achievements') && (
                          <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>Achievements</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                              <li><span className="font-bold text-gray-900">Smart India Hackathon 2025</span> — National Finalist (Top 50 of 8,000+ teams)</li>
                              <li><span className="font-bold text-gray-900">Inter-College Cricket Tournament</span> — State Level Runner-Up, Aug 2025</li>
                              <li><span className="font-bold text-gray-900">Academic Excellence</span> — Scored above class average in 3 of 4 subjects this semester</li>
                            </ul>
                          </div>
                        )}
                        
                        {isEnabled('extra') && (
                          <div>
                            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider" style={{ color: accentColor }}>Extracurriculars</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                              <li><span className="font-bold text-gray-900">Joint Secretary</span> — Technical Society, College of Engineering Delhi (Jan 2025 — Present)</li>
                              <li><span className="font-bold text-gray-900">Member</span> — IEEE Student Chapter (2024 — Present)</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* TEMPLATE: CLASSIC OR MINIMAL */
                    <div className="w-full h-full pb-10">
                      
                      {isEnabled('personal') && (
                        <div className={`${template === 'classic' ? 'text-white p-8 text-center' : 'p-8 pb-4 text-center border-b border-gray-200'}`} style={{ backgroundColor: template === 'classic' ? accentColor : 'transparent' }}>
                          <h1 className={`text-4xl font-bold mb-3 tracking-wide ${template === 'minimal' ? 'text-gray-900' : ''}`}>PRIYANSHU RAJ</h1>
                          <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm ${template === 'minimal' ? 'text-gray-600' : 'text-white/90'}`}>
                            <span>arman.singh@college.edu</span>
                            <span>+91 98765 43210</span>
                            <span>github.com/armansingh</span>
                            <span>Delhi, India</span>
                          </div>
                        </div>
                      )}

                      <div className="px-10 py-6 space-y-6">
                        
                        {isEnabled('education') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Education
                            </h2>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>B.Tech in Computer Science & Engineering</span>
                                  <span>2023 — 2027 (Expected)</span>
                                </div>
                                <p className="text-gray-800">College of Engineering, Delhi</p>
                                <p className="text-sm text-gray-600 font-medium">CGPA: 7.4 / 10.0 (up to 4th Semester)</p>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>Class 12 — CBSE Board</span>
                                  <span>2023</span>
                                </div>
                                <p className="text-gray-800">Delhi Public School, Delhi</p>
                                <p className="text-sm text-gray-600 font-medium">Percentage: 87.4%</p>
                              </div>
                            </div>
                          </section>
                        )}

                        {isEnabled('skills') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Technical Skills
                            </h2>
                            <div className="text-sm space-y-2">
                              <p><span className="font-bold text-gray-900">Languages:</span> Python, JavaScript, C++, Java</p>
                              <p><span className="font-bold text-gray-900">Frameworks:</span> React.js, Node.js, TensorFlow, Flask, Express.js</p>
                              <p><span className="font-bold text-gray-900">Databases & Cloud:</span> MongoDB, MySQL, Firebase, AWS, Vercel</p>
                              <p><span className="font-bold text-gray-900">Tools & Currently Learning:</span> Git, VS Code, Figma, Postman, Docker, TypeScript</p>
                            </div>
                          </section>
                        )}

                        {isEnabled('projects') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Projects
                            </h2>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between font-bold text-gray-900 text-base">
                                  <span>Crop Disease Detection using CNN</span>
                                </div>
                                <p className="text-sm italic text-gray-600 mb-1">Tech: Python · TensorFlow · Flask · OpenCV</p>
                                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                                  <li>Built a deep learning model using CNN architecture to detect diseases in crop leaf images</li>
                                  <li>Achieved 94% accuracy on test dataset of 5,000 images</li>
                                  <li>Deployed as a Flask web app with real-time image upload and prediction</li>
                                </ul>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900 text-base">
                                  <span>Student Attendance Portal</span>
                                </div>
                                <p className="text-sm italic text-gray-600 mb-1">Tech: React.js · Node.js · MongoDB</p>
                                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                                  <li>Developed a full-stack web portal for digital attendance tracking with analytics dashboard</li>
                                  <li>Supports 500+ students, 20+ faculty across 4 departments</li>
                                  <li>Reduced manual attendance errors by 85% in pilot deployment</li>
                                </ul>
                              </div>
                              <div>
                                <div className="flex justify-between font-bold text-gray-900 text-base">
                                  <span>E-Commerce Recommendation System</span>
                                </div>
                                <p className="text-sm italic text-gray-600 mb-1">Tech: Python · React · Firebase</p>
                                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                                  <li>Built collaborative filtering based product recommendation engine</li>
                                  <li>Implemented user behavior analysis with 73% recommendation accuracy</li>
                                </ul>
                              </div>
                            </div>
                          </section>
                        )}

                        {isEnabled('achievements') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Achievements
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1.5">
                              <li><span className="font-bold text-gray-900">Smart India Hackathon 2025</span> — National Finalist (Top 50 of 8,000+ teams)</li>
                              <li><span className="font-bold text-gray-900">Inter-College Cricket Tournament</span> — State Level Runner-Up, Aug 2025</li>
                              <li><span className="font-bold text-gray-900">NPTEL Machine Learning</span> — Elite Certificate, Score 78%, Jul 2025</li>
                              <li><span className="font-bold text-gray-900">IEEE Workshop on AI in Healthcare</span> — Presenter, Mar 2025</li>
                              <li><span className="font-bold text-gray-900">Academic Excellence</span> — Scored above class average in 3 of 4 subjects this semester</li>
                            </ul>
                          </section>
                        )}

                        {isEnabled('certifications') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Certifications
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1.5">
                              <li><span className="font-bold">NPTEL</span> — Machine Learning (IIT Madras) · 2025 · Score: 78%</li>
                              <li><span className="font-bold">Coursera</span> — Python for Data Science (IBM) · 2024</li>
                              <li><span className="font-bold">freeCodeCamp</span> — Responsive Web Design · 2024</li>
                              <li><span className="font-bold">HackerRank</span> — Python (Gold Badge) · 2024</li>
                            </ul>
                          </section>
                        )}

                        {isEnabled('extra') && (
                          <section>
                            <h2 className={`text-lg font-bold mb-3 uppercase tracking-widest ${template === 'classic' ? 'pl-2 border-l-4' : 'border-b pb-1'}`} style={{ borderColor: accentColor, color: template === 'minimal' ? '#111' : accentColor }}>
                              Extracurriculars
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1.5">
                              <li><span className="font-bold text-gray-900">Joint Secretary</span> — Technical Society, College of Engineering Delhi (Jan 2025 — Present)</li>
                              <li><span className="font-bold text-gray-900">Cricket Team Member</span> — College Cricket Club, State level representation</li>
                              <li><span className="font-bold text-gray-900">Member</span> — IEEE Student Chapter (2024 — Present)</li>
                            </ul>
                          </section>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            
          </div>
        </main>

        {/* STICKY BOTTOM BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-6 md:px-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500">
            Last updated: 2 hours ago from your profile data
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => showToast('Preparing your resume for download...')}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
              <Download size={16} /> Download PDF
            </button>
            <button 
              onClick={() => showToast('Share link copied to clipboard!')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
              <LinkIcon size={16} /> Copy Share Link
            </button>
            <button 
              onClick={() => setReviewModalOpen(true)}
              className="px-5 py-2.5 border border-teal-500 text-teal-700 font-bold text-sm rounded-xl hover:bg-teal-50 transition flex items-center gap-2">
              <CheckCircle2 size={16} /> Request Faculty Review
            </button>
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50">
          {toastMessage}
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">Request Faculty Review</h2>
              <p className="text-sm text-gray-600 mb-6">Send your current resume to Prof. Priya Kapoor for review and feedback?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setReviewModalOpen(false)} 
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setReviewModalOpen(false)
                    showToast('Resume sent to Prof. Priya Kapoor for review')
                  }} 
                  className="flex-1 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition shadow-sm"
                >
                  Confirm & Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
