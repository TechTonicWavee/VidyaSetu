'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  GitBranch, Link, CheckCircle2, ChevronRight, ChevronLeft,
  Upload, FileText, Trash2, Plus, X, Award, Briefcase,
  Users, Loader2, PartyPopper, AlertCircle, Tag
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Platforms' },
  { id: 2, label: 'Resume' },
  { id: 3, label: 'Certifications' },
  { id: 4, label: 'Activities' },
]

const CERT_PLATFORMS = [
  'Coursera', 'NPTEL', 'Udemy', 'AWS',
  'Google', 'Microsoft', 'LinkedIn Learning', 'Other',
]

const ACADEMIC_YEARS = ['2022-23', '2023-24', '2024-25', '2025-26']

const PLATFORM_FIELDS = [
  { key: 'github',    label: 'GitHub',       placeholder: 'e.g. john-doe',         required: true,  icon: <GitBranch size={18} /> },
  { key: 'leetcode',  label: 'LeetCode',     placeholder: 'e.g. john_doe',          required: false, icon: '🧩' },
  { key: 'codechef',  label: 'CodeChef',     placeholder: 'e.g. johndoe123',        required: false, icon: '👨‍🍳' },
  { key: 'hackerrank',label: 'HackerRank',   placeholder: 'e.g. john_doe',          required: false, icon: '💻' },
  { key: 'codeforces',label: 'Codeforces',   placeholder: 'e.g. john.doe',          required: false, icon: '⚡' },
  { key: 'gfg',       label: 'GeeksForGeeks',placeholder: 'e.g. johndoe',           required: false, icon: '🌐' },
  { key: 'linkedin',  label: 'LinkedIn URL', placeholder: 'e.g. linkedin.com/in/johndoe', required: false, icon: <Link size={18} /> },
]

// ─── Helper: empty data shapes ────────────────────────────────────────────────

const emptyCert    = () => ({ name: '', platform: 'Coursera', date: '', skills: [] })
const emptyExtra   = () => ({ society: '', role: '', year: '2024-25', achievement: '' })
const emptyIntern  = () => ({ company: '', role: '', startDate: '', endDate: '', techStack: [], description: '' })

