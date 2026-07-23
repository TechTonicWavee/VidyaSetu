'use client'

import { useState, useMemo } from 'react'
import { Clock, AlertTriangle, CheckCircle, ExternalLink, Star, Calendar, MessageSquare, FileText, Search } from 'lucide-react'
import { useToast } from '@/components/ToastContext'

export default function AssignmentDashboard() {
  const { addToast } = useToast()
  const [filter, setFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')

  const assignments = [
    {
      id: 1,
      status: 'Overdue',
      subject: 'Operating Systems',
      subjectColor: 'teal',
      title: 'OS Assignment 4 — Process Scheduling Algorithms',
      faculty: 'Prof. Priya Kapoor',
      dueDate: 'April 16, 2026 at 11:59 PM',
      overdueText: '1 day overdue',
      description: 'Analyze FCFS, SJF, Round Robin and Priority Scheduling algorithms. Solve 5 Gantt chart problems with waiting time and turnaround time calculations.',
      marks: '25 marks',
      statusBox: 'You have not submitted this assignment. Contact Prof. Kapoor immediately — late submission may be accepted with penalty.',
      type: 'Overdue'
    },
    {
      id: 2,
      status: 'Due Tomorrow',
      subject: 'DBMS',
      subjectColor: 'blue',
      title: 'DBMS Assignment 5 — Query Optimization and Indexing',
      faculty: 'Prof. Priya Kapoor',
      dueDate: 'April 17, 2026 at 11:59 PM',
      remainingText: 'Tomorrow — 18 hours remaining',
      description: 'Write optimized SQL queries for 10 given scenarios. Create indexes and explain query execution plans using EXPLAIN ANALYZE.',
      marks: '25 marks',
      reminder: 'Reminder sent to your WhatsApp 3 hours ago',
      type: 'Pending'
    },
    {
      id: 3,
      status: 'Pending',
      subject: 'TOC',
      subjectColor: 'purple',
      title: 'TOC Assignment 3 — Regular Expressions and DFA',
      faculty: 'Dr. Suresh Iyer',
      dueDate: 'April 22, 2026',
      remainingText: '7 days remaining',
      description: 'Design DFAs for 5 given languages. Convert Regular Expressions to NFAs using Thompson\'s construction.',
      marks: '20 marks',
      reminders: [
        'April 19 — 3 days before reminder',
        'April 21 — 1 day before reminder',
        'April 22, 8 AM — morning of deadline'
      ],
      type: 'Pending'
    },
    {
      id: 4,
      status: 'Graded',
      subject: 'DBMS',
      subjectColor: 'blue',
      title: 'DBMS Assignment 3 — Normalization Practice',
      faculty: 'Prof. Priya Kapoor',
      submittedDate: 'April 5, 2026 · 3 days before deadline',
      grade: '23 / 25',
      gradePercent: '92% — Excellent',
      feedback: 'Excellent understanding of normalization up to 3NF. Minor errors in BCNF decomposition. Well-structured SQL queries overall.',
      type: 'Graded'
    },
    {
      id: 5,
      status: 'Graded',
      subject: 'OS',
      subjectColor: 'teal',
      title: 'OS Assignment 3 — Memory Management',
      faculty: 'Prof. Priya Kapoor',
      submittedDate: 'April 1, 2026 · 2 days before deadline',
      grade: '19 / 25',
      gradePercent: '76% — Good',
      feedback: 'Correct paging calculations. Segmentation section needs more detail.',
      type: 'Graded'
    },
    {
      id: 6,
      status: 'Submitted — Awaiting Grade',
      subject: 'DSA',
      subjectColor: 'green',
      title: 'DSA Assignment 3 — Graph Algorithms',
      faculty: 'Dr. Anita Sharma',
      submittedDate: 'April 12, 2026 · On deadline day',
      statusBox: 'Submitted on time. Waiting for Dr. Anita Sharma to grade. Usually takes 3-5 days. Submitted 3 days ago — grade expected soon',
      type: 'Submitted'
    },
    { id: 7, status: 'Graded', subject: 'DBMS', subjectColor: 'blue', title: 'DBMS Assignment 2', grade: '21/25', percent: '84%', type: 'Graded' },
    { id: 8, status: 'Graded', subject: 'OS', subjectColor: 'teal', title: 'OS Assignment 2', grade: '18/25', percent: '72%', type: 'Graded' },
    { id: 9, status: 'Graded', subject: 'TOC', subjectColor: 'purple', title: 'TOC Assignment 2', grade: '16/20', percent: '80%', type: 'Graded' },
    { id: 10, status: 'Graded', subject: 'DSA', subjectColor: 'green', title: 'DSA Assignment 2', grade: '22/25', percent: '88%', type: 'Graded' },
    { id: 11, status: 'Graded', subject: 'DBMS', subjectColor: 'blue', title: 'DBMS Assignment 1', grade: '24/25', percent: '96%', type: 'Graded' },
  ]

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesStatus = filter === 'All' || a.type === filter || (filter === 'Submitted' && (a.type === 'Graded' || a.type === 'Submitted'))
      const matchesSubject = subjectFilter === 'All Subjects' || a.subject.includes(subjectFilter)
      return matchesStatus && matchesSubject
    })
  }, [filter, subjectFilter])

  const handleMoodleRedirect = () => {
    addToast('Opening Moodle — redirecting to moodle.college.edu', 'info')
  }

  return (
    <div className="bg-gray-50/50 min-h-full">
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in pb-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-1">Assignments</h1>
            <p className="text-gray-500 text-sm">Pulled live from Moodle LMS — all your assignments in one place with smart deadline reminders</p>
          </div>
          <div className="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 self-start sm:self-auto">
            <div className="w-6 h-6 bg-[#f98012] flex items-center justify-center rounded text-white font-bold text-[10px]">M</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#f98012] uppercase tracking-wider">Synced from Moodle</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Last updated: 2 mins ago</span>
              </div>
            </div>
          </div>
        </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Assignments', value: '11', sub: 'This semester', icon: FileText, color: 'blue' },
                { label: 'Submitted', value: '7', sub: 'On time or early', icon: CheckCircle, color: 'green' },
                { label: 'Pending', value: '2', sub: 'Not yet submitted', icon: Clock, color: 'amber' },
                { label: 'Overdue', value: '1', sub: 'Missed deadline', icon: AlertTriangle, color: 'red' },
                { label: 'Graded', value: '6', sub: 'Results available', icon: Star, color: 'teal' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className={`w-10 h-10 bg-${s.color}-50 rounded-full flex items-center justify-center mb-3 text-${s.color}-600`}>
                    <s.icon size={20} />
                  </div>
                  <p className={`text-2xl font-black text-${s.color}-600 mb-1`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto max-w-full">
                {['All', 'Pending', 'Submitted', 'Overdue', 'Graded'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter(p)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === p ? (p === 'Overdue' ? 'bg-red-600 text-white shadow-sm' : p === 'Pending' ? 'bg-amber-500 text-white' : p === 'Submitted' ? 'bg-green-600 text-white' : p === 'Graded' ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white') : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {p} {p === 'All' ? '(11)' : p === 'Pending' ? '(2)' : p === 'Submitted' ? '(7)' : p === 'Overdue' ? '(1)' : '(6)'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]"
                >
                  <option>All Subjects</option>
                  <option>DBMS</option>
                  <option>OS</option>
                  <option>TOC</option>
                  <option>DSA</option>
                </select>
                <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]">
                  <option>Due Date — Soonest First</option>
                  <option>Due Date — Latest First</option>
                  <option>Subject</option>
                  <option>Status</option>
                </select>
              </div>
            </div>

            {/* ASSIGNMENT LIST */}
            <div className="grid grid-cols-1 gap-6">
              {filteredAssignments.map((a, i) => (
                <div
                  key={a.id}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 border-y border-r border-gray-200 overflow-hidden relative group transition-all hover:shadow-md ${a.status === 'Overdue' ? 'border-l-red-500 ring-2 ring-red-500/10' : a.status === 'Due Tomorrow' ? 'border-l-amber-500 ring-2 ring-amber-500/10' : a.type === 'Pending' ? 'border-l-blue-500' : a.type === 'Graded' ? 'border-l-green-500' : 'border-l-blue-500'} ${a.status === 'Overdue' ? 'animate-pulse-subtle' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${a.status === 'Overdue' ? 'bg-red-500 text-white' : a.status === 'Due Tomorrow' ? 'bg-amber-500 text-white' : a.type === 'Pending' ? 'bg-blue-500 text-white' : a.type === 'Graded' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {a.status}
                        </span>
                        <h3 className="text-lg font-bold text-navy leading-tight">{a.title}</h3>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                          {a.faculty} • <span className={`px-2 py-0.5 rounded bg-${a.subjectColor}-50 text-${a.subjectColor}-600 text-[10px] font-bold uppercase`}>{a.subject}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#f98012] flex items-center justify-center rounded text-white font-bold text-[8px]">M</div>
                        <Search size={14} className="text-gray-300" />
                      </div>
                    </div>

                    {a.id <= 6 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-3 font-semibold text-sm">
                              <Calendar size={16} className={a.status === 'Overdue' ? 'text-red-500' : a.status === 'Due Tomorrow' ? 'text-amber-500' : 'text-blue-500'} />
                              {a.dueDate ? (
                                <span>{a.status === 'Overdue' ? 'Was due: ' : 'Due: '}{a.dueDate}</span>
                              ) : (
                                <span>Submitted: {a.submittedDate}</span>
                              )}
                            </div>
                            {a.overdueText && <p className="text-sm font-bold text-red-600 mb-4">{a.overdueText}</p>}
                            {a.remainingText && <p className={`text-sm font-bold mb-4 ${a.status === 'Due Tomorrow' ? 'text-amber-600' : 'text-blue-600'}`}>{a.remainingText}</p>}
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{a.description}</p>
                            <p className="text-xs text-gray-400 mt-2 font-semibold tracking-wide uppercase">{a.marks}</p>
                          </div>
                          <div className="flex flex-col gap-4">
                            {a.statusBox && (
                              <div className={`p-4 rounded-xl text-sm font-medium border ${a.status === 'Overdue' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                                {a.statusBox}
                              </div>
                            )}
                            {a.grade && (
                              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-2xl font-black text-green-700">{a.grade}</span>
                                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{a.gradePercent}</span>
                                </div>
                                <p className="text-xs text-green-800/80 leading-relaxed italic">"{a.feedback}"</p>
                              </div>
                            )}
                            {a.reminder && (
                              <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-fit">
                                {a.reminder}
                              </div>
                            )}
                            {a.reminders && (
                              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Scheduled Reminders</p>
                                <div className="space-y-1.5">
                                  {a.reminders.map((r, idx) => (
                                    <p key={idx} className="text-[11px] text-blue-700 font-medium">{r}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-auto">
                          <button onClick={handleMoodleRedirect} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition shadow-sm">
                            <ExternalLink size={15} /> Open in Moodle
                          </button>
                          {a.status === 'Overdue' && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-teal-200 text-teal-700 font-bold text-sm rounded-xl hover:bg-teal-50 transition">
                              <MessageSquare size={15} /> Message Faculty
                            </button>
                          )}
                          {a.status === 'Due Tomorrow' && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                              View Similar Past Assignment
                            </button>
                          )}
                          {a.type === 'Graded' && (
                            <button onClick={handleMoodleRedirect} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-orange-200 text-orange-700 font-bold text-sm rounded-xl hover:bg-orange-50 transition">
                              View Full Feedback in Moodle
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      /* COMPACT CARDS for 7-11 */
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-50 px-3 py-1 rounded text-[11px] font-bold text-green-700 border border-green-100">
                            {a.grade} • {a.percent}
                          </div>
                          <button onClick={handleMoodleRedirect} className="text-orange-600 font-bold text-[11px] hover:underline flex items-center gap-1">
                            View in Moodle <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* UPCOMING TIMELINE */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="mb-10">
                <h2 className="text-xl font-bold text-navy mb-1">Upcoming Deadline Timeline</h2>
                <p className="text-sm text-gray-500">Next 30 days — all deadlines in one view</p>
              </div>

              <div className="relative overflow-x-auto pb-8 pt-20 hide-scrollbar">
                <div className="min-w-[800px] relative flex items-center h-2">
                  <div className="absolute inset-0 bg-gray-100 h-0.5 mt-0.5 w-full z-0" />

                  {/* Today Marker */}
                  <div className="absolute left-[5%] flex flex-col items-center z-10">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-sm ring-2 ring-blue-100" />
                    <span className="absolute -bottom-6 text-[10px] font-black text-blue-600 uppercase">Today</span>
                  </div>

                  {/* April 17 - TOMORROW */}
                  <div className="absolute left-[15%] flex flex-col items-center z-10 group">
                    <div className="absolute -top-16 bg-white border border-amber-200 p-3 rounded-xl shadow-md w-40 animate-bounce-slow">
                      <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded block w-fit mb-1">URGENT</span>
                      <p className="text-[11px] font-bold text-navy truncate">DBMS Assignment 5</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">25 marks • Due 11:59 PM</p>
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm ring-2 ring-red-100" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-600 uppercase">Apr 17</span>
                  </div>

                  {/* April 22 */}
                  <div className="absolute left-[35%] flex flex-col items-center z-10">
                    <div className="absolute -top-14 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-36 hover:shadow-md transition">
                      <p className="text-[11px] font-bold text-navy truncate">TOC Assignment 3</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">20 marks • 7 days</p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">Apr 22</span>
                  </div>

                  {/* April 30 */}
                  <div className="absolute left-[55%] flex flex-col items-center z-10">
                    <div className="absolute -top-14 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-36">
                      <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded block w-fit mb-1 tracking-tight">NEW ON MOODLE</span>
                      <p className="text-[11px] font-bold text-navy truncate">OS Assignment 5</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">25 marks • 15 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">Apr 30</span>
                  </div>

                  {/* May 8 */}
                  <div className="absolute left-[75%] flex flex-col items-center z-10">
                    <div className="absolute -top-12 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-32">
                      <p className="text-[11px] font-bold text-navy truncate">DSA Assignment 4</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">30 marks • 23 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">May 08</span>
                  </div>

                  {/* May 15 */}
                  <div className="absolute left-[95%] flex flex-col items-center z-10">
                    <div className="absolute -top-12 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-32">
                      <p className="text-[11px] font-bold text-navy truncate">DBMS Assignment 6</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">25 marks • 30 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">May 15</span>
                  </div>
                </div>
              </div>
            </div>

        </div>

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.005); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
