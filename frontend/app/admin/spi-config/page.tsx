'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Activity, BookOpen, Info, Book, Code, TrendingUp, Award, CheckCircle2, Search, ChevronDown, Home, User, Users, Bell, Grid, FileText, LogOut, Target, CheckCircle, Zap, AlertCircle, Plug } from 'lucide-react'
import { PageHeader, Badge } from '@/components/shared/ui'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/admin' },
  { id: 'config',     label: 'Configuration',    icon: Settings,   badge: null,  active: false, path: '/admin/configuration' },
  { id: 'spi-config', label: 'SPI Weight Config',icon: Target,     badge: null,  active: false, path: '/admin/spi-config' },
  { id: 'institution',label: 'Institution Settings',icon: Grid,    badge: null,  active: false, path: '/admin/institution' },
  { id: 'logs',       label: 'System Logs',      icon: Activity,   badge: null,  active: false, path: '/admin/configuration' },
]

// Dummy raw scores for Priyanshu Raj
const rawScores = {
  academic: 68,
  skill: 71,
  project: 82,
  consistency: 74,
  extra: 62
}

const presets = {
  default: { academic: 30, skill: 20, project: 20, consistency: 20, extra: 10 },
  academic: { academic: 40, skill: 20, project: 15, consistency: 15, extra: 10 },
  project: { academic: 25, skill: 20, project: 30, consistency: 15, extra: 10 },
  balanced: { academic: 30, skill: 20, project: 20, consistency: 20, extra: 10 }
}

const historyData = [
  { date: '14 Apr 2026', user: 'Admin', prev: 'Project: 15%', next: 'Project: 20%', reason: 'Increased to reflect industry emphasis on project portfolios' },
  { date: '1 Feb 2026', user: 'Dean Verma', prev: 'Extra: 15%', next: 'Extra: 10%', reason: 'Reduced after faculty feedback — some students had unfair advantage' },
  { date: '1 Aug 2025', user: 'Admin', prev: 'Academic: 35%', next: 'Academic: 30%', reason: 'Balanced to reduce over-reliance on exam performance' },
  { date: '1 Jan 2025', user: 'Admin', prev: '(Initial config set)', next: 'Academic 35, Skill 20, Project 15, Consistency 20, Extra 10', reason: 'System initialized' },
]

