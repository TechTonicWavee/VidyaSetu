'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Printer, Eye, Palette, Link2, Mail, Phone, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { authedFetch } from '@/lib/api/sameOriginFetch';
import { PageHeader, Card, Button, Badge, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface ProfileResp {
  fullName: string;
  branch: string | null;
  year: number | null;
  section: string | null;
  email: string | null;
  phone: string | null;
  codingProfile: { github: string | null; linkedinUrl: string | null; leetcode: string | null } | null;
  projects: { id: string; title: string; description: string | null; techStack: string[] }[];
  certifications: { name?: string; platform?: string; skills?: string[] }[];
  extracurriculars: { society: string | null; role: string | null; achievement: string | null }[];
}

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'extra', label: 'Extracurriculars' },
];

const ACCENTS = ['#5B21B6', '#2563EB', '#0D9488', '#DB2777', '#111827'];

// Sample content shown when the profile API/DB is unavailable, so the builder
// is always usable and printable.
const SAMPLE: ProfileResp = {
  fullName: 'Your Name',
  branch: 'Computer Science & Engineering',
  year: 3,
  section: 'A',
  email: 'you@kiet.edu',
  phone: '+91 90000 00000',
  codingProfile: { github: 'your-github', linkedinUrl: 'https://linkedin.com/in/you', leetcode: 'your-lc' },
  projects: [
    { id: 'p1', title: 'VidyaSetu Portal', description: 'Full-stack student ERP with SPI analytics and team formation.', techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'] },
    { id: 'p2', title: 'Realtime Chat App', description: 'WebSocket chat with auth and presence.', techStack: ['React', 'Node', 'Socket.IO'] },
  ],
  certifications: [
    { name: 'Cloud Practitioner', platform: 'AWS', skills: ['Cloud', 'EC2', 'S3'] },
    { name: 'Meta Frontend', platform: 'Coursera', skills: ['React', 'CSS'] },
  ],
  extracurriculars: [
    { society: 'Coding Club', role: 'Core Member', achievement: 'Organised 4 workshops for 200+ students' },
  ],
};

export default function ResumePage() {
  const { student } = useAuth();
  const [data, setData] = useState<ProfileResp | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, true])),
  );
  const [accent, setAccent] = useState(ACCENTS[0]);

  useEffect(() => {
    if (!student?.universityId) {
      setData(SAMPLE);
      return;
    }
    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.student) setData(d.student as ProfileResp);
        else setData(SAMPLE);
      })
      .catch(() => setData(SAMPLE));
  }, [student?.universityId]);

  const skills = useMemo(() => {
    if (!data) return [];
    const fromCerts = data.certifications?.flatMap((c) => c.skills ?? []) ?? [];
    const fromProjects = data.projects?.flatMap((p) => p.techStack ?? []) ?? [];
    return Array.from(new Set([...fromProjects, ...fromCerts])).slice(0, 18);
  }, [data]);

  const completeness = useMemo(() => {
    if (!data) return 0;
    let score = 40;
    if (data.projects?.length) score += 20;
    if (data.certifications?.length) score += 15;
    if (skills.length) score += 15;
    if (data.extracurriculars?.length) score += 10;
    return Math.min(100, score);
  }, [data, skills]);

  const d = data ?? SAMPLE;

  return (
    <div>
      <PageHeader
        title="Resume Builder"
        description="Built from your verified profile — toggle sections, pick an accent, then export to PDF."
        icon={<FileText size={22} />}
        actions={<Button icon={Printer} onClick={() => window.print()}>Download / Print</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Controls */}
        <div className="space-y-4 no-print">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-content flex items-center gap-2"><Eye size={16} /> Sections</h3>
            </div>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label key={s.id} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-content-2">{s.label}</span>
                  <input
                    type="checkbox"
                    checked={enabled[s.id]}
                    onChange={() => setEnabled((e) => ({ ...e, [s.id]: !e[s.id] }))}
                    className="w-4 h-4 accent-[var(--brand)]"
                  />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-content flex items-center gap-2 mb-3"><Palette size={16} /> Accent</h3>
            <div className="flex gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  aria-label={`Accent ${c}`}
                  className={cn('w-8 h-8 rounded-full border-2 transition-transform', accent === c ? 'border-content scale-110' : 'border-transparent')}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-content-2 font-medium">Completeness</span>
              <span className="font-bold text-content">{completeness}%</span>
            </div>
            <ProgressBar value={completeness} tone={completeness >= 80 ? 'green' : 'amber'} />
            <p className="text-xs text-muted mt-2">Add projects, certifications and activities to strengthen your resume.</p>
          </Card>
        </div>

        {/* Preview */}
        <Card padded={false} className="overflow-hidden">
          <div id="resume-print" className="bg-white text-[#111827] p-8 sm:p-10" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <div className="border-b-2 pb-4" style={{ borderColor: accent }}>
              <h1 className="text-3xl font-bold" style={{ color: accent }}>{d.fullName}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {[d.branch, d.year ? `${d.year}rd Year` : null, d.section ? `Section ${d.section}` : null].filter(Boolean).join(' · ')}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                {d.email && <span className="flex items-center gap-1"><Mail size={12} /> {d.email}</span>}
                {d.phone && <span className="flex items-center gap-1"><Phone size={12} /> {d.phone}</span>}
                {d.codingProfile?.github && <span className="flex items-center gap-1"><Link2 size={12} /> {d.codingProfile.github}</span>}
                {d.codingProfile?.linkedinUrl && <span className="flex items-center gap-1"><Link2 size={12} /> LinkedIn</span>}
                {d.codingProfile?.leetcode && <span className="flex items-center gap-1"><Globe size={12} /> {d.codingProfile.leetcode}</span>}
              </div>
            </div>

            {enabled.summary && (
              <ResumeSection title="Summary" accent={accent}>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Motivated {d.branch ?? 'engineering'} student with hands-on project experience and a consistent record of
                  building and shipping software. Seeking opportunities to apply and grow full-stack and problem-solving skills.
                </p>
              </ResumeSection>
            )}

            {enabled.skills && skills.length > 0 && (
              <ResumeSection title="Technical Skills" accent={accent}>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: accent, color: accent }}>{s}</span>
                  ))}
                </div>
              </ResumeSection>
            )}

            {enabled.projects && d.projects?.length > 0 && (
              <ResumeSection title="Projects" accent={accent}>
                <div className="space-y-3">
                  {d.projects.map((p) => (
                    <div key={p.id}>
                      <p className="font-semibold text-sm text-gray-800">{p.title}</p>
                      {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                      {p.techStack?.length > 0 && <p className="text-xs text-gray-500 mt-0.5">{p.techStack.join(' · ')}</p>}
                    </div>
                  ))}
                </div>
              </ResumeSection>
            )}

            {enabled.certifications && d.certifications?.length > 0 && (
              <ResumeSection title="Certifications" accent={accent}>
                <ul className="space-y-1">
                  {d.certifications.map((c, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      <span className="font-medium">{c.name}</span>{c.platform ? ` — ${c.platform}` : ''}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            )}

            {enabled.extra && d.extracurriculars?.length > 0 && (
              <ResumeSection title="Extracurriculars" accent={accent}>
                <ul className="space-y-1">
                  {d.extracurriculars.map((e, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      <span className="font-medium">{e.role}</span>{e.society ? `, ${e.society}` : ''}
                      {e.achievement ? ` — ${e.achievement}` : ''}
                    </li>
                  ))}
                </ul>
              </ResumeSection>
            )}
          </div>
        </Card>
      </div>

      {!student?.universityId && (
        <p className="text-xs text-muted mt-3 no-print">
          <Badge tone="amber">Sample</Badge>{' '}
          Showing sample content — your real profile data will populate this once you&apos;re signed in with a submitted profile.
        </p>
      )}
    </div>
  );
}

function ResumeSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: accent }}>{title}</h2>
      {children}
    </div>
  );
}
