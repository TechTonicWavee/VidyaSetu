'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, RotateCw, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PageHeader, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'How can I improve my SPI?',
  'What should I focus on for placements?',
  'Which career path fits me best?',
  'Suggest a 1-week study plan',
];

// Local, deterministic advisor used when no AI backend (Ollama) is reachable.
function mockAdvice(prompt: string, name: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('spi')) {
    return `Great question, ${name}. Your SPI is driven by five signals — GitHub activity, DSA/LeetCode, resume quality, certifications and internships. The fastest wins are usually:\n\n1. Solve DSA consistently (aim 5/day).\n2. Ship one polished project with a clean README.\n3. Add one recognised certification.\n\nFocus on the dimension where your evidence is thinnest first.`;
  }
  if (p.includes('placement') || p.includes('job') || p.includes('company')) {
    return `For placements, prioritise:\n\n• DSA depth (arrays → DP → graphs)\n• Core CS (OS, DBMS, CN, OOPs)\n• 2 standout projects with quantified impact\n• Mock interviews\n\nYou already clear mass recruiters — closing the DSA and system-design gap opens Tier-2 product companies.`;
  }
  if (p.includes('career') || p.includes('path')) {
    return `Based on your builder-style strengths, Full-Stack Engineering is your strongest match, with ML Engineering as a stretch if you build 2–3 ML projects. Want a week-by-week roadmap for either?`;
  }
  if (p.includes('plan') || p.includes('week') || p.includes('study')) {
    return `Here's a balanced week:\n\n• Mon–Fri: 5 DSA problems + 1 hr project work\n• Wed: 1 system-design concept\n• Sat: mock interview + review\n• Sun: revise CS fundamentals\n\nSmall, daily reps beat weekend cramming.`;
  }
  return `Here's my take, ${name}: keep your effort consistent and evidence-based. Ship projects, practise DSA daily, and document everything on GitHub. Ask me about your SPI, placements, career path, or a study plan for specifics.`;
}

export default function AIAdvisorPage() {
  const { student } = useAuth();
  const name = student?.name?.split(' ')[0] ?? 'there';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Hi ${name}! I'm your AI Career Advisor. I can help with SPI improvement, placement prep, career direction and study plans. What's on your mind?`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content }]);
    setSending(true);

    // Try a real local AI backend (Ollama); fall back to deterministic advice.
    try {
      const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          stream: false,
          messages: [
            { role: 'system', content: `You are a concise, warm career advisor for ${student?.name ?? 'a student'}.` },
            { role: 'user', content },
          ],
        }),
      });
      if (!res.ok) throw new Error('no ai');
      const data = await res.json();
      setDemoMode(false);
      setMessages((m) => [...m, { role: 'assistant', content: data.message?.content ?? mockAdvice(content, name) }]);
    } catch {
      setDemoMode(true);
      await new Promise((r) => setTimeout(r, 500));
      setMessages((m) => [...m, { role: 'assistant', content: mockAdvice(content, name) }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Advisor"
        description="Personalised, data-aware career guidance."
        icon={<Bot size={22} />}
        actions={demoMode ? <Badge tone="amber" icon={<Sparkles size={12} />}>Demo mode</Badge> : <Badge tone="green">Live</Badge>}
      />

      {demoMode && (
        <Card className="mb-4 flex items-start gap-3 bg-warning-soft border-warning/20">
          <Sparkles size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <p className="text-sm text-content-2">
            Running in <span className="font-semibold">demo mode</span> with sample responses. Connect a local AI backend
            (Ollama on <code className="text-xs">localhost:11434</code>) or your API to get fully personalised answers.
          </p>
        </Card>
      )}

      <Card padded={false} className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', msg.role === 'user' ? 'bg-content text-surface' : 'bg-brand text-white')}>
                {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
              </div>
              <div className={cn('rounded-2xl px-4 py-3 max-w-xl text-sm whitespace-pre-wrap', msg.role === 'user' ? 'bg-brand text-brand-fg rounded-tr-sm' : 'bg-surface-2 text-content-2 rounded-tl-sm')}>
                {msg.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center"><Bot size={15} /></div>
              <div className="bg-surface-2 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-2 text-content-2 hover:bg-brand-soft hover:text-brand transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-line p-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask your AI advisor…"
            aria-label="Message"
            className="flex-1 bg-surface-2 border border-line rounded-xl px-4 py-2.5 text-sm text-content placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button
            onClick={() => send()}
            disabled={sending || !input.trim()}
            aria-label="Send message"
            className="p-2.5 rounded-xl bg-brand text-brand-fg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {sending ? <RotateCw size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>
      </Card>
    </div>
  );
}
