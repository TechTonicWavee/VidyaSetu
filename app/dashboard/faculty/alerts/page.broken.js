'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, ChevronDown, Settings, CheckCircle } from 'lucide-react'

export default function AlertsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
""

                                            <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                              <p className="text-xs text-gray-400 italic">Outcome tracker will check Sneha's progress in 30 days</p>
                                              "use client"

                                              import React, { useState } from 'react'
                                              import { useRouter } from 'next/navigation'
                                              import { Bell, Search } from 'lucide-react'

                                              export default function AlertsPage() {
                                                const router = useRouter()

                                                const [activeFilter, setActiveFilter] = useState('All')
                                                const [selectedSubject, setSelectedSubject] = useState('All Subjects')
                                                const [alertsList, setAlertsList] = useState(['alert1', 'alert2', 'alert3', 'alert4', 'alert5'])

                                                const meta = {
                                                  alert1: { id: 'alert1', name: 'Sneha Patel', roll: '2CS23', subject: 'Operating Systems', issue: 'Attendance dropped to 68%', severity: 'High', time: '6 hours ago' },
                                                  alert2: { id: 'alert2', name: 'Rohit Sharma', roll: '2CS47', subject: 'DBMS', issue: 'Score declined across units', severity: 'High', time: '1 day ago' },
                                                  alert3: { id: 'alert3', name: 'Arjun Mehta', roll: '2CS09', subject: 'TOC', issue: '3 assignments missed', severity: 'High', time: '1 day ago' },
                                                  alert4: { id: 'alert4', name: 'Karan Joshi', roll: '2CS15', subject: 'DBMS', issue: 'Attendance below threshold', severity: 'Medium', time: '2 days ago' },
                                                  alert5: { id: 'alert5', name: 'Divya Nair', roll: '2CS31', subject: 'Operating Systems', issue: 'Below-average performance', severity: 'Medium', time: '3 days ago' },
                                                }

                                                function handleLogIntervention(alertId) {
                                                  setAlertsList(prev => prev.filter(id => id !== alertId))
                                                }

                                                return (
                                                  <div className="min-h-screen bg-gray-50 flex">
                                                    <aside className="hidden lg:block w-64 bg-white border-r border-gray-100 p-4">
                                                      <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-semibold">PK</div>
                                                        <div>
                                                          <div className="text-sm font-semibold">Prof. Priya Kapoor</div>
                                                          <div className="text-xs text-gray-500">CSE Department</div>
                                                        </div>
                                                      </div>
                                                    </aside>

                                                    <div className="flex-1">
                                                      <header className="bg-white p-5 border-b border-gray-100 flex items-center gap-4">
                                                        <h2 className="text-lg font-semibold">Student Alerts</h2>
                                                        <div className="flex-1" />
                                                        <div className="relative max-w-xs">
                                                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                          <input className="pl-9 pr-3 py-2 rounded-lg border bg-gray-50 text-sm w-full" placeholder="Search students..." />
                                                        </div>
                                                        <button className="ml-3 p-2 rounded-md bg-gray-50"><Bell size={18} /></button>
                                                      </header>

                                                      <main className="p-6 max-w-4xl mx-auto">
                                                        <div className="flex items-center justify-between mb-4">
                                                          <div>
                                                            <h1 className="text-2xl font-bold">Student Alerts</h1>
                                                            <p className="text-sm text-gray-500">Monitor and act on student risk indicators</p>
                                                          </div>
                                                          <div className="text-sm font-bold text-red-700">{alertsList.length} Active</div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                                          {['All', 'High', 'Medium', 'Low', 'Resolved'].map(f => (
                                                            <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full text-sm font-semibold ${activeFilter === f ? 'bg-teal-50 text-teal-700' : 'bg-white border border-gray-200 text-gray-700'}`}>
                                                              {f}
                                                            </button>
                                                          ))}

                                                          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="ml-auto rounded-lg border px-3 py-1 text-sm">
                                                            <option>All Subjects</option>
                                                            <option>DBMS</option>
                                                            <option>Operating Systems</option>
                                                            <option>Theory of Computation</option>
                                                          </select>
                                                        </div>

                                                        <div className="space-y-4">
                                                          {Object.values(meta).map(a => {
                                                            if (!alertsList.includes(a.id)) return null
                                                            if (activeFilter !== 'All' && activeFilter !== 'Resolved' && a.severity !== activeFilter) return null
                                                            if (selectedSubject !== 'All Subjects' && a.subject !== selectedSubject) return null

                                                            const badge = a.severity === 'High' ? 'bg-red-100 text-red-700' : a.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'

                                                            return (
                                                              <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
                                                                <div>
                                                                  <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-medium">{a.name.split(' ').map(n=>n[0]).join('')}</div>
                                                                    <div>
                                                                      <div className="font-semibold text-gray-900">{a.name} <span className="text-xs text-gray-500 font-medium">· {a.roll}</span></div>
                                                                      <div className="text-sm text-gray-600">{a.issue} · <span className="font-medium">{a.time}</span></div>
                                                                    </div>
                                                                  </div>
                                                                </div>

                                                                <div className="flex flex-col items-end gap-3">
                                                                  <div className={`${badge} text-xs font-semibold px-2 py-0.5 rounded-full`}>{a.severity}</div>
                                                                  <div className="flex gap-2">
                                                                    <button onClick={() => router.push(`/dashboard/faculty/student/${a.roll}`)} className="text-sm text-blue-600 font-medium">View Profile</button>
                                                                    <button onClick={() => handleLogIntervention(a.id)} className="text-sm bg-gray-100 px-3 py-1 rounded-md">Mark Resolved</button>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            )
                                                          })}
                                                        </div>
                                                      </main>
                                                    </div>
                                                  </div>
                                                )
                                              }
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
