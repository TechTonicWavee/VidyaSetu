'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeanContext } from '@/app/dean/_context/DeanContext';
import { Bot, Send, Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader, Card, Button, Input, Badge } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';

interface Message {
  role: 'agent' | 'user';
  text: string;
}

export default function AgentChat({ compact = true }: { compact?: boolean; showFullPage?: boolean }) {
  const { addMeeting, meetings } = useDeanContext();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: "Hi Dean! I'm your scheduling assistant. Tell me about a meeting you'd like to add, and I'll schedule it for you." },
  ]);

  const quickChips = [
    "Schedule director meeting next week",
    "Add faculty session on Friday",
    "Remind me about budget report",
    "What's on my schedule this week?",
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseAgentInput = (text: string) => {
    const today = new Date('2025-05-10');
    let date = today.toISOString().split('T')[0];
    let time = '2:00 PM';
    let title = 'Meeting';

    if (text.match(/next week|next friday|friday/i)) {
      const nextFriday = new Date(today);
      nextFriday.setDate(nextFriday.getDate() + (5 - today.getDay() + 7) % 7 || 7);
      date = nextFriday.toISOString().split('T')[0];
      time = '10:00 AM';
    } else if (text.match(/tomorrow|next day/i)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }

    if (text.match(/director/i)) title = 'Board Meeting with Director';
    else if (text.match(/phd|thesis/i)) title = 'PhD Thesis Review';
    else if (text.match(/faculty|session/i)) title = 'Faculty Session';
    else if (text.match(/budget|report/i)) title = 'Budget Report Review';
    else if (text.match(/senate|board/i)) title = 'Senate Meeting';
    else title = 'Scheduled Meeting';

    return { title, date, time, location: 'TBD', type: 'Meeting', attendees: 2, notes: text };
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);

    const meeting = parseAgentInput(text);
    addMeeting(meeting);

    const agentResponse = `Got it! I've scheduled "${meeting.title}" for ${meeting.date} at ${meeting.time}. This has been added to your meetings dashboard.`;
    
    // Simulate slight typing delay for realism
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', text: agentResponse }]);
    }, 400);

    setInput('');
  };

  const handleQuickChip = (chip: string) => {
    setInput(chip);
    setTimeout(() => handleSend(chip), 0);
  };

  if (compact) {
    return (
      <Card className="flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-content">AI Scheduling Agent</h3>
            <p className="text-xs text-muted">Always online</p>
          </div>
        </div>

        <div className="flex-1 bg-surface-2 rounded-xl p-3 mb-4 overflow-y-auto space-y-3 border border-line">
          {messages.slice(-3).map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'agent' ? "justify-start" : "justify-end")}>
              <div className={cn(
                "text-[13px] rounded-2xl px-4 py-2.5 max-w-[85%]",
                msg.role === 'agent'
                  ? "bg-surface text-content border border-line rounded-tl-sm shadow-sm"
                  : "bg-brand text-white rounded-tr-sm shadow-md"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickChips.slice(0, 2).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              className="text-[11px] font-medium px-3 py-1.5 bg-brand-soft text-brand rounded-full hover:bg-brand/20 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex gap-2 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell me about a meeting..."
            className="flex-1 pr-12"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            className="absolute right-1 top-1 bottom-1 px-3 shadow-none"
            icon={Send}
          />
        </div>

        <button
          onClick={() => router.push('/dean/agent')}
          className="text-[12px] font-semibold text-brand hover:underline mt-4 text-center w-full"
        >
          Open full agent →
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Scheduling Agent"
        description="Your intelligent assistant for managing your complex schedule."
        icon={<Sparkles size={22} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
        {/* Left: Chat Area */}
        <Card className="lg:col-span-2 flex flex-col p-0 overflow-hidden shadow-sm border-line/60">
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-surface/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn("flex", msg.role === 'agent' ? "justify-start" : "justify-end")}
              >
                {msg.role === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-sm">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed",
                    msg.role === 'agent'
                      ? "bg-surface text-content border border-line shadow-sm rounded-tl-sm"
                      : "bg-brand text-white shadow-md shadow-brand/20 rounded-tr-sm"
                  )}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 sm:p-6 bg-surface border-t border-line">
            <div className="mb-4">
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Quick suggestions</p>
              <div className="flex flex-wrap gap-2">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickChip(chip)}
                    className="text-xs font-semibold px-4 py-2 bg-brand/5 text-brand border border-brand/10 rounded-full hover:bg-brand/10 hover:border-brand/20 transition-all shadow-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 relative group">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe a meeting to schedule..."
                className="flex-1 py-4 pl-4 pr-14 text-sm bg-surface-2 focus:bg-surface border-line/60 transition-colors rounded-xl shadow-inner group-focus-within:shadow-none"
              />
              <Button
                onClick={() => handleSend()}
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg px-4 bg-brand hover:bg-brand-600 shadow-sm transition-all hover:scale-105"
                icon={Send}
              />
            </div>
          </div>
        </Card>

        {/* Right: Live Schedule */}
        <Card className="flex flex-col shadow-sm border-line/60">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-info-soft text-info flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-content leading-tight">Live Schedule</h3>
              <p className="text-xs text-muted">Preview of upcoming events</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {meetings
              .filter(m => m.status !== 'completed')
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 10)
              .map(meeting => (
                <div
                  key={meeting.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-md group",
                    meeting.source === 'agent'
                      ? "bg-success/[0.02] border-success/30 hover:border-success/50"
                      : "bg-surface border-line/60 hover:border-brand-soft"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-sm text-content group-hover:text-brand transition-colors line-clamp-2 pr-2">
                      {meeting.title}
                    </p>
                    {meeting.source === 'agent' && (
                      <Badge tone="green" icon={<CheckCircle2 size={10} />} className="flex-shrink-0">
                        Added
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-muted">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {meeting.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {meeting.time}</span>
                  </div>
                </div>
              ))}
              {meetings.length === 0 && (
                <div className="text-center py-10">
                  <Calendar size={32} className="mx-auto text-muted mb-3 opacity-50" />
                  <p className="text-sm font-semibold text-content-2">No upcoming meetings</p>
                  <p className="text-xs text-muted max-w-[200px] mx-auto mt-1">Ask the agent to schedule one for you.</p>
                </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
}
