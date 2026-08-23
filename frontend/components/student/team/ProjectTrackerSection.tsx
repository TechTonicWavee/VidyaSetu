'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, Plus, Loader2, MessageSquare, ShieldCheck, ShieldAlert } from 'lucide-react';
import getInitials from '@/lib/shared/getInitials';
import { useToast } from '@/components/shared/ToastContext';
import { ApiError } from '@/lib/shared/api/client';
import { Card, Button, Badge } from '@/components/shared/ui';
import Modal from '@/components/shared/ui/Modal';
import {
  getProject,
  createProject,
  setMemberRole,
  addPhase,
  updatePhaseStatus,
  addTask,
  updateTaskStatus,
  type TeamProject,
} from '@/lib/student/api/projectTracker';
import type { Team } from '@/lib/student/api/teams';

const STATUS_LABEL: Record<TeamProject['status'], string> = {
  in_progress: 'In Progress',
  pending_approval: 'Awaiting Mentor Approval',
  approved: 'Approved',
  rejected: 'Sent Back by Mentor',
};

export default function ProjectTrackerSection({
  team,
  isLeader,
  myUniversityId,
}: {
  team: Team;
  isLeader: boolean;
  myUniversityId?: string;
}) {
  const { addToast } = useToast();
  const [project, setProject] = useState<TeamProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectMentorName, setProjectMentorName] = useState('');
  const [projectGithubLink, setProjectGithubLink] = useState('');
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [completeModal, setCompleteModal] = useState<{ phaseId: string } | null>(null);

  async function load() {
    try {
      const data = await getProject(team.id);
      setProject(data);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to load project.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.id]);

  async function handleCreateProject() {
    if (!projectName.trim() || !projectMentorName.trim() || !projectGithubLink.trim()) return;
    setCreating(true);
    try {
      const created = await createProject(team.id, {
        name: projectName.trim(),
        mentorName: projectMentorName.trim(),
        githubLink: projectGithubLink.trim(),
      });
      setProject(created);
      addToast('Project created — add phases to start tracking progress.', 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to create project.', 'error');
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <div className="h-40 bg-surface-2 rounded-2xl border border-line animate-pulse" />;
  }

  if (!project) {
    if (!isLeader) {
      return (
        <Card className="text-center py-10 border-dashed border-2 bg-surface-2/30">
          <p className="text-sm text-muted">The team leader hasn&apos;t started a project tracker yet.</p>
        </Card>
      );
    }
    return (
      <Card>
        <h3 className="font-bold text-content text-base mb-1">Start a Project Tracker</h3>
        <p className="text-xs text-muted mb-4">The mentor and GitHub repo are set once here — phases below just track progress.</p>
        <div className="space-y-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="w-full px-4 py-2.5 rounded-xl border border-line text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={projectMentorName}
              onChange={(e) => setProjectMentorName(e.target.value)}
              placeholder="Mentor name (faculty monitoring this project)"
              className="w-full px-4 py-2.5 rounded-xl border border-line text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
            <input
              type="text"
              value={projectGithubLink}
              onChange={(e) => setProjectGithubLink(e.target.value)}
              placeholder="GitHub repo link"
              className="w-full px-4 py-2.5 rounded-xl border border-line text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <Button loading={creating} onClick={handleCreateProject}>Create Project</Button>
        </div>
      </Card>
    );
  }

  const sortedPhases = [...project.phases].sort((a, b) => a.order - b.order);
  const lastPhase = sortedPhases[sortedPhases.length - 1];

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <Card className={
        project.status === 'approved' ? 'bg-success-soft border-success/30' :
        project.status === 'rejected' ? 'bg-danger-soft border-danger/30' :
        project.status === 'pending_approval' ? 'bg-info-soft border-info/30' : 'border-line/40'
      }>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-content text-lg tracking-tight">{project.name}</h3>
            <p className="text-xs text-muted mt-1">Mentor: {project.mentorName}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-content-2 hover:text-brand transition">
                <ExternalLink size={12} /> Repo
              </a>
              {project.deployedLink && (
                <a href={project.deployedLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                  <ExternalLink size={12} /> {project.deployedLink}
                </a>
              )}
            </div>
          </div>
          <Badge tone={project.status === 'approved' ? 'green' : project.status === 'rejected' ? 'red' : project.status === 'pending_approval' ? 'blue' : 'gray'}>
            {project.status === 'approved' ? <ShieldCheck size={13} className="mr-1 inline" /> : project.status === 'rejected' ? <ShieldAlert size={13} className="mr-1 inline" /> : null}
            {STATUS_LABEL[project.status]}
          </Badge>
        </div>
      </Card>

      {/* Member roles */}
      <Card>
        <h3 className="font-bold text-content text-base mb-4">Roles &amp; Work Division</h3>
        <div className="space-y-3">
          {team.members.map((m) => {
            const existing = project.roles.find((r) => r.universityId === m.universityId);
            return (
              <MemberRoleRow
                key={m.universityId}
                name={m.student.fullName}
                universityId={m.universityId}
                initialRole={existing?.role ?? ''}
                initialWork={existing?.work ?? ''}
                editable={isLeader}
                onSave={async (role, work) => {
                  try {
                    const updated = await setMemberRole(team.id, m.universityId, { role, work });
                    setProject(updated);
                    addToast('Role updated.', 'success');
                  } catch (err) {
                    addToast(err instanceof ApiError ? err.message : 'Failed to update role.', 'error');
                  }
                }}
              />
            );
          })}
        </div>
      </Card>

      {/* Phases — Amazon-order-style tracker */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-content text-base">Phases</h3>
          {isLeader && (
            <Button size="sm" icon={Plus} onClick={() => setShowAddPhase(true)}>Add Phase</Button>
          )}
        </div>

        {sortedPhases.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No phases yet — add the first one to start tracking.</p>
        ) : (
          <div className="space-y-0">
            {sortedPhases.map((phase, i) => (
              <div key={phase.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {phase.status === 'completed' ? (
                    <CheckCircle2 size={22} className="text-success flex-shrink-0" />
                  ) : phase.status === 'in_progress' ? (
                    <Clock size={22} className="text-warning flex-shrink-0" />
                  ) : (
                    <Circle size={22} className="text-line-strong flex-shrink-0" />
                  )}
                  {i < sortedPhases.length - 1 && <div className={`w-0.5 flex-1 my-1 ${phase.status === 'completed' ? 'bg-success' : 'bg-line'}`} style={{ minHeight: 32 }} />}
                </div>
                <div className="flex-1 pb-6 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-content text-sm">{phase.name}</p>
                    <Badge tone={phase.status === 'completed' ? 'green' : phase.status === 'in_progress' ? 'yellow' : 'gray'} className="text-[10px]">
                      {phase.status === 'completed' ? 'Completed' : phase.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                  {phase.memberIds.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {phase.memberIds.map((id) => {
                        const member = team.members.find((m) => m.universityId === id);
                        if (!member) return null;
                        return (
                          <div
                            key={id}
                            title={member.student.fullName}
                            className="w-6 h-6 rounded-full bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                          >
                            {getInitials(member.student.fullName)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {phase.deployedLink && (
                    <a href={phase.deployedLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-content-2 hover:text-brand transition mt-2">
                      <ExternalLink size={13} /> Deployed
                    </a>
                  )}
                  {isLeader && phase.status !== 'completed' && (
                    <div className="flex gap-2 mt-3">
                      {phase.status === 'pending' && (
                        <Button size="sm" variant="secondary" onClick={async () => {
                          try {
                            setProject(await updatePhaseStatus(team.id, phase.id, { status: 'in_progress' }));
                          } catch (err) {
                            addToast(err instanceof ApiError ? err.message : 'Failed to update phase.', 'error');
                          }
                        }}>
                          Start Phase
                        </Button>
                      )}
                      <Button size="sm" onClick={async () => {
                        const isLast = lastPhase?.id === phase.id;
                        if (isLast && !project.deployedLink) {
                          setCompleteModal({ phaseId: phase.id });
                          return;
                        }
                        try {
                          setProject(await updatePhaseStatus(team.id, phase.id, { status: 'completed' }));
                          addToast('Phase marked complete.', 'success');
                        } catch (err) {
                          addToast(err instanceof ApiError ? err.message : 'Failed to update phase.', 'error');
                        }
                      }}>
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-content text-base">Tasks</h3>
          {isLeader && <Button size="sm" icon={Plus} onClick={() => setShowAssignTask(true)}>Assign Task</Button>}
        </div>
        {project.tasks.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                canUpdate={task.assignedTo === myUniversityId}
                onUpdate={async (status, statusNote) => {
                  try {
                    setProject(await updateTaskStatus(team.id, task.id, { status, statusNote }));
                  } catch (err) {
                    addToast(err instanceof ApiError ? err.message : 'Failed to update task.', 'error');
                  }
                }}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Mentor remarks */}
      <Card>
        <h3 className="font-bold text-content text-base mb-4 flex items-center gap-2">
          <MessageSquare size={16} className="text-brand" /> Mentor Remarks
        </h3>
        {project.remarks.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">No remarks from your mentor yet.</p>
        ) : (
          <div className="space-y-3">
            {project.remarks.map((r) => (
              <div key={r.id} className="border border-line rounded-xl p-4 bg-surface-2/50">
                <p className="text-sm text-content-2">{r.message}</p>
                <p className="text-xs text-muted mt-2 font-semibold">— {r.authorName}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showAddPhase && (
        <AddPhaseModal
          nextOrder={sortedPhases.length + 1}
          members={team.members}
          onClose={() => setShowAddPhase(false)}
          onAdd={async (input) => {
            try {
              setProject(await addPhase(team.id, input));
              setShowAddPhase(false);
              addToast('Phase added.', 'success');
            } catch (err) {
              addToast(err instanceof ApiError ? err.message : 'Failed to add phase.', 'error');
            }
          }}
        />
      )}

      {showAssignTask && (
        <AssignTaskModal
          members={team.members}
          onClose={() => setShowAssignTask(false)}
          onAssign={async (input) => {
            try {
              setProject(await addTask(team.id, input));
              setShowAssignTask(false);
              addToast('Task assigned.', 'success');
            } catch (err) {
              addToast(err instanceof ApiError ? err.message : 'Failed to assign task.', 'error');
            }
          }}
        />
      )}

      {completeModal && (
        <CompleteLastPhaseModal
          onClose={() => setCompleteModal(null)}
          onSubmit={async (deployedLink) => {
            try {
              setProject(await updatePhaseStatus(team.id, completeModal.phaseId, { status: 'completed', deployedLink }));
              setCompleteModal(null);
              addToast('Final phase complete — project sent for mentor approval.', 'success');
            } catch (err) {
              addToast(err instanceof ApiError ? err.message : 'Failed to complete phase.', 'error');
            }
          }}
        />
      )}
    </div>
  );
}

function MemberRoleRow({
  name,
  universityId,
  initialRole,
  initialWork,
  editable,
  onSave,
}: {
  name: string;
  universityId: string;
  initialRole: string;
  initialWork: string;
  editable: boolean;
  onSave: (role: string, work: string) => Promise<void>;
}) {
  const [role, setRole] = useState(initialRole);
  const [work, setWork] = useState(initialWork);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div className="border border-line rounded-xl p-3 bg-surface-2/40 flex flex-wrap items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
        {getInitials(name)}
      </div>
      <p className="font-semibold text-content text-sm w-32 flex-shrink-0 truncate" title={universityId}>{name}</p>
      {editable ? (
        <>
          <input
            value={role}
            onChange={(e) => { setRole(e.target.value); setDirty(true); }}
            placeholder="Role (e.g. Frontend Dev)"
            className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg border border-line text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <input
            value={work}
            onChange={(e) => { setWork(e.target.value); setDirty(true); }}
            placeholder="Work assigned"
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border border-line text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button size="sm" variant="secondary" disabled={!dirty} loading={saving} onClick={async () => {
            setSaving(true);
            await onSave(role, work);
            setSaving(false);
            setDirty(false);
          }}>
            Save
          </Button>
        </>
      ) : (
        <div className="flex-1 text-xs text-muted">
          {role || work ? <>{role && <span className="font-semibold text-content-2">{role}</span>}{role && work && ' · '}{work}</> : 'No role assigned yet'}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  canUpdate,
  onUpdate,
}: {
  task: TeamProject['tasks'][number];
  canUpdate: boolean;
  onUpdate: (status: 'done' | 'not_done', statusNote?: string) => Promise<void>;
}) {
  const [note, setNote] = useState(task.statusNote ?? '');
  const [saving, setSaving] = useState(false);

  return (
    <div className="border border-line rounded-xl p-4 bg-surface-2/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-content text-sm">{task.title}</p>
          <p className="text-xs text-muted mt-0.5">Assigned to {task.assignee.fullName}</p>
          {task.description && <p className="text-xs text-content-2 mt-1.5">{task.description}</p>}
        </div>
        <Badge tone={task.status === 'done' ? 'green' : 'gray'} className="flex-shrink-0">{task.status === 'done' ? 'Done' : 'Not Done'}</Badge>
      </div>
      {canUpdate && (
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Status note (what's the current state?)"
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-line text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button size="sm" loading={saving} onClick={async () => {
            setSaving(true);
            await onUpdate('done', note);
            setSaving(false);
          }}>
            Mark Done
          </Button>
          <Button size="sm" variant="secondary" loading={saving} onClick={async () => {
            setSaving(true);
            await onUpdate('not_done', note);
            setSaving(false);
          }}>
            Mark Not Done
          </Button>
        </div>
      )}
      {task.statusNote && !canUpdate && <p className="text-xs text-muted italic mt-2">&quot;{task.statusNote}&quot;</p>}
    </div>
  );
}

function AddPhaseModal({
  nextOrder,
  members,
  onClose,
  onAdd,
}: {
  nextOrder: number;
  members: Team['members'];
  onClose: () => void;
  onAdd: (input: { name: string; order: number; memberIds: string[] }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [order, setOrder] = useState(nextOrder);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleMember(id: string) {
    setMemberIds((list) => (list.includes(id) ? list.filter((m) => m !== id) : [...list, id]));
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Phase name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAdd({ name: name.trim(), order, memberIds });
    } catch {
      setError('Failed to add phase.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Add a Phase"
      width="md"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Add Phase
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phase Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="E.g. Design, Prototype, Frontend, Integration" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order (when this phase runs)</label>
          <input type="number" min={1} value={order} onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Members Involved</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <button
                key={m.universityId}
                type="button"
                onClick={() => toggleMember(m.universityId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  memberIds.includes(m.universityId) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {m.student.fullName}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Modal>
  );
}

function AssignTaskModal({
  members,
  onClose,
  onAssign,
}: {
  members: Team['members'];
  onClose: () => void;
  onAssign: (input: { assignedTo: string; title: string; description?: string }) => Promise<void>;
}) {
  const [assignedTo, setAssignedTo] = useState(members[0]?.universityId ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!assignedTo || !title.trim()) {
      setError('Choose a teammate and enter a task title.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAssign({ assignedTo, title: title.trim(), description: description.trim() || undefined });
    } catch {
      setError('Failed to assign task.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Assign a Task"
      width="md"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Assign
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teammate *</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
            {members.map((m) => <option key={m.universityId} value={m.universityId}>{m.student.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Task Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Build the login screen" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none" />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Modal>
  );
}

function CompleteLastPhaseModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (deployedLink: string) => Promise<void>;
}) {
  const [deployedLink, setDeployedLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!deployedLink.trim()) {
      setError('The deployed link is required to complete the final phase.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(deployedLink.trim());
    } catch {
      setError('Failed to complete phase.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Final Phase — Deployed Link"
      width="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Complete &amp; Submit
          </button>
        </div>
      }
    >
      <p className="text-sm text-muted mb-4">This is the last phase — completing it submits the project for mentor approval. Where is it deployed?</p>
      <input value={deployedLink} onChange={(e) => setDeployedLink(e.target.value)} placeholder="https://your-project.vercel.app" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Modal>
  );
}
