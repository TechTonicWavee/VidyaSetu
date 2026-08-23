'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Send, Sparkles, RotateCw, User, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/shared/auth/AuthProvider';
import { PageHeader, Card, Badge } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';
import { apiPost, ApiError } from '@/lib/shared/api/client';

interface ClarificationQuestion {
  requirement: string;
  type: string;
  question: string;
  options: string[];
  allowSkip: boolean;
}

interface ClarificationData {
  requestId: string;
  questions: ClarificationQuestion[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  pdfUrl?: string;
  clarification?: ClarificationData;
  isError?: boolean;
}

const SUGGESTIONS = [
  'Software Engineer Intern JD: https://example.com/jd1',
  'Data Analyst JD: https://example.com/jd2',
];

function ClarificationForm({ data, onSubmit, disabled }: { data: ClarificationData, onSubmit: (answers: Record<string, string>) => void, disabled: boolean }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const isComplete = data.questions.every(q => answers[q.requirement] !== undefined);

  return (
    <div className="mt-3 space-y-4">
      {data.questions.map((q, i) => (
        <div key={i} className="bg-surface border border-line rounded-xl p-3">
          <p className="text-sm font-medium text-content mb-2">{q.question}</p>
          <div className="space-y-1.5">
            {q.options.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm text-content-2 cursor-pointer hover:bg-surface-2 p-1.5 rounded-lg">
                <input 
                  type="radio" 
                  name={q.requirement + i} 
                  value={opt}
                  checked={answers[q.requirement] === opt}
                  onChange={() => setAnswers(prev => ({ ...prev, [q.requirement]: opt }))}
                  disabled={disabled}
                  className="text-brand focus:ring-brand accent-brand"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      {!disabled && (
        <button
          disabled={!isComplete}
          onClick={() => onSubmit(answers)}
          className="px-4 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors w-full"
        >
          Submit Clarifications & Generate Resume
        </button>
      )}
    </div>
  );
}

export default function AIAdvisorPage() {
  const router = useRouter();
  const { student } = useAuth();
  const name = student?.name?.split(' ')[0] ?? 'there';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [demoMode] = useState(process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Hi ${name}! I'm your AI Career Advisor & Resume Builder. Paste a Job Description (JD) below, and I'll generate a tailored resume by matching your profile to the requirements!`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleError = (error: any) => {
    let errorMessage = "An unexpected error occurred while processing your request.";
    if (error instanceof ApiError) {
      if (error.code === 'generation_timeout') {
        errorMessage = "The AI took too long to respond. Please try again with a slightly shorter job description.";
      } else if (error.code === 'rate_limited') {
        errorMessage = error.message || "Too many resume generation requests. Please try again later.";
      } else if (error.code === 'forbidden') {
        errorMessage = error.message || "You do not have permission to perform this action.";
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = error?.message || errorMessage;
    }
    setMessages((m) => [...m, { role: 'assistant', content: errorMessage, isError: true }]);
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content }]);
    setSending(true);

    try {
      const res = await apiPost<any>('/api/advisor/resume', { jdText: content });
      
      if (res.needsClarification) {
        setMessages((m) => [...m, {
          role: 'assistant',
          content: "I found some ambiguities while matching your profile to the job description. Please clarify:",
          clarification: {
            requestId: res.requestId,
            questions: res.clarificationQuestions
          }
        }]);
      } else {
        sessionStorage.setItem('advisorResumeDraft', JSON.stringify({ timestamp: Date.now(), resumeJson: res.resumeJson }));
        setMessages((m) => [...m, {
          role: 'assistant',
          content: "Resume ready — opening in Resume Builder..."
        }]);
        setTimeout(() => {
          router.push('/student/resume?source=advisor');
        }, 1000);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setSending(false);
    }
  };

  const submitClarification = async (requestId: string, answers: Record<string, string>) => {
    setSending(true);
    
    const answerText = Object.entries(answers).map(([req, ans]) => `• ${ans}`).join('\n');
    setMessages((m) => [...m, { role: 'user', content: `Clarifications provided:\n${answerText}` }]);

    try {
      const formattedAnswers = Object.entries(answers).map(([requirement, answer]) => ({
        requirement,
        answer
      }));

      const res = await apiPost<any>(`/api/advisor/resume/${requestId}/clarify`, { answers: formattedAnswers });
      
      sessionStorage.setItem('advisorResumeDraft', JSON.stringify({ timestamp: Date.now(), resumeJson: res.resumeJson }));
      setMessages((m) => [...m, {
        role: 'assistant',
        content: "Resume ready — opening in Resume Builder..."
      }]);
      setTimeout(() => {
        router.push('/student/resume?source=advisor');
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Advisor"
        description="Personalised, data-aware career guidance & resume generation."
        icon={<Bot size={22} />}
        actions={demoMode ? <Badge tone="amber" icon={<Sparkles size={12} />}>Demo mode</Badge> : <Badge tone="green">Live</Badge>}
      />

      {demoMode && (
        <Card className="mb-4 flex items-start gap-3 bg-warning-soft border-warning/20">
          <Sparkles size={16} className="text-warning mt-0.5 flex-shrink-0" />
          <p className="text-sm text-content-2">
            Running in <span className="font-semibold">demo mode</span> with sample responses. 
          </p>
        </Card>
      )}

      <Card padded={false} className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => {
            const isLatestUser = messages.slice(i + 1).some(m => m.role === 'user');
            
            return (
              <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', msg.role === 'user' ? 'bg-content text-surface' : 'bg-brand text-white', msg.isError && 'bg-red-500')}>
                  {msg.role === 'user' ? <User size={15} /> : msg.isError ? <AlertCircle size={15} /> : <Bot size={15} />}
                </div>
                <div className={cn('rounded-2xl px-4 py-3 max-w-xl text-sm whitespace-pre-wrap', msg.role === 'user' ? 'bg-brand text-brand-fg rounded-tr-sm' : 'bg-surface-2 text-content-2 rounded-tl-sm', msg.isError && 'bg-red-50 text-red-700 border border-red-200')}>
                  {msg.content}
                  
                  {msg.clarification && (
                    <ClarificationForm 
                      data={msg.clarification} 
                      disabled={isLatestUser || sending}
                      onSubmit={(answers) => submitClarification(msg.clarification!.requestId, answers)} 
                    />
                  )}

                  {msg.pdfUrl && (
                    <div className="mt-3 flex items-center gap-2">
                      <a href={msg.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-surface border border-line rounded-xl text-sm font-medium text-brand hover:bg-surface-2 transition-colors">
                        <FileText size={16} />
                        View Generated Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center"><Bot size={15} /></div>
              <div className="bg-surface-2 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.2s' }} />
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
            placeholder="Paste a Job Description here..."
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