export default function SPIConfigPanel() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [weights, setWeights] = useState({ ...presets.default })
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  
  // Modals
  const [saveModal, setSaveModal] = useState(false)
  const [resetModal, setResetModal] = useState(false)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleSliderChange = (comp: keyof typeof weights, val: string) => {
    setWeights(prev => ({ ...prev, [comp]: parseInt(val) }))
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const is100 = totalWeight === 100

  // Calculate live SPI
  const currentSpi = (
    (weights.academic * rawScores.academic) +
    (weights.skill * rawScores.skill) +
    (weights.project * rawScores.project) +
    (weights.consistency * rawScores.consistency) +
    (weights.extra * rawScores.extra)
  ) / 100

  // Calculate preset SPIs for comparison
  const getPresetSpi = (preset: typeof weights) => {
    return (
      (preset.academic * rawScores.academic) +
      (preset.skill * rawScores.skill) +
      (preset.project * rawScores.project) +
      (preset.consistency * rawScores.consistency) +
      (preset.extra * rawScores.extra)
    ) / 100
  }

  const academicSpi = getPresetSpi(presets.academic)
  const projectSpi = getPresetSpi(presets.project)

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <PageHeader 
        title="SPI Weight Configuration" 
        description="Configure how the Student Potential Index is calculated — adjust weights to match your institution's academic priorities."
        actions={
          <div className="flex gap-3">
            <button onClick={() => setResetModal(true)} className="px-5 py-2.5 bg-surface border border-line text-content-2 font-bold text-sm rounded-xl hover:bg-surface-2 transition shadow-card">
              Reset to Default
            </button>
            <button onClick={() => is100 && setSaveModal(true)} disabled={!is100} className={`px-5 py-2.5 text-white font-bold text-sm rounded-xl transition shadow-card ${is100 ? 'bg-brand hover:bg-brand-strong' : 'bg-gray-300 cursor-not-allowed'}`}>
              Save Configuration
            </button>
          </div>
        }
      />

            {/* Banner */}
            <div className="bg-brand-soft border-l-4 border-l-blue-600 p-4 rounded-r-xl flex items-start gap-3">
              <Info className="text-brand shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-content text-sm mb-1">How SPI Works</h3>
                <p className="text-content-2/80 text-sm">The Student Potential Index is a 0-100 score calculated from 5 weighted components. You can adjust the weight of each component to reflect what your institution values most. The total must always equal 100%.</p>
              </div>
            </div>

            {/* Main Columns */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* LEFT COLUMN: Sliders */}
              <div className="lg:w-[55%] space-y-6">
                
                {/* Sliders Card */}
                <div className="bg-surface rounded-2xl shadow-card border border-line p-6 relative overflow-hidden">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-navy mb-1">Adjust Component Weights</h2>
                    <p className="text-sm text-muted">Drag sliders to change weights — total must equal 100%</p>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className={`text-4xl font-bold mb-1 ${is100 ? 'text-green-600' : 'text-red-600'}`}>
                      Total: {totalWeight}%
                    </div>
                    <p className={`text-sm font-medium ${is100 ? 'text-muted' : 'text-red-500'}`}>
                      {is100 ? 'Perfectly balanced' : 'Adjust sliders so total equals 100%'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Component 1 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-start gap-3 w-48 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand shrink-0"><Book size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-navy">Academic Performance</p>
                          <p className="text-[10px] text-muted leading-tight">Exam scores, assignments, quizzes and practical marks</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input type="range" min="10" max="60" value={weights.academic} onChange={(e) => handleSliderChange('academic', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        <span className="w-12 text-right font-bold text-xl text-brand">{weights.academic}%</span>
                      </div>
                    </div>

                    {/* Component 2 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-start gap-3 w-48 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><Activity size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-navy">Skill Breadth</p>
                          <p className="text-[10px] text-muted leading-tight">Technical skills, programming languages, tools and certifications</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input type="range" min="5" max="40" value={weights.skill} onChange={(e) => handleSliderChange('skill', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                        <span className="w-12 text-right font-bold text-xl text-teal-600">{weights.skill}%</span>
                      </div>
                    </div>

                    {/* Component 3 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-start gap-3 w-48 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand shrink-0"><Code size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-navy">Project Quality</p>
                          <p className="text-[10px] text-muted leading-tight">Project submissions, AI quality scores and faculty ratings</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input type="range" min="5" max="40" value={weights.project} onChange={(e) => handleSliderChange('project', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                        <span className="w-12 text-right font-bold text-xl text-brand">{weights.project}%</span>
                      </div>
                    </div>

                    {/* Component 4 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-start gap-3 w-48 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0"><TrendingUp size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-navy">Consistency & Growth</p>
                          <p className="text-[10px] text-muted leading-tight">Improvement rate, submission consistency, attendance trend</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input type="range" min="5" max="40" value={weights.consistency} onChange={(e) => handleSliderChange('consistency', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                        <span className="w-12 text-right font-bold text-xl text-green-600">{weights.consistency}%</span>
                      </div>
                    </div>

                    {/* Component 5 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-start gap-3 w-48 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><Award size={18} /></div>
                        <div>
                          <p className="font-bold text-sm text-navy">Extracurricular Activities</p>
                          <p className="text-[10px] text-muted leading-tight">Sports, hackathons, clubs, seminars and certifications</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <input type="range" min="0" max="30" value={weights.extra} onChange={(e) => handleSliderChange('extra', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600" />
                        <span className="w-12 text-right font-bold text-xl text-amber-600">{weights.extra}%</span>
                      </div>
                    </div>
                  </div>

                  {!is100 && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 animate-pulse">
                      Total weight is {totalWeight}% — must equal exactly 100% to save. Please adjust sliders.
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-muted mb-3 uppercase tracking-wider">Quick Presets</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setWeights({...presets.academic})} className="px-4 py-2 border border-line rounded-lg text-sm font-bold text-content hover:bg-surface-2 transition">Academic Focus</button>
                      <button onClick={() => setWeights({...presets.project})} className="px-4 py-2 border border-line rounded-lg text-sm font-bold text-content hover:bg-surface-2 transition">Project Focus</button>
                      <button onClick={() => setWeights({...presets.balanced})} className="px-4 py-2 border border-line rounded-lg text-sm font-bold text-content hover:bg-surface-2 transition">Balanced</button>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Live Preview */}
              <div className="lg:w-[45%]">
                <div className="bg-surface rounded-2xl shadow-card border border-line p-6 sticky top-6">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-navy mb-1">Live SPI Preview</h2>
                      <p className="text-sm text-muted">See how current weights affect Priyanshu Raj's SPI score</p>
                    </div>
                    <div className="px-3 py-1.5 bg-surface-2 border border-line rounded-lg text-xs font-bold text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100">
                      Previewing: Priyanshu Raj
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative w-40 h-40 flex items-center justify-center mb-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#4F46E5" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * currentSpi / 100)} className="transition-all duration-500 ease-out" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-navy">{currentSpi.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-muted uppercase tracking-widest">Current Configuration</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* Calc Bars */}
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between text-xs font-bold text-gray-600">
                        <span>Academic ({weights.academic}%) × {rawScores.academic}</span>
                        <span>{(weights.academic * rawScores.academic / 100).toFixed(1)} pts</span>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-100">
                        <div style={{ width: `${(weights.academic * rawScores.academic / 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand transition-all duration-300"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between text-xs font-bold text-gray-600">
                        <span>Skill ({weights.skill}%) × {rawScores.skill}</span>
                        <span>{(weights.skill * rawScores.skill / 100).toFixed(1)} pts</span>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-100">
                        <div style={{ width: `${(weights.skill * rawScores.skill / 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600 transition-all duration-300"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between text-xs font-bold text-gray-600">
                        <span>Project ({weights.project}%) × {rawScores.project}</span>
                        <span>{(weights.project * rawScores.project / 100).toFixed(1)} pts</span>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-100">
                        <div style={{ width: `${(weights.project * rawScores.project / 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand transition-all duration-300"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between text-xs font-bold text-gray-600">
                        <span>Consistency ({weights.consistency}%) × {rawScores.consistency}</span>
                        <span>{(weights.consistency * rawScores.consistency / 100).toFixed(1)} pts</span>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-100">
                        <div style={{ width: `${(weights.consistency * rawScores.consistency / 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-300"></div>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between text-xs font-bold text-gray-600">
                        <span>Extra ({weights.extra}%) × {rawScores.extra}</span>
                        <span>{(weights.extra * rawScores.extra / 100).toFixed(1)} pts</span>
                      </div>
                      <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded bg-gray-100">
                        <div style={{ width: `${(weights.extra * rawScores.extra / 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-600 transition-all duration-300"></div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-line text-right">
                      <p className="font-bold text-navy text-sm">
                        {(weights.academic * rawScores.academic / 100).toFixed(1)} + {(weights.skill * rawScores.skill / 100).toFixed(1)} + {(weights.project * rawScores.project / 100).toFixed(1)} + {(weights.consistency * rawScores.consistency / 100).toFixed(1)} + {(weights.extra * rawScores.extra / 100).toFixed(1)} = <span className="text-brand text-lg">{currentSpi.toFixed(1)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="bg-surface-2 p-3 rounded-lg border border-line">
                      <p className="text-xs font-bold text-navy mb-1">What if you used Academic Focus preset?</p>
                      <p className="text-sm text-gray-600">Priyanshu's SPI would be <span className="font-bold">{academicSpi.toFixed(1)}</span> <span className={`text-xs font-bold ${academicSpi > currentSpi ? 'text-green-600' : 'text-red-600'}`}>({academicSpi > currentSpi ? '+' : ''}{(academicSpi - currentSpi).toFixed(1)} from current)</span></p>
                    </div>
                    <div className="bg-surface-2 p-3 rounded-lg border border-line">
                      <p className="text-xs font-bold text-navy mb-1">What if you used Project Focus preset?</p>
                      <p className="text-sm text-gray-600">Priyanshu's SPI would be <span className="font-bold">{projectSpi.toFixed(1)}</span> <span className={`text-xs font-bold ${projectSpi > currentSpi ? 'text-green-600' : 'text-red-600'}`}>({projectSpi > currentSpi ? '+' : ''}{(projectSpi - currentSpi).toFixed(1)} from current)</span></p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Change History */}
            <div className="bg-surface rounded-2xl shadow-card border border-line overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-surface-2/50">
                <h2 className="text-xl font-bold text-navy">Configuration Change History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-bold text-muted uppercase">
                      <th className="p-4 pl-6">Date</th>
                      <th className="p-4">Changed By</th>
                      <th className="p-4">Previous Config</th>
                      <th className="p-4">New Config</th>
                      <th className="p-4 pr-6">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historyData.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-2/50 transition">
                        <td className="p-4 pl-6 text-muted font-medium whitespace-nowrap">{row.date}</td>
                        <td className="p-4 font-bold text-navy whitespace-nowrap">{row.user}</td>
                        <td className="p-4 text-gray-600">{row.prev}</td>
                        <td className="p-4 text-gray-800 font-bold">{row.next}</td>
                        <td className="p-4 pr-6 text-gray-600 italic">{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

      {/* Modals */}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSaveModal(false)} />
          <div className="bg-surface rounded-2xl shadow-2xl w-[400px] overflow-hidden relative z-10 animate-fade-in p-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 bg-brand/10 text-brand">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Save new SPI weights?</h3>
            <p className="text-muted text-sm mb-6">
              This will recalculate the Student Potential Index (SPI) for all 1,240 students using the new weights.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setSaveModal(false)} className="flex-1 py-2.5 bg-gray-100 text-content font-bold rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={() => { setSaveModal(false); showToast("SPI configuration saved. Recalculation scheduled for tonight."); }} className="flex-1 py-2.5 text-white font-bold rounded-lg transition bg-brand hover:bg-brand/90">Confirm Save</button>
            </div>
          </div>
        </div>
      )}

      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setResetModal(false)} />
          <div className="bg-surface rounded-2xl shadow-2xl w-[400px] overflow-hidden relative z-10 animate-fade-in p-6 text-center">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 bg-gray-100 text-gray-600">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Reset to Defaults?</h3>
            <p className="text-muted text-sm mb-6">
              Reset to 30/20/20/20/10 defaults? Any unsaved changes will be lost.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setResetModal(false)} className="flex-1 py-2.5 bg-gray-100 text-content font-bold rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={() => { setWeights({...presets.default}); setResetModal(false); }} className="flex-1 py-2.5 text-white font-bold rounded-lg transition bg-gray-600 hover:bg-gray-700">Confirm Reset</button>
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

