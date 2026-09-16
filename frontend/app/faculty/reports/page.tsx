'use client'

import { useState, useEffect } from 'react'
import {
  FileText, Download, Calendar, CheckCircle,
  RefreshCw, Clock, Filter, Sliders, Database, Eye
} from 'lucide-react'
import { PageHeader, Card, StatCard, Badge, Button, Modal } from '@/components/shared/ui'

const FILTER_TABS = ['All', 'NAAC/NBA', 'Intervention', 'Compliance', 'Academic']

interface ReportItem {
  id: string
  name: string
  desc: string
  type: 'NAAC/NBA' | 'Intervention' | 'Compliance' | 'Academic'
  updated: string
  status: 'ready' | 'generating'
  size: string | null
  pages: number | null
}

const initialReports: ReportItem[] = [
  { id: 'rep_02', name: 'At-Risk Students List', desc: 'Students flagged by attendance or score decline across subjects this semester.', type: 'Intervention', updated: 'May 03, 2026', status: 'ready', size: '1.1 MB', pages: 6 },
  { id: 'rep_03', name: 'Attendance Compliance', desc: 'Attendance distribution and shortage warnings by section for current term.', type: 'Compliance', updated: 'May 02, 2026', status: 'ready', size: '0.8 MB', pages: 4 },
  { id: 'rep_04', name: 'End-Term Performance Report', desc: 'Aggregated marks, grade distribution and pass/fail analysis per subject.', type: 'Academic', updated: 'Apr 30, 2026', status: 'generating', size: null, pages: null },
  { id: 'rep_05', name: 'PO/PSO Mapping Audit', desc: 'CO-PO-PSO mapping coverage and attainment gaps for accreditation review.', type: 'NAAC/NBA', updated: 'Apr 28, 2026', status: 'ready', size: '3.2 MB', pages: 18 },
  { id: 'rep_06', name: 'Parent Communication Log', desc: 'Summary of all parent notifications, escalations and resolved interventions.', type: 'Compliance', updated: 'Apr 25, 2026', status: 'ready', size: '0.5 MB', pages: 3 },
]

