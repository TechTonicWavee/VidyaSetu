'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, RefreshCw, FileUp, CheckCircle2, AlertTriangle, Download } from 'lucide-react'
import { apiFetch, apiGet } from '@/lib/shared/api/client'
import { Input, Field, Button } from '@/components/shared/ui'

export default function FacultyMarksPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [subjectCode, setSubjectCode] = useState('')
  const [examType, setExamType] = useState('CA1')
  const [maxMarks, setMaxMarks] = useState('100')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Fetch taught subjects for dynamic dropdown
    apiGet<any>('/api/faculty/profile')
      .then(data => {
        if (data.subjects && data.subjects.length > 0) {
          setSubjects(data.subjects)
          setSubjectCode(data.subjects[0].code)
        }
      })
      .catch(err => console.error('Failed to load subjects', err))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError('')
      setSuccess('')
    }
  }

  const handleDownloadTemplate = async () => {
    if (!subjectCode) {
      setError('Please select a subject code first.')
      return
    }
    setDownloading(true)
    setError('')
    try {
      const res = await fetch(`/api/faculty/marks/template?subjectCode=${subjectCode}&examType=${examType}&maxMarks=${maxMarks}`)
      if (!res.ok) throw new Error('Failed to generate template')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${subjectCode}_${examType}_Marks_Template.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to download template.')
    } finally {
      setDownloading(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    if (!subjectCode || !examType || !maxMarks) {
      setError('Please provide Subject Code, Exam Type, and Max Marks before uploading.')
      return
    }

    setUploading(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subjectCode', subjectCode)
      formData.append('examType', examType)
      formData.append('maxMarks', maxMarks)
      
      await apiFetch<any>('/api/faculty/marks/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'x-faculty-id': 'FAC001', // Bypass auth for demo
        }
      })
      
      setSuccess(`Marks uploaded successfully.`)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.message || 'Failed to upload marks.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Marks Management</h1>
        <p className="text-gray-500 text-sm mt-1">Upload the Excel sheet to map marks according to Roll Number.</p>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Subject Code">
             {subjects.length > 0 ? (
               <select 
                 value={subjectCode}
                 onChange={(e) => setSubjectCode(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
               >
                 {subjects.map(sub => (
                   <option key={sub.id} value={sub.code}>{sub.code} ({sub.name})</option>
                 ))}
               </select>
             ) : (
               <Input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="CS501" />
             )}
          </Field>
          <Field label="Exam Type">
             <select 
               value={examType}
               onChange={(e) => setExamType(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
             >
               <option value="CA1">CA1</option>
               <option value="CA2">CA2</option>
               <option value="MSE 1">MSE 1</option>
               <option value="MSE 2">MSE 2</option>
               <option value="ESE">ESE</option>
             </select>
          </Field>
          <Field label="Max Marks">
             <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} placeholder="100" />
          </Field>
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
          <p className="text-xs text-gray-500 mt-1">.xlsx format only (Columns: Roll Number, Name, Subject Code, Exam Type, Max Marks, Obtained Marks)</p>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className="text-brand text-sm font-medium hover:underline flex items-center gap-2"
          >
            {downloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            Download Excel Template
          </button>
          <button 
            disabled={!file || !subjectCode || !examType || uploading}
            onClick={handleUpload}
            className="px-6 py-2.5 bg-brand text-white font-bold text-sm rounded-lg hover:bg-brand/90 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {uploading && <RefreshCw size={16} className="animate-spin" />}
            Upload Marks
          </button>
        </div>
      </div>
    </div>
  )
}
