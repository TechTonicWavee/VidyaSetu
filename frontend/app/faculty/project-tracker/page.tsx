'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, ExternalLink, CheckCircle2, Circle, Clock, Send, ShieldCheck, ShieldX } from 'lucide-react';
import { PageHeader, Card, Button, Badge } from '@/components/shared/ui';
import { listProjectsForMentor, addRemark, approveProject, type TeamProject } from '@/lib/student/api/projectTracker';
import { ApiError } from '@/lib/shared/api/client';

// The faculty portal has no real login system yet (see lib/faculty/mock-data.ts
// and every other page here), so a mentor identifies themselves by name —
// matched server-side against the mentorName already recorded on a project's
// phases. This page is a genuine exception to the rest of the faculty
// portal: it's real and DB-backed, not mock data.
export default function FacultyProjectTrackerPage() {
  const [mentorName, setMentorName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [projects, setProjects] = useState<(TeamProject & { team: { id: string; name: string; domain: string | null } })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load(name: string) {
    setLoading(true);
    setError('');
    try {
      const result = await listProjectsForMentor(name);
      setProjects(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('vs_faculty_mentor_name') : null;
    if (saved) {
      setMentorName(saved);
      setSubmittedName(saved);
      load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLookup() {
    const name = mentorName.trim();
    if (!name) return;
    setSubmittedName(name);
    localStorage.setItem('vs_faculty_mentor_name', name);
    load(name);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <PageHeader
        title="Project Tracker"
        description="Review the student projects you're mentoring — leave remarks and approve final submissions."
        icon={<ClipboardList size={22} />}
      />

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-semibold text-content mb-1.5">Your Name (as entered on project phases)</label>
            <input
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="E.g. Dr. Pushpendra Kumar"
              className="w-full px-4 py-2.5 rounded-xl border border-line text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <Button onClick={handleLookup} loading={loading}>Find My Projects</Button>
        </div>
      </Card>

      {error && <p className="text-sm text-danger">{error}</p>}

      {submittedName && !loading && (
        projects.length === 0 ? (
          <Card className="py-12 text-center border-dashed border-2 bg-surface-2/30">
            <p className="text-sm text-muted">No projects found where &quot;{submittedName}&quot; is recorded as a mentor.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <MentorProjectCard key={project.id} project={project} mentorName={submittedName} onChanged={() => load(submittedName)} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function MentorProjectCard({
  project,
  mentorName,
  onChanged,
}: {
  project: TeamProject & { team: { id: string; name: string; domain: string | null } };
  mentorName: string;
  onChanged: () => void;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [deciding, setDeciding] = useState(false);

  const sortedPhases = [...project.phases].sort((a, b) => a.order - b.order);

  async function handleSendRemark() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await addRemark(project.teamId, mentorName, message.trim());
      setMessage('');
      onChanged();
    } catch {
      // surfaced via onChanged() no-op; keep it simple, the input stays populated to retry
    } finally {
      setSending(false);
    }
  }

  async function handleDecision(approve: boolean) {
    setDeciding(true);
    try {
      await approveProject(project.teamId, mentorName, approve);
      onChanged();
    } finally {
      setDeciding(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">{project.team.name}</p>
          <h3 className="font-black text-content text-lg tracking-tight">{project.name}</h3>
          <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-content-2 hover:text-brand transition mt-1">
            <ExternalLink size={12} /> Repo
          </a>
        </div>
        <Badge tone={project.status === 'approved' ? 'green' : project.status === 'rejected' ? 'red' : project.status === 'pending_approval' ? 'blue' : 'gray'}>
          {project.status === 'in_progress' ? 'In Progress' : project.status === 'pending_approval' ? 'Awaiting Your Approval' : project.status === 'approved' ? 'Approved' : 'Sent Back'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        {sortedPhases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-2 text-sm">
            {phase.status === 'completed' ? (
              <CheckCircle2 size={16} className="text-success flex-shrink-0" />
            ) : phase.status === 'in_progress' ? (
              <Clock size={16} className="text-warning flex-shrink-0" />
            ) : (
              <Circle size={16} className="text-line-strong flex-shrink-0" />
            )}
            <span className="text-content-2">{phase.name}</span>
          </div>
        ))}
      </div>

      {project.deployedLink && (
        <a href={project.deployedLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline mb-4">
          <ExternalLink size={14} /> View deployed project
        </a>
      )}

      {project.status === 'pending_approval' && (
        <div className="flex gap-3 mb-4">
          <Button icon={ShieldCheck} loading={deciding} onClick={() => handleDecision(true)} className="bg-success hover:bg-success-600 text-white border-0">
            Approve Final Submission
          </Button>
          <Button variant="secondary" icon={ShieldX} disabled={deciding} onClick={() => handleDecision(false)} className="text-danger hover:bg-danger/10 border-danger/20">
            Send Back
          </Button>
        </div>
      )}

      <div className="border-t border-line/50 pt-4">
        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Remarks to the team</p>
        {project.remarks.length > 0 && (
          <div className="space-y-2 mb-3">
            {project.remarks.map((r) => (
              <div key={r.id} className="text-sm bg-surface-2/50 border border-line rounded-xl p-3">
                <p className="text-content-2">{r.message}</p>
                <p className="text-xs text-muted mt-1">— {r.authorName}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRemark()}
            placeholder="Leave a note for the whole team…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-line text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <Button icon={Send} loading={sending} onClick={handleSendRemark}>Send</Button>
        </div>
      </div>
    </Card>
  );
}