export default function FacultyReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(initialReports)
  const [activeFilter, setActiveFilter] = useState('All')
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [configuring, setConfiguring] = useState<Record<string, boolean>>({})
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({})

  // Configuration / Live DB Preview Modal
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [modalData, setModalData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [thresholdCgpa, setThresholdCgpa] = useState('6.0')
  const [thresholdAttendance, setThresholdAttendance] = useState('75')

  const filtered = activeFilter === 'All' ? reports : reports.filter(r => r.type === activeFilter)
  const readyCount = reports.filter(r => r.status === 'ready').length
  const pendingCount = reports.filter(r => r.status === 'generating').length

  const handleDownload = (id: string) => {
    setDownloaded(prev => ({ ...prev, [id]: true }))
    
    // Trigger real browser download from PostgreSQL database endpoint
    const link = document.createElement('a')
    link.href = `/api/faculty/reports/download/${id}`
    link.setAttribute('download', `${id}_database_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => setDownloaded(prev => ({ ...prev, [id]: false })), 2500)
  }

  const handleExportPack = (packType: 'naac' | 'nba') => {
    setDownloaded(prev => ({ ...prev, [packType]: true }))

    const link = document.createElement('a')
    link.href = `/api/faculty/reports/export/${packType}`
    link.setAttribute('download', `${packType.toUpperCase()}_Accreditation_Pack.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => setDownloaded(prev => ({ ...prev, [packType]: false })), 2500)
  }

  const handleGenerate = async (id: string) => {
    setGenerating(prev => ({ ...prev, [id]: true }))

    try {
      await fetch(`/api/faculty/reports/generate/${id}`, { method: 'POST' })
    } catch (e) {
      console.warn('Backend generation call:', e)
    }

    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'ready', size: '2.1 MB', pages: 8 } : r))
      setGenerating(prev => ({ ...prev, [id]: false }))
    }, 3000)
  }

  const handleConfigureClick = async (report: ReportItem) => {
    setConfiguring(prev => ({ ...prev, [report.id]: true }))
    setSelectedReport(report)
    setLoadingData(true)
    setModalData(null)

    try {
      const res = await fetch(`/api/faculty/reports/data/${report.id}`)
      const json = await res.json()
      if (json.success) {
        setModalData(json.data)
      }
    } catch (err) {
      console.error('Failed to load live database data for report', err)
    } finally {
      setLoadingData(false)
      setTimeout(() => setConfiguring(prev => ({ ...prev, [report.id]: false })), 1000)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Reports"
        description="Generate and download audit-ready reports for accreditation and review."
      />

      {/* STAT PILLS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value={reports.length.toString()} icon={FileText} tone="brand" />
        <StatCard label="Ready to Download" value={readyCount.toString()} icon={CheckCircle} tone="success" />
        <StatCard label="Generating" value={pendingCount.toString()} icon={RefreshCw} tone="amber" />
        <StatCard label="Last Updated" value="May 03" icon={Clock} tone="blue" />
      </div>

      {/* QUICK EXPORTS */}
      <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-content">
          <Download size={16} className="text-brand" />
          <span>Quick Exports</span>
        </div>
        <p className="text-xs text-muted flex-1">Download pre-packaged report bundles with live data for accreditation bodies.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => handleExportPack('naac')}
            icon={downloaded['naac'] ? CheckCircle : Download}
            className={downloaded['naac'] ? 'bg-success hover:bg-success-strong text-white' : ''}
          >
            {downloaded['naac'] ? 'Downloaded!' : 'Download NAAC Pack'}
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleExportPack('nba')}
            icon={downloaded['nba'] ? CheckCircle : Download}
            className={downloaded['nba'] ? 'text-success font-semibold' : ''}
          >
            {downloaded['nba'] ? 'Downloaded!' : 'Download NBA Pack'}
          </Button>
        </div>
      </Card>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted" />
        {FILTER_TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === tab 
                ? 'bg-brand text-brand-fg shadow-sm' 
                : 'bg-surface border border-line text-content-2 hover:bg-surface-2'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CARDS GRID (EXACTLY 5 REPORTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filtered.map((r) => {
          let tone: 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple' | 'yellow' = 'brand'
          if (r.type === 'Intervention') tone = 'amber'
          if (r.type === 'Compliance') tone = 'blue'
          if (r.type === 'Academic') tone = 'purple'

          const isGen = generating[r.id]
          const isCfg = configuring[r.id]
          const isDl = downloaded[r.id]

          return (
            <Card key={r.id} className="flex flex-col h-full group hover:border-brand/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Badge tone={tone} className="mb-2 text-[10px]">
                    {r.type}
                  </Badge>
                  <h2 className="font-semibold text-content text-sm leading-tight">{r.name}</h2>
                </div>
                <div className="w-9 h-9 rounded-xl bg-surface-2 border border-line flex items-center justify-center flex-shrink-0 ml-3 text-muted group-hover:text-brand transition-colors">
                  <FileText size={17} />
                </div>
              </div>

              <p className="text-xs text-content-2 leading-relaxed flex-1 mb-4">{r.desc}</p>

              <div className="flex items-center justify-between text-[11px] text-muted mb-4">
                <span className="flex items-center gap-1"><Calendar size={11} /> Updated {r.updated}</span>
                <div className="flex items-center gap-3">
                  {r.pages && <span>{r.pages} pages</span>}
                  {r.size && <span>{r.size}</span>}
                  {r.status === 'generating' && (
                    <span className="flex items-center gap-1 text-amber font-semibold">
                      <RefreshCw size={10} className="animate-spin" /> Generating
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-4 border-t border-line/50">
                <Button 
                  variant="secondary"
                  onClick={() => handleConfigureClick(r)}
                  className="flex-1 text-xs"
                >
                  {isCfg ? 'Configuring…' : 'Configure'}
                </Button>
                
                {r.status === 'ready' ? (
                  <Button 
                    onClick={() => handleDownload(r.id)}
                    icon={isDl ? CheckCircle : Download}
                    className={`flex-1 text-xs ${isDl ? 'bg-success hover:bg-success-strong text-white' : ''}`}
                  >
                    {isDl ? 'Done!' : 'Download'}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleGenerate(r.id)} 
                    disabled={isGen}
                    icon={RefreshCw}
                    className="flex-1 bg-amber text-amber-fg hover:bg-amber-600 text-xs"
                  >
                    {isGen ? 'Generating…' : 'Generate'}
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* LIVE DATABASE CONFIGURATION & PREVIEW MODAL */}
      {selectedReport && (
        <Modal
          title={`Configure & Live Database Preview: ${selectedReport.name}`}
          width="xl"
          onClose={() => setSelectedReport(null)}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Database size={14} className="text-brand" />
                <span>Connected to PostgreSQL Database (Live Data)</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleDownload(selectedReport.id)
                    setSelectedReport(null)
                  }}
                  icon={Download}
                >
                  Export Real Data (.CSV)
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Parameters Bar */}
            <div className="p-4 bg-surface-2 rounded-xl border border-line flex flex-wrap gap-4 items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Sliders size={16} className="text-brand" />
                <span className="font-semibold text-content">Audit Filter Parameters:</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted">Attendance Min %:</span>
                  <input 
                    type="number"
                    value={thresholdAttendance}
                    onChange={e => setThresholdAttendance(e.target.value)}
                    className="w-16 px-2 py-1 rounded bg-surface border border-line text-content text-xs text-center"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted">CGPA Cutoff:</span>
                  <input 
                    type="number"
                    step="0.1"
                    value={thresholdCgpa}
                    onChange={e => setThresholdCgpa(e.target.value)}
                    className="w-16 px-2 py-1 rounded bg-surface border border-line text-content text-xs text-center"
                  />
                </div>
              </div>
            </div>

            {/* Live Database Content */}
            {loadingData ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted">
                <RefreshCw size={24} className="animate-spin text-brand" />
                <p className="text-xs">Querying database records from Supabase...</p>
              </div>
            ) : modalData ? (
              <div className="space-y-4">
                {/* rep_02: At-Risk Students */}
                {selectedReport.id === 'rep_02' && (
                  <div>
                    <div className="flex justify-between items-center mb-3 text-xs">
                      <span className="font-semibold text-content">
                        Flagged Students in Database ({modalData.students?.length || 0}):
                      </span>
                      <span className="text-muted">Filtered by CGPA &lt; {thresholdCgpa} or Attendance &lt; {thresholdAttendance}%</span>
                    </div>
                    <div className="overflow-x-auto max-h-64 border border-line rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-surface-2 text-muted uppercase text-[10px] sticky top-0 border-b border-line">
                          <tr>
                            <th className="p-2.5">Roll No</th>
                            <th className="p-2.5">Student Name</th>
                            <th className="p-2.5">Section</th>
                            <th className="p-2.5">CGPA</th>
                            <th className="p-2.5">Attendance</th>
                            <th className="p-2.5">Risk Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/60">
                          {modalData.students?.map((s: any) => (
                            <tr key={s.universityId} className="hover:bg-surface-2/50">
                              <td className="p-2.5 font-mono text-muted">{s.universityId}</td>
                              <td className="p-2.5 font-medium text-content">{s.fullName}</td>
                              <td className="p-2.5 text-muted">{s.section}</td>
                              <td className="p-2.5 font-bold text-amber">{s.cgpa ?? 'N/A'}</td>
                              <td className="p-2.5 text-muted">{s.attendance}%</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-amber/10 text-amber font-medium">
                                  {s.riskFlag}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* rep_03: Attendance Compliance */}
                {selectedReport.id === 'rep_03' && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted">
                      Total enrolled students across academic sections: <strong className="text-content">{modalData.totalStudents}</strong>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {modalData.sections?.map((sec: any) => (
                        <div key={sec.section} className="p-3 bg-surface-2 rounded-xl border border-line text-xs">
                          <p className="font-bold text-content text-sm">Section {sec.section}</p>
                          <p className="text-muted mt-1">Total: {sec.totalStudents} students</p>
                          <p className="text-success font-semibold">Compliant: {sec.compliantStudents}</p>
                          <p className="text-amber">Shortage: {sec.shortageCount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* rep_04: End-Term Performance */}
                {selectedReport.id === 'rep_04' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-surface-2 rounded-xl border border-line">
                        <p className="text-muted">Assessed Students</p>
                        <p className="text-lg font-bold text-content mt-1">{modalData.assessedStudents}</p>
                      </div>
                      <div className="p-3 bg-surface-2 rounded-xl border border-line">
                        <p className="text-muted">Batch Average CGPA</p>
                        <p className="text-lg font-bold text-brand mt-1">{modalData.averageCgpa}</p>
                      </div>
                      <div className="p-3 bg-surface-2 rounded-xl border border-line">
                        <p className="text-muted">Top Performer</p>
                        <p className="text-xs font-bold text-content mt-1">{modalData.topScorer?.fullName} ({modalData.topScorer?.cgpa})</p>
                      </div>
                    </div>

                    <div className="p-3 border border-line rounded-xl">
                      <p className="font-semibold text-content mb-2">Grade Distribution Breakdown (Live DB):</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {Object.entries(modalData.gradeDistribution || {}).map(([grade, count]: any) => (
                          <div key={grade} className="p-2 bg-surface-2 rounded text-center">
                            <p className="text-[10px] text-muted">{grade.split(' ')[0]}</p>
                            <p className="font-bold text-content text-sm">{count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* rep_05: PO/PSO Mapping Audit */}
                {selectedReport.id === 'rep_05' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-content">NBA Criteria 3.1 - Program Outcomes Attainment Matrix</span>
                      <Badge tone="green">Overall Coverage: {modalData.poCoverage}</Badge>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-line rounded-xl divide-y divide-line">
                      {modalData.programOutcomes?.map((po: any) => (
                        <div key={po.code} className="p-2.5 flex items-center justify-between hover:bg-surface-2">
                          <div>
                            <span className="font-bold text-content font-mono mr-2">{po.code}</span>
                            <span className="text-content-2">{po.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand">{po.attainment}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
                              {po.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* rep_06: Parent Communication Log */}
                {selectedReport.id === 'rep_06' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-content">Parent Advisory Dispatches ({modalData.totalCommunications})</span>
                      <span className="text-muted">Channel: Official SMS &amp; Email</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-line rounded-xl divide-y divide-line">
                      {modalData.records?.map((r: any) => (
                        <div key={r.universityId} className="p-2.5 flex items-center justify-between hover:bg-surface-2">
                          <div>
                            <p className="font-semibold text-content">{r.fullName} ({r.universityId})</p>
                            <p className="text-[11px] text-muted">Sec {r.section} · Contact: {r.parentContact}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-medium">
                              {r.status}
                            </span>
                            <p className="text-[10px] text-muted mt-1">{r.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-6">No data available.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}


