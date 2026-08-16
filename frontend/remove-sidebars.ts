const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync(path.join(__dirname, 'app/student/**/page.js'));

files.forEach((file: string) => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Regex to match the entire aside block. 
  // We look for <aside... and </aside>
  // We use [\s\S]*? to match across newlines lazily.
  const regex = /(?:\{\/\* ══════════════════════════════════\s*SIDEBAR\s*══════════════════════════════════ \*\/\}\s*)?<aside[\s\S]*?<\/aside>/;
  
  if (regex.test(content)) {
    console.log('Removing sidebar from:', file);
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
  }
});
