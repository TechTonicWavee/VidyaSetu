const fs = require('fs');
let content = fs.readFileSync('c:/Users/workw/Documents/ProjectsFromJune/VidyaSetu/frontend/app/faculty/student/profile/page.tsx', 'utf8');

// The regex will match `<div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">` down to `<main className="flex-1 overflow-y-auto bg-[#F3F4F6]">`
content = content.replace(/<div className="flex h-screen bg-\[#F3F4F6\] overflow-hidden font-sans\">[\s\S]*?<main className=\"flex-1 overflow-y-auto bg-\[#F3F4F6\]\">/, '<div className="space-y-6 relative h-full">');

fs.writeFileSync('c:/Users/workw/Documents/ProjectsFromJune/VidyaSetu/frontend/app/faculty/student/profile/page.tsx', content);
console.log('Fixed top layout');
