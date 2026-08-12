const fs = require('fs');
const file = 'lib/upload/cloudinaryClient.ts';
let content = fs.readFileSync(file, 'utf8');

// The conflict in uploadToLocal
content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> [^\n]+\n/g, '$1');

fs.writeFileSync(file, content);
