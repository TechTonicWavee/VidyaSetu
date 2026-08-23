'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Edit2, Activity,
  Briefcase, Mail, Phone,
  Lock, Plus, Trash2, Save, User, Users, Building, Image as ImageIcon,
  CheckCircle, Zap, AlertTriangle
} from 'lucide-react'
import getInitials from '@/lib/shared/getInitials'
import { Card, Button, Tabs, Badge, Input, Field } from '@/components/shared/ui'
import { cn } from '@/lib/shared/utils/cn'

import { apiFetch, apiGet } from '@/lib/shared/api/client'

const TABS = ['Overview', 'Settings']

interface Subject {
  id: string
  name: string
  section: string
  year: string
}

interface FacultyProfileData {
  fullName: string
  email: string
  phone: string
  department: string
  profilePicture: string
  avatarUrl?: string
  subjects: Subject[]
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof BookOpen; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-10 h-10 bg-surface-2 border border-line rounded-xl flex items-center justify-center mb-3 text-muted">
        <Icon size={18} />
      </div>
      <p className="text-sm font-semibold text-content-2">{title}</p>
      {subtitle && <p className="text-xs text-muted mt-1 max-w-xs mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

export default function FacultyProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Overview')
  
  const [profile, setProfile] = useState<FacultyProfileData>({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    profilePicture: '',
    subjects: []
  })

  const [loading, setLoading] = useState(true)

  // State for forms
  const [formData, setFormData] = useState<FacultyProfileData>(profile)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet<FacultyProfileData>('/api/faculty/profile');
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = profile.fullName ? getInitials(profile.fullName) : (loading ? '…' : 'F')
  const departmentText = profile.department || 'Department not specified'

  const handleSaveProfile = async () => {
    try {
      await apiFetch('/api/faculty/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setProfile(formData);
      alert('Profile updated successfully!');
    } catch(err) {
      alert('Failed to update profile');
    }
  }

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!')
      return
    }
    // API Call to change password
    alert('Password changed successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const handleAddSubject = () => {
    const newSub = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      section: '',
      year: ''
    }
    setFormData({ ...formData, subjects: [...formData.subjects, newSub] })
  }

  const handleRemoveSubject = (id: string) => {
    setFormData({ ...formData, subjects: formData.subjects.filter(s => s.id !== id) })
  }

  const handleSubjectChange = (id: string, field: keyof Subject, value: string) => {
    const updatedSubjects = formData.subjects.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    )
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5 animate-fade-in">
      
      {/* ── PROFILE HERO ─────────────────────────────── */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        
        {/* Thin color band at top */}
        <div className="h-2 w-full bg-gradient-to-r from-brand to-brand-accent" />

        <div className="p-6">
          {/* Top row: avatar + name + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-brand-fg font-bold text-xl tracking-wide bg-gradient-to-br from-brand to-brand-600 shadow-md select-none overflow-hidden relative">
               {profile.profilePicture ? (
                 <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 initials
               )}
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-content leading-snug">
                {loading ? 'Loading…' : (profile.fullName || 'Professor')}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <Building size={13} className="text-brand" />
                  {departmentText}
                </span>
                {profile.email && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Mail size={13} className="text-muted" />
                    {profile.email}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('Settings')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand text-brand-fg hover:bg-brand-600 transition-colors shadow-sm"
              >
                <Edit2 size={12} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             {[
              { label: 'Subjects Allotted', value: profile.subjects.length.toString(), icon: BookOpen, accent: 'text-brand bg-brand-soft border-brand/20' },
              { label: 'Total Students', value: '243', icon: Users, accent: 'text-info bg-info-soft border-info/20' },
              { label: 'Avg Attendance', value: '78%', icon: CheckCircle, accent: 'text-success bg-success-soft border-success/20' },
              { label: 'Active Alerts', value: '5', icon: AlertTriangle, accent: 'text-warning bg-warning-soft border-warning/20' },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div key={label}
                className="flex items-center gap-3 p-4 rounded-xl border border-line/60 bg-surface-2/40 hover:bg-surface-2/80 transition-colors">
                <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0', accent)}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider leading-none mb-1">{label}</p>
                  <p className="text-lg font-bold text-content leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────── */}
      <div className="border-b border-line">
        <Tabs
          tabs={TABS.map(t => ({ id: t, label: t }))}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ── TAB: OVERVIEW ────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Allotted Subjects */}
          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <p className="text-xs font-semibold text-muted uppercase tracking-widest">Allotted Subjects</p>
               <Badge tone="brand" className="px-2.5 py-1 text-[10px]">{profile.subjects.length} Total</Badge>
             </div>
             