const defaultFormData = () => ({
  coding_profiles: { github: '', leetcode: '', codechef: '', hackerrank: '', codeforces: '', gfg: '', linkedin: '' },
  resume_filename: null,
  certifications: [emptyCert()],
  extracurriculars: [emptyExtra()],
  internships: [emptyIntern()],
})

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ currentStep, completedSteps, onStepClick }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent   = currentStep === step.id
          const isClickable = isCompleted

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border-2
                    ${isCompleted
                      ? 'bg-green-500 border-green-500 text-white cursor-pointer hover:bg-green-600'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white cursor-default'
                      : 'bg-white border-gray-200 text-gray-400 cursor-default'
                    }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : step.id}
                </button>
                <span className={`text-xs mt-1 font-medium ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-2 mb-4">
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [inputVal, setInputVal] = useState('')

  const handleKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault()
      const val = inputVal.trim().replace(/,$/, '')
      if (val && !tags.includes(val)) onAdd(val)
      setInputVal('')
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 bg-white min-h-[48px] flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <span key={tag} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => onRemove(tag)} className="hover:text-blue-900">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : 'Add more...'}
        className="outline-none flex-1 min-w-[120px] text-sm text-gray-700 bg-transparent"
      />
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ data, onChange, onNext, errors }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#0D1B2A' }}>Your Coding Profiles</h2>
      <p className="text-gray-500 text-sm mb-6">We fetch your stats automatically using these usernames</p>

      <div className="space-y-4">
        {PLATFORM_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <span className="text-gray-500">{field.icon}</span>
              {field.label}
              {!field.required && (
                <span className="ml-1 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Optional</span>
              )}
              {field.required && (
                <span className="ml-1 text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Required</span>
              )}
            </label>
            <input
              type="text"
              value={data.coding_profiles[field.key]}
              onChange={(e) => onChange('coding_profiles', { ...data.coding_profiles, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all
                ${errors?.github && field.key === 'github' ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            />
            {errors?.github && field.key === 'github' && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> GitHub username is required to continue
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ data, onChange, onNext, onPrev, onSkip }) {
  const inputRef = useRef()
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Please upload a PDF file only.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('File size must be under 5MB.'); return }
    onChange('resume_filename', file.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#0D1B2A' }}>Upload Your Resume</h2>
      <p className="text-gray-500 text-sm mb-6">PDF format only, max 5MB</p>

      {!data.resume_filename ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all text-center
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
        >
          <Upload size={36} className={`mb-3 ${dragOver ? 'text-blue-500' : 'text-gray-300'}`} />
          <p className="text-gray-600 font-medium mb-1">Drag and drop your resume here</p>
          <p className="text-gray-400 text-sm mb-3">or click to browse</p>
          <p className="text-gray-300 text-xs">PDF only · Max 5MB</p>
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="border border-green-200 rounded-2xl p-6 bg-green-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{data.resume_filename}</p>
              <p className="text-green-600 text-xs flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} /> Resume ready to upload
              </p>
            </div>
          </div>
          <button
            onClick={() => onChange('resume_filename', null)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {data.resume_filename && (
        <p className="text-gray-400 text-xs text-center mt-3">Resume will be uploaded on submit</p>
      )}

      <div className="flex items-center justify-between mt-8">
        <button onClick={onPrev} className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl px-5 py-3 font-semibold text-sm transition-colors">
          <ChevronLeft size={18} /> Previous
        </button>
        <div className="flex items-center gap-4">
          <button onClick={onSkip} className="text-gray-400 text-sm underline hover:text-gray-600 transition-colors">
            Skip for now →
          </button>
          <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ data, onChange, onNext, onPrev, onSkip }) {
  const updateCert = (idx, field, value) => {
    const updated = data.certifications.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    onChange('certifications', updated)
  }

  const addSkill = (idx, skill) => {
    const cert = data.certifications[idx]
    if (!cert.skills.includes(skill)) updateCert(idx, 'skills', [...cert.skills, skill])
  }

  const removeSkill = (idx, skill) => {
    updateCert(idx, 'skills', data.certifications[idx].skills.filter(s => s !== skill))
  }

  const addCert = () => onChange('certifications', [...data.certifications, emptyCert()])

  const removeCert = (idx) => {
    if (data.certifications.length === 1) return
    onChange('certifications', data.certifications.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1" style={{ color: '#0D1B2A' }}>Certifications & Courses</h2>
      <p className="text-gray-500 text-sm mb-6">Add any courses or certifications you have completed</p>

      <div className="space-y-4">
        {data.certifications.map((cert, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Certification {idx + 1} of {data.certifications.length}
              </span>
              {data.certifications.length > 1 && (
                <button onClick={() => removeCert(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Certificate Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCert(idx, 'name', e.target.value)}
                  placeholder="e.g. Machine Learning Specialization"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Platform</label>
                  <select
                    value={cert.platform}
                    onChange={(e) => updateCert(idx, 'platform', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                  >
                    {CERT_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Completion Date</label>
                  <input
                    type="date"
                    value={cert.date}
                    onChange={(e) => updateCert(idx, 'date', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Tag size={14} /> Skills Covered
                  <span className="text-gray-400 font-normal text-xs">(press Enter to add)</span>
                </label>
                <TagInput
                  tags={cert.skills}
                  onAdd={(s) => addSkill(idx, s)}
                  onRemove={(s) => removeSkill(idx, s)}
                  placeholder="e.g. Python, ML, Neural Networks"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCert}
        className="mt-4 w-full border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl py-3 text-sm text-gray-400 hover:text-blue-500 font-medium flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={16} /> Add Another Certification
      </button>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onPrev} className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl px-5 py-3 font-semibold text-sm transition-colors">
          <ChevronLeft size={18} /> Previous
        </button>
        <div className="flex items-center gap-4">
          <button onClick={onSkip} className="text-gray-400 text-sm underline hover:text-gray-600 transition-colors">
            Skip for now →
          </button>
          <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({ data, onChange, onPrev, onSubmit, submitting }) {
  const updateExtra = (idx, field, value) => {
    const updated = data.extracurriculars.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    onChange('extracurriculars', updated)
  }

  const updateIntern = (idx, field, value) => {
    const updated = data.internships.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    onChange('internships', updated)
  }

  const addTechStack = (idx, tag) => {
    const intern = data.internships[idx]
    if (!intern.techStack.includes(tag)) updateIntern(idx, 'techStack', [...intern.techStack, tag])
  }

  const removeTechStack = (idx, tag) => {
    updateIntern(idx, 'techStack', data.internships[idx].techStack.filter(t => t !== tag))
  }

  return (
    <div>
      {/* Extracurriculars */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold" style={{ color: '#0D1B2A' }}>Extracurricular Activities</h2>
        </div>
        <p className="text-gray-500 text-sm mb-5 ml-7">Clubs, societies, committees you're part of</p>

        <div className="space-y-4">
          {data.extracurriculars.map((ex, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Activity {idx + 1}</span>
                {data.extracurriculars.length > 1 && (
                  <button onClick={() => onChange('extracurriculars', data.extracurriculars.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Society / Club Name</label>
                  <input type="text" value={ex.society} onChange={(e) => updateExtra(idx, 'society', e.target.value)} placeholder="e.g. Coding Club" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Role</label>
                  <input type="text" value={ex.role} onChange={(e) => updateExtra(idx, 'role', e.target.value)} placeholder="e.g. Secretary" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Academic Year</label>
                  <select value={ex.year} onChange={(e) => updateExtra(idx, 'year', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all">
                    {ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Key Achievement</label>
                  <input type="text" value={ex.achievement} onChange={(e) => updateExtra(idx, 'achievement', e.target.value)} placeholder="e.g. Won inter-college hackathon" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onChange('extracurriculars', [...data.extracurriculars, emptyExtra()])} className="mt-3 w-full border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl py-3 text-sm text-gray-400 hover:text-blue-500 font-medium flex items-center justify-center gap-2 transition-all">
          <Plus size={15} /> Add Activity
        </button>
      </div>

      {/* Internships */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold" style={{ color: '#0D1B2A' }}>Internships</h2>
        </div>
        <p className="text-gray-500 text-sm mb-5 ml-7">Professional work experience</p>

        <div className="space-y-4">
          {data.internships.map((intern, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Internship {idx + 1}</span>
                {data.internships.length > 1 && (
                  <button onClick={() => onChange('internships', data.internships.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Company Name</label>
                  <input type="text" value={intern.company} onChange={(e) => updateIntern(idx, 'company', e.target.value)} placeholder="e.g. Google" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Your Role</label>
                  <input type="text" value={intern.role} onChange={(e) => updateIntern(idx, 'role', e.target.value)} placeholder="e.g. SWE Intern" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Start Date</label>
                  <input type="date" value={intern.startDate} onChange={(e) => updateIntern(idx, 'startDate', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">End Date</label>
                  <input type="date" value={intern.endDate} onChange={(e) => updateIntern(idx, 'endDate', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all" />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1.5">
                  <Tag size={12} /> Tech Stack <span className="text-gray-400 font-normal">(press Enter to add)</span>
                </label>
                <TagInput
                  tags={intern.techStack}
                  onAdd={(t) => addTechStack(idx, t)}
                  onRemove={(t) => removeTechStack(idx, t)}
                  placeholder="e.g. React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Brief Description <span className="text-gray-400">(max 150 chars)</span></label>
                <textarea
                  value={intern.description}
                  onChange={(e) => updateIntern(idx, 'description', e.target.value.slice(0, 150))}
                  rows={2}
                  placeholder="Brief description of your work..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
                />
                <p className="text-right text-xs text-gray-400">{intern.description.length}/150</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onChange('internships', [...data.internships, emptyIntern()])} className="mt-3 w-full border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl py-3 text-sm text-gray-400 hover:text-blue-500 font-medium flex items-center justify-center gap-2 transition-all">
          <Plus size={15} /> Add Internship
        </button>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onPrev} className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl px-5 py-3 font-semibold text-sm transition-colors">
          <ChevronLeft size={18} /> Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors"
        >
          {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <>Submit Form <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  )
}

// ─── Celebration Screen ───────────────────────────────────────────────────────

function CelebrationScreen({ name }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12">
      <style>{`
        @keyframes pop-in {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .checkmark-animate { animation: pop-in 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
        .fade-up-1 { animation: fade-up 0.5s ease 0.5s both; }
        .fade-up-2 { animation: fade-up 0.5s ease 0.7s both; }
        .fade-up-3 { animation: fade-up 0.5s ease 0.9s both; }
        .fade-up-4 { animation: fade-up 0.5s ease 1.1s both; }
      `}</style>

      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 checkmark-animate">
        <CheckCircle2 size={52} className="text-green-500" />
      </div>

      <div className="fade-up-1">
        <PartyPopper size={28} className="text-yellow-400 mx-auto mb-3" />
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Profile Submitted Successfully!</h1>
      </div>

      <p className="text-gray-600 text-base mt-2 fade-up-2">
        Hi <span className="font-semibold">{name}</span>, your profile has been received.
      </p>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 max-w-md fade-up-3">
        <p className="text-blue-700 text-sm leading-relaxed">
          Your SPI score will be calculated and will appear on your <strong>VidyaSetu dashboard</strong> once the platform launches.
        </p>
      </div>

      <p className="text-gray-400 text-sm mt-6 fade-up-4 flex items-center gap-1.5">
        <AlertCircle size={14} /> You can no longer edit this form.
      </p>
    </div>
  )
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-gray-700 font-medium">Saving your profile...</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FormPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState(defaultFormData())
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ── Auth check + restore saved progress ───────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('vs_session')
    if (!raw) { router.push('/form/login'); return }
    try {
      const parsed = JSON.parse(raw)
      const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000
      if (isExpired) { localStorage.removeItem('vs_session'); router.push('/form/login'); return }
      setStudent(parsed)
    } catch {
      router.push('/form/login')
    }

    // Restore saved progress
    const saved = localStorage.getItem('vs_form_progress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        if (progress.formData) setFormData(progress.formData)
        if (progress.step)     setStep(progress.step)
        if (progress.completedSteps) setCompletedSteps(progress.completedSteps)
      } catch { /* ignore */ }
    }
  }, [])

  // ── Auto-save to localStorage ─────────────────────────────────────────────
  const saveProgress = (newStep, newCompleted, newData) => {
    localStorage.setItem('vs_form_progress', JSON.stringify({
      step: newStep,
      completedSteps: newCompleted,
      formData: newData,
    }))
  }

  const updateField = (key, value) => {
    const updated = { ...formData, [key]: value }
    setFormData(updated)
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = () => {
    if (step === 1) {
      if (!formData.coding_profiles.github.trim()) {
        setErrors({ github: true })
        return
      }
      setErrors({})
    }

    const newCompleted = completedSteps.includes(step)
      ? completedSteps
      : [...completedSteps, step]

    const newStep = step + 1
    setCompletedSteps(newCompleted)
    setStep(newStep)
    saveProgress(newStep, newCompleted, formData)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    const newStep = step - 1
    setStep(newStep)
    saveProgress(newStep, completedSteps, formData)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goSkip = () => {
    const newCompleted = completedSteps.includes(step)
      ? completedSteps
      : [...completedSteps, step]
    const newStep = step + 1
    setCompletedSteps(newCompleted)
    setStep(newStep)
    saveProgress(newStep, newCompleted, formData)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepClick = (targetStep) => {
    if (completedSteps.includes(targetStep)) {
      setStep(targetStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      universityId: student?.universityId,
      coding_profiles: formData.coding_profiles,
      resume_filename: formData.resume_filename,
      certifications: formData.certifications,
      extracurriculars: formData.extracurriculars,
      internships: formData.internships,
    }
    try {
      const res = await fetch('/api/form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        localStorage.removeItem('vs_form_progress')
        setSubmitted(true)
      } else {
        alert('Submission failed: ' + (json.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Network error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!student) return null

  return (
    <div className="min-h-screen bg-white">
      {submitting && <LoadingOverlay />}

      {/* Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-[680px] mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: '#1A56DB' }}
          >
            VS
          </div>
          <div>
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-semibold" style={{ color: '#0D1B2A' }}>{student.name}</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {student.universityId}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[680px] mx-auto px-4 py-8">
        {submitted ? (
          <CelebrationScreen name={student.name} />
        ) : (
          <>
            <ProgressBar
              currentStep={step}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              {step === 1 && (
                <Step1
                  data={formData}
                  onChange={updateField}
                  onNext={goNext}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <Step2
                  data={formData}
                  onChange={updateField}
                  onNext={goNext}
                  onPrev={goPrev}
                  onSkip={goSkip}
                />
              )}
              {step === 3 && (
                <Step3
                  data={formData}
                  onChange={updateField}
                  onNext={goNext}
                  onPrev={goPrev}
                  onSkip={goSkip}
                />
              )}
              {step === 4 && (
                <Step4
                  data={formData}
                  onChange={updateField}
                  onPrev={goPrev}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Your progress is saved automatically
            </p>
          </>
        )}
      </div>
    </div>
  )
}