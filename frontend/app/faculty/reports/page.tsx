'use client'

import { useState } from 'react'
import {
  FileText, Download, Calendar, CheckCircle,
  RefreshCw, Clock, Eye, Filter
} from 'lucide-react'
import { PageHeader, Card, StatCard, Badge, Button } from '@/components/shared/ui'

const FILTER_TABS = ['All', 'NAAC/NBA', 'Intervention', 'Compliance', 'Academic']

const mockReports = [
  { id: 'rep_01', name: 'CO Attainment Summary', desc: 'Subject-wise CO1–CO3 attainment with status and overall % across all sections.', type: 'NAAC/NBA', updated: 'May 04, 2026', status: 'ready', size: '2.4 MB', pages: 12 },
  { id: 'rep_02', name: 'At-Risk Students List', desc: 'Students flagged by attendance or score decline across subjects this semester.', type: 'Intervention', updated: 'May 03, 2026', status: 'ready', size: '1.1 MB', pages: 6 },
  { id: 'rep_03', name: 'Attendance Compliance', desc: 'Attendance distribution and shortage warnings by section for current term.', type: 'Compliance', updated: 'May 02, 2026', status: 'ready', size: '0.8 MB', pages: 4 },
  { id: 'rep_04', name: 'End-Term Performance Report', desc: 'Aggregated marks, grade distribution and pass/fail analysis per subject.', type: 'Academic', updated: 'Apr 30, 2026', status: 'generating', size: null, pages: null },
  { id: 'rep_05', name: 'PO/PSO Mapping Audit', desc: 'CO-PO-PSO mapping coverage and attainment gaps for accreditation review.', type: 'NAAC/NBA', updated: 'Apr 28, 2026', status: 'ready', size: '3.2 MB', pages: 18 },
  { id: 'rep_06', name: 'Parent Communication Log', desc: 'Summary of all parent notifications, escalations and resolved interventions.', type: 'Compliance', updated: 'Apr 25, 2026', status: 'ready', size: '0.5 MB', pages: 3 },
]

export default function FacultyReportsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({})

  const filtered = activeFilter === 'All' ? mockReports : mockReports.filter(r => r.type === activeFilter)
  const readyCount = mockReports.filter(r => r.status === 'ready').length
  const pendingCount = mockReports.filter(r => r.status === 'generating').length

  const handleDownload = (id: string) => {
    setDownloaded(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setDownloaded(prev => ({ ...prev, [id]: false })), 2500)
  }
  const handleGenerate = (id: string) => {
    setGenerating(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setGenerating(prev => ({ ...prev, [id]: false })), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Reports"
        description="Generate and download audit-ready reports for accreditation and review."
      />

      {/* STAT PILLS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value={mockReports.length.toString()} icon={FileText} tone="brand" />
        <StatCard label="Ready to Download" value={readyCount.toString()} icon={CheckCircle} tone="success" />
        <StatCard label="Generating" value={pendingCount.toString()} icon={RefreshCw} tone="amber" />
        <StatCard label="Last Updated" value="May 04" icon={Clock} tone="blue" />
      </div>

      {/* QUICK EXPORTS */}
      <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-content">
          <Download size={16} className="text-brand" />
          <span>Quick Exports</span>
        </div>
        <p className="text-xs text-muted flex-1">Download pre-packaged report bundles for accreditation bodies.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => handleDownload('naac')}
            icon={downloaded['naac'] ? CheckCircle : Download}
            className={downloaded['naac'] ? 'bg-success hover:bg-success-strong text-white' : ''}
          >
            {downloaded['naac'] ? 'Downloaded!' : 'Download NAAC Pack'}
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleDownload('nba')}
            icon={downloaded['nba'] ? CheckCircle : Download}
            className={downloaded['nba'] ? 'text-success' : ''}
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

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filtered.map((r, idx) => {
          let tone: 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple' | 'yellow' = 'brand'
          if (r.type === 'Intervention') tone = 'amber'
          if (r.type === 'Compliance') tone = 'blue'
          if (r.type === 'Academic') tone = 'purple'

          const isGen = generating[r.id]
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
                  onClick={() => handleGenerate(r.id)}
                  className="flex-1 text-xs"
                >
                  {isGen ? 'Configuring…' : 'Configure'}
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
      
    </div>
  )
}