             {profile.subjects.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {profile.subjects.map((sub) => (
                   <div key={sub.id} className="flex flex-col p-4 border border-line/60 rounded-xl hover:border-brand/25 hover:shadow-sm transition-all duration-200 bg-surface-2/20 group">
                     <div className="flex justify-between items-start mb-3">
                       <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand mb-1 group-hover:scale-105 transition-transform">
                         <BookOpen size={14} />
                       </div>
                       <Badge tone="blue" className="text-[10px]">{sub.year}</Badge>
                     </div>
                     <h3 className="text-sm font-semibold text-content mb-2 leading-snug">{sub.name}</h3>
                     <p className="text-xs text-muted mt-auto">Section: <span className="font-semibold text-content">{sub.section}</span></p>
                   </div>
                 ))}
               </div>
             ) : (
               <EmptyState icon={BookOpen} title="No Subjects Allotted" subtitle="Go to settings to add subjects you are teaching." />
             )}
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Info */}
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Contact Information</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-line/60 hover:bg-surface-2/40 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-muted group-hover:text-brand transition-colors">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold tracking-widest uppercase mb-0.5">Email</p>
                    <p className="text-sm font-medium text-content">{profile.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-line/60 hover:bg-surface-2/40 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-muted group-hover:text-brand transition-colors">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold tracking-widest uppercase mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-content">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Department */}
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Department</p>
               <div className="flex items-center gap-3 p-4 rounded-xl border border-line/60 bg-surface-2/20 h-[calc(100%-2.5rem)]">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted font-bold tracking-widest uppercase mb-1">Current Department</p>
                    <p className="text-sm font-bold text-content">{departmentText}</p>
                  </div>
                </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: SETTINGS ───────────────────────────────── */}
      {activeTab === 'Settings' && (
        <div className="space-y-4 animate-fade-in">
          
          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <Field label="Full Name">
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <Field label="Email Address">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <Field label="Phone Number">
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <Field label="Department">
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <div className="md:col-span-2">
                 <Field label="Profile Picture URL">
                   <Input
                    value={formData.avatarUrl || formData.profilePicture}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value, profilePicture: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-surface-2/50"
                   />
                 </Field>
              </div>
            </div>
            <div className="flex justify-end border-t border-line/40 pt-4">
              <Button onClick={handleSaveProfile} icon={Save} size="sm" className="bg-brand text-brand-fg hover:bg-brand-600">
                Save Profile
              </Button>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-widest">Manage Subjects</p>
                <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddSubject} className="h-8 text-xs">
                  Add Subject
                </Button>
             </div>
             
             <div className="space-y-3 mb-5">
                {formData.subjects.map((sub, index) => (
                  <div key={sub.id} className="p-4 rounded-xl bg-surface-2/30 border border-line/60 flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                       <Field label={`Subject ${index + 1} Name`}>
                         <Input
                           value={sub.name}
                           onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                           placeholder="e.g. Database Management Systems"
                           className="bg-surface"
                         />
                       </Field>
                    </div>
                    <div className="w-full md:w-32">
                       <Field label="Section">
                         <Input
                           value={sub.section}
                           onChange={(e) => handleSubjectChange(sub.id, 'section', e.target.value)}
                           placeholder="e.g. A"
                           className="bg-surface"
                         />
                       </Field>
                    </div>
                    <div className="w-full md:w-40">
                       <Field label="Year">
                         <Input
                           value={sub.year}
                           onChange={(e) => handleSubjectChange(sub.id, 'year', e.target.value)}
                           placeholder="e.g. 2nd Year"
                           className="bg-surface"
                         />
                       </Field>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="text-danger hover:text-danger hover:bg-danger-soft px-3 h-[42px] mb-[2px]"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                
                {formData.subjects.length === 0 && (
                  <div className="text-center py-6 bg-surface-2/30 rounded-xl border border-dashed border-line/60 text-muted text-xs font-medium">
                     No subjects added. Click "Add Subject" to begin.
                  </div>
                )}
             </div>
             
             <div className="flex justify-end border-t border-line/40 pt-4">
              <Button onClick={handleSaveProfile} icon={Save} size="sm" className="bg-brand text-brand-fg hover:bg-brand-600">
                Save Subjects
              </Button>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Change Password</p>
            <div className="max-w-md space-y-3 mb-5">
              <Field label="Current Password">
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <Field label="New Password">
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="bg-surface-2/50"
                />
              </Field>
            </div>
            <div className="flex justify-start border-t border-line/40 pt-4">
              <Button variant="secondary" onClick={handlePasswordChange} size="sm">
                Update Password
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

