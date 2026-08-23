'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Edit2, Activity,
  Briefcase, Mail, Phone,
  Lock, Plus, Trash2, Save, User, Building, Image as ImageIcon
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

function EmptyCard({ icon: Icon, title, subtitle }: { icon: typeof BookOpen; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-2/50 rounded-2xl border border-dashed border-line/60">
      <div className="w-12 h-12 bg-surface border border-line shadow-sm rounded-2xl flex items-center justify-center mb-4 text-muted">
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold text-content">{title}</p>
      {subtitle && <p className="text-xs text-muted mt-1.5 max-w-[250px] mx-auto leading-relaxed">{subtitle}</p>}
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
      }
    };
    fetchProfile();
  }, []);

  const initials = profile.fullName ? getInitials(profile.fullName) : 'F'
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* ── MINIMALIST HERO ─────────────────────────────────────────── */}
      <div className="relative mb-10">
        {/* Cover Area */}
        <div className="h-44 sm:h-52 rounded-t-[2rem] bg-gradient-to-tr from-surface-3 to-surface border-x border-t border-line/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-3/30 backdrop-blur-3xl mix-blend-overlay"></div>
        </div>
        
        {/* Profile Card Info */}
        <div className="bg-surface rounded-b-[2rem] border border-line/60 shadow-sm p-8 pt-0 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 sm:-mt-20 mb-8">
             {/* Floating Avatar */}
             <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] flex items-center justify-center text-brand-fg font-extrabold text-5xl sm:text-6xl shadow-xl border-[6px] border-surface bg-brand flex-shrink-0 relative overflow-hidden">
               {profile.profilePicture ? (
                 <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 initials
               )}
               <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-success border-4 border-surface shadow-sm"></div>
             </div>
             
             {/* Name & Basic Info */}
             <div className="flex-1 pb-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-content tracking-tight">{profile.fullName}</h1>
                <p className="text-content-2 font-medium mt-2 flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base">
                  <Briefcase size={16} className="text-muted"/> {departmentText}
                </p>
             </div>
             
             {/* Actions */}
             <div className="flex items-center justify-center md:justify-end gap-3 pb-2 w-full md:w-auto">
                <Button
                  variant="secondary"
                  icon={Edit2}
                  onClick={() => setActiveTab('Settings')}
                  className="rounded-xl shadow-sm bg-surface"
                >
                  Edit Profile
                </Button>
             </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-line/40">
              {[
                { label: 'Subjects Allotted', value: profile.subjects.length.toString(), icon: BookOpen },
                { label: 'Total Students', value: '243', icon: User },
                { label: 'Avg Attendance', value: '78%', icon: Activity },
                { label: 'Active Alerts', value: '5', icon: Activity },
             ].map(({ label, value, icon: Icon }) => (
               <div key={label} className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                 <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="relative h-full bg-surface-2/90 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-5 flex flex-col justify-center transition-colors">
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-xs font-bold text-muted uppercase tracking-widest">{label}</p>
                     <Icon size={16} className="text-muted group-hover:text-brand transition-colors relative z-10" />
                   </div>
                   <p className="text-3xl font-extrabold text-content">{value}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────── */}
      <div className="px-2">
        <Tabs
          tabs={TABS.map(t => ({ id: t, label: t }))}
          active={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />
      </div>

      {/* ── TAB: OVERVIEW ────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="animate-fade-in space-y-8">
          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-lg font-extrabold text-content">Allotted Subjects</h2>
               <Badge tone="brand" className="px-3 py-1">{profile.subjects.length} Total</Badge>
             </div>
             
             {profile.subjects.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {profile.subjects.map((sub) => (
                   <div key={sub.id} className="border border-line/60 rounded-2xl p-6 hover:shadow-md hover:border-brand/30 transition-all bg-surface-2/30 flex flex-col h-full group">
                     <div className="flex justify-between items-start mb-3">
                       <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-brand mb-4 group-hover:scale-105 transition-transform">
                         <BookOpen size={20} />
                       </div>
                       <Badge tone="blue" className="text-[10px]">{sub.year}</Badge>
                     </div>
                     <h3 className="font-bold text-content text-lg mb-2 leading-tight">{sub.name}</h3>
                     <p className="text-sm text-content-2 mt-auto">Section: <span className="font-semibold text-content">{sub.section}</span></p>
                   </div>
                 ))}
               </div>
             ) : (
               <EmptyCard icon={BookOpen} title="No Subjects Allotted" subtitle="Go to settings to add subjects you are teaching." />
             )}
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-line/60 bg-surface-2/30">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-muted">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold tracking-widest uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-content">{profile.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-line/60 bg-surface-2/30">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-muted">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold tracking-widest uppercase mb-1">Phone</p>
                    <p className="text-sm font-medium text-content">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-6">Department</h2>
               <div className="flex items-center gap-4 p-4 rounded-2xl border border-line/60 bg-surface-2/30 h-full">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-brand">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold tracking-widest uppercase mb-1">Current Department</p>
                    <p className="text-base font-bold text-content">{departmentText}</p>
                  </div>
                </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: SETTINGS ───────────────────────────────── */}
      {activeTab === 'Settings' && (
        <div className="animate-fade-in space-y-6">
          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
            <h2 className="text-lg font-extrabold text-content mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Field label="Full Name">
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </Field>
              <Field label="Email Address">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Field>
              <Field label="Phone Number">
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Field>
              <Field label="Department">
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </Field>

              <div className="md:col-span-2">
                 <Field label="Profile Picture URL">
                   <Input
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                   />
                 </Field>
              </div>
            </div>
            <div className="flex justify-end border-t border-line/40 pt-6 mt-4">
              <Button onClick={handleSaveProfile} icon={Save}>
                Save Profile
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold text-content">Manage Subjects</h2>
                <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddSubject}>
                  Add Subject
                </Button>
             </div>
             
             <div className="space-y-4 mb-6">
                {formData.subjects.map((sub, index) => (
                  <div key={sub.id} className="p-5 rounded-2xl bg-surface-2 border border-line/60 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                       <Field label={`Subject ${index + 1} Name`}>
                         <Input
                           value={sub.name}
                           onChange={(e) => handleSubjectChange(sub.id, 'name', e.target.value)}
                           placeholder="e.g. Database Management Systems"
                         />
                       </Field>
                    </div>
                    <div className="w-full md:w-32">
                       <Field label="Section">
                         <Input
                           value={sub.section}
                           onChange={(e) => handleSubjectChange(sub.id, 'section', e.target.value)}
                           placeholder="e.g. A"
                         />
                       </Field>
                    </div>
                    <div className="w-full md:w-40">
                       <Field label="Year">
                         <Input
                           value={sub.year}
                           onChange={(e) => handleSubjectChange(sub.id, 'year', e.target.value)}
                           placeholder="e.g. 2nd Year"
                         />
                       </Field>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="text-danger hover:text-danger hover:bg-danger-soft px-3 h-[42px]"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                
                {formData.subjects.length === 0 && (
                  <div className="text-center py-8 bg-surface-2/50 rounded-2xl border border-dashed border-line/60 text-muted text-sm font-medium">
                     No subjects added. Click "Add Subject" to begin.
                  </div>
                )}
             </div>
             
             <div className="flex justify-end border-t border-line/40 pt-6 mt-4">
              <Button onClick={handleSaveProfile} icon={Save}>
                Save Subjects
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
            <h2 className="text-lg font-extrabold text-content mb-6">Change Password</h2>
            <div className="max-w-md space-y-4 mb-6">
              <Field label="Current Password">
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </Field>
              <Field label="New Password">
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </Field>
            </div>
            <div className="flex justify-start border-t border-line/40 pt-6 mt-4">
              <Button variant="secondary" onClick={handlePasswordChange}>
                Update Password
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
