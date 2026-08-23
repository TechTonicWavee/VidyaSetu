'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, RefreshCw, FileUp, CheckCircle2, AlertTriangle } from 'lucide-react'
import { apiFetch } from '@/lib/shared/api/client'
import { PageHeader, Card, Button, Badge, StatCard } from '@/components/shared/ui'

export default function FacultyAttendancePage() {
  const router = useRouter()
  
  const [year, setYear] = useState('2026-2027')
  const [semester, setSemester] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setPreviewData(null)
      setError('')
      setSuccess('')
    }
  }

  const handlePreview = async () => {
    if (!file) return
    if (!semester) {
      setError('Please select a semester before previewing.')
      return
    }

    setUploading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('semester', semester)
      
      const data = await apiFetch<any>('/api/attendance/preview', {
        method: 'POST',
        body: formData
      })
      
      setPreviewData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to preview file.')
    } finally {
      setUploading(false)
    }
  }

  const handleConfirm = async () => {
    if (!previewData || !previewData.parsedRows) return
    
    setUploading(true)
    setError('')
    
    try {
      const data = await apiFetch<any>('/api/attendance/confirm', {
        method: 'POST',
        body: JSON.stringify({ rows: previewData.parsedRows })
      })
      
      setSuccess(`Successfully updated attendance for ${data.updatedCount} students.`)
      setPreviewData(null)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.message || 'Failed to confirm upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      <PageHeader 
        title="Attendance Upload"
        description="Upload the .xlsx attendance report to sync with student dashboards."
      />

      {success && (
        <div className="bg-success-soft/20 border border-success-soft/50 text-success rounded-xl p-4 flex gap-3 items-center">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-danger-soft/20 border border-danger-soft/50 text-danger rounded-xl p-4 flex gap-3 items-start">
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!previewData && (
        <Card className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-2">Academic Year</label>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-surface border border-line rounded-lg p-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase mb-2">Semester</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-surface border border-line rounded-lg p-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30"
              >
                <option value="">Select Semester</option>
                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(s => (
                  <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${file ? 'border-brand/40 bg-brand-soft/10' : 'border-line hover:border-brand/40 hover:bg-surface-2'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" accept=".xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <FileUp size={40} className={file ? 'text-brand' : 'text-muted'} />
            <p className="mt-4 text-sm font-semibold text-content">
              {file ? file.name : 'Click or drag and drop to upload'}
            </p>
            <p className="text-xs text-muted mt-1">.xlsx format only</p>
          </div>

          <div className="flex justify-end">
            <Button 
              disabled={!file || !semester || uploading}
              onClick={handlePreview}
              icon={uploading ? RefreshCw : Upload}
              className={uploading ? '[&_svg]:animate-spin' : ''}
            >
              Preview Attendance
            </Button>
          </div>
        </Card>
      )}

      {previewData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Rows Matched" value={previewData.matchedCount} hint="Existing students found" tone="brand" />
            <StatCard label="Rows Missing" value={previewData.missingCount} hint="Students not in database" tone="amber" />
            <StatCard label="Rows Skipped" value={previewData.skippedCount} hint="Invalid data or NR" tone="danger" />
          </div>

          <Card className="overflow-hidden p-0 sm:p-0">
            <div className="p-5 border-b border-line flex flex-wrap justify-between items-center gap-4 bg-surface">
              <div>
                <h3 className="font-bold text-content text-lg">Preview: First 10 Rows</h3>
                <p className="text-xs text-content-2 mt-0.5">Found Total % in column <span className="font-bold text-brand">{previewData.totalColLetter}</span></p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  disabled={uploading}
                  onClick={() => setPreviewData(null)}
                >
                  Cancel
                </Button>
                <Button 
                  disabled={uploading || previewData.matchedCount === 0}
                  onClick={handleConfirm}
                  icon={uploading ? RefreshCw : CheckCircle2}
                  className={uploading ? '[&_svg]:animate-spin' : ''}
                >
                  Confirm Upload
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                    <th className="px-6 py-4">Registration No.</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4 text-center">Attended (A)</th>
                    <th className="px-6 py-4 text-center">Total (T)</th>
                    <th className="px-6 py-4 text-center">Percentage (P)</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {previewData.previewRows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-surface-2/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-content">{row.registrationNo}</td>
                      <td className="px-6 py-4 text-content-2">{row.name}</td>
                      <td className="px-6 py-4 text-center text-content-2 font-medium">{row.attended}</td>
                      <td className="px-6 py-4 text-center text-content-2 font-medium">{row.total}</td>
                      <td className="px-6 py-4 text-center font-bold text-brand">{row.percentage}%</td>
                      <td className="px-6 py-4">
                        {row.status === 'valid' ? (
                          <Badge tone="green">Valid</Badge>
                        ) : (
                          <span title={row.reason}><Badge tone="red">Skipped</Badge></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
