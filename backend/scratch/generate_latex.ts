import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Copy of buildJakeResumeFromAdvisor and its dependencies
function escapeLatex(text: string): string {
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

function buildJakeResumeFromAdvisor(resumeJson: any, student: any): string {
  const github = student.codingProfile?.github ?? '';
  const linkedin = student.codingProfile?.linkedinUrl ?? '';
  const leetcode = student.codingProfile?.leetcode ?? '';

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

  // Summary section
  if (resumeJson.summary) {
    tex += `
%-----------SUMMARY-----------
\\section{Summary}
${safe(resumeJson.summary)}
\\vspace{5pt}
`;
  }

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
  if (resumeJson.matchedSkills && resumeJson.matchedSkills.length > 0) {
    tex += `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Matched Skills}{: ${safe(resumeJson.matchedSkills.join(', '))}}
    }}
 \\end{itemize}
`;
  }

  // Experience section
  if (resumeJson.experience && resumeJson.experience.length > 0) {
    tex += `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`;
    for (const exp of resumeJson.experience) {
      tex += `
    \\resumeSubheading
      {${safe(exp.title)}}{}{}
      {}{}
`;
      if (exp.bullets && exp.bullets.length > 0) {
        tex += `      \\resumeItemListStart\n`;
        for (const bullet of exp.bullets) {
          tex += `        \\resumeItem{${safe(bullet)}}\n`;
        }
        tex += `      \\resumeItemListEnd\n`;
      }
    }
    tex += `  \\resumeSubHeadingListEnd\n`;
  }

  // Projects section
  if (resumeJson.projects && resumeJson.projects.length > 0) {
    tex += `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`;
    for (const proj of resumeJson.projects) {
      tex += `
      \\resumeProjectHeading
          {\\textbf{${safe(proj.title)}}}{}
`;
      if (proj.bullets && proj.bullets.length > 0) {
        tex += `          \\resumeItemListStart\n`;
        for (const bullet of proj.bullets) {
          tex += `            \\resumeItem{${safe(bullet)}}\n`;
        }
        tex += `          \\resumeItemListEnd\n`;
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

async function main() {
  const universityId = "202401100200243";
  
  const student = await prisma.student.findUnique({
    where: { universityId },
    include: {
      codingProfile: true,
      certifications: true,
      extracurriculars: true,
      hackathons: true,
      internships: true,
    }
  });

  const latestVersion = await prisma.resumeVersion.findFirst({
    where: { resumeRequest: { universityId } },
    orderBy: { createdAt: 'desc' }
  });

  if (!latestVersion) {
    console.log("No AI generated resume version found!");
    return;
  }

  const tex = buildJakeResumeFromAdvisor(latestVersion.resumeJson, student);
  console.log("\n======================== LATEX OUTPUT ========================\n");
  console.log(tex);
  console.log("\n==============================================================\n");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
