/**
 * Jake's Resume — LaTeX Template Builder
 *
 * Generates a complete LaTeX string from student profile data.
 * Decision: We use string concatenation instead of a template engine
 * because LaTeX has complex escaping rules that generic template engines
 * don't handle well. See decision.md for more details.
 */

interface Project {
  id: string;
  title: string;
  description?: string | null;
  techStack?: string[];
}

interface Certification {
  name?: string;
  platform?: string;
  skills?: string[];
}

interface Extracurricular {
  society?: string | null;
  role?: string | null;
  achievement?: string | null;
}

interface Internship {
  company?: string | null;
  role?: string | null;
  duration?: string | null;
  description?: string | null;
}

interface Hackathon {
  name?: string | null;
  result?: string | null;
  year?: number | null;
}

export interface StudentData {
  fullName: string;
  branch?: string | null;
  year?: number | null;
  section?: string | null;
  email?: string | null;
  phone?: string | null;
  codingProfile?: {
    github?: string | null;
    linkedinUrl?: string | null;
    leetcode?: string | null;
    codechef?: string | null;
  } | null;
  projects?: Project[];
  certifications?: Certification[];
  extracurriculars?: Extracurricular[];
  internships?: Internship[];
  hackathons?: Hackathon[];
}

/**
 * Escapes special LaTeX characters in a string so they render correctly.
 * Decision 4 in decision.md: user input MUST be escaped.
 */
export function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function safe(text: string | null | undefined): string {
  if (!text) return '';
  return escapeLatex(text);
}

function ordinalYear(year: number | null | undefined): string {
  if (!year) return '';
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = year % 100;
  return year + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]) + ' Year';
}

/**
 * Builds a complete Jake-style LaTeX resume string.
 * This is a large string builder that conditionally includes sections
 * based on whether the student has data for them.
 */
export function buildJakeResume(student: StudentData): string {
  const skills = Array.from(
    new Set([
      ...(student.projects?.flatMap((p) => p.techStack ?? []) ?? []),
      ...(student.certifications?.flatMap((c) => c.skills ?? []) ?? []),
    ])
  ).slice(0, 20);

  const github = student.codingProfile?.github ?? '';
  const linkedin = student.codingProfile?.linkedinUrl ?? '';
  const leetcode = student.codingProfile?.leetcode ?? '';

  // Build contact line
  const contactParts: string[] = [];
  if (student.phone) contactParts.push(safe(student.phone));
  if (student.email) contactParts.push(`\\href{mailto:${safe(student.email)}}{${safe(student.email)}}`);
  if (linkedin) contactParts.push(`\\href{${safe(linkedin)}}{LinkedIn}`);
  if (github) contactParts.push(`\\href{https://github.com/${safe(github)}}{GitHub}`);
  if (leetcode) contactParts.push(`\\href{https://leetcode.com/${safe(leetcode)}}{LeetCode}`);

  let tex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${safe(student.fullName)}} \\\\ \\vspace{1pt}
    \\small ${contactParts.join(' $|$ ')}
\\end{center}

`;

  // Education section
  tex += `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {KIET Group of Institutions}{Ghaziabad, UP}
      {${safe(student.branch ?? 'B.Tech')}${student.section ? `, Section ${safe(student.section)}` : ''}}{${ordinalYear(student.year)}}
  \\resumeSubHeadingListEnd
`;

  // Skills section
  if (skills.length > 0) {
    tex += `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages/Technologies}{: ${safe(skills.join(', '))}}
    }}
 \\end{itemize}
`;
  }

  // Internships
  if (student.internships && student.internships.length > 0) {
    tex += `
%-----------INTERNSHIPS-----------
\\section{Internships}
  \\resumeSubHeadingListStart
`;
    for (const intern of student.internships) {
      tex += `
    \\resumeSubheading
      {${safe(intern.company ?? 'Company')}}{${safe(intern.duration ?? '')}}
      {${safe(intern.role ?? 'Intern')}}{}
`;
      if (intern.description) {
        tex += `      \\resumeItemListStart
        \\resumeItem{${safe(intern.description)}}
      \\resumeItemListEnd
`;
      }
    }
    tex += `  \\resumeSubHeadingListEnd\n`;
  }

  // Projects
  if (student.projects && student.projects.length > 0) {
    tex += `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`;
    for (const proj of student.projects) {
      const techLine = proj.techStack && proj.techStack.length > 0
        ? `\\emph{${safe(proj.techStack.join(', '))}}`
        : '';
      tex += `
      \\resumeProjectHeading
          {\\textbf{${safe(proj.title)}} $|$ ${techLine}}{}
`;
      if (proj.description) {
        tex += `          \\resumeItemListStart
            \\resumeItem{${safe(proj.description)}}
          \\resumeItemListEnd
`;
      }
    }
    tex += `    \\resumeSubHeadingListEnd\n`;
  }

  // Certifications
  if (student.certifications && student.certifications.length > 0) {
    tex += `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
  \\resumeSubHeadingListStart
`;
    for (const cert of student.certifications) {
      tex += `    \\resumeSubItem{\\textbf{${safe(cert.name ?? 'Certification')}}${cert.platform ? ` -- ${safe(cert.platform)}` : ''}${cert.skills && cert.skills.length > 0 ? ` (${safe(cert.skills.join(', '))})` : ''}}\n`;
    }
    tex += `  \\resumeSubHeadingListEnd\n`;
  }

  // Hackathons
  if (student.hackathons && student.hackathons.length > 0) {
    tex += `
%-----------HACKATHONS-----------
\\section{Hackathons}
  \\resumeSubHeadingListStart
`;
    for (const hack of student.hackathons) {
      tex += `    \\resumeSubheading
      {${safe(hack.name ?? 'Hackathon')}}{${hack.year ? String(hack.year) : ''}}
      {${safe(hack.result ?? '')}}{}\n`;
    }
    tex += `  \\resumeSubHeadingListEnd\n`;
  }

  // Extracurriculars
  if (student.extracurriculars && student.extracurriculars.length > 0) {
    tex += `
%-----------EXTRACURRICULARS-----------
\\section{Extracurricular Activities}
  \\resumeSubHeadingListStart
`;
    for (const extra of student.extracurriculars) {
      tex += `    \\resumeSubheading
      {${safe(extra.role ?? 'Member')}}{${safe(extra.society ?? '')}}
      {${extra.achievement ? safe(extra.achievement) : ''}}{}\n`;
    }
    tex += `  \\resumeSubHeadingListEnd\n`;
  }

  tex += `\n%-------------------------------------------\n\\end{document}\n`;

  return tex;
}
