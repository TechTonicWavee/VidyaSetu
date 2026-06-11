const fs = require('fs')
const path = require('path')

function replaceInDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath)
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let originalContent = content
      
      content = content.replace(/Arman Singh/g, 'Priyanshu Raj')
      content = content.replace(/ARMAN SINGH/g, 'PRIYANSHU RAJ')
      content = content.replace(/Arman's/g, "Priyanshu's")
      content = content.replace(/Arman/g, 'Priyanshu')
      
      // Initials replacement (AS -> PR) specifically where it represents initials
      // We need to be careful not to replace 'AS' in normal words like 'HAS', 'WAS'
      content = content.replace(/>AS</g, '>PR<')
      content = content.replace(/'AS'/g, "'PR'")
      content = content.replace(/"AS"/g, '"PR"')

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log(`Updated ${fullPath}`)
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../app'))
