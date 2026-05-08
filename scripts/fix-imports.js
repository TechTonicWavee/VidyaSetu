const fs = require('fs')
const path = require('path')

function fixImports(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath)
    } else if (file === 'page.js') {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // Fix missing newlines between imports
      content = content.replace(/from 'react' import/g, "from 'react'\nimport")
      content = content.replace(/from 'next\/navigation' import/g, "from 'next/navigation'\nimport")
      content = content.replace(/from 'next\/navigation'\s+import/g, "from 'next/navigation'\nimport")
      content = content.replace(/from 'react'\s+import/g, "from 'react'\nimport")

      // Fix `}, User }, Award }` syntax issue in lucide-react import
      const lucideRegex = /import\s+\{([\s\S]*?)\}\s+from\s+'lucide-react'/
      const match = content.match(lucideRegex)
      if (match) {
        let iconsStr = match[1]
        // remove all '}' characters from inside the icons list
        iconsStr = iconsStr.replace(/\}/g, '')
        let icons = iconsStr.split(',').map(s => s.trim()).filter(Boolean)
        icons = [...new Set(icons)] // unique
        content = content.replace(match[0], `import { ${icons.join(', ')} } from 'lucide-react'`)
      }
      
      fs.writeFileSync(fullPath, content, 'utf8')
    }
  }
}

fixImports(path.join(__dirname, '../app/dashboard'))
fixImports(path.join(__dirname, '../app/ai-advisor'))
console.log('Fixed imports')
