const fs = require('fs');
const content = fs.readFileSync('app/api/spi/recalculate/route.ts', 'utf8');
const resolved = content.replace(/<<<<<<< HEAD[\s\S]*?=======\n([\s\S]*?)>>>>>>> [^\n]+/g, (match, incoming) => {
  return incoming; // Wait, let me check what to do
});
