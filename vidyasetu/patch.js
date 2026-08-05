const fs = require('fs');

function resolveRoute() {
  const file = 'app/api/spi/recalculate/route.ts';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [^\n]+\n/g, '$1');
  fs.writeFileSync(file, content);
}

function resolvePage() {
  const file = 'app/student/profile/edit/page.tsx';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<<<<<<< HEAD\n[\s\S]*?=======\n([\s\S]*?)>>>>>>> [^\n]+\n/g, '$1');
  fs.writeFileSync(file, content);
}

resolveRoute();
resolvePage();
