'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Bell, Calendar, Send, Search, User, QrCode, CheckCheck, ChevronUp, ChevronDown, Clock, Video, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PageHeader, Card, StatCard, Badge, Button } from '@/components/shared/ui'
import { cn } from '@/lib/shared/utils/cn'

export default function FacultyParentCommunication() {
  const router = useRouter()
  const [messageInput, setMessageInput] = useState('')
  const [meetingsExpanded, setMeetingsExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleTemplateClick = (template: string) => {
    const templates: Record<string, string> = {
      'Attendance Warning': "Dear Parent, I wanted to inform you that your child's attendance has fallen below the required 75% threshold in [Subject]. Please encourage them to attend all remaining classes.",
      'Score Update': "Dear Parent, this is an update regarding your child's recent performance. Their score in [Subject] has [improved/declined] to [Score]. Let's discuss this.",
      'Meeting Request': "Dear Parent, I would like to schedule a brief meeting to discuss your child's academic progress. Please let me know your availability for next week.",
      'Positive Feedback': "Dear Parent, I'm happy to report that your child is doing exceptionally well in [Subject] practicals. Their recent project was outstanding."
    }
    setMessageInput(templates[template] || '')
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    showToast('Message sent')
    setMessageInput('')
  }

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Parent Communication"
          description="Direct messaging with parents, meeting scheduling and automated WhatsApp digest management"
        />
        <Button onClick={() => showToast('New message dialog opened')} icon={MessageSquare} className="shadow-sm">
          New Message
        </Button>
      </div>

      {/* TOP STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Conversations" value="24" hint="Active parent conversations" icon={MessageSquare} tone="blue" />
        <StatCard label="Unread" value="7" hint="Messages awaiting reply" icon={Bell} tone="red" />
        <StatCard label="Meetings This Week" value="3" hint="Scheduled parent meetings" icon={Calendar} tone="brand" />
        <StatCard label="WhatsApp Digests Sent" value="243" hint="This month to all parents" icon={Send} tone="green" />
      </div>

      {/* MAIN COMMUNICATION AREA */}
      <div className="flex flex-col xl:flex-row gap-6 h-[700px]">
        
        {/* LEFT COLUMN: Conversation List */}
        <Card className="w-full xl:w-[32%] flex flex-col overflow-hidden p-0 sm:p-0 shadow-sm border-line/50">
          <div className="p-5 border-b border-line bg-surface-2/30">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search parent or student..." className="w-full pl-10 pr-4 py-2.5 bg-surface border border-line rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-shadow" />
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['All', 'Unread', 'Meetings', 'Alerts'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-colors",
                    activeFilter === filter 
                      ? "bg-brand text-surface shadow-sm" 
                      : "bg-surface-2 text-content-2 hover:bg-surface-3"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-surface">
            {/* Item 1 - Active */}
            <div className="p-5 border-b border-line bg-brand/[0.03] cursor-pointer relative transition-colors hover:bg-brand/[0.05]">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r"></div>
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-content flex items-center gap-2">
                  Mr. Ramesh Singh
                  <div className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(var(--color-brand),0.6)]"></div>
                </h4>
                <span className="text-[11px] text-brand font-bold whitespace-nowrap">2h ago</span>
              </div>
              <p className="text-xs text-muted font-medium mb-2.5 flex items-center gap-1.5">
                <User size={12} /> Mahesh Singh A· 2CS04
              </p>
              <div className="flex justify-between items-end gap-4">
                <p className="text-sm text-content-2 truncate flex-1 font-medium">"Thank you for the update. We will make sure he..."</p>
                <span className="flex items-center justify-center bg-brand text-surface text-[10px] font-black w-5 h-5 rounded-full shrink-0 shadow-sm">2</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-5 border-b border-line hover:bg-surface-2/50 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-content flex items-center gap-2 group-hover:text-brand transition-colors">
                  Mrs. Kavya Sharma
                  <div className="w-2 h-2 rounded-full bg-brand opacity-60"></div>
                </h4>
                <span className="text-[11px] text-muted font-medium whitespace-nowrap">5h ago</span>
              </div>
              <p className="text-xs text-muted font-medium mb-2.5 flex items-center gap-1.5">
                <User size={12} /> Rohit Sharma A· 2CS47
              </p>
              <div className="flex justify-between items-end gap-4">
                <p className="text-sm text-content-2 truncate flex-1 font-medium">"Is there any way to improve his DBMS scores before..."</p>
                <span className="flex items-center justify-center bg-brand/80 text-surface text-[10px] font-black w-5 h-5 rounded-full shrink-0">1</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-5 border-b border-line hover:bg-surface-2/50 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-content group-hover:text-brand transition-colors">Mr. Anil Patel</h4>
                <span className="text-[11px] text-muted font-medium whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-xs text-muted font-medium mb-2.5 flex items-center gap-1.5">
                <User size={12} /> Sneha Patel A· 2CS23
              </p>
              <p className="text-sm text-content-2 truncate">"We have spoken to Sneha. She will attend all..."</p>
            </div>

            {/* Item 4 */}
            <div className="p-5 border-b border-line hover:bg-surface-2/50 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-content group-hover:text-brand transition-colors">Mrs. Deepa Joshi</h4>
                <span className="text-[11px] text-muted font-medium whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-xs text-muted font-medium mb-2.5 flex items-center gap-1.5">
                <User size={12} /> Karan Joshi A· 2CS15
              </p>
              <p className="text-sm text-content-2 truncate">"Understood. We will monitor her attendance closely..."</p>
            </div>
            
            {/* Item 5 */}
            <div className="p-5 border-b border-line hover:bg-surface-2/50 cursor-pointer transition-colors group">
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="font-bold text-content group-hover:text-brand transition-colors">Mr. Sunil Mehta</h4>
                <span className="text-[11px] text-muted font-medium whitespace-nowrap">2d ago</span>
              </div>
              <p className="text-xs text-muted font-medium mb-2.5 flex items-center gap-1.5">
                <User size={12} /> Arjun Mehta A· 2CS09
              </p>
              <div className="flex justify-between items-end gap-4">
                <p className="text-sm text-content-2 truncate flex-1">"Can we schedule a meeting next week to discuss..."</p>
                <Calendar size={16} className="text-brand shrink-0 opacity-70" />
              </div>
            </div>
          </div>
        </Card>

        {/* RIGHT COLUMN: Active Conversation */}
        <Card className="flex-1 flex flex-col p-0 sm:p-0 overflow-hidden shadow-sm border-line/50">
          
          {/* Header */}
          <div className="p-6 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface z-10 relative">
            <div>
              <h2 className="text-2xl font-black text-content tracking-tight mb-1">Mr. Ramesh Singh</h2>
              <p className="text-xs text-muted font-bold tracking-wide uppercase">Parent of Mahesh Singh A· 2CS04 A· CSE 2B</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="w-10 h-10 p-0 hover:bg-surface-2 border-line/50" title="View Student Profile" onClick={() => router.push('/faculty/student/profile')}>
                <User size={18} className="text-content-2" />
              </Button>
              <Button variant="secondary" className="w-10 h-10 p-0 text-brand border-brand/20 hover:bg-brand/[0.05]" title="Generate Visit QR">
                <QrCode size={18} />
              </Button>
              <Button variant="secondary" className="w-10 h-10 p-0 text-brand border-brand/20 hover:bg-brand/[0.05]" title="Schedule Meeting">
                <Calendar size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className="bg-surface-2/50 border-b border-line px-6 py-3 flex justify-between items-center text-sm z-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-bold uppercase tracking-wider">SPI</span>
                <span className="font-black text-content">72</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-line hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Attendance</span>
                <span className="font-black text-amber">79%</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-line hidden lg:block" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Latest Score</span>
                <span className="font-black text-content">71% <span className="text-muted font-medium text-xs">DBMS</span></span>
              </div>
              <div className="w-1 h-1 rounded-full bg-line hidden xl:block" />
              <div className="flex items-center gap-1.5 text-danger font-bold text-xs bg-danger-soft/10 px-2.5 py-1 rounded-full">
                <AlertTriangle size={12}/> 2 Alerts
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-surface-2/20 space-y-6">
            
            <div className="flex justify-center my-2">
              <span className="px-3 py-1 bg-surface border border-line shadow-sm text-muted text-[11px] font-bold uppercase tracking-wider rounded-full">April 13, 2026</span>
            </div>

            {/* Msg 1 - Faculty */}
            <div className="flex flex-col items-end group">
              <div className="max-w-[85%] sm:max-w-[70%] bg-brand text-surface p-4 rounded-2xl rounded-tr-sm shadow-sm">
                <p className="text-[14.5px] leading-relaxed font-medium">
                  Dear Mr. Singh, I wanted to inform you that Mahesh's attendance in Theory of Computation has dropped to 74% — just below the 75% minimum threshold. He needs to attend all remaining classes to maintain eligibility.
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-muted mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>10:34 AM</span>
                <CheckCheck size={14} className="text-brand opacity-80" />
              </div>
            </div>

            {/* Msg 2 - Parent */}
            <div className="flex flex-col items-start group">
              <div className="max-w-[85%] sm:max-w-[70%] bg-surface border border-line/60 text-content p-4 rounded-2xl rounded-tl-sm shadow-sm">
                <p className="text-[14.5px] leading-relaxed">
                  Thank you for letting us know, Prof. Kapoor. We will speak with Mahesh today. Is there anything specific we should ask him to focus on for TOC?
                </p>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>11:02 AM</span>
              </div>
            </div>

            {/* Msg 3 - Faculty */}
            <div className="flex flex-col items-end group">
              <div className="max-w-[85%] sm:max-w-[70%] bg-brand text-surface p-4 rounded-2xl rounded-tr-sm shadow-sm">
                <p className="text-[14.5px] leading-relaxed font-medium">
                  Yes, please encourage him to focus on Regular Expressions and Automata Theory concepts — these are the specific weak areas from his Unit 2 exam. I can share some revision notes if helpful.
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-muted mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>11:15 AM</span>
                <CheckCheck size={14} className="text-brand opacity-80" />
              </div>
            </div>

            <div className="flex justify-center my-6">
              <span className="px-3 py-1 bg-surface border border-line shadow-sm text-muted text-[11px] font-bold uppercase tracking-wider rounded-full">April 15, 2026</span>
            </div>

            {/* Msg 4 - Parent */}
            <div className="flex flex-col items-start group">
              <div className="max-w-[85%] sm:max-w-[70%] bg-surface border border-line/60 text-content p-4 rounded-2xl rounded-tl-sm shadow-sm">
                <p className="text-[14.5px] leading-relaxed">
                  That would be very helpful. Also, Mahesh mentioned his DBMS practical went well — we are glad to hear that at least. Please do share the notes.
                </p>
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>9:45 AM</span>
              </div>
            </div>

            {/* Msg 5 - Parent UNREAD */}
            <div className="flex flex-col items-start relative group">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(var(--color-brand),0.6)]"></div>
              <div className="max-w-[85%] sm:max-w-[70%] bg-surface border border-line/60 text-content p-4 rounded-2xl rounded-tl-sm shadow-md ring-1 ring-brand/10">
                <p className="text-[14.5px] leading-relaxed font-medium">
                  Thank you for the update. We will make sure he attends all remaining classes.
                </p>
              </div>
              <div className="mt-1.5 flex items-center gap-2 ml-1">
                <span className="text-[11px] font-bold text-brand">9:46 AM</span>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-line bg-surface z-10">
            {/* Templates */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1 items-center">
              <span className="text-[10px] text-muted font-bold uppercase tracking-widest mr-1">Templates</span>
              <div className="w-1 h-1 rounded-full bg-line mx-1" />
              {['Attendance Warning', 'Score Update', 'Meeting Request', 'Positive Feedback'].map(t => (
                <button 
                  key={t}
                  onClick={() => handleTemplateClick(t)} 
                  className="px-3 py-1 bg-surface-2 hover:bg-surface-3 text-content text-[11px] font-bold rounded-full whitespace-nowrap transition-colors border border-line/50"
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="relative group">
              <textarea 
                className="w-full border border-line rounded-2xl pl-5 pr-14 py-3.5 text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all min-h-[90px] resize-none bg-surface shadow-sm"
                placeholder="Type your message to Mr. Ramesh Singh..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              ></textarea>
              <button 
                onClick={handleSendMessage}
                className={cn(
                  "absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  messageInput.trim() 
                    ? "bg-brand text-surface shadow-md hover:shadow-lg hover:scale-105 active:scale-95" 
                    : "bg-surface-2 text-muted cursor-not-allowed"
                )}
                disabled={!messageInput.trim()}
              >
                <Send size={18} className={messageInput.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar">
              <Button variant="secondary" onClick={() => showToast('WhatsApp digest dispatched to parent')} className="text-brand border-brand/20 hover:bg-brand/[0.05] text-xs h-9">
                Send via WhatsApp
              </Button>
              <Button variant="secondary" onClick={() => showToast('Summary PDF generated')} className="text-xs h-9">
                Generate PDF
              </Button>
            </div>
          </div>

        </Card>
      </div>

      {/* MEETINGS SECTION */}
      <Card className="overflow-hidden p-0 sm:p-0 shadow-sm border-line/50">
        <button 
          onClick={() => setMeetingsExpanded(!meetingsExpanded)}
          className="w-full p-6 flex justify-between items-center bg-surface hover:bg-surface-2/50 transition-colors text-left border-b border-line"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-black text-content text-lg tracking-tight">Upcoming Parent-Teacher Meetings</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-wider mt-0.5">3 Meetings Scheduled</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted bg-surface shadow-sm">
            {meetingsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {meetingsExpanded && (
          <div className="p-6 bg-surface-2/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Meeting 1 */}
              <Card className="hover:shadow-md transition-shadow bg-surface border-line/60">
                <div className="flex justify-between items-start mb-4">
                  <Badge tone="green" className="shadow-sm">Confirmed</Badge>
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line text-content-2 flex items-center justify-center shadow-sm">
                    <User size={18} />
                  </div>
                </div>
                <h4 className="font-bold text-content text-base mb-1">Mr. Sunil Mehta</h4>
                <p className="text-xs text-muted font-medium mb-5">Parent of Arjun Mehta</p>
                
                <div className="space-y-3 mb-6 p-4 rounded-xl bg-surface-2/50 border border-line/50">
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Calendar size={16} className="text-muted" /> 18 April 2026
                  </div>
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Clock size={16} className="text-muted" /> 3:00 PM
                  </div>
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <User size={16} className="text-muted" /> Faculty Room 204
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Agenda</span>
                  <p className="text-sm text-content-2 font-medium leading-relaxed">Discuss 3 missed assignments and TOC performance</p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 text-xs">Reschedule</Button>
                  <Button variant="secondary" className="flex-1 text-xs text-danger border-danger/20 hover:bg-danger/[0.05]">Cancel</Button>
                </div>
              </Card>

              {/* Meeting 2 */}
              <Card className="hover:shadow-md transition-shadow bg-surface border-line/60">
                <div className="flex justify-between items-start mb-4">
                  <Badge tone="amber" className="shadow-sm">Pending Confirmation</Badge>
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line text-content-2 flex items-center justify-center shadow-sm">
                    <User size={18} />
                  </div>
                </div>
                <h4 className="font-bold text-content text-base mb-1">Mrs. Kavya Sharma</h4>
                <p className="text-xs text-muted font-medium mb-5">Parent of Rohit Sharma</p>
                
                <div className="space-y-3 mb-6 p-4 rounded-xl bg-surface-2/50 border border-line/50">
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Calendar size={16} className="text-muted" /> 19 April 2026
                  </div>
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Clock size={16} className="text-muted" /> 11:00 AM
                  </div>
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <User size={16} className="text-muted" /> Faculty Room 204
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Agenda</span>
                  <p className="text-sm text-content-2 font-medium leading-relaxed">DBMS score decline across 3 consecutive units</p>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 text-xs shadow-sm">Confirm</Button>
                  <Button variant="secondary" className="flex-1 text-xs">Reschedule</Button>
                </div>
              </Card>

              {/* Meeting 3 */}
              <Card className="border-brand/30 shadow-md ring-1 ring-brand/5 relative overflow-hidden bg-surface">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <Badge tone="green" className="shadow-sm">Confirmed</Badge>
                  <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center shadow-sm">
                    <Video size={18} />
                  </div>
                </div>
                <h4 className="font-bold text-content text-base mb-1 relative z-10">Mr. Anil Patel</h4>
                <p className="text-xs text-muted font-medium mb-5 relative z-10">Parent of Sneha Patel</p>
                
                <div className="space-y-3 mb-6 p-4 rounded-xl bg-surface-2/50 border border-line/50 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Calendar size={16} className="text-muted" /> 20 April 2026
                  </div>
                  <div className="flex items-center gap-3 text-sm text-content-2 font-medium">
                    <Clock size={16} className="text-muted" /> 2:30 PM
                  </div>
                  <div className="flex items-center gap-3 text-sm text-info font-bold">
                    <Video size={16} className="text-info" /> Online — Google Meet
                  </div>
                </div>
                
                <div className="mb-6 relative z-10">
                  <span className="text-[10px] font-bold text-danger uppercase tracking-widest block mb-2">Critical Agenda</span>
                  <p className="text-sm text-danger font-medium leading-relaxed bg-danger/[0.05] p-3 rounded-lg border border-danger/10">Critical attendance and multiple risk factors</p>
                </div>
                
                <div className="flex gap-3 relative z-10">
                  <Button className="flex-[2] text-xs bg-brand hover:bg-brand-strong shadow-md" icon={Video}>Join Meet</Button>
                  <Button variant="secondary" className="flex-1 text-xs">Cancel</Button>
                </div>
              </Card>

            </div>
          </div>
        )}
      </Card>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-surface-inverted text-surface px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm animate-fade-in z-50 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-green-400" />
          {toastMessage}
        </div>
      )}

    </div>
  )
}



