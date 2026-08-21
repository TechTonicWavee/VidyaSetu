'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, RefreshCw, FileUp, CheckCircle2, AlertTriangle } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'

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
    <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-navy">Attendance Upload</h1>
              <p className="text-gray-500 text-sm mt-1">Upload the .xlsx attendance report to sync with student dashboards.</p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex gap-3 items-center">
                <CheckCircle2 className="text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex gap-3 items-start">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {!previewData && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Academic Year</label>
                    <select 
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2026-2027">2026-2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Semester</label>
                    <select 
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Semester</option>
                      {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(s => (
                        <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div 
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" accept=".xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <FileUp size={40} className={file ? 'text-indigo-500' : 'text-gray-400'} />
                  <p className="mt-4 text-sm font-semibold text-gray-700">
                    {file ? file.name : 'Click or drag and drop to upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">.xlsx format only</p>
                </div>

                <div className="flex justify-end">
                  <button 
                    disabled={!file || !semester || uploading}
                    onClick={handlePreview}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading && <RefreshCw size={16} className="animate-spin" />}
                    Preview Attendance
                  </button>
                </div>
              </div>
            )}

            {previewData && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-indigo-500">
                    <p className="text-xs font-bold text-gray-500 uppercase">Rows Matched</p>
                    <p className="text-2xl font-black text-indigo-600">{previewData.matchedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Existing students found</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-amber-500">
                    <p className="text-xs font-bold text-gray-500 uppercase">Rows Missing</p>
                    <p className="text-2xl font-black text-amber-600">{previewData.missingCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Students not in database</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 border-l-4 border-l-red-500">
                    <p className="text-xs font-bold text-gray-500 uppercase">Rows Skipped</p>
                    <p className="text-2xl font-black text-red-600">{previewData.skippedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Invalid data or NR</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="font-bold text-navy text-sm">Preview: First 10 Rows</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Found Total % in column <span className="font-bold">{previewData.totalColLetter}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={uploading}
                        onClick={() => setPreviewData(null)}
                        className="px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={uploading || previewData.matchedCount === 0}
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        {uploading && <RefreshCw size={16} className="animate-spin" />}
                        Confirm Upload
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-white text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="px-6 py-3">Registration No.</th>
                          <th className="px-6 py-3">Student Name</th>
                          <th className="px-6 py-3 text-center">Attended (A)</th>
                          <th className="px-6 py-3 text-center">Total (T)</th>
                          <th className="px-6 py-3 text-center">Percentage (P)</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {previewData.previewRows.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 font-medium text-navy">{row.registrationNo}</td>
                            <td className="px-6 py-3">{row.name}</td>
                            <td className="px-6 py-3 text-center">{row.attended}</td>
                            <td className="px-6 py-3 text-center">{row.total}</td>
                            <td className="px-6 py-3 text-center font-bold text-indigo-600">{row.percentage}%</td>
                            <td className="px-6 py-3">
                              {row.status === 'valid' ? (
                                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-md">Valid</span>
                              ) : (
                                <span className="text-red-600 font-medium text-xs bg-red-50 px-2 py-1 rounded-md" title={row.reason}>Skipped</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
  )
}
